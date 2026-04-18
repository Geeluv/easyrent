import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin" className="font-bold text-emerald-800 dark:text-emerald-400">
              EasyRent Admin
            </Link>
            <nav className="flex gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Link href="/admin/listings" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                Listings
              </Link>
            </nav>
          </div>
          <Link href="/listings" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
            View site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
