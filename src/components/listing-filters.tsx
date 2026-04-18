import Link from "next/link";
import { NIGERIA_STATES } from "@/lib/nigeria-states";
import { AMENITY_OPTIONS } from "@/lib/types";

type SearchParams = Record<string, string | string[] | undefined>;

export function ListingFilters({ searchParams }: { searchParams: SearchParams }) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const state = typeof searchParams.state === "string" ? searchParams.state : "";
  const city = typeof searchParams.city === "string" ? searchParams.city : "";
  const minRent = typeof searchParams.min_rent === "string" ? searchParams.min_rent : "";
  const maxRent = typeof searchParams.max_rent === "string" ? searchParams.max_rent : "";
  const bedrooms = typeof searchParams.bedrooms === "string" ? searchParams.bedrooms : "";
  const minSize = typeof searchParams.min_size === "string" ? searchParams.min_size : "";
  const maxSize = typeof searchParams.max_size === "string" ? searchParams.max_size : "";
  const property_type = typeof searchParams.property_type === "string" ? searchParams.property_type : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const amenitiesRaw = searchParams.amenities;
  const amenityList =
    typeof amenitiesRaw === "string"
      ? amenitiesRaw.split(",").filter(Boolean)
      : Array.isArray(amenitiesRaw)
        ? amenitiesRaw
        : [];

  return (
    <form className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40" method="get">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">Keywords</span>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title or description (e.g. gated, Lekki, borehole)"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">State</span>
          <select
            name="state"
            defaultValue={state}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Any</option>
            {NIGERIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">City</span>
          <input
            name="city"
            defaultValue={city}
            placeholder="e.g. Lekki"
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Property type</span>
          <select
            name="property_type"
            defaultValue={property_type}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Any</option>
            <option value="flat">Flat</option>
            <option value="self_contain">Self contain</option>
            <option value="mini_flat">Mini flat</option>
            <option value="duplex">Duplex</option>
            <option value="bungalow">Bungalow</option>
            <option value="terraced">Terraced</option>
            <option value="penthouse">Penthouse</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Min rent (₦)</span>
          <input
            name="min_rent"
            type="number"
            min={0}
            defaultValue={minRent}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Max rent (₦)</span>
          <input
            name="max_rent"
            type="number"
            min={0}
            defaultValue={maxRent}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Min bedrooms</span>
          <input
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={bedrooms}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Min size (m²)</span>
          <input
            name="min_size"
            type="number"
            min={0}
            defaultValue={minSize}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Max size (m²)</span>
          <input
            name="max_size"
            type="number"
            min={0}
            defaultValue={maxSize}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Amenities (match all selected)</legend>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="amenities"
                value={a}
                defaultChecked={amenityList.includes(a)}
              />
              <span className="capitalize">{a.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          Apply filters
        </button>
        <Link href="/listings" className="rounded-lg border border-zinc-300 px-4 py-2 font-semibold dark:border-zinc-700">
          Reset
        </Link>
      </div>
    </form>
  );
}
