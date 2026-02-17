import { NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseCategory } from "@/lib/categories";
import { normalizeCityForDb, parseCityList } from "@/lib/cities";

type RouteParams = { params: Promise<{ id: string }> };

const eventTypesSchema = z
  .array(z.enum(["wedding", "birthday", "baptism", "celebration"]))
  .min(1)
  .optional();

const updateProviderSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  locationCity: z.string().optional(),
  serviceCities: z.union([z.array(z.string()), z.string()]).optional(),
  isNationwide: z.boolean().optional(),
  eventTypes: eventTypesSchema,
  description: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  videoLinks: z.array(z.string()).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  imageKey: z.string().nullable().optional(),
  coverImageKey: z.string().nullable().optional(),
  galleryImageKeys: z.array(z.string()).optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateProviderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const categorySlug = data.category != null ? parseCategory(data.category) : null;
  if (data.category != null && categorySlug === null) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  let locationCity: string | undefined;
  if (data.locationCity != null) {
    locationCity = normalizeCityForDb(data.locationCity);
    if (!locationCity) {
      return Response.json(
        { error: "Grad (baza) ne smije biti prazan nakon normalizacije." },
        { status: 400 }
      );
    }
  }

  let serviceCities: string[] | undefined;
  if (data.serviceCities != null) {
    const raw =
      Array.isArray(data.serviceCities)
        ? data.serviceCities.join("\n")
        : String(data.serviceCities);
    serviceCities = parseCityList(raw);
    const existing = await prisma.provider.findUnique({
      where: { id },
      select: { isNationwide: true, locationCity: true },
    });
    const isNationwide = data.isNationwide ?? existing?.isNationwide ?? false;
    const baseCity = locationCity ?? existing?.locationCity;
    if (!isNationwide && baseCity) {
      if (serviceCities.length === 0) {
        serviceCities = [baseCity];
      } else {
        const hasBase = serviceCities.some((c) => c.toLowerCase() === baseCity.toLowerCase());
        if (!hasBase) {
          serviceCities = [baseCity, ...serviceCities];
        }
      }
    }
  }

  const updateData: Record<string, unknown> = {
    ...(data.name != null && { name: data.name }),
    ...(categorySlug != null && { category: categorySlug }),
    ...(data.subcategory !== undefined && { subcategory: (data.subcategory ?? "").trim() }),
    ...(locationCity != null && { locationCity }),
    ...(serviceCities != null && { serviceCities }),
    ...(data.isNationwide !== undefined && { isNationwide: data.isNationwide }),
    ...(data.eventTypes != null && data.eventTypes.length > 0 && { eventTypes: data.eventTypes }),
    ...(data.description != null && { description: data.description }),
    ...(data.galleryImages != null && { galleryImages: data.galleryImages }),
    ...(data.videoLinks != null && { videoLinks: data.videoLinks }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.website !== undefined && { website: data.website }),
    ...(data.address !== undefined && { address: data.address }),
    ...(data.imageKey !== undefined && { imageKey: data.imageKey }),
    ...(data.coverImageKey !== undefined && { coverImageKey: data.coverImageKey }),
    ...(data.galleryImageKeys !== undefined && { galleryImageKeys: data.galleryImageKeys }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
  };

  if (data.instagram !== undefined || data.facebook !== undefined) {
    const existing = await prisma.provider.findUnique({
      where: { id },
      select: { details: true },
    });
    const current = (existing?.details as Record<string, unknown>) ?? {};
    const merged = {
      ...current,
      instagram: data.instagram !== undefined ? (data.instagram?.trim() || null) : current.instagram,
      facebook: data.facebook !== undefined ? (data.facebook?.trim() || null) : current.facebook,
    };
    updateData.details = merged;
  }

  const provider = await prisma.provider.update({
    where: { id },
    data: updateData as Parameters<typeof prisma.provider.update>[0]["data"],
  });
  return Response.json(provider);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  await prisma.provider.delete({ where: { id } });
  return Response.json({ ok: true });
}
