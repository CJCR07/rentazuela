// Rentazuela — Global Types
// Manual type definitions

// ─── Profile ──────────────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  tier: string | null;
  is_admin: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<Omit<Profile, "id" | "email" | "created_at">>;

// ─── Listing ─────────────────────────────────────────────────────
export type ListingCategory = "property_longterm" | "property_shortterm" | "vehicle" | "commercial" | "investment";
export type CurrencyType = "USD" | "VES";

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: ListingCategory;
  price: number;
  currency: CurrencyType;
  city: string;
  state: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  details: Record<string, unknown> | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = Omit<Listing, "id" | "created_at" | "updated_at" | "views_count">;
export type ListingUpdate = Partial<Omit<Listing, "id" | "owner_id" | "created_at">>;

// ─── Listing Image ───────────────────────────────────────────────
export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position: number | null;
  created_at: string;
}

export type ListingImageInsert = Omit<ListingImage, "id" | "created_at">;

// ─── Booking ─────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  listing_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

// ─── Review ───────────────────────────────────────────────────────
export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ─── Availability ────────────────────────────────────────────────
export interface Availability {
  id: string;
  listing_id: string;
  date: string;
  is_available: boolean | null;
  price_override: number | null;
  created_at: string;
}

// ─── Conversation & Message ──────────────────────────────────────
export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string | null;
}

// ─── Subscription & Payments ─────────────────────────────────────
export interface Subscription {
  id: string;
  user_id: string;
  tier: string | null;
  plan_id: string | null;
  status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  currency: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  payment_method: string | null;
  description: string | null;
  created_at: string | null;
  paid_at: string | null;
}

export interface FeaturedPurchase {
  id: string;
  user_id: string;
  listing_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  featured_until: string | null;
  created_at: string | null;
}

// ─── Listing Details Types ────────────────────────────────────────
export interface PropertyDetails {
  listing_type?: "sale" | "rent";
  property_type?: "apartment" | "house" | "townhouse" | "penthouse" | "land";
  bedrooms?: number;
  bathrooms?: number;
  square_meters?: number;
  parking_spaces?: number;
}

export interface VehicleDetails {
  listing_type?: "sale" | "rent";
  vehicle_type?: "sedan" | "suv" | "truck" | "luxury" | "economy";
  year?: number;
  mileage?: number;
  transmission?: "automatic" | "manual";
  fuel_type?: "gasoline" | "diesel" | "electric" | "hybrid";
}

export interface CommercialDetails {
  listing_type?: "sale" | "rent";
  commercial_type?: "office" | "retail" | "warehouse" | "coworking" | "restaurant";
  square_meters?: number;
}

export interface InvestmentDetails {
  investment_type?: "project" | "property_share" | "business";
  expected_roi?: number;
  minimum_investment?: number;
}

export type ListingDetails = PropertyDetails | VehicleDetails | CommercialDetails | InvestmentDetails;

// ─── Composite / extended types ────────────────────────────────
export type ListingWithImages = Listing & {
  listing_images: ListingImage[];
};

export type ListingWithOwner = Listing & {
  profiles: Profile;
};

export type ListingFull = Listing & {
  listing_images: ListingImage[];
  profiles: Profile;
  reviews: Review[];
};
