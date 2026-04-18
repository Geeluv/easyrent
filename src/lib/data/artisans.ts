import { createClient } from "@/lib/supabase/server";
import type { ArtisanRow } from "@/lib/types";

export async function listArtisans(filters?: { state?: string }): Promise<ArtisanRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artisans")
    .select("*")
    .order("verified", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data) {
    return [];
  }

  let rows = data as ArtisanRow[];
  if (filters?.state) {
    rows = rows.filter(
      (a) => !a.service_states?.length || a.service_states.includes(filters.state!),
    );
  }
  return rows;
}
