const ARABIC_YEH = /[يى]/g;
const ARABIC_KAF = /ك/g;
const TEH_MARBUTA = /[ةۀ]/g;
const ALEF_VARIANTS = /[أإٱ]/g;
const DIACRITICS = /[\u064B-\u0652\u0670]/g;

export function normalizePersian(input: string): string {
  return String(input)
    .replace(ARABIC_YEH, 'ی')
    .replace(ARABIC_KAF, 'ک')
    .replace(TEH_MARBUTA, 'ه')
    .replace(ALEF_VARIANTS, 'ا')
    .replace(DIACRITICS, '');
}

export function stripZwnj(input: string): string {
  return input.replace(/\u200c/g, '');
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
