"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Car,
  Building2,
  TrendingUp,
  Search,
  Menu,
  Heart,
  User,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Propiedades", href: "/propiedades", icon: Home },
  { label: "Vehículos", href: "/vehiculos", icon: Car },
  { label: "Locales", href: "/locales", icon: Building2 },
  { label: "Inversiones", href: "/inversiones", icon: TrendingUp },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
            <span className="text-gradient">Renta</span>
            <span className="text-foreground">zuela</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Favoritos">
            <Heart className="h-5 w-5" />
          </Button>
          <div className="mx-1 h-6 w-px bg-border" />
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth">
              <KeyRound className="mr-1.5 h-4 w-4" />
              Iniciar Sesión
            </Link>
          </Button>
          <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90" asChild>
            <Link href="/auth?tab=register">Registrarse</Link>
          </Button>
        </div>

        {/* ── Mobile Menu ── */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <SheetHeader>
                <SheetTitle className="text-left font-[family-name:var(--font-heading)]">
                  <span className="text-gradient">Renta</span>zuela
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 border-t pt-6">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/favoritos" onClick={() => setMobileOpen(false)}>
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/auth" onClick={() => setMobileOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-brand-gradient text-white hover:opacity-90">
                    <Link href="/auth?tab=register" onClick={() => setMobileOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
