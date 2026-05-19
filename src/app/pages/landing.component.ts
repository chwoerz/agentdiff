import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-landing",
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-3">
          AgentDiff
        </h1>
        <p class="text-lg text-gray-600">
          Compare AI coding harnesses side by side. See which features each tool
          supports, how they differ across platforms, and find the equivalent of
          what you know in one tool across all others.
        </p>
      </div>

      <!-- Harness cards -->
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Harnesses</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        @for (harness of harnesses; track harness.id) {
          <a
            [routerLink]="['/harness', harness.id]"
            class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div class="flex items-center gap-3 mb-3">
              <img
                [src]="'assets/icons/' + harness.icon"
                [alt]="harness.name"
                class="w-8 h-8"
              />
              <h3 class="font-semibold text-gray-900">{{ harness.name }}</h3>
            </div>
            <p class="text-sm text-gray-500">
              {{ harness.platforms.length }} platforms &middot;
              {{ harness.implementations.length }} implementations
            </p>
          </a>
        }
      </div>

      <!-- Quick compare links -->
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Compare by Feature</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        @for (feature of features; track feature.id) {
          <a
            [routerLink]="['/compare', feature.id]"
            class="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span class="font-medium text-gray-900">{{ feature.name }}</span>
            <span class="text-sm text-gray-400">
              {{ getImplCount(feature.id) }} implementations &rarr;
            </span>
          </a>
        }
      </div>
    </div>
  `,
})
export class LandingComponent {
  private dataService = inject(DataService);
  harnesses = this.dataService.getHarnesses();
  features = this.dataService.getFeatures();

  getImplCount(featureId: string): number {
    return this.dataService.getImplementationsForFeature(featureId).length;
  }
}
