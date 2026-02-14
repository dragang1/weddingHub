import { prisma } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://weddinghub.example.com";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const providers = await prisma.provider.findMany({
    select: { id: true, createdAt: true },
  });

  const providerUrls = providers.map((p) => ({
    url: `${BASE}/profil/${p.id}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = [
    { url: `${BASE}/kategorija/music`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/kategorija/photo_video`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/kategorija/decor`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    ...categoryUrls,
    ...providerUrls,
  ];
}
