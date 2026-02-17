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
      className="group relative flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-border/50 bg-white p-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2"
      aria-label={`Odaberi ${label}`}
    >
      <span
        className="flex shrink-0 items-center justify-center text-ink/60 transition-colors duration-200 group-hover:text-accent"
        aria-hidden
      >
        <CategoryIcon slug={slug} className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="mt-2.5 font-serif text-base font-semibold tracking-tight text-ink">
        {label}
      </span>
      {description && (
        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/60">
          {description}
        </span>
      )}
    </Link>
  );
}
