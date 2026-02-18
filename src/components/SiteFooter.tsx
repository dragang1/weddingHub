import Link from "next/link";
import { CATEGORIES, categoryPathSegment } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-tight text-ink">
                Wedding<span className="text-accent">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Pronađite provjerene pružaoce usluga za vjenčanje. Sve na jednom
              mjestu.
            </p>
          </div>

          <div>
            <h3 className="section-label">Kategorije</h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${categoryPathSegment(cat.slug)}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label sm:invisible">&nbsp;</h3>
            <ul className="mt-0 space-y-2.5 sm:mt-4">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${categoryPathSegment(cat.slug)}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label">Informacije</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/#kako-funkcionise"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  Kako funkcioniše
                </Link>
              </li>
              <li>
                <Link
                  href="/#kategorije"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  Sve kategorije
                </Link>
              </li>
              <li>
                <Link
                  href="/postanite-partner"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  Postanite partner
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Wedding Hub. Sva prava zadržana.
          </p>
          <div className="h-px w-10 bg-accent/20 sm:hidden" />
        </div>
      </div>
    </footer>
  );
}
