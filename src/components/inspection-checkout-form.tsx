"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { resolveListingSlugForInspection, startInspectionCheckout } from "@/app/actions/inspection-actions";
import type { PropertyWithRelations } from "@/lib/data/properties";
import {
  INSPECTION_FEE_EACH_ADDITIONAL_NGN,
  INSPECTION_FEE_FIRST_NGN,
  INSPECTION_MAX_PROPERTIES,
  inspectionFeeBreakdownNgn,
  inspectionFeeTotalNgn,
} from "@/lib/inspection-pricing";
import { NIGERIA_STATES } from "@/lib/nigeria-states";
import { formatCurrencyNGN } from "@/lib/utils";

type Props = {
  initialSelectedIds: string[];
  watchlist: PropertyWithRelations[];
};

export function InspectionCheckoutForm({ initialSelectedIds, watchlist }: Props) {
  const [selected, setSelected] = useState<string[]>(() => [...new Set(initialSelectedIds.filter(Boolean))]);
  const [slugInput, setSlugInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const total = useMemo(() => {
    if (selected.length === 0) return 0;
    try {
      return inspectionFeeTotalNgn(selected.length);
    } catch {
      return 0;
    }
  }, [selected.length]);

  const breakdown = useMemo(() => (selected.length === 0 ? [] : inspectionFeeBreakdownNgn(selected.length)), [selected.length]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addFromSlug() {
    startTransition(async () => {
      setFormError(null);
      const res = await resolveListingSlugForInspection(slugInput);
      if (res.error) {
        setFormError(res.error);
        return;
      }
      const id = res.id;
      if (!id) {
        setFormError("Could not add listing.");
        return;
      }
      if (selected.includes(id)) {
        setFormError("That listing is already selected.");
        return;
      }
      if (selected.length >= INSPECTION_MAX_PROPERTIES) {
        setFormError(`You can select at most ${INSPECTION_MAX_PROPERTIES} listings per payment.`);
        return;
      }
      setSelected((s) => [...s, id]);
      setSlugInput("");
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            setFormError(null);
            fd.set("property_ids", JSON.stringify(selected));
            const res = await startInspectionCheckout(fd);
            if ("error" in res) {
              setFormError(res.error);
              return;
            }
            window.location.href = res.authorizationUrl;
          });
        }}
      >
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Properties to inspect</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Choose up to {INSPECTION_MAX_PROPERTIES} listings. The fee is non-refundable. Additional listings receive a
            small discount on the incremental amount.
          </p>

          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Add by slug or URL path</span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  placeholder="e.g. spacious-3bed-badore-gated-lagos"
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void addFromSlug()}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Add listing
                </button>
              </div>
            </label>

            {watchlist.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">From your inspection watchlist</p>
                <ul className="mt-2 space-y-2">
                  {watchlist.map((p) => {
                    const locked = p.inspection_locked;
                    const checked = selected.includes(p.id);
                    return (
                      <li
                        key={p.id}
                        className="flex items-start gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 size-4 rounded border-zinc-400"
                          checked={checked}
                          disabled={locked}
                          onChange={() => {
                            if (locked) return;
                            toggle(p.id);
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">{p.title}</p>
                          <p className="text-xs text-zinc-500">
                            {p.city}, {p.state}
                            {locked ? " · not accepting new inspection bookings" : ""}
                          </p>
                          <Link href={`/listings/${p.slug}`} className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                            View listing
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your watchlist is empty. Save listings from a detail page with &quot;Watch for inspection&quot;, or add a
                slug above.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">About you</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Landlords use this to decide if they are comfortable inviting you for a physical inspection after payment.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Full name</span>
              <input name="applicant_full_name" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Address</span>
              <textarea name="applicant_address" required rows={3} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Phone number</span>
              <input name="applicant_phone" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Occupation</span>
              <input name="applicant_occupation" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">State of origin</span>
              <select name="applicant_state_of_origin" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Relationship status</span>
              <select
                name="applicant_relationship_status"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Name of organization / company</span>
              <input name="applicant_organization" required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Number of occupants</span>
              <input name="applicant_num_occupants" type="number" min={1} defaultValue={1} required className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
          </div>
        </section>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

        <button
          type="submit"
          disabled={pending || selected.length === 0}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Redirecting to Paystack…" : "Continue to Paystack"}
        </button>
      </form>

      <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Fee summary</h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          First property: {formatCurrencyNGN(INSPECTION_FEE_FIRST_NGN)}. Each extra property:{" "}
          {formatCurrencyNGN(INSPECTION_FEE_EACH_ADDITIONAL_NGN)} (modest volume discount).
        </p>
        <ul className="space-y-1 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          {breakdown.length === 0 ? (
            <li className="text-zinc-500">Select at least one listing to see the breakdown.</li>
          ) : (
            breakdown.map((row, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">{row.label}</span>
                <span className="font-medium">{formatCurrencyNGN(row.amount)}</span>
              </li>
            ))
          )}
        </ul>
        <p className="flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold dark:border-zinc-800">
          <span>Total due</span>
          <span>{formatCurrencyNGN(total)}</span>
        </p>
        <p className="text-xs text-zinc-500">
          Selected listings: {selected.length}. You will pay securely with Paystack. After a successful payment, those
          listings pause new inspection bookings until the owner re-opens them.
        </p>
      </aside>
    </div>
  );
}
