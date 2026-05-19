import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "../services/data.service";
import { ComparisonMatrix } from "../models/data.models";
import { ComparisonMatrixComponent } from "../components/comparison-matrix.component";

@Component({
  selector: "app-feature-detail",
  imports: [ComparisonMatrixComponent, RouterLink],
  template: `
    @if (matrix) {
      <div class="max-w-6xl">
        <div class="mb-6">
          <a routerLink="/compare" class="text-sm text-blue-600 hover:text-blue-800">
            &larr; All Features
          </a>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ matrix.feature.name }}
        </h1>
        <p class="text-gray-600 mb-8">{{ matrix.feature.description }}</p>
        <app-comparison-matrix [matrix]="matrix" />
      </div>
    } @else {
      <p class="text-gray-500">Feature not found.</p>
    }
  `,
})
export class FeatureDetailComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private sub!: Subscription;
  matrix: ComparisonMatrix | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const featureId = params.get("featureId");
      this.matrix = featureId
        ? this.dataService.getComparisonMatrix(featureId)
        : null;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
