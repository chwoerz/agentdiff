import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-feature-category-nav",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-64 border-r border-gray-200 bg-gray-50 p-4 min-h-screen">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Features
      </h2>
      <ul class="space-y-1">
        @for (feature of features; track feature.id) {
          <li>
            <a
              [routerLink]="['/compare', feature.id]"
              routerLinkActive="bg-blue-100 text-blue-800"
              class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {{ feature.name }}
              <span class="text-gray-400 text-xs ml-1">
                ({{ getImplCount(feature.id) }})
              </span>
            </a>
          </li>
        }
      </ul>
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">
        Harnesses
      </h2>
      <ul class="space-y-1">
        @for (harness of harnesses; track harness.id) {
          <li>
            <a
              [routerLink]="['/harness', harness.id]"
              routerLinkActive="bg-blue-100 text-blue-800"
              class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {{ harness.name }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class FeatureCategoryNavComponent {
  private dataService = inject(DataService);
  features = this.dataService.getFeatures();
  harnesses = this.dataService.getHarnesses();

  getImplCount(featureId: string): number {
    return this.dataService.getImplementationsForFeature(featureId).length;
  }
}
