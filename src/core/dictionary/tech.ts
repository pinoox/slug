import type { LoanwordMap } from '../types';

/**
 * English loanwords written in Persian. Letter-mapping cannot recover
 * the original vowels (لپتاپ → lptap), so these are replaced first.
 */
export const DEFAULT_LOANWORDS: LoanwordMap = {
  لپتاپ: 'laptop',
  'لپ تاپ': 'laptop',
  'لپ‌تاپ': 'laptop',
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
  'پلی‌استیشن': 'playstation',
  'ایکس باکس': 'xbox',
  ایکسباکس: 'xbox',
  'ایکس‌باکس': 'xbox',
  بلوتوث: 'bluetooth',
  'وای فای': 'wifi',
  وایفاي: 'wifi',
  وایفای: 'wifi',
  'وای‌فای': 'wifi',
  کامپیوتر: 'computer',
};
