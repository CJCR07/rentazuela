"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const RECENT_SEARCHES = [
  "Apartamentos en Altamira",
  "Casas en El Hatillo",
  "Oficinas en Las Mercedes",
  "Toyota Fortuner 2023",
];

const POPULAR_SEARCHES = [
  "Propiedades en Caracas",
  "Vehículos SUV",
  "Locales comerciales Chacao",
  "Alquiler vacacional Margarita",
];

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (searchQuery: string) => {
    // Navigate to search page with query
    window.location.href = `/propiedades?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-left">Buscar</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="¿Qué estás buscando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSearch(query);
              }
            }}
            className="h-12 pl-10 pr-10"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {!query && (
          <div className="space-y-6">
            {/* Recent searches */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Búsquedas recientes
              </h4>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="rounded-full bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-muted/80"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular searches */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Populares
              </h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {query && (
          <div className="pt-2">
            <Button 
              onClick={() => handleSearch(query)}
              className="w-full bg-brand hover:bg-brand/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar &ldquo;{query}&rdquo;
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
