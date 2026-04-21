"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CompleteBody() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? searchParams.get("paystack_reference");

  const [status, setStatus] = useState<"working" | "ok" | "error">(() => (reference ? "working" : "error"));
  const [message, setMessage] = useState<string | null>(() =>
    reference
      ? null
      : "Missing payment reference. Return from Paystack using the “Complete payment” redirect.",
  );

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const body = (await res.json()) as { ok?: boolean; error?: string; already?: boolean };
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          setMessage(body.error ?? "Verification failed.");
          return;
        }
        setStatus("ok");
        setMessage(
          body.already
            ? "This payment was already confirmed."
            : "Payment confirmed. You can arrange your inspections with the listing owners.",
        );
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Could not verify payment. Check your connection and try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      {status === "working" ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Confirming your payment with Paystack…</p>
      ) : null}
      {status === "ok" ? (
        <>
          <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Thank you</h1>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>
        </>
      ) : null}
      {status === "error" ? (
        <>
          <h1 className="text-xl font-bold text-red-700 dark:text-red-400">Could not confirm payment</h1>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>
        </>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/listings" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
          Back to listings
        </Link>
        <Link href="/watchlist" className="text-sm font-semibold text-zinc-700 hover:underline dark:text-zinc-300">
          Watchlist
        </Link>
      </div>
    </div>
  );
}

export default function InspectCompletePage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading payment status…</p>
      }
    >
      <CompleteBody />
    </Suspense>
  );
}
