// Rentazuela — Global Types
// Convenience aliases derived from the auto-generated database types.
// ⚠️ Do NOT define manual interfaces here — use Tables<> from database.ts.

import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database";

// ─── Row types (SELECT) ───────────────────────────────────────────
export type Profile = Tables<"profiles">;
export type Listing = Tables<"listings">;
export type ListingImage = Tables<"listing_images">;
export type Booking = Tables<"bookings">;
export type Review = Tables<"reviews">;
export type Availability = Tables<"availability">;

// ─── Insert types ─────────────────────────────────────────────────
export type ProfileInsert = TablesInsert<"profiles">;
export type ListingInsert = TablesInsert<"listings">;
export type ListingImageInsert = TablesInsert<"listing_images">;
export type BookingInsert = TablesInsert<"bookings">;
export type ReviewInsert = TablesInsert<"reviews">;
export type AvailabilityInsert = TablesInsert<"availability">;

// ─── Update types ─────────────────────────────────────────────────
export type ProfileUpdate = TablesUpdate<"profiles">;
export type ListingUpdate = TablesUpdate<"listings">;
export type ListingImageUpdate = TablesUpdate<"listing_images">;
export type BookingUpdate = TablesUpdate<"bookings">;
export type ReviewUpdate = TablesUpdate<"reviews">;
export type AvailabilityUpdate = TablesUpdate<"availability">;

// ─── Enum types ───────────────────────────────────────────────────
export type ListingCategory = Enums<"listing_category">;
export type CurrencyType = Enums<"currency_type">;
export type BookingStatus = Enums<"booking_status">;
export type UserTier = Enums<"user_tier">;

// ─── Composite / extended types (app-level only) ──────────────────
/** Listing with its images joined */
export type ListingWithImages = Listing & {
  listing_images: ListingImage[];
};

/** Listing with owner profile joined */
export type ListingWithOwner = Listing & {
  profiles: Profile;
};

/** Full listing for detail page */
export type ListingFull = Listing & {
  listing_images: ListingImage[];
  profiles: Profile;
  reviews: Review[];
};
