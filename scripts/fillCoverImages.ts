/**
 * One-time script: fill Provider.coverImageUrl for providers that don't have it.
 * 3-tier fallback: 1) og:image from website, 2) Google Places photo, 3) placeholder.
 * Usage: GOOGLE_MAPS_API_KEY=xxx npx tsx scripts/fillCoverImages.ts
 */

import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

const RATE_LIMIT_MS = 250; // ~4 req/sec
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

type CoverSource = "og" | "google_places" | "placeholder";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  options?: RequestInit
): Promise<Response> {
  let lastError: Error | null = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; WeddingHub/1.0; +https://weddinghub.ba)",
          ...options?.headers,
        },
      });
      if (res.ok || res.status === 404) return res;
      if (res.status >= 500 && i < MAX_RETRIES - 1) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, i);
        await sleep(backoff);
        continue;
      }
      return res;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, i);
      await sleep(backoff);
    }
  }
  throw lastError ?? new Error("Fetch failed after retries");
}

function extractOgImage(html: string): string | null {
  const $ = cheerio.load(html);
  const el = $('meta[property="og:image"]').attr("content");
  if (!el || typeof el !== "string") return null;
  const url = el.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) return null;
  return url;
}

async function tryOgImage(website: string): Promise<string | null> {
  const res = await fetchWithRetry(website, { redirect: "follow" });
  const text = await res.text();
  return extractOgImage(text);
}

function getPlaceholderPath(_category: string): string {
  return "/images/placeholders/default.svg";
}

async function findPlaceId(
  name: string,
  city: string,
  apiKey: string
): Promise<string | null> {
  const query = encodeURIComponent(`${name} ${city} Bosnia`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    results?: Array<{ place_id?: string }>;
  };
  if (data.status !== "OK" || !data.results?.length) {
    if (data.status !== "OK") {
      console.warn(`  Places Text Search: ${data.status}${data.error_message ? " - " + data.error_message : ""}`);
    }
    return null;
  }
  return data.results[0].place_id ?? null;
}

async function getPlacePhotoAndAttribution(
  placeId: string,
  apiKey: string
): Promise<{ photoReference: string; attribution: string | null } | null> {
  const fields = "photos";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    result?: {
      photos?: Array<{
        photo_reference?: string;
        html_attributions?: string[];
      }>;
    };
  };
  if (data.status !== "OK") {
    console.warn(`  Places Details: ${data.status}${data.error_message ? " - " + data.error_message : ""}`);
    return null;
  }
  if (!data.result?.photos?.length) {
    console.warn("  Places Details: place has no photos");
    return null;
  }
  const firstPhoto = data.result.photos[0];
  const ref = firstPhoto.photo_reference;
  if (!ref) return null;
  const attribution =
    firstPhoto.html_attributions?.length &&
    firstPhoto.html_attributions[0]?.trim()
      ? firstPhoto.html_attributions[0].trim()
      : null;
  return { photoReference: ref, attribution };
}

function buildPlacePhotoProxyUrl(photoReference: string): string {
  return `/api/place-photo?reference=${encodeURIComponent(photoReference)}`;
}

async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? "";
  const providers = await prisma.provider.findMany({
    where: { coverImageUrl: null },
    select: {
      id: true,
      name: true,
      locationCity: true,
      website: true,
      category: true,
    },
    orderBy: { id: "asc" },
  });

  console.log(
    `Found ${providers.length} providers without coverImageUrl. Rate limit: ${RATE_LIMIT_MS}ms between providers.`
  );

  let ogOk = 0;
  let placesOk = 0;
  let placeholderOk = 0;
  let failed = 0;

  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    let url: string | null = null;
    let source: CoverSource = "placeholder";
    let attribution: string | null = null;

    try {
      // 1) OG image from website
      if (p.website?.trim()) {
        const u = p.website.trim();
        if (u.startsWith("http://") || u.startsWith("https://")) {
          try {
            url = await tryOgImage(u);
            if (url) {
              source = "og";
              ogOk++;
            }
          } catch (e) {
            console.warn(`[${p.name}] OG fetch failed:`, (e as Error).message);
          }
        }
      }

      // 2) Google Places
      if (!url && apiKey) {
        await sleep(RATE_LIMIT_MS);
        const placeId = await findPlaceId(
          p.name,
          p.locationCity,
          apiKey
        );
        if (placeId) {
          await sleep(RATE_LIMIT_MS);
          const photo = await getPlacePhotoAndAttribution(placeId, apiKey);
          if (photo) {
            url = buildPlacePhotoProxyUrl(photo.photoReference);
            attribution = photo.attribution;
            source = "google_places";
            placesOk++;
          }
        }
      }

      // 3) Placeholder
      if (!url) {
        url = getPlaceholderPath(p.category);
        source = "placeholder";
        placeholderOk++;
      }

      await prisma.provider.update({
        where: { id: p.id },
        data: {
          coverImageUrl: url,
          coverImageSource: source,
          coverImageAttribution: attribution,
        },
      });

      console.log(
        `[${i + 1}/${providers.length}] ${p.name} -> ${source}${url.startsWith("/api") ? " (proxy)" : ""}`
      );
    } catch (e) {
      failed++;
      console.error(`[${p.name}] Error:`, e);
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log("\nDone.");
  console.log(`  OG: ${ogOk}, Google Places: ${placesOk}, Placeholder: ${placeholderOk}, Failed: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
