import { useEffect, useState } from 'react';
import { sanitizeSlug, slugify } from '../index';
import type { SlugifyOptions } from '../index';

export interface UseSlugFieldOptions {
  manual?: boolean;
  slugify?: SlugifyOptions;
}

export function useSlugField(title: string, options: UseSlugFieldOptions = {}) {
  const [manual, setManual] = useState(!!options.manual);
  const [slug, setSlug] = useState(() => slugify(title, options.slugify));

  useEffect(() => {
    if (!manual) setSlug(slugify(title, options.slugify));
  }, [title, manual, options.slugify]);

  const onSlugInput = (value: string) => {
    setManual(true);
    setSlug(sanitizeSlug(value, {
      preserveTrailingDash: options.slugify?.preserveTrailingDash,
    }));
  };

  const resetManual = () => {
    setManual(false);
    setSlug(slugify(title, options.slugify));
  };

  const enableManual = () => {
    setManual(true);
  };

  return {
    slug,
    setSlug,
    manual,
    onSlugInput,
    resetManual,
    enableManual,
  };
}

export type UseSlugFieldReturn = ReturnType<typeof useSlugField>;
