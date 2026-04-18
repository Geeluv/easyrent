"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NIGERIA_STATES } from "@/lib/nigeria-states";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [maxRent, setMaxRent] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    if (state) qs.set("state", state);
    if (city.trim()) qs.set("city", city.trim());
    if (maxRent) qs.set("max_rent", maxRent);
    const suffix = qs.toString();
    router.push(suffix ? `/listings?${suffix}` : "/listings");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 grid gap-3 rounded-2xl border border-white/15 bg-black/20 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-12 lg:items-end"
    >
      <label className="flex flex-col gap-1 text-sm lg:col-span-4">
        <span className="font-medium text-emerald-50/90">What are you looking for?</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. mini flat, gated estate, borehole"
          className="rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm lg:col-span-2">
        <span className="font-medium text-emerald-50/90">State</span>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
        >
          <option value="">Any</option>
          {NIGERIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm lg:col-span-3">
        <span className="font-medium text-emerald-50/90">City / area</span>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Lekki, Wuse"
          className="rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm lg:col-span-2">
        <span className="font-medium text-emerald-50/90">Max rent / month (₦)</span>
        <input
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          type="number"
          min={0}
          placeholder="No max"
          className="rounded-xl border border-white/20 bg-white/95 px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
        />
      </label>
      <div className="lg:col-span-1">
        <button
          type="submit"
          className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
        >
          Search
        </button>
      </div>
    </form>
  );
}
