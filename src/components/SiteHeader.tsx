"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseSearchQuery } from "@/lib/search/parseQuery";
import { getSuggestions } from "@/lib/search/getSuggestions";
import { categoryPath } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";
import { slugifyCity } from "@/lib/cities";

function buildResultsHref(
  category: CategorySlug,
  city: string,
  eventType: string | null
): string {
  const path = categoryPath(category);
  const citySlug = slugifyCity(city);
  const eventQ =
    eventType && eventType !== "wedding" ? `?event=${eventType}` : "";
  return `${path}/${citySlug}${eventQ}`;
}

export function SiteHeader() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [focused, setFocused] = useState(false);
  const suggestions = getSuggestions(searchValue);
  const showDropdown = focused || searchValue.length > 0;

  function handleSearchSubmit() {
    setHelperMessage("");
    const parsed = parseSearchQuery(searchValue);
    if (parsed.confidence === "high" && parsed.category && parsed.city) {
      router.push(
        buildResultsHref(parsed.category, parsed.city, parsed.eventType)
      );
      return;
    }
    setHelperMessage(
      "Unesite npr. muzika Sarajevo ili odaberite kategoriju i grad."
    );
  }

  function handleSuggestionClick(href: string) {
    if (href.startsWith("/")) router.push(href);
    else if (href === "#kategorije") {
      document
        .getElementById("kategorije")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4">
        {/* Logo */}
        <Link href="/" className="group shrink-0 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/15">
            <span className="text-lg leading-none" aria-hidden>
              💍
            </span>
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Wedding
            <span className="text-accent ml-0.5">Hub</span>
          </span>
        </Link>

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="site-search" className="sr-only">
            Pretražite usluge i grad
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              id="site-search"
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setHelperMessage("");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 180)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), handleSearchSubmit())
              }
              placeholder="npr. muzika Sarajevo"
              className="w-full rounded-full border border-border/80 bg-surface/80 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted/50 transition-all duration-200 focus:border-accent/40 focus:bg-white focus:shadow-soft focus:ring-2 focus:ring-accent/10 focus:outline-none"
              autoComplete="off"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls="site-search-suggestions"
              aria-autocomplete="list"
            />
          </div>

          {/* Suggestions dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul
              id="site-search-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-card border border-border bg-white py-1.5 shadow-card-hover"
            >
              {suggestions.map((s, i) => (
                <li key={i} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(s.href)}
                    className="w-full px-4 py-2.5 text-left text-sm text-ink transition-colors duration-150 hover:bg-accent-soft/60 focus:bg-accent-soft/60 focus:outline-none"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {helperMessage && (
            <p className="mt-1.5 text-xs text-amber-700" role="alert">
              {helperMessage}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
