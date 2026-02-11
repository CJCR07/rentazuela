"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";

const SLIDES = [
  {
    title: "Tu próximo hogar en Caracas",
    subtitle: "Apartamentos, casas y penthouses en las mejores zonas de la capital",
    gradient: "from-emerald-900/80 via-emerald-800/60 to-teal-900/80",
    bgColor: "bg-gradient-to-br from-emerald-700 to-teal-800",
    accent: "Caracas",
  },
  {
    title: "Vacaciones en Margarita",
    subtitle: "Alquiler vacacional frente al mar — casas, apartamentos y villas",
    gradient: "from-sky-900/80 via-blue-800/60 to-cyan-900/80",
    bgColor: "bg-gradient-to-br from-sky-600 to-cyan-700",
    accent: "Isla de Margarita",
  },
  {
    title: "Vehículos en todo el país",
    subtitle: "Compra, vende o alquila — SUVs, sedanes, pickups y más",
    gradient: "from-amber-900/80 via-orange-800/60 to-red-900/80",
    bgColor: "bg-gradient-to-br from-amber-600 to-orange-700",
    accent: "Venezuela",
  },
  {
    title: "Inversiones inmobiliarias",
    subtitle: "Proyectos de constructoras verificadas con retorno garantizado",
    gradient: "from-violet-900/80 via-purple-800/60 to-indigo-900/80",
    bgColor: "bg-gradient-to-br from-violet-700 to-indigo-800",
    accent: "Oportunidades",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  /* Auto-advance */
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden">
      {/* ── Background ── */}
      <div className={`relative h-[540px] sm:h-[580px] lg:h-[620px] ${slide.bgColor} transition-all duration-700`}>
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-white/3 blur-2xl" />
        </div>

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`} />

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <div
            key={current}
            className="fade-in flex flex-col items-center"
          >
            <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
              📍 {slide.accent}
            </span>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl font-[family-name:var(--font-heading)]">
              {slide.title}
            </h1>

            <p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg">
              {slide.subtitle}
            </p>
          </div>

          {/* ── Search Bar ── */}
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* ── Arrows ── */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* ── Dots ── */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
