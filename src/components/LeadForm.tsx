"use client";

import { useState, useEffect } from "react";

const COOLDOWN_SEC = 60;

function getCooldownKey(providerId: string) {
  return `lead_cooldown_${providerId}`;
}

function getRemainingCooldown(providerId: string): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(getCooldownKey(providerId));
  if (!raw) return 0;
  const ts = parseInt(raw, 10);
  if (Number.isNaN(ts)) return 0;
  const elapsed = Math.floor((Date.now() - ts) / 1000);
  const remaining = COOLDOWN_SEC - elapsed;
  return remaining > 0 ? remaining : 0;
}

type LeadFormProps = {
  providerId: string;
  providerName: string;
};

export function LeadForm({ providerId, providerName }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "cooldown">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    const rem = getRemainingCooldown(providerId);
    if (rem > 0) {
      setStatus("cooldown");
      setCooldownSec(rem);
    }
  }, [providerId]);

  useEffect(() => {
    if (status !== "cooldown" || cooldownSec <= 0) return;
    const t = setInterval(() => {
      const rem = getRemainingCooldown(providerId);
      if (rem <= 0) {
        setStatus("idle");
        setCooldownSec(0);
        return;
      }
      setCooldownSec(rem);
    }, 1000);
    return () => clearInterval(t);
  }, [status, cooldownSec, providerId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim();
    const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim();
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value?.trim();

    if (!name || !message || message.length < 20) {
      setErrorMsg("Ime i poruka (min. 20 znakova) su obavezni.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const payload = {
      providerId,
      providerName,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      name,
      email: email || undefined,
      phone: phone ? phone.trim() : undefined,
      message,
    };

    try {
      const res = await fetch("/api/leads", {
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
      if (typeof window !== "undefined") {
        localStorage.setItem(getCooldownKey(providerId), String(Date.now()));
      }
      setStatus("cooldown");
      setCooldownSec(COOLDOWN_SEC);
    } catch {
      setStatus("idle");
      setErrorMsg("Greška u mreži. Pokušaj ponovo.");
    }
  }

  if (status === "cooldown" && cooldownSec > 0) {
    return (
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="bg-accent-soft/50 p-8 text-center sm:p-10">
          <p className="font-medium text-ink">Hvala! Upit je poslan.</p>
          <p className="mt-2 text-sm text-muted">
            Možeš poslati novi upit za {cooldownSec} sekundi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      <div className="bg-accent-soft/30 px-6 py-5 sm:px-8">
        <h3 className="font-serif text-xl font-bold text-ink">Pošalji upit</h3>
        <p className="mt-1 text-sm text-muted">Kontaktirajte {providerName}.</p>
      </div>

      <div className="min-w-0 space-y-4 p-6 sm:p-8">
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-xs font-semibold text-muted">
            Ime i prezime *
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            className="input-field w-full"
            placeholder="npr. Ana Horvat"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1.5 block text-xs font-semibold text-muted">
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            className="input-field w-full"
            placeholder="opcionalno"
          />
        </div>
        <div>
          <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-semibold text-muted">
            Telefon
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            className="input-field w-full"
            placeholder="opcionalno"
          />
        </div>
        <div>
          <label htmlFor="lead-message" className="mb-1.5 block text-xs font-semibold text-muted">
            Poruka * (min. 20 znakova)
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            required
            minLength={20}
            className="input-field w-full resize-y"
            placeholder="Opišite šta vam treba..."
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mx-8">
          <p className="text-sm text-red-700" role="alert">
            {errorMsg}
          </p>
        </div>
      )}

      <div className="border-t border-border px-6 py-5 sm:px-8">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary w-full sm:w-auto"
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
            "Pošalji upit"
          )}
        </button>
      </div>
    </form>
  );
}
