import { NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

const leadBodySchema = z.object({
  providerId: z.string().min(1, "Pružatelj je obavezan"),
  providerName: z.string().min(1, "Pružatelj je obavezan"),
  pageUrl: z.string().optional(),
  name: z.string().min(1, "Ime je obavezno"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Nevaljan email"),
  phone: z.string().optional(),
  message: z.string().min(20, "Poruka mora imati najmanje 20 znakova"),
});

// In-memory rate limit: max 3 per 10 min per (ip + providerId)
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

function checkLeadRateLimit(ip: string, providerId: string): { ok: boolean; retryAfterSec?: number } {
  const key = `${ip}:${providerId}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > RATE_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    const message = first?.message ?? "Nevaljani podaci";
    return Response.json({ error: message }, { status: 400 });
  }

  const data = parsed.data;
  const limit = checkLeadRateLimit(ip, data.providerId);
  if (!limit.ok) {
    return Response.json(
      { error: "Previše upita. Pokušaj ponovo za par minuta." },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { "Retry-After": String(limit.retryAfterSec) }
          : undefined,
      }
    );
  }

  const provider = await prisma.provider.findUnique({
    where: { id: data.providerId },
    select: { id: true, locationCity: true },
  });
  if (!provider) {
    return Response.json({ error: "Pružatelj nije pronađen." }, { status: 404 });
  }

  await prisma.lead.create({
    data: {
      providerId: data.providerId,
      customerName: data.name,
      customerPhone: data.phone?.trim() || "-",
      customerEmail: data.email?.trim() || null,
      eventDate: new Date(),
      eventCity: provider.locationCity,
      message: data.message,
      status: "new",
    },
  });

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.SITE_ADMIN_EMAIL;
  // Resend requires verified domain for custom From; use onboarding@resend.dev if unverified
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

  const phone = data.phone?.trim() ?? "";
  const pageUrl =
    data.pageUrl ||
    (request.headers.get("origin")
      ? `${request.headers.get("origin")}/profil/${data.providerId}`
      : null);
  const timestamp = new Date().toISOString();

  function escapeHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const text = `
Novi upit – EventHub

Pružatelj: ${data.providerName}
ID: ${data.providerId}
${pageUrl ? `URL: ${pageUrl}` : ""}

Od: ${data.name}
${data.email ? `Email: ${data.email}` : ""}
${phone ? `Telefon: ${phone}` : ""}

Poruka:
${data.message}

---
Poslano: ${timestamp}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;max-width:560px;">
  <h2 style="font-size:18px;margin-bottom:12px;">Novi upit – EventHub</h2>
  <p><strong>Pružatelj:</strong> ${escapeHtml(data.providerName)}</p>
  <p><strong>ID:</strong> ${escapeHtml(data.providerId)}</p>
  ${pageUrl ? `<p><strong>URL:</strong> <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a></p>` : ""}
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
  <p><strong>Od:</strong> ${escapeHtml(data.name)}</p>
  ${data.email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>` : ""}
  ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
  <p><strong>Poruka:</strong></p>
  <pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;">${escapeHtml(data.message)}</pre>
  <p style="font-size:12px;color:#888;">Poslano: ${escapeHtml(timestamp)}</p>
</body>
</html>
`;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: adminEmail,
      replyTo: data.email?.trim() || undefined,
      subject: `Novi upit – ${data.providerName} – EventHub`,
      text,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return Response.json(
        { error: "Došlo je do greške. Pokušaj ponovo." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Lead email failed:", err);
    return Response.json(
      { error: "Došlo je do greške. Pokušaj ponovo." },
      { status: 500 }
    );
  }
}
