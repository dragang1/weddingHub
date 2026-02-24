"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { cityInputToCanonicalSlug } from "@/lib/cities";
import { parseEventType } from "@/lib/events";
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

  const hasActiveFilters =
    searchParams.get("subcategory") ||
    searchParams.get("q") ||
    eventType !== "wedding";

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
      <div className="sticky top-0 z-10 border-b border-stone-200 glass py-4">
        {content}
      </div>
    );
  }
  return content;
}
