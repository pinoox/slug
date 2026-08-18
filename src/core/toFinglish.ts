import { applyLoanwords } from './loanwords';
import { normalizePersian, stripZwnj } from './normalize';
import { transliterateWord } from './heja';
import { lookupWord } from './words';

export function toFinglish(input: string | null | undefined): string {
  const source = String(input ?? '').trim();
  if (!source) return '';

  const prepared = applyLoanwords(normalizePersian(source));
  const words = stripZwnj(prepared)
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  return words.map((word) => lookupWord(word) ?? transliterateWord(word)).join(' ');
}

export const toPinglish = toFinglish;
