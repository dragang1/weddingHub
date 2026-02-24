"use client";

import Image from "next/image";
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
    <main className="min-h-screen flex flex-col bg-cream dark:bg-stone-900">
      <SiteHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-36 section-pattern dark:bg-stone-900/95">
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
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/80 dark:text-stone-200">
                  Platforma za događaje u BiH
                </span>
              </div>

              <h1 className="font-serif text-[42px] leading-[1.05] tracking-tight text-ink dark:text-stone-100 sm:text-6xl md:text-[68px] animate-fade-in-up [animation-delay:100ms] opacity-0">
                Pronađite pružaoce usluga<br className="hidden lg:block"/> za vjenčanje i događaje.
              </h1>

              <p className="mt-8 text-[17px] leading-relaxed text-stone-500 dark:text-stone-400 sm:text-[19px] max-w-xl animate-fade-in-up [animation-delay:200ms] opacity-0 font-light">
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
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink dark:text-stone-200 transition-colors hover:text-stone-500 dark:hover:text-stone-400 px-6 py-4 w-full sm:w-auto"
                >
                  Kako radi
                </a>
              </div>

              {/* Trust indicator (avatar group) */}
              <div className="mt-14 pt-8 border-t border-stone-200/60 dark:border-stone-600/50 flex items-center gap-5 animate-fade-in-up [animation-delay:400ms] opacity-0 group/avatars">
                <div className="flex -space-x-3">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                    alt=""
                    width={40}
                    height={40}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover transition-transform duration-300 group-hover/avatars:translate-x-0.5 animate-avatar-stack [animation-delay:0ms]"
                    priority
                    sizes="40px"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
                    alt=""
                    width={40}
                    height={40}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover transition-transform duration-300 group-hover/avatars:translate-x-1 animate-avatar-stack [animation-delay:150ms]"
                    loading="lazy"
                    sizes="40px"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                    alt=""
                    width={40}
                    height={40}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover transition-transform duration-300 group-hover/avatars:translate-x-1.5 animate-avatar-stack [animation-delay:300ms]"
                    loading="lazy"
                    sizes="40px"
                  />
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white bg-stone-100 text-xs font-bold text-stone-600 transition-all duration-300 group-hover/avatars:scale-110 group-hover/avatars:bg-accent-soft/80 group-hover/avatars:ring-accent/30">
                    500+
                  </div>
                </div>
                <div className="text-sm font-medium text-stone-500 dark:text-stone-400 leading-tight">
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
        className="relative py-24 sm:py-32 section-pattern dark:bg-stone-900 border-y border-stone-200/50 dark:border-stone-600/50"
      >
        <div className="absolute inset-0 section-pattern opacity-40 dark:opacity-0" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(184,134,11,0.04),transparent_50%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(184,134,11,0.06),transparent_50%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <p className="section-label">Kako radi</p>
            <h2 className="mt-4 section-heading dark:text-stone-100">
              Tri jednostavna koraka
            </h2>
            <div className="divider-ornament" />
          </div>

          <div className="relative grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {/* Povezujuća linija na mobilu */}
            <div className="absolute left-1/2 top-14 bottom-14 w-px -translate-x-px bg-gradient-to-b from-stone-200 via-stone-200/80 to-transparent dark:from-stone-600 dark:via-stone-600/80 sm:hidden" aria-hidden />
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
                className="group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-[1.5rem] bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm border border-stone-200/70 dark:border-stone-600/60 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06),0_0_0_1px_rgba(28,25,23,0.03)] dark:shadow-[0_0_0_1px_rgba(184,134,11,0.12),0_8px_24px_-8px_rgba(0,0,0,0.2)] transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(28,25,23,0.08),0_0_0_1px_rgba(184,134,11,0.1)] dark:hover:shadow-[0_0_0_1px_rgba(184,134,11,0.2),0_16px_32px_-8px_rgba(0,0,0,0.3)] hover:border-stone-300 dark:hover:border-stone-500 hover:-translate-y-1 hover:scale-[1.01]"
              >
                {i !== 2 && (
                  <div className="hidden sm:block absolute top-12 left-[65%] right-[-35%] h-px bg-gradient-to-r from-stone-200 via-stone-200/80 to-transparent dark:from-stone-600 dark:via-stone-600/80" />
                )}
                <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft/80 to-accent-soft/50 dark:from-accent/40 dark:to-accent/30 border border-accent/20 dark:border-accent/35 text-ink dark:text-stone-100 transition-all duration-500 group-hover:scale-105 group-hover:from-accent group-hover:to-accent-hover group-hover:text-white group-hover:border-accent group-hover:shadow-marketplace-glow">
                  <span className="font-serif text-lg sm:text-xl font-semibold">{step.num}</span>
                </div>
                <h3 className="mt-6 font-serif text-xl font-bold text-ink dark:text-stone-100 tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400 max-w-xs">
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
        className="relative py-24 sm:py-32 section-pattern dark:bg-stone-900 border-t border-stone-200/50 dark:border-stone-600/40"
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20">
            <div className="max-w-xl">
              <p className="section-label">Usluge</p>
              <h2 className="mt-4 section-heading dark:text-stone-100">
                Kategorije usluga
              </h2>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm md:text-right max-w-sm leading-relaxed">
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
