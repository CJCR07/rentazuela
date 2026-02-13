"use client";

import { MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UsePublishFormReturn } from "../use-publish-form";
import type { PropertyDetails, VehicleDetails, CommercialDetails } from "@/types";

/* ── Props ──────────────────────────────────────────────────── */

interface PreviewStepProps {
  form: UsePublishFormReturn;
}

/* ── Component ──────────────────────────────────────────────── */

export function PreviewStep({ form }: PreviewStepProps) {
  const { data } = form;
  const details = data.details || {};

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = () => {
    switch (data.category) {
      case "property_longterm":
        return data.listingType === "rent" ? "Alquiler" : "Venta";
      case "property_shortterm":
        return "Alquiler Vacacional";
      case "vehicle":
        return data.listingType === "rent" ? "Alquiler de Vehículo" : "Venta de Vehículo";
      case "commercial":
        return data.listingType === "rent" ? "Alquiler de Local" : "Venta de Local";
      case "investment":
        return "Inversión";
      default:
        return "";
    }
  };

  const getPricePeriod = () => {
    if (data.category === "property_shortterm") return "/noche";
    if (data.category === "property_longterm" && data.listingType === "rent") return "/mes";
    if (data.category === "vehicle" && data.listingType === "rent") return "/día";
    if (data.category === "commercial" && data.listingType === "rent") return "/mes";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <h3 className="font-semibold mb-1">Vista previa de tu anuncio</h3>
        <p className="text-sm text-muted-foreground">
          Así se verá tu anuncio antes de publicarlo
        </p>
      </div>

      {/* Preview Card */}
      <div className="border rounded-2xl overflow-hidden bg-card">
        {/* Images Preview */}
        {data.images.length > 0 ? (
          <div className="grid grid-cols-4 gap-1 h-64">
            <div className="col-span-2 row-span-2">
              <img
                src={URL.createObjectURL(data.images[0])}
                alt="Principal"
                className="w-full h-full object-cover"
              />
            </div>
            {data.images.slice(1, 5).map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Imagen ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {index === 3 && data.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold">
                      +{data.images.length - 5} más
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Sin imágenes</p>
          </div>
        )}

        {/* Content Preview */}
        <div className="p-4 space-y-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-brand text-white text-xs font-bold rounded">
              {getCategoryLabel()}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xl font-bold line-clamp-2">
            {data.title || "Sin título"}
          </h4>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand">
              {formatPrice(data.price, data.currency)}
            </span>
            <span className="text-muted-foreground">{getPricePeriod()}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {data.city && data.state
                ? `${data.city}, ${data.state}`
                : "Sin ubicación"}
            </span>
          </div>

          {/* Details */}
          {Object.keys(details).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {data.category === "property_longterm" ||
              data.category === "property_shortterm" ? (
                <>
                  {(details as PropertyDetails).property_type && (
                    <Badge>
                      {(details as PropertyDetails).property_type!.charAt(0).toUpperCase() +
                        (details as PropertyDetails).property_type!.slice(1)}
                    </Badge>
                  )}
                  {(details as PropertyDetails).bedrooms && (
                    <Badge>{(details as PropertyDetails).bedrooms} hab.</Badge>
                  )}
                  {(details as PropertyDetails).bathrooms && (
                    <Badge>{(details as PropertyDetails).bathrooms} baños</Badge>
                  )}
                  {(details as PropertyDetails).square_meters && (
                    <Badge>{(details as PropertyDetails).square_meters} m²</Badge>
                  )}
                </>
              ) : data.category === "vehicle" ? (
                <>
                  {(details as VehicleDetails).vehicle_type && (
                    <Badge>
                      {(details as VehicleDetails).vehicle_type?.toUpperCase()}
                    </Badge>
                  )}
                  {(details as VehicleDetails).year && (
                    <Badge>{(details as VehicleDetails).year}</Badge>
                  )}
                  {(details as VehicleDetails).mileage !== undefined && (
                    <Badge>
                      {(details as VehicleDetails).mileage?.toLocaleString()} km
                    </Badge>
                  )}
                </>
              ) : data.category === "commercial" ? (
                <>
                  {(details as CommercialDetails).commercial_type && (
                    <Badge>
                      {(details as CommercialDetails).commercial_type!.charAt(0).toUpperCase() +
                        (details as CommercialDetails).commercial_type!.slice(1)}
                    </Badge>
                  )}
                  {(details as CommercialDetails).square_meters && (
                    <Badge>{(details as CommercialDetails).square_meters} m²</Badge>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <h4 className="font-semibold">✅ Verificación final</h4>
        <div className="space-y-2">
          <CheckItem done={!!data.title}>Título completo</CheckItem>
          <CheckItem done={!!data.description}>Descripción agregada</CheckItem>
          <CheckItem done={!!data.price}>Precio establecido</CheckItem>
          <CheckItem done={!!data.city && !!data.state}>Ubicación definida</CheckItem>
          <CheckItem done={data.images.length > 0}>Imágenes agregadas</CheckItem>
          <CheckItem done={!!data.details && Object.keys(data.details).length > 0}>
            Características completadas
          </CheckItem>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 bg-muted text-xs font-medium rounded">
      {children}
    </span>
  );
}

function CheckItem({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", done ? "text-foreground" : "text-muted-foreground")}>
      <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs",
        done ? "bg-emerald-500 text-white" : "bg-muted"
      )}>
        {done ? "✓" : "○"}
      </span>
      {children}
    </div>
  );
}
