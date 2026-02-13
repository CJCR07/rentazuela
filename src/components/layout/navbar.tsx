"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Car,
  Building2,
  TrendingUp,
  Search,
  Menu,
  Heart,
  User,
  X,
  LogOut,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchModal } from "@/components/search/search-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Propiedades", href: "/propiedades", icon: Home },
  { label: "Vehículos", href: "/vehiculos", icon: Car },
  { label: "Locales", href: "/locales", icon: Building2 },
  { label: "Inversiones", href: "/inversiones", icon: TrendingUp, badge: "Nuevo" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // User initials for avatar
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={`glass sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        {/* ── Logo ── */}
        <Link href="/" className="group relative flex items-center transition-transform hover:scale-[1.02]">
          {/* Logo para modo oscuro (texto blanco) */}
          <img
            src="/logo-dark.svg"
            alt="Rentazuela"
            className="h-10 w-auto dark:block hidden"
          />
          {/* Logo para modo claro (texto oscuro) */}
          <img
            src="/logo-light.svg"
            alt="Rentazuela"
            className="h-10 w-auto dark:hidden block"
          />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              {link.label}
              {link.badge && (
                <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
          <ThemeToggle />
          
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full bg-brand/10 text-brand hover:bg-brand/20"
                >
                  <span className="text-sm font-bold">
                    {getInitials(user.email || "U")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/publicar" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Publicar Anuncio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/auth/login">Acceder</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-brand px-6 font-bold text-white shadow-lg shadow-brand/20 transition-all hover:opacity-90 active:scale-95"
                asChild
              >
                <Link href="/auth/register">Publicar Gratis</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Mobile Menu ── */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <SheetHeader>
                <SheetTitle className="text-left">
                <img
                  src="/logo-dark.svg"
                  alt="Rentazuela"
                  className="h-8 w-auto dark:block hidden"
                />
                <img
                  src="/logo-light.svg"
                  alt="Rentazuela"
                  className="h-8 w-auto dark:hidden block"
                />
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
                      {link.badge && (
                        <span className="ml-auto rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 border-t pt-6">
                <div className="flex flex-col gap-2">
                  {loading ? (
                    <div className="h-10 animate-pulse rounded bg-muted" />
                  ) : user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium truncate text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/publicar" onClick={() => setMobileOpen(false)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Publicar Anuncio
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/perfil" onClick={() => setMobileOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Mi Perfil
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/favoritos" onClick={() => setMobileOpen(false)}>
                          <Heart className="mr-2 h-4 w-4" />
                          Favoritos
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-brand text-white hover:opacity-90">
                        <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                          Registrarse
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
