import { createClient } from "@/lib/supabase/server";
import { normalizeProperty, type PropertyWithRelations } from "@/lib/data/properties";

export type SaverWithProfile = {
  user_id: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

export async function getSavedPropertyIdsForUser(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("property_saves").select("property_id").eq("user_id", userId);
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map((r) => r.property_id as string);
}

export async function getWatchlistPropertyIdsForUser(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_inspection_watchlist")
    .select("property_id")
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map((r) => r.property_id as string);
}

export async function listSaversForProperty(propertyId: string): Promise<SaverWithProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_saves")
    .select("user_id, created_at, profiles(full_name)")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map((row: unknown) => {
    const r = row as {
      user_id: string;
      created_at: string;
      profiles: { full_name: string | null } | { full_name: string | null }[] | null;
    };
    const prof = Array.isArray(r.profiles) ? r.profiles[0] ?? null : r.profiles;
    return { user_id: r.user_id, created_at: r.created_at, profiles: prof } satisfies SaverWithProfile;
  });
}

export async function listWatchlistedPropertiesForUser(userId: string): Promise<PropertyWithRelations[]> {
  const supabase = await createClient();
  const { data: rows, error: wErr } = await supabase
    .from("property_inspection_watchlist")
    .select("property_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (wErr || !rows?.length) {
    if (wErr) console.error(wErr);
    return [];
  }
  const ids = rows.map((r) => r.property_id as string);
  const { data, error } = await supabase
    .from("properties")
    .select(`*, property_fees:property_fees(*), property_media:property_media(*)`)
    .in("id", ids)
    .eq("published", true);
  if (error) {
    console.error(error);
    return [];
  }
  const items = ((data as PropertyWithRelations[]) ?? []).map(normalizeProperty);
  const byId = new Map(items.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as PropertyWithRelations[];
}
