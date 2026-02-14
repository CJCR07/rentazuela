"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, User, Phone, MessageCircle, Share2, Heart, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingGallery } from "./listing-gallery";
import { cn } from "@/lib/utils";
import type { ListingFull, ListingCategory, ListingDetails } from "@/types";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import { createConversation } from "@/lib/actions/messages";

/* ── Types ─────────────────────────────────────────────────── */

interface ListingDetailProps {
  listing: ListingFull;
}

/* ── Helper: Get nested value safely ───────────────────────── */

function getDetailValue<T>(details: ListingDetails | null | undefined, key: string): T | undefined {
  if (!details || typeof details !== "object") return undefined;
  return (details as Record<string, unknown>)[key] as T | undefined;
}

/* ── Helper: Format Price ──────────────────────────────────── */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ── Helper: Format Time Ago ───────────────────────────────── */

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 24) return `hace ${diffHours} horas`;
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
  return `hace ${Math.floor(diffDays / 30)} meses`;
}

/* ── Helper: Get Price Period ──────────────────────────────── */

function getPricePeriod(category: ListingCategory, details: ListingDetails | null): string | undefined {
  const listingType = getDetailValue<string>(details, "listing_type");
  
  if (category === "property_shortterm") return "/noche";
  if (category === "property_longterm" && listingType === "rent") return "/mes";
  if (category === "vehicle" && listingType === "rent") return "/día";
  if (category === "commercial" && listingType === "rent") return "/mes";
  return undefined;
}

/* ── Config ────────────────────────────────────────────────── */

const CATEGORY_LABELS: Record<ListingCategory, string> = {
  property_longterm: "Propiedad",
  property_shortterm: "Alquiler Vacacional",
  vehicle: "Vehículo",
  commercial: "Local Comercial",
  investment: "Inversión",
};

/* ── Predefined Questions ──────────────────────────────────── */

const PREDEFINED_QUESTIONS = [
  "¿Sigue disponible?",
  "¿El precio es negociable?",
  "¿Acepta pago en VES?",
  "¿Cuáles son las condiciones de pago?",
];

/* ── Component ─────────────────────────────────────────────── */

