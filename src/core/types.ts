export type WordMap = Record<string, string>;
export type LoanwordMap = WordMap;
export type DictionaryMap = WordMap;

export type DictionaryOption = boolean | WordMap;

export interface SlugifyOptions {
  replacement?: string;
  separator?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
  dictionary?: DictionaryOption;
  customReplacements?: ReadonlyArray<readonly [string, string]>;
  prefix?: string;
  suffix?: string;
  postfix?: string;
  hash?: boolean | string | number;
  hashLength?: number;
  maxLength?: number;
  stopwords?: boolean | readonly string[];
  symbols?: boolean;
  decamelize?: boolean;
  transliterate?: boolean;
  preserveTrailingDash?: boolean;
}

export interface SanitizeSlugOptions {
  preserveTrailingDash?: boolean;
}

export type SlugifyFn = (input: string | null | undefined, options?: SlugifyOptions) => string;
