import { ref } from 'vue';
import { sanitizeSlug, slugify } from '../index';
import type { SlugifyOptions } from '../index';

export interface UseSlugFieldOptions {
  manualKey?: string;
  onTitleInput?: (value: string) => void;
  slugify?: SlugifyOptions;
}

export function useSlugField(
  form: { slug: string } & Record<string, unknown>,
  options: UseSlugFieldOptions = {},
) {
  const slugTouched = ref(false);
  const manualKey = options.manualKey || 'slugManual';

  const isManual = () => slugTouched.value || !!form[manualKey];

  const onTitleInput = (val: string) => {
    options.onTitleInput?.(val);
    if (!isManual()) form.slug = slugify(val, options.slugify);
  };

  const resolveSlug = (title: string) => (form.slug || slugify(title, options.slugify)).trim();

  const resetSlugManual = () => {
    form[manualKey] = false;
    slugTouched.value = false;
  };

  const enableSlugManual = () => {
    form[manualKey] = true;
    slugTouched.value = true;
  };

  const onSlugInput = (value: string) => {
    slugTouched.value = true;
    form.slug = sanitizeSlug(value, {
      preserveTrailingDash: options.slugify?.preserveTrailingDash,
    });
  };

  return {
    slugTouched,
    onTitleInput,
    onSlugInput,
    resolveSlug,
    resetSlugManual,
    enableSlugManual,
  };
}

export type UseSlugFieldReturn = ReturnType<typeof useSlugField>;
