import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Manage rental listings, upload photos and videos, and curate artisan records (database for now).
      </p>
      <Link
        href="/admin/listings"
        className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
      >
        Go to listings
      </Link>
    </div>
  );
}
