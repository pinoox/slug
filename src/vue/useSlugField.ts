import { ref } from 'vue';
import { sanitizeSlug, slugify } from '../index';

export interface UseSlugFieldOptions {
  manualKey?: string;
  onTitleInput?: (value: string) => void;
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
    if (!isManual()) form.slug = slugify(val);
  };

  const resolveSlug = (title: string) => (form.slug || slugify(title)).trim();

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
    form.slug = sanitizeSlug(value);
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
