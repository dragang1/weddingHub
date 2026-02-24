import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Gallery } from "@/components/Gallery";
import { ProviderGalleryFeatured } from "@/components/ProviderGalleryFeatured";
import { ProviderGalleryLightbox } from "@/components/ProviderGalleryLightbox";
import { LeadForm } from "@/components/LeadForm";
import { ProfileContactCard } from "@/components/ProfileContactCard";
import { ProfileShareButton } from "@/components/ProfileShareButton";
import { ProviderCard } from "@/components/ProviderCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categoryPath, categoryLabel } from "@/lib/categories";
import { getProviderImageUrls } from "@/lib/providerImage";
import { slugifyCity } from "@/lib/cities";
import { cityWhereClause } from "@/lib/providers";
import type { CategorySlug } from "@/lib/categories";

const SECTION_HEADING =
  "mb-4 text-xs font-semibold tracking-widest text-stone-500 uppercase";

type ProviderDetails = {
  onSiteOnly?: boolean;
  capacity?: number;
  hasParking?: boolean;
  menuFromKM?: number;
  indoor?: boolean;
  outdoor?: boolean;
};

const DETAIL_ITEMS_CONFIG: {
  key: keyof ProviderDetails;
  label: string;
  format: (v: unknown, details: ProviderDetails) => string | null;
}[] = [
  {
    key: "onSiteOnly",
    label: "Usluga",
    format: (v) =>
      v != null ? (v ? "Samo na lokaciji" : "Na lokaciji i van") : null,
  },
  {
    key: "capacity",
    label: "Kapacitet",
    format: (v) => (v != null ? `do ${Number(v)} gostiju` : null),
  },
  {
    key: "hasParking",
    label: "Parkir",
    format: (v) => (v != null ? (v ? "Da" : "Ne") : null),
  },
  {
    key: "menuFromKM",
    label: "Meni od",
    format: (v) => (v != null ? `${Number(v)} KM` : null),
  },
  {
    key: "indoor",
    label: "Prostor",
    format: (_v, d) => {
      const parts = [];
      if (d.indoor) parts.push("Unutrašnji");
      if (d.outdoor) parts.push("Vanjski");
      return parts.length > 0 ? parts.join(" i ") : null;
    },
  },
];

