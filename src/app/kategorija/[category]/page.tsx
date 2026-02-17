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
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-surface">
      <SiteHeader />
      <main className="min-w-0 flex-1">
        {/* Page header */}
        <header className="border-b border-border bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 md:px-8">
            <nav className="flex flex-wrap items-center gap-x-2 text-sm text-muted" aria-label="Breadcrumb">
              <Link
                href="/"
                className="transition-colors hover:text-accent"
              >
                Početna
              </Link>
              <span className="text-border">/</span>
              <span className="font-medium text-ink break-words">
                {categoryTitle}
              </span>
            </nav>
            <h1 className="mt-3 break-words font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl md:text-3xl lg:text-4xl">
              {categoryTitle} {headingPrefix}
            </h1>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14">
          <div className="max-w-md space-y-6 sm:space-y-8">
            {/* Category confirmation card */}
            <div className="card p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-ink/80">
                  <CategoryIcon slug={slug} className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="section-label text-accent">Odabrali ste</p>
                  <p className="mt-1 font-serif text-lg font-bold text-ink break-words">
                    {categoryTitle}
                  </p>
                  <p className="mt-1.5 text-sm text-muted">{description}</p>
                  <Link
                    href="/#kategorije"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 rounded"
                  >
                    <svg
                      className="h-3.5 w-3.5 shrink-0"
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
                    Promijeni kategoriju
                  </Link>
                </div>
              </div>
            </div>

            {/* City selection */}
            <CategoryCityStep
              categoryLabel={categoryTitle}
              categoryPath={path}
              eventType={eventType}
            />

            {/* Info hint */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                Odaberi uslugu
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                Unesi grad
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-accent/40" />
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
