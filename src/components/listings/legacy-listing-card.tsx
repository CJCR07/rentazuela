"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Heart, MapPin, Calendar, Gauge, Building, Maximize } from "lucide-react";
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

/* ── Helpers ──────────────────────────────────────────────── */

function parseLocation(location: string): { city: string; state: string } {
  const parts = location.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return { city: parts[0], state: parts[1] };
  }
  return { city: location, state: "" };
}

function extractYearFromTitle(title: string): string | null {
  const match = title.match(/\b(20\d{2})\b/);
  return match ? match[1] : null;
}

function extractModelFromTitle(title: string, category: ListingCategory): string {
  // For vehicles, try to extract model from title
  if (category === "vehicle") {
    const parts = title.split(/[—-]/);
    if (parts.length > 1) {
      return parts[1].trim();
    }
    // Or return first word after the brand
    const words = title.split(" ");
    if (words.length >= 2) {
      return words.slice(1, 3).join(" ");
    }
  }
  return "";
}

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
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { city, state } = parseLocation(location);
  const year = extractYearFromTitle(title);
  const model = extractModelFromTitle(title, category);
  const isVehicle = category === "vehicle";
  const isProperty = category === "property_longterm" || category === "property_shortterm";
  const isCommercial = category === "commercial";

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

  // Vehicle layout
  const VehicleInfo = () => (
    <div className="flex flex-1 flex-col justify-between pt-4">
      {/* Row 1: Title | Kilometraje */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 flex-1 text-base font-bold text-foreground transition-colors group-hover:text-brand">
          {title}
        </h3>
        {area && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground shrink-0">
            <Gauge className="h-4 w-4" />
            <span>{area}</span>
          </div>
        )}
      </div>

      {/* Row 2: Ciudad | Modelo */}
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{city}</span>
        </div>
        {model && (
          <span className="shrink-0 font-medium text-muted-foreground truncate max-w-[50%]">
            {model}
          </span>
        )}
      </div>

      {/* Row 3: Estado | Año */}
      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground truncate">{state}</span>
        {year && (
          <div className="flex items-center gap-1.5 shrink-0 font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Property/Commercial layout
  const PropertyInfo = () => (
    <div className="flex flex-1 flex-col justify-between pt-4">
      {/* Row 1: Title | Metros/Area */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 flex-1 text-base font-bold text-foreground transition-colors group-hover:text-brand">
          {title}
        </h3>
        {area && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground shrink-0">
            <Maximize className="h-4 w-4" />
            <span>{area}</span>
          </div>
        )}
      </div>

      {/* Row 2: Ciudad | Tipo */}
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{city}</span>
        </div>
        <span className="shrink-0 font-medium text-muted-foreground truncate max-w-[50%]">
          {isCommercial ? "Local Comercial" : isProperty ? "Propiedad" : ""}
        </span>
      </div>

      {/* Row 3: Estado | Publicado */}
      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground truncate">{state}</span>
        <span className="shrink-0 text-muted-foreground">{timeAgo}</span>
      </div>
    </div>
  );

  const cardContent = (
    <article className="group relative flex h-[380px] w-[320px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
      {/* Image Container */}
      <div className="relative h-[220px] w-full overflow-hidden rounded-xl bg-muted transition-all duration-500 shrink-0">
        {imageUrl && !imgError && (
          <img
            ref={imgRef}
            src={imageUrl}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {(!imgLoaded || !imageUrl || imgError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
            <svg viewBox="0 0 100 100" className="h-16 w-16 text-muted-foreground/30 fill-current">
              <rect x="20" y="25" width="60" height="45" rx="4" />
              <circle cx="35" cy="40" r="8" />
              <path d="M20 60 L40 45 L55 55 L70 40 L80 50 L80 70 L20 70 Z" />
            </svg>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-lg bg-white/95 px-3 py-2 text-sm font-black text-foreground shadow-xl backdrop-blur-sm dark:bg-card/95">
            {formattedUsd}
            {pricePeriod && (
              <span className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                {pricePeriod}
              </span>
            )}
          </div>
          {formattedVes && (
            <div className="mt-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              Bs. {formattedVes}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-brand text-brand")} />
        </button>

        {/* Category Label */}
        <div className={cn("absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-black tracking-wider", config.color)}>
          {config.label}
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute right-3 bottom-3 z-10 rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-black tracking-wider text-white shadow-sm">
            NUEVO
          </div>
        )}
      </div>

      {/* Info Section */}
      {isVehicle ? <VehicleInfo /> : <PropertyInfo />}
    </article>
  );

  if (id) {
    return <Link href={`/listing/${id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
