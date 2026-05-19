import { Pipe, PipeTransform } from '@angular/core';

/**
 * Renders inline markdown backtick segments as <code> elements.
 * Escapes all other HTML to remain safe for use with [innerHTML].
 *
 * Example: "Use `claude-opus-4-7`" -> 'Use <code class="...">claude-opus-4-7</code>'
 */
@Pipe({ name: 'inlineCode', standalone: true })
export class InlineCodePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const escaped = escapeHtml(value);
    // Replace `...` with <code>...</code>. Non-greedy, single-line.
    return escaped.replace(
      /`([^`\n]+)`/g,
      '<code class="px-1 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-[0.9em]">$1</code>',
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
