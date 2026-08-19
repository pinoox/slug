export const PERSIAN_STOPWORDS = ['و', 'از', 'به', 'در', 'را', 'که', 'با'] as const;

const TOKEN_SPLIT = /[\s,،.!?;؛:()[\]{}«»"'`/\\|~*]+/;

export function tokenize(text: string): string[] {
  return text.split(TOKEN_SPLIT).filter(Boolean);
}

export function decamelize(text: string): string {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

export const DEFAULT_SYMBOLS: ReadonlyArray<readonly [string, string]> = [
  ['&', ' and '],
  ['%', ' percent '],
  ['+', ' plus '],
  ['♥', ' love '],
  ['❤', ' love '],
];

export function applySymbols(text: string): string {
  let out = text;
  for (const [from, to] of DEFAULT_SYMBOLS) {
    out = out.split(from).join(to);
  }
  return out;
}

export function applyCustomReplacements(
  text: string,
  replacements: ReadonlyArray<readonly [string, string]>,
): string {
  let out = text;
  for (const [from, to] of replacements) {
    if (!from) continue;
    out = out.split(from).join(to);
  }
  return out;
}

export function joinParts(parts: Array<string | undefined | null>, separator: string): string {
  return parts.filter((part): part is string => Boolean(part)).join(separator);
}

export function truncateAtSeparator(text: string, maxLength: number, separator: string): string {
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const idx = sliced.lastIndexOf(separator);
  if (idx > 0) return sliced.slice(0, idx);
  return sliced;
}
