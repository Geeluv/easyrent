import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WatchlistActions } from "@/components/watchlist-actions";
import { getCurrentUser } from "@/lib/auth/admin";
import { listWatchlistedPropertiesForUser } from "@/lib/data/engagement";
import { publicListingUrl } from "@/lib/storage";
import { annualFromMonthly, buildPropertyTagline, formatCurrencyNGN, formatListedAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

function coverUrl(storagePath: string | undefined): string | null {
  if (!storagePath) return null;
  return publicListingUrl(storagePath);
}

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/watchlist");

  const items = await listWatchlistedPropertiesForUser(user.id);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Inspection watchlist</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Listings you are tracking before paying the inspection fee. Use{" "}
          <Link href="/inspect" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
            Book inspection
          </Link>{" "}
          to bundle them on Paystack.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          Nothing here yet. Open a listing and choose &quot;Watch for inspection&quot;.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((p) => {
            const img = (p.property_media ?? []).find((m) => m.media_type === "image");
            const url = coverUrl(img?.storage_path);
            const annual = annualFromMonthly(Number(p.rent_monthly));
            return (
              <li
                key={p.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:w-56 dark:bg-zinc-900">
                  {url ? (
                    <Image src={url} alt="" fill className="object-cover" sizes="224px" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500">No photo</div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        <Link href={`/listings/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {p.city}, {p.state}
                        {p.area ? ` · ${p.area}` : ""}
                      </p>
                      <p className="text-xs text-zinc-500">{formatListedAgo(p.created_at)}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{buildPropertyTagline(p)}</p>
                    </div>
                    <WatchlistActions propertyId={p.id} listingSlug={p.slug} />
                  </div>
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-400">
                    {formatCurrencyNGN(Number(p.rent_monthly))}
                    <span className="text-xs font-normal text-zinc-500"> / month</span>
                  </p>
                  <p className="text-xs text-zinc-500">≈ {formatCurrencyNGN(annual)} per year</p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/inspect?ids=${encodeURIComponent(p.id)}`}
                      className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      Include in inspection checkout
                    </Link>
                    {p.inspection_locked ? (
                      <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                        Inspection bookings closed until owner re-opens
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
