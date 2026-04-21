import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Typical yearly total when rent is quoted monthly (12 × monthly). */
export function annualFromMonthly(monthly: number): number {
  return monthly * 12;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const AMENITY_SHORT_LABEL: Record<string, string> = {
  packing: "parking",
  parking_space: "parking space",
  borehole: "borehole",
  water_board: "water board",
  borehole_and_water_board: "borehole & water board",
  water_tank: "water tank",
  prepaid_meter: "prepaid meter",
  air_conditioning: "A/C",
  guest_toilet: "guest toilet",
  kitchen_fitted: "fitted kitchen",
  internet_ready: "internet ready",
  tiled_floors: "tiled floors",
  running_water: "running water",
};

/** Compact feature line for cards (beds/toilets + a few amenities). */
export function buildPropertyTagline(property: { bedrooms: number; bathrooms: number; amenities: string[] }): string {
  const bits: string[] = [
    `${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}`,
    `${property.bathrooms} toilet${property.bathrooms === 1 ? "" : "s"}`,
  ];
  const amenityBits = (property.amenities ?? [])
    .map((k) => AMENITY_SHORT_LABEL[k] ?? k.replace(/_/g, " "))
    .slice(0, 5);
  return [...bits, ...amenityBits].join(" · ");
}

export function formatListedAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recently listed";
  const now = Date.now();
  const diffMs = now - d.getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 0) {
    return `Listed ${d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  if (days === 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 14) return `Listed ${days} days ago`;
  if (days < 70) return `Listed ${Math.round(days / 7)} weeks ago`;
  return `Listed ${d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`;
}
