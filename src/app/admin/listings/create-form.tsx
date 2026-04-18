"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPropertyAction } from "@/app/actions/property-admin";
import { NIGERIA_STATES } from "@/lib/nigeria-states";

export function CreateListingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createPropertyAction(formData);
    setPending(false);
    if (res && "error" in res && res.error) {
      setError(res.error);
      return;
    }
    if (res && "ok" in res && res.ok && "id" in res) {
      router.push(`/admin/listings/${res.id}/edit`);
    }
  }

  return (
    <form onSubmit={(ev) => void onSubmit(ev)} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Title</span>
          <input name="title" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Description</span>
          <textarea name="description" rows={4} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">State</span>
          <select name="state" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
            <option value="">Select</option>
            {NIGERIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">City</span>
          <input name="city" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Area (optional)</span>
          <input name="area" className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Monthly rent (₦)</span>
          <input name="rent_monthly" type="number" min={0} required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Bedrooms</span>
          <input name="bedrooms" type="number" min={0} defaultValue={1} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Bathrooms</span>
          <input name="bathrooms" type="number" min={0} defaultValue={1} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Size (m²)</span>
          <input name="size_sqm" type="number" min={0} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Property type</span>
          <select name="property_type" className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
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
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="published" type="checkbox" className="size-4 rounded border-zinc-400" />
          Published (visible on public site)
        </label>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Fees (optional)</h2>
        <p className="text-sm text-zinc-500">Add rows for service charge, caution, agency, etc.</p>
        <div className="mt-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="fee_label"
                placeholder="Label e.g. Service charge"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                name="fee_amount"
                type="number"
                min={0}
                placeholder="Amount"
                className="w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          ))}
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Amenities (comma-separated keys)</span>
        <input
          name="amenities"
          placeholder="generator, water_tank, security"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={pending} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
        {pending ? "Creating…" : "Create & continue to media"}
      </button>
    </form>
  );
}
