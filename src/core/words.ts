import { normalizeDictKey } from './dictionary';
import type { WordMap } from './types';

/**
 * Optional exact-word overrides. Conversion itself is heja-based and
 * does not depend on this map.
 */
const extraWords: WordMap = {};

export function extendWords(map: WordMap): void {
  Object.assign(extraWords, map);
}

export function resetWords(): void {
  for (const key of Object.keys(extraWords)) {
    delete extraWords[key];
  }
}

export function lookupWord(word: string): string | undefined {
  if (extraWords[word] !== undefined) return extraWords[word];
  const normalized = normalizeDictKey(word);
  if (normalized !== word && extraWords[normalized] !== undefined) {
    return extraWords[normalized];
  }
  for (const [key, value] of Object.entries(extraWords)) {
    if (normalizeDictKey(key) === normalized) return value;
  }
  return undefined;
}
