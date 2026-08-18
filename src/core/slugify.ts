import { escapeRegExp } from './normalize';
import { toFinglish } from './toFinglish';
import type { SlugifyOptions } from './types';

export function slugify(input: string | null | undefined, options: SlugifyOptions = {}): string {
  const source = String(input ?? '').trim();
  if (!source) return '';

  const replacement = options.replacement ?? '-';
  const lower = options.lower ?? true;
  const strict = options.strict ?? true;
  const shouldTrim = options.trim ?? true;

  let out = toFinglish(source);
  if (!out) return '';

  if (lower) out = out.toLowerCase();
  if (options.remove) out = out.replace(options.remove, '');

  out = out.replace(/[\s_]+/g, replacement);

  const escaped = escapeRegExp(replacement);
  if (strict) {
    out = out.replace(new RegExp(`[^a-z0-9${escaped}]`, 'gi'), '');
  }

  out = out.replace(new RegExp(`${escaped}+`, 'g'), replacement);

  if (shouldTrim) {
    out = out.replace(new RegExp(`^${escaped}+|${escaped}+$`, 'g'), '');
  }

  return out;
}
