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
      className="group relative flex flex-col justify-between overflow-hidden rounded-marketplace border border-stone-200/60 bg-white p-6 sm:p-8 text-left shadow-marketplace transition-all duration-500 hover:-translate-y-2 hover:shadow-marketplace-hover hover:border-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2"
      aria-label={`Odaberi ${label}`}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 rounded-marketplace bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/[0.02] group-hover:to-accent/5 transition-colors duration-500 pointer-events-none" />
      <div className="absolute top-0 right-0 p-5 sm:p-6 opacity-0 translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <div className="h-9 w-9 rounded-full bg-stone-50 flex items-center justify-center border border-stone-200 text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-colors duration-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
      </div>
      
      <div className="relative mb-10 sm:mb-12">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-50 border border-stone-200/80 text-ink transition-all duration-500 group-hover:bg-ink group-hover:text-white group-hover:border-ink group-hover:shadow-marketplace-glow">
          <CategoryIcon slug={slug} className="h-6 w-6" strokeWidth={1.5} />
        </span>
      </div>
      
      <div className="relative">
        <h3 className="font-serif text-xl font-bold tracking-tight text-ink mb-2">
          {label}
        </h3>
        {description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500 font-light">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
