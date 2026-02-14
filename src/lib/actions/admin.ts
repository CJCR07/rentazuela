"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalConversations: number;
  recentListings: { id: string; title: string; city: string; state: string; created_at: string; owner_email: string }[];
  recentUsers: { id: string; email: string; full_name: string | null; created_at: string }[];
}> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return {
      totalUsers: 0,
      totalListings: 0,
      activeListings: 0,
      totalConversations: 0,
      recentListings: [],
      recentUsers: [],
    };
  }

  const [{ count: totalUsers }, { count: totalListings }, { count: activeListings }, { count: totalConversations }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("conversations").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentListings } = await supabase
    .from("listings")
    .select("id, title, city, state, created_at, profiles!inner(email)")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalUsers: totalUsers ?? 0,
    totalListings: totalListings ?? 0,
    activeListings: activeListings ?? 0,
    totalConversations: totalConversations ?? 0,
    recentListings: recentListings?.map((l: any) => ({
      id: l.id,
      title: l.title,
      city: l.city,
      state: l.state,
      created_at: l.created_at,
      owner_email: l.profiles?.email || "",
    })) || [],
    recentUsers: recentUsers?.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
    })) || [],
  };
}

export async function getAllListingsAdmin(offset = 0, limit = 20): Promise<{
  listings: { id: string; title: string; price: number; currency: string; city: string; state: string; is_active: boolean; created_at: string; owner_email: string }[];
  total: number;
}> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { listings: [], total: 0 };
  }

  const { data: listings, count } = await supabase
    .from("listings")
    .select("*, profiles!inner(email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    listings: listings?.map((l: any) => ({
      id: l.id,
      title: l.title,
      price: l.price,
      currency: l.currency,
      city: l.city,
      state: l.state,
      is_active: l.is_active,
      created_at: l.created_at,
      owner_email: l.profiles?.email || "",
    })) || [],
    total: count ?? 0,
  };
}

export async function getAllUsersAdmin(offset = 0, limit = 20): Promise<{
  users: { id: string; email: string; full_name: string | null; tier: string | null; is_admin: boolean | null; created_at: string }[];
  total: number;
}> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { users: [], total: 0 };
  }

  const { data: users, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    users: users?.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      tier: u.tier,
      is_admin: u.is_admin,
      created_at: u.created_at,
    })) || [],
    total: count ?? 0,
  };
}

export async function toggleListingActive(listingId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "No tienes permisos de administrador" };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("is_active")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return { success: false, error: "Anuncio no encontrado" };
  }

  const { error } = await supabase
    .from("listings")
    .update({ is_active: !listing.is_active, updated_at: new Date().toISOString() })
    .eq("id", listingId);

  if (error) {
    return { success: false, error: "Error al actualizar el anuncio" };
  }

  return { success: true };
}

export async function updateUserTier(userId: string, tier: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "No tienes permisos de administrador" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ tier: tier as any })
    .eq("id", userId);

  if (error) {
    return { success: false, error: "Error al actualizar el usuario" };
  }

  return { success: true };
}

export async function setUserAdmin(userId: string, isAdmin: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const currentUser = await checkIsAdmin();
  if (!currentUser) {
    return { success: false, error: "No tienes permisos de administrador" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: isAdmin })
    .eq("id", userId);

  if (error) {
    return { success: false, error: "Error al actualizar el usuario" };
  }

  return { success: true };
}

export async function deleteListingAdmin(listingId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "No tienes permisos de administrador" };
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);

  if (error) {
    return { success: false, error: "Error al eliminar el anuncio" };
  }

  return { success: true };
}
