import { Component, Input } from "@angular/core";

@Component({
  selector: "app-platform-badge",
  template: `
    <span
      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      [class]="colorClasses"
    >
      {{ platform }}
    </span>
  `,
})
export class PlatformBadgeComponent {
  @Input({ required: true }) platform!: string;

  get colorClasses(): string {
    switch (this.platform.toLowerCase()) {
      case "cli":
        return "bg-gray-100 text-gray-800";
      case "vscode":
      case "vs code":
      case "vs code extension":
        return "bg-blue-100 text-blue-800";
      case "jetbrains":
      case "jetbrains plugin":
      case "jetbrains extension":
        return "bg-orange-100 text-orange-800";
      case "desktop":
      case "desktop app":
        return "bg-purple-100 text-purple-800";
      case "ide":
      case "ide extension":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
