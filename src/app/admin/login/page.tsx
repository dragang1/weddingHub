import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const ok = await isAdmin();
  if (ok) redirect("/admin/providers");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md card p-8">
        <h1 className="font-serif text-2xl font-bold text-ink">Admin prijava</h1>
        <p className="mt-2 text-sm text-muted">Unesite lozinku.</p>
        <AdminLoginForm />
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="font-semibold text-accent hover:text-accent-hover">
            Natrag na stranicu
          </Link>
        </p>
      </div>
    </main>
  );
}
