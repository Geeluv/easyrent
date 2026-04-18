import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-2">
          <p className="text-lg font-bold text-emerald-800 dark:text-emerald-400">EasyRent</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A rental-only marketplace built for clarity: monthly rent, common Nigerian fees (agency, legal, caution),
            photos, and reviews — so you can compare homes without guesswork.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:text-right">
          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Explore</p>
            <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/listings" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Browse rentals
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Find artisans
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Renters</p>
            <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/login" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200/80 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} EasyRent. Listings are for discovery — always verify details before you pay.
      </div>
    </footer>
  );
}
