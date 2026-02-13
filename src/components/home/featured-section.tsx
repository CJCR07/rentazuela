"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  href: string;
  children: React.ReactNode;
}

export function FeaturedSection({ title, subtitle, href, children }: FeaturedSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`py-10 lg:py-14 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between border-b border-muted pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
            <div className="h-1 w-12 bg-brand mt-2" />
          </div>
          <div className="flex items-center gap-4">
            {/* Scroll arrows — desktop only */}
            <div className="hidden gap-2 sm:flex">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-muted bg-transparent transition-all hover:bg-brand hover:text-white hover:border-brand"
                onClick={() => scroll("left")}
                aria-label="Scroll izquierda"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-muted bg-transparent transition-all hover:bg-brand hover:text-white hover:border-brand"
                onClick={() => scroll("right")}
                aria-label="Scroll derecha"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" asChild className="font-bold text-brand hover:bg-brand/5 hover:text-brand">
              <Link href={href} className="flex items-center gap-1.5">
                Ver todo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
