import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Gallery } from "@/components/Gallery";
import { ProviderGalleryFeatured } from "@/components/ProviderGalleryFeatured";
import { ProviderGalleryLightbox } from "@/components/ProviderGalleryLightbox";
import { LeadForm } from "@/components/LeadForm";
import { ProfileContactCard } from "@/components/ProfileContactCard";
import { ProviderCard } from "@/components/ProviderCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categoryPath, categoryLabel } from "@/lib/categories";
import { getProviderImageUrl, getProviderImageUrls } from "@/lib/providerImage";
import { slugifyCity } from "@/lib/cities";
import { eventLabel } from "@/lib/events";
import type { EventTypeSlug } from "@/lib/events";
import { cityWhereClause } from "@/lib/providers";
import type { CategorySlug } from "@/lib/categories";

const SECTION_HEADING =
  "mb-4 text-xs font-semibold tracking-widest text-muted uppercase";

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
      className="rounded-2xl border border-border bg-white p-6"
      aria-labelledby="kljucni-detalji-heading"
    >
      <h2 id="kljucni-detalji-heading" className={SECTION_HEADING}>
        Ključni detalji
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-0.5 rounded-xl bg-accent-soft/30 px-4 py-3"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {item.label}
            </dt>
            <dd className="text-sm font-semibold text-ink">{item.value}</dd>
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
    title: `${provider.name} — Wedding Hub`,
    description: provider.description.slice(0, 160),
    openGraph: {
      title: `${provider.name} — Wedding Hub`,
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
  const badgeImage =
    getProviderImageUrl(provider.coverImageKey) ??
    getProviderImageUrl(provider.imageKey) ??
    getProviderImageUrl(provider.galleryImageKeys?.[0]) ??
    null;

  const galleryKeys = provider.galleryImageKeys ?? [];
  const galleryUrls = getProviderImageUrls(galleryKeys);
  const videoLinks = provider.videoLinks ?? [];
  const hasGalleryImages = galleryUrls.length > 0;
  const hasVideos = videoLinks.length > 0;
  const hasGallery = hasGalleryImages || hasVideos;

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-surface">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8">
          {/* Back link */}
          <Link
            href={backUrl}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Natrag na rezultate
          </Link>

          {/* 2-column layout */}
          <div className="mt-6 grid grid-cols-1 gap-10 pb-28 lg:grid-cols-[1fr_360px] sm:pb-12">
            {/* Left: main content */}
            <div className="space-y-10">
              {/* ProviderHeader: badge (left) | name+address | meta column */}
              <header className="flex flex-row flex-wrap items-start gap-4 sm:flex-nowrap sm:gap-8 lg:gap-10">
                {badgeImage && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-surface sm:h-20 sm:w-20">
                    <Image
                      src={badgeImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                      priority
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1 sm:flex-initial">
                  <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                    {provider.name}
                  </h1>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">
                    {provider.address ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors"
                      >
                        {provider.address}
                      </a>
                    ) : (
                      provider.locationCity
                    )}
                  </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 border-t border-border pt-3 sm:w-auto sm:flex-col sm:items-start sm:gap-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8 lg:pl-10 sm:min-w-[180px]">
                  <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-hover">
                    {categoryTitle}
                  </span>
                  {provider.subcategory && (
                    <span className="text-xs text-muted sm:text-sm">{provider.subcategory}</span>
                  )}
                  {(provider.eventTypes ?? []).map((slug: string) => (
                    <span
                      key={slug}
                      className="rounded-full bg-sage-soft px-2.5 py-0.5 text-xs font-medium text-sage sm:text-sm"
                    >
                      {eventLabel(slug as EventTypeSlug)}
                    </span>
                  ))}
                </div>
              </header>

              {/* Gallery — first main section, visually dominant */}
              {hasGallery && (
                <section aria-labelledby="galerija-heading">
                  <h2 id="galerija-heading" className={SECTION_HEADING}>
                    Galerija
                  </h2>
                  <div className="space-y-5">
                    {hasGalleryImages &&
                      (galleryUrls.length >= 4 ? (
                        <ProviderGalleryFeatured images={galleryUrls} />
                      ) : (
                        <ProviderGalleryLightbox images={galleryUrls} />
                      ))}
                    {hasVideos && (
                      <Gallery galleryImages={[]} videoLinks={videoLinks} />
                    )}
                  </div>
                </section>
              )}

              {/* Contact card (mobile only) — below gallery */}
              <div className="lg:hidden">
                <ProfileContactCard
                  phone={provider.phone}
                  email={provider.email}
                  website={provider.website}
                  address={provider.address}
                  instagram={
                    (provider.details as { instagram?: string })?.instagram
                  }
                  facebook={
                    (provider.details as { facebook?: string })?.facebook
                  }
                />
              </div>

              {/* About provider */}
              <section
                className="rounded-2xl border border-border bg-white p-6"
                aria-labelledby="opis-heading"
              >
                <h2 id="opis-heading" className={SECTION_HEADING}>
                  O pružatelju
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                  {provider.description}
                </p>
              </section>

              {/* Key details (wedding salons) */}
              {provider.category === "wedding_salon" &&
                (() => {
                  const details = (provider as { details?: unknown }).details;
                  if (
                    details &&
                    typeof details === "object" &&
                    !Array.isArray(details)
                  ) {
                    return (
                      <ProviderDetailsSection
                        details={details as ProviderDetails}
                      />
                    );
                  }
                  return null;
                })()}

              {/* Inquiry form */}
              <section
                id="upit"
                className="scroll-mt-24"
                aria-labelledby="upit-heading"
              >
                <h2 id="upit-heading" className={SECTION_HEADING}>
                  Pošalji upit
                </h2>
                <LeadForm
                  providerId={provider.id}
                  providerName={provider.name}
                />
              </section>

              {/* Similar providers */}
              {similar.length > 0 && (
                <section aria-labelledby="slicni-heading">
                  <h2 id="slicni-heading" className={SECTION_HEADING}>
                    Slični pružaoci
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

            {/* Right: sticky contact card (desktop only) */}
            <aside className="hidden h-fit lg:block lg:sticky lg:top-24">
              <ProfileContactCard
                phone={provider.phone}
                email={provider.email}
                website={provider.website}
                address={provider.address}
                instagram={
                  (provider.details as { instagram?: string })?.instagram
                }
                facebook={(provider.details as { facebook?: string })?.facebook}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-white/80 p-4 backdrop-blur-xl sm:hidden">
        <a
          href="#upit"
          className="btn-primary block w-full py-3.5 text-center text-sm"
        >
          Pošalji upit
        </a>
      </div>

      <SiteFooter />
    </div>
  );
}
