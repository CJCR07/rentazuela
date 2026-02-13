import { Home, Car, Building2, Search, Heart, FileX } from "lucide-react";

interface EmptyStateProps {
  type: "search" | "favorites" | "listings" | "general";
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  search: Search,
  favorites: Heart,
  listings: Home,
  general: FileX,
};

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const Icon = icons[type];
  
  const defaultContent = {
    search: {
      title: "No se encontraron resultados",
      description: "Intenta ajustar tus filtros o busca en otra ubicación",
    },
    favorites: {
      title: "No tienes favoritos",
      description: "Guarda los listings que te interesen para verlos aquí",
    },
    listings: {
      title: "No hay publicaciones",
      description: "Sé el primero en publicar en esta categoría",
    },
    general: {
      title: "No hay contenido",
      description: "Vuelve más tarde para ver nuevas actualizaciones",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        {title || defaultContent[type].title}
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {description || defaultContent[type].description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
