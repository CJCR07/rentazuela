"use client";

import { useState } from "react";
import { LegacyListingCard } from "@/components/listings/legacy-listing-card";
import { FadeIn } from "@/components/animations/fade-in";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SubCategory = "all" | "sale" | "rent";

interface Commercial {
  id: string;
  title: string;
  priceUsd: number;
  priceVes?: number;
  location: string;
  timeAgo: string;
  area?: string;
  category: "commercial";
  listingType?: "sale" | "rent";
  imageUrl?: string;
  isNew?: boolean;
  pricePeriod?: string;
}

const SUBCATEGORIES = [
  { id: "all" as SubCategory, label: "Todos" },
  { id: "sale" as SubCategory, label: "Venta" },
  { id: "rent" as SubCategory, label: "Alquiler" },
];

// Mock data - datos falsos para demo
const MOCK_COMMERCIAL: Commercial[] = [
  {
    id: "c1",
    title: "Local Comercial en C.C. Sambil — Planta Baja",
    priceUsd: 3500,
    priceVes: 127750,
    location: "Chacao, Caracas",
    timeAgo: "1 día",
    area: "85 m²",
    category: "commercial",
    listingType: "rent",
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c2",
    title: "Oficina Premium en Torre La Castellana",
    priceUsd: 2800,
    priceVes: 102200,
    location: "La Castellana, Caracas",
    timeAgo: "3 horas",
    area: "120 m²",
    category: "commercial",
    listingType: "rent",
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "c3",
    title: "Galpón Industrial — Zona Franca La Guaira",
    priceUsd: 180000,
    priceVes: 6570000,
    location: "La Guaira, Vargas",
    timeAgo: "2 días",
    area: "500 m²",
    category: "commercial",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c4",
    title: "Espacio Coworking Equipado — Los Palos Grandes",
    priceUsd: 450,
    priceVes: 16425,
    location: "Los Palos Grandes, Caracas",
    timeAgo: "5 horas",
    area: "15 m²",
    category: "commercial",
    listingType: "rent",
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c5",
    title: "Consultorio Médico en Centro Médico El Ávila",
    priceUsd: 1200,
    priceVes: 43800,
    location: "San Bernardino, Caracas",
    timeAgo: "1 día",
    area: "60 m²",
    category: "commercial",
    listingType: "rent",
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c6",
    title: "Local en Centro Comercial Multiplaza",
    priceUsd: 250000,
    priceVes: 9125000,
    location: "Baruta, Caracas",
    timeAgo: "4 horas",
    area: "95 m²",
    category: "commercial",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c7",
    title: "Bodega con Oficinas en Zona Industrial",
    priceUsd: 85000,
    priceVes: 3102500,
    location: "Valencia, Carabobo",
    timeAgo: "2 días",
    area: "800 m²",
    category: "commercial",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c8",
    title: "Restaurante en Alquiler — Las Mercedes",
    priceUsd: 5500,
    priceVes: 200750,
    location: "Las Mercedes, Caracas",
    timeAgo: "6 horas",
    area: "150 m²",
    category: "commercial",
    listingType: "rent",
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "c9",
    title: "Edificio Comercial en Venta — Centro",
    priceUsd: 850000,
    priceVes: 31025000,
    location: "Centro, Caracas",
    timeAgo: "1 día",
    area: "2,500 m²",
    category: "commercial",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  },
];

export default function LocalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory>("all");

  const filteredCommercial = MOCK_COMMERCIAL.filter((item) => {
    if (activeSubcategory === "all") return true;
    return item.listingType === activeSubcategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search */}
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <h1 className="text-3xl font-bold mb-2">Locales Comerciales</h1>
            <p className="text-muted-foreground mb-6">
              Oficinas, galpones y espacios coworking para impulsar tu negocio
            </p>
            
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por tipo, ubicación..."
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
                onClick={() => setActiveSubcategory(sub.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
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
              <strong className="text-foreground">{filteredCommercial.length}</strong> locales encontrados
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Todos los tipos</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCommercial.map((item, index) => (
            <FadeIn key={item.id} direction="up" delay={index * 0.05}>
              <LegacyListingCard {...item} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
