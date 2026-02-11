// Rentazuela — Constants

export const SITE_NAME = 'Rentazuela';
export const SITE_DESCRIPTION = 'Marketplace unificado para Venezuela — propiedades, vehículos, locales comerciales e inversiones.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentazuela.com';

// Listing limits by tier
export const TIER_LIMITS = {
  free: 1,
  pro: 25,
  business: Infinity,
  developer: Infinity,
} as const;

// Venezuelan states
export const STATES = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas',
  'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital',
  'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda',
  'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira',
  'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
] as const;

// Navigation
export const NAV_ITEMS = [
  { label: 'Propiedades', href: '/propiedades', icon: 'home' },
  { label: 'Vehículos', href: '/vehiculos', icon: 'car' },
  { label: 'Locales', href: '/locales', icon: 'building' },
  { label: 'Inversiones', href: '/inversiones', icon: 'trending-up' },
] as const;
