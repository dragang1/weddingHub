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
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto min-w-0 max-w-xl">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Dodajte svoj biznis
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            Imate biznis vezan za proslave i događaje? Pošaljite nam svoje
            podatke i kontaktiraćemo vas.
          </p>

          {status === "cooldown" ? (
            <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-center">
              <p className="font-semibold text-ink">
                Hvala! Kontaktiraćemo vas uskoro.
              </p>
              <p className="mt-2 text-sm text-muted">
                Možete poslati novi zahtjev za {cooldownSec} sekundi.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 min-w-0 rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8"
            >
              <div className="min-w-0 space-y-5">
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Naziv biznisa *
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    className="input-field w-full"
                    placeholder="npr. Muzički studio XYZ"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Kategorija *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="input-field w-full"
                  >
                    <option value="">Odaberite kategoriju</option>
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
                    className="mb-1.5 block text-sm font-semibold text-ink"
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
                    placeholder="npr. Sarajevo"
                  />
                  <datalist id="city-list">
                    {POPULAR_CITY_NAMES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="mb-1.5 block text-sm font-semibold text-ink"
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
                      className="mb-1.5 block text-sm font-semibold text-ink"
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
                    className="mb-1.5 block text-sm font-semibold text-ink"
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
                <div className="grid min-w-0 gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="instagram"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      name="instagram"
                      type="text"
                      className="input-field w-full"
                      placeholder="opcionalno"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="facebook"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Facebook
                    </label>
                    <input
                      id="facebook"
                      name="facebook"
                      type="text"
                      className="input-field w-full"
                      placeholder="opcionalno"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Web stranica
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      className="input-field w-full"
                      placeholder="opcionalno"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Poruka
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="input-field w-full resize-y"
                    placeholder="Opcionalno — recite nam nešto o svom biznisu"
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
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700" role="alert">
                    {errorMsg}
                  </p>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full sm:w-auto sm:px-8"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
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
                      Šaljem…
                    </span>
                  ) : (
                    "Pošalji zahtjev"
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              ← Nazad na početnu
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
