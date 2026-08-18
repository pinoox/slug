export function sanitizeSlug(input: string | null | undefined): string {
  return String(input ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}
