"use client";

import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";
import { useMemo } from "react";
import { formatCurrencyNGN } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

export type MapMarkerProperty = {
  id: string;
  slug: string;
  title: string;
  latitude: number;
  longitude: number;
  rent_monthly: number;
  city: string;
  state: string;
};

export function ListingsMap({ markers }: { markers: MapMarkerProperty[] }) {
  const icon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    [],
  );

  const bounds = useMemo(() => {
    if (markers.length === 0) return null;
    const latLngs = markers.map((m) => [m.latitude, m.longitude] as [number, number]);
    return new LatLngBounds(latLngs).pad(0.02);
  }, [markers]);

  if (markers.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        No listings with coordinates yet. Admins should add latitude and longitude to each property.
      </div>
    );
  }

  return (
    <MapContainer
      bounds={bounds ?? undefined}
      className="z-0 h-[min(70vh,560px)] w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
      scrollWheelZoom
      style={{ minHeight: 420 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.latitude, m.longitude]} icon={icon}>
          <Popup>
            <div className="max-w-[220px] space-y-1 text-sm">
              <p className="font-semibold leading-snug">{m.title}</p>
              <p className="text-xs text-zinc-600">
                {m.city}, {m.state}
              </p>
              <p className="text-xs font-semibold text-emerald-800">{formatCurrencyNGN(Number(m.rent_monthly))} / mo</p>
              <Link href={`/listings/${m.slug}`} className="text-xs font-semibold text-emerald-700 underline">
                View listing
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
