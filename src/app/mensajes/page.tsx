"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, ArrowLeft, MessageSquare } from "lucide-react";
import { getConversations, getConversation, sendMessage, markMessagesAsRead, type ConversationWithDetails } from "@/lib/actions/messages";
import { toast } from "sonner";

export default function MensajesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<{ id: string; content: string; sender_id: string; created_at: string | null; is_read: boolean | null }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    initUser();
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    const data = await getConversations();
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const { messages: msgs, conversation } = await getConversation(conversationId);
    setMessages(msgs);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const result = await sendMessage(selectedConversation.id, newMessage.trim());
    
    if (result.success) {
      setNewMessage("");
      loadMessages(selectedConversation.id);
      loadConversations();
    } else {
      toast.error(result.error || "Error al enviar");
    }
    setSending(false);
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("es-VE");
  };

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mensajes</h1>

        <div className="border rounded-2xl overflow-hidden bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            {/* Conversations List */}
            <div className={`border-r ${selectedConversation ? "hidden md:block" : ""}`}>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay conversaciones</p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conv.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-brand">
                            {(conv.otherUserName || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {conv.otherUserName || "Usuario"}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.listingTitle || "Anuncio"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(conv.lastMessageAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className={`col-span-2 ${!selectedConversation ? "hidden md:flex md:items-center md:justify-center" : ""}`}>
              {selectedConversation ? (
                <div className="flex flex-col h-full">
                  {/* Chat Header */}
                  <div className="border-b p-4 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-brand">
                        {(selectedConversation.otherUserName || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedConversation.otherUserName || "Usuario"}</p>
                      <Link
                        href={`/listing/${selectedConversation.listing_id}`}
                        className="text-sm text-muted-foreground hover:text-brand"
                      >
                        {selectedConversation.listingTitle}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand">
                        {formatPrice(selectedConversation.listingPrice, selectedConversation.listingCurrency)}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isMe
                                ? "bg-brand text-white"
                                : "bg-muted"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()} className="bg-brand hover:bg-brand/90">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Selecciona una conversación</p>
                  <p className="text-sm">para ver los mensajes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
