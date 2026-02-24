"use client";

import { useMemo, useRef, useState, useCallback, forwardRef } from "react";
import { filterCitiesForAutocomplete, KNOWN_CITY_NAMES } from "@/lib/cities";

const SUGGESTIONS_LIMIT = 8;
const BLUR_DELAY_MS = 150;

export type CityAutocompleteInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export const CityAutocompleteInput = forwardRef<
  HTMLInputElement,
  CityAutocompleteInputProps
>(function CityAutocompleteInput(
  {
    label,
    placeholder = "npr. Sarajevo, Banja Luka…",
    value,
    onChange,
    onSubmit,
    autoFocus,
    id = "city-autocomplete",
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = useMemo(() => {
    const q = value.trim();
    if (!q) return KNOWN_CITY_NAMES;
    return filterCitiesForAutocomplete(value, undefined, SUGGESTIONS_LIMIT);
  }, [value]);
  const showDropdown = isOpen && suggestions.length > 0;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      closeDropdown();
      blurTimeoutRef.current = null;
    }, BLUR_DELAY_MS);
  }, [closeDropdown]);

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const selectSuggestion = useCallback(
    (city: string) => {
      onChange(city);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || suggestions.length === 0) {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit();
        }
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i < suggestions.length - 1 ? i + 1 : i
          );
          return;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) => (i > 0 ? i - 1 : -1));
          return;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            selectSuggestion(suggestions[highlightedIndex]);
          } else {
            onSubmit();
          }
          return;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          return;
        default:
          return;
      }
    },
    [
      showDropdown,
      suggestions,
      highlightedIndex,
      selectSuggestion,
      onSubmit,
      closeDropdown,
    ]
  );

  return (
    <div className="relative min-w-0 max-w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlightedIndex(-1);
          setIsOpen(true);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input-field mt-1.5"
        autoComplete="off"
        aria-label={label}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        aria-autocomplete="list"
        aria-controls={showDropdown ? `${id}-listbox` : undefined}
      />
      {showDropdown && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-52 w-full overflow-auto rounded-card border border-border bg-white py-1.5 shadow-card-hover"
          aria-label="Predlozi gradova"
        >
          {suggestions.map((city, index) => (
            <li
              key={city}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors duration-100 ${
                index === highlightedIndex
                  ? "bg-accent-soft font-medium text-ink"
                  : "text-ink hover:bg-accent-soft/60"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(city);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
