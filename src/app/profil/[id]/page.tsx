import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Gallery } from "@/components/Gallery";
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
      className="rounded-2xl border border-border bg-white p-5 sm:p-6"
      aria-labelledby="kljucni-detalji-heading"
    >
      <h2
        id="kljucni-detalji-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4"
      >
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
  if (!provider || (provider as { isActive?: boolean }).isActive === false) notFound();

  const cityFilter = cityWhereClause(
    provider.locationCity,
    provider.category
  );
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
  const heroImage =
    getProviderImageUrl(provider.coverImageKey) ??
    getProviderImageUrl(provider.imageKey) ??
    getProviderImageUrl(provider.galleryImageKeys?.[0]) ??
    "/images/placeholders/default.svg";

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-surface">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero cover banner */}
        <section className="relative w-full overflow-hidden rounded-b-2xl h-56 sm:h-72 lg:h-80 bg-muted">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover object-[center_35%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
            <Link
              href={backUrl}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur-sm transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Natrag na rezultate
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                {provider.name}
              </h1>
              <a
                href="#upit"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:bg-white/95 hover:shadow-soft-lg"
              >
                Pošalji upit
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Key info strip */}
        <div className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="flex items-center gap-2 text-sm text-muted">
              <svg className="h-4 w-4 shrink-0 text-accent/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {provider.address ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink hover:text-accent transition-colors underline underline-offset-2"
                >
                  {provider.address}
                </a>
              ) : (
                <span className="font-medium text-ink">{provider.locationCity}</span>
              )}
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="rounded-md bg-accent-soft/60 px-2 py-0.5 text-xs font-medium text-accent-hover">
                {categoryTitle}
              </span>
              {provider.subcategory && <span>{provider.subcategory}</span>}
            </div>
            {(provider.eventTypes ?? []).length > 0 && (
              <>
                <div className="hidden h-4 w-px bg-border sm:block" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Pruža usluge za:</span>
                  {(provider.eventTypes ?? []).map((slug: string) => (
                    <span
                      key={slug}
                      className="rounded-full bg-accent-soft/70 px-2.5 py-0.5 text-xs font-medium text-accent-hover"
                    >
                      {eventLabel(slug as EventTypeSlug)}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content: two-column on large */}
        <div className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-10 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main column */}
            <div className="min-w-0 space-y-8 lg:space-y-10">
              {/* Contact + CTA card (mobile only – above gallery) */}
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

              {/* Gallery */}
              {(() => {
                const galleryKeys = provider.galleryImageKeys ?? [];
                const galleryUrls = getProviderImageUrls(galleryKeys);
                const videoLinks = provider.videoLinks ?? [];
                const hasImages = galleryUrls.length > 0;
                const hasVideos = videoLinks.length > 0;
                if (!hasImages && !hasVideos) return null;
                return (
                  <section aria-labelledby="galerija-heading">
                    <h2 id="galerija-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                      Galerija
                    </h2>
                    <div className="space-y-4">
                      {hasImages && (
                        <ProviderGalleryLightbox images={galleryUrls} />
                      )}
                      {hasVideos && (
                        <Gallery galleryImages={[]} videoLinks={videoLinks} />
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Key details (wedding salons) */}
              {provider.category === "wedding_salon" &&
                (() => {
                  const details = (provider as { details?: unknown }).details;
                  if (details && typeof details === "object" && !Array.isArray(details)) {
                    return <ProviderDetailsSection details={details as ProviderDetails} />;
                  }
                  return null;
                })()}

              {/* Description */}
              <section
                className="rounded-2xl border border-border bg-white p-5 sm:p-6"
                aria-labelledby="opis-heading"
              >
                <h2 id="opis-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                  O pružatelju
                </h2>
                <div className="prose prose-sm max-w-none prose-p:text-muted prose-p:leading-relaxed">
                  <p className="whitespace-pre-wrap text-muted">
                    {provider.description}
                  </p>
                </div>
              </section>

              {/* Lead form */}
              <section
                id="upit"
                className="scroll-mt-24"
                aria-labelledby="upit-heading"
              >
                <h2 id="upit-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                  Pošalji upit
                </h2>
                <LeadForm providerId={provider.id} providerName={provider.name} />
              </section>

              {/* Similar providers */}
              {similar.length > 0 && (
                <section aria-labelledby="slicni-heading">
                  <h2 id="slicni-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                    Slični pružaoci
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Sidebar: contact card (desktop only) */}
            <aside className="hidden min-w-0 lg:block lg:sticky lg:top-24 lg:self-start">
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
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border glass p-4 sm:hidden">
        <a href="#upit" className="btn-primary block w-full py-3.5 text-center text-sm">
          Pošalji upit
        </a>
      </div>

      <SiteFooter />
    </div>
  );
}
