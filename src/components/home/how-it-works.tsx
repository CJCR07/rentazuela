"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MessageCircle, Smile } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Busca",
    description:
      "Explora propiedades, vehículos y locales en las mejores zonas de Venezuela con filtros inteligentes.",
  },
  {
    icon: MessageCircle,
    title: "Contacta",
    description:
      "Comunícate directamente con propietarios verificados. Sin intermediarios, sin comisiones ocultas.",
  },
  {
    icon: Smile,
    title: "Disfruta",
    description:
      "Firma, múdate y empieza a disfrutar. Rentazuela te acompaña en todo el proceso.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-muted/30 py-20 lg:py-28"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className={`mb-4 inline-flex items-center rounded-full bg-brand/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand ${
              isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          >
            Simple y Rápido
          </span>
          <h2
            className={`mt-4 text-4xl font-black tracking-tighter sm:text-5xl ${
              isVisible ? "animate-slide-up stagger-1" : "opacity-0"
            }`}
          >
            ¿Cómo funciona?
          </h2>
          <p
            className={`mx-auto mt-4 max-w-xl text-lg text-muted-foreground ${
              isVisible ? "animate-slide-up stagger-2" : "opacity-0"
            }`}
          >
            En solo tres pasos puedes encontrar tu próximo hogar, vehículo o
            local comercial.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
          {/* Connector line — desktop only */}
          <div className="absolute left-[16.67%] right-[16.67%] top-16 hidden h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent md:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`group relative flex flex-col items-center text-center ${
                  isVisible
                    ? `animate-slide-up stagger-${i + 2}`
                    : "opacity-0"
                }`}
              >
                {/* Step number */}
                <div className="absolute -top-2 right-1/2 translate-x-8 text-[80px] font-black leading-none text-brand/5 select-none md:translate-x-12">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-brand/5 ring-1 ring-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-brand/10 dark:bg-card">
                  <Icon className="h-8 w-8 text-brand transition-colors" />
                </div>

                {/* Text */}
                <h3 className="mb-3 text-xl font-black tracking-tight">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
