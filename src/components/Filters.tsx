"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { cityInputToCanonicalSlug, prettyCityFromSlug } from "@/lib/cities";

type FiltersProps = {
  category: string;
  cities: string[];
  subcategories: string[];
  basePath?: string;
  selectedCitySlug?: string;
};

export function Filters({
  category,
  cities,
  subcategories,
  basePath,
  selectedCitySlug,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usePathCity = Boolean(basePath && selectedCitySlug != null);
  const prefix = usePathCity
    ? `${basePath}/${selectedCitySlug}`
    : basePath ?? `/kategorija/${category}`;

  const update = useCallback(
    (key: string, value: string) => {
      if (usePathCity && key === "city") {
        const citySlug = cityInputToCanonicalSlug(value);
        const rest = searchParams.toString();
        router.push(
          rest ? `${basePath}/${citySlug}?${rest}` : `${basePath}/${citySlug}`
        );
        return;
      }
      const next = new URLSearchParams(searchParams.toString());
      if (value)
        next.set(key, key === "city" ? cityInputToCanonicalSlug(value) : value);
      else next.delete(key);
      const qs = next.toString();
      router.push(qs ? `${prefix}?${qs}` : prefix);
    },
    [basePath, prefix, router, searchParams, usePathCity]
  );

  const cityDisplay = usePathCity
    ? prettyCityFromSlug(selectedCitySlug ?? "")
    : (() => {
        const q = searchParams.get("city") ?? "";
        if (!q) return "";
        const canonicalSlug = cityInputToCanonicalSlug(q);
        return canonicalSlug ? prettyCityFromSlug(canonicalSlug) : "";
      })();

  const cityOptions = useMemo(() => {
    if (!cityDisplay || cities.includes(cityDisplay)) return cities;
    return [cityDisplay, ...cities];
  }, [cities, cityDisplay]);

  const city = cityDisplay;
  const subcategory = searchParams.get("subcategory") ?? "";

  return (
    <aside className="card min-w-0 max-w-full p-5">
      <h3 className="section-label mb-5">Filteri</h3>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="filter-city"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Grad
          </label>
          <select
            id="filter-city"
            value={city}
            onChange={(e) => update("city", e.target.value)}
            className="input-field py-2.5"
            aria-label="Odaberi grad"
          >
            <option value="">Svi gradovi</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {subcategories.length > 0 && (
          <div>
            <label
              htmlFor="filter-subcategory"
              className="mb-1.5 block text-sm font-semibold text-ink"
            >
              Podkategorija
            </label>
            <select
              id="filter-subcategory"
              value={subcategory}
              onChange={(e) => update("subcategory", e.target.value)}
              className="input-field py-2.5"
              aria-label="Odaberi podkategoriju"
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
      </div>
    </aside>
  );
}
