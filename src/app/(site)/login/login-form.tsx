"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

export function LoginForm() {
  const supabase = createClient();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const site = getSiteUrl();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${site}/auth/callback?next=/listings`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage("Check your email for the sign-in link.");
  }

  async function onPhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    let e164 = phone.trim();
    if (e164.startsWith("0")) {
      e164 = "+234" + e164.slice(1);
    } else if (!e164.startsWith("+")) {
      e164 = "+234" + e164;
    }
    const { error: err } = await supabase.auth.signInWithOtp({ phone: e164 });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage("We sent an SMS code to your phone. Enter it below.");
  }

  async function verifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    let e164 = phone.trim();
    if (e164.startsWith("0")) {
      e164 = "+234" + e164.slice(1);
    } else if (!e164.startsWith("+")) {
      e164 = "+234" + e164;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.verifyOtp({
      phone: e164,
      token: otp.trim(),
      type: "sms",
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    window.location.href = "/listings";
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "email"
              ? "bg-white shadow dark:bg-zinc-800"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
          onClick={() => setMode("email")}
        >
          Magic email link
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "phone"
              ? "bg-white shadow dark:bg-zinc-800"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
          onClick={() => setMode("phone")}
        >
          Phone number
        </button>
      </div>

      {mode === "email" ? (
        <form onSubmit={onEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Sending link…" : "Send magic link"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <form onSubmit={onPhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone (Nigeria)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="0803… or +234803…"
              />
              <p className="mt-1 text-xs text-zinc-500">SMS delivery requires SMS to be enabled on your Supabase project.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Sending code…" : "Send SMS code"}
            </button>
          </form>
          <form onSubmit={verifyPhoneOtp} className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <label htmlFor="otp" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              SMS code
            </label>
            <div className="flex gap-2">
              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="6-digit code"
              />
              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {message ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
