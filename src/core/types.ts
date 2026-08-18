export interface SlugifyOptions {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
}

export type LoanwordMap = Record<string, string>;
export type WordMap = Record<string, string>;
