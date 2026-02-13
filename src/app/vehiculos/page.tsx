"use client";

import { useState } from "react";
import { LegacyListingCard } from "@/components/listings/legacy-listing-card";
import { FadeIn } from "@/components/animations/fade-in";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Car } from "lucide-react";
import { cn } from "@/lib/utils";

type SubCategory = "all" | "sale" | "rent";

interface Vehicle {
  id: string;
  title: string;
  priceUsd: number;
  priceVes?: number;
  location: string;
  timeAgo: string;
  area?: string;
  category: "vehicle";
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
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "v1",
    title: "Toyota Fortuner 2023 — 4x4 Automática",
    priceUsd: 45000,
    priceVes: 1642500,
    location: "Maracaibo, Zulia",
    timeAgo: "30 min",
    area: "22,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "v2",
    title: "Ford Explorer Limited 2022",
    priceUsd: 52000,
    priceVes: 1898000,
    location: "Valencia, Carabobo",
    timeAgo: "1 hora",
    area: "35,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-2969f3c6aca0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v3",
    title: "Hyundai Tucson 2024 — 0km Disponible",
    priceUsd: 38000,
    priceVes: 1387000,
    location: "Caracas, D.C.",
    timeAgo: "2 horas",
    area: "0 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v4",
    title: "Chevrolet Tahoe 2021 — Full Equipo",
    priceUsd: 48000,
    priceVes: 1752000,
    location: "Barquisimeto, Lara",
    timeAgo: "4 horas",
    area: "45,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v5",
    title: "Jeep Grand Cherokee Alquiler Diario",
    priceUsd: 65,
    priceVes: 2372,
    location: "Margarita, N. Esparta",
    timeAgo: "1 hora",
    area: "SUV",
    category: "vehicle",
    listingType: "rent",
    pricePeriod: " / día",
    imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v6",
    title: "BMW X5 2022 — Sport Package",
    priceUsd: 68000,
    priceVes: 2482000,
    location: "Caracas, D.C.",
    timeAgo: "5 horas",
    area: "18,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954e29d7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v7",
    title: "Mercedes-Benz GLC 300 2023",
    priceUsd: 58000,
    priceVes: 2117000,
    location: "Valencia, Carabobo",
    timeAgo: "1 día",
    area: "12,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "v8",
    title: "Toyota Corolla 2020 — Único Dueño",
    priceUsd: 22000,
    priceVes: 803000,
    location: "Maracay, Aragua",
    timeAgo: "3 horas",
    area: "55,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "v9",
    title: "Ford Mustang Convertible Alquiler",
    priceUsd: 120,
    priceVes: 4380,
    location: "Caracas, D.C.",
    timeAgo: "2 horas",
    area: "Convertible",
    category: "vehicle",
    listingType: "rent",
    pricePeriod: " / día",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "v10",
    title: "Honda Civic 2021 — Económico",
    priceUsd: 18500,
    priceVes: 675250,
    location: "Barquisimeto, Lara",
    timeAgo: "4 horas",
    area: "32,000 km",
    category: "vehicle",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1605816988065-b0b43d42bf50?auto=format&fit=crop&q=80&w=800",
  },
];

export default function VehiculosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory>("all");

  const filteredVehicles = MOCK_VEHICLES.filter((vehicle) => {
    if (activeSubcategory === "all") return true;
    return vehicle.listingType === activeSubcategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search */}
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <h1 className="text-3xl font-bold mb-2">Vehículos en Venta y Alquiler</h1>
            <p className="text-muted-foreground mb-6">
              Encuentra tu próximo carro con opciones de compra y alquiler diario
            </p>
            
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por marca, modelo..."
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
              <strong className="text-foreground">{filteredVehicles.length}</strong> vehículos encontrados
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="h-4 w-4" />
              <span>Todos los tipos</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVehicles.map((vehicle, index) => (
            <FadeIn key={vehicle.id} direction="up" delay={index * 0.05}>
              <LegacyListingCard {...vehicle} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
