import Link from "next/link";
import { FeaturedAreas } from "@/components/featured-areas";
import { HeroSearch } from "@/components/hero-search";
import { PropertyCard } from "@/components/property-card";
import { countPublishedProperties, listPublishedProperties } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ items }, totalCount] = await Promise.all([
    listPublishedProperties({ pageSize: 6, sort: "newest" }),
    countPublishedProperties(),
  ]);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 px-6 py-14 text-white shadow-xl">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/90">Rentals only · Nigeria</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
            Find your next home — with rent and fees spelled out upfront.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-emerald-100/95 sm:text-lg">
            EasyRent focuses purely on lettings: search by location and budget, compare total move-in costs, skim photos
            and reviews, then shortlist faster than scrolling generic buy-and-rent portals.
          </p>
          <HeroSearch />
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4 text-sm text-emerald-50/95">
              <div>
                <p className="text-2xl font-bold tabular-nums">{totalCount}</p>
                <p className="text-xs text-emerald-200/90">Published rentals</p>
              </div>
              <div className="hidden h-10 w-px bg-white/20 sm:block" aria-hidden />
              <div>
                <p className="text-2xl font-bold tabular-nums">36+1</p>
                <p className="text-xs text-emerald-200/90">States &amp; FCT filters</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/listings"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"
              >
                Browse all rentals
              </Link>
              <Link
                href="/artisans"
                className="rounded-xl border border-white/35 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Find artisans
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-200/80">Popular areas</p>
            <div className="mt-3">
              <FeaturedAreas />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40 sm:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">True cost view</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            See base rent beside agency, legal, caution, and service charges when landlords add them — fewer surprises at
            inspection.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Built for renters</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Keyword search, amenities filters, and yearly rent hints help you compare apples to apples, not just headline
            monthly figures.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">After you move</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Connect with artisans for painting, tiling, and fixes — scoped to Nigerian states so referrals stay relevant.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Recently added</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Fresh lettings across cities we cover.</p>
          </div>
          <Link href="/listings" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
            See all
          </Link>
        </div>
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            No published listings yet. Connect Supabase, run migrations (including the demo seed), sign in as admin, and
            publish properties.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
