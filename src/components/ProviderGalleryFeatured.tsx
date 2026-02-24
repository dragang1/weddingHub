"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type ProviderGalleryFeaturedProps = {
  images: string[];
  initialIndex?: number;
};

export function ProviderGalleryFeatured({
  images,
  initialIndex = 0,
}: ProviderGalleryFeaturedProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(initialIndex, images.length - 1))
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      switch (e.key) {
        case "Escape":
          setOpen(false);
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
      }
    },
    [open, goPrev, goNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (images.length === 0) return null;

  const featured = images[0];
  const thumbnails = images.slice(1, 4);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  return (
    <>
      {/* Featured + grid layout */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
        {/* Large featured (desktop) / first image (mobile) */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative col-span-2 row-span-2 aspect-[4/3] sm:aspect-video lg:aspect-auto overflow-hidden rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
          aria-label={`Pogledaj sliku 1 od ${images.length}`}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10 duration-500" />
          <Image
            src={featured}
            alt="Naslovna fotografija"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </button>

        {/* 3 small thumbnails (desktop) or 2–3 more (mobile) */}
        {thumbnails.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i + 1)}
            className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
            aria-label={`Pogledaj sliku ${i + 2} od ${images.length}`}
          >
             <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10 duration-500" />
            <Image
              src={url}
              alt={`Galerija ${i + 2}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galerija slika"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Zatvori"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:left-4"
            aria-label="Prethodna slika"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-4"
            aria-label="Sljedeća slika"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            className="relative max-w-5xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex]}
              alt={`Slika ${activeIndex + 1} od ${images.length}`}
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
