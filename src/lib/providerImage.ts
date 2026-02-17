/** Build public URL for a provider image from its imageKey. */
export function getProviderImageUrl(imageKey: string | null | undefined): string | null {
  if (!imageKey?.trim()) return null;
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  if (!base) return null;
  const trimmed = base.replace(/\/$/, "");
  return `${trimmed}/${imageKey.trim()}`;
}

/** Build URLs for multiple image keys. */
export function getProviderImageUrls(keys: string[] | null | undefined): string[] {
  if (!keys?.length) return [];
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  if (!base) return [];
  const trimmed = base.replace(/\/$/, "");
  return keys
    .filter((k) => k?.trim())
    .map((k) => `${trimmed}/${k.trim()}`);
}
