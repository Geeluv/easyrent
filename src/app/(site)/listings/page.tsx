import Link from "next/link";
import { ListingFilters } from "@/components/listing-filters";
import { PropertyCard } from "@/components/property-card";
import { listPublishedProperties } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

function num(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function amenList(v: string | string[] | undefined): string[] | undefined {
  if (!v) return undefined;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const page = num(typeof sp.page === "string" ? sp.page : undefined) ?? 1;
  const sortParam =
    typeof sp.sort === "string" ? sp.sort : Array.isArray(sp.sort) ? sp.sort[0] : undefined;
  const sort =
    sortParam === "price_asc" || sortParam === "price_desc" || sortParam === "newest"
      ? sortParam
      : "newest";

  const { items, total } = await listPublishedProperties({
    state: typeof sp.state === "string" && sp.state ? sp.state : undefined,
    city: typeof sp.city === "string" && sp.city ? sp.city : undefined,
    q: typeof sp.q === "string" && sp.q.trim() ? sp.q.trim() : undefined,
    minRent: num(typeof sp.min_rent === "string" ? sp.min_rent : undefined),
    maxRent: num(typeof sp.max_rent === "string" ? sp.max_rent : undefined),
    bedrooms: num(typeof sp.bedrooms === "string" ? sp.bedrooms : undefined),
    minSize: num(typeof sp.min_size === "string" ? sp.min_size : undefined),
    maxSize: num(typeof sp.max_size === "string" ? sp.max_size : undefined),
    property_type: typeof sp.property_type === "string" && sp.property_type ? sp.property_type : undefined,
    amenities: amenList(sp.amenities),
    sort,
    page,
    pageSize: 12,
  });

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Homes for rent</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Rentals only — filter by location, budget, rooms, size, amenities, and keywords. Prices in Nigerian Naira.
          </p>
        </div>
        <Link
          href="/listings/map"
          className="shrink-0 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Open map view →
        </Link>
      </div>

      <ListingFilters searchParams={sp} />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {total} {total === 1 ? "listing" : "listings"} found
      </p>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700">
          No listings match these filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <PaginationLink page={page - 1} disabled={page <= 1} sp={sp} label="Previous" />
          <span className="text-sm text-zinc-600">
            Page {page} of {totalPages}
          </span>
          <PaginationLink page={page + 1} disabled={page >= totalPages} sp={sp} label="Next" />
        </div>
      ) : null}
    </div>
  );
}

function PaginationLink({
  page,
  disabled,
  sp,
  label,
}: {
  page: number;
  disabled: boolean;
  sp: Record<string, string | string[] | undefined>;
  label: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v === undefined) return;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    else qs.set(k, v);
  });
  qs.set("page", String(page));
  const href = `/listings?${qs.toString()}`;
  if (disabled) {
    return (
      <span className="text-sm font-medium text-zinc-400" aria-disabled>
        {label}
      </span>
    );
  }
  return (
    <Link href={href} className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
      {label}
    </Link>
  );
}
