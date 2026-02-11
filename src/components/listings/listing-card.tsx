"use client";

import { Heart, MapPin, Clock, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ListingCategory =
  | "property_longterm"
  | "property_shortterm"
  | "vehicle"
  | "commercial"
  | "investment";

interface ListingCardProps {
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
  pricePeriod?: string; // "/ mes", "/ noche", etc.
}

const CATEGORY_CONFIG: Record<ListingCategory, { label: string; color: string }> = {
  property_longterm: { label: "Venta", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  property_shortterm: { label: "Alquiler", color: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
  vehicle: { label: "Vehículo", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  commercial: { label: "Comercial", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
  investment: { label: "Inversión", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
};

/* Placeholder gradient backgrounds by category */
const PLACEHOLDER_BG: Record<ListingCategory, string> = {
  property_longterm: "bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-900 dark:to-teal-800",
  property_shortterm: "bg-gradient-to-br from-sky-200 to-cyan-300 dark:from-sky-900 dark:to-cyan-800",
  vehicle: "bg-gradient-to-br from-amber-200 to-orange-300 dark:from-amber-900 dark:to-orange-800",
  commercial: "bg-gradient-to-br from-violet-200 to-purple-300 dark:from-violet-900 dark:to-purple-800",
  investment: "bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-900 dark:to-pink-800",
};

export function ListingCard({
  title,
  priceUsd,
  priceVes,
  location,
  timeAgo,
  area,
  category,
  isFavorite = false,
  pricePeriod,
}: ListingCardProps) {
  const config = CATEGORY_CONFIG[category];

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

  return (
    <article className="card-hover group relative w-[280px] shrink-0 overflow-hidden rounded-xl border bg-card shadow-sm sm:w-[300px]">
      {/* ── Image / Placeholder ── */}
      <div className={`relative aspect-[4/3] overflow-hidden ${PLACEHOLDER_BG[category]}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white/20 blur-xl" />
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-base font-bold text-white">
              {formattedUsd}
            </span>
            {pricePeriod && (
              <span className="text-xs text-white/70">{pricePeriod}</span>
            )}
            {formattedVes && (
              <span className="ml-1.5 text-xs text-white/60">
                / Bs {formattedVes}
              </span>
            )}
          </div>
        </div>

        {/* Favorite button */}
        <button
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Agregar a favoritos"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Category badge */}
        <Badge
          className={`absolute left-3 top-3 z-10 border-0 text-[11px] font-medium ${config.color}`}
        >
          {config.label}
        </Badge>
      </div>

      {/* ── Content ── */}
      <div className="p-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
          {area && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              {area}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
