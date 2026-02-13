import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Heart, 
  MessageSquare, 
  Settings,
  Plus,
  Eye
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's listings count
  const { count: listingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("is_active", true);

  // Fetch total views across all listings
  const { data: listings } = await supabase
    .from("listings")
    .select("views_count")
    .eq("owner_id", user.id);

  const totalViews = listings?.reduce((sum, l) => sum + (l.views_count ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mi Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de nuevo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <Home className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mis Anuncios</p>
                <p className="text-2xl font-bold">{listingsCount ?? 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <Heart className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Disponible en el cliente</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <Eye className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vistas</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-brand hover:bg-brand/90" asChild>
              <Link href="/publicar">
                <Plus className="mr-2 h-4 w-4" />
                Publicar Anuncio
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/mis-anuncios">
                <Home className="mr-2 h-4 w-4" />
                Mis Anuncios
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/favoritos">
                <Heart className="mr-2 h-4 w-4" />
                Favoritos
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/perfil">
                <Settings className="mr-2 h-4 w-4" />
                Editar Perfil
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay actividad reciente</p>
            <p className="text-sm mt-1">Tus anuncios y mensajes aparecerán aquí</p>
          </div>
        </div>
      </div>
    </div>
  );
}
