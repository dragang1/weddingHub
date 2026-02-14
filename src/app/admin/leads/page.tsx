import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminLeadsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { id: true, name: true, category: true } },
    },
  });

  function formatDate(d: Date) {
    return new Date(d).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="section-heading">Upiti</h1>
        <Link
          href="/admin/providers"
          className="text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Pružaoci
        </Link>
      </header>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-accent-soft/30">
            <tr>
              <th className="px-4 py-3 text-left section-label">Datum</th>
              <th className="px-4 py-3 text-left section-label">Pružatelj</th>
              <th className="px-4 py-3 text-left section-label">Ime / Telefon</th>
              <th className="px-4 py-3 text-left section-label">Događaj</th>
              <th className="px-4 py-3 text-left section-label">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-accent-soft/10">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/admin/providers/${lead.provider.id}`}
                    className="font-semibold text-accent hover:text-accent-hover"
                  >
                    {lead.provider.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-ink">
                  {lead.customerName} · {lead.customerPhone}
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {formatDate(lead.eventDate)} · {lead.eventCity}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {lead.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="p-12 text-center text-muted">Nema upita.</p>
        )}
      </div>
    </main>
  );
}
