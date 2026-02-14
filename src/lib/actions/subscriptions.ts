"use server";

import { createClient } from "@/lib/supabase/server";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export async function getUserSubscription(): Promise<{
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { tier: "free", status: "inactive", currentPeriodEnd: null };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!subscription) {
    return { tier: "free", status: "inactive", currentPeriodEnd: null };
  }

  return {
    tier: subscription.tier || "free",
    status: subscription.status || "inactive",
    currentPeriodEnd: subscription.current_period_end,
  };
}

export async function getUserListingLimits(): Promise<{
  listings: number;
  images: number;
  featured: number;
  usedListings: number;
  usedImages: number;
  usedFeatured: number;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      listings: 1,
      images: 3,
      featured: 0,
      usedListings: 0,
      usedImages: 0,
      usedFeatured: 0,
    };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("user_id", user.id)
    .single();

  const tier = subscription?.tier || "free";
  const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.free;

  const { count: listingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id);

  const { count: featuredCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("is_featured", true);

  return {
    listings: plan.features.listings,
    images: plan.features.images,
    featured: plan.features.featured,
    usedListings: listingsCount ?? 0,
    usedFeatured: featuredCount ?? 0,
    usedImages: 0,
  };
}

export async function canCreateListing(): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserListingLimits();

  if (limits.usedListings >= limits.listings) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limits.listings} anuncios. ${limits.listings === Infinity ? "" : "Upgrade tu plan para crear más."}`,
    };
  }

  return { allowed: true };
}

export async function canFeatureListing(): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserListingLimits();

  if (limits.featured === 0) {
    return {
      allowed: false,
      reason: "Tu plan no incluye anuncios destacados. Upgrade para destacar tus anuncios.",
    };
  }

  if (limits.usedFeatured >= limits.featured) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limits.featured} anuncios destacados.`,
    };
  }

  return { allowed: true };
}

export async function getPaymentHistory(): Promise<{
  payments: { id: string; amount: number; currency: string; status: string; description: string | null; created_at: string }[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { payments: [] };
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, currency, status, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    payments: payments?.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      description: p.description,
      created_at: p.created_at,
    })) || [],
  };
}
