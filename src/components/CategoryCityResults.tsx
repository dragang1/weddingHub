import Link from "next/link";
import { prisma } from "@/lib/db";
import { cityWhereClause } from "@/lib/providers";
import {
  categoryLabel,
  CATEGORIES,
  CATEGORY_ICONS,
} from "@/lib/categories";
import {
  prettyCityFromSlug,
  cityInputToCanonicalSlug,
  POPULAR_CITY_NAMES,
} from "@/lib/cities";
import {
  eventHeadingPrefix,
  categoryEventSubtext,
  parseEventType,
} from "@/lib/events";
import type { EventTypeSlug } from "@/lib/events";
import type { CategorySlug } from "@/lib/categories";
import { ProviderCard } from "@/components/ProviderCard";
import { ListingFilterBar } from "@/components/ListingFilterBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

type CategoryCityResultsProps = {
  categorySlug: CategorySlug;
  citySlug: string;
  basePath: string;
  eventType?: string | null;
  subcategory?: string;
  q?: string;
};

export async function CategoryCityResults({
  categorySlug,
  citySlug,
  basePath,
  eventType: eventParam,
  subcategory,
  q,
}: CategoryCityResultsProps) {
  const cityDisplay = prettyCityFromSlug(citySlug);
  const cityFilter = cityWhereClause(cityDisplay, categorySlug);
  const eventType = parseEventType(eventParam ?? null);

  const whereBase = {
    isActive: true,
    category: categorySlug,
    ...(Object.keys(cityFilter).length > 0 ? cityFilter : {}),
    ...(subcategory ? { subcategory } : {}),
    ...(q?.trim() && {
      OR: [
        { name: { contains: q.trim(), mode: "insensitive" as const } },
        {
          description: { contains: q.trim(), mode: "insensitive" as const },
        },
      ],
    }),
  };

  const [providersRaw, citiesForFilter, subcategories] = await Promise.all([
    prisma.provider.findMany({
      where: whereBase,
      orderBy: { createdAt: "desc" },
    }),
    prisma.provider
      .findMany({
        where: { isActive: true, category: categorySlug },
        select: { locationCity: true, serviceCities: true },
      })
      .then((rows) => {
        const set = new Set<string>();
        if (
          categorySlug === "wedding_salon" ||
          categorySlug === "beauty"
        ) {
          rows.forEach((r) => set.add(r.locationCity));
        } else {
          rows.forEach((r) => {
            set.add(r.locationCity);
            r.serviceCities?.forEach((c) => set.add(c));
          });
        }
        return Array.from(set).sort();
      }),
    prisma.provider
      .findMany({
        where: { isActive: true, category: categorySlug },
        select: { subcategory: true },
        distinct: ["subcategory"],
        orderBy: { subcategory: "asc" },
      })
      .then((rows) => rows.map((r) => r.subcategory)),
  ]);

  const providers = providersRaw.filter((p) => {
    const types = p.eventTypes ?? [];
    if (types.length === 0) return eventType === "wedding";
    return types.includes(eventType);
  });

  const label = categoryLabel(categorySlug);
  const headingPrefix = eventHeadingPrefix(eventType);
  const subtext = categoryEventSubtext(categorySlug, eventType);

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-surface">
      <SiteHeader />

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
            <span className="truncate">{label}</span>
            <span className="text-border">/</span>
            <span className="font-medium text-ink truncate">{cityDisplay}</span>
          </nav>
          <h1 className="mt-3 break-words font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl md:text-3xl lg:text-4xl">
            {label} {headingPrefix} u {cityDisplay}
          </h1>
          <p className="mt-1.5 text-sm text-muted sm:text-base">{subtext}</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        {/* Cross-category links */}
        <section className="min-w-0" aria-label="Ostale kategorije u istom gradu">
          <h2 className="section-label mb-3">
            Treba ti još nešto u {cityDisplay}?
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory md:flex-wrap md:overflow-visible scrollbar-none">
            {CATEGORIES.filter((cat) => cat.slug !== categorySlug).map(
              (cat) => (
                <Link
                  key={cat.slug}
                  href={
                    eventType === "wedding"
                      ? `${cat.path}/${citySlug}`
                      : `${cat.path}/${citySlug}?event=${eventType}`
                  }
                  className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-muted shadow-soft transition-all duration-200 hover:border-accent/40 hover:text-ink hover:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <span className="text-base" aria-hidden>
                    {CATEGORY_ICONS[cat.slug] ?? "📌"}
                  </span>
                  <span>{cat.label}</span>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Main content grid */}
        <div className="mt-8 grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,280px)_1fr] xl:grid-cols-[minmax(0,300px)_1fr]">
          {/* Sidebar */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-4 sm:p-5">
              <ListingFilterBar
                key={`${citySlug}-${eventType}`}
                basePath={basePath}
                citySlug={citySlug}
                cityDisplay={cityDisplay}
                cities={citiesForFilter}
                subcategories={subcategories}
                eventType={eventType}
                variant="sidebar"
              />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 overflow-hidden">
            <p className="mb-4 text-sm text-muted sm:mb-6">
              <span className="font-semibold text-ink">
                {providers.length}
              </span>{" "}
              {providers.length === 1 ? "rezultat" : "rezultata"}
            </p>

            {providers.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-6 text-center sm:p-8 md:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <svg
                    className="h-7 w-7 text-accent/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h2 className="mt-5 font-serif text-xl font-bold text-ink">
                  Trenutno nema ponuđača u ovom gradu.
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Pokušajte drugi grad ili pogledajte najtraženije lokacije.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {POPULAR_CITY_NAMES.map((name) => (
                    <Link
                      key={name}
                      href={
                        eventType === "wedding"
                          ? `${basePath}/${cityInputToCanonicalSlug(name)}`
                          : `${basePath}/${cityInputToCanonicalSlug(name)}?event=${eventType}`
                      }
                      className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-all duration-200 hover:border-accent/40 hover:bg-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    provider={{
                      id: p.id,
                      name: p.name,
                      locationCity: p.locationCity,
                      serviceCities: p.serviceCities ?? [],
                      isNationwide: p.isNationwide,
                      galleryImages: p.galleryImages ?? [],
                      coverImageUrl: p.coverImageUrl ?? undefined,
                      coverImageAttribution: p.coverImageAttribution ?? undefined,
                      eventTypes: p.eventTypes ?? [],
                    }}
                    selectedCity={cityDisplay}
                    eventType={eventType}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
