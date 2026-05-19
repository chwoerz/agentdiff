import { Component, Input } from '@angular/core';
import { Implementation } from '../models/data.models';
import { PlatformBadgeComponent } from './platform-badge.component';
import { CodeExampleComponent } from './code-example.component';
import { InlineCodePipe } from '../pipes/inline-code.pipe';

@Component({
  selector: 'app-implementation-card',
  imports: [PlatformBadgeComponent, CodeExampleComponent, InlineCodePipe],
  template: `
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <button
        (click)="expanded = !expanded"
        class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-3 flex-wrap">
          <span class="font-medium text-gray-900">{{ implementation.name }}</span>
          @if (implementation.userExtensible) {
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
            >
              Extensible
            </span>
          }
          @for (p of platforms; track p) {
            <app-platform-badge [platform]="p" />
          }
        </div>
        <svg
          class="w-5 h-5 text-gray-400 transition-transform shrink-0"
          [class.rotate-180]="expanded"
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

      @if (expanded) {
        <div class="px-4 pb-4 border-t border-gray-100 space-y-3">
          <p
            class="text-sm text-gray-600 mt-3"
            [innerHTML]="implementation.description | inlineCode"
          ></p>

          @if (notes) {
            <p class="text-sm text-blue-600 italic" [innerHTML]="notes | inlineCode"></p>
          }

          @if (implementation.extensibilityNote) {
            <div
              class="flex items-start gap-2 text-sm rounded-md px-3 py-2"
              [class]="
                implementation.userExtensible
                  ? 'bg-green-50 text-green-800'
                  : 'bg-gray-50 text-gray-600'
              "
            >
              <span class="shrink-0 mt-0.5">{{
                implementation.userExtensible ? '&#10003;' : '&#10007;'
              }}</span>
              <span [innerHTML]="implementation.extensibilityNote | inlineCode"></span>
            </div>
          }

          @if (implementation.example) {
            <app-code-example
              [code]="implementation.example"
              [syntax]="implementation.syntax"
              [label]="implementation.name"
            />
          }

          @if (implementation.customExample) {
            <div>
              <p class="text-xs font-medium text-green-700 uppercase tracking-wider mb-2">
                Custom Example
              </p>
              <app-code-example
                [code]="implementation.customExample"
                [syntax]="implementation.syntax"
                label="Create your own"
              />
            </div>
          }

          @if (implementation.docUrl) {
            <a
              [href]="implementation.docUrl"
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
  `,
})
export class ImplementationCardComponent {
  @Input({ required: true }) implementation!: Implementation;
  @Input() platforms: string[] = [];
  @Input() notes?: string;
  @Input() expanded = false;
}
