"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SignOutButton } from "@/components/sign-out-button";

type Props = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const linkClass =
  "rounded-xl px-3 py-3 text-sm font-medium text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 active:bg-emerald-100 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-emerald-300 dark:active:bg-zinc-700";

export function SiteHeaderNav({ isAuthenticated, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyOverflowX = body.style.overflowX;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overflowX = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.overflowX = prevBodyOverflowX;
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const mobileDrawer =
    open && mounted ? (
      <div
        className="fixed inset-0 z-[200] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-zinc-950/60"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
        <aside
          id="mobile-nav-panel"
          className="absolute right-0 top-0 flex h-[100dvh] w-[min(20rem,100%)] flex-col overflow-hidden border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex shrink-0 items-center justify-end border-b border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              <Link href="/listings" className={linkClass} onClick={() => setOpen(false)}>
                Browse listings
              </Link>
              <Link href="/artisans" className={linkClass} onClick={() => setOpen(false)}>
                Artisans
              </Link>
              {isAuthenticated && isAdmin ? (
                <Link href="/admin" className={linkClass} onClick={() => setOpen(false)}>
                  Admin
                </Link>
              ) : null}
              <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                {isAuthenticated ? (
                  <SignOutButton className="w-full justify-center bg-zinc-100 py-3 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700" />
                ) : (
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </aside>
      </div>
    ) : null;

  return (
    <>
      <nav className="hidden items-center gap-4 md:flex" aria-label="Main">
        <Link
          href="/listings"
          className="text-sm font-medium text-zinc-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
        >
          Browse
        </Link>
        <Link
          href="/artisans"
          className="text-sm font-medium text-zinc-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
        >
          Artisans
        </Link>
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              <Link
                href="/admin"
                className="text-sm font-medium text-zinc-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
              >
                Admin
              </Link>
            ) : null}
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Sign in
          </Link>
        )}
      </nav>

      <button
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-800 hover:bg-zinc-50 md:hidden dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {open && mounted && mobileDrawer ? createPortal(mobileDrawer, document.body) : null}
    </>
  );
}
