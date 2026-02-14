import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminProviderForm } from "../AdminProviderForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminProviderEditPage({ params }: PageProps) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");

  const { id } = await params;
  const isNew = id === "new";
  const provider = isNew
    ? null
    : await prisma.provider.findUnique({ where: { id } });

  if (!isNew && !provider) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <Link
          href="/admin/providers"
          className="text-sm font-semibold text-accent hover:text-accent-hover"
        >
          ← Natrag na listu
        </Link>
        <h1 className="mt-3 section-heading">
          {isNew ? "Novi pružatelj" : `Uredi: ${provider!.name}`}
        </h1>
      </header>

      <AdminProviderForm provider={provider} />
    </main>
  );
}
