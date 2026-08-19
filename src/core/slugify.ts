import { makeHash, resolveHashSeed } from './hash';
import { escapeRegExp } from './normalize';
import { joinParts, truncateAtSeparator } from './text';
import { toFinglish } from './toFinglish';
import type { SlugifyFn, SlugifyOptions } from './types';

const PERSIAN_RANGE = '\\u0600-\\u06FF';

function resolveSeparator(options: SlugifyOptions): string {
  return options.separator ?? options.replacement ?? '-';
}

function slugBody(input: string, options: SlugifyOptions): string {
  const replacement = resolveSeparator(options);
  const lower = options.lower ?? true;
  const strict = options.strict ?? true;
  const shouldTrim = options.trim ?? true;
  const transliterate = options.transliterate !== false;

  let out = toFinglish(input, options);
  if (!out) return '';

  if (lower) out = out.toLowerCase();
  if (options.remove) out = out.replace(options.remove, '');

  out = out.replace(/[\s_]+/g, replacement);

  const escaped = escapeRegExp(replacement);
  if (strict) {
    const extra = transliterate ? '' : PERSIAN_RANGE;
    out = out.replace(new RegExp(`[^a-z0-9${extra}${escaped}]`, 'gi'), '');
  }

  out = out.replace(new RegExp(`${escaped}+`, 'g'), replacement);

  if (shouldTrim && !options.preserveTrailingDash) {
    out = out.replace(new RegExp(`^${escaped}+|${escaped}+$`, 'g'), '');
  } else if (shouldTrim) {
    out = out.replace(new RegExp(`^${escaped}+`, 'g'), '');
  }

  return out;
}

function partToSlug(value: string, options: SlugifyOptions): string {
  return slugBody(value, {
    ...options,
    prefix: undefined,
    suffix: undefined,
    postfix: undefined,
    hash: undefined,
    maxLength: undefined,
    preserveTrailingDash: false,
  });
}

function mergeOptions(defaults: SlugifyOptions, options: SlugifyOptions): SlugifyOptions {
  const dictionary =
    options.dictionary !== undefined ? options.dictionary : defaults.dictionary;

  if (
    dictionary &&
    typeof dictionary === 'object' &&
    defaults.dictionary &&
    typeof defaults.dictionary === 'object' &&
    options.dictionary &&
    typeof options.dictionary === 'object'
  ) {
    return {
      ...defaults,
      ...options,
      dictionary: { ...defaults.dictionary, ...options.dictionary },
    };
  }

  return { ...defaults, ...options, dictionary };
}

export function slugify(input: string | null | undefined, options: SlugifyOptions = {}): string {
  const source = String(input ?? '').trim();
  if (!source) return '';

  const replacement = resolveSeparator(options);
  const suffixValue = options.suffix ?? options.postfix;
  let body = slugBody(source, options);
  const prefix = options.prefix ? partToSlug(options.prefix, options) : '';
  const suffix = suffixValue ? partToSlug(suffixValue, options) : '';

  let hashStr = '';
  if (options.hash !== undefined && options.hash !== false) {
    hashStr = makeHash(resolveHashSeed(options.hash, source), options.hashLength);
  }

  if (options.maxLength && options.maxLength > 0) {
    const reserved =
      (prefix ? prefix.length + replacement.length : 0) +
      (suffix ? suffix.length + replacement.length : 0) +
      (hashStr ? hashStr.length + replacement.length : 0);
    const bodyLimit = Math.max(0, options.maxLength - reserved);
    body = truncateAtSeparator(body, bodyLimit, replacement);
  }

  let out = joinParts([prefix, body, suffix, hashStr], replacement);

  if (options.preserveTrailingDash && !hashStr && !suffix) {
    const escaped = escapeRegExp(replacement);
    if (!new RegExp(`${escaped}$`).test(out)) {
      const original = String(input ?? '');
      if (/[\s_-]+$/.test(original) || original.endsWith(replacement)) {
        out += replacement;
      }
    }
  }

  return out;
}

export function createSlugify(defaults: SlugifyOptions = {}): SlugifyFn {
  return (input, options = {}) => slugify(input, mergeOptions(defaults, options));
}

export function slugifyWithCounter(defaults: SlugifyOptions = {}): SlugifyFn & { reset: () => void } {
  const counts = new Map<string, number>();
  const fn = ((input, options = {}) => {
    const merged = mergeOptions(defaults, options);
    const base = slugify(input, merged);
    if (!base) return '';
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    if (seen === 0) return base;
    const separator = resolveSeparator(merged);
    return `${base}${separator}${seen + 1}`;
  }) as SlugifyFn & { reset: () => void };
  fn.reset = () => counts.clear();
  return fn;
}
