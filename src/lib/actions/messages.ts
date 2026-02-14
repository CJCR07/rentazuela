"use server";

import { createClient } from "@/lib/supabase/server";

export interface ConversationWithDetails {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string | null;
  updated_at: string | null;
  listingTitle: string | null;
  listingPrice: number | null;
  listingCurrency: string | null;
  otherUserName: string | null;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isBuyer: boolean;
}

export async function getConversations(): Promise<ConversationWithDetails[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error || !conversations) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  const result: ConversationWithDetails[] = [];

  for (const conv of conversations) {
    const isBuyer = conv.buyer_id === user.id;
    const otherUserId = isBuyer ? conv.seller_id : conv.buyer_id;

    const { data: listing } = await supabase
      .from("listings")
      .select("title, price, currency")
      .eq("id", conv.listing_id)
      .single();

    const { data: otherUser } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", otherUserId)
      .single();

    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { count: unreadCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conv.id)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    result.push({
      ...conv,
      listingTitle: listing?.title ?? null,
      listingPrice: listing?.price ?? null,
      listingCurrency: listing?.currency ?? null,
      otherUserName: otherUser?.full_name ?? null,
      otherUserAvatar: otherUser?.avatar_url ?? null,
      lastMessage: lastMsg?.content ?? null,
      lastMessageAt: lastMsg?.created_at ?? null,
      unreadCount: unreadCount ?? 0,
      isBuyer,
    });
  }

  return result;
}

export async function getConversation(
  conversationId: string
): Promise<{
  conversation: ConversationWithDetails | null;
  messages: { id: string; content: string; sender_id: string; created_at: string | null; is_read: boolean | null }[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { conversation: null, messages: [] };
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error || !conversation) {
    console.error("Error fetching conversation:", error);
    return { conversation: null, messages: [] };
  }

  const isBuyer = conversation.buyer_id === user.id;
  const otherUserId = isBuyer ? conversation.seller_id : conversation.buyer_id;

  const { data: listing } = await supabase
    .from("listings")
    .select("title, price, currency, city, state")
    .eq("id", conversation.listing_id)
    .single();

  const { data: otherUser } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", otherUserId)
    .single();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, content, sender_id, created_at, is_read")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return {
    conversation: {
      ...conversation,
      listingTitle: listing?.title ?? null,
      listingPrice: listing?.price ?? null,
      listingCurrency: listing?.currency ?? null,
      otherUserName: otherUser?.full_name ?? null,
      otherUserAvatar: otherUser?.avatar_url ?? null,
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: 0,
      isBuyer,
    },
    messages: messages || [],
  };
}

export async function createConversation(listingId: string): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return { success: false, error: "Anuncio no encontrado" };
  }

  if (listing.owner_id === user.id) {
    return { success: false, error: "No puedes iniciar una conversación con tu propio anuncio" };
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .single();

  if (existing) {
    return { success: true, conversationId: existing.id };
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.owner_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return { success: false, error: "Error al crear la conversación" };
  }

  return { success: true, conversationId: conversation.id };
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || (conversation.buyer_id !== user.id && conversation.seller_id !== user.id)) {
    return { success: false, error: "No tienes acceso a esta conversación" };
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });

  if (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Error al enviar el mensaje" };
  }

  return { success: true };
}

export async function markMessagesAsRead(conversationId: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false };
  }

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return { success: true };
}

export async function getUnreadMessagesCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

  if (!conversations || conversations.length === 0) {
    return 0;
  }

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", conversations.map((c) => c.id))
    .eq("is_read", false)
    .neq("sender_id", user.id);

  if (error) {
    console.error("Error counting unread messages:", error);
    return 0;
  }

  return count ?? 0;
}
