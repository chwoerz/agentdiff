import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "../services/data.service";
import {
  Feature,
  ResolvedHarness,
  ResolvedHarnessImplementation,
} from "../models/data.models";
import { ImplementationCardComponent } from "../components/implementation-card.component";

interface FeatureGroup {
  feature: Feature;
  implementations: ResolvedHarnessImplementation[];
}

@Component({
  selector: "app-harness-profile",
  imports: [ImplementationCardComponent, RouterLink],
  template: `
    @if (harness) {
      <div class="max-w-4xl">
        <div class="mb-6 flex items-center gap-4">
          <img
            [src]="'assets/icons/' + harness.icon"
            [alt]="harness.name"
            class="w-10 h-10"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ harness.name }}</h1>
            <a
              [href]="harness.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              {{ harness.website }}
            </a>
          </div>
        </div>

        <!-- Platform tabs -->
        <div class="flex gap-2 mb-6 border-b border-gray-200">
          <button
            (click)="selectedPlatform = null"
            class="px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            [class]="selectedPlatform === null
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            All
          </button>
          @for (platform of harness.platforms; track platform.id) {
            <button
              (click)="selectedPlatform = platform.id"
              class="px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
              [class]="selectedPlatform === platform.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              {{ platform.name }}
            </button>
          }
        </div>

        <!-- Grouped implementations -->
        @for (group of filteredGroups; track group.feature.id) {
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              <a
                [routerLink]="['/compare', group.feature.id]"
                class="hover:text-blue-600"
              >
                {{ group.feature.name }}
              </a>
            </h2>
            <div class="space-y-2">
              @for (hi of group.implementations; track hi.implementation.id) {
                <app-implementation-card
                  [implementation]="hi.implementation"
                  [platforms]="resolvePlatformNames(hi.platforms)"
                  [notes]="hi.notes"
                />
              }
            </div>
          </div>
        }

        @if (filteredGroups.length === 0) {
          <p class="text-gray-500">
            No implementations available for this platform.
          </p>
        }
      </div>
    } @else {
      <p class="text-gray-500">Harness not found.</p>
    }
  `,
})
export class HarnessProfileComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private sub!: Subscription;
  harness: ResolvedHarness | null = null;
  groups: FeatureGroup[] = [];
  selectedPlatform: string | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const harnessId = params.get("harnessId");
      const platformId = params.get("platformId");
      this.selectedPlatform = platformId ?? null;
      this.harness = harnessId
        ? this.dataService.getHarness(harnessId)
        : null;
      this.buildGroups();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private buildGroups(): void {
    if (!this.harness) return;
    const features = this.dataService.getFeatures();

    const groupMap = new Map<string, ResolvedHarnessImplementation[]>();
    for (const hi of this.harness.implementations) {
      const featureId = hi.implementation.featureId;
      if (!groupMap.has(featureId)) {
        groupMap.set(featureId, []);
      }
      groupMap.get(featureId)!.push(hi);
    }

    this.groups = features
      .filter((f) => groupMap.has(f.id))
      .map((f) => ({
        feature: f,
        implementations: groupMap.get(f.id)!,
      }));
  }

  get filteredGroups(): FeatureGroup[] {
    if (!this.selectedPlatform) return this.groups;
    return this.groups
      .map((g) => ({
        ...g,
        implementations: g.implementations.filter((hi) =>
          hi.platforms.includes(this.selectedPlatform!)
        ),
      }))
      .filter((g) => g.implementations.length > 0);
  }

  resolvePlatformNames(platformIds: string[]): string[] {
    if (!this.harness) return platformIds;
    return platformIds.map((id) => {
      const p = this.harness!.platforms.find((pl) => pl.id === id);
      return p?.name ?? id;
    });
  }
}
