import type { LoanwordMap } from './types';
import { escapeRegExp, normalizePersian, stripZwnj } from './normalize';

/**
 * English loanwords written in Persian. Letter-mapping cannot recover
 * the original vowels (لپتاپ → lptap), so these are replaced first.
 */
export const DEFAULT_LOANWORDS: LoanwordMap = {
  لپتاپ: 'laptop',
  'لپ تاپ': 'laptop',
  موبایل: 'mobile',
  تبلت: 'tablet',
  هدفون: 'headphone',
  هندزفری: 'handsfree',
  شارژر: 'charger',
  کیبورد: 'keyboard',
  ماوس: 'mouse',
  موس: 'mouse',
  مانیتور: 'monitor',
  اسپیکر: 'speaker',
  پرینتر: 'printer',
  اسکنر: 'scanner',
  گیمینگ: 'gaming',
  شاپ: 'shop',
  کنسول: 'console',
  ایرپاد: 'airpod',
  سامسونگ: 'samsung',
  شیائومی: 'xiaomi',
  'پلی استیشن': 'playstation',
  پلیاستیشن: 'playstation',
  'ایکس باکس': 'xbox',
  ایکسباکس: 'xbox',
  بلوتوث: 'bluetooth',
  'وای فای': 'wifi',
  وایفاي: 'wifi',
  وایفای: 'wifi',
  کامپیوتر: 'computer',
};

const extraLoanwords: LoanwordMap = {};

function mergedLoanwords(): LoanwordMap {
  return { ...DEFAULT_LOANWORDS, ...extraLoanwords };
}

function sortedKeys(map: LoanwordMap): string[] {
  return Object.keys(map).sort((a, b) => b.length - a.length);
}

export function extendLoanwords(map: LoanwordMap): void {
  Object.assign(extraLoanwords, map);
}

export function resetLoanwords(): void {
  for (const key of Object.keys(extraLoanwords)) {
    delete extraLoanwords[key];
  }
}

export function applyLoanwords(text: string): string {
  const map = mergedLoanwords();
  let out = text;
  for (const key of sortedKeys(map)) {
    const letters = stripZwnj(normalizePersian(key)).split('').map(escapeRegExp);
    out = out.replace(new RegExp(letters.join('\\u200c?'), 'g'), map[key]);
  }
  return out;
}
