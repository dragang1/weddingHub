"use client";

import { CategoryIcon } from "@/components/CategoryIcon";

type HomeCityStepProps = {
  slug: string;
  label: string;
  path: string;
  description?: string;
  isSelected?: boolean;
  onSelect?: (payload: { slug: string; label: string; path: string }) => void;
};

export function HomeCityStep({
  slug,
  label,
  path,
  description,
  isSelected,
  onSelect,
}: HomeCityStepProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.({ slug, label, path })}
      className={`group card card-hover flex min-h-[168px] flex-col items-center justify-center p-6 text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 ${
        isSelected
          ? "border-accent/40 bg-accent-soft/30 shadow-glow ring-2 ring-accent/20"
          : ""
      }`}
      aria-label={`Odaberi ${label}`}
      aria-pressed={isSelected}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-ink/80 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/10 group-hover:shadow-glow"
        aria-hidden
      >
        <CategoryIcon slug={slug} className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <span className="mt-4 font-serif text-lg font-bold text-ink">
        {label}
      </span>
      {description && (
        <span className="mt-1.5 text-xs leading-relaxed text-muted">
          {description}
        </span>
      )}
      <span className="mt-3 text-xs font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
        Odaberi →
      </span>
    </button>
  );
}
