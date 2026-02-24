import Link from "next/link";
import { prisma } from "@/lib/db";
import { cityWhereClause } from "@/lib/providers";
import {
  categoryLabel,
  CATEGORIES,
} from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
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
  const isShowAll = citySlug === "sve";
  const cityDisplay = isShowAll
    ? "Cijela BiH"
    : prettyCityFromSlug(citySlug);
  const cityFilter = isShowAll
    ? {}
    : cityWhereClause(cityDisplay, categorySlug);
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
        rows.forEach((r) => {
          set.add(r.locationCity);
          r.serviceCities?.forEach((c) => set.add(c));
        });
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
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-cream">
      <SiteHeader />

      {/* Page header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-surface to-white pointer-events-none" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <nav className="flex flex-wrap items-center gap-x-3 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-6" aria-label="Breadcrumb">
            <Link
              href="/"
              className="transition-colors hover:text-ink"
            >
              Početna
            </Link>
            <span className="text-border">/</span>
            <span className="truncate">{label}</span>
            <span className="text-border">/</span>
            <span className="text-accent truncate">{cityDisplay}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            {label} {headingPrefix} {isShowAll ? "u cijeloj BiH" : `u ${cityDisplay}`}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-500 font-light max-w-2xl">{subtext}</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-12">
        {/* Cross-category links */}
        <section className="min-w-0 mb-10" aria-label={isShowAll ? "Ostale kategorije" : "Ostale kategorije u istom gradu"}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            {isShowAll ? "Istražite ostale kategorije" : `Istražite još u ${cityDisplay}`}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
            {CATEGORIES.filter((cat) => cat.slug !== categorySlug).map(
              (cat) => (
                <Link
                  key={cat.slug}
                  href={
                    eventType === "wedding"
                      ? `${cat.path}/${citySlug}`
                      : `${cat.path}/${citySlug}?event=${eventType}`
                  }
                  className="group flex shrink-0 snap-start items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-all duration-300 hover:border-stone-300 hover:shadow-marketplace focus:outline-none"
                >
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-ink group-hover:text-white" aria-hidden>
                    <CategoryIcon slug={cat.slug} className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span>{cat.label}</span>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Main content grid */}
        <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr] xl:gap-12">
          {/* Sidebar */}
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6 sm:p-8">
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
            <p className="mb-6 text-sm text-stone-500 uppercase tracking-widest font-semibold">
              <span className="text-ink mr-2">
                {providers.length}
              </span>
              {providers.length === 1 ? "rezultat" : "rezultata"}
            </p>

            {providers.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-10 text-center sm:p-16 border-dashed border-2">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 border border-stone-200">
                  <svg
                    className="h-8 w-8 text-stone-400"
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
                <h2 className="mt-6 font-serif text-2xl font-bold text-ink">
                  Trenutno nema ponuđača u ovom gradu
                </h2>
                <p className="mt-3 text-base text-stone-500 font-light max-w-md mx-auto">
                  Pokušajte promijeniti filtere ili pogledajte naše najtraženije lokacije za ovu uslugu.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {POPULAR_CITY_NAMES.map((name) => (
                    <Link
                      key={name}
                      href={
                        eventType === "wedding"
                          ? `${basePath}/${cityInputToCanonicalSlug(name)}`
                          : `${basePath}/${cityInputToCanonicalSlug(name)}?event=${eventType}`
                      }
                      className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-ink transition-all duration-300 hover:border-stone-300 hover:shadow-marketplace"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    provider={{
                      id: p.id,
                      name: p.name,
                      locationCity: p.locationCity,
                      serviceCities: p.serviceCities ?? [],
                      isNationwide: p.isNationwide,
                      imageKey: p.imageKey ?? undefined,
                      coverImageKey: p.coverImageKey ?? undefined,
                      galleryImageKeys: p.galleryImageKeys ?? undefined,
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
