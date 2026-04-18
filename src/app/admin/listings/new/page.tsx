import Link from "next/link";
import { CreateListingForm } from "../create-form";

export const metadata = {
  title: "New listing | EasyRent Admin",
};

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/listings" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
          ← Back to listings
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">New listing</h1>
      </div>
      <CreateListingForm />
    </div>
  );
}
