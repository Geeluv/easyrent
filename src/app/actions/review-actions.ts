"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in to leave a review." };
  }

  const propertyId = String(formData.get("property_id") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!propertyId) {
    return { error: "Missing property." };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: "Pick a rating from 1 to 5." };
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .maybeSingle();

  const ts = new Date().toISOString();
  if (existing?.id) {
    const { error } = await supabase
      .from("reviews")
      .update({ rating, body: body || null, updated_at: ts })
      .eq("id", existing.id);
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("reviews").insert({
      property_id: propertyId,
      user_id: user.id,
      rating,
      body: body || null,
    });
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/listings");
  return { ok: true };
}
