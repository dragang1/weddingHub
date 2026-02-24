import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";

export default async function AdminProvidersPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");

  const providers = await prisma.provider.findMany({
    orderBy: { name: "asc" },
  });

  // Grupiši pružatelje po kategoriji (redoslijed kao u CATEGORIES)
  const byCategory = new Map<string, typeof providers>();
  for (const cat of CATEGORIES) {
    byCategory.set(cat.slug, []);
  }
  for (const p of providers) {
    const slug = p.category as string;
    const list = byCategory.get(slug) ?? [];
    list.push(p);
    byCategory.set(slug, list);
  }

  const categoryOrder = CATEGORIES.map((c) => c.slug);
  const otherCategories = Array.from(byCategory.keys()).filter(
    (slug) => !categoryOrder.includes(slug)
  );

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

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const list = byCategory.get(cat.slug) ?? [];
          return (
            <section key={cat.slug} className="card overflow-hidden">
              <div className="border-b border-stone-200 bg-stone-50/80 px-4 py-3 sm:px-6">
                <h2 className="text-lg font-bold text-ink">
                  {cat.label}
                  <span className="ml-2 text-sm font-normal text-stone-500">
                    ({list.length})
                  </span>
                </h2>
              </div>
              {list.length === 0 ? (
                <p className="px-4 py-6 text-sm text-stone-500 sm:px-6">
                  Nema pružatelja u ovoj kategoriji.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-accent-soft/20">
                    <tr>
                      <th className="px-4 py-3 text-left section-label">Naziv</th>
                      <th className="px-4 py-3 text-left section-label">Grad</th>
                      <th className="px-4 py-3 text-left section-label">Područje</th>
                      <th className="px-4 py-3 text-left section-label">Aktivan</th>
                      <th className="px-4 py-3 text-right section-label">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {list.map((p) => (
                      <tr key={p.id} className="transition hover:bg-accent-soft/10">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-ink">
                          {p.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
                          {p.locationCity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
                          {serviceAreaSummary(p)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
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
              )}
            </section>
          );
        })}
        {otherCategories.length > 0 &&
          otherCategories.map((slug) => {
            const list = byCategory.get(slug) ?? [];
            const label = categoryLabel(slug as CategorySlug);
            return (
              <section key={slug} className="card overflow-hidden">
                <div className="border-b border-stone-200 bg-amber-50/50 px-4 py-3 sm:px-6">
                  <h2 className="text-lg font-bold text-ink">
                    {label}
                    <span className="ml-2 text-sm font-normal text-stone-500">
                      ({list.length})
                    </span>
                  </h2>
                </div>
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-accent-soft/20">
                    <tr>
                      <th className="px-4 py-3 text-left section-label">Naziv</th>
                      <th className="px-4 py-3 text-left section-label">Grad</th>
                      <th className="px-4 py-3 text-left section-label">Područje</th>
                      <th className="px-4 py-3 text-left section-label">Aktivan</th>
                      <th className="px-4 py-3 text-right section-label">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {list.map((p) => (
                      <tr key={p.id} className="transition hover:bg-accent-soft/10">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-ink">
                          {p.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
                          {p.locationCity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
                          {serviceAreaSummary(p)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-stone-500">
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
              </section>
            );
          })}
      </div>
    </main>
  );
}
