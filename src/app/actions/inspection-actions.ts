"use server";

import { getCurrentUser, getProfile } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { inspectionFeeTotalNgn } from "@/lib/inspection-pricing";
import { paystackInitializeTransaction } from "@/lib/paystack";
import { getSiteUrl } from "@/lib/site-url";

function readIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.map((x) => String(x)).filter(Boolean))];
  } catch {
    return [];
  }
}

export async function resolveListingSlugForInspection(
  slug: string,
): Promise<{ id?: string; title?: string; error?: string }> {
  const s = slug.trim().toLowerCase();
  if (!s) return { error: "Enter a listing link or slug." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, published, inspection_locked")
    .eq("slug", s)
    .maybeSingle();
  if (error || !data) return { error: "Listing not found." };
  if (!data.published) return { error: "That listing is not public." };
  if (data.inspection_locked) return { error: "That listing is not accepting new inspection bookings right now." };
  return { id: data.id as string, title: data.title as string };
}

export async function startInspectionCheckout(formData: FormData): Promise<
  | { authorizationUrl: string }
  | { error: string }
> {
  const user = await getCurrentUser();
  if (!user?.email) return { error: "Sign in with an email address to pay the inspection fee." };
  const profile = await getProfile();
  if (!profile) return { error: "Your profile could not be loaded." };

  const propertyIds = readIds(String(formData.get("property_ids") ?? "[]"));
  if (propertyIds.length === 0) return { error: "Select at least one property to inspect." };
  if (propertyIds.length > 10) return { error: "You can include at most 10 properties per payment." };

  let amountNgn: number;
  try {
    amountNgn = inspectionFeeTotalNgn(propertyIds.length);
  } catch {
    return { error: "Invalid number of properties." };
  }

  const applicant_full_name = String(formData.get("applicant_full_name") ?? "").trim();
  const applicant_address = String(formData.get("applicant_address") ?? "").trim();
  const applicant_phone = String(formData.get("applicant_phone") ?? "").trim();
  const applicant_occupation = String(formData.get("applicant_occupation") ?? "").trim();
  const applicant_state_of_origin = String(formData.get("applicant_state_of_origin") ?? "").trim();
  const applicant_relationship_status = String(formData.get("applicant_relationship_status") ?? "").trim();
  const applicant_organization = String(formData.get("applicant_organization") ?? "").trim();
  const occupantsRaw = Number(formData.get("applicant_num_occupants"));

  if (!applicant_full_name || !applicant_address || !applicant_phone) {
    return { error: "Name, address, and phone are required." };
  }
  if (!applicant_occupation || !applicant_state_of_origin || !applicant_relationship_status) {
    return { error: "Occupation, state of origin, and relationship status are required." };
  }
  if (!applicant_organization) {
    return { error: "Organization or company name is required." };
  }
  if (!Number.isFinite(occupantsRaw) || occupantsRaw < 1) {
    return { error: "Number of occupants must be at least 1." };
  }

  const supabase = await createClient();
  const { data: props, error: pErr } = await supabase
    .from("properties")
    .select("id, published, inspection_locked, slug")
    .in("id", propertyIds);
  if (pErr || !props || props.length !== propertyIds.length) {
    return { error: "One or more selected listings are no longer available." };
  }
  for (const p of props) {
    if (!p.published) return { error: "One of the listings is not published." };
    if (p.inspection_locked) {
      return {
        error:
          "One of the listings already has a paid inspection in progress. The owner must re-open it before you can book.",
      };
    }
  }

  const reference = `ezr_${crypto.randomUUID().replace(/-/g, "")}`;
  const { data: booking, error: bErr } = await supabase
    .from("inspection_bookings")
    .insert({
      user_id: profile.id,
      applicant_full_name,
      applicant_address,
      applicant_phone,
      applicant_occupation,
      applicant_state_of_origin,
      applicant_relationship_status,
      applicant_organization,
      applicant_num_occupants: Math.floor(occupantsRaw),
      property_count: propertyIds.length,
      amount_ngn: amountNgn,
      status: "pending_payment",
      paystack_reference: reference,
    })
    .select("id")
    .single();

  if (bErr || !booking) {
    return { error: bErr?.message ?? "Could not start checkout." };
  }

  const lines = propertyIds.map((property_id) => ({
    booking_id: booking.id as string,
    property_id,
  }));
  const { error: lErr } = await supabase.from("inspection_booking_properties").insert(lines);
  if (lErr) {
    await supabase.from("inspection_bookings").delete().eq("id", booking.id as string);
    return { error: lErr.message };
  }

  const init = await paystackInitializeTransaction({
    email: user.email,
    amountKobo: Math.round(amountNgn * 100),
    reference,
    callbackUrl: `${getSiteUrl()}/inspect/complete`,
    metadata: {
      booking_id: String(booking.id),
      property_count: String(propertyIds.length),
    },
  });

  if (!init.status || !init.data?.authorization_url) {
    await supabase.from("inspection_booking_properties").delete().eq("booking_id", booking.id as string);
    await supabase.from("inspection_bookings").delete().eq("id", booking.id as string);
    return { error: init.message ?? "Could not reach Paystack. Try again shortly." };
  }

  await supabase
    .from("inspection_bookings")
    .update({ paystack_access_code: init.data.access_code, updated_at: new Date().toISOString() })
    .eq("id", booking.id as string);

  return { authorizationUrl: init.data.authorization_url };
}
