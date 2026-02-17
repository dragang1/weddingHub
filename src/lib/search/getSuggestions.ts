import { categoryLabel, categoryPath, categoryPathSegment } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";
import { slugifyCity } from "@/lib/cities";
import { parseSearchQuery } from "./parseQuery";

export type Suggestion = {
  label: string;
  href: string;
  kind: "results" | "category" | "city" | "provider" | "help";
};

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

export function getSuggestions(input: string): Suggestion[] {
  const parsed = parseSearchQuery(input);
  const suggestions: Suggestion[] = [];

  const eventQ =
    parsed.eventType && parsed.eventType !== "wedding"
      ? `?event=${parsed.eventType}`
      : "";

  // (a) Category + city -> results
  if (parsed.category && parsed.city) {
    suggestions.push({
      label: `Prikaži ${categoryLabel(parsed.category)} u ${parsed.city}`,
      href: buildResultsHref(parsed.category, parsed.city, parsed.eventType),
      kind: "results",
    });
  }

  // (b) Only category
  if (parsed.category && !parsed.city) {
    suggestions.push({
      label: `Odaberi grad za ${categoryLabel(parsed.category)}`,
      href: "#kategorije",
      kind: "help",
    });
    suggestions.push({
      label: `Prikaži sve ${categoryLabel(parsed.category)}`,
      href: `/kategorija/${categoryPathSegment(parsed.category)}${eventQ}`,
      kind: "category",
    });
  }

  // (c) Only city -> top category links
  if (parsed.city && !parsed.category) {
    suggestions.push({
      label: `Odaberi kategoriju za ${parsed.city}`,
      href: "#kategorije",
      kind: "help",
    });
    const topCats: CategorySlug[] = ["music", "wedding_salon", "photo_video"];
    for (const slug of topCats) {
      suggestions.push({
        label: `${categoryLabel(slug)} u ${parsed.city}`,
        href: buildResultsHref(slug, parsed.city, parsed.eventType),
        kind: "results",
      });
    }
  }

  // (d) Ambiguous salon (category null, low confidence)
  if (
    !parsed.category &&
    parsed.confidence === "low" &&
    (parsed.raw.toLowerCase().includes("salon") ||
      parsed.raw.toLowerCase().includes("sala"))
  ) {
    const cityPart = parsed.city ? ` u ${parsed.city}` : "";
    if (parsed.city) {
      suggestions.push({
        label: `Svadbeni salon u ${parsed.city}`,
        href: buildResultsHref("wedding_salon", parsed.city, parsed.eventType),
        kind: "results",
      });
      suggestions.push({
        label: `Beauty (šminka/frizura) u ${parsed.city}`,
        href: buildResultsHref("beauty", parsed.city, parsed.eventType),
        kind: "results",
      });
    } else {
      suggestions.push({
        label: "Svadbeni salon — odaberi grad",
        href: "/kategorija/svadbeni-salon",
        kind: "category",
      });
      suggestions.push({
        label: "Ljepota (šminka/frizura) — odaberi grad",
        href: "/kategorija/ljepota",
        kind: "category",
      });
    }
  }

  // (e) Always add help suggestion
  suggestions.push({
    label: "Pokušaj: 'muzika Sarajevo' ili 'torta Tuzla'",
    href: "#",
    kind: "help",
  });

  return suggestions.slice(0, 7);
}
