import Link from "next/link";
import type { MapMarkerProperty } from "@/components/listings-map";
import { ListingsMapSection } from "@/components/listings-map-section";
import { listPublishedPropertiesForMap } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export default async function ListingsMapPage() {
  const raw = await listPublishedPropertiesForMap();
  const markers: MapMarkerProperty[] = raw
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      rent_monthly: Number(r.rent_monthly),
      city: r.city,
      state: r.state,
    }))
    .filter((m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Map of rentals</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Every published listing with coordinates appears here. Tap a pin for rent and a link to the full page.
          </p>
        </div>
        <Link
          href="/listings"
          className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          ← Back to grid
        </Link>
      </div>

      <ListingsMapSection markers={markers} />
    </div>
  );
}
