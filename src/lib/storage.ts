export function publicListingUrl(storagePath: string): string {
  const raw = storagePath.trim();
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) {
    return "";
  }
  const path = raw.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/listings/${path}`;
}
