"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FOOTER_SECTIONS = [
  {
    title: "Propiedades",
    links: [
      { label: "Apartamentos en Venta", href: "/propiedades?tipo=apartamento" },
      { label: "Casas en Venta", href: "/propiedades?tipo=casa" },
      { label: "Alquiler Largo Plazo", href: "/propiedades?modo=alquiler" },
      { label: "Alquiler Vacacional", href: "/propiedades?modo=shortterm" },
      { label: "Terrenos", href: "/propiedades?tipo=terreno" },
    ],
  },
  {
    title: "Vehículos y Más",
    links: [
      { label: "Vehículos en Venta", href: "/vehiculos?modo=venta" },
      { label: "Alquiler de Vehículos", href: "/vehiculos?modo=alquiler" },
      { label: "Locales Comerciales", href: "/locales" },
      { label: "Oportunidades de Inversión", href: "/inversiones" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Acerca de Nosotros", href: "/acerca" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
      { label: "Trabaja con Nosotros", href: "/empleo" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Centro de Ayuda", href: "/ayuda" },
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Política de Uso", href: "/uso-aceptable" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, href: "https://instagram.com/rentazuela", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/rentazuela", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com/company/rentazuela", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@rentazuela", label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t bg-white dark:bg-background">
      {/* ── Investment CTA with Newsletter ── */}
      <div className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 text-center text-white sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div className="max-w-xl">
            <h3 className="text-2xl font-black tracking-tighter sm:text-3xl">
              Pioneros en la nueva era inmobiliaria
            </h3>
            <p className="mt-2 text-sm font-medium text-white/90">
              Rentazuela conecta inversionistas con proyectos verificados. Únete
              a la plataforma de rentas más moderna del país.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-0 bg-white pl-10 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button className="h-12 shrink-0 bg-black px-6 font-black uppercase tracking-widest text-white transition-all hover:bg-black/80 active:scale-95">
              <Send className="mr-2 h-4 w-4" />
              Suscribir
            </Button>
          </div>
        </div>
      </div>

      {/* ── Links Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50">
                {section.title}
              </h4>
              <ul className="mt-6 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-muted-foreground transition-all hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-muted bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:px-6 md:flex-row md:justify-between lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-dark.svg"
              alt="Rentazuela"
              className="h-7 w-auto dark:block hidden"
            />
            <img
              src="/logo-light.svg"
              alt="Rentazuela"
              className="h-7 w-auto dark:hidden block"
            />
            <span className="text-xs font-bold text-muted-foreground">
              · 🇻🇪
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
            <a
              href="mailto:hola@rentazuela.com"
              className="flex items-center gap-2 transition-colors hover:text-brand"
            >
              <Mail className="h-4 w-4" />
              hola@rentazuela.com
            </a>
            <a
              href="tel:+584241234567"
              className="flex items-center gap-2 transition-colors hover:text-brand"
            >
              <Phone className="h-4 w-4" />
              +58 424 123 4567
            </a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-all duration-300 hover:scale-110 hover:bg-brand hover:text-white dark:bg-card"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-muted bg-muted/40 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          © {new Date().getFullYear()} Rentazuela. Minimal Architecture.
          Premium Living.
        </div>
      </div>
    </footer>
  );
}
