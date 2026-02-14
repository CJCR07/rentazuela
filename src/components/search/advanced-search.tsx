"use client";

import { useState } from "react";
import { 
  Search, Home, Car, Building2, MapPin, ChevronDown, X, Check, 
  Calendar, Users, Bed, DollarSign, CarFront, CalendarClock,
  Briefcase, Building
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { TOP_CITIES } from "@/lib/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

// Property types
const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartamento" },
  { id: "house", label: "Casa" },
  { id: "townhouse", label: "Townhouse" },
  { id: "penthouse", label: "Penthouse" },
  { id: "land", label: "Terreno" },
];

// Vehicle types
const VEHICLE_TYPES = [
  { id: "sedan", label: "Sedán" },
  { id: "suv", label: "SUV" },
  { id: "truck", label: "Pickup" },
  { id: "luxury", label: "Lujo" },
  { id: "economy", label: "Económico" },
];

// Commercial types
const COMMERCIAL_TYPES = [
  { id: "office", label: "Oficina" },
  { id: "retail", label: "Local Comercial" },
  { id: "warehouse", label: "Galpón/Bodega" },
  { id: "coworking", label: "Coworking" },
  { id: "restaurant", label: "Restaurante" },
];

// Price ranges for sale
const PRICE_RANGES_SALE = [
  { id: "0-50000", label: "Hasta $50,000" },
  { id: "50000-100000", label: "$50,000  - $100,000" },
  { id: "100000-250000", label: "$100,000 - $250,000" },
  { id: "250000-500000", label: "$250,000 - $500,000" },
  { id: "500000+", label: "Más de $500,000" },
];

// Price ranges for rent (monthly)
const PRICE_RANGES_RENT = [
  { id: "0-500", label: "Hasta $500/mes" },
  { id: "500-1000", label: "$500 - $1,000/mes" },
  { id: "1000-2500", label: "$1,000 - $2,500/mes" },
  { id: "2500-5000", label: "$2,500 - $5,000/mes" },
  { id: "5000+", label: "Más de $5,000/mes" },
];

// Bedrooms
const BEDROOM_OPTIONS = [
  { id: "1", label: "1+" },
  { id: "2", label: "2+" },
  { id: "3", label: "3+" },
  { id: "4", label: "4+" },
  { id: "5", label: "5+" },
];

interface AdvancedSearchProps {
  onCategoryChange?: (category: CategoryId) => void;
  defaultCategory?: CategoryId;
}

