import { NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseCategory } from "@/lib/categories";
import { normalizeCityForDb, parseCityList } from "@/lib/cities";

const eventTypesSchema = z
  .array(z.enum(["wedding", "birthday", "baptism", "celebration"]))
  .min(1, "Odaberite barem jednu vrstu događaja");

const createProviderSchema = z.object({
  name: z.string().min(1),
  category: z.string().refine((s) => parseCategory(s) !== null, {
    message: "Invalid category; use one of: music, photo_video, wedding_salon, cakes, decoration, transport, beauty",
  }),
  subcategory: z.string().min(1),
  locationCity: z.string().min(1),
  serviceCities: z.array(z.string()).optional(),
  isNationwide: z.boolean().optional(),
  eventTypes: eventTypesSchema.optional(),
  description: z.string(),
  galleryImages: z.array(z.string()).optional(),
  videoLinks: z.array(z.string()).optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().optional(),
});

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  const providers = await prisma.provider.findMany({
    orderBy: { name: "asc" },
  });
  return Response.json(providers);
}

export async function POST(request: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createProviderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const categorySlug = parseCategory(data.category);
  if (!categorySlug) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  const locationCity = normalizeCityForDb(data.locationCity);
  if (!locationCity) {
    return Response.json(
      { error: "Grad (baza) ne smije biti prazan nakon normalizacije." },
      { status: 400 }
    );
  }

  let serviceCities = parseCityList(
    Array.isArray(data.serviceCities)
      ? data.serviceCities.join("\n")
      : String(data.serviceCities ?? "")
  );
  const isNationwide = data.isNationwide ?? false;
  if (!isNationwide) {
    if (serviceCities.length === 0) {
      serviceCities = [locationCity];
    } else {
      const hasBase = serviceCities.some(
        (c) => c.toLowerCase() === locationCity.toLowerCase()
      );
      if (!hasBase) {
        serviceCities = [locationCity, ...serviceCities];
      }
    }
  }

  const eventTypes = (data.eventTypes?.length ? data.eventTypes : ["wedding"]) as string[];
  const provider = await prisma.provider.create({
    data: {
      name: data.name,
      category: categorySlug,
      subcategory: data.subcategory,
      locationCity,
      serviceCities,
      isNationwide,
      isActive: data.isActive ?? true,
      eventTypes,
      description: data.description,
      galleryImages: data.galleryImages ?? [],
      videoLinks: data.videoLinks ?? [],
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
    },
  });
  return Response.json(provider);
}
