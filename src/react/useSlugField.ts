import { useEffect, useState } from 'react';
import { sanitizeSlug, slugify } from '../index';

export interface UseSlugFieldOptions {
  manual?: boolean;
}

export function useSlugField(title: string, options: UseSlugFieldOptions = {}) {
  const [manual, setManual] = useState(!!options.manual);
  const [slug, setSlug] = useState(() => slugify(title));

  useEffect(() => {
    if (!manual) setSlug(slugify(title));
  }, [title, manual]);

  const onSlugInput = (value: string) => {
    setManual(true);
    setSlug(sanitizeSlug(value));
  };

  const resetManual = () => {
    setManual(false);
    setSlug(slugify(title));
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