export function AdvancedSearch({ onCategoryChange, defaultCategory = "properties" }: AdvancedSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(defaultCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("sale");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [citySearch, setCitySearch] = useState<string>("");
  const [cityOpen, setCityOpen] = useState(false);
  
  // Additional filters
  const [propertyType, setPropertyType] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [commercialType, setCommercialType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  
  // Vacation price range (slider)
  const [vacationPriceRange, setVacationPriceRange] = useState<number[]>([50, 500]);

  const selectedCat = CATEGORIES.find((c) => c.id === selectedCategory)!;
  const SelectedIcon = selectedCat.icon;

  const handleCategoryChange = (category: CategoryId) => {
    setSelectedCategory(category);
    setSelectedSubcategory(SUBCATEGORIES[category][0].id);
    // Reset filters
    setPropertyType("");
    setVehicleType("");
    setCommercialType("");
    setPriceRange("");
    setBedrooms("");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests("");
    setPickupDate(undefined);
    setReturnDate(undefined);
    setVacationPriceRange([50, 500]);
    onCategoryChange?.(category);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.append("ciudad", selectedCity);
    if (selectedSubcategory) params.append("tipo", selectedSubcategory);
    
    // Category specific params
    if (selectedCategory === "properties") {
      if (propertyType) params.append("propiedad", propertyType);
      if (bedrooms) params.append("habitaciones", bedrooms);
      if (selectedSubcategory === "vacation") {
        if (checkIn) params.append("checkin", checkIn.toISOString());
        if (checkOut) params.append("checkout", checkOut.toISOString());
        if (guests) params.append("huespedes", guests);
        params.append("precioMin", vacationPriceRange[0].toString());
        params.append("precioMax", vacationPriceRange[1].toString());
      } else {
        if (priceRange) params.append("precio", priceRange);
      }
    } else if (selectedCategory === "vehicles") {
      if (vehicleType) params.append("vehiculo", vehicleType);
      if (selectedSubcategory === "rent") {
        if (pickupDate) params.append("pickup", pickupDate.toISOString());
        if (returnDate) params.append("return", returnDate.toISOString());
      }
      if (priceRange) params.append("precio", priceRange);
    } else if (selectedCategory === "commercial") {
      if (commercialType) params.append("local", commercialType);
      if (priceRange) params.append("precio", priceRange);
    }
    
    const basePath = selectedCategory === "vehicles" ? "/vehiculos" : 
                     selectedCategory === "commercial" ? "/locales" : "/propiedades";
    
    window.location.href = `${basePath}?${params.toString()}`;
  };

  const currentSubcategories = SUBCATEGORIES[selectedCategory];
  const isVacation = selectedCategory === "properties" && selectedSubcategory === "vacation";
  const isVehicleRent = selectedCategory === "vehicles" && selectedSubcategory === "rent";
  const isPropertyRent = selectedCategory === "properties" && selectedSubcategory === "rent";
  const isProperty = selectedCategory === "properties";
  const isVehicle = selectedCategory === "vehicles";
  const isCommercial = selectedCategory === "commercial";
  const isCommercialRent = selectedCategory === "commercial" && selectedSubcategory === "rent";

  // Get price range options based on category/subcategory
  const getPriceRangeOptions = () => {
    if (isVacation) return null; // Vacation uses slider
    if (isPropertyRent || isCommercialRent) return PRICE_RANGES_RENT;
    return PRICE_RANGES_SALE;
  };

  const priceRangeOptions = getPriceRangeOptions();

  return (
    <div className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                isSelected
                  ? "bg-brand text-white shadow-lg"
                  : "bg-card text-foreground hover:bg-muted border border-border shadow-sm"
              )}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Subcategory Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {currentSubcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubcategory(sub.id)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
              selectedSubcategory === sub.id
                ? "bg-brand/10 text-brand border border-brand/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Main Search Container */}
      <div className="rounded-2xl overflow-hidden bg-card border shadow-lg">
        {/* Property Search */}
        {isProperty && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px">
            {/* Location */}
            <div className="md:col-span-3  p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Ubicación
                </label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full text-left text-sm font-medium truncate text-foreground !h-6 flex items-center mt-1">
                      {selectedCity || "Toda Venezuela"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Buscar ciudad..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="mb-2"
                      />
                      <div className="max-h-[200px] overflow-y-auto">
                        <button
                          onClick={() => { setSelectedCity(""); setCitySearch(""); setCityOpen(false); }}
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                        >
                          Toda Venezuela
                        </button>
                        {TOP_CITIES
                          .filter(city => city.name.toLowerCase().includes(citySearch.toLowerCase()))
                          .map((city) => (
                            <button
                              key={city.name}
                              onClick={() => {
                                setSelectedCity(city.name);
                                setCitySearch("");
                                setCityOpen(false);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                            >
                              {city.name}, {city.state}
                            </button>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Vacation: Check-in / Sale&Rent: Property Type */}
            {isVacation ? (
              <>
                <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
                  <Calendar className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Check-in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full text-left text-sm font-medium text-foreground">
                          {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
                  <Calendar className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Check-out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full text-left text-sm font-medium text-foreground">
                          {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= (checkIn || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="md:col-span-2  p-4 flex items-start gap-3 border-l border-border">
                  <Users className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Huéspedes
                    </label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="h-6 border-0 p-0 text-sm font-medium focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
                  <Home className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Tipo de Propiedad
                    </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquiera</SelectItem>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
                  <DollarSign className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Precio
                    </label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                        <SelectValue placeholder="Cualquiera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquiera</SelectItem>
                        {priceRangeOptions?.map((range) => (
                          <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="md:col-span-2  p-4 flex items-start gap-3 border-l border-border">
                  <Bed className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Habitaciones
                    </label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                        <SelectValue placeholder="Cualquiera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquiera</SelectItem>
                        {BEDROOM_OPTIONS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Search Button */}
            <div className="md:col-span-1 bg-brand p-4 flex items-center justify-center">
              <Button 
                onClick={handleSearch}
                className="w-full h-full bg-transparent hover:bg-transparent text-white font-bold"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Vacation Price Range Slider */}
        {isVacation && (
          <div className=" px-6 py-4 border-t border-border">
            <div className="flex items-center gap-4">
              <DollarSign className="h-5 w-5 text-brand shrink-0" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Rango por noche: ${vacationPriceRange[0]} - ${vacationPriceRange[1]}
                </label>
                <Slider
                  value={vacationPriceRange}
                  onValueChange={setVacationPriceRange}
                  min={10}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Search */}
        {isVehicle && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px">
            {/* Location */}
            <div className="md:col-span-3  p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  {isVehicleRent ? "Lugar de Pickup" : "Ubicación"}
                </label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full text-left text-sm font-medium truncate text-foreground h-6 flex items-center">
                      {selectedCity || "Toda Venezuela"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Buscar ciudad..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="mb-2"
                      />
                      <div className="max-h-[200px] overflow-y-auto">
                        {TOP_CITIES
                          .filter(city => city.name.toLowerCase().includes(citySearch.toLowerCase()))
                          .map((city) => (
                            <button
                              key={city.name}
                              onClick={() => {
                                setSelectedCity(city.name);
                                setCitySearch("");
                                setCityOpen(false);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                            >
                              {city.name}, {city.state}
                            </button>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
              <CarFront className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Tipo de Vehículo
                </label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
              <DollarSign className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  {isVehicleRent ? "Precio por día" : "Precio"}
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    {isVehicleRent ? (
                      <>
                        <SelectItem value="0-50">Hasta $50/día</SelectItem>
                        <SelectItem value="50-100">$50 - $100/día</SelectItem>
                        <SelectItem value="100-200">$100 - $200/día</SelectItem>
                        <SelectItem value="200+">Más de $200/día</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="0-10000">Hasta $10,000</SelectItem>
                        <SelectItem value="10000-30000">$10,000 - $30,000</SelectItem>
                        <SelectItem value="30000-60000">$30,000 - $60,000</SelectItem>
                        <SelectItem value="60000+">Más de $60,000</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates for rental */}
            {isVehicleRent ? (
              <div className="md:col-span-2  p-4 flex items-start gap-3 border-l border-border">
                <CalendarClock className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Fecha Pickup
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full text-left text-sm font-medium text-foreground">
                        {pickupDate ? format(pickupDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2  p-4 flex items-start gap-3 border-l border-border">
                <Calendar className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Año
                  </label>
                  <Select>
                    <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                      <SelectValue placeholder="Cualquiera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Cualquiera</SelectItem>
                      <SelectItem value="2024">2024+</SelectItem>
                      <SelectItem value="2020">2020+</SelectItem>
                      <SelectItem value="2015">2015+</SelectItem>
                      <SelectItem value="2010">2010+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="md:col-span-1 bg-brand p-4 flex items-center justify-center">
              <Button 
                onClick={handleSearch}
                className="w-full h-full bg-transparent hover:bg-transparent text-white font-bold"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Commercial Search */}
        {isCommercial && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px">
            {/* Location */}
            <div className="md:col-span-4  p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Ubicación
                </label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full text-left text-sm font-medium truncate text-foreground h-6 flex items-center">
                      {selectedCity || "Toda Venezuela"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Buscar ciudad..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="mb-2"
                      />
                      <div className="max-h-[200px] overflow-y-auto">
                        {TOP_CITIES
                          .filter(city => city.name.toLowerCase().includes(citySearch.toLowerCase()))
                          .map((city) => (
                            <button
                              key={city.name}
                              onClick={() => {
                                setSelectedCity(city.name);
                                setCitySearch("");
                                setCityOpen(false);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                            >
                              {city.name}, {city.state}
                            </button>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Commercial Type */}
            <div className="md:col-span-4  p-4 flex items-start gap-3 border-l border-border">
              <Building className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Tipo de Local
                </label>
                <Select value={commercialType} onValueChange={setCommercialType}>
                  <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    {COMMERCIAL_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="md:col-span-3  p-4 flex items-start gap-3 border-l border-border">
              <DollarSign className="h-5 w-5 text-brand shrink-0 mt-[21px]" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Precio
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="!h-6 !bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 shadow-none [&>svg]:hidden mt-1">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    {isCommercialRent ? (
                      <>
                        <SelectItem value="0-1000">Hasta $1,000/mes</SelectItem>
                        <SelectItem value="1000-5000">$1,000 - $5,000/mes</SelectItem>
                        <SelectItem value="5000-20000">$5,000 - $20,000/mes</SelectItem>
                        <SelectItem value="20000+">Más de $20,000/mes</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="0-50000">Hasta $50,000</SelectItem>
                        <SelectItem value="50000-150000">$50,000 - $150,000</SelectItem>
                        <SelectItem value="150000-500000">$150,000 - $500,000</SelectItem>
                        <SelectItem value="500000+">Más de $500,000</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1 bg-brand p-4 flex items-center justify-center">
              <Button 
                onClick={handleSearch}
                className="w-full h-full bg-transparent hover:bg-transparent text-white font-bold"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
