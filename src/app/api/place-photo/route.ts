import { NextRequest } from "next/server";

/**
 * Proxies Google Place Photo requests so the API key stays server-side.
 * GET /api/place-photo?reference=PHOTO_REFERENCE
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!reference?.trim() || !key) {
    return new Response("Missing reference or GOOGLE_MAPS_API_KEY", {
      status: 400,
    });
  }

  const maxwidth = Math.min(
    1600,
    Math.max(400, Number(request.nextUrl.searchParams.get("maxwidth")) || 800)
  );
  const url = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${encodeURIComponent(reference)}&maxwidth=${maxwidth}&key=${key}`;

  return Response.redirect(url, 302);
}
