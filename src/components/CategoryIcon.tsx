"use client";

import {
  Music,
  Camera,
  Building2,
  Cake,
  Flower2,
  Car,
  Sparkles,
  Shirt,
  LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/lib/categories";

const ICON_MAP: Record<CategorySlug, LucideIcon> = {
  music: Music,
  photo_video: Camera,
  wedding_salon: Building2,
  cakes: Cake,
  decoration: Flower2,
  transport: Car,
  beauty: Sparkles,
  wedding_dresses: Shirt,
};

type CategoryIconProps = {
  slug: CategorySlug | string;
  className?: string;
  strokeWidth?: number;
};

export function CategoryIcon({
  slug,
  className = "h-5 w-5",
  strokeWidth = 1.75,
}: CategoryIconProps) {
  const Icon = ICON_MAP[slug as CategorySlug] ?? Music;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
