import { prisma } from "@/lib/db";
import { CATEGORIES, categoryPathSegment } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://weddinghub.example.com";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const providers = await prisma.provider.findMany({
    where: { isActive: true },
    select: { id: true, createdAt: true },
  });

  const providerUrls = providers.map((p) => ({
    url: `${BASE}/profil/${p.id}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${BASE}/kategorija/${categoryPathSegment(cat.slug as CategorySlug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    ...categoryUrls,
    ...providerUrls,
  ];
}
