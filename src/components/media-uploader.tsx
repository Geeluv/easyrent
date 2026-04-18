"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerMediaAction } from "@/app/actions/property-admin";
import { createClient } from "@/lib/supabase/client";

export function MediaUploader({ propertyId, nextSortOrder }: { propertyId: string; nextSortOrder: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^\w.\-]/g, "_");
      const path = `${propertyId}/${crypto.randomUUID()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from("listings").upload(path, file, { cacheControl: "3600" });
      if (upErr) {
        setErr(upErr.message);
        return;
      }
      const isVideo = file.type.startsWith("video/");
      const res = await registerMediaAction(propertyId, path, isVideo ? "video" : "image", nextSortOrder);
      if ("error" in res && res.error) {
        setErr(res.error);
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-400 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900">
        <input type="file" accept="image/*,video/*" className="hidden" onChange={(ev) => void onChange(ev)} disabled={busy} />
        {busy ? "Uploading…" : "Add photo or video"}
      </label>
      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
      <p className="mt-1 text-xs text-zinc-500">Only administrators can publish media.</p>
    </div>
  );
}
