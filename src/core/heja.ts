import {
  isAlef,
  isYeOrVav,
  mapConsonant,
  PERSIAN_LETTER,
} from './letters';

interface Vaj {
  type: 's' | 'm';
  letter: string;
  short?: boolean;
}

interface Scored {
  text: string;
  score: number;
}

const YA_REST = /^[بتثجچحخدذرزژسشصضطظعغفقکگلمنهپگی]یا$/;

function pickShort(first: string, rest: string): string {
  if (rest === 'یا' || YA_REST.test(rest)) return 'o';
  if (first === 'ک' || first === 'گ') return 'e';
  return 'a';
}

function mapVowel(letter: string, hejaLen: number): string {
  if (letter === 'آ' || letter === 'ا') return 'a';
  if (letter === 'ی') return 'i';
  if (letter === 'و') return hejaLen === 2 ? 'o' : 'o';
  if (letter === 'e') return 'e';
  return 'a';
}

function isValidHeja(vajs: Vaj[]): boolean {
  if (vajs.length < 2 || vajs.length > 4) return false;
  if (vajs[0].type !== 's' || vajs[1].type !== 'm') return false;
  if (vajs.length >= 3 && vajs[2].type !== 's') return false;
  if (vajs.length === 4 && vajs[3].type !== 's') return false;
  return true;
}

function chunkToHeja(
  chunk: string,
  isFirst: boolean,
  isLast: boolean,
): Vaj[] | null {
  const letters = [...chunk];
  if (!letters.length || letters.length > 4) return null;
  if (isFirst && letters.length === 4) return null;
  if (isAlef(letters[0])) return null;

  const vajs: Vaj[] = [{ type: 's', letter: letters[0] }];
  let i = 1;

  if (i < letters.length && (isAlef(letters[i]) || isYeOrVav(letters[i]))) {
    vajs.push({ type: 'm', letter: letters[i] });
    i += 1;
  } else {
    vajs.push({ type: 'm', letter: '', short: true });
  }

  while (i < letters.length) {
    if (isAlef(letters[i])) return null;
    vajs.push({ type: 's', letter: letters[i] });
    i += 1;
  }

  if (
    isLast &&
    !isFirst &&
    vajs.length === 3 &&
    vajs[2].letter === 'ه' &&
    vajs[1].short
  ) {
    vajs.pop();
    vajs[1] = { type: 'm', letter: 'e', short: true };
  }

  return isValidHeja(vajs) ? vajs : null;
}

function hejaToLatin(heja: Vaj[], rest: string): string {
  let out = '';
  for (let i = 0; i < heja.length; i += 1) {
    const vaj = heja[i];
    if (vaj.type === 'm') {
      if (vaj.short) {
        out += vaj.letter === 'e' ? 'e' : pickShort(heja[0].letter, rest);
      } else {
        out += mapVowel(vaj.letter, heja.length);
      }
      continue;
    }
    out += mapConsonant(vaj.letter);
  }
  return out;
}

function leftoverLatin(letter: string): string {
  if (isAlef(letter)) return 'a';
  if (letter === 'و') return 'o';
  if (letter === 'ی') return 'i';
  return mapConsonant(letter);
}

function bestFrom(word: string, index: number, isFirst: boolean, memo: Map<string, Scored | null>): Scored | null {
  const key = `${index}:${isFirst ? 1 : 0}`;
  if (memo.has(key)) return memo.get(key) ?? null;
  if (index === word.length) {
    const empty = { text: '', score: 0 };
    memo.set(key, empty);
    return empty;
  }

  const restWord = word.slice(index);
  const maxTake = Math.min(isFirst ? 3 : 4, restWord.length);
  let best: Scored | null = null;

  for (let take = maxTake; take >= 1; take -= 1) {
    const chunk = restWord.slice(0, take);
    const rest = restWord.slice(take);
    const isLast = rest.length === 0;

    if (isLast && chunk.length === 1 && !isFirst) {
      const next = bestFrom(word, index + 1, false, memo);
      if (!next) continue;
      const text = leftoverLatin(chunk) + next.text;
      const scored = { text, score: take - 4 + next.score };
      if (!best || scored.score > best.score) best = scored;
      continue;
    }

    const heja = chunkToHeja(chunk, isFirst, isLast);
    if (!heja) continue;
    const next = bestFrom(word, index + take, false, memo);
    if (!next) continue;

    let score = take + next.score - 2;
    if (heja[1].short && heja[1].letter !== 'e') score += 1;
    else score += 4;
    if (heja.length === 4 && heja[1].short) score += 2;
    if (isLast && heja[1].letter === 'e') score += 8;
    if (isLast && heja[heja.length - 1]?.letter === 'ه') score -= 4;

    const text = hejaToLatin(heja, rest) + next.text;
    const scored = { text, score };
    if (!best || scored.score > best.score) best = scored;
  }

  memo.set(key, best);
  return best;
}

function stripInitialAlef(word: string): { prefix: string; rest: string } {
  if (word.startsWith('ای')) return { prefix: 'i', rest: word.slice(2) };
  if (word.startsWith('آ') || word.startsWith('ا')) return { prefix: 'a', rest: word.slice(1) };
  return { prefix: '', rest: word };
}

export function transliterateWord(word: string): string {
  if (!word) return '';
  if (![...word].some((ch) => PERSIAN_LETTER.test(ch))) return word;
  if (word === 'و') return 'va';
  if (word.length === 1) return leftoverLatin(word);

  const { prefix, rest } = stripInitialAlef(word);
  if (!rest) return prefix || leftoverLatin(word);
  if (rest.length === 1) return prefix + leftoverLatin(rest);

  const parsed = bestFrom(rest, 0, true, new Map());
  if (!parsed) {
    return prefix + [...rest].map((ch) => leftoverLatin(ch)).join('');
  }
  return prefix + parsed.text;
}
