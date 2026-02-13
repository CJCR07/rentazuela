"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Listing, ListingImage } from "@/types";
import { ListingCard } from "./listing-card";

/* ── Types ─────────────────────────────────────────────────── */

interface LoadMoreButtonProps {
  initialListings: Listing[];
  initialImages: Record<string, ListingImage>;
  initialHasMore: boolean;
  loadMoreAction: (offset: number) => Promise<{
    listings: Listing[];
    images: Record<string, ListingImage>;
    hasMore: boolean;
  }>;
  pageSize?: number;
}

/* ── Component ─────────────────────────────────────────────── */

export function LoadMoreButton({
  initialListings,
  initialImages,
  initialHasMore,
  loadMoreAction,
  pageSize = 12,
}: LoadMoreButtonProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [images, setImages] = useState<Record<string, ListingImage>>(initialImages);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await loadMoreAction(listings.length);
      setListings((prev) => [...prev, ...result.listings]);
      setImages((prev) => ({ ...prev, ...result.images }));
      setHasMore(result.hasMore);
    });
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            firstImage={images[listing.id]}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isPending}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Cargar más
                <span className="ml-2 text-muted-foreground">
                  ({listings.length} cargados)
                </span>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
