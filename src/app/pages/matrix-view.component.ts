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
      <div class="mb-3 flex items-baseline justify-between">
        <h1 class="text-xl font-bold text-gray-900">Feature Matrix</h1>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <span class="inline-flex w-3 h-3 rounded-full bg-green-100 border border-green-300"></span>
            Supported
          </div>
          <div class="flex items-center gap-1">
            <span class="inline-flex w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></span>
            None
          </div>
        </div>
      </div>

      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th class="sticky left-0 z-10 bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">
                Feature
              </th>
              @for (harness of matrix.harnesses; track harness.id) {
                <th class="border-b border-gray-200 px-2 py-2 text-center whitespace-nowrap">
                  <a
                    [routerLink]="['/harness', harness.id]"
                    class="inline-flex items-center gap-1 hover:text-blue-600"
                  >
                    <img
                      [src]="'assets/icons/' + harness.icon"
                      [alt]="harness.name"
                      class="w-4 h-4"
                    />
                    <span class="font-semibold text-gray-700">{{ harness.name }}</span>
                  </a>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of matrix.rows; track row.feature.id; let odd = $odd) {
              <tr [class]="odd ? 'bg-gray-50/50' : 'bg-white'" class="hover:bg-blue-50/40">
                <td class="sticky left-0 z-10 border-r border-b border-gray-100 px-3 py-1.5 whitespace-nowrap"
                    [class]="odd ? 'bg-gray-50' : 'bg-white'">
                  <a
                    [routerLink]="['/compare', row.feature.id]"
                    class="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {{ row.feature.name }}
                  </a>
                </td>
                @for (cell of row.cells; track cell.harnessId) {
                  <td
                    class="border-b border-gray-100 px-2 py-1.5 text-center cursor-pointer"
                    (mouseenter)="showTooltip(row.feature.id, cell.harnessId, $event)"
                    (mouseleave)="hideTooltip()"
                    (click)="navigateToFeature(row.feature.id)"
                  >
                    @if (cell.supportedCount === 0) {
                      <span class="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center text-gray-300 text-[10px]">
                        &mdash;
                      </span>
                    } @else {
                      <span class="inline-flex w-6 h-6 rounded-full bg-green-100 items-center justify-center text-green-700 text-[10px] font-bold">
                        {{ cell.supportedCount }}
                      </span>
                    }
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
