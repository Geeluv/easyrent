import { createClient } from "@/lib/supabase/server";
import type { ReviewRow } from "@/lib/types";

export type ReviewWithAuthor = ReviewRow & {
  profiles: { full_name: string | null } | null;
};

export async function listReviewsForProperty(propertyId: string): Promise<ReviewWithAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, property_id, user_id, rating, body, created_at, profiles(full_name)")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const r = row as unknown as {
      id: string;
      property_id: string;
      user_id: string;
      rating: number;
      body: string | null;
      created_at: string;
      profiles: { full_name: string | null } | null;
    };
    return {
      id: r.id,
      property_id: r.property_id,
      user_id: r.user_id,
      rating: r.rating,
      body: r.body,
      created_at: r.created_at,
      updated_at: r.created_at,
      profiles: r.profiles,
    };
  });
}
