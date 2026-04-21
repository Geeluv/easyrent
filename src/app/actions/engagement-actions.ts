"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/admin";

export async function togglePropertySave(
  propertyId: string,
  listingSlug?: string,
): Promise<{ saved: boolean; error?: string }> {
  const profile = await getProfile();
  if (!profile) return { saved: false, error: "Sign in to save listings." };

  const supabase = await createClient();
  const { data: prop } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("published", true)
    .maybeSingle();
  if (!prop) return { saved: false, error: "Listing not found." };

  const { data: existing } = await supabase
    .from("property_saves")
    .select("user_id")
    .eq("user_id", profile.id)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (existing) {
    await supabase.from("property_saves").delete().eq("user_id", profile.id).eq("property_id", propertyId);
    revalidatePath("/listings");
    if (listingSlug) revalidatePath(`/listings/${listingSlug}`);
    revalidatePath("/watchlist");
    return { saved: false };
  }

  const { error } = await supabase.from("property_saves").insert({ user_id: profile.id, property_id: propertyId });
  if (error) {
    return { saved: false, error: error.message };
  }
  revalidatePath("/listings");
  if (listingSlug) revalidatePath(`/listings/${listingSlug}`);
  revalidatePath("/watchlist");
  return { saved: true };
}

export async function toggleInspectionWatchlist(
  propertyId: string,
  listingSlug?: string,
): Promise<{ onList: boolean; error?: string }> {
  const profile = await getProfile();
  if (!profile) return { onList: false, error: "Sign in to use the inspection watchlist." };

  const supabase = await createClient();
  const { data: prop } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("published", true)
    .maybeSingle();
  if (!prop) return { onList: false, error: "Listing not found." };

  const { data: existing } = await supabase
    .from("property_inspection_watchlist")
    .select("user_id")
    .eq("user_id", profile.id)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("property_inspection_watchlist")
      .delete()
      .eq("user_id", profile.id)
      .eq("property_id", propertyId);
    revalidatePath("/listings");
    if (listingSlug) revalidatePath(`/listings/${listingSlug}`);
    revalidatePath("/inspect");
    revalidatePath("/watchlist");
    return { onList: false };
  }

  const { error } = await supabase
    .from("property_inspection_watchlist")
    .insert({ user_id: profile.id, property_id: propertyId });
  if (error) {
    return { onList: false, error: error.message };
  }
  revalidatePath("/listings");
  if (listingSlug) revalidatePath(`/listings/${listingSlug}`);
  revalidatePath("/inspect");
  revalidatePath("/watchlist");
  return { onList: true };
}
