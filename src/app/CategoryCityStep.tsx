"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cityInputToCanonicalSlug, POPULAR_CITY_NAMES } from "@/lib/cities";
import { CityAutocompleteInput } from "@/components/CityAutocompleteInput";
import type { EventTypeSlug } from "@/lib/events";

type CategoryCityStepProps = {
  categoryLabel: string;
  categoryPath: string;
  eventType?: EventTypeSlug;
};

export function CategoryCityStep({
  categoryLabel,
  categoryPath,
  eventType = "wedding",
}: CategoryCityStepProps) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationMessage("");
    const trimmed = city.trim();
    if (!trimmed) {
      setValidationMessage("Unesite grad događaja.");
      return;
    }
    const citySlug = cityInputToCanonicalSlug(trimmed);
    if (!citySlug) {
      setValidationMessage("Unesite grad događaja.");
      return;
    }
    const eventQuery =
      eventType === "wedding" ? "" : `?event=${eventType}`;
    router.push(`${categoryPath}/${citySlug}${eventQuery}`);
  }

  function handleChipClick(name: string) {
    setCity(name);
    setValidationMessage("");
  }

  return (
    <div className="card min-w-0 overflow-hidden">
      <div className="bg-accent-soft/30 px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <p className="section-label text-accent">Korak 2</p>
        <p className="mt-1 font-serif text-base font-bold text-ink break-words">
          Unesite grad događaja
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-5 p-4 sm:p-6 md:p-8"
      >
        <div>
          <CityAutocompleteInput
            id="category-city"
            label="Grad"
            placeholder="npr. Sarajevo, Banja Luka…"
            value={city}
            onChange={(v) => {
              setCity(v);
              setValidationMessage("");
            }}
            onSubmit={() => formRef.current?.requestSubmit()}
            autoFocus
            aria-invalid={!!validationMessage}
            aria-describedby={
              validationMessage ? "category-city-error" : undefined
            }
          />
          {validationMessage && (
            <p
              id="category-city-error"
              className="mt-2 text-sm text-amber-700"
              role="alert"
            >
              {validationMessage}
            </p>
          )}
        </div>

        <div>
          <p className="section-label mb-2.5">Popularni gradovi</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CITY_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleChipClick(name)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  city === name
                    ? "border-accent/40 bg-accent-soft text-accent-hover shadow-soft"
                    : "border-border bg-white text-ink hover:border-accent/30 hover:bg-accent-soft/40"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          Prikaži ponudu
        </button>
      </form>
    </div>
  );
}
