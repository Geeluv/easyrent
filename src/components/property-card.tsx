import Image from "next/image";
import Link from "next/link";
import type { PropertyWithRelations } from "@/lib/data/properties";
import { publicListingUrl } from "@/lib/storage";
import { annualFromMonthly, formatCurrencyNGN } from "@/lib/utils";

function coverUrl(p: PropertyWithRelations): string | null {
  const images = (p.property_media ?? []).filter((m) => m.media_type === "image");
  if (images.length === 0) return null;
  return publicListingUrl(images[0].storage_path);
}

function typeLabel(propertyType: string): string {
  return propertyType.replace(/_/g, " ");
}

export function PropertyCard({ property: p }: { property: PropertyWithRelations }) {
  const url = coverUrl(p);
  const count = (p.property_media ?? []).filter((m) => m.media_type === "image").length;
  const annual = annualFromMonthly(Number(p.rent_monthly));

  return (
    <Link
      href={`/listings/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/[0.06]"
    >
      <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
        {url ? (
          <Image
            src={url}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">No photo yet</div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-emerald-700/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur">
            Rent only
          </span>
          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium capitalize text-white backdrop-blur">
            {typeLabel(p.property_type)}
          </span>
        </div>
        {count > 0 ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            {count} photos
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{p.title}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {p.city}, {p.state}
          {p.area ? ` · ${p.area}` : ""}
        </p>
        <p className="mt-auto pt-2 text-base font-bold text-emerald-800 dark:text-emerald-400">
          {formatCurrencyNGN(Number(p.rent_monthly))}
          <span className="text-xs font-normal text-zinc-500"> / month</span>
        </p>
        <p className="text-xs text-zinc-500">
          ≈ {formatCurrencyNGN(annual)} per year · {p.bedrooms} bed · {p.bathrooms} bath
          {p.size_sqm ? ` · ${p.size_sqm} m²` : ""}
        </p>
      </div>
    </Link>
  );
}
