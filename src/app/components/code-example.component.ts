import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import * as Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-typescript";

@Component({
  selector: "app-code-example",
  template: `
    <div class="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      @if (label) {
        <div class="px-3 py-1.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-500 font-mono">
          {{ label }}
        </div>
      }
      <pre class="p-4 overflow-x-auto text-sm"><code #codeEl [class]="'language-' + syntax">{{ code }}</code></pre>
    </div>
  `,
})
export class CodeExampleComponent implements AfterViewInit {
  @Input({ required: true }) code!: string;
  @Input() syntax: string = "text";
  @Input() label?: string;
  @ViewChild("codeEl") codeEl!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    Prism.highlightElement(this.codeEl.nativeElement);
  }
}