export function ListingDetail({ listing }: ListingDetailProps) {
  const router = useRouter();
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(listing.id);
  const details = listing.details as ListingDetails | null;
  const pricePeriod = getPricePeriod(listing.category, details);
  const formattedPrice = formatPrice(listing.price);
  const formattedVes = new Intl.NumberFormat("es-VE").format(listing.price * 36.5);
  const location = `${listing.city}, ${listing.state}`;
  const timeAgo = formatTimeAgo(listing.created_at);

  const owner = listing.profiles;
  const images = listing.listing_images;

  const handleCopyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestion(question);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hola, vi tu anuncio "${listing.title}" en Rentazuela y me interesa. ¿Podrías darme más información?`);
    const phone = owner?.phone?.replace(/\D/g, "") || "";
    window.open(`https://wa.me/58${phone}?text=${message}`, "_blank");
  };

  /* ── Get Features based on category ──────────────────────── */

  const getFeatures = () => {
    const features: { label: string; value: string }[] = [];

    if (listing.category === "property_longterm" || listing.category === "property_shortterm") {
      const bedrooms = getDetailValue<number>(details, "bedrooms");
      const bathrooms = getDetailValue<number>(details, "bathrooms");
      const sqm = getDetailValue<number>(details, "square_meters");
      const parking = getDetailValue<number>(details, "parking_spaces");
      const propertyType = getDetailValue<string>(details, "property_type");

      if (propertyType) features.push({ label: "Tipo", value: propertyType.charAt(0).toUpperCase() + propertyType.slice(1) });
      if (bedrooms) features.push({ label: "Habitaciones", value: `${bedrooms}` });
      if (bathrooms) features.push({ label: "Baños", value: `${bathrooms}` });
      if (sqm) features.push({ label: "Área", value: `${sqm} m²` });
      if (parking) features.push({ label: "Estacionamientos", value: `${parking}` });
    }

    if (listing.category === "vehicle") {
      const year = getDetailValue<number>(details, "year");
      const mileage = getDetailValue<number>(details, "mileage");
      const transmission = getDetailValue<string>(details, "transmission");
      const fuelType = getDetailValue<string>(details, "fuel_type");
      const vehicleType = getDetailValue<string>(details, "vehicle_type");

      if (vehicleType) features.push({ label: "Tipo", value: vehicleType.toUpperCase() });
      if (year) features.push({ label: "Año", value: `${year}` });
      if (mileage) features.push({ label: "Kilometraje", value: `${mileage.toLocaleString()} km` });
      if (transmission) features.push({ label: "Transmisión", value: transmission === "automatic" ? "Automática" : "Manual" });
      if (fuelType) features.push({ label: "Combustible", value: fuelType.charAt(0).toUpperCase() + fuelType.slice(1) });
    }

    if (listing.category === "commercial") {
      const sqm = getDetailValue<number>(details, "square_meters");
      const commercialType = getDetailValue<string>(details, "commercial_type");

      if (commercialType) features.push({ label: "Tipo", value: commercialType.charAt(0).toUpperCase() + commercialType.slice(1) });
      if (sqm) features.push({ label: "Área", value: `${sqm} m²` });
    }

    return features;
  };

  const features = getFeatures();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Gallery + Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Gallery */}
        <ListingGallery images={images} title={listing.title} />

        {/* Title + Price (Mobile) */}
        <div className="lg:hidden">
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-brand">{formattedPrice}</span>
            {pricePeriod && <span className="text-muted-foreground">{pricePeriod}</span>}
          </div>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Características</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{feature.label}</span>
                  <span className="font-semibold">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Descripción</h2>
            <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
          </div>
        )}

        {/* Location */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Ubicación</h2>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-brand mt-0.5" />
            <div>
              <p className="font-semibold">{listing.city}</p>
              <p className="text-muted-foreground">{listing.state}, Venezuela</p>
              {listing.address && (
                <p className="text-sm text-muted-foreground mt-1">{listing.address}</p>
              )}
            </div>
          </div>
          {/* Placeholder for map */}
          <div className="mt-4 h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Mapa no disponible</p>
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* Price Card (Desktop) */}
          <div className="hidden lg:block bg-card border rounded-xl p-6">
            <h1 className="text-xl font-bold mb-2 line-clamp-2">{listing.title}</h1>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-brand">{formattedPrice}</span>
              {pricePeriod && <span className="text-muted-foreground">{pricePeriod}</span>}
            </div>
            <p className="text-lg font-semibold text-muted-foreground mb-2">Bs. {formattedVes}</p>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {owner?.avatar_url ? (
                  <img src={owner.avatar_url} alt={owner.full_name || ""} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold">{owner?.full_name || "Usuario"}</p>
                {owner?.is_verified && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verificado
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  const result = await createConversation(listing.id);
                  if (result.success && result.conversationId) {
                    router.push(`/mensajes?conversation=${result.conversationId}`);
                  } else {
                    toast.error(result.error || "Error al iniciar conversación");
                  }
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar mensaje
              </Button>
              
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toggleFavorite(listing.id);
                  toast(isFav ? "Eliminado de favoritos" : "Añadido a favoritos");
                }}
              >
                <Heart className={cn("mr-2 h-4 w-4", isFav && "fill-brand text-brand")} />
                {isFav ? "Guardado" : "Guardar"}
              </Button>

              <Button variant="ghost" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>

            {/* Posted time */}
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Publicado {timeAgo}
            </div>
          </div>

          {/* Quick Questions */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-3">¿Tienes preguntas?</h3>
            <div className="space-y-2">
              {PREDEFINED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleCopyQuestion(question)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    copiedQuestion === question
                      ? "bg-brand text-white"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {copiedQuestion === question ? "¡Copiado!" : question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
