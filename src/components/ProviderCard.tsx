import Link from "next/link";
import Image from "next/image";
import { eventLabel } from "@/lib/events";
import { getProviderImageUrl } from "@/lib/providerImage";
import type { EventTypeSlug } from "@/lib/events";

const PLACEHOLDER_IMAGE = "/images/placeholders/default.svg";

export type ProviderCardProvider = {
  id: string;
  name: string;
  locationCity: string;
  serviceCities: string[];
  isNationwide: boolean;
  imageKey?: string | null;
  coverImageKey?: string | null;
  galleryImageKeys?: string[];
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
  const thumb =
    getProviderImageUrl(provider.coverImageKey) ??
    getProviderImageUrl(provider.imageKey) ??
    getProviderImageUrl(provider.galleryImageKeys?.[0]) ??
    PLACEHOLDER_IMAGE;
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
    <article className="group overflow-hidden rounded-2xl bg-white border border-stone-200/60 shadow-marketplace transition-all duration-500 hover:-translate-y-1.5 hover:shadow-marketplace-hover hover:border-stone-200">
      <Link href={`/profil/${provider.id}`} className="block h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
        </div>

        <div className="flex flex-col flex-1 p-6 sm:p-7">
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-ink mb-1.5">
              {provider.name}
            </h2>
            <p className="flex items-center gap-2 text-sm text-stone-500 font-light">
              <svg
                className="h-4 w-4 text-accent shrink-0"
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
              <div className="mt-4 flex flex-wrap gap-2">
                {displayBadges.map((b) => (
                  <span
                    key={b.key}
                    className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600"
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent transition-colors duration-300 group-hover:text-ink">
              Pogledaj profil
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white group-hover:translate-x-1">
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
        </div>
      </Link>
    </article>
  );
}
