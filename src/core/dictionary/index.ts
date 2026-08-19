import type { DictionaryOption, WordMap } from '../types';
import { buildLookup, type DictionaryLookup } from './apply';
import { DEFAULT_CMS_DICTIONARY } from './cms';
import { DEFAULT_LOANWORDS } from './tech';

export { DEFAULT_CMS_DICTIONARY } from './cms';
export { DEFAULT_LOANWORDS } from './tech';
export { applyDictionaryToTokens, normalizeDictKey } from './apply';
export type { DictionaryLookup } from './apply';

const extraLoanwords: WordMap = {};
const extraDictionary: WordMap = {};

let cachedDefault: DictionaryLookup | null = null;

function invalidateCache(): void {
  cachedDefault = null;
}

export function extendLoanwords(map: WordMap): void {
  Object.assign(extraLoanwords, map);
  invalidateCache();
}

export function resetLoanwords(): void {
  for (const key of Object.keys(extraLoanwords)) {
    delete extraLoanwords[key];
  }
  invalidateCache();
}

export function extendDictionary(map: WordMap): void {
  Object.assign(extraDictionary, map);
  invalidateCache();
}

export function resetDictionary(): void {
  for (const key of Object.keys(extraDictionary)) {
    delete extraDictionary[key];
  }
  invalidateCache();
}

export function resolveDictionary(option: DictionaryOption | undefined): DictionaryLookup | null {
  if (option === false) return null;

  const perCall = option && typeof option === 'object' ? option : undefined;
  if (!perCall && cachedDefault) return cachedDefault;

  const maps: WordMap[] = [
    DEFAULT_CMS_DICTIONARY,
    DEFAULT_LOANWORDS,
    extraLoanwords,
    extraDictionary,
  ];
  if (perCall) maps.push(perCall);

  const lookup = buildLookup(maps);
  if (!perCall) cachedDefault = lookup;
  return lookup;
}
