/**
 * Shared "event city" filter: show provider if
 * locationCity === city OR serviceCities has city OR isNationwide.
 * Uses case-insensitive match for locationCity.
 */
export function cityWhereClause(
  city: string | undefined,
  _category?: string
): Record<string, unknown> {
  if (!city || city.trim() === "") return {};
  const c = city.trim();
  return {
    OR: [
      { locationCity: { equals: c, mode: "insensitive" as const } },
      { serviceCities: { hasSome: [c] } },
      { isNationwide: true },
    ],
  };
}
