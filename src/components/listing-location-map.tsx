type Props = {
  lat: number;
  lng: number;
  label: string;
};

export function ListingLocationMap({ lat, lng, label }: Props) {
  const delta = 0.012;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Map location</h2>
      <iframe
        title={`Map: ${label}`}
        src={src}
        className="h-80 w-full rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          target="_blank"
          rel="noreferrer"
        >
          Open location on OpenStreetMap
        </a>
      </p>
    </section>
  );
}
