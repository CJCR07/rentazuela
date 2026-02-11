"use client";

import { useEffect, useRef, useState } from "react";
import { Home, MapPin, Users } from "lucide-react";

const STATS = [
  { icon: Home, value: 500, suffix: "+", label: "Propiedades Publicadas" },
  { icon: MapPin, value: 24, suffix: "", label: "Estados Cubiertos" },
  { icon: Users, value: 1000, suffix: "+", label: "Usuarios Registrados" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-3xl font-extrabold tracking-tight text-brand sm:text-4xl font-[family-name:var(--font-heading)]">
      {count.toLocaleString("es-VE")}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="h-6 w-6 text-brand" />
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
