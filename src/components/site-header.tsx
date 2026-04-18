import Link from "next/link";
import { getProfile } from "@/lib/auth/admin";
import { SiteHeaderNav } from "@/components/site-header-nav";

export async function SiteHeader() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
          <span className="truncate text-lg font-bold tracking-tight text-emerald-800 dark:text-emerald-400">
            EasyRent
          </span>
          <span className="hidden shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900 sm:inline-flex dark:bg-emerald-950/80 dark:text-emerald-300">
            Rentals only
          </span>
          <span className="inline-flex shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-900 sm:hidden dark:bg-emerald-950/80 dark:text-emerald-300">
            Rent
          </span>
        </Link>
        <SiteHeaderNav isAuthenticated={!!profile} isAdmin={profile?.role === "admin"} />
      </div>
    </header>
  );
}
