import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendLeadEmail } from "@/lib/email";

const leadBodySchema = z.object({
  providerId: z.string().min(1),
  customerName: z.string().min(1, "Ime je obavezno"),
  customerPhone: z.string().min(1, "Telefon je obavezan"),
  customerEmail: z.union([z.string().email(), z.literal("")]).optional(),
  eventDate: z.string().min(1, "Datum je obavezan"),
  eventCity: z.string().min(1, "Mjesto je obavezno"),
  budget: z.number().int().min(0).optional(),
  message: z.string().min(1, "Poruka je obavezna"),
  company: z.string().max(0).optional(), // honeypot: must be empty
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: "Previše zahtjeva. Pokušajte ponovno kasnije." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec ?? 60),
        },
      }
    );
  }

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

  // Honeypot: if company was filled, pretend success but do not save
  if (parsed.data.company && parsed.data.company.length > 0) {
    return Response.json({ ok: true });
  }

  const eventDate = new Date(parsed.data.eventDate);
  if (Number.isNaN(eventDate.getTime())) {
    return Response.json({ error: "Nevaljani datum" }, { status: 400 });
  }

  const provider = await prisma.provider.findUnique({
    where: { id: parsed.data.providerId },
  });
  if (!provider) {
    return Response.json({ error: "Pružatelj nije pronađen" }, { status: 404 });
  }

  const lead = await prisma.lead.create({
    data: {
      providerId: parsed.data.providerId,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail || null,
      eventDate,
      eventCity: parsed.data.eventCity,
      budget: parsed.data.budget ?? null,
      message: parsed.data.message,
      status: "new",
    },
  });

  const emailResult = await sendLeadEmail({ provider, lead });
  if (!emailResult.success) {
    console.error("Lead email failed:", emailResult.error);
    // Still return success so user sees confirmation; email can be retried manually
  }

  return Response.json({ ok: true });
}
