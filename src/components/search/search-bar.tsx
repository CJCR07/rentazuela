"use client";

import { Search, Home, Car, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { label: "Propiedades", icon: Home, active: true },
  { label: "Vehículos", icon: Car, active: false },
  { label: "Locales", icon: Building2, active: false },
] as const;

export function SearchBar() {
  return (
    <div className="w-full rounded-2xl bg-white/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-sm dark:bg-card/95">
      {/* ── Category Tabs ── */}
      <div className="mb-2 flex gap-1 px-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.label}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                cat.active
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Search Input ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por ciudad, zona o tipo de propiedad..."
          className="h-12 rounded-xl border-0 bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-brand"
        />
      </div>
    </div>
  );
}
