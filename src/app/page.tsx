"use client";

import { useState, useRef, useCallback } from "react";
import { CATEGORIES } from "@/lib/categories";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryCard } from "@/components/CategoryCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const categorySectionRef = useRef<HTMLDivElement>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const scrollToCategories = useCallback(() => {
    categorySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative background — reduced blur on mobile for performance */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/[0.05] blur-2xl sm:h-96 sm:w-96 sm:blur-3xl" />
          <div className="absolute top-1/2 -left-32 h-56 w-56 rounded-full bg-rose/[0.05] blur-2xl sm:-left-48 sm:h-80 sm:w-80 sm:blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-14 md:py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Pill badge */}
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.15em]">
              <span className="h-1 w-1 rounded-full bg-accent sm:h-1.5 sm:w-1.5" />
              Vaš vodič kroz savršen dan
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:mt-5 sm:text-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl">
              Sve za vaše vjenčanje —{" "}
              <span className="text-accent">na jednom mjestu.</span>
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-base md:max-w-lg md:text-lg">
              Odaberite uslugu i grad događaja. Pronađite provjerene ponuđače i
              kontaktirajte ih direktno.
            </p>

            {/* Primary CTA */}
            <div className="mt-6 sm:mt-8">
              <button
                type="button"
                onClick={scrollToCategories}
                className="btn-primary w-full rounded-full px-6 py-3.5 text-base shadow-glow sm:w-auto sm:px-8"
              >
                Pronađite usluge
              </button>
            </div>
          </div>

          {/* Trust — subtle cards */}
          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft/60 text-accent">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-sm text-muted">Provjereni ponuđači</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft/60 text-accent">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="text-sm text-muted">Više gradova</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft/60 text-accent">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span className="text-sm text-muted">Brzo slanje upita</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section
        id="kako-funkcionise"
        className="relative border-t border-border/60 bg-accent-soft/25"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <button
            type="button"
            onClick={() => setHowItWorksOpen((o) => !o)}
            className="flex w-full flex-col items-center py-4 text-center group"
            aria-expanded={howItWorksOpen}
          >
            <p className="section-label text-accent/90">Kako funkcioniše</p>
            <h2 className="mt-2 font-serif text-lg font-bold tracking-tight text-ink sm:text-xl">
              Tri jednostavna koraka
            </h2>
            <span className="mt-4 flex items-center gap-2 text-sm font-medium text-muted group-hover:text-ink transition-colors">
              {howItWorksOpen ? "Zatvori" : "Klikni za detalje"}
              <svg
                className={`h-5 w-5 transition-transform ${howItWorksOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {howItWorksOpen && (
          <div className="grid gap-6 pt-4 sm:grid-cols-3 sm:gap-6 lg:gap-8">
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
                className="group relative rounded-xl border border-border/40 bg-white p-6 text-center transition-all duration-200 hover:border-accent/20 hover:shadow-soft sm:p-6"
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
          )}
        </div>
      </section>

      {/* ── Popularne kategorije ───────────────────────────────── */}
      <section
        ref={categorySectionRef}
        id="kategorije"
        className="relative border-t border-accent/20 bg-[#F7F4EF] py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <p className="section-label text-accent">Popularne kategorije</p>
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Odaberite uslugu koja vam je potrebna
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              Kliknite kategoriju i nastavite odabirom grada.
            </p>
            <div className="divider-ornament" />
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 [&>a:last-child]:col-span-2 [&>a:last-child]:md:col-span-1 [&>a:last-child]:md:col-start-2">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.slug}
                slug={cat.slug}
                label={cat.label}
                description={cat.description}
              />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
