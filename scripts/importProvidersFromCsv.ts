/**
 * Production-safe CSV import for Providers.
 * UPSERT only: create or update by name + city. Never deletes.
 * Usage: npm run import:providers
 * CSV path: prisma/providers.csv
 */

import { Prisma, PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import { normalizeCityForDb } from "../src/lib/cities";

const prisma = new PrismaClient();

const CSV_PATH = path.join(__dirname, "../prisma/providers.csv");
const DEFAULT_DESCRIPTION =
  "Salon za svadbe i proslave. Kontaktirajte za ponudu i termine.";

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

function normalizeWebsite(s: string | undefined): string | null {
  const t = trim(s);
  if (t === "") return null;
  const lower = t.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return t;
  return `https://${t}`;
}

function normalizePhone(s: string | undefined): string | null {
  const t = trim(s);
  if (t === "") return null;
  return t.replace(/\s+/g, " ").trim();
}

function normalizeInstagram(s: string | undefined): string | null {
  const t = trim(s);
  if (t === "") return null;
  return t;
}

function mapCategory(category: string): string {
  const c = category.trim().toLowerCase();
  if (c === "svadbeni salon") return "wedding_salon";
  return "wedding_salon";
}

function buildDetails(row: CsvRow): Record<string, string | null> | undefined {
  const instagram = orNull(row.instagram);
  const facebook = orNull(row.facebook);
  if (instagram === null && facebook === null) return undefined;
  return {
    instagram: instagram ?? null,
    facebook: facebook ?? null,
  };
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV file not found:", CSV_PATH);
    process.exit(1);
  }

  const csvRaw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  }) as CsvRow[];

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const name = trim(row.name);
    if (!name) continue;

    const cityRaw = trim(row.city);
    const locationCity = normalizeCityForDb(cityRaw);
    if (!locationCity) continue;

    const category = mapCategory(row.category ?? "");
    const subcategory = "svadbeni-salon";
    const description = trim(row.description) || DEFAULT_DESCRIPTION;
    const detailsRaw = buildDetails(row);
    const details: Prisma.InputJsonValue | undefined =
      detailsRaw === undefined ? undefined : (detailsRaw as Prisma.InputJsonValue);

    const existing = await prisma.provider.findFirst({
      where: { name, locationCity },
    });

    const address = orNull(row.address) ?? existing?.address ?? null;

    const data = {
      name,
      category,
      subcategory,
      locationCity,
      serviceCities: [locationCity],
      isNationwide: false,
      eventTypes: ["wedding"],
      description,
      galleryImages: existing?.galleryImages ?? [],
      videoLinks: existing?.videoLinks ?? [],
      phone: normalizePhone(row.phone) ?? existing?.phone ?? null,
      email: orNull(row.email) ?? existing?.email ?? null,
      website: normalizeWebsite(row.website) ?? existing?.website ?? null,
      address,
      ...(details !== undefined && { details }),
    };

    if (existing) {
      await prisma.provider.update({
        where: { id: existing.id },
        data: {
          category: data.category,
          subcategory: data.subcategory,
          serviceCities: data.serviceCities,
          isNationwide: data.isNationwide,
          eventTypes: data.eventTypes,
          description: data.description,
          galleryImages: data.galleryImages,
          videoLinks: data.videoLinks,
          phone: data.phone,
          email: data.email,
          website: data.website,
          address: data.address,
          ...(details !== undefined && { details }),
        },
      });
      updated++;
    } else {
      await prisma.provider.create({
        data: {
          name: data.name,
          category: data.category,
          subcategory: data.subcategory,
          locationCity: data.locationCity,
          serviceCities: data.serviceCities,
          isNationwide: data.isNationwide,
          eventTypes: data.eventTypes,
          description: data.description,
          galleryImages: data.galleryImages,
          videoLinks: data.videoLinks,
          phone: data.phone,
          email: data.email,
          website: data.website,
          address: data.address,
          ...(details !== undefined && { details }),
        },
      });
      created++;
    }
  }

  console.log("Import completed.");
  console.log("  Created:", created);
  console.log("  Updated:", updated);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
