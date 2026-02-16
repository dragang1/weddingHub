import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { categoryLabel } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";

export default async function AdminProvidersPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");

  const providers = await prisma.provider.findMany({
    orderBy: { name: "asc" },
  });

  function serviceAreaSummary(p: { isNationwide: boolean; serviceCities: string[] }) {
    if (p.isNationwide) return "Cijela BiH";
    const n = p.serviceCities?.length ?? 0;
    return n > 0 ? `+${n} gradova` : "—";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="section-heading">Pružaoci</h1>
        <nav className="flex gap-4">
          <Link
            href="/admin/leads"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Upiti
          </Link>
          <Link href="/admin/providers/new" className="btn-primary">
            Novi pružatelj
          </Link>
        </nav>
      </header>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-accent-soft/30">
            <tr>
              <th className="px-4 py-3 text-left section-label">Naziv</th>
              <th className="px-4 py-3 text-left section-label">Kategorija</th>
              <th className="px-4 py-3 text-left section-label">Grad</th>
              <th className="px-4 py-3 text-left section-label">Područje</th>
              <th className="px-4 py-3 text-left section-label">Aktivan</th>
              <th className="px-4 py-3 text-right section-label">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {providers.map((p) => (
              <tr key={p.id} className="transition hover:bg-accent-soft/10">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-ink">
                  {p.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {categoryLabel(p.category as CategorySlug)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {p.locationCity}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {serviceAreaSummary(p)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                  {(p as { isActive?: boolean }).isActive !== false ? "Da" : "Ne"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <Link
                    href={`/admin/providers/${p.id}`}
                    className="font-semibold text-accent hover:text-accent-hover"
                  >
                    Uredi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
