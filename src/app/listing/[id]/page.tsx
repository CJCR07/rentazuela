import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ListingDetail } from "@/components/listings/listing-detail";
import { FadeIn } from "@/components/animations/fade-in";
import { LegacyListingCard } from "@/components/listings/legacy-listing-card";
import { getListingById, getSimilarListings, incrementViewsCount } from "@/lib/actions/listings";
import type { ListingCategory } from "@/types";

/* ── Metadata ──────────────────────────────────────────────── */

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return {
      title: "No encontrado - Rentazuela",
    };
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return {
    title: `${listing.title} - ${price} | Rentazuela`,
    description: listing.description?.slice(0, 160) || `Encuentra ${listing.title} en ${listing.city}, ${listing.state}. Precio: ${price}`,
  };
}

/* ── Page Component ─────────────────────────────────────────── */

export default async function ListingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // Increment views
  incrementViewsCount(id).catch(console.error);

  // Get similar listings
  const similarListings = await getSimilarListings(id, listing.category, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="mb-6 text-sm text-muted-foreground">
            <span>Inicio</span>
            <span className="mx-2">/</span>
            <span className="capitalize">{listing.category.replace("_", " ")}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{listing.title}</span>
          </nav>
        </FadeIn>

        {/* Main Content */}
        <FadeIn delay={0.1}>
          <ListingDetail listing={listing} />
        </FadeIn>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Anuncios Similares</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarListings.map((similar) => (
                  <LegacyListingCard
                    key={similar.id}
                    id={similar.id}
                    title={similar.title}
                    priceUsd={similar.price}
                    location={`${similar.city}, ${similar.state}`}
                    timeAgo={formatTimeAgo(similar.created_at)}
                    category={similar.category}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
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
