// Rentazuela — Global Types

export type ListingType = 'property' | 'vehicle' | 'commercial';
export type ListingPurpose = 'sale' | 'long-term-rent' | 'short-term-rent';
export type Currency = 'USD' | 'VES';

export type UserTier = 'free' | 'pro' | 'business' | 'developer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  tier: UserTier;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  type: ListingType;
  purpose: ListingPurpose;
  title: string;
  description: string;
  price_usd: number;
  price_ves?: number;
  currency: Currency;
  state: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyDetails {
  listing_id: string;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  parking_spots: number;
  is_furnished: boolean;
  property_type: 'apartment' | 'house' | 'townhouse' | 'penthouse' | 'land' | 'office';
}

export interface VehicleDetails {
  listing_id: string;
  brand: string;
  model: string;
  year: number;
  vehicle_type: 'sedan' | 'suv' | 'pickup' | 'van' | 'motorcycle' | 'other';
  mileage_km: number;
  transmission: 'automatic' | 'manual';
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}
