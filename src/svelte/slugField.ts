import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { sanitizeSlug, slugify } from '../index';
import type { SlugifyOptions } from '../index';

export interface SlugFieldStores {
  slug: Writable<string>;
  manual: Writable<boolean>;
  onSlugInput: (value: string) => void;
  resetManual: () => void;
  enableManual: () => void;
}

export function slugField(
  title: Readable<string>,
  options: { slugify?: SlugifyOptions } = {},
): SlugFieldStores {
  const manual = writable(false);
  const slug = writable(slugify(get(title), options.slugify));

  title.subscribe((value) => {
    if (!get(manual)) slug.set(slugify(value, options.slugify));
  });

  const onSlugInput = (value: string) => {
    manual.set(true);
    slug.set(sanitizeSlug(value, {
      preserveTrailingDash: options.slugify?.preserveTrailingDash,
    }));
  };

  const resetManual = () => {
    manual.set(false);
    slug.set(slugify(get(title), options.slugify));
  };

  const enableManual = () => {
    manual.set(true);
  };

  return { slug, manual, onSlugInput, resetManual, enableManual };
}

export function derivedSlug(
  title: Readable<string>,
  options: { slugify?: SlugifyOptions } = {},
): Readable<string> {
  return derived(title, (value) => slugify(value, options.slugify));
}
