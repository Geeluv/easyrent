import { createClient } from "@/lib/supabase/server";
import type { InspectionBookingRow } from "@/lib/types";

export type InspectionBookingWithLines = InspectionBookingRow & {
  inspection_booking_properties: { property_id: string }[];
};

export async function listInspectionBookingsTouchingProperty(
  propertyId: string,
): Promise<InspectionBookingWithLines[]> {
  const supabase = await createClient();
  const { data: lineRows, error: lErr } = await supabase
    .from("inspection_booking_properties")
    .select("booking_id")
    .eq("property_id", propertyId);
  if (lErr) {
    console.error(lErr);
    return [];
  }
  const bookingIds = [...new Set((lineRows ?? []).map((r) => r.booking_id as string))];
  if (bookingIds.length === 0) return [];

  const { data, error } = await supabase
    .from("inspection_bookings")
    .select(`*, inspection_booking_properties(property_id)`)
    .in("id", bookingIds)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as InspectionBookingWithLines[];
}
