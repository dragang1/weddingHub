"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  MapPin,
  CheckCircle2,
  MousePointer2,
  Star,
  Heart,
  SlidersHorizontal,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";

export function PlatformAnimation() {
  const [step, setStep] = useState(0);
  const [isInViewport, setIsInViewport] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 0: Initial
  // 1: Typing search
  // 2: Results loading
  // 3: Results shown
  // 4: Hovering heart (Like)
  // 5: Liked
  // 6: Hovering contact
  // 7: Clicked contact
  // 8: Success
  // 9: Outro

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInViewport) {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
      return;
    }

    const addTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeoutsRef.current.push(id);
    };

    const runSequence = () => {
      setStep(0);
      addTimeout(() => setStep(1), 800);
      addTimeout(() => setStep(2), 2800);
      addTimeout(() => setStep(3), 3800);
      addTimeout(() => setStep(4), 5000);
      addTimeout(() => setStep(5), 5800);
      addTimeout(() => setStep(6), 6800);
      addTimeout(() => setStep(7), 7800);
      addTimeout(() => setStep(8), 8200);
      addTimeout(() => setStep(9), 11000);
      addTimeout(() => runSequence(), 12000);
    };

    runSequence();

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [isInViewport]);

  // Use a scaling trick to make the fixed-size animation responsive
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Base width of the animation is ~400px
        const parentWidth =
          containerRef.current.parentElement?.clientWidth || 400;
        // On mobile, we might have 320px width, scale down. On desktop, max 1.2
        const newScale = Math.min(Math.max(parentWidth / 440, 0.7), 1.15);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#fafafa] overflow-hidden flex flex-col items-center justify-center font-sans perspective-1000"
    >
      {/* High-end ambient background meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-70 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-300/40 via-transparent to-transparent opacity-70 blur-3xl" />

      {/* Main viewport that scales responsively */}
      <div
        className="relative flex flex-col items-center justify-center transition-transform duration-1000 cubic-bezier(0.25, 1, 0.5, 1) origin-center w-[380px] h-[500px]"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Sleek Browser/App Chrome */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-3xl rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="h-12 border-b border-stone-200/50 bg-white/40 flex items-center px-4 relative shrink-0">
            <div className="flex gap-1.5 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-3 py-1 rounded-md bg-stone-100/50 text-[10px] font-medium text-stone-500 flex items-center gap-2 border border-stone-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                eventhub.com
              </div>
            </div>
          </div>

          {/* App Content Area */}
          <div className="flex-1 relative p-5 flex flex-col items-center">
            {/* Title */}
            <div
              className={`text-center transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${step >= 1 ? "opacity-0 -translate-y-8 absolute pointer-events-none scale-95" : "opacity-100 translate-y-4 scale-100"}`}
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/5 border border-accent/10 text-[10px] text-accent font-semibold mb-3 uppercase tracking-wider">
                Otkrijte najbolje
              </div>
              <h2 className="font-serif text-3xl font-medium text-ink mb-2 leading-tight">
                Savršeni
                <br />
                detalji za vas
              </h2>
            </div>

            {/* Search Bar */}
            <div
              className={`bg-white border border-stone-200 shadow-[0_8px_20px_rgb(0,0,0,0.03)] rounded-2xl p-2 flex items-center gap-2 w-full transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] z-20 ${
                step >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } ${step >= 3 ? "scale-[0.92] -translate-y-4 shadow-sm" : "mt-8"}`}
            >
              <div className="bg-stone-50 p-2 rounded-xl text-stone-400">
                <Search className="w-4 h-4 shrink-0" />
              </div>
              <div className="flex-1 h-6 relative flex items-center overflow-hidden">
                {step === 0 && (
                  <span className="text-[13px] text-stone-400 absolute font-light">
                    Šta tražite?
                  </span>
                )}
                {step >= 1 && (
                  <div className="text-[14px] text-ink font-medium whitespace-nowrap overflow-hidden border-r-[1.5px] border-accent pr-1 animate-[typing_1.8s_steps(22,end)_forwards]">
                    Muzika Mostar
                  </div>
                )}
              </div>
              <div className="w-[1px] h-6 bg-stone-100 mx-0.5" />
              <div className="bg-stone-50 text-ink rounded-xl px-2.5 py-1.5 shrink-0 flex items-center gap-1.5 text-[11px] font-medium border border-stone-100/50">
                <MapPin className="w-3 h-3 text-stone-400" />
                Sa
              </div>
            </div>

            {/* Loader */}
            <div
              className={`absolute top-32 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-accent/80 animate-bounce [animation-delay:0.15s]" />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>

            {/* Results Container */}
            <div
              className={`w-full transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] absolute top-20 left-0 px-5 ${
                step >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0 pointer-events-none"
              }`}
            >
              {/* Premium Result Card (Band) */}
              <div
                className={`bg-white rounded-[16px] p-3 transition-all duration-500 relative group ${step >= 6 ? "shadow-[0_12px_30px_rgb(0,0,0,0.06)] border border-accent/20 ring-1 ring-accent/10 -translate-y-1" : "shadow-[0_4px_12px_rgb(0,0,0,0.03)] border border-stone-200/60"}`}
              >
                {/* Save/Like Button (static in this sequence) */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-stone-400 border border-stone-200 shadow-sm z-10">
                  <Heart className="w-3.5 h-3.5" />
                </div>

                <div className="flex gap-3">
                  {/* High-end Image of a Band */}
                  <div className="w-[100px] h-[100px] rounded-[12px] shrink-0 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center transition-transform duration-1000 scale-[1.02]" />
                    <div className="absolute bottom-1.5 left-1.5 bg-ink/80 backdrop-blur-md px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      Mostar
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col py-0.5 justify-between">
                    <div>
                      <div className="text-[15px] font-semibold text-ink leading-tight tracking-tight">
                        Ekskluziv Band
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-[11px] font-bold text-ink">
                          4.9
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">
                          (86)
                        </span>
                      </div>
                    </div>

                    {/* Audio Preview Feature */}
                    <div
                      className={`mt-2 flex items-center gap-2 rounded-lg border p-1.5 transition-colors duration-300 ${
                        step === 5
                          ? "bg-accent/5 border-accent/20"
                          : "bg-stone-50 border-stone-100"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${
                          step === 5
                            ? "bg-accent text-white shadow-[0_0_10px_rgba(var(--accent),0.5)]"
                            : "bg-white border border-stone-200 text-stone-500"
                        }`}
                      >
                        {step === 5 ? (
                          <div className="w-2 h-2 bg-white rounded-[1px]" /> // Stop square
                        ) : (
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-current border-b-[4px] border-b-transparent ml-0.5" /> // Play triangle
                        )}
                      </div>

                      {/* Equalizer animation */}
                      <div className="flex-1 flex items-end gap-[2px] h-3.5 overflow-hidden">
                        {[...Array(14)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-t-sm transition-all duration-100 ${step === 5 ? "bg-accent" : "bg-stone-200"}`}
                            style={{
                              height:
                                step === 5
                                  ? `${Math.max(20, Math.random() * 100)}%`
                                  : "20%",
                              animation:
                                step === 5
                                  ? `equalizer ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate`
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send Request Button */}
                <div
                  className={`mt-3 h-10 rounded-[10px] flex items-center justify-center text-[13px] font-semibold transition-all duration-300 relative overflow-hidden gap-1.5 ${
                    step >= 7
                      ? "bg-ink text-white shadow-md scale-[0.98]"
                      : "bg-accent text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {step >= 7 ? "Provjera u toku..." : "Dostupnost termina"}
                  {step === 7 && (
                    <div className="absolute inset-0 bg-white/20 animate-[ping_0.4s_ease-out_forwards]" />
                  )}
                </div>
              </div>

              {/* Secondary Skeleton Card */}
              <div className="bg-white/60 border border-stone-200/40 rounded-[16px] p-3 shadow-sm mt-3 opacity-60 scale-[0.98]">
                <div className="flex gap-3">
                  <div className="w-[70px] h-[70px] rounded-[10px] bg-stone-100 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-40 grayscale-[50%]" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="w-24 h-3 bg-stone-200 rounded-full" />
                    <div className="w-16 h-2 bg-stone-100 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Success Overlay - High End Glassmorphism */}
            <div
              className={`absolute inset-0 bg-white/70 backdrop-blur-md z-30 flex flex-col items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                step === 8
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20" />
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 relative z-10 scale-animation border-2 border-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-medium text-ink tracking-tight">
                Upit je poslan
              </h3>
              <p className="text-[12px] text-stone-500 mt-2 text-center max-w-[200px] leading-relaxed">
                Pružatelj će vas kontaktirati.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Animated Cursor - MacOS style */}
        <div
          className={`absolute z-50 transition-all duration-[700ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center pointer-events-none ${
            step < 4
              ? "opacity-0 right-[0px] bottom-[0px] scale-50"
              : step === 4
                ? "opacity-100 top-[170px] left-[280px] scale-100" // Hover heart
                : step === 5
                  ? "opacity-100 top-[170px] left-[280px] scale-90" // Click heart
                  : step === 6
                    ? "opacity-100 top-[260px] left-[190px] scale-100" // Hover button
                    : step === 7
                      ? "opacity-100 top-[260px] left-[190px] scale-90" // Click button
                      : "opacity-0 top-[280px] left-[190px] scale-50"
          }`}
        >
          {/* Black sleek cursor */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] -translate-x-[2px] -translate-y-[2px]"
          >
            <path
              d="M5.5 3.5L18.5 10.5L12 12.5L9.5 19.5L5.5 3.5Z"
              fill="#111827"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {(step === 5 || step === 7) && (
            <div className="absolute w-8 h-8 border-2 border-ink/30 rounded-full animate-[ping_0.4s_ease-out_forwards] -top-2 -left-2" />
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        .scale-animation {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,
        }}
      />
    </div>
  );
}
