"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UsePublishFormReturn } from "../use-publish-form";

/* ── Props ──────────────────────────────────────────────────── */

interface BasicInfoStepProps {
  form: UsePublishFormReturn;
}

/* ── Component ──────────────────────────────────────────────── */

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { data, updateData, errors } = form;
  const [charCount, setCharCount] = useState(data.description.length);

  const handleDescriptionChange = (value: string) => {
    updateData({ description: value });
    setCharCount(value.length);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Título del anuncio <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Ej: Apartamento en Altamira con Vista Panorámica"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          className={errors.title ? "border-destructive" : ""}
          maxLength={100}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={errors.title ? "text-destructive" : ""}>
            {errors.title || "Un título claro atrae más interesados"}
          </span>
          <span>{data.title.length}/100</span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descripción <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe tu propiedad, vehículo o local. Incluye detalles importantes como condiciones, características destacadas, y cualquier información relevante..."
          value={data.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={`min-h-[150px] ${errors.description ? "border-destructive" : ""}`}
          maxLength={2000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={errors.description ? "text-destructive" : ""}>
            {errors.description || "Mínimo 30 caracteres"}
          </span>
          <span>{charCount}/2000</span>
        </div>
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="price">
            Precio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="0"
            value={data.price || ""}
            onChange={(e) => updateData({ price: parseFloat(e.target.value) || 0 })}
            className={errors.price ? "border-destructive" : ""}
            min="0"
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select
            value={data.currency}
            onValueChange={(value: "USD" | "VES") => updateData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="VES">VES (Bs.)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2">💡 Consejos para un buen título</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Incluye la ubicación principal</li>
          <li>• Menciona la característica más atractiva</li>
          <li>• Sé específico con el tipo de propiedad/vehículo</li>
        </ul>
      </div>
    </div>
  );
}
