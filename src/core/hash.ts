const HASH_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const MIN_HASH_LENGTH = 2;
const DEFAULT_HASH_LENGTH = 6;

/**
 * cyrb53 — small deterministic 53-bit string hash (not cryptographic).
 */
function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function toBase36(value: number): string {
  let n = value;
  if (n === 0) return '0';
  let out = '';
  while (n > 0) {
    out = HASH_ALPHABET[n % 36] + out;
    n = Math.floor(n / 36);
  }
  return out;
}

export function resolveHashLength(length?: number): number {
  if (length === undefined) return DEFAULT_HASH_LENGTH;
  return Math.max(MIN_HASH_LENGTH, Math.floor(length));
}

export function makeHash(seed: string, length?: number): string {
  const size = resolveHashLength(length);
  let out = '';
  let round = 0;
  while (out.length < size) {
    out += toBase36(cyrb53(seed, round));
    round += 1;
  }
  return out.slice(0, size);
}

export function resolveHashSeed(hash: boolean | string | number, source: string): string {
  if (hash === true) return source;
  return String(hash);
}
