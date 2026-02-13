"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "María Fernández",
    location: "Caracas, D.C.",
    role: "Inquilina",
    avatar: "MF",
    quote:
      "Encontré mi apartamento ideal en Altamira en menos de una semana. La plataforma es super fácil de usar y los filtros me ahorraron horas de búsqueda.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    location: "Valencia, Carabobo",
    role: "Propietario",
    avatar: "CR",
    quote:
      "Publiqué mi casa en venta y en tres días ya tenía visitas agendadas. Rentazuela se siente muy profesional y segura.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    location: "Maracaibo, Zulia",
    role: "Inversora",
    avatar: "AM",
    quote:
      "Gracias a la sección de inversiones pude conectar con proyectos verificados. Es la herramienta que faltaba en Venezuela para invertir con confianza.",
    rating: 5,
  },
];

export function Testimonials() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-20 dark:bg-background lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className={`mb-4 inline-flex items-center rounded-full bg-brand/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand ${
              isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          >
            Testimonios
          </span>
          <h2
            className={`mt-4 text-4xl font-black tracking-tighter sm:text-5xl ${
              isVisible ? "animate-slide-up stagger-1" : "opacity-0"
            }`}
          >
            Lo que dicen nuestros usuarios
          </h2>
          <p
            className={`mx-auto mt-4 max-w-xl text-lg text-muted-foreground ${
              isVisible ? "animate-slide-up stagger-2" : "opacity-0"
            }`}
          >
            Miles de venezolanos ya confían en Rentazuela para sus decisiones
            inmobiliarias.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-white p-8 transition-all duration-500 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 dark:bg-card ${
                isVisible
                  ? `animate-slide-up stagger-${i + 2}`
                  : "opacity-0"
              }`}
            >
              {/* Quote icon */}
              <Quote className="mb-6 h-8 w-8 text-brand/15" />

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-sm font-black text-brand">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
