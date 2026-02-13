"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import type { 
  Listing, 
  ListingFull,
  ListingCategory 
} from "@/types";

/* ── Types ─────────────────────────────────────────────────── */

export interface GetListingsParams {
  category?: ListingCategory;
  city?: string;
  state?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
  bedrooms?: number;
  vehicleType?: string;
  commercialType?: string;
  sortBy?: "price_asc" | "price_desc" | "created_at_desc";
  offset?: number;
  limit?: number;
}

export interface GetListingsResult {
  listings: Listing[];
  total: number;
  hasMore: boolean;
}

/* ── Get Listings ──────────────────────────────────────────── */

export async function getListings(
  params: GetListingsParams = {}
): Promise<GetListingsResult> {
  const supabase = await createClient();
  
  const {
    category,
    city,
    state,
    priceMin,
    priceMax,
    propertyType,
    bedrooms,
    vehicleType,
    commercialType,
    sortBy = "created_at_desc",
    offset = 0,
    limit = 12,
  } = params;

  let query = supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (state) {
    query = query.ilike("state", `%${state}%`);
  }

  if (priceMin !== undefined) {
    query = query.gte("price", priceMin);
  }

  if (priceMax !== undefined) {
    query = query.lte("price", priceMax);
  }

  if (propertyType) {
    query = query.contains("details", { property_type: propertyType });
  }

  if (bedrooms !== undefined) {
    query = query.contains("details", { bedrooms });
  }

  if (vehicleType) {
    query = query.contains("details", { vehicle_type: vehicleType });
  }

  if (commercialType) {
    query = query.contains("details", { commercial_type: commercialType });
  }

  switch (sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "created_at_desc":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], total: 0, hasMore: false };
  }

  const total = count ?? 0;
  const hasMore = offset + limit < total;

  return {
    listings: data as Listing[],
    total,
    hasMore,
  };
}

/* ── Get Listing By ID ─────────────────────────────────────── */