function ProviderDetailsSection({ details }: { details: ProviderDetails }) {
  const items = DETAIL_ITEMS_CONFIG.map((cfg) => {
    const value = cfg.format(details[cfg.key], details);
    return value ? { label: cfg.label, value } : null;
  }).filter(Boolean) as { label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-stone-200/80 dark:border-stone-600/60 bg-white dark:bg-stone-800 p-6 shadow-marketplace dark:shadow-none sm:p-8 lg:p-10"
      aria-labelledby="kljucni-detalji-heading"
    >
      <h2 id="kljucni-detalji-heading" className="section-heading dark:text-stone-100 mb-4 !text-xl sm:!text-2xl lg:!text-3xl">
        Ključni detalji
      </h2>
      <div className="divider-ornament ml-0" />
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-2xl bg-stone-50/80 dark:bg-stone-700/80 border border-stone-200/60 dark:border-stone-600/60 px-5 py-4"
            >
            <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {item.label}
            </dt>
            <dd className="text-base font-semibold text-ink dark:text-stone-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type PageProps = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const provider = await prisma.provider.findUnique({
    where: { id },
    select: { name: true, description: true, locationCity: true },
  });
  if (!provider) return { title: "Pružatelj" };
  return {
    title: `${provider.name} — Event Hub`,
    description: provider.description.slice(0, 160),
    openGraph: {
      title: `${provider.name} — Event Hub`,
      description: provider.description.slice(0, 160),
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const provider = await prisma.provider.findUnique({ where: { id } });
  if (!provider || (provider as { isActive?: boolean }).isActive === false)
    notFound();

  const cityFilter = cityWhereClause(provider.locationCity, provider.category);
  const similar = await prisma.provider.findMany({
    where: {
      isActive: true,
      category: provider.category,
      id: { not: provider.id },
      ...cityFilter,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      locationCity: true,
      serviceCities: true,
      isNationwide: true,
      galleryImageKeys: true,
      eventTypes: true,
      imageKey: true,
      coverImageKey: true,
    },
  });

  const backPath = categoryPath(provider.category as CategorySlug);
  const backUrl = `${backPath}/${slugifyCity(provider.locationCity)}`;
  const categoryTitle = categoryLabel(provider.category as CategorySlug);

  const galleryKeys = provider.galleryImageKeys ?? [];
  const galleryUrls = getProviderImageUrls(galleryKeys);
  const videoLinks = provider.videoLinks ?? [];
  const hasGalleryImages = galleryUrls.length > 0;
  const hasVideos = videoLinks.length > 0;
  const hasGallery = hasGalleryImages || hasVideos;

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-cream dark:bg-stone-900">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* Top bar: compact back on mobile, full text on desktop */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <Link
              href={backUrl}
              title={`Nazad na ${categoryTitle} u ${provider.locationCity}`}
              className="inline-flex items-center gap-2 shrink-0 text-sm font-medium text-stone-500 dark:text-stone-400 transition-colors hover:text-ink dark:hover:text-stone-100"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="hidden sm:inline">Nazad na {categoryTitle} u {provider.locationCity}</span>
              <span className="sm:hidden">Nazad</span>
            </Link>
            <ProfileShareButton title={`${provider.name} — Event Hub`} />
          </div>

          {/* Profile header: name + address, then gallery */}
          <header className="mt-6 pb-6 sm:mt-8 sm:pb-8 border-b border-stone-200 dark:border-stone-700">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink dark:text-stone-100 sm:text-4xl md:text-5xl">
              {provider.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {provider.address ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-50/80 dark:bg-stone-700/80 px-3 py-1.5 text-sm font-medium text-accent dark:text-amber-300 transition-colors hover:border-accent/30 hover:bg-accent-soft/40 dark:hover:bg-accent/30 dark:hover:text-amber-200 hover:text-accent-hover"
                >
                  {provider.address}
                  <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ) : (
                <span className="text-sm text-stone-500 dark:text-stone-400 sm:text-base">{provider.locationCity}</span>
              )}
            </div>
          </header>

          <div className="mt-6 grid grid-cols-1 gap-8 pb-12 sm:mt-8 sm:pb-16 lg:mt-10 lg:grid-cols-[1fr_340px] lg:gap-12 lg:pb-16">
            <div className="space-y-8 sm:space-y-10">

              {/* Gallery */}
              {hasGallery && (
                <section aria-labelledby="galerija-heading" className="space-y-4">
                  <h2 id="galerija-heading" className="text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                    Galerija
                  </h2>
                  {hasGalleryImages &&
                    (galleryUrls.length >= 4 ? (
                      <ProviderGalleryFeatured images={galleryUrls} />
                    ) : (
                      <ProviderGalleryLightbox images={galleryUrls} />
                    ))}
                  {hasVideos && (
                    <div className="pt-2">
                      <Gallery galleryImages={[]} videoLinks={videoLinks} />
                    </div>
                  )}
                </section>
              )}

              {/* O nama */}
              <section
                className="rounded-2xl border border-stone-200/80 dark:border-stone-600/60 bg-white dark:bg-stone-800 p-6 shadow-marketplace dark:shadow-none sm:p-8 lg:p-10"
                aria-labelledby="opis-heading"
              >
                <h2 id="opis-heading" className="section-heading dark:text-stone-100 mb-4 !text-xl sm:!text-2xl lg:!text-3xl">
                  O nama
                </h2>
                <div className="divider-ornament ml-0" />
                <p className="whitespace-pre-wrap text-base leading-relaxed text-stone-600 dark:text-stone-300 font-light">
                  {provider.description}
                </p>
              </section>

              {/* Key details (wedding salons only) */}
              {provider.category === "wedding_salon" &&
                (() => {
                  const details = (provider as { details?: unknown }).details;
                  if (details && typeof details === "object" && !Array.isArray(details)) {
                    return <ProviderDetailsSection details={details as ProviderDetails} />;
                  }
                  return null;
                })()}

              {/* Contact (mobile): after O nama / Detalji, before form */}
              <div className="lg:hidden">
                <ProfileContactCard
                  phone={provider.phone}
                  email={provider.email}
                  website={provider.website}
                  address={provider.address}
                  instagram={(provider.details as { instagram?: string })?.instagram}
                  facebook={(provider.details as { facebook?: string })?.facebook}
                />
              </div>

              {/* Pošaljite upit — single section, form has no duplicate title */}
              <section
                id="upit"
                className="scroll-mt-28 rounded-2xl border border-stone-200/80 dark:border-stone-600/60 bg-white dark:bg-stone-800 p-6 shadow-marketplace dark:shadow-none sm:p-8 lg:p-10"
                aria-labelledby="upit-heading"
              >
                <h2 id="upit-heading" className="section-heading dark:text-stone-100 mb-1 !text-xl sm:!text-2xl lg:!text-3xl">
                  Pošaljite upit
                </h2>
                <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">Ispunite formu ispod; pružatelj će vam se javiti u najkraćem roku.</p>
                <LeadForm providerId={provider.id} providerName={provider.name} />
              </section>

              {/* Slični stručnjaci */}
              {similar.length > 0 && (
                <section aria-labelledby="slicni-heading" className="pt-4 sm:pt-6">
                  <h2 id="slicni-heading" className="section-heading dark:text-stone-100 mb-6 !text-xl sm:!text-2xl lg:!text-3xl">
                    Slični stručnjaci u blizini
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {similar.map((p) => (
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
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky contact (desktop only) */}
            <aside className="hidden h-fit lg:block lg:sticky lg:top-28">
              <ProfileContactCard
                phone={provider.phone}
                email={provider.email}
                website={provider.website}
                address={provider.address}
                instagram={(provider.details as { instagram?: string })?.instagram}
                facebook={(provider.details as { facebook?: string })?.facebook}
              />
            </aside>
          </div>
        </div>

        {/* Boundary before footer */}
        <div className="border-t border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50" aria-hidden />
      </main>

      <SiteFooter />
    </div>
  );
}
