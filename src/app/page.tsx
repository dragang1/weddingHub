"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeCityStep } from "./HomeCityStep";

export const dynamic = "force-dynamic";

type CategoryPayload = { slug: string; label: string; path: string };

export default function Home() {
  const categorySectionRef = useRef<HTMLDivElement>(null);

  const scrollToCategories = useCallback(() => {
    categorySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleCategoryClick(payload: CategoryPayload) {
    window.location.href = `/kategorija/${payload.slug}`;
  }

  return (
    <main className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/[0.04] blur-3xl" />
          <div className="absolute top-1/2 -left-48 h-80 w-80 rounded-full bg-rose/[0.06] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            {/* Pill badge */}
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Vaš vodič kroz savršen dan
            </p>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Sve za vaše vjenčanje —{" "}
              <span className="text-accent">na jednom mjestu.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Odaberite uslugu i grad događaja. Pronađite provjerene ponuđače i
              kontaktirajte ih direktno.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToCategories}
                className="btn-primary rounded-full px-8 py-3.5 text-base shadow-glow"
              >
                Pronađite usluge
              </button>
              <Link
                href="#kako-funkcionise"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Kako funkcioniše
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Provjereni ponuđači
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Više gradova
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Brzo slanje upita
            </span>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section
        id="kako-funkcionise"
        className="relative border-y border-border bg-white/60 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <p className="section-label text-accent">Kako funkcioniše</p>
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Tri jednostavna koraka
            </h2>
            <div className="divider-ornament" />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
            {[
              {
                num: "01",
                title: "Odaberite uslugu",
                desc: "Izaberite kategoriju koja vam treba — od muzike do dekoracije.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Izaberite grad",
                desc: "Fokusirajte pretragu na grad ili regiju gdje slavite.",
                icon: (
                  <svg
                    className="h-6 w-6"
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
                ),
              },
              {
                num: "03",
                title: "Pošaljite upit",
                desc: "Kontaktirajte ponuđače direktno — brzo i bez komplikacija.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                ),
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group relative rounded-2xl border border-border/60 bg-white p-8 text-center transition-all duration-300 hover:border-accent/20 hover:shadow-soft-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  {step.icon}
                </div>
                <span className="mt-5 block text-xs font-bold uppercase tracking-[0.2em] text-accent/60">
                  {step.num}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────── */}
      <section
        ref={categorySectionRef}
        id="kategorije"
        className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="text-center">
          <p className="section-label text-accent">Kategorije</p>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Odaberite uslugu koja vam je potrebna
          </h2>
          <p className="mt-3 text-sm text-muted">
            Kliknite kategoriju i nastavite odabirom grada.
          </p>
          <div className="divider-ornament" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <HomeCityStep
              key={cat.slug}
              slug={cat.slug}
              label={cat.label}
              path={cat.path}
              description={cat.description}
              onSelect={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
