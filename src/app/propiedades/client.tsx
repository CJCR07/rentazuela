"use client";

import { useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { LoadMoreButton } from "@/components/listings/load-more-button";
import { getListingsWithImages } from "@/lib/actions/listings";
import { cn } from "@/lib/utils";
import type { Listing, ListingImage, ListingCategory } from "@/types";

/* ── Types ─────────────────────────────────────────────────── */

type SubCategory = "all" | "property_longterm" | "property_shortterm";

interface PropiedadesClientProps {
  initialData: {
    listings: Listing[];
    images: Record<string, ListingImage>;
    total: number;
    hasMore: boolean;
  };
}

/* ── Config ────────────────────────────────────────────────── */

const SUBCATEGORIES = [
  { id: "all" as SubCategory, label: "Todas" },
  { id: "property_longterm" as SubCategory, label: "Venta y Alquiler" },
  { id: "property_shortterm" as SubCategory, label: "Alquiler Vacacional" },
];

/* ── Component ─────────────────────────────────────────────── */

export function PropiedadesClient({ initialData }: PropiedadesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory>("all");
  const [listings, setListings] = useState(initialData.listings);
  const [images, setImages] = useState(initialData.images);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isLoading, setIsLoading] = useState(false);

  const filteredListings = listings.filter((listing) => {
    if (activeSubcategory === "all") return true;
    return listing.category === activeSubcategory;
  });

  const handleSubcategoryChange = async (sub: SubCategory) => {
    setActiveSubcategory(sub);
    setIsLoading(true);
    
    const category = sub === "all" ? undefined : sub as ListingCategory;
    const result = await getListingsWithImages({
      category,
      limit: 12,
    });
    
    setListings(result.listings);
    setImages(result.images);
    setHasMore(result.hasMore);
    setIsLoading(false);
  };

  const loadMoreAction = async (offset: number) => {
    const category = activeSubcategory === "all" ? undefined : activeSubcategory as ListingCategory;
    const result = await getListingsWithImages({
      category,
      offset,
      limit: 12,
    });
    
    return {
      listings: result.listings,
      images: result.images,
      hasMore: result.hasMore,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search */}
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <h1 className="text-3xl font-bold mb-2">Propiedades en Venta y Alquiler</h1>
            <p className="text-muted-foreground mb-6">
              Encuentra tu próximo hogar en las mejores zonas de Venezuela
            </p>
            
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ubicación, tipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Subcategory Tabs */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-6">
            {SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcategoryChange(sub.id)}
                disabled={isLoading}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50",
                  activeSubcategory === sub.id
                    ? "bg-brand text-white shadow-lg shadow-brand/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.15}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <strong className="text-foreground">{filteredListings.length}</strong> propiedades encontradas
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Todo Venezuela</span>
            </div>
          </div>
        </FadeIn>

        <LoadMoreButton
          initialListings={filteredListings}
          initialImages={images}
          initialHasMore={hasMore}
          loadMoreAction={loadMoreAction}
        />
      </div>
    </div>
  );
}
