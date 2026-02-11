import Link from "next/link";
import {
  Home,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

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
  return (
    <footer className="border-t bg-card">
      {/* ── Investment CTA ── */}
      <div className="bg-brand-gradient">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center text-white sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)]">
              🏗️ Oportunidad de Inversión: Pioneros en Venezuela
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Conecta con constructoras verificadas y descubre proyectos inmobiliarios antes que nadie.
            </p>
          </div>
          <Link
            href="/inversiones"
            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition-transform hover:scale-105"
          >
            Explorar Inversiones →
          </Link>
        </div>
      </div>

      {/* ── Links Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:px-6 md:flex-row md:justify-between lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">
              <span className="text-gradient">Renta</span>zuela
            </span>
            <span className="text-xs text-muted-foreground">
              · Hecho en Venezuela 🇻🇪
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="mailto:contacto@rentazuela.com" className="flex items-center gap-1 hover:text-foreground">
              <Mail className="h-3.5 w-3.5" />
              contacto@rentazuela.com
            </a>
            <a href="tel:+584241234567" className="flex items-center gap-1 hover:text-foreground">
              <Phone className="h-3.5 w-3.5" />
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
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rentazuela. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
