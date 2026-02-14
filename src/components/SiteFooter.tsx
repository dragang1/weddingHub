import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <span className="text-base leading-none" aria-hidden>
                  💍
                </span>
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-ink">
                Wedding<span className="text-accent ml-0.5">Hub</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Pronađite provjerene pružaoce usluga za vjenčanje. Sve na jednom
              mjestu.
            </p>
          </div>

          {/* Categories col 1 */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Kategorije
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${cat.slug}`}
                    className="text-sm text-ink/70 transition-colors hover:text-accent"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted sm:invisible">
              &nbsp;
            </h3>
            <ul className="mt-0 space-y-2.5 sm:mt-4">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${cat.slug}`}
                    className="text-sm text-ink/70 transition-colors hover:text-accent"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Informacije
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/#kako-funkcionise"
                  className="text-sm text-ink/70 transition-colors hover:text-accent"
                >
                  Kako funkcioniše
                </Link>
              </li>
              <li>
                <Link
                  href="/#kategorije"
                  className="text-sm text-ink/70 transition-colors hover:text-accent"
                >
                  Sve kategorije
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Wedding Hub. Sva prava zadržana.
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent sm:hidden" />
        </div>
      </div>
    </footer>
  );
}
