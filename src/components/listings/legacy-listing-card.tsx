"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { ListingCategory } from "@/types";
import { cn } from "@/lib/utils";

/* ── Legacy Types (for demo data in homepage) ──────────────── */

interface LegacyListingCardProps {
  id?: string;
  title: string;
  priceUsd: number;
  priceVes?: number;
  location: string;
  timeAgo: string;
  area?: string;
  imageUrl?: string;
  category: ListingCategory;
  isFavorite?: boolean;
  pricePeriod?: string;
  isNew?: boolean;
}

/* ── Config ────────────────────────────────────────────────── */

const CATEGORY_CONFIG: Record<ListingCategory, { label: string; color: string }> = {
  property_longterm: { label: "VENTA", color: "bg-black text-white" },
  property_shortterm: { label: "ALQUILER", color: "bg-brand text-white" },
  vehicle: { label: "VEHÍCULO", color: "bg-muted text-foreground" },
  commercial: { label: "COMERCIAL", color: "bg-muted text-foreground" },
  investment: { label: "INVERSIÓN", color: "bg-brand text-white" },
};

/* ── Component ─────────────────────────────────────────────── */

export function LegacyListingCard({
  id,
  title,
  priceUsd,
  priceVes,
  location,
  timeAgo,
  area,
  imageUrl,
  category,
  isFavorite = false,
  pricePeriod,
  isNew = false,
}: LegacyListingCardProps) {
  const config = CATEGORY_CONFIG[category];
  const [imgLoaded, setImgLoaded] = useState(false);

  const formattedUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceUsd);

  const formattedVes = priceVes
    ? new Intl.NumberFormat("es-VE", {
        maximumFractionDigits: 0,
      }).format(priceVes)
    : null;

  const cardContent = (
    <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted transition-all duration-500">
        {imageUrl && (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            )}
            <img
              src={imageUrl}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </>
        )}

        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg viewBox="0 0 100 100" className="h-20 w-20 text-foreground fill-current">
              <rect x="25" y="25" width="50" height="50" rx="4" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-lg bg-white/95 px-3 py-2 font-black text-foreground shadow-xl backdrop-blur-sm dark:bg-card/95">
            {formattedUsd}
            {pricePeriod && (
              <span className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                {pricePeriod}
              </span>
            )}
          </div>
          {formattedVes && (
            <div className="mt-1 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              Bs. {formattedVes}
            </div>
          )}
        </div>

        <button
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-brand text-brand")} />
        </button>

        <div className={cn("absolute left-3 top-3 z-10 rounded-md px-2 py-1 text-[9px] font-black tracking-widest", config.color)}>
          {config.label}
        </div>

        {isNew && (
          <div className="absolute right-3 bottom-3 z-10 rounded-md bg-emerald-500 px-2 py-1 text-[9px] font-black tracking-widest text-white shadow-sm">
            NUEVO
          </div>
        )}
      </div>

      <div className="pt-4">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
          {title}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </div>
          <div className="rounded bg-muted px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {area || timeAgo}
          </div>
        </div>
      </div>
    </article>
  );

  if (id) {
    return <Link href={`/listing/${id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
