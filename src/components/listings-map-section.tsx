"use client";

import dynamic from "next/dynamic";
import type { MapMarkerProperty } from "@/components/listings-map";

const ListingsMap = dynamic(() => import("@/components/listings-map").then((m) => m.ListingsMap), {
  ssr: false,
  loading: () => <p className="text-sm text-zinc-500">Loading map…</p>,
});

export function ListingsMapSection({ markers }: { markers: MapMarkerProperty[] }) {
  return <ListingsMap markers={markers} />;
}
