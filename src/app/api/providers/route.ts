import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseCategory } from "@/lib/categories";
import { parseEventType } from "@/lib/events";
import { cityWhereClause } from "@/lib/providers";

const querySchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  event: z.string().optional(),
  subcategory: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const parsed = querySchema.safeParse({
    category: sp.get("category") ?? undefined,
    city: sp.get("city") ?? undefined,
    event: sp.get("event") ?? undefined,
    subcategory: sp.get("subcategory") ?? undefined,
    q: sp.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { category: categoryInput, city, event: eventInput, subcategory, q } = parsed.data;
  const eventType = parseEventType(eventInput ?? null);

  const categorySlug = categoryInput ? parseCategory(categoryInput) : null;
  if (categoryInput != null && categoryInput !== "" && categorySlug === null) {
    return Response.json(
      { error: "Invalid category", allowed: "music, photo_video, wedding_salon, cakes, decoration, transport, beauty" },
      { status: 400 }
    );
  }

  const cityFilter = cityWhereClause(city, categorySlug ?? undefined);

  const providersRaw = await prisma.provider.findMany({
    where: {
      isActive: true,
      ...(categorySlug && { category: categorySlug }),
      ...cityFilter,
      ...(subcategory?.trim() && { subcategory: subcategory.trim() }),
      ...(q?.trim() && {
        OR: [
          { name: { contains: q.trim(), mode: "insensitive" } },
          { description: { contains: q.trim(), mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      locationCity: true,
      serviceCities: true,
      isNationwide: true,
      eventTypes: true,
      description: true,
      galleryImages: true,
      videoLinks: true,
      coverImageUrl: true,
      coverImageAttribution: true,
      createdAt: true,
    },
  });

  const providers = providersRaw.filter((p) => {
    const types = p.eventTypes ?? [];
    if (types.length === 0) return eventType === "wedding";
    return types.includes(eventType);
  });
  return Response.json(providers);
}
