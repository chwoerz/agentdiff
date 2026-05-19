import { Component, inject } from "@angular/core";
import { SlicePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DataService, SearchResults } from "../services/data.service";

@Component({
  selector: "app-search",
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <div class="relative">
      <input
        type="text"
        [(ngModel)]="query"
        (input)="onSearch()"
        (focus)="showResults = true"
        (blur)="onBlur()"
        placeholder="Search features, tools, harnesses..."
        class="w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      @if (showResults && query.length >= 2 && results) {
        <div class="absolute top-full mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          @if (results.features.length > 0) {
            <div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              Features
            </div>
            @for (f of results.features; track f.id) {
              <a
                [routerLink]="['/compare', f.id]"
                (mousedown)="$event.preventDefault()"
                (click)="clearSearch()"
                class="block px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span class="font-medium">{{ f.name }}</span>
                <span class="text-gray-500 ml-1">{{ f.description | slice:0:60 }}...</span>
              </a>
            }
          }

          @if (results.implementations.length > 0) {
            <div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              Implementations
            </div>
            @for (i of results.implementations; track i.id) {
              <a
                [routerLink]="['/compare', i.featureId]"
                (mousedown)="$event.preventDefault()"
                (click)="clearSearch()"
                class="block px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span class="font-medium">{{ i.name }}</span>
                <span class="text-gray-500 ml-1">{{ i.description | slice:0:60 }}...</span>
              </a>
            }
          }

          @if (results.harnesses.length > 0) {
            <div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              Harnesses
            </div>
            @for (h of results.harnesses; track h.id) {
              <a
                [routerLink]="['/harness', h.id]"
                (mousedown)="$event.preventDefault()"
                (click)="clearSearch()"
                class="block px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span class="font-medium">{{ h.name }}</span>
              </a>
            }
          }

          @if (results.features.length === 0 && results.implementations.length === 0 && results.harnesses.length === 0) {
            <div class="px-3 py-4 text-sm text-gray-500 text-center">
              No results found.
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SearchComponent {
  private dataService = inject(DataService);
  query = "";
  results: SearchResults | null = null;
  showResults = false;

  onSearch(): void {
    if (this.query.length >= 2) {
      this.results = this.dataService.search(this.query);
    } else {
      this.results = null;
    }
  }

  onBlur(): void {
    setTimeout(() => (this.showResults = false), 200);
  }

  clearSearch(): void {
    this.query = "";
    this.results = null;
    this.showResults = false;
  }
}
