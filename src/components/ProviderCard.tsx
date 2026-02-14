import Link from "next/link";
import Image from "next/image";
import { eventLabel } from "@/lib/events";
import type { EventTypeSlug } from "@/lib/events";

export type ProviderCardProvider = {
  id: string;
  name: string;
  locationCity: string;
  serviceCities: string[];
  isNationwide: boolean;
  galleryImages: string[];
  eventTypes?: string[];
};

type ProviderCardProps = {
  provider: ProviderCardProvider;
  selectedCity?: string | null;
  eventType?: EventTypeSlug;
};

function providerServesCity(
  provider: ProviderCardProvider,
  city: string
): boolean {
  if (!city.trim()) return false;
  const c = city.trim();
  if (provider.locationCity === c) return true;
  if (provider.isNationwide) return true;
  return provider.serviceCities?.includes(c) ?? false;
}

export function ProviderCard({
  provider,
  selectedCity,
  eventType = "wedding",
}: ProviderCardProps) {
  const thumb = provider.galleryImages?.[0];
  const servesThisCity =
    selectedCity && providerServesCity(provider, selectedCity);
  const showRadiUBadge =
    servesThisCity &&
    (provider.isNationwide || provider.locationCity !== selectedCity);
  const eventTypes = provider.eventTypes ?? [];
  const showEventBadge =
    eventType !== "wedding" && eventTypes.includes(eventType);

  const badges: { key: string; label: string }[] = [];
  if (showRadiUBadge) {
    badges.push({
      key: "availability",
      label: provider.isNationwide
        ? "Dostupno u cijeloj BiH"
        : `Dostupno za ${selectedCity}`,
    });
  }
  if (showEventBadge) {
    badges.push({
      key: "event",
      label: `Pogodno za ${eventLabel(eventType)}`,
    });
  }
  const displayBadges = badges.slice(0, 2);

  return (
    <article className="group card card-hover overflow-hidden">
      <Link href={`/profil/${provider.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-accent-soft/20">
          {thumb?.startsWith("http") ? (
            <Image
              src={thumb}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted/40">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
          )}
          {/* Subtle hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-ink">
            {provider.name}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {provider.locationCity}
          </p>

          {displayBadges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {displayBadges.map((b) => (
                <span
                  key={b.key}
                  className="inline-flex items-center rounded-full bg-accent-soft/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-hover"
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all duration-200 group-hover:gap-2.5">
            Pogledaj profil
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
