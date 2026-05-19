import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DataService } from "../services/data.service";
import { FullMatrix, FullMatrixCell } from "../models/data.models";
import { MatrixTooltipComponent } from "../components/matrix-tooltip.component";

@Component({
  selector: "app-matrix-view",
  imports: [RouterLink, MatrixTooltipComponent],
  template: `
    <div class="max-w-full">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Feature Matrix</h1>
        <p class="text-gray-600">
          Hover any cell to see implementation details. Click to explore.
        </p>
      </div>

      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="sticky left-0 z-10 bg-gray-50 border-b border-r border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[200px]">
                Feature
              </th>
              @for (harness of matrix.harnesses; track harness.id) {
                <th class="border-b border-gray-200 px-3 py-3 text-center min-w-[120px]">
                  <a
                    [routerLink]="['/harness', harness.id]"
                    class="inline-flex flex-col items-center gap-1.5 hover:text-blue-600"
                  >
                    <img
                      [src]="'assets/icons/' + harness.icon"
                      [alt]="harness.name"
                      class="w-6 h-6"
                    />
                    <span class="text-xs font-semibold text-gray-700">{{ harness.name }}</span>
                  </a>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of matrix.rows; track row.feature.id; let odd = $odd) {
              <tr [class]="odd ? 'bg-gray-50/50' : 'bg-white'">
                <td class="sticky left-0 z-10 border-r border-b border-gray-200 px-4 py-3"
                    [class]="odd ? 'bg-gray-50' : 'bg-white'">
                  <a
                    [routerLink]="['/compare', row.feature.id]"
                    class="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {{ row.feature.name }}
                  </a>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ row.totalImplementations }} impl.
                  </p>
                </td>
                @for (cell of row.cells; track cell.harnessId) {
                  <td
                    class="relative border-b border-gray-200 px-3 py-3 text-center cursor-pointer group"
                    (mouseenter)="showTooltip(row.feature.id, cell.harnessId, $event)"
                    (mouseleave)="hideTooltip()"
                    (click)="navigateToFeature(row.feature.id)"
                  >
                    <div class="flex items-center justify-center">
                      @if (cell.supportedCount === 0) {
                        <span class="inline-flex w-8 h-8 rounded-full bg-gray-100 border border-gray-200 items-center justify-center text-gray-300 text-xs">
                          &mdash;
                        </span>
                      } @else if (cell.supportedCount === cell.totalCount) {
                        <span class="inline-flex w-8 h-8 rounded-full bg-green-100 border border-green-300 items-center justify-center text-green-700 text-xs font-bold">
                          &#10003;
                        </span>
                      } @else {
                        <span class="inline-flex w-8 h-8 rounded-full bg-yellow-100 border border-yellow-300 items-center justify-center text-yellow-700 text-xs font-bold">
                          {{ cell.supportedCount }}/{{ cell.totalCount }}
                        </span>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (activeTooltip) {
        <div
          class="fixed z-50 pointer-events-none"
          [style.left.px]="tooltipX"
          [style.top.px]="tooltipY"
        >
          <app-matrix-tooltip
            [cell]="activeTooltip.cell"
            [featureName]="activeTooltip.featureName"
          />
        </div>
      }

      <div class="mt-4 flex items-center gap-6 text-xs text-gray-500">
        <div class="flex items-center gap-1.5">
          <span class="inline-block w-4 h-4 rounded-full bg-green-100 border border-green-300"></span>
          Full support
        </div>
        <div class="flex items-center gap-1.5">
          <span class="inline-block w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300"></span>
          Partial support
        </div>
        <div class="flex items-center gap-1.5">
          <span class="inline-block w-4 h-4 rounded-full bg-gray-100 border border-gray-200"></span>
          Not supported
        </div>
      </div>
    </div>
  `,
})
export class MatrixViewComponent {
  private dataService = inject(DataService);
  private router = inject(Router);
  matrix: FullMatrix = this.dataService.getFullMatrix();

  activeTooltip: { cell: FullMatrixCell; featureName: string } | null = null;
  tooltipX = 0;
  tooltipY = 0;

  showTooltip(featureId: string, harnessId: string, event: MouseEvent): void {
    const row = this.matrix.rows.find((r) => r.feature.id === featureId);
    const cell = row?.cells.find((c) => c.harnessId === harnessId);
    if (!row || !cell) return;

    this.activeTooltip = { cell, featureName: row.feature.name };

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const tooltipWidth = 288;
    const tooltipHeight = 200;
    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y = rect.bottom + 8;

    x = Math.max(8, Math.min(x, window.innerWidth - tooltipWidth - 8));
    if (y + tooltipHeight > window.innerHeight) {
      y = rect.top - tooltipHeight - 8;
    }

    this.tooltipX = x;
    this.tooltipY = y;
  }

  hideTooltip(): void {
    this.activeTooltip = null;
  }

  navigateToFeature(featureId: string): void {
    this.router.navigate(["/compare", featureId]);
  }
}
