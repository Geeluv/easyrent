import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ListingEngagementBar } from "@/components/listing-engagement";
import { ListingLocationMap } from "@/components/listing-location-map";
import { MediaCarousel } from "@/components/media-carousel";
import { ReviewForm } from "@/components/review-form";
import { ShareButtons } from "@/components/share-buttons";
import { getCurrentUser } from "@/lib/auth/admin";
import { getSavedPropertyIdsForUser, getWatchlistPropertyIdsForUser } from "@/lib/data/engagement";
import { getPublishedPropertyBySlug } from "@/lib/data/properties";
import { listReviewsForProperty } from "@/lib/data/reviews";
import { getSiteUrl } from "@/lib/site-url";
import { publicListingUrl } from "@/lib/storage";
import { AMENITY_OPTIONS } from "@/lib/types";
import { annualFromMonthly, buildPropertyTagline, formatCurrencyNGN, formatListedAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getPublishedPropertyBySlug(slug);
  if (!p) {
    return { title: "Listing | EasyRent" };
  }
  const site = getSiteUrl();
  const firstImg = (p.property_media ?? []).find((m) => m.media_type === "image");
  const ogImage = firstImg ? publicListingUrl(firstImg.storage_path) : undefined;
  const desc =
    p.description?.slice(0, 180) ??
    `${p.bedrooms} bed rental in ${p.city}, ${p.state}. ${formatCurrencyNGN(Number(p.rent_monthly))} per month.`;

  return {
    title: `${p.title} | EasyRent`,
    description: desc,
    openGraph: {
      title: p.title,
      description: desc,
      type: "website",
      url: `${site}/listings/${p.slug}`,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: desc,
      images: ogImage ? [ogImage] : [],
    },
  };
}

function labelAmenity(key: string): string {
  const found = AMENITY_OPTIONS.find((a) => a === key);
  return found ? found.replace(/_/g, " ") : key;
}

export default async function ListingDetailPage(props: Props) {
  const { slug } = await props.params;
  const p = await getPublishedPropertyBySlug(slug);
  if (!p) {
    notFound();
  }

  const user = await getCurrentUser();
  const savedIds = user ? await getSavedPropertyIdsForUser(user.id) : [];
  const watchIds = user ? await getWatchlistPropertyIdsForUser(user.id) : [];
  const initialSaved = savedIds.includes(p.id);
  const initialWatchlisted = watchIds.includes(p.id);
  const reviews = await listReviewsForProperty(p.id);
  const shareUrl = `${getSiteUrl()}/listings/${p.slug}`;

  const fees = p.property_fees ?? [];
  const extraTotal = fees.reduce((s, f) => s + Number(f.amount), 0);

  return (
    <article className="space-y-10">
      <MediaCarousel media={p.property_media ?? []} title={p.title} />

      <header className="space-y-3">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
          {p.city}, {p.state}
          {p.area ? ` · ${p.area}` : ""}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{p.title}</h1>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {formatCurrencyNGN(Number(p.rent_monthly))}
            <span className="text-base font-normal text-zinc-500"> / month</span>
          </p>
          <p className="text-sm text-zinc-500">
            ≈ {formatCurrencyNGN(annualFromMonthly(Number(p.rent_monthly)))} per year (12 × monthly rent)
          </p>
        </div>
        <ShareButtons url={shareUrl} title={p.title} />
        <p className="text-sm text-amber-800 dark:text-amber-300">{formatListedAgo(p.created_at)}</p>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{buildPropertyTagline(p)}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {p.size_sqm ? `${p.size_sqm} m² · ` : ""}Type: {p.property_type.replace(/_/g, " ")}
        </p>
        {user ? (
          <ListingEngagementBar
            propertyId={p.id}
            listingSlug={p.slug}
            initialSaved={initialSaved}
            initialWatchlisted={initialWatchlisted}
          />
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <Link href={`/login?next=${encodeURIComponent(`/listings/${p.slug}`)}`} className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
              Sign in
            </Link>{" "}
            to save this listing or add it to your inspection watchlist.
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Inspection fee (Paystack)</h2>
        {p.inspection_locked ? (
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
            This listing is not accepting new inspection bookings until the owner re-opens it after a recent paid
            inspection request.
          </p>
        ) : (
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            Pay the non-refundable inspection fee to profile yourself for the landlord. You can bundle several homes in
            one checkout — see pricing on the booking page.
          </p>
        )}
        {user ? (
          p.inspection_locked ? (
            <span className="mt-4 inline-flex cursor-not-allowed rounded-lg bg-zinc-400 px-4 py-2 text-sm font-semibold text-white">
              Book inspection for this listing
            </span>
          ) : (
            <Link
              href={`/inspect?ids=${encodeURIComponent(p.id)}`}
              className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Book inspection for this listing
            </Link>
          )
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(`/inspect?ids=${encodeURIComponent(p.id)}`)}`}
            className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Sign in to book inspection
          </Link>
        )}
      </section>

      {p.description ? (
        <section className="prose prose-zinc max-w-none dark:prose-invert">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{p.description}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Rent & fees</h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-2 text-zinc-600 dark:text-zinc-400">Base rent (monthly)</td>
              <td className="py-2 text-right font-medium">{formatCurrencyNGN(Number(p.rent_monthly))}</td>
            </tr>
            {fees.map((f) => (
              <tr key={f.id} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-2 text-zinc-600 dark:text-zinc-400">{f.label}</td>
                <td className="py-2 text-right font-medium">{formatCurrencyNGN(Number(f.amount))}</td>
              </tr>
            ))}
            <tr>
              <td className="py-2 font-semibold text-zinc-800 dark:text-zinc-200">Rent + listed fees (excl. rent duplicity)</td>
              <td className="py-2 text-right font-semibold">
                {formatCurrencyNGN(Number(p.rent_monthly) + extraTotal)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-zinc-500">
          Confirm all charges with the agent or landlord before paying. Figures shown are those recorded on EasyRent.
        </p>
      </section>

      {p.latitude != null && p.longitude != null ? (
        <ListingLocationMap lat={Number(p.latitude)} lng={Number(p.longitude)} label={p.title} />
      ) : (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          Map location is not set for this listing yet.
        </section>
      )}

      {(p.amenities ?? []).length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Amenities & details</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {(p.amenities ?? []).map((a) => (
              <li
                key={a}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm capitalize text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
              >
                {labelAmenity(a)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
        <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-100">Planning a revamp?</h2>
        <p className="mt-1 text-sm text-amber-950/80 dark:text-amber-100/90">
          Browse verified artisans who list Nigerian service areas — plumbers, tilers, painters, and more.
        </p>
        <Link
          href={`/artisans?state=${encodeURIComponent(p.state)}`}
          className="mt-4 inline-flex rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800"
        >
          Find artisans in {p.state}
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews yet — be the first to share your experience.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {r.profiles?.full_name?.trim() || "Renter"}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">{r.rating} / 5</p>
                </div>
                {r.body ? <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{r.body}</p> : null}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <ReviewForm propertyId={p.id} />
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </section>
    </article>
  );
}
