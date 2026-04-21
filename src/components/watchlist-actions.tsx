"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleInspectionWatchlist } from "@/app/actions/engagement-actions";

export function WatchlistActions({ propertyId, listingSlug }: { propertyId: string; listingSlug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleInspectionWatchlist(propertyId, listingSlug);
          router.refresh();
        })
      }
      className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
    >
      Remove
    </button>
  );
}
