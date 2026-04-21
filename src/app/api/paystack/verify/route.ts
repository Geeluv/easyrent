import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { paystackVerifyTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  let body: { reference?: string };
  try {
    body = (await req.json()) as { reference?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  if (!reference) {
    return NextResponse.json({ error: "Missing Paystack reference." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let service;
  try {
    service = createServiceRoleClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Payment verification is not configured (missing SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 },
    );
  }

  const { data: booking, error: bErr } = await service
    .from("inspection_bookings")
    .select("id, user_id, amount_ngn, status")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (bErr || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status === "paid") {
    return NextResponse.json({ ok: true, already: true });
  }

  const verify = await paystackVerifyTransaction(reference);
  if (!verify.status || !verify.data || verify.data.status !== "success") {
    await service
      .from("inspection_bookings")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", booking.id as string);
    return NextResponse.json({ error: verify.message ?? "Payment was not successful." }, { status: 400 });
  }

  const paidKobo = verify.data.amount;
  const expectedKobo = Math.round(Number(booking.amount_ngn) * 100);
  if (paidKobo !== expectedKobo) {
    return NextResponse.json({ error: "Paid amount does not match the booking." }, { status: 400 });
  }

  const { data: lines } = await service
    .from("inspection_booking_properties")
    .select("property_id")
    .eq("booking_id", booking.id as string);
  const propertyIds = (lines ?? []).map((l) => l.property_id as string);

  await service
    .from("inspection_bookings")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", booking.id as string);

  if (propertyIds.length > 0) {
    await service
      .from("properties")
      .update({ inspection_locked: true, updated_at: new Date().toISOString() })
      .in("id", propertyIds);

    const { data: slugRows } = await service.from("properties").select("slug").in("id", propertyIds);
    for (const row of slugRows ?? []) {
      const slug = row.slug as string;
      if (slug) revalidatePath(`/listings/${slug}`);
    }
  }

  revalidatePath("/listings");
  revalidatePath("/inspect");
  for (const id of propertyIds) {
    revalidatePath(`/admin/listings/${id}/edit`);
  }

  return NextResponse.json({ ok: true });
}
