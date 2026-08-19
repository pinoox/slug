import type { SanitizeSlugOptions } from './types';

export function sanitizeSlug(
  input: string | null | undefined,
  options: SanitizeSlugOptions = {},
): string {
  const preserveTrailingDash = options.preserveTrailingDash ?? false;
  const hadTrailing = preserveTrailingDash && /-+$/.test(String(input ?? ''));
  let out = String(input ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  if (!preserveTrailingDash) {
    return out;
  }
  if (hadTrailing && !out.endsWith('-')) out += '-';
  return out;
}
