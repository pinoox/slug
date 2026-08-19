import { normalizePersian, stripZwnj } from '../normalize';
import type { WordMap } from '../types';

export interface DictionaryLookup {
  map: Map<string, string>;
  maxTokens: number;
}

export function normalizeDictKey(key: string): string {
  return stripZwnj(normalizePersian(key)).replace(/\s+/g, ' ').trim();
}

export function buildLookup(maps: WordMap[]): DictionaryLookup {
  const map = new Map<string, string>();
  let maxTokens = 1;
  for (const source of maps) {
    for (const [key, value] of Object.entries(source)) {
      const normalized = normalizeDictKey(key);
      if (!normalized) continue;
      map.set(normalized, value);
      const tokens = normalized.split(' ').length;
      if (tokens > maxTokens) maxTokens = tokens;
    }
  }
  return { map, maxTokens };
}

export function applyDictionaryToTokens(
  tokens: string[],
  lookup: DictionaryLookup,
): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    let matched = false;
    const maxTake = Math.min(lookup.maxTokens, tokens.length - i);
    for (let take = maxTake; take >= 1; take -= 1) {
      const candidate = normalizeDictKey(tokens.slice(i, i + take).join(' '));
      const value = lookup.map.get(candidate);
      if (value !== undefined) {
        out.push(value);
        i += take;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push(tokens[i]);
      i += 1;
    }
  }
  return out;
}
