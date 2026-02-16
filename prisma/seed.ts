import { Prisma, PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import { normalizeCityForDb } from "../src/lib/cities";

const prisma = new PrismaClient();

const DEFAULT_DESCRIPTION =
  "Salon za svadbe i proslave. Kontaktirajte za ponudu i termine.";

const CSV_PATH = path.join(__dirname, "providers - Лист1.csv");

type CsvRow = {
  name?: string;
  category?: string;
  city?: string;
  phone?: string;
  address?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  description?: string;
};

function trim(s: string | undefined): string {
  return (s ?? "").trim();
}

function orNull(s: string | undefined): string | null {
  const t = trim(s);
  return t === "" ? null : t;
}

function mapCategory(category: string): string {
  const c = category.trim().toLowerCase();
  if (c === "svadbeni salon") return "wedding_salon";
  return "wedding_salon";
}

function buildDetails(row: CsvRow): Record<string, string | null> | null {
  const instagram = orNull(row.instagram);
  const facebook = orNull(row.facebook);
  if (instagram === null && facebook === null) return null;
  return {
    instagram: instagram ?? null,
    facebook: facebook ?? null,
  };
}

async function main() {
  const csvRaw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  }) as CsvRow[];

  const toCreate: Array<{
    name: string;
    category: string;
    subcategory: string;
    locationCity: string;
    serviceCities: string[];
    isNationwide: boolean;
    eventTypes: string[];
    description: string;
    galleryImages: string[];
    videoLinks: string[];
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    details: Record<string, string | null> | null;
  }> = [];

  for (const row of rows) {
    const name = trim(row.name);
    if (!name) continue;

    const cityRaw = trim(row.city);
    const locationCity = normalizeCityForDb(cityRaw);
    if (!locationCity) continue;

    const category = mapCategory(row.category ?? "");
    const subcategory = "svadbeni-salon";
    const description = trim(row.description) || DEFAULT_DESCRIPTION;
    const details = buildDetails(row);

    toCreate.push({
      name,
      category,
      subcategory,
      locationCity,
      serviceCities: [locationCity],
      isNationwide: false,
      eventTypes: ["wedding"],
      description,
      galleryImages: [],
      videoLinks: [],
      phone: orNull(row.phone),
      email: orNull(row.email),
      website: orNull(row.website),
      address: orNull(row.address),
      details,
    });
  }

  await prisma.lead.deleteMany({});
  await prisma.provider.deleteMany({});

  for (const p of toCreate) {
    await prisma.provider.create({
      data: {
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        locationCity: p.locationCity,
        serviceCities: p.serviceCities,
        isNationwide: p.isNationwide,
        eventTypes: p.eventTypes,
        description: p.description,
        galleryImages: p.galleryImages,
        videoLinks: p.videoLinks,
        phone: p.phone,
        email: p.email,
        website: p.website,
        address: p.address,
        details: p.details as Prisma.InputJsonValue,
      },
    });
  }

  const byCity: Record<string, number> = {};
  for (const p of toCreate) {
    byCity[p.locationCity] = (byCity[p.locationCity] ?? 0) + 1;
  }

  console.log("Seed completed: %d providers created (from CSV).", toCreate.length);
  console.log("By city:", byCity);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
