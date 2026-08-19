export { toFinglish, toPinglish } from './core/toFinglish';
export { slugify, createSlugify, slugifyWithCounter } from './core/slugify';
export { sanitizeSlug } from './core/sanitize';
export {
  extendLoanwords,
  resetLoanwords,
  extendDictionary,
  resetDictionary,
  DEFAULT_LOANWORDS,
  DEFAULT_CMS_DICTIONARY,
} from './core/dictionary';
export { extendWords, resetWords } from './core/words';
export { PERSIAN_STOPWORDS } from './core/text';
export type {
  SlugifyOptions,
  SlugifyFn,
  LoanwordMap,
  WordMap,
  DictionaryMap,
  DictionaryOption,
  SanitizeSlugOptions,
} from './core/types';
