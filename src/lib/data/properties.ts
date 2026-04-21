import { createClient } from "@/lib/supabase/server";
import type { PropertyFeeRow, PropertyMediaRow, PropertyRow } from "@/lib/types";

export type PropertyWithRelations = PropertyRow & {
  property_fees: PropertyFeeRow[];
  property_media: PropertyMediaRow[];
};

export type PropertyListFilters = {
  state?: string;
  city?: string;
  q?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  minSize?: number;
  maxSize?: number;
  property_type?: string;
  amenities?: string[];
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 12;

/** Escape % and _ so user input cannot broaden an ilike pattern unexpectedly. */
function escapeIlikePattern(term: string): string {
  return term.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function countPublishedProperties(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("published", true);
  if (error) {
    console.error(error);
    return 0;
  }
  return count ?? 0;
}

export async function listPublishedProperties(
  filters: PropertyListFilters = {},
): Promise<{ items: PropertyWithRelations[]; total: number }> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("properties")
    .select(
      `*, 
      property_fees:property_fees(*), 
      property_media:property_media(*)`,
      { count: "exact" },
    )
    .eq("published", true);

  if (filters.state) q = q.eq("state", filters.state);
  if (filters.city) q = q.ilike("city", `%${filters.city}%`);
  const qTrim = filters.q?.trim();
  if (qTrim) {
    const safe = escapeIlikePattern(qTrim);
    q = q.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
  }
  if (filters.minRent != null) q = q.gte("rent_monthly", filters.minRent);
  if (filters.maxRent != null) q = q.lte("rent_monthly", filters.maxRent);
  if (filters.bedrooms != null) q = q.gte("bedrooms", filters.bedrooms);
  if (filters.minSize != null) q = q.gte("size_sqm", filters.minSize);
  if (filters.maxSize != null) q = q.lte("size_sqm", filters.maxSize);
  if (filters.property_type) q = q.eq("property_type", filters.property_type);
  if (filters.amenities && filters.amenities.length > 0) {
    q = q.contains("amenities", filters.amenities);
  }

  if (filters.sort === "price_asc") {
    q = q.order("rent_monthly", { ascending: true });
  } else if (filters.sort === "price_desc") {
    q = q.order("rent_monthly", { ascending: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) {
    console.error(error);
    return { items: [], total: 0 };
  }

  const items = (data as PropertyWithRelations[] | null)?.map(normalizeProperty) ?? [];
  return { items, total: count ?? items.length };
}

export async function getPublishedPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(`*, property_fees:property_fees(*), property_media:property_media(*)`)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return normalizeProperty(data as PropertyWithRelations);
}

export async function getPropertyByIdForAdmin(id: string): Promise<PropertyWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(`*, property_fees:property_fees(*), property_media:property_media(*)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return normalizeProperty(data as PropertyWithRelations);
}

export function normalizeProperty(p: PropertyWithRelations): PropertyWithRelations {
  const fees = [...(p.property_fees ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const media = [...(p.property_media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const amenities = Array.isArray(p.amenities) ? p.amenities : [];
  const inspection_locked = Boolean((p as PropertyWithRelations & { inspection_locked?: boolean }).inspection_locked);
  return { ...p, property_fees: fees, property_media: media, amenities, inspection_locked };
}

export async function listPublishedPropertiesForMap(): Promise<
  Pick<PropertyRow, "id" | "slug" | "title" | "latitude" | "longitude" | "rent_monthly" | "city" | "state">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, slug, title, latitude, longitude, rent_monthly, city, state")
    .eq("published", true)
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as Pick<PropertyRow, "id" | "slug" | "title" | "latitude" | "longitude" | "rent_monthly" | "city" | "state">[];
}
