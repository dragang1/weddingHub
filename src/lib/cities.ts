/**
 * City slug utilities for URL-safe city identifiers.
 * No database table; slugs are derived from display names.
 */

export type KnownCity = { name: string; slug: string };

const DIACRITICS: Record<string, string> = {
  č: "c",
  ć: "c",
  đ: "d",
  š: "s",
  ž: "z",
  Č: "c",
  Ć: "c",
  Đ: "d",
  Š: "s",
  Ž: "z",
};

function removeDiacritics(s: string): string {
  return s.replace(/[čćđšžČĆĐŠŽ]/g, (ch) => DIACRITICS[ch] ?? ch);
}

/**
 * Removes diacritics (čćđšž → ccdsz). Exported for reuse.
 */
export function stripDiacritics(input: string): string {
  return removeDiacritics(input);
}

/**
 * Title-case a city string: "banja luka" → "Banja Luka".
 * Preserves diacritics.
 */
export function titleCaseCity(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Normalize city for DB storage: preserves diacritics.
 * Trim, collapse whitespace, Title Case. For display storage.
 */
export function normalizeCityForDb(input: string): string {
  if (!input || typeof input !== "string") return "";
  const t = input.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return titleCaseCity(t);
}

/**
 * Strip diacritics and normalize for slug input (ASCII preparation).
 */
export function normalizeCityForSlug(input: string): string {
  if (!input || typeof input !== "string") return "";
  const t = input.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return removeDiacritics(t).toLowerCase();
}

/**
 * Converts a city name to a URL-safe slug.
 * Removes diacritics, allows only [a-z0-9\s_-], hyphens for spaces.
 */
export function slugifyCity(input: string): string {
  if (!input || typeof input !== "string") return "";
  let t = input.trim().toLowerCase();
  t = removeDiacritics(t);
  t = t.replace(/[^a-z0-9\s_-]/g, "");
  t = t.replace(/[\s_]+/g, "-");
  t = t.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return t;
}

/** Compact form for matching: lowercase, no spaces/dashes (e.g. "banjaluka") */
function compactSlug(s: string): string {
  return slugifyCity(s).replace(/-/g, "");
}

const KNOWN_CITY_NAMES_RAW = [
  "Banja Luka",
  "Sarajevo",
  "Mostar",
  "Tuzla",
  "Zenica",
  "Doboj",
  "Široki Brijeg",
  "Trebinje",
  "Prijedor",
  "Bijeljina",
  "Bugojno",
  "Konjic",
  "Livno",
  "Doboj Istok",
  "Gračanica",
  "Gradačac",
  "Visoko",
  "Goražde",
  "Lukavac",
  "Kakanj",
  "Sanski Most",
  "Bosanska Krupa",
  "Jajce",
  "Neum",
  "Modriča",
  "Živinice",
  "Čapljina",
  "Bihać",
  "Brčko",
  "Bileća",
  "Gradiška",
];

const KNOWN_CITIES: KnownCity[] = KNOWN_CITY_NAMES_RAW.map((raw) => {
  const name = normalizeCityForDb(raw);
  return { name, slug: slugifyCity(name) };
});

/** Compact form → canonical slug for fast lookup */
const COMPACT_TO_SLUG = new Map<string, string>();
for (const c of KNOWN_CITIES) {
  COMPACT_TO_SLUG.set(compactSlug(c.name), c.slug);
  COMPACT_TO_SLUG.set(compactSlug(c.slug), c.slug);
}

/** Pretty display names (normalized, with diacritics) for autocomplete and UI. */
export const KNOWN_CITY_NAMES: string[] = KNOWN_CITIES.map((c) => c.name);

/**
 * Filter known cities for autocomplete. Returns pretty display names.
 * Matching: case-insensitive, diacritics ignored. Prefix first, then contains.
 */
export function filterCitiesForAutocomplete(
  query: string,
  knownCities: string[] = KNOWN_CITY_NAMES,
  maxSuggestions: number = 8,
): string[] {
  const q = (query || "").trim();
  if (!q) return [];
  const norm = stripDiacritics(q).toLowerCase();
  const prefixMatches: string[] = [];
  const containsMatches: string[] = [];
  for (const city of knownCities) {
    const cityNorm = stripDiacritics(city).toLowerCase();
    if (cityNorm.startsWith(norm)) prefixMatches.push(city);
    else if (cityNorm.includes(norm)) containsMatches.push(city);
  }
  const combined = [...prefixMatches, ...containsMatches];
  return combined.slice(0, maxSuggestions);
}

/**
 * Resolve user city input to canonical URL slug.
 * Samo gradovi iz liste (KNOWN_CITIES). Nepoznat grad → "".
 * "banjaluka", "Banja Luka", "banja-luka" → "banja-luka"
 */
export function cityInputToCanonicalSlug(input: string): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  const compact = compactSlug(trimmed);
  if (!compact) return "";
  const slug = COMPACT_TO_SLUG.get(compact);
  return slug ?? "";
}

/** Kratki aliasi za gradove (npr. "sa" → Sarajevo) za search. */
const CITY_ALIASES: Record<string, string> = {
  sa: "Sarajevo",
  bl: "Banja Luka",
};

/**
 * Resolve token(s) to known city display name for search parsing.
 * Returns display name (e.g. "Bugojno") only if input matches a known city; otherwise null.
 */
export function resolveCityDisplayName(input: string): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  const alias = CITY_ALIASES[stripDiacritics(trimmed)];
  if (alias) return alias;
  const slug = cityInputToCanonicalSlug(trimmed);
  if (!slug) return null;
  const known = KNOWN_CITIES.find((c) => c.slug === slug);
  return known ? known.name : null;
}

/**
 * Convert URL slug to pretty display name. Known cities: normalized name with diacritics.
 * Unknown: title-cased fallback (replace -/_ with space, collapse, no diacritic restoration).
 */
export function prettyCityFromSlug(slug: string): string {
  if (!slug || typeof slug !== "string") return "";
  let decoded: string;
  try {
    decoded = decodeURIComponent(slug.trim());
  } catch {
    decoded = slug.trim();
  }
  const canonical = slugifyCity(decoded);
  const known = KNOWN_CITIES.find((c) => c.slug === canonical);
  if (known) return known.name;
  const fallbackString = decoded
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return titleCaseCity(fallbackString);
}

/**
 * Parse comma/newline city list. Output: pretty names (normalized, diacritics preserved).
 * Dedupe: diacritics-insensitive, case-insensitive.
 */
export function parseCityList(input: string): string[] {
  if (!input || typeof input !== "string") return [];
  const raw = input
    .split(/[,\n]+/)
    .map((s) => normalizeCityForDb(s.trim()))
    .filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const city of raw) {
    const key = stripDiacritics(city).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const slug = cityInputToCanonicalSlug(city);
    const pretty = slug ? prettyCityFromSlug(slug) : city;
    result.push(pretty);
  }
  return result;
}

/** Popular cities for home chips and listing empty state (pretty with diacritics) */
export const POPULAR_CITY_NAMES: string[] = [
  "Sarajevo",
  "Banja Luka",
  "Mostar",
  "Tuzla",
  "Zenica",
  "Bijeljina",
  "Bihać",
];
