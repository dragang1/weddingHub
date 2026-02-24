export type CategorySlug =
  | "music"
  | "photo_video"
  | "wedding_salon"
  | "cakes"
  | "decoration"
  | "transport"
  | "beauty"
  | "wedding_dresses";

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
    description: "Bendovi i DJ-evi.",
  },
  {
    slug: "photo_video",
    label: "Fotografija i video",
    path: "/fotografija",
    description: "Fotografi i snimanje videa.",
  },
  {
    slug: "wedding_salon",
    label: "Svadbeni salon",
    path: "/svadbeni-salon",
    description: "Sale i restorani za proslave.",
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
    description: "Cvijeće i dekoracija.",
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
    description: "Frizura i šminka.",
  },
  {
    slug: "wedding_dresses",
    label: "Vjenčanice",
    path: "/vjencanice",
    description: "Izbor salona za vjenčanicu.",
  },
];

export function parseCategory(input: string): CategorySlug | null {
  const bySlug = CATEGORIES.find((c) => c.slug === input);
  if (bySlug) return bySlug.slug;
  return slugFromPathSegment(input);
}

/** BHS path segment for SEO (e.g. "muzika", "fotografija") - no leading slash */
export function categoryPathSegment(slug: CategorySlug): string {
  const match = CATEGORIES.find((c) => c.slug === slug);
  return match ? match.path.replace(/^\//, "") : slug;
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

