import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyNGN } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("properties")
    .select("id, title, slug, state, city, rent_monthly, published, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-600">Could not load listings: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Listings</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Draft and publish homes. Only published homes appear publicly.</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          New listing
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Rent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{r.title}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {r.city}, {r.state}
                </td>
                <td className="px-4 py-3">{formatCurrencyNGN(Number(r.rent_monthly))}</td>
                <td className="px-4 py-3">
                  {r.published ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/listings/${r.id}/edit`} className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
