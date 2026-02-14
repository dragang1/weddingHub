"use client";

import { useState } from "react";

type LeadFormProps = {
  providerId: string;
  providerName: string;
};

export function LeadForm({ providerId, providerName }: LeadFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      providerId,
      customerName: data.get("customerName") as string,
      customerPhone: data.get("customerPhone") as string,
      customerEmail: (data.get("customerEmail") as string) || undefined,
      eventDate: data.get("eventDate") as string,
      eventCity: data.get("eventCity") as string,
      budget: data.get("budget") ? Number(data.get("budget")) : undefined,
      message: data.get("message") as string,
      company: data.get("company") as string,
    };

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? `Greška ${res.status}`);
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Greška u mreži. Pokušajte ponovno.");
    }
  }

  if (status === "success") {
    return (
      <div className="card overflow-hidden">
        <div className="bg-accent-soft/50 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mt-4 font-serif text-xl font-bold text-ink">
            Hvala vam!
          </p>
          <p className="mt-2 text-sm text-muted">
            Vaš upit je uspješno poslan. Javit ćemo vam se uskoro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card overflow-hidden">
      {/* Form header */}
      <div className="bg-accent-soft/30 px-6 py-5 sm:px-8">
        <h3 className="font-serif text-xl font-bold text-ink">Pošalji upit</h3>
        <p className="mt-1 text-sm text-muted">
          Kontaktirajte {providerName} direktno.
        </p>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="company">Ne ispunjavajte</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {/* Your details */}
        <fieldset>
          <legend className="section-label mb-4">Vaši podaci</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 sm:max-w-xs">
              <label
                htmlFor="customerName"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Ime i prezime *
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                className="input-field"
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Telefon *
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                required
                className="input-field"
              />
            </div>
            <div>
              <label
                htmlFor="customerEmail"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Email
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                className="input-field"
              />
            </div>
          </div>
        </fieldset>

        {/* Event */}
        <fieldset className="border-t border-border pt-8">
          <legend className="section-label mb-4">Događaj</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="eventDate"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Datum događaja *
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                className="input-field"
              />
            </div>
            <div>
              <label
                htmlFor="eventCity"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Mjesto događaja *
              </label>
              <input
                id="eventCity"
                name="eventCity"
                type="text"
                required
                className="input-field"
                placeholder="npr. Sarajevo"
              />
            </div>
            <div className="sm:col-span-2 sm:max-w-xs">
              <label
                htmlFor="budget"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Budžet (€)
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                min={0}
                className="input-field"
                placeholder="opcionalno"
              />
            </div>
          </div>
        </fieldset>

        {/* Message */}
        <fieldset className="border-t border-border pt-8">
          <legend className="mb-1.5 text-xs font-semibold text-muted">
            Poruka *
          </legend>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="input-field resize-y"
            placeholder="Opišite šta vam treba..."
          />
        </fieldset>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mx-6 mb-4 rounded-button border border-red-200 bg-red-50 px-4 py-3 sm:mx-8">
          <p className="text-sm text-red-700" role="alert">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="border-t border-border px-6 py-5 sm:px-8">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
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
