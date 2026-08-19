import {
  applyDictionaryToTokens,
  normalizeDictKey,
  resolveDictionary,
} from './dictionary';
import { transliterateWord } from './heja';
import { normalizePersian, stripZwnj } from './normalize';
import {
  applyCustomReplacements,
  applySymbols,
  decamelize,
  PERSIAN_STOPWORDS,
  tokenize,
} from './text';
import type { SlugifyOptions } from './types';
import { lookupWord } from './words';

function resolveStopwords(option: SlugifyOptions['stopwords']): Set<string> {
  if (!option) return new Set();
  const list = option === true ? PERSIAN_STOPWORDS : option;
  return new Set(list.map((word) => normalizeDictKey(word)));
}

export function toFinglish(
  input: string | null | undefined,
  options: SlugifyOptions = {},
): string {
  const source = String(input ?? '').trim();
  if (!source) return '';

  let text = normalizePersian(source);

  if (options.customReplacements?.length) {
    text = applyCustomReplacements(text, options.customReplacements);
  }
  if (options.symbols !== false) {
    text = applySymbols(text);
  }
  if (options.decamelize !== false) {
    text = decamelize(text);
  }

  const tokens = tokenize(stripZwnj(text).replace(/\s+/g, ' ').trim());
  const lookup = resolveDictionary(options.dictionary);
  const mapped = lookup ? applyDictionaryToTokens(tokens, lookup) : tokens;

  const stopwords = resolveStopwords(options.stopwords);
  const kept = stopwords.size
    ? mapped.filter((token) => !stopwords.has(normalizeDictKey(token)))
    : mapped;

  const transliterate = options.transliterate !== false;
  const words = kept
    .map((word) => {
      if (!transliterate) return word;
      return lookupWord(word) ?? transliterateWord(word);
    })
    .filter(Boolean);

  return words.join(' ');
}

export const toPinglish = toFinglish;
