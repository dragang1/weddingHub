"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CATEGORIES } from "@/lib/categories";
import { POPULAR_CITY_NAMES } from "@/lib/cities";

const COOLDOWN_SEC = 60;
const COOLDOWN_KEY = "partner_request_cooldown";

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(COOLDOWN_KEY);
  if (!raw) return 0;
  const ts = parseInt(raw, 10);
  if (Number.isNaN(ts)) return 0;
  const elapsed = Math.floor((Date.now() - ts) / 1000);
  const remaining = COOLDOWN_SEC - elapsed;
  return remaining > 0 ? remaining : 0;
}

export default function PostanitePartnerPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "cooldown">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    const rem = getRemainingCooldown();
    if (rem > 0) {
      setStatus("cooldown");
      setCooldownSec(rem);
    }
  }, []);

  useEffect(() => {
    if (status !== "cooldown" || cooldownSec <= 0) return;
    const t = setInterval(() => {
      const rem = getRemainingCooldown();
      if (rem <= 0) {
        setStatus("idle");
        setCooldownSec(0);
        return;
      }
      setCooldownSec(rem);
    }, 1000);
    return () => clearInterval(t);
  }, [status, cooldownSec]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string | undefined> = {
      businessName: (formData.get("businessName") as string)?.trim(),
      category: (formData.get("category") as string)?.trim(),
      city: (formData.get("city") as string)?.trim(),
      contactName: (formData.get("contactName") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      instagram: (formData.get("instagram") as string)?.trim() || undefined,
      facebook: (formData.get("facebook") as string)?.trim() || undefined,
      website: (formData.get("website") as string)?.trim() || undefined,
      message: (formData.get("message") as string)?.trim() || undefined,
    };
    const hp = (formData.get("_hp") as string)?.trim();
    if (hp) (payload as Record<string, string>)._hp = hp;

    if (
      !payload.businessName ||
      !payload.category ||
      !payload.city ||
      !payload.contactName ||
      !payload.phone ||
      !payload.email
    ) {
      setErrorMsg("Sva obavezna polja moraju biti popunjena.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/partner-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("idle");
        setErrorMsg(json.error ?? "Greška");
        return;
      }

      form.reset();
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setStatus("cooldown");
      setCooldownSec(COOLDOWN_SEC);
    } catch {
      setStatus("idle");
      setErrorMsg("Greška u mreži. Pokušaj ponovo.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-stone-900">
      <SiteHeader />
      <main className="flex-1 relative px-5 py-16 sm:px-8 sm:py-24">
        <div className="absolute inset-0 section-pattern opacity-50 dark:opacity-30 pointer-events-none" aria-hidden />
        <div className="relative mx-auto min-w-0 max-w-2xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 block">Partnerstvo</span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-ink dark:text-stone-100 sm:text-5xl">
              Postanite dio mreže
            </h1>
            <p className="mt-4 text-lg font-light leading-relaxed text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              Pridružite se ekskluzivnoj platformi i predstavite svoje usluge klijentima koji traže najbolje za svoje vjenčanje.
            </p>
          </div>

          {status === "cooldown" ? (
            <div className="mt-10 rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 p-10 text-center shadow-marketplace dark:shadow-none">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft dark:bg-accent/30 text-accent mb-6">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="font-serif text-2xl font-bold text-ink dark:text-stone-100">
                Zahtjev je uspješno poslan
              </p>
              <p className="mt-3 text-base text-stone-500 dark:text-stone-400 font-light">
                Hvala vam na interesu. Naš tim će vas uskoro kontaktirati sa daljim informacijama.
              </p>
              <p className="mt-6 text-sm text-stone-400 dark:text-stone-500 uppercase tracking-widest font-semibold">
                Novi zahtjev moguć za {cooldownSec}s
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 p-8 shadow-marketplace dark:shadow-none sm:p-10"
            >
              <div className="min-w-0 space-y-6">
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                  >
                    Naziv biznisa *
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    className="input-field w-full"
                    placeholder="npr. Studio Elegance"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                  >
                    Kategorija *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="input-field w-full appearance-none"
                  >
                    <option value="">Odaberite kategoriju usluge</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                  >
                    Grad *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    list="city-list"
                    className="input-field w-full"
                    placeholder="Glavni grad poslovanja"
                  />
                  <datalist id="city-list">
                    {POPULAR_CITY_NAMES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="grid min-w-0 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    >
                      Ime i prezime *
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    >
                      Telefon *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="input-field w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field w-full"
                  />
                </div>
                <div className="grid min-w-0 gap-6 sm:grid-cols-3 pt-4 border-t border-stone-100">
                  <div>
                    <label
                      htmlFor="instagram"
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    >
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      name="instagram"
                      type="text"
                      className="input-field w-full"
                      placeholder="@"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="facebook"
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    >
                      Facebook
                    </label>
                    <input
                      id="facebook"
                      name="facebook"
                      type="text"
                      className="input-field w-full"
                      placeholder="link ili ime"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    >
                      Web stranica
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      className="input-field w-full"
                      placeholder="https://"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-stone-100 dark:border-stone-600/50">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400"
                  >
                    Dodatne informacije
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="input-field w-full resize-y"
                    placeholder="Kratki opis vaših usluga (opcionalno)"
                  />
                </div>
                <div className="sr-only" aria-hidden>
                  <label htmlFor="_hp">Ne popunjavajte</label>
                  <input
                    id="_hp"
                    name="_hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-sm text-red-700" role="alert">
                    {errorMsg}
                  </p>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-600/50">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-accent w-full py-4 text-base rounded-xl"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Šaljem zahtjev…
                    </span>
                  ) : (
                    "Pošalji zahtjev"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Nazad na početnu
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
