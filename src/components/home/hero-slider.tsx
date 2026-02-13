"use client";

import { useState, useCallback } from "react";
import { AdvancedSearch, CategoryId } from "@/components/search/advanced-search";

const SLIDES = [
  {
    id: "properties",
    title: "Encuentra tu próximo hogar",
    subtitle: "Apartamentos, casas y penthouses en las mejores zonas de Venezuela",
    accent: "Propiedades",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "vehicles",
    title: "Alquila el carro ideal",
    subtitle: "SUVs, sedanes y pickups — listos para tu próxima aventura",
    accent: "Vehículos",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "commercial",
    title: "Tu local comercial perfecto",
    subtitle: "Oficinas, galpones y espacios coworking — impulsa tu negocio",
    accent: "Comercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle category change from Search - manual only
  const handleCategoryChange = useCallback((category: CategoryId) => {
    const slideIndex = SLIDES.findIndex((s) => s.id === category);
    if (slideIndex !== -1 && slideIndex !== current) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(slideIndex);
        setIsTransitioning(false);
      }, 300);
    }
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[720px] w-full overflow-hidden bg-white dark:bg-background lg:h-[780px]">
      {/* ── Background Images with Crossfade ── */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current && !isTransitioning ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover"
            style={{
              opacity: 0.4,
              filter: "saturate(1.1)",
            }}
          />
        </div>
      ))}

      {/* ── Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white dark:from-background/60 dark:via-background/20 dark:to-background" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div key={current} className="fade-in flex flex-col items-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-brand/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand backdrop-blur-sm">
            {slide.accent}
          </span>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
            {slide.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground sm:text-xl">
            {slide.subtitle}
          </p>

          {/* ── Advanced Search ── */}
          <div className="mt-10 w-full max-w-5xl">
            <AdvancedSearch 
              onCategoryChange={handleCategoryChange}
              defaultCategory={SLIDES[current].id as CategoryId}
            />
          </div>

          {/* ── CTA Buttons ── */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/auth?tab=register"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand/25 transition-all hover:scale-105 active:scale-95"
            >
              Publicar Gratis
            </a>
            <a
              href="/propiedades"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/80 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md active:scale-95 dark:bg-card/80"
            >
              Explorar Todo
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
