"use client";

import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleInspectionWatchlist, togglePropertySave } from "@/app/actions/engagement-actions";
import { cn } from "@/lib/utils";

type Props = {
  propertyId: string;
  listingSlug: string;
  initialSaved: boolean;
  initialWatchlisted: boolean;
};

export function ListingEngagementBar({ propertyId, listingSlug, initialSaved, initialWatchlisted }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [watch, setWatch] = useState(initialWatchlisted);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setMessage(null);
              const res = await togglePropertySave(propertyId, listingSlug);
              if ("error" in res && res.error) {
                setMessage(res.error);
                return;
              }
              setSaved(res.saved);
              router.refresh();
            })
          }
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
            saved
              ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100"
              : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
          )}
        >
          <Heart className={cn("h-4 w-4", saved ? "fill-current" : "")} aria-hidden />
          {saved ? "Saved" : "Save listing"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setMessage(null);
              const res = await toggleInspectionWatchlist(propertyId, listingSlug);
              if ("error" in res && res.error) {
                setMessage(res.error);
                return;
              }
              setWatch(res.onList);
              router.refresh();
            })
          }
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
            watch
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
          )}
        >
          {watch ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
          {watch ? "On inspection watchlist" : "Watch for inspection"}
        </button>
      </div>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
