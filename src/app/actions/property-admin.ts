"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function parseFees(formData: FormData): { label: string; amount: number; sort_order: number }[] {
  const labels = formData.getAll("fee_label");
  const amounts = formData.getAll("fee_amount");
  const out: { label: string; amount: number; sort_order: number }[] = [];
  for (let i = 0; i < Math.min(labels.length, amounts.length); i++) {
    const label = String(labels[i] ?? "").trim();
    const amt = Number(amounts[i]);
    if (!label || !Number.isFinite(amt) || amt < 0) continue;
    out.push({ label, amount: amt, sort_order: i });
  }
  return out;
}

function parseAmenities(formData: FormData): string[] {
  const raw = String(formData.get("amenities") ?? "");
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createPropertyAction(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim() || null;
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const size_sqm = formData.get("size_sqm") ? Number(formData.get("size_sqm")) : null;
  const property_type = String(formData.get("property_type") ?? "other");
  const rent_monthly = Number(formData.get("rent_monthly"));
  const published = formData.get("published") === "on";

  if (!title || !state || !city) {
    return { error: "Title, state, and city are required." };
  }
  if (!Number.isFinite(rent_monthly) || rent_monthly < 0) {
    return { error: "Valid monthly rent is required." };
  }

  const base = slugify(title);
  const slug = `${base}-${crypto.randomUUID().slice(0, 8)}`;

  const amenities = parseAmenities(formData);

  const { data: property, error: propErr } = await supabase
    .from("properties")
    .insert({
      slug,
      title,
      description,
      state,
      city,
      area,
      bedrooms: Number.isFinite(bedrooms) ? bedrooms : 1,
      bathrooms: Number.isFinite(bathrooms) ? bathrooms : 1,
      size_sqm: Number.isFinite(size_sqm as number) ? size_sqm : null,
      property_type,
      rent_monthly,
      currency: "NGN",
      amenities,
      published,
      created_by: admin.id,
    })
    .select("id")
    .single();

  if (propErr || !property) {
    return { error: propErr?.message ?? "Could not create listing." };
  }

  const fees = parseFees(formData);
  if (fees.length > 0) {
    await supabase.from("property_fees").insert(
      fees.map((f) => ({
        property_id: property.id,
        label: f.label,
        amount: f.amount,
        sort_order: f.sort_order,
      })),
    );
  }

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  return { ok: true as const, id: property.id };
}

export async function updatePropertyAction(propertyId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim() || null;
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const size_sqm = formData.get("size_sqm") ? Number(formData.get("size_sqm")) : null;
  const property_type = String(formData.get("property_type") ?? "other");
  const rent_monthly = Number(formData.get("rent_monthly"));
  const published = formData.get("published") === "on";

  if (!title || !state || !city) {
    console.error("updatePropertyAction: missing title, state, or city");
    return;
  }

  const amenities = parseAmenities(formData);

  const { error } = await supabase
    .from("properties")
    .update({
      title,
      description,
      state,
      city,
      area,
      bedrooms: Number.isFinite(bedrooms) ? bedrooms : 1,
      bathrooms: Number.isFinite(bathrooms) ? bathrooms : 1,
      size_sqm: Number.isFinite(size_sqm as number) ? size_sqm : null,
      property_type,
      rent_monthly,
      amenities,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId);

  if (error) {
    console.error(error.message);
    return;
  }

  await supabase.from("property_fees").delete().eq("property_id", propertyId);
  const fees = parseFees(formData);
  if (fees.length > 0) {
    await supabase.from("property_fees").insert(
      fees.map((f) => ({
        property_id: propertyId,
        label: f.label,
        amount: f.amount,
        sort_order: f.sort_order,
      })),
    );
  }

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath(`/listings`);
}

export async function registerMediaAction(
  propertyId: string,
  storagePath: string,
  mediaType: "image" | "video",
  sortOrder: number,
): Promise<{ ok?: true; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("property_media").insert({
    property_id: propertyId,
    storage_path: storagePath,
    media_type: mediaType,
    sort_order: sortOrder,
  });
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/admin/listings/${propertyId}/edit`);
  revalidatePath("/listings");
  return { ok: true };
}

export async function deletePropertyMediaAction(mediaId: string, propertyId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: row } = await supabase.from("property_media").select("storage_path").eq("id", mediaId).single();
  if (row?.storage_path) {
    await supabase.storage.from("listings").remove([row.storage_path]);
  }
  await supabase.from("property_media").delete().eq("id", mediaId);
  revalidatePath(`/admin/listings/${propertyId}/edit`);
  revalidatePath("/listings");
}
