"use client";

import { Home, MapPin, Users, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { FadeIn } from "@/components/animations/fade-in";

const STATS = [
  { icon: Home, value: 500, suffix: "+", label: "Propiedades Publicadas", delay: 0 },
  { icon: MapPin, value: 24, suffix: "", label: "Estados Cubiertos", delay: 0.1 },
  { icon: Users, value: 1000, suffix: "+", label: "Usuarios Registrados", delay: 0.2 },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Satisfacción", delay: 0.3 },
];

export function StatsBar() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 sm:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <FadeIn
              key={stat.label}
              delay={stat.delay}
              direction="up"
              className="group flex flex-col items-center gap-3"
            >
              <Icon className="h-5 w-5 text-muted-foreground/60 transition-all duration-300 group-hover:text-brand group-hover:scale-110" />
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-extrabold tracking-tight text-brand sm:text-4xl font-[family-name:var(--font-heading)]"
              />
              <span className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
                {stat.label}
              </span>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
