import { stripDiacritics, resolveCityDisplayName } from "@/lib/cities";
import type { CategorySlug } from "@/lib/categories";
import type { EventTypeSlug } from "@/lib/events";

export type EventType = EventTypeSlug;

export type ParsedSearch = {
  raw: string;
  category: CategorySlug | null;
  city: string | null;
  eventType: EventType | null;
  remaining: string;
  confidence: "high" | "medium" | "low";
};

/** Single token (normalized) -> CategorySlug. Salon/sala resolved later. */
const CATEGORY_KEYWORDS: Record<string, CategorySlug> = {
  muzika: "music",
  bend: "music",
  dj: "music",
  trubaci: "music",
  harmonika: "music",
  violina: "music",
  fotograf: "photo_video",
  fotografija: "photo_video",
  video: "photo_video",
  snimanje: "photo_video",
  kameraman: "photo_video",
  dron: "photo_video",
  svadbeni: "wedding_salon",
  hotel: "wedding_salon",
  restoran: "wedding_salon",
  prostor: "wedding_salon",
  vjencanje: "wedding_salon",
  torta: "cakes",
  torte: "cakes",
  kolaci: "cakes",
  slatki: "cakes",
  dekor: "decoration",
  dekoracija: "decoration",
  cvijece: "decoration",
  baloni: "decoration",
  rasvjeta: "decoration",
  prevoz: "transport",
  transport: "transport",
  limuzina: "transport",
  oldtimer: "transport",
  auto: "transport",
  kombi: "transport",
  sminka: "beauty",
  frizura: "beauty",
  frizer: "beauty",
  barber: "beauty",
  nokti: "beauty",
  makeup: "beauty",
  vjencanice: "wedding_dresses",
  vjencanica: "wedding_dresses",
  haljina: "wedding_dresses",
  haljine: "wedding_dresses",
  svadbeno: "wedding_dresses",
  rublje: "wedding_dresses",
};

const BEAUTY_TOKENS = new Set(["sminka", "frizura", "frizer", "barber", "nokti", "makeup"]);
/** For salon ambiguity: other tokens that imply wedding_salon (not salon/sala themselves). */
const WEDDING_SALON_TOKENS = new Set([
  "svadba",
  "vjencanje",
  "svadbeni",
  "hotel",
  "restoran",
  "prostor",
]);

const EVENT_KEYWORDS: Record<string, EventType> = {
  svadba: "wedding",
  vjencanje: "wedding",
  rodjendan: "birthday",
  krstenje: "baptism",
  proslava: "celebration",
};

function normalizeToken(s: string): string {
  return stripDiacritics(s.toLowerCase()).replace(/^-+|-+$/g, "");
}

function tokenize(input: string): string[] {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0107\u010d\u0161\u017e\u0111\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return [];
  return cleaned.split(" ").map((t) => t.replace(/^-+|-+$/g, ""));
}

export function parseSearchQuery(input: string): ParsedSearch {
  const raw = input.trim();
  const tokens = tokenize(raw);
  const normalized = tokens.map(normalizeToken);

  let category: CategorySlug | null = null;
  let city: string | null = null;
  let eventType: EventType | null = null;
  const used = new Set<number>();

  // City: check single token and two-word (sve poznati gradovi iz cities.ts)
  for (let i = 0; i < normalized.length; i++) {
    if (city) break;
    const one = resolveCityDisplayName(normalized[i]);
    if (one) {
      city = one;
      used.add(i);
      break;
    }
    if (i + 1 < normalized.length) {
      const two = `${normalized[i]} ${normalized[i + 1]}`;
      const twoCity = resolveCityDisplayName(two);
      if (twoCity) {
        city = twoCity;
        used.add(i);
        used.add(i + 1);
        break;
      }
    }
  }

  // Event
  for (let i = 0; i < normalized.length; i++) {
    if (used.has(i)) continue;
    const t = normalized[i];
    if (EVENT_KEYWORDS[t]) {
      eventType = EVENT_KEYWORDS[t];
      used.add(i);
      break;
    }
  }

  // Category: first check for salon/sala ambiguity
  const hasSalon = normalized.some((t) => t === "salon" || t === "sala");
  const salonIndex = normalized.findIndex((t) => t === "salon" || t === "sala");

  if (hasSalon && salonIndex >= 0) {
    const hasBeauty = normalized.some((t) => BEAUTY_TOKENS.has(t));
    const hasWedding = normalized.some((t) => WEDDING_SALON_TOKENS.has(t));
    if (hasBeauty) {
      category = "beauty";
      used.add(salonIndex);
    } else if (hasWedding) {
      category = "wedding_salon";
      used.add(salonIndex);
    } else if (city) {
      // "salon" + grad bez drugih riječi → svadbeni salon
      category = "wedding_salon";
      used.add(salonIndex);
    } else {
      // ambiguous: leave category null, confidence low
      used.add(salonIndex);
    }
  }

  // Category: other keywords (if not already set by salon)
  if (!category) {
    for (let i = 0; i < normalized.length; i++) {
      if (used.has(i)) continue;
      const t = normalized[i];
      if (CATEGORY_KEYWORDS[t]) {
        category = CATEGORY_KEYWORDS[t];
        used.add(i);
        break;
      }
    }
  }

  // Two-word "slatki sto" for cakes
  if (!category) {
    for (let i = 0; i + 1 < normalized.length; i++) {
      if (used.has(i) || used.has(i + 1)) continue;
      const two = `${normalized[i]} ${normalized[i + 1]}`;
      if (two === "slatki sto") {
        category = "cakes";
        used.add(i);
        used.add(i + 1);
        break;
      }
    }
  }

  const remaining = tokens
    .filter((_, i) => !used.has(i))
    .join(" ")
    .trim();

  let confidence: ParsedSearch["confidence"] = "low";
  if (hasSalon && !category) {
    confidence = "low"; // ambiguous salon: show both suggestions
  } else if (category && city) {
    confidence = "high";
  } else if (category || city) {
    confidence = "medium";
  }

  return {
    raw,
    category,
    city,
    eventType,
    remaining,
    confidence,
  };
}
