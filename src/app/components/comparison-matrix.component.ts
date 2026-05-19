import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComparisonMatrix, ComparisonRow, ResolvedHarness } from '../models/data.models';
import { PlatformBadgeComponent } from './platform-badge.component';
import { CodeExampleComponent } from './code-example.component';
import { InlineCodePipe } from '../pipes/inline-code.pipe';

@Component({
  selector: 'app-comparison-matrix',
  imports: [PlatformBadgeComponent, CodeExampleComponent, RouterLink, InlineCodePipe],
  template: `
    <div class="space-y-4">
      @for (row of matrix.rows; track row.implementation.id) {
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Implementation header -->
          <button
            (click)="toggle(row.implementation.id)"
            class="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="font-semibold text-gray-900 text-base">
                  {{ row.implementation.name }}
                </span>
                @if (row.implementation.userExtensible) {
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                  >
                    Extensible
                  </span>
                }
              </div>
              <!-- Harness pills (only supported) -->
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                @for (cell of row.cells; track cell.harness.id) {
                  @if (cell.supported) {
                    <span class="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <img
                        [src]="'assets/icons/' + cell.harness.icon"
                        [alt]="cell.harness.name"
                        class="w-4 h-4"
                      />
                      {{ cell.harness.name }}
                    </span>
                  }
                }
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform shrink-0 mt-1"
              [class.rotate-180]="isExpanded(row.implementation.id)"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          @if (isExpanded(row.implementation.id)) {
            <div class="border-t border-gray-100 px-5 pb-5 space-y-4">
              <!-- Description -->
              <p
                class="text-sm text-gray-600 mt-4 leading-relaxed"
                [innerHTML]="row.implementation.description | inlineCode"
              ></p>

              <!-- Extensibility note -->
              @if (row.implementation.extensibilityNote) {
                <div
                  class="flex items-start gap-2 text-sm rounded-md px-3 py-2"
                  [class]="
                    row.implementation.userExtensible
                      ? 'bg-green-50 text-green-800'
                      : 'bg-gray-50 text-gray-600'
                  "
                >
                  <span class="shrink-0 mt-0.5">{{
                    row.implementation.userExtensible ? '&#10003;' : '&#10007;'
                  }}</span>
                  <span [innerHTML]="row.implementation.extensibilityNote | inlineCode"></span>
                </div>
              }

              <!-- Per-harness details -->
              <div class="space-y-3">
                @for (cell of row.cells; track cell.harness.id) {
                  @if (cell.supported) {
                    <div class="border border-gray-100 rounded-md px-4 py-3">
                      <div class="flex items-center gap-2 mb-1">
                        <a
                          [routerLink]="['/harness', cell.harness.id]"
                          class="flex items-center gap-2 font-medium text-sm text-gray-900 hover:text-blue-600"
                        >
                          <img
                            [src]="'assets/icons/' + cell.harness.icon"
                            [alt]="cell.harness.name"
                            class="w-4 h-4"
                          />
                          {{ cell.harness.name }}
                        </a>
                        <div class="flex gap-1">
                          @for (p of resolvePlatformNames(cell.harness, cell.platforms); track p) {
                            <app-platform-badge [platform]="p" />
                          }
                        </div>
                      </div>
                      @if (cell.notes) {
                        <p
                          class="text-xs text-blue-600 italic"
                          [innerHTML]="cell.notes | inlineCode"
                        ></p>
                      }
                    </div>
                  }
                }
              </div>

              <!-- Code example -->
              @if (row.implementation.example) {
                <app-code-example
                  [code]="row.implementation.example"
                  [syntax]="row.implementation.syntax"
                  [label]="row.implementation.name"
                />
              }

              <!-- Custom example for extensible implementations -->
              @if (row.implementation.customExample) {
                <div>
                  <p class="text-xs font-medium text-green-700 uppercase tracking-wider mb-2">
                    Custom Example
                  </p>
                  <app-code-example
                    [code]="row.implementation.customExample"
                    [syntax]="row.implementation.syntax"
                    label="Create your own"
                  />
                </div>
              }

              <!-- Doc link -->
              @if (row.implementation.docUrl) {
                <a
                  [href]="row.implementation.docUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Documentation &rarr;
                </a>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ComparisonMatrixComponent {
  @Input({ required: true }) matrix!: ComparisonMatrix;

  private expandedIds = new Set<string>();

  toggle(id: string): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  resolvePlatformNames(harness: ResolvedHarness, platformIds: string[]): string[] {
    return platformIds.map((id) => {
      const p = harness.platforms.find((pl) => pl.id === id);
      return p?.name ?? id;
    });
  }
}
