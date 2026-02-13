"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UsePublishFormReturn } from "../use-publish-form";
import type { PropertyDetails, VehicleDetails, CommercialDetails } from "@/types";

/* ── Props ──────────────────────────────────────────────────── */

interface DetailsStepProps {
  form: UsePublishFormReturn;
}

/* ── Constants ──────────────────────────────────────────────── */

const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartamento" },
  { id: "house", label: "Casa" },
  { id: "townhouse", label: "Townhouse" },
  { id: "penthouse", label: "Penthouse" },
  { id: "land", label: "Terreno" },
];

const VEHICLE_TYPES = [
  { id: "sedan", label: "Sedán" },
  { id: "suv", label: "SUV" },
  { id: "truck", label: "Pickup" },
  { id: "luxury", label: "Lujo" },
  { id: "economy", label: "Económico" },
];

const COMMERCIAL_TYPES = [
  { id: "office", label: "Oficina" },
  { id: "retail", label: "Local Comercial" },
  { id: "warehouse", label: "Galpón/Bodega" },
  { id: "coworking", label: "Coworking" },
  { id: "restaurant", label: "Restaurante" },
];

/* ── Component ──────────────────────────────────────────────── */

export function DetailsStep({ form }: DetailsStepProps) {
  const { data, updateData, setDetails, errors } = form;

  const details = (data.details || {}) as Record<string, unknown>;

  const updateDetails = (key: string, value: unknown) => {
    setDetails({ ...details, [key]: value } as PropertyDetails | VehicleDetails | CommercialDetails);
  };

  // Render property details
  if (data.category === "property_longterm" || data.category === "property_shortterm") {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Características de la Propiedad</h3>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>
            Tipo de propiedad <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(details.property_type as string) || ""}
            onValueChange={(value) => updateDetails("property_type", value)}
          >
            <SelectTrigger className={errors.property_type ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.property_type && (
            <p className="text-xs text-destructive">{errors.property_type}</p>
          )}
        </div>

        {/* Beds, Baths, Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Habitaciones</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={(details.bedrooms as number) || ""}
              onChange={(e) => updateDetails("bedrooms", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Baños</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={(details.bathrooms as number) || ""}
              onChange={(e) => updateDetails("bathrooms", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Área (m²)</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={(details.square_meters as number) || ""}
              onChange={(e) => updateDetails("square_meters", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Parking */}
        <div className="space-y-2">
          <Label>Estacionamientos</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={(details.parking_spaces as number) || ""}
            onChange={(e) => updateDetails("parking_spaces", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    );
  }

  // Render vehicle details
  if (data.category === "vehicle") {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Características del Vehículo</h3>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label>
            Tipo de vehículo <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(details.vehicle_type as string) || ""}
            onValueChange={(value) => updateDetails("vehicle_type", value)}
          >
            <SelectTrigger className={errors.vehicle_type ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicle_type && (
            <p className="text-xs text-destructive">{errors.vehicle_type}</p>
          )}
        </div>

        {/* Year, Mileage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              placeholder="2024"
              value={(details.year as number) || ""}
              onChange={(e) => updateDetails("year", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Kilometraje</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={(details.mileage as number) || ""}
              onChange={(e) => updateDetails("mileage", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Transmission, Fuel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Transmisión</Label>
            <Select
              value={(details.transmission as string) || ""}
              onValueChange={(value) => updateDetails("transmission", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automática</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Combustible</Label>
            <Select
              value={(details.fuel_type as string) || ""}
              onValueChange={(value) => updateDetails("fuel_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasolina</SelectItem>
                <SelectItem value="diesel">Diésel</SelectItem>
                <SelectItem value="electric">Eléctrico</SelectItem>
                <SelectItem value="hybrid">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // Render commercial details
  if (data.category === "commercial") {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Características del Local</h3>

        {/* Commercial Type */}
        <div className="space-y-2">
          <Label>
            Tipo de local <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(details.commercial_type as string) || ""}
            onValueChange={(value) => updateDetails("commercial_type", value)}
          >
            <SelectTrigger className={errors.commercial_type ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              {COMMERCIAL_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.commercial_type && (
            <p className="text-xs text-destructive">{errors.commercial_type}</p>
          )}
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label>Área (m²)</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={(details.square_meters as number) || ""}
            onChange={(e) => updateDetails("square_meters", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    );
  }

  // Investment doesn't need specific details
  if (data.category === "investment") {
    return (
      <div className="space-y-6">
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Inversión</h3>
          <p className="text-muted-foreground">
            Las oportunidades de inversión se configuran en el siguiente paso.
            Asegúrate de incluir todos los detalles relevantes en la descripción.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
