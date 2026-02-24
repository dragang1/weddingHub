"use client";

import { useRef, useCallback } from "react";
import { CATEGORIES } from "@/lib/categories";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryCard } from "@/components/CategoryCard";
import { PlatformAnimation } from "@/components/PlatformAnimation";

export const dynamic = "force-dynamic";

export default function Home() {
  const categorySectionRef = useRef<HTMLDivElement>(null);

  const scrollToCategories = useCallback(() => {
    categorySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-36 section-pattern">
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-200/40 via-transparent to-transparent opacity-80 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/12 via-transparent to-transparent opacity-90 blur-3xl" />
          <div className="absolute inset-0 grain-overlay" aria-hidden />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-center">
            
            {/* Text Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-6 xl:col-span-5 relative z-10">
              {/* Premium Pill Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-stone-200/80 bg-white/60 backdrop-blur-md px-4 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/80">
                  Platforma za događaje u BiH
                </span>
              </div>

              <h1 className="font-serif text-[42px] leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-[68px] animate-fade-in-up [animation-delay:100ms] opacity-0">
                Pronađite pružaoce usluga<br className="hidden lg:block"/> za vjenčanje i događaje.
              </h1>

              <p className="mt-8 text-[17px] leading-relaxed text-stone-500 sm:text-[19px] max-w-xl animate-fade-in-up [animation-delay:200ms] opacity-0 font-light">
                Muzika, fotografija, sale, torte, dekoracija i više. Pretražite po gradu i kategoriji.
              </p>

              {/* CTAs */}
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start animate-fade-in-up [animation-delay:300ms] opacity-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToCategories}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-medium text-white shadow-marketplace-hover transition-transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0" />
                  <span className="relative">Pretraži usluge</span>
                  <svg className="relative w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <a
                  href="#kako-funkcionise"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-stone-500 px-6 py-4 w-full sm:w-auto"
                >
                  Kako radi
                </a>
              </div>

              {/* Trust indicator (avatar group) */}
              <div className="mt-14 pt-8 border-t border-stone-200/60 flex items-center gap-5 animate-fade-in-up [animation-delay:400ms] opacity-0">
                <div className="flex -space-x-3">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="" />
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white bg-stone-100 text-xs font-bold text-stone-600">
                    500+
                  </div>
                </div>
                <div className="text-sm font-medium text-stone-500 leading-tight">
                  Preko 500 rezervacija.
                </div>
              </div>
            </div>

            {/* Animation / Video Container */}
            <div className="w-full max-w-[420px] mx-auto lg:max-w-none lg:col-span-6 xl:col-span-7 relative animate-fade-in-up [animation-delay:500ms] opacity-0 flex justify-center lg:justify-end perspective-1000">
              
              {/* Premium Glow behind the app window */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/20 blur-[100px] rounded-full" />
              
              {/* The actual platform animation component */}
              <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/3] max-h-[600px] rounded-marketplace-lg overflow-hidden shadow-marketplace-hover border border-stone-200/60 bg-white">
                <PlatformAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section
        id="kako-funkcionise"
        className="relative py-24 sm:py-32 bg-white border-y border-stone-200/50"
      >
        <div className="absolute inset-0 section-pattern opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <p className="section-label">Kako radi</p>
            <h2 className="mt-4 section-heading">
              Tri jednostavna koraka
            </h2>
            <div className="divider-ornament" />
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {[
              {
                num: "01",
                title: "Pretražite usluge",
                desc: "Odaberite kategoriju i grad. Pregledajte ponude.",
              },
              {
                num: "02",
                title: "Usporedite ponude",
                desc: "Pogledajte portfolije i javite se onima koji vam odgovaraju.",
              },
              {
                num: "03",
                title: "Javite se pružaocu",
                desc: "Pošaljite upit i dogovorite detalje direktno.",
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-[1.5rem] bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-marketplace transition-all duration-500 hover:shadow-marketplace-hover hover:border-stone-200 hover:-translate-y-1"
              >
                {i !== 2 && (
                  <div className="hidden sm:block absolute top-12 left-[65%] right-[-35%] h-px bg-gradient-to-r from-stone-200 via-stone-200/80 to-transparent" />
                )}
                <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-stone-50 border border-stone-200/80 text-ink transition-all duration-500 group-hover:scale-105 group-hover:bg-ink group-hover:text-white group-hover:border-ink group-hover:shadow-marketplace-glow">
                  <span className="font-serif text-lg sm:text-xl font-semibold">{step.num}</span>
                </div>
                <h3 className="mt-6 font-serif text-xl font-bold text-ink tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500 max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popularne kategorije ───────────────────────────────── */}
      <section
        ref={categorySectionRef}
        id="kategorije"
        className="relative py-24 sm:py-32 section-pattern border-t border-stone-200/50"
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20">
            <div className="max-w-xl">
              <p className="section-label">Usluge</p>
              <h2 className="mt-4 section-heading">
                Kategorije usluga
              </h2>
            </div>
            <p className="text-stone-500 text-sm md:text-right max-w-sm leading-relaxed">
              Odaberite kategoriju i grad da vidite ponude.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
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
