"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/app/actions/review-actions";

export function ReviewForm({ propertyId }: { propertyId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      setError(null);
      setOk(false);
      const res = await submitReview(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      if ("ok" in res && res.ok) {
        setOk(true);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <input type="hidden" name="property_id" value={propertyId} />
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Rating
        <select
          name="rating"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          defaultValue={5}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Comment (optional)
        <textarea
          name="body"
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="What was the viewing or renting experience like?"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Post review"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? <p className="text-sm text-emerald-700">Thanks — your review is live.</p> : null}
    </form>
  );
}
