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
import { STATES, TOP_CITIES } from "@/lib/constants";
import type { UsePublishFormReturn } from "../use-publish-form";

/* ── Props ──────────────────────────────────────────────────── */

interface LocationStepProps {
  form: UsePublishFormReturn;
}

/* ── Component ──────────────────────────────────────────────── */

export function LocationStep({ form }: LocationStepProps) {
  const { data, updateData, errors } = form;

  const handleCitySelect = (city: string) => {
    const cityData = TOP_CITIES.find((c) => c.name === city);
    if (cityData) {
      updateData({ city: cityData.name, state: cityData.state });
    } else {
      updateData({ city });
    }
  };

  return (
    <div className="space-y-6">
      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">
          Estado <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.state}
          onValueChange={(value) => updateData({ state: value, city: "" })}
        >
          <SelectTrigger className={errors.state ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && (
          <p className="text-xs text-destructive">{errors.state}</p>
        )}
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">
          Ciudad <span className="text-destructive">*</span>
        </Label>
        {data.state ? (
          <Select
            value={data.city}
            onValueChange={handleCitySelect}
          >
            <SelectTrigger className={errors.city ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecciona la ciudad" />
            </SelectTrigger>
            <SelectContent>
              {TOP_CITIES.filter((c) => c.state === data.state).map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
              <SelectItem value="__other__">Otra ciudad...</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="city"
            placeholder="Primero selecciona el estado"
            disabled
            className={errors.city ? "border-destructive" : ""}
          />
        )}
        {data.city === "__other__" && (
          <Input
            placeholder="Escribe el nombre de la ciudad"
            onChange={(e) => updateData({ city: e.target.value })}
            className="mt-2"
          />
        )}
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city}</p>
        )}
      </div>

      {/* Address (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="address">
          Dirección <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="address"
          placeholder="Calle, avenida, edificio, etc."
          value={data.address}
          onChange={(e) => updateData({ address: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          La dirección exacta no será visible públicamente, solo se usará para mostrar la zona en el mapa.
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="h-48 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          📍 El mapa se mostrará según la ubicación seleccionada
        </p>
      </div>
    </div>
  );
}
