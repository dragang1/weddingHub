"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileMenuSheet } from "./MobileMenuSheet";
import { parseSearchQuery } from "@/lib/search/parseQuery";
import { getSuggestions } from "@/lib/search/getSuggestions";
import { categoryPath } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";
import { slugifyCity } from "@/lib/cities";
import { useActiveSection } from "@/contexts/ActiveSectionContext";
import { ThemeToggle } from "@/components/ThemeToggle";

type SearchSuggestion = { label: string; href: string };

function SearchBlock({
  id,
  searchValue,
  setSearchValue,
  setHelperMessage,
  helperMessage,
  suggestions,
  showDropdown,
  setFocused,
  handleSearchSubmit,
  handleSuggestionClick,
}: {
  id: string;
  searchValue: string;
  setSearchValue: (v: string) => void;
  setHelperMessage: (v: string) => void;
  helperMessage: string;
  suggestions: SearchSuggestion[];
  showDropdown: boolean;
  setFocused: (v: boolean) => void;
  handleSearchSubmit: () => void;
  handleSuggestionClick: (href: string) => void;
}) {
  return (
    <div className="relative w-full min-w-0 max-w-full">
      <label htmlFor={id} className="sr-only">
        Pretražite usluge i grad
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
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
          id={id}
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setHelperMessage("");
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), handleSearchSubmit())
          }
          placeholder="npr. muzika Sarajevo"
          className="w-full min-w-0 max-w-full rounded-full border border-stone-200 bg-white/80 py-2.5 pl-11 pr-4 text-base text-ink placeholder:text-stone-400 transition-all duration-300 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none select-text md:text-sm shadow-sm"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${id}-suggestions`}
          aria-autocomplete="list"
        />
      </div>
      {showDropdown && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 py-1 shadow-marketplace-hover"
        >
          {suggestions.map((s, i) => (
            <li key={i} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(s.href)}
                className="w-full px-4 py-2.5 text-left text-sm text-ink dark:text-stone-100 transition-colors duration-150 hover:bg-accent-soft/50 dark:hover:bg-stone-700 focus:bg-accent-soft/50 dark:focus:bg-stone-700 focus:outline-none rounded-lg mx-1"
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
  );
}

function buildResultsHref(
  category: CategorySlug,
  city: string,
  eventType: string | null,
): string {
  const path = categoryPath(category);
  const citySlug = slugifyCity(city);
  const eventQ =
    eventType && eventType !== "wedding" ? `?event=${eventType}` : "";
  return `${path}/${citySlug}${eventQ}`;
}

export function SiteHeader() {
  const router = useRouter();
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [focused, setFocused] = useState(false);
  const suggestions = getSuggestions(searchValue);
  const showDropdown = focused && searchValue.trim().length > 0;

  function handleSearchSubmit() {
    setHelperMessage("");
    const parsed = parseSearchQuery(searchValue);
    if (parsed.confidence === "high" && parsed.category && parsed.city) {
      router.push(
        buildResultsHref(parsed.category, parsed.city, parsed.eventType),
      );
      return;
    }
    if (parsed.category && !parsed.city && parsed.remaining.trim()) {
      setHelperMessage("Grad nije u listi. Probajte drugi grad.");
      return;
    }
    setHelperMessage("Unesite npr. muzika Sarajevo.");
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
    <header className="sticky top-0 z-50 glass border-b border-stone-200/80 dark:bg-stone-900/90 dark:border-stone-700/50 dark:backdrop-blur-xl">
      <div
        className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-60"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="group shrink-0 flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-stone-100">
              Event<span className="text-accent italic font-light">Hub</span>
            </span>
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-m-2 rounded-full p-2 text-ink dark:text-stone-100 transition-colors hover:bg-stone-100 dark:hover:bg-stone-700 sm:hidden"
            aria-label="Otvori meni"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5"
              />
            </svg>
          </button>

          <div className="hidden min-w-0 flex-1 sm:flex justify-center max-w-lg">
            <SearchBlock
              id="site-search-desktop"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setHelperMessage={setHelperMessage}
              helperMessage={helperMessage}
              suggestions={suggestions}
              showDropdown={showDropdown}
              setFocused={setFocused}
              handleSearchSubmit={handleSearchSubmit}
              handleSuggestionClick={handleSuggestionClick}
            />
          </div>

          <nav className="hidden shrink-0 items-center gap-1 sm:flex">
            <Link
              href="/#kako-funkcionise"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-ink hover:bg-stone-100 dark:hover:bg-stone-700 dark:hover:text-stone-100 ${
                activeSection === "kako-funkcionise"
                  ? "text-ink bg-stone-100/80 font-semibold dark:bg-stone-700/80 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              Kako radi
            </Link>
            <Link
              href="/#kategorije"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-ink hover:bg-stone-100 dark:hover:bg-stone-700 dark:hover:text-stone-100 ${
                activeSection === "kategorije"
                  ? "text-ink bg-stone-100/80 font-semibold dark:bg-stone-700/80 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              Usluge
            </Link>

            <Link
              href="/postanite-partner"
              className="btn-accent ml-2 py-2 px-5 text-xs rounded-full"
            >
              Za partnere
            </Link>
          </nav>
        </div>

        <div className="mt-4 min-w-0 max-w-full sm:hidden">
          <SearchBlock
            id="site-search-mobile"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setHelperMessage={setHelperMessage}
            helperMessage={helperMessage}
            suggestions={suggestions}
            showDropdown={showDropdown}
            setFocused={setFocused}
            handleSearchSubmit={handleSearchSubmit}
            handleSuggestionClick={handleSuggestionClick}
          />
        </div>
        <MobileMenuSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeSection={activeSection}
        />
      </div>
    </header>
  );
}
