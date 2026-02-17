import { NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { CATEGORIES } from "@/lib/categories";

const schema = z.object({
  businessName: z.string().min(1, "Naziv biznisa je obavezan"),
  category: z.string().min(1, "Kategorija je obavezna"),
  city: z.string().min(1, "Grad je obavezan"),
  contactName: z.string().min(1, "Ime je obavezno"),
  phone: z.string().min(1, "Telefon je obavezan"),
  email: z
    .string()
    .min(1, "Email je obavezan")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Nevaljan email"),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
  message: z.string().optional(),
  _hp: z.string().optional(), // honeypot
});

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > RATE_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return Response.json(
      { error: first?.message ?? "Nevaljani podaci" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data._hp) {
    return Response.json({ ok: true });
  }

  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: "Previše zahtjeva. Pokušaj ponovo za par minuta." },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { "Retry-After": String(limit.retryAfterSec) }
          : undefined,
      }
    );
  }

  const adminEmail = process.env.SITE_ADMIN_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const fromRaw = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const from =
    fromRaw.includes("example.com") || !fromRaw.includes("@")
      ? "onboarding@resend.dev"
      : fromRaw;

  if (!apiKey || !adminEmail) {
    console.error("RESEND_API_KEY or SITE_ADMIN_EMAIL not set");
    return Response.json(
      { error: "Došlo je do greške. Pokušaj ponovo." },
      { status: 500 }
    );
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.slug === data.category)?.label ?? data.category;
  const timestamp = new Date().toISOString();

  const text = `
Novi biznis zahtjev – WeddingHub

Biznis: ${data.businessName}
Kategorija: ${categoryLabel}
Grad: ${data.city}

Kontakt: ${data.contactName}
Email: ${data.email}
Telefon: ${data.phone}
${data.instagram ? `Instagram: ${data.instagram}` : ""}
${data.facebook ? `Facebook: ${data.facebook}` : ""}
${data.website ? `Web stranica: ${data.website}` : ""}
${data.message ? `Poruka: ${data.message}` : ""}

---
Poslano: ${timestamp}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;max-width:560px;">
  <h2 style="font-size:18px;margin-bottom:12px;">Novi biznis zahtjev – WeddingHub</h2>
  <p><strong>Biznis:</strong> ${escapeHtml(data.businessName)}</p>
  <p><strong>Kategorija:</strong> ${escapeHtml(categoryLabel)}</p>
  <p><strong>Grad:</strong> ${escapeHtml(data.city)}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
  <p><strong>Kontakt:</strong> ${escapeHtml(data.contactName)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
  <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
  ${data.instagram ? `<p><strong>Instagram:</strong> ${escapeHtml(data.instagram)}</p>` : ""}
  ${data.facebook ? `<p><strong>Facebook:</strong> ${escapeHtml(data.facebook)}</p>` : ""}
  ${data.website ? `<p><strong>Web stranica:</strong> <a href="${escapeHtml(data.website)}">${escapeHtml(data.website)}</a></p>` : ""}
  ${data.message ? `<p><strong>Poruka:</strong></p><pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;">${escapeHtml(data.message)}</pre>` : ""}
  <p style="font-size:12px;color:#888;">Poslano: ${escapeHtml(timestamp)}</p>
</body>
</html>
`;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: adminEmail,
      replyTo: data.email,
      subject: `Novi biznis zahtjev - ${data.businessName}`,
      text,
      html,
    });

    if (error) {
      console.error("Partner request email error:", error);
      return Response.json(
        { error: "Došlo je do greške. Pokušaj ponovo." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Partner request failed:", err);
    return Response.json(
      { error: "Došlo je do greške. Pokušaj ponovo." },
      { status: 500 }
    );
  }
}
