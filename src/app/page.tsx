import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedSection } from "@/components/home/featured-section";
import { StatsBar } from "@/components/home/stats-bar";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { LegacyListingCard } from "@/components/listings/legacy-listing-card";
import { FadeIn } from "@/components/animations/fade-in";

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
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    isNew: true,
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
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
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
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
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
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    isNew: true,
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
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
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
    category: "vehicle" as const,
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
    category: "vehicle" as const,
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
    category: "vehicle" as const,
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
    category: "vehicle" as const,
    pricePeriod: " / día",
    imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800",
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
    category: "commercial" as const,
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
    category: "commercial" as const,
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
    category: "commercial" as const,
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
    category: "commercial" as const,
    pricePeriod: " / mes",
    imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSlider />

      {/* ── Cómo Funciona ── */}
      <FadeIn direction="up" delay={0}>
        <HowItWorks />
      </FadeIn>

      {/* ── Propiedades Destacadas ── */}
      <FadeIn direction="up" delay={0.1}>
        <FeaturedSection
          title="Propiedades Destacadas"
          subtitle="Las mejores propiedades del país, verificadas por nuestro equipo"
          href="/propiedades"
        >
          {FEATURED_PROPERTIES.map((p) => (
            <LegacyListingCard key={p.id} {...p} />
          ))}
        </FeaturedSection>
      </FadeIn>

      {/* ── Vehículos ── */}
      <FadeIn direction="up" delay={0.1}>
        <FeaturedSection
          title="Vehículos en Venta y Alquiler"
          subtitle="Encuentra tu próximo carro con opciones de compra y alquiler diario"
          href="/vehiculos"
        >
          {FEATURED_VEHICLES.map((v) => (
            <LegacyListingCard key={v.id} {...v} />
          ))}
        </FeaturedSection>
      </FadeIn>

      {/* ── Locales Comerciales ── */}
      <FadeIn direction="up" delay={0.1}>
        <FeaturedSection
          title="Locales Comerciales"
          subtitle="Oficinas, galpones y espacios coworking para impulsar tu negocio"
          href="/locales"
        >
          {FEATURED_COMMERCIAL.map((c) => (
            <LegacyListingCard key={c.id} {...c} />
          ))}
        </FeaturedSection>
      </FadeIn>

      {/* ── Stats ── */}
      <StatsBar />

      {/* ── Testimonios ── */}
      <FadeIn direction="up" delay={0.1}>
        <Testimonials />
      </FadeIn>
    </>
  );
}
