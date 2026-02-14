/**
 * Event types (occasion) for filtering and copy.
 * Wedding is the default and canonical; others use ?event= in URL.
 */

export type EventTypeSlug = "wedding" | "birthday" | "baptism" | "celebration";

type EventConfig = {
  slug: EventTypeSlug;
  label: string;
  icon: string;
  headingPrefix: string;
};

export const EVENT_TYPES: EventConfig[] = [
  { slug: "wedding", label: "Vjenčanje", icon: "💍", headingPrefix: "za vjenčanje" },
  { slug: "birthday", label: "Rođendan", icon: "🎂", headingPrefix: "za rođendan" },
  { slug: "baptism", label: "Krštenje", icon: "✝️", headingPrefix: "za krštenje" },
  { slug: "celebration", label: "Proslave", icon: "🎉", headingPrefix: "za proslave" },
];

const SLUG_SET = new Set<string>(EVENT_TYPES.map((e) => e.slug));

/**
 * Parse event type from URL/input; defaults to wedding.
 */
export function parseEventType(input: string | null | undefined): EventTypeSlug {
  const s = (input ?? "").trim().toLowerCase();
  if (SLUG_SET.has(s)) return s as EventTypeSlug;
  return "wedding";
}

export function eventLabel(slug: EventTypeSlug): string {
  const e = EVENT_TYPES.find((x) => x.slug === slug);
  return e?.label ?? "Vjenčanje";
}

export function eventHeadingPrefix(slug: EventTypeSlug): string {
  const e = EVENT_TYPES.find((x) => x.slug === slug);
  return e?.headingPrefix ?? "za vjenčanje";
}

export function eventIcon(slug: EventTypeSlug): string {
  const e = EVENT_TYPES.find((x) => x.slug === slug);
  return e?.icon ?? "💍";
}

/** CTA button text on ProviderCard by event type */
export function eventCtaLabel(slug: EventTypeSlug): string {
  switch (slug) {
    case "wedding":
      return "Kontaktiraj za vjenčanje";
    case "birthday":
      return "Provjeri dostupnost";
    case "baptism":
    case "celebration":
      return "Pošalji upit";
    default:
      return "Kontaktiraj";
  }
}

/**
 * Short subtext for category + event (BHS).
 * Used below H1 on results page.
 */
export function categoryEventSubtext(
  _categorySlug: string,
  eventType: EventTypeSlug
): string {
  switch (eventType) {
    case "wedding":
      return "Odaberite ponuđača i kontaktirajte ga u nekoliko klikova.";
    case "birthday":
      return "Pronađite ponuđače za rođendansku proslavu.";
    case "baptism":
      return "Pronađite ponuđače za krštenje.";
    case "celebration":
      return "Pronađite ponuđače za vašu proslavu.";
    default:
      return "Odaberite ponuđača i kontaktirajte ga u nekoliko klikova.";
  }
}