export async function getListingById(id: string): Promise<ListingFull | null> {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(`
      *,
      listing_images (*),
      profiles (*),
      reviews (*)
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !listing) {
    console.error("Error fetching listing:", error);
    return null;
  }

  return listing as ListingFull;
}

/* ── Get Similar Listings ──────────────────────────────────── */

export async function getSimilarListings(
  listingId: string,
  category: ListingCategory,
  limit = 4
): Promise<Listing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .neq("id", listingId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching similar listings:", error);
    return [];
  }

  return data as Listing[];
}

/* ── Get Listing Count ─────────────────────────────────────── */

export async function getListingCount(
  params: Omit<GetListingsParams, "offset" | "limit" | "sortBy"> = {}
): Promise<number> {
  const supabase = await createClient();
  
  const {
    category,
    city,
    state,
    priceMin,
    priceMax,
    propertyType,
    bedrooms,
    vehicleType,
    commercialType,
  } = params;

  let query = supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (state) {
    query = query.ilike("state", `%${state}%`);
  }

  if (priceMin !== undefined) {
    query = query.gte("price", priceMin);
  }

  if (priceMax !== undefined) {
    query = query.lte("price", priceMax);
  }

  if (propertyType) {
    query = query.contains("details", { property_type: propertyType });
  }

  if (bedrooms !== undefined) {
    query = query.contains("details", { bedrooms });
  }

  if (vehicleType) {
    query = query.contains("details", { vehicle_type: vehicleType });
  }

  if (commercialType) {
    query = query.contains("details", { commercial_type: commercialType });
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting listings:", error);
    return 0;
  }

  return count ?? 0;
}

/* ── Increment Views Count ─────────────────────────────────── */

export async function incrementViewsCount(listingId: string): Promise<void> {
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("listings")
    .select("views_count")
    .eq("id", listingId)
    .single();

  if (current) {
    await supabase
      .from("listings")
      .update({ views_count: (current.views_count ?? 0) + 1 })
      .eq("id", listingId);
  }
}

/* ── Get Listings With Images ──────────────────────────────── */

export async function getListingsWithImages(
  params: GetListingsParams = {}
): Promise<{
  listings: Listing[];
  images: Record<string, import("@/types").ListingImage>;
  total: number;
  hasMore: boolean;
}> {
  const supabase = await createClient();
  
  const result = await getListings(params);
  
  if (result.listings.length === 0) {
    return { listings: [], images: {}, total: 0, hasMore: false };
  }

  const listingIds = result.listings.map((l) => l.id);
  
  const { data: imagesData } = await supabase
    .from("listing_images")
    .select("*")
    .in("listing_id", listingIds)
    .order("position", { ascending: true });

  const imagesMap: Record<string, import("@/types").ListingImage> = {};
  
  if (imagesData) {
    for (const img of imagesData) {
      if (!imagesMap[img.listing_id]) {
        imagesMap[img.listing_id] = img;
      }
    }
  }

  return {
    listings: result.listings,
    images: imagesMap,
    total: result.total,
    hasMore: result.hasMore,
  };
}

/* ── CRUD: Create Listing ──────────────────────────────────── */

export interface CreateListingData {
  title: string;
  description?: string;
  category: ListingCategory;
  price: number;
  currency?: "USD" | "VES";
  city: string;
  state: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  details?: Json;
}

export async function createListing(
  data: CreateListingData
): Promise<{ success: boolean; listing?: Listing; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión para publicar" };
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      currency: data.currency || "USD",
      city: data.city,
      state: data.state,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      details: data.details,
      is_active: true,
      is_featured: false,
      views_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating listing:", error);
    return { success: false, error: "Error al crear el anuncio" };
  }

  return { success: true, listing: listing as Listing };
}

/* ── CRUD: Update Listing ──────────────────────────────────── */

export interface UpdateListingData {
  title?: string;
  description?: string;
  price?: number;
  currency?: "USD" | "VES";
  city?: string;
  state?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  details?: Json;
  is_active?: boolean;
  is_featured?: boolean;
}

export async function updateListing(
  listingId: string,
  data: UpdateListingData
): Promise<{ success: boolean; listing?: Listing; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single();

  if (!existing || existing.owner_id !== user.id) {
    return { success: false, error: "No tienes permiso para editar este anuncio" };
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId)
    .select()
    .single();

  if (error) {
    console.error("Error updating listing:", error);
    return { success: false, error: "Error al actualizar el anuncio" };
  }

  return { success: true, listing: listing as Listing };
}

/* ── CRUD: Delete Listing (Soft Delete) ────────────────────── */

export async function deleteListing(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single();

  if (!existing || existing.owner_id !== user.id) {
    return { success: false, error: "No tienes permiso para eliminar este anuncio" };
  }

  // Soft delete
  const { error } = await supabase
    .from("listings")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", listingId);

  if (error) {
    console.error("Error deleting listing:", error);
    return { success: false, error: "Error al eliminar el anuncio" };
  }

  return { success: true };
}

/* ── Get My Listings ───────────────────────────────────────── */

export async function getMyListings(): Promise<Listing[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my listings:", error);
    return [];
  }

  return data as Listing[];
}

/* ── Get My Listings With Images ───────────────────────────── */

export async function getMyListingsWithImages(): Promise<{
  listings: Listing[];
  images: Record<string, import("@/types").ListingImage>;
}> {
  const supabase = await createClient();

  const listings = await getMyListings();
  
  if (listings.length === 0) {
    return { listings: [], images: {} };
  }

  const listingIds = listings.map((l) => l.id);
  
  const { data: imagesData } = await supabase
    .from("listing_images")
    .select("*")
    .in("listing_id", listingIds)
    .order("position", { ascending: true });

  const imagesMap: Record<string, import("@/types").ListingImage> = {};
  
  if (imagesData) {
    for (const img of imagesData) {
      if (!imagesMap[img.listing_id]) {
        imagesMap[img.listing_id] = img;
      }
    }
  }

  return { listings, images: imagesMap };
}

/* ── Get My Active Listing Count ───────────────────────────── */

export async function getMyActiveListingCount(): Promise<number> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("is_active", true);

  if (error) {
    console.error("Error counting listings:", error);
    return 0;
  }

  return count ?? 0;
}

/* ── Check Can Create Listing (based on tier limits) ────────── */

export async function canCreateListing(): Promise<{ canCreate: boolean; reason?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { canCreate: false, reason: "Debes iniciar sesión" };
  }

  // Get user profile and tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tier = profile?.tier || "free";
  
  // Get current active listings count
  const activeCount = await getMyActiveListingCount();

  // Check limits
  const limits: Record<string, number> = {
    free: 1,
    pro: 25,
    business: Infinity,
    developer: Infinity,
  };

  const limit = limits[tier] ?? 1;

  if (activeCount >= limit) {
    return { 
      canCreate: false, 
      reason: `Has alcanzado el límite de ${limit} anuncio${limit === 1 ? "" : "s"} activo${limit === 1 ? "" : "s"} para tu plan ${tier}. Mejora tu plan para publicar más.` 
    };
  }

  return { canCreate: true };
}
