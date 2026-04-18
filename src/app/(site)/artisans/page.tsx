import Link from "next/link";
import { listArtisans } from "@/lib/data/artisans";

export const dynamic = "force-dynamic";

export default async function ArtisansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const state = typeof sp.state === "string" ? sp.state : undefined;
  const artisans = await listArtisans({ state });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Verified artisans</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Contact craftspeople for fixes and renovations. &quot;Verified&quot; is set by EasyRent admins — always do your
          own checks before large payments.
        </p>
      </div>

      <form className="flex max-w-md flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40" method="get">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Filter by state</span>
          <input
            name="state"
            defaultValue={state ?? ""}
            placeholder="e.g. Lagos"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
          Apply
        </button>
      </form>

      {artisans.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700">
          No artisans yet. Admins can add profiles from the database or we can add an admin form next.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {artisans.map((a) => (
            <li
              key={a.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{a.display_name}</h2>
                {a.verified ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-medium capitalize text-zinc-600 dark:text-zinc-400">{a.trade}</p>
              {a.bio ? <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{a.bio}</p> : null}
              {a.service_states?.length ? (
                <p className="mt-2 text-xs text-zinc-500">Areas: {a.service_states.join(", ")}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {a.whatsapp_e164 ? (
                  <a
                    href={`https://wa.me/${a.whatsapp_e164.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {a.phone_e164 ? (
                  <a href={`tel:${a.phone_e164}`} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold dark:border-zinc-600">
                    Call
                  </a>
                ) : null}
                {!a.whatsapp_e164 && !a.phone_e164 ? (
                  <span className="text-sm text-zinc-500">No contact on file</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/listings" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          Back to listings
        </Link>
      </p>
    </div>
  );
}
