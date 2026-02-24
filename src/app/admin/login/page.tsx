import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const ok = await isAdmin();
  if (ok) redirect("/admin/providers");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface dark:bg-stone-900 p-4">
      <div className="w-full max-w-md card p-8 dark:border-stone-600 dark:bg-stone-800">
        <h1 className="font-serif text-2xl font-bold text-ink dark:text-stone-100">Admin prijava</h1>
        <p className="mt-2 text-sm text-muted dark:text-stone-400">Unesite lozinku.</p>
        <AdminLoginForm />
        <p className="mt-6 text-center text-sm text-muted dark:text-stone-400">
          <Link href="/" className="font-semibold text-accent hover:text-accent-hover">
            Natrag na stranicu
          </Link>
        </p>
      </div>
    </main>
  );
}
