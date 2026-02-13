"use client";

import { useState } from "react";
import { Search, Home, Car, Building2, MapPin, ChevronDown, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TOP_CITIES } from "@/lib/constants";

export const CATEGORIES = [
  { id: "properties", label: "Propiedades", icon: Home },
  { id: "vehicles", label: "Vehículos", icon: Car },
  { id: "commercial", label: "Locales", icon: Building2 },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

// Subcategories for each category
const SUBCATEGORIES: Record<CategoryId, { id: string; label: string }[]> = {
  properties: [
    { id: "sale", label: "Venta" },
    { id: "rent", label: "Alquiler Largo Plazo" },
    { id: "vacation", label: "Alquiler Vacacional" },
  ],
  vehicles: [
    { id: "sale", label: "Venta" },
    { id: "rent", label: "Alquiler" },
  ],
  commercial: [
    { id: "sale", label: "Venta" },
    { id: "rent", label: "Alquiler" },
  ],
};

interface SearchBarProps {
  onCategoryChange?: (category: CategoryId) => void;
  defaultCategory?: CategoryId;
}

export function SearchBar({ onCategoryChange, defaultCategory = "properties" }: SearchBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(defaultCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("sale");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [citySearch, setCitySearch] = useState<string>("");
  const [open, setOpen] = useState(false);

  const selectedCat = CATEGORIES.find((c) => c.id === selectedCategory)!;
  const SelectedIcon = selectedCat.icon;

  const handleCategoryChange = (category: CategoryId) => {
    setSelectedCategory(category);
    // Reset to first subcategory of new category
    setSelectedSubcategory(SUBCATEGORIES[category][0].id);
    onCategoryChange?.(category);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const clearCity = () => {
    setSelectedCity("");
  };

  const handleSearch = () => {
    // Build search URL with params
    const params = new URLSearchParams();
    if (selectedCity) params.append("ciudad", selectedCity);
    if (searchQuery) params.append("q", searchQuery);
    if (selectedSubcategory) params.append("tipo", selectedSubcategory);
    
    const basePath = selectedCategory === "vehicles" ? "/vehiculos" : 
                     selectedCategory === "commercial" ? "/locales" : "/propiedades";
    
    window.location.href = `${basePath}?${params.toString()}`;
  };

  const currentSubcategories = SUBCATEGORIES[selectedCategory];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Search Bar */}
      <div className="w-full overflow-hidden rounded-xl p-1">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* ── Category Dropdown ── */}
          <div className="shrink-0 p-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-12 w-full items-center justify-between gap-3 rounded-lg bg-brand px-4 text-left text-xs font-bold text-white shadow-md shadow-brand/20 transition-all hover:opacity-90 md:w-auto">
                  <span className="flex items-center gap-2">
                    <SelectedIcon className="h-4 w-4" />
                    {selectedCat.label}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = cat.id === selectedCategory;
                  return (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex cursor-pointer items-center gap-2 ${
                        isSelected ? "bg-muted font-semibold" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Location Combobox with Search ── */}
          <div className="relative shrink-0 p-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="flex h-12 w-full items-center justify-between gap-2 rounded-lg px-4 text-left text-sm font-medium text-foreground transition-all hover:bg-muted md:w-[220px]">
                  <span className="flex items-center gap-2 truncate">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {selectedCity ? (
                      <span className="truncate">{selectedCity}</span>
                    ) : (
                      <span className="text-muted-foreground">Ubicación</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    {selectedCity && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCity();
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[280px] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar ciudad o estado..."
                    value={citySearch}
                    onInput={(e) => setCitySearch(e.currentTarget.value)}
                    className="h-10"
                  />
                  <CommandList>
                    <CommandEmpty>No se encontró ninguna ciudad.</CommandEmpty>
                    <CommandGroup heading="Principales ciudades">
                      {TOP_CITIES
                        .filter(city => {
                          const search = citySearch.toLowerCase();
                          return city.name.toLowerCase().includes(search) ||
                                 city.state.toLowerCase().includes(search);
                        })
                        .map((city) => (
                          <CommandItem
                            key={city.name}
                            value={city.name}
                            onSelect={() => {
                              handleCitySelect(city.name);
                              setCitySearch("");
                              setOpen(false);
                            }}
                            className="flex cursor-pointer items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span>{city.name}</span>
                              <span className="text-xs text-muted-foreground">{city.state}</span>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedCity === city.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* ── Search Input ── */}
          <div className="relative flex-1 p-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="¿Qué estás buscando hoy?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 min-w-[260px] border-0 bg-transparent pl-12 text-base font-medium transition-all focus-visible:ring-0 focus-visible:bg-muted/30 md:min-w-[320px]"
            />
          </div>

          {/* ── Action Button ── */}
          <div className="p-1 md:pr-1">
            <Button 
              onClick={handleSearch}
              className="h-12 w-full bg-brand px-8 font-black uppercase tracking-widest text-white shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98] md:w-auto md:rounded-lg"
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* Subcategory Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {currentSubcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubcategory(sub.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
              selectedSubcategory === sub.id
                ? "bg-white text-brand shadow-md dark:bg-brand dark:text-white"
                : "bg-white/10 text-white hover:bg-white/20 dark:bg-white/10"
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
}
