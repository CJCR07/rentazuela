"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Listing, ListingCategory, ListingImage, ListingDetails } from "@/types";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";

/* ── Types ─────────────────────────────────────────────────── */

interface ListingCardProps {
  listing: Listing;
  firstImage?: ListingImage | null;
}

/* ── Config ────────────────────────────────────────────────── */

const CATEGORY_CONFIG: Record<ListingCategory, { label: string; color: string }> = {
  property_longterm: { label: "VENTA", color: "bg-black text-white" },
  property_shortterm: { label: "ALQUILER", color: "bg-brand text-white" },
  vehicle: { label: "VEHÍCULO", color: "bg-muted text-foreground" },
  commercial: { label: "COMERCIAL", color: "bg-muted text-foreground" },
  investment: { label: "INVERSIÓN", color: "bg-brand text-white" },
};

/* ── Helper: Get nested value safely ───────────────────────── */

function getDetailValue<T>(details: ListingDetails | null | undefined, key: string): T | undefined {
  if (!details || typeof details !== "object") return undefined;
  return (details as Record<string, unknown>)[key] as T | undefined;
}

/* ── Helper: Format Time Ago ───────────────────────────────── */

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours} horas`;
  if (diffDays < 7) return `${diffDays} días`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem`;
  return `${Math.floor(diffDays / 30)} meses`;
}

/* ── Helper: Is New (within 24 hours) ──────────────────────── */

function isNewListing(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / 3600000;
  return diffHours < 24;
}

/* ── Helper: Get Price Period ──────────────────────────────── */

function getPricePeriod(category: ListingCategory, details: ListingDetails | null): string | undefined {
  const listingType = getDetailValue<string>(details, "listing_type");
  
  if (category === "property_shortterm") return " / noche";
  if (category === "property_longterm" && listingType === "rent") return " / mes";
  if (category === "vehicle" && listingType === "rent") return " / día";
  if (category === "commercial" && listingType === "rent") return " / mes";
  return undefined;
}

/* ── Helper: Get Area ──────────────────────────────────────── */

function getArea(details: ListingDetails | null, category: ListingCategory): string | undefined {
  const squareMeters = getDetailValue<number>(details, "square_meters");
  const mileage = getDetailValue<number>(details, "mileage");
  
  if (category === "property_longterm" || category === "property_shortterm") {
    return squareMeters ? `${squareMeters} M²` : undefined;
  }
  if (category === "vehicle") {
    return mileage ? `${mileage.toLocaleString()} KM` : undefined;
  }
  if (category === "commercial") {
    return squareMeters ? `${squareMeters} M²` : undefined;
  }
  return undefined;
}

/* ── Component ─────────────────────────────────────────────── */

export function ListingCard({ 
  listing, 
  firstImage,
}: ListingCardProps) {
  const config = CATEGORY_CONFIG[listing.category];
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(listing.id);
  const details = listing.details as ListingDetails | null;

  const formattedUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  const formattedVes = listing.price
    ? new Intl.NumberFormat("es-VE", {
        maximumFractionDigits: 0,
      }).format(listing.price * 36.5)
    : null;

  const imageUrl = firstImage?.url;
  const isNew = isNewListing(listing.created_at);
  const timeAgo = formatTimeAgo(listing.created_at);
  const pricePeriod = getPricePeriod(listing.category, details);
  const area = getArea(details, listing.category);
  const location = `${listing.city}, ${listing.state}`;

  return (
    <Link href={`/listing/${listing.id}`}>
      <article 
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted transition-all duration-500">
          {imageUrl && (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              )}
              <img
                src={imageUrl}
                alt={listing.title}
                onLoad={() => setImgLoaded(true)}
                className={cn(
                  "h-full w-full object-cover transition-all duration-700",
                  imgLoaded ? "opacity-100" : "opacity-0",
                  isHovered && "scale-105"
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
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(listing.id);
              toast(isFav ? "Eliminado de favoritos" : "Añadido a favoritos");
            }}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-brand text-brand")} />
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
            {listing.title}
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
    </Link>
  );
}

/* ── Legacy Export for Backward Compatibility ──────────────── */

export type { ListingCardProps };
