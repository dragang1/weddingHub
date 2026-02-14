/**
 * City slug utilities for URL-safe city identifiers.
 * No database table; slugs are derived from display names.
 */

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
 * Normalize a city string for DB storage so filtering matches URL slugs
 * (prettyCityFromSlug produces no diacritics, Title Case).
 * - trim, collapse whitespace, strip diacritics, title-case.
 * Returns empty string if input is empty after trim.
 */
export function normalizeCityForDb(input: string): string {
  if (!input || typeof input !== "string") return "";
  const t = input.trim().replace(/\s+/g, " ");
  if (!t) return "";
  const noDiacritics = removeDiacritics(t);
  return titleCaseCity(noDiacritics);
}

/**
 * Parse comma- or newline-separated city list into normalized array.
 * - split by /[,\n]+/, normalize each via normalizeCityForDb
 * - remove empties, dedupe case-insensitive preserving order
 */
export function parseCityList(input: string): string[] {
  if (!input || typeof input !== "string") return [];
  const raw = input.split(/[,\n]+/).map((s) => normalizeCityForDb(s.trim())).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const city of raw) {
    const key = city.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(city);
  }
  return result;
}

/**
 * Converts a city name (user input or display) to a URL-safe slug.
 * - trim, lowercase
 * - spaces/underscores → single hyphen
 * - diacritics (čćđšž) → ccdsz
 * - collapse multiple dashes
 */
export function slugifyCity(input: string): string {
  if (!input || typeof input !== "string") return "";
  let t = input.trim().toLowerCase();
  t = removeDiacritics(t);
  t = t.replace(/[\s_]+/g, "-");
  t = t.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return t;
}

/** Known BiH cities (display name, normalized) for slug resolution and autocomplete */
const KNOWN_CITIES: string[] = [
  "Banja Luka",
  "Sarajevo",
  "Mostar",
  "Tuzla",
  "Zenica",
  "Doboj",
  "Siroki Brijeg",
  "Trebinje",
  "Prijedor",
  "Bijeljina",
  "Bugojno",
  "Konjic",
  "Livno",
  "Doboj Istok",
  "Gračanica",
  "Gradacac",
  "Visoko",
  "Gorazde",
  "Lukavac",
  "Kakanj",
  "Sanski Most",
  "Bosanska Krupa",
  "Jajce",
  "Neum",
  "Modrica",
  "Zivinice",
  "Capljina",
  "Bihac",
  "Brcko",
  "Bileca",
].map((name) => normalizeCityForDb(name)).filter(Boolean);

/** Exported for autocomplete; same list as used for canonical slug resolution. */
export const KNOWN_CITY_NAMES: string[] = KNOWN_CITIES;

/**
 * Filter known cities for autocomplete: case-insensitive, diacritics ignored.
 * Prefix matches first, then contains. Returns at most maxSuggestions (default 8).
 */
export function filterCitiesForAutocomplete(
  query: string,
  knownCities: string[] = KNOWN_CITY_NAMES,
  maxSuggestions: number = 8
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

/** Compact form for matching: lowercase, no spaces/dashes (e.g. "banjaluka") */
function compactSlug(s: string): string {
  return slugifyCity(s).replace(/-/g, "");
}

/**
 * Resolve user city input to canonical URL slug.
 * E.g. "banjaluka" or "banja luka" → "banja-luka"; "Banja Luka" → "banja-luka".
 * Uses known cities so "banjaluka" matches "Banja Luka" and yields slug "banja-luka".
 */
export function cityInputToCanonicalSlug(input: string): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  const compact = compactSlug(trimmed);
  if (!compact) return "";
  for (const known of KNOWN_CITIES) {
    if (compactSlug(known) === compact) return slugifyCity(known);
  }
  return slugifyCity(normalizeCityForDb(trimmed));
}

/**
 * Converts a URL slug back to a display-friendly city name.
 * - decode (handles encoded slugs if needed)
 * - replace - with space
 * - Title Case (e.g. Sarajevo, Banja Luka)
 * No diacritics restoration (keep it simple).
 */
export function prettyCityFromSlug(slug: string): string {
  if (!slug || typeof slug !== "string") return "";
  const decoded = decodeURIComponent(slug.trim());
  const withSpaces = decoded.replace(/-+/g, " ");
  return withSpaces
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Popular cities for home chips and listing empty state */
export const POPULAR_CITY_NAMES = [
  "Sarajevo",
  "Banja Luka",
  "Mostar",
  "Tuzla",
  "Zenica",
  "Bijeljina",
  "Bihać",
];
