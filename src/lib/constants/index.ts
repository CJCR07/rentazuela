// Rentazuela — Constants

export const SITE_NAME = 'Rentazuela';
export const SITE_DESCRIPTION = 'Marketplace unificado para Venezuela — propiedades, vehículos, locales comerciales e inversiones.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentazuela.com';

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      listings: 1,
      images: 3,
      featured: 0,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    priceId: 'price_premium_monthly',
    features: {
      listings: 10,
      images: 10,
      featured: 1,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 24.99,
    priceId: 'price_pro_monthly',
    features: {
      listings: Infinity,
      images: 20,
      featured: 5,
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

// Listing limits by tier
export const TIER_LIMITS = {
  free: 1,
  premium: 10,
  pro: Infinity,
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

// Top cities in Venezuela (for location dropdown)
export const TOP_CITIES = [
  { name: 'Caracas', state: 'Distrito Capital' },
  { name: 'Maracaibo', state: 'Zulia' },
  { name: 'Valencia', state: 'Carabobo' },
  { name: 'Barquisimeto', state: 'Lara' },
  { name: 'Maracay', state: 'Aragua' },
  { name: 'Ciudad Guayana', state: 'Bolívar' },
  { name: 'Maturín', state: 'Monagas' },
  { name: 'Barcelona', state: 'Anzoátegui' },
  { name: 'San Cristóbal', state: 'Táchira' },
  { name: 'Mérida', state: 'Mérida' },
] as const;
