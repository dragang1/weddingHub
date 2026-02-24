const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventhub.example.com";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
