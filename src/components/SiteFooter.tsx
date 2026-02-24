import Link from "next/link";
import { CATEGORIES, categoryPathSegment } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto footer-pattern text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Event<span className="text-amber-300 italic font-light">Hub</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone-400 font-light">
              Pružaoci usluga za vjenčanja i događaje u BiH. Pretražite po gradu i kategoriji.
            </p>
          </div>

          <div className="lg:ml-auto">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-6">Usluge</h3>
            <ul className="space-y-4">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${categoryPathSegment(cat.slug)}`}
                    className="text-sm text-stone-400 transition-colors hover:text-amber-200 font-light"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-6 sm:invisible">&nbsp;</h3>
            <ul className="space-y-4">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorija/${categoryPathSegment(cat.slug)}`}
                    className="text-sm text-stone-400 transition-colors hover:text-amber-200 font-light"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:ml-auto">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-6">Platforma</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/#kako-funkcionise"
                  className="text-sm text-stone-400 transition-colors hover:text-amber-200 font-light"
                >
                  Kako radi
                </Link>
              </li>
              <li>
                <Link
                  href="/#kategorije"
                  className="text-sm text-stone-400 transition-colors hover:text-amber-200 font-light"
                >
                  Sve kategorije
                </Link>
              </li>
              <li>
                <Link
                  href="/postanite-partner"
                  className="text-sm text-stone-400 transition-colors hover:text-amber-200 font-light"
                >
                  Postanite partner
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-stone-700 pt-8 sm:flex-row">
          <p className="text-xs text-stone-500 font-light">
            &copy; {new Date().getFullYear()} Event Hub. Sva prava zadržana.
          </p>
          <div className="flex gap-6">
            <Link href="/uslovi" className="text-xs text-stone-500 hover:text-stone-300 transition-colors font-light">Uslovi korištenja</Link>
            <Link href="/privatnost" className="text-xs text-stone-500 hover:text-stone-300 transition-colors font-light">Politika privatnosti</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
