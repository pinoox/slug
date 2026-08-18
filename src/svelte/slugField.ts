import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { sanitizeSlug, slugify } from '../index';

export interface SlugFieldStores {
  slug: Writable<string>;
  manual: Writable<boolean>;
  onSlugInput: (value: string) => void;
  resetManual: () => void;
  enableManual: () => void;
}

export function slugField(title: Readable<string>): SlugFieldStores {
  const manual = writable(false);
  const slug = writable(slugify(get(title)));

  title.subscribe((value) => {
    if (!get(manual)) slug.set(slugify(value));
  });

  const onSlugInput = (value: string) => {
    manual.set(true);
    slug.set(sanitizeSlug(value));
  };

  const resetManual = () => {
    manual.set(false);
    slug.set(slugify(get(title)));
  };

  const enableManual = () => {
    manual.set(true);
  };

  return { slug, manual, onSlugInput, resetManual, enableManual };
}

export function derivedSlug(title: Readable<string>): Readable<string> {
  return derived(title, (value) => slugify(value));
}
