import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { InlineCodePipe } from '../pipes/inline-code.pipe';

@Component({
  selector: 'app-compare-list',
  imports: [RouterLink, InlineCodePipe],
  template: `
    <div class="max-w-4xl">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Compare Features</h1>
      <p class="text-gray-600 mb-8">
        Select a feature category to see how each harness implements it.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (feature of features; track feature.id) {
          <a
            [routerLink]="['/compare', feature.id]"
            class="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h2 class="font-semibold text-gray-900">{{ feature.name }}</h2>
            <p
              class="text-sm text-gray-600 mt-1"
              [innerHTML]="feature.description | inlineCode"
            ></p>
            <p class="text-xs text-gray-400 mt-2">{{ getImplCount(feature.id) }} implementations</p>
          </a>
        }
      </div>
    </div>
  `,
})
export class CompareListComponent {
  private dataService = inject(DataService);
  features = this.dataService.getFeatures();

  getImplCount(featureId: string): number {
    return this.dataService.getImplementationsForFeature(featureId).length;
  }
}
