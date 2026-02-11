import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedSection } from "@/components/home/featured-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ListingCard } from "@/components/listings/listing-card";

/* ── Demo data — will be replaced with Supabase queries in Sprint 4 ── */
const FEATURED_PROPERTIES = [
  {
    id: "1",
    title: "Apartamento en Altamira con Vista Panorámica",
    priceUsd: 185000,
    priceVes: 6752500,
    location: "Altamira, Caracas",
    timeAgo: "2 horas",
    area: "120 m²",
    category: "property_longterm" as const,
  },
  {
    id: "2",
    title: "Casa en El Hatillo con Jardín y Piscina",
    priceUsd: 320000,
    priceVes: 11680000,
    location: "El Hatillo, Miranda",
    timeAgo: "5 horas",
    area: "250 m²",
    category: "property_longterm" as const,
  },
  {
    id: "3",
    title: "Penthouse Duplex en Las Mercedes",
    priceUsd: 450000,
    priceVes: 16425000,
    location: "Las Mercedes, Caracas",
    timeAgo: "1 día",
    area: "180 m²",
    category: "property_longterm" as const,
  },
  {
    id: "4",
    title: "Townhouse Moderno en La Lagunita",
    priceUsd: 275000,
    priceVes: 10037500,
    location: "La Lagunita, Miranda",
    timeAgo: "3 horas",
    area: "200 m²",
    category: "property_longterm" as const,
  },
  {
    id: "5",
    title: "Villa Frente al Mar en Lechería",
    priceUsd: 520000,
    priceVes: 18980000,
    location: "Lechería, Anzoátegui",
    timeAgo: "6 horas",
    area: "300 m²",
    category: "property_longterm" as const,
  },
];

const FEATURED_VEHICLES = [
  {
    id: "v1",
    title: "Toyota Fortuner 2023 — 4x4 Automática",
    priceUsd: 45000,
    priceVes: 1642500,
    location: "Maracaibo, Zulia",
    timeAgo: "30 min",
    area: "22,000 km",
    category: "vehicle" as const,
  },
  {
    id: "v2",
    title: "Ford Explorer Limited 2022",
    priceUsd: 52000,
    priceVes: 1898000,
    location: "Valencia, Carabobo",
    timeAgo: "1 hora",
    area: "35,000 km",
    category: "vehicle" as const,
  },
  {
    id: "v3",
    title: "Hyundai Tucson 2024 — 0km Disponible",
    priceUsd: 38000,
    priceVes: 1387000,
    location: "Caracas, D.C.",
    timeAgo: "2 horas",
    area: "0 km",
    category: "vehicle" as const,
  },
  {
    id: "v4",
    title: "Chevrolet Tahoe 2021 — Full Equipo",
    priceUsd: 48000,
    priceVes: 1752000,
    location: "Barquisimeto, Lara",
    timeAgo: "4 horas",
    area: "45,000 km",
    category: "vehicle" as const,
  },
  {
    id: "v5",
    title: "Jeep Grand Cherokee Alquiler Diario",
    priceUsd: 65,
    priceVes: 2372,
    location: "Margarita, N. Esparta",
    timeAgo: "1 hora",
    area: "SUV",
    category: "vehicle" as const,
    pricePeriod: " / día",
  },
];

const FEATURED_COMMERCIAL = [
  {
    id: "c1",
    title: "Local Comercial en C.C. Sambil — Planta Baja",
    priceUsd: 3500,
    priceVes: 127750,
    location: "Chacao, Caracas",
    timeAgo: "1 día",
    area: "85 m²",
    category: "commercial" as const,
    pricePeriod: " / mes",
  },
  {
    id: "c2",
    title: "Oficina Premium en Torre La Castellana",
    priceUsd: 2800,
    priceVes: 102200,
    location: "La Castellana, Caracas",
    timeAgo: "3 horas",
    area: "120 m²",
    category: "commercial" as const,
    pricePeriod: " / mes",
  },
  {
    id: "c3",
    title: "Galpón Industrial — Zona Franca La Guaira",
    priceUsd: 180000,
    priceVes: 6570000,
    location: "La Guaira, Vargas",
    timeAgo: "2 días",
    area: "500 m²",
    category: "commercial" as const,
  },
  {
    id: "c4",
    title: "Espacio Coworking Equipado — Los Palos Grandes",
    priceUsd: 450,
    priceVes: 16425,
    location: "Los Palos Grandes, Caracas",
    timeAgo: "5 horas",
    area: "15 m²",
    category: "commercial" as const,
    pricePeriod: " / mes",
  },
  {
    id: "c5",
    title: "Consultorio Médico en Centro Médico El Ávila",
    priceUsd: 1200,
    priceVes: 43800,
    location: "San Bernardino, Caracas",
    timeAgo: "1 día",
    area: "60 m²",
    category: "commercial" as const,
    pricePeriod: " / mes",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSlider />

      {/* ── Stats ── */}
      <StatsBar />

      {/* ── Propiedades Destacadas ── */}
      <FeaturedSection title="Propiedades Destacadas" href="/propiedades">
        {FEATURED_PROPERTIES.map((p) => (
          <ListingCard key={p.id} {...p} />
        ))}
      </FeaturedSection>

      {/* ── Vehículos ── */}
      <FeaturedSection title="Vehículos en Venta y Alquiler" href="/vehiculos">
        {FEATURED_VEHICLES.map((v) => (
          <ListingCard key={v.id} {...v} />
        ))}
      </FeaturedSection>

      {/* ── Locales Comerciales ── */}
      <FeaturedSection title="Locales Comerciales" href="/locales">
        {FEATURED_COMMERCIAL.map((c) => (
          <ListingCard key={c.id} {...c} />
        ))}
      </FeaturedSection>
    </>
  );
}
