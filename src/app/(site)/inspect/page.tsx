import { redirect } from "next/navigation";
import { InspectionCheckoutForm } from "@/components/inspection-checkout-form";
import { getCurrentUser } from "@/lib/auth/admin";
import { listWatchlistedPropertiesForUser } from "@/lib/data/engagement";

export const dynamic = "force-dynamic";

export default async function InspectPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/inspect");
  }

  const sp = await searchParams;
  const fromQuery = (sp.ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const watchlist = await listWatchlistedPropertiesForUser(user.id);
  const initialSelectedIds = [...new Set(fromQuery)];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Book a paid inspection</h1>
        <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          Pay a non-refundable inspection fee through Paystack. You can bundle up to ten (10) listings in one payment —
          extra listings cost slightly less so the total scales gently. After payment, those listings stop accepting new
          inspection bookings until the owner opens them again.
        </p>
      </header>

      <InspectionCheckoutForm initialSelectedIds={initialSelectedIds} watchlist={watchlist} />
    </div>
  );
}
