/** Kategorije gdje se filtrira samo po gradu u kojem se pružatelj nalazi (locationCity). */
const LOCATION_ONLY_CATEGORIES = ["wedding_salon", "beauty"] as const;

/**
 * Shared "event city" filter: show provider if
 * locationCity === city OR serviceCities has city OR isNationwide.
 * Za wedding_salon i beauty: samo locationCity.
 */
export function cityWhereClause(
  city: string | undefined,
  category?: string
): Record<string, unknown> {
  if (!city || city.trim() === "") return {};
  const c = city.trim();
  if (category && LOCATION_ONLY_CATEGORIES.includes(category as (typeof LOCATION_ONLY_CATEGORIES)[number])) {
    return { locationCity: c };
  }
  return {
    OR: [
      { locationCity: c },
      { serviceCities: { hasSome: [c] } },
      { isNationwide: true },
    ],
  };
}
