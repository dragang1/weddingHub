"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { cityInputToCanonicalSlug } from "@/lib/cities";
import { EVENT_TYPES, parseEventType } from "@/lib/events";
import type { EventTypeSlug } from "@/lib/events";
import { CityAutocompleteInput } from "@/components/CityAutocompleteInput";

type ListingFilterBarProps = {
  basePath: string;
  citySlug: string;
  cityDisplay: string;
  cities: string[];
  subcategories: string[];
  eventType?: EventTypeSlug;
  variant?: "bar" | "sidebar";
};

export function ListingFilterBar({
  basePath,
  citySlug,
  cityDisplay,
  cities,
  subcategories,
  eventType: eventTypeProp = "wedding",
  variant = "sidebar",
}: ListingFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityInput, setCityInput] = useState(cityDisplay);
  const eventType = parseEventType(
    searchParams.get("event") ?? eventTypeProp
  );

  const buildQuery = useCallback(
    (
      overrides: {
        event?: EventTypeSlug;
        subcategory?: string;
        q?: string;
      } = {}
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      const ev = overrides.event ?? eventType;
      if (ev === "wedding") next.delete("event");
      else next.set("event", ev);
      if (overrides.subcategory !== undefined) {
        if (overrides.subcategory)
          next.set("subcategory", overrides.subcategory);
        else next.delete("subcategory");
      }
      if (overrides.q !== undefined) {
        if (overrides.q) next.set("q", overrides.q);
        else next.delete("q");
      }
      return next.toString();
    },
    [searchParams, eventType]
  );

  const applyCity = useCallback(() => {
    const slug = cityInputToCanonicalSlug(cityInput.trim());
    if (!slug) return;
    const qs = buildQuery();
    router.push(qs ? `${basePath}/${slug}?${qs}` : `${basePath}/${slug}`);
  }, [basePath, cityInput, router, buildQuery]);

  const resetFilters = useCallback(() => {
    router.push(`${basePath}/${citySlug}`);
  }, [basePath, citySlug, router]);

  const subcategory = searchParams.get("subcategory") ?? "";
  const hasActiveFilters =
    subcategory || searchParams.get("q") || eventType !== "wedding";

  const updateSubcategory = (value: string) => {
    const qs = buildQuery({ subcategory: value });
    router.push(
      qs ? `${basePath}/${citySlug}?${qs}` : `${basePath}/${citySlug}`
    );
  };

  const updateEventType = (value: EventTypeSlug) => {
    const qs = buildQuery({ event: value });
    router.push(
      qs ? `${basePath}/${citySlug}?${qs}` : `${basePath}/${citySlug}`
    );
  };

  const content = (
    <div
      className={
        variant === "sidebar"
          ? "space-y-5"
          : "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
      }
    >
      {/* City input */}
      <div
        className={
          variant === "sidebar" ? "" : "min-w-0 flex-1 sm:max-w-xs"
        }
      >
        <div className="flex gap-2 items-end">
          <div className="min-w-0 flex-1">
            <CityAutocompleteInput
              id="listing-city"
              label="Grad"
              value={cityInput}
              onChange={setCityInput}
              onSubmit={applyCity}
              placeholder="npr. Sarajevo, Banja Luka…"
            />
          </div>
          <button
            type="button"
            onClick={applyCity}
            className="btn-primary shrink-0 px-4 py-2.5 text-sm"
          >
            Primijeni
          </button>
        </div>
      </div>

      {/* Event type */}
      <div className={variant === "sidebar" ? "" : "sm:max-w-[180px]"}>
        <label
          htmlFor="listing-event"
          className="mb-1.5 block text-xs font-semibold text-muted"
        >
          Prilika
        </label>
        <select
          id="listing-event"
          value={eventType}
          onChange={(e) =>
            updateEventType(
              parseEventType(e.target.value) as EventTypeSlug
            )
          }
          className="input-field py-2.5"
          aria-label="Prilika"
        >
          {EVENT_TYPES.map((ev) => (
            <option key={ev.slug} value={ev.slug}>
              {ev.icon} {ev.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <div className={variant === "sidebar" ? "" : "sm:max-w-[200px]"}>
          <label
            htmlFor="listing-subcategory"
            className="mb-1.5 block text-xs font-semibold text-muted"
          >
            Podkategorija
          </label>
          <select
            id="listing-subcategory"
            value={subcategory}
            onChange={(e) => updateSubcategory(e.target.value)}
            className="input-field py-2.5"
            aria-label="Podkategorija"
          >
            <option value="">Sve</option>
            {subcategories.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="btn-secondary py-2.5 text-sm"
        >
          <svg
            className="mr-1.5 h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Reset
        </button>
      )}
    </div>
  );

  if (variant === "bar") {
    return (
      <div className="sticky top-0 z-10 border-b border-border glass py-4">
        {content}
      </div>
    );
  }
  return content;
}
