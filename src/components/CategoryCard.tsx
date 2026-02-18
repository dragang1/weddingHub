"use client";

import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryPathSegment } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";

type CategoryCardProps = {
  slug: CategorySlug;
  label: string;
  description?: string;
};

export function CategoryCard({
  slug,
  label,
  description,
}: CategoryCardProps) {
  const pathSegment = categoryPathSegment(slug);
  const href = `/kategorija/${pathSegment}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 sm:p-7"
      aria-label={`Odaberi ${label}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent/70 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
        <CategoryIcon slug={slug} className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="mt-4 font-serif text-base font-semibold tracking-tight text-ink">
        {label}
      </span>
      {description && (
        <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
          {description}
        </span>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent/60 transition-colors duration-200 group-hover:text-accent">
        Pregledaj
        <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </Link>
  );
}
