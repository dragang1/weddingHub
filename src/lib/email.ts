import { Resend } from "resend";
import type { Provider, Lead } from "@prisma/client";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const from = process.env.EMAIL_FROM ?? "noreply@example.com";
const adminTo = process.env.EMAIL_TO_ADMIN;

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function sendLeadEmail({
  provider,
  lead,
}: {
  provider: Provider;
  lead: Lead;
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.error("RESEND_API_KEY is not set");
    return { success: false, error: "Email not configured" };
  }

  const subject = `Novi upit — ${provider.name} (${lead.eventCity}, ${formatDate(lead.eventDate)})`;
  const body = `
Novi upit s WeddingHub stranice.

Pružatelj: ${provider.name}
Kategorija: ${provider.category}

Podaci o naručitelju:
- Ime: ${lead.customerName}
- Telefon: ${lead.customerPhone}
- Email: ${lead.customerEmail ?? "—"}
- Datum događaja: ${formatDate(lead.eventDate)}
- Mjesto: ${lead.eventCity}
- Budžet: ${lead.budget != null ? `${lead.budget} €` : "—"}

Poruka:
${lead.message}
`.trim();

  const to: string[] = provider.email ? [provider.email] : [];
  if (!to.length && adminTo) to.push(adminTo);
  if (!to.length) {
    console.warn("No recipient for lead email", { providerId: provider.id, leadId: lead.id });
    return { success: true };
  }

  const bcc = adminTo && !to.includes(adminTo) ? [adminTo] : undefined;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      bcc,
      subject,
      text: body,
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: String(error.message) };
    }
    return { success: true };
  } catch (err) {
    console.error("sendLeadEmail failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
