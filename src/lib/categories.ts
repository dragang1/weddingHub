export type CategorySlug =
  | "music"
  | "photo_video"
  | "wedding_salon"
  | "cakes"
  | "decoration"
  | "transport"
  | "beauty";

type CategoryConfig = {
  slug: CategorySlug;
  label: string;
  path: string;
  description: string;
};

/**
 * Single source of truth for all allowed categories.
 *
 * - `slug` is the internal value stored in the database.
 * - `label` is the human-facing name (BHS).
 * - `path` is the SEO-friendly root path segment for that category.
 * - `description` is the one-line marketing copy for the home page.
 */
export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "music",
    label: "Muzika",
    path: "/muzika",
    description: "Bendovi i DJ-evi za nezaboravnu atmosferu.",
  },
  {
    slug: "photo_video",
    label: "Fotografija i video",
    path: "/fotografija",
    description: "Fotografi i video timovi za vaš dan.",
  },
  {
    slug: "wedding_salon",
    label: "Svadbeni salon",
    path: "/svadbeni-salon",
    description: "Sale, restorani i prostori za proslavu.",
  },
  {
    slug: "cakes",
    label: "Torte i slatkiši",
    path: "/torte",
    description: "Svadbene torte i slatki stolovi.",
  },
  {
    slug: "decoration",
    label: "Dekoracija",
    path: "/dekoracija",
    description: "Cvijeće, dekor i kompletan ambijent.",
  },
  {
    slug: "transport",
    label: "Transport",
    path: "/limuzine",
    description: "Prevoz za mladence i goste.",
  },
  {
    slug: "beauty",
    label: "Ljepota",
    path: "/ljepota",
    description: "Frizura, šminka i beauty usluge.",
  },
];

/** Emoji icons for category cards and strips. Key is CategorySlug. */
export const CATEGORY_ICONS: Record<string, string> = {
  music: "🎵",
  photo_video: "📷",
  wedding_salon: "👗",
  cakes: "🎂",
  decoration: "💐",
  transport: "🚗",
  beauty: "💄",
};

export function parseCategory(input: string): CategorySlug | null {
  const match = CATEGORIES.find((c) => c.slug === input);
  return match?.slug ?? null;
}

export function categoryLabel(slug: CategorySlug): string {
  const match = CATEGORIES.find((c) => c.slug === slug);
  return match?.label ?? slug;
}

export function categoryPath(slug: CategorySlug): string {
  const match = CATEGORIES.find((c) => c.slug === slug);
  return match?.path ?? "/";
}

export function categoryDescription(slug: CategorySlug): string {
  const match = CATEGORIES.find((c) => c.slug === slug);
  return match?.description ?? "";
}

/** First path segment (no leading slash) to CategorySlug, e.g. "muzika" -> "music" */
export function slugFromPathSegment(segment: string): CategorySlug | null {
  const match = CATEGORIES.find((c) => c.path === `/${segment}` || c.path.slice(1) === segment);
  return match?.slug ?? null;
}

