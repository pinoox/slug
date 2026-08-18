const CONSONANT =
  /[ءبتثجچحخدذرزژسشصضطظعغفقکگلمنهپگی]/;

export const CONSONANT_MAP: Record<string, string> = {
  ب: 'b',
  پ: 'p',
  ت: 't',
  ث: 's',
  ج: 'j',
  چ: 'ch',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'z',
  ر: 'r',
  ز: 'z',
  ژ: 'zh',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'z',
  ط: 't',
  ظ: 'z',
  ع: '',
  غ: 'gh',
  ف: 'f',
  ق: 'gh',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'v',
  ی: 'y',
  ء: '',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

export function isConsonant(letter: string): boolean {
  return CONSONANT.test(letter);
}

export function isAlef(letter: string): boolean {
  return letter === 'ا' || letter === 'آ';
}

export function isYeOrVav(letter: string): boolean {
  return letter === 'ی' || letter === 'و';
}

export function mapConsonant(letter: string): string {
  if (CONSONANT_MAP[letter] !== undefined) return CONSONANT_MAP[letter];
  return letter;
}

export function mapChar(char: string): string {
  if (char === 'ا' || char === 'آ') return 'a';
  if (char === 'و') return 'o';
  if (char === 'ی') return 'i';
  return mapConsonant(char);
}

export const PERSIAN_LETTER = /[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/;
