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
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-marketplace border border-stone-200/70 dark:border-stone-600/50 bg-gradient-to-br from-white via-cream/40 to-accent-soft/20 dark:from-stone-800 dark:via-stone-800/95 dark:to-stone-800/90 p-4 sm:p-8 text-left shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06),0_0_0_1px_rgba(28,25,23,0.03)] dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(28,25,23,0.1),0_0_0_1px_rgba(184,134,11,0.08)] hover:border-accent/20 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
      aria-label={`Odaberi ${label}`}
    >
      {/* Top highlight – svježina */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-marketplace bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-80 pointer-events-none" />
      {/* Hover gradient – toplina */}
      <div className="absolute inset-0 rounded-marketplace bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/[0.03] group-hover:to-accent/10 transition-colors duration-500 pointer-events-none" />
      <div className="absolute top-0 right-0 p-3 sm:p-6 opacity-0 translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <div className="h-9 w-9 rounded-full bg-accent-soft/80 flex items-center justify-center border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-300 shadow-soft">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
      </div>

      <div className="relative mb-4 sm:mb-12 shrink-0">
        <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft/60 to-accent-soft/30 dark:from-accent/30 dark:to-accent/20 border border-accent/15 dark:border-accent/30 text-ink dark:text-stone-100 shadow-[0_2px_12px_-2px_rgba(184,134,11,0.15)] transition-all duration-500 group-hover:from-accent group-hover:to-accent-hover group-hover:text-white group-hover:border-accent group-hover:shadow-[0_8px_24px_-4px_rgba(184,134,11,0.35)] group-hover:scale-105">
          <CategoryIcon slug={slug} className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </span>
      </div>

      <div className="relative flex flex-col sm:h-auto sm:min-h-0">
        <div className="min-h-[2.5rem] flex flex-col justify-end">
          <h3 className="font-serif text-base font-bold tracking-tight text-ink dark:text-stone-100 mb-1 sm:text-xl sm:mb-2 line-clamp-2">
            {label}
          </h3>
        </div>
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-stone-600/90 dark:text-stone-400 font-light sm:text-sm">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
