import Link from "next/link";

const AREAS: { label: string; href: string }[] = [
  { label: "Lagos · Lekki", href: "/listings?state=Lagos&city=Lekki" },
  { label: "Lagos · Ajah", href: "/listings?state=Lagos&city=Ajah" },
  { label: "Lagos · Yaba", href: "/listings?state=Lagos&city=Yaba" },
  { label: "FCT · Wuse", href: "/listings?state=FCT&city=Wuse" },
  { label: "Port Harcourt", href: "/listings?state=Rivers&city=Port%20Harcourt" },
  { label: "Ibadan", href: "/listings?state=Oyo&city=Ibadan" },
];

export function FeaturedAreas() {
  return (
    <div className="flex flex-wrap gap-2">
      {AREAS.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="rounded-full border border-emerald-200/60 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50 backdrop-blur transition hover:bg-white/20"
        >
          {a.label}
        </Link>
      ))}
    </div>
  );
}
