"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, MapPin, Eye, Edit, Trash2 } from "lucide-react";
import { deleteListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import type { Listing, ListingImage } from "@/types";

export default function MisAnunciosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [images, setImages] = useState<Record<string, ListingImage>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/mis-anuncios");
        return;
      }

      const { data: listingsData } = await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (listingsData && listingsData.length > 0) {
        setListings(listingsData as Listing[]);

        const listingIds = listingsData.map((l) => l.id);
        const { data: imagesData } = await supabase
          .from("listing_images")
          .select("*")
          .in("listing_id", listingIds)
          .order("position", { ascending: true });

        const imagesMap: Record<string, ListingImage> = {};
        if (imagesData) {
          for (const img of imagesData) {
            if (!imagesMap[img.listing_id]) {
              imagesMap[img.listing_id] = img;
            }
          }
        }
        setImages(imagesMap);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleDelete = async (listingId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este anuncio?")) {
      return;
    }

    setDeleting(listingId);
    const result = await deleteListing(listingId);

    if (result.success) {
      toast.success("Anuncio eliminado");
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } else {
      toast.error(result.error || "Error al eliminar");
    }

    setDeleting(null);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      property_longterm: "Propiedad",
      property_shortterm: "Propiedad Vacacional",
      vehicle: "Vehículo",
      commercial: "Local Comercial",
      investment: "Inversión",
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Anuncios</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus publicaciones
            </p>
          </div>
          <Button asChild className="bg-brand hover:bg-brand/90">
            <Link href="/publicar">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo anuncio
            </Link>
          </Button>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-center py-16 border rounded-2xl bg-muted/30">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tienes anuncios</h3>
            <p className="text-muted-foreground mb-6">
              Comienza publicando tu primer anuncio
            </p>
            <Button asChild className="bg-brand hover:bg-brand/90">
              <Link href="/publicar">
                <Plus className="mr-2 h-4 w-4" />
                Publicar anuncio
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {images[listing.id] ? (
                      <img
                        src={images[listing.id].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Sin foto
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-medium rounded">
                            {getCategoryLabel(listing.category)}
                          </span>
                          {!listing.is_active && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                              Inactivo
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold line-clamp-1">
                          {listing.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {formatPrice(listing.price, listing.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">
                        {listing.city}, {listing.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views_count ?? 0} vistas
                      </span>
                      <span>
                        Publicado {new Date(listing.created_at).toLocaleDateString("es-VE")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/listing/${listing.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/publicar?edit=${listing.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deleting === listing.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deleting === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
