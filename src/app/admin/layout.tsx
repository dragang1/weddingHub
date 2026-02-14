import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin/providers" className="font-serif text-xl font-bold text-ink">
            Wedding <span className="text-accent">Hub</span> Admin
          </Link>
          <nav>
            <Link href="/" className="text-sm font-medium text-muted hover:text-ink transition">
              Na stranicu
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
