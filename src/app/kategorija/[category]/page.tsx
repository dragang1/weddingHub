import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  parseCategory,
  categoryLabel,
  categoryPath,
  categoryDescription,
} from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cityInputToCanonicalSlug } from "@/lib/cities";
import { parseEventType, eventHeadingPrefix } from "@/lib/events";
import type { CategorySlug } from "@/lib/categories";
import { CategoryCityStep } from "@/app/CategoryCityStep";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    city?: string;
    event?: string;
    subcategory?: string;
    q?: string;
  }>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category: categorySlug } = await params;
  const slug = parseCategory(categorySlug);
  if (slug === null) notFound();

  const sp = await searchParams;
  const cityParam = sp.city?.trim();
  const eventType = parseEventType(sp.event);
  const path = categoryPath(slug);

  if (cityParam) {
    const citySlug = cityInputToCanonicalSlug(cityParam);
    if (citySlug) {
      redirect(
        `${path}/${citySlug}${eventType === "wedding" ? "" : `?event=${eventType}`}`
      );
    }
  }

  const categoryTitle = categoryLabel(slug as CategorySlug);
  const description = categoryDescription(slug as CategorySlug);
  const headingPrefix = eventHeadingPrefix(eventType);

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-cream">
      <SiteHeader />
      <main className="min-w-0 flex-1">
        {/* Page header */}
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
            <nav className="flex flex-wrap items-center gap-x-2 text-sm text-stone-500" aria-label="Breadcrumb">
              <Link
                href="/"
                className="transition-colors hover:text-accent"
              >
                Početna
              </Link>
              <span className="text-stone-300">/</span>
              <span className="font-medium text-ink break-words">
                {categoryTitle}
              </span>
            </nav>
            <h1 className="mt-3 break-words font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl md:text-3xl lg:text-4xl">
              {categoryTitle} {headingPrefix}
            </h1>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl min-w-0 px-5 py-12 sm:px-8 sm:py-16 md:py-24">
          <div className="max-w-xl space-y-8 sm:space-y-10">
            {/* Category confirmation card */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-marketplace">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft border border-accent/20 text-accent transition-colors duration-500">
                  <CategoryIcon slug={slug} className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Odabrano</p>
                  <p className="font-serif text-2xl font-bold text-ink break-words">
                    {categoryTitle}
                  </p>
                  <p className="mt-2 text-base text-stone-500 font-light leading-relaxed">{description}</p>
                  <Link
                    href="/#kategorije"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent focus:outline-none"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 transition-transform hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                    Druga kategorija
                  </Link>
                </div>
              </div>
            </div>

            {/* City selection */}
            <CategoryCityStep
              categoryLabel={categoryTitle}
              categoryPath={path}
              eventType={eventType}
              allowShowAll={slug !== "wedding_salon"}
            />

            {/* Info hint */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                Odaberi uslugu
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                Unesi grad
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                Kontaktiraj
              </span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
