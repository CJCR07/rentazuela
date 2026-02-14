import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin, getAdminStats } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Users, Home, MessageSquare, Eye, Settings, ArrowRight } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  const stats = await getAdminStats();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground mt-1">
              Gestión de la plataforma
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowRight className="mr-2 h-4 w-4" />
              Volver al sitio
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <Users className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuarios</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <Home className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Anuncios</p>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Eye className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anuncios Activos</p>
                <p className="text-2xl font-bold">{stats.activeListings}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversaciones</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Anuncios Recientes</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/listings">Ver todos</Link>
              </Button>
            </div>
            {stats.recentListings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay anuncios</p>
            ) : (
              <div className="space-y-3">
                {stats.recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium line-clamp-1">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {listing.city}, {listing.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString("es-VE")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Usuarios Recientes</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">Ver todos</Link>
              </Button>
            </div>
            {stats.recentUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay usuarios</p>
            ) : (
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{user.full_name || "Sin nombre"}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("es-VE")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" asChild>
            <Link href="/admin/listings">
              <Home className="h-5 w-5" />
              <span>Gestionar Anuncios</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" asChild>
            <Link href="/admin/users">
              <Users className="h-5 w-5" />
              <span>Gestionar Usuarios</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" asChild>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" asChild>
            <Link href="/">
              <ArrowRight className="h-5 w-5" />
              <span>Ver Sitio</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
