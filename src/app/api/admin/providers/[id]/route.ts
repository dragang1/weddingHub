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
  subcategory: z.string().min(1).optional(),
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

  const provider = await prisma.provider.update({
    where: { id },
    data: {
      ...(data.name != null && { name: data.name }),
      ...(categorySlug != null && { category: categorySlug }),
      ...(data.subcategory != null && { subcategory: data.subcategory }),
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
    },
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
