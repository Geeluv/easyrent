import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePropertyMediaAction, updatePropertyAction } from "@/app/actions/property-admin";
import { MediaUploader } from "@/components/media-uploader";
import { getPropertyByIdForAdmin } from "@/lib/data/properties";
import { publicListingUrl } from "@/lib/storage";
import { NIGERIA_STATES } from "@/lib/nigeria-states";

export const dynamic = "force-dynamic";

export default async function EditListingPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const p = await getPropertyByIdForAdmin(id);
  if (!p) {
    notFound();
  }

  const media = p.property_media ?? [];
  const nextSort = media.length;

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/listings" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
          ← Back to listings
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit listing</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Slug:{" "}
          <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">{p.slug}</code>
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Photos & videos</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Only admins can upload. Images appear first in sort order.</p>
        <div className="mt-4">
          <MediaUploader propertyId={p.id} nextSortOrder={nextSort} />
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => {
            const src = publicListingUrl(m.storage_path);
            return (
              <li key={m.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                  {m.media_type === "image" ? (
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <video src={src} className="h-full w-full object-cover" controls muted />
                  )}
                </div>
                <form className="flex justify-end border-t border-zinc-200 p-2 dark:border-zinc-800">
                  <button
                    type="submit"
                    formAction={deletePropertyMediaAction.bind(null, m.id, p.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
        {media.length === 0 ? <p className="mt-4 text-sm text-zinc-500">No media yet — upload above.</p> : null}
      </section>

      <form action={updatePropertyAction.bind(null, p.id)} className="mx-auto max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Title</span>
            <input name="title" required defaultValue={p.title} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Description</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={p.description ?? ""}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">State</span>
            <select name="state" required defaultValue={p.state} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">City</span>
            <input name="city" required defaultValue={p.city} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Area</span>
            <input name="area" defaultValue={p.area ?? ""} className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Monthly rent (₦)</span>
            <input
              name="rent_monthly"
              type="number"
              min={0}
              required
              defaultValue={Number(p.rent_monthly)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Bedrooms</span>
            <input
              name="bedrooms"
              type="number"
              min={0}
              defaultValue={p.bedrooms}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Bathrooms</span>
            <input
              name="bathrooms"
              type="number"
              min={0}
              defaultValue={p.bathrooms}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Size (m²)</span>
            <input
              name="size_sqm"
              type="number"
              min={0}
              defaultValue={p.size_sqm ?? ""}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Property type</span>
            <select
              name="property_type"
              defaultValue={p.property_type}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="flat">Flat</option>
              <option value="self_contain">Self contain</option>
              <option value="mini_flat">Mini flat</option>
              <option value="duplex">Duplex</option>
              <option value="bungalow">Bungalow</option>
              <option value="terraced">Terraced</option>
              <option value="penthouse">Penthouse</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input name="published" type="checkbox" defaultChecked={p.published} className="size-4 rounded border-zinc-400" />
            Published
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Fees</h2>
          <div className="mt-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const fee = p.property_fees[i];
              return (
                <div key={i} className="flex gap-2">
                  <input
                    name="fee_label"
                    defaultValue={fee?.label ?? ""}
                    placeholder="Label"
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <input
                    name="fee_amount"
                    type="number"
                    min={0}
                    defaultValue={fee?.amount ?? ""}
                    placeholder="Amount"
                    className="w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <label className="block text-sm">
          <span className="font-medium">Amenities (comma-separated)</span>
          <input
            name="amenities"
            defaultValue={(p.amenities ?? []).join(", ")}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700">
          Save changes
        </button>
      </form>
    </div>
  );
}
