"use client";

import { Home, Car, Building2, TrendingUp, DollarSign, Calendar, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UsePublishFormReturn, ListingType } from "../use-publish-form";
import type { ListingCategory } from "@/types";

/* ── Category Config ────────────────────────────────────────── */

const CATEGORIES = [
  {
    id: "property_longterm" as ListingCategory,
    label: "Propiedad",
    description: "Venta o alquiler largo plazo",
    icon: Home,
    types: [
      { id: "sale" as ListingType, label: "Venta", icon: DollarSign },
      { id: "rent" as ListingType, label: "Alquiler", icon: Key },
    ],
  },
  {
    id: "property_shortterm" as ListingCategory,
    label: "Alquiler Vacacional",
    description: "Por días o semanas",
    icon: Calendar,
    types: [
      { id: "vacation" as ListingType, label: "Disponible para rentar", icon: Calendar },
    ],
  },
  {
    id: "vehicle" as ListingCategory,
    label: "Vehículo",
    description: "Autos, motos y más",
    icon: Car,
    types: [
      { id: "sale" as ListingType, label: "Venta", icon: DollarSign },
      { id: "rent" as ListingType, label: "Alquiler", icon: Key },
    ],
  },
  {
    id: "commercial" as ListingCategory,
    label: "Local Comercial",
    description: "Oficinas, galpones",
    icon: Building2,
    types: [
      { id: "sale" as ListingType, label: "Venta", icon: DollarSign },
      { id: "rent" as ListingType, label: "Alquiler", icon: Key },
    ],
  },
  {
    id: "investment" as ListingCategory,
    label: "Inversión",
    description: "Proyectos y oportunidades",
    icon: TrendingUp,
    types: [
      { id: "sale" as ListingType, label: "Oportunidad de inversión", icon: TrendingUp },
    ],
  },
];

/* ── Props ──────────────────────────────────────────────────── */

interface CategoryStepProps {
  form: UsePublishFormReturn;
}

/* ── Component ──────────────────────────────────────────────── */

export function CategoryStep({ form }: CategoryStepProps) {
  const { data, updateData, errors } = form;

  const handleCategorySelect = (category: ListingCategory) => {
    updateData({ 
      category, 
      listingType: null,
      details: null,
    });
  };

  const handleTypeSelect = (listingType: ListingType) => {
    updateData({ listingType });
  };

  const selectedCategory = CATEGORIES.find((c) => c.id === data.category);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          ¿Qué quieres publicar?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = data.category === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isSelected ? "bg-brand text-white" : "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{category.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-sm text-destructive mt-2">{errors.category}</p>
        )}
      </div>

      {/* Listing Type Selection */}
      {selectedCategory && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <label className="block text-sm font-medium mb-3">
            Tipo de anuncio
          </label>
          <div className="flex flex-wrap gap-3">
            {selectedCategory.types.map((type) => {
              const Icon = type.icon;
              const isSelected = data.listingType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                    isSelected
                      ? "border-brand bg-brand text-white"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
          {errors.listingType && (
            <p className="text-sm text-destructive mt-2">{errors.listingType}</p>
          )}
        </div>
      )}
    </div>
  );
}
