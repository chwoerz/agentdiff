import { Component, Input } from "@angular/core";
import { FullMatrixCell } from "../models/data.models";
import { PlatformBadgeComponent } from "./platform-badge.component";

@Component({
  selector: "app-matrix-tooltip",
  imports: [PlatformBadgeComponent],
  template: `
    <div class="w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-sm">
      <div class="flex items-center gap-2 mb-2">
        <img
          [src]="'assets/icons/' + cell.harnessIcon"
          [alt]="cell.harnessName"
          class="w-5 h-5"
        />
        <span class="font-semibold text-gray-900">{{ cell.harnessName }}</span>
      </div>
      <p class="text-xs text-gray-500 mb-3">{{ featureName }}</p>

      @if (cell.supportedCount === 0) {
        <p class="text-gray-400 italic">Not supported</p>
      } @else {
        <p class="text-gray-700 mb-2">
          <span class="font-medium">{{ cell.supportedCount }} / {{ cell.totalCount }}</span>
          implementations
        </p>
        <ul class="space-y-1.5">
          @for (impl of cell.implementations; track impl.implementationId) {
            <li class="text-gray-700">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span>{{ impl.implementationName }}</span>
                @for (p of impl.platforms; track p) {
                  <app-platform-badge [platform]="p" />
                }
              </div>
              @if (impl.notes) {
                <p class="text-xs text-blue-600 italic mt-0.5">{{ impl.notes }}</p>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class MatrixTooltipComponent {
  @Input({ required: true }) cell!: FullMatrixCell;
  @Input({ required: true }) featureName!: string;
}
