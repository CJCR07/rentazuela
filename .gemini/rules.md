# Rentazuela — Project Rules

## Proyecto

Rentazuela es un marketplace unificado para Venezuela: propiedades (venta/alquiler), vehículos, locales comerciales e inversiones inmobiliarias. Dual currency (USD/VES), bilingüe (ES/EN), contacto por WhatsApp.

## Tech Stack (Feb 2026)

- **Next.js 16.1** (App Router, React 19.2, Turbopack)
- **Tailwind CSS 4.1** (CSS-first, `@theme` tokens)
- **shadcn/ui 3.8** (Radix UI unificado, RTL support)
- **Supabase** (PostgreSQL, Auth, Storage, Edge Functions, JS SDK 2.95)
- **Mapbox GL JS 3.18** (mapas interactivos)
- **React Hook Form + Zod** (forms con validación)
- **Sonner** (toasts), **Lucide React** (icons), **Framer Motion** (animaciones)
- **Vercel** (deploy)

## Reglas de código

- Código en **inglés**, contenido en **español** (i18n)
- Server Components por defecto, Client Components solo cuando se necesite interactividad
- Tailwind tokens en `@theme`, nunca inline styles
- Componentes shadcn/ui — customizar via CSS variables, no crear desde cero
- Forms con React Hook Form + Zod, validación server-side y client-side
- Estado via React Server Components + URL search params, evitar estado global

## Estructura

```
src/
├── app/
│   ├── (auth)/          # Login, registro, onboarding
│   ├── (main)/          # Homepage, búsqueda, detalle
│   ├── (dashboard)/     # Mis listings, publicar, estadísticas
│   └── (admin)/         # Panel admin
├── components/
│   ├── ui/              # shadcn (auto-generados)
│   ├── listings/        # ListingCard, ListingGrid, ListingDetail
│   ├── search/          # SearchBar, Filters, MapView
│   ├── layout/          # Header, Footer, Sidebar, MobileNav
│   └── shared/          # PrecioDual, Badge, ShareButton
├── lib/
│   ├── supabase/        # Cliente, queries, types
│   ├── utils/           # formatPrice, formatDate
│   └── constants/       # Enums, config
├── hooks/               # Custom hooks
├── types/               # TypeScript types globales
└── styles/              # CSS global + theme tokens
```

## Naming

- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Rutas: `kebab-case`
- DB: `snake_case`
- Env: `SCREAMING_SNAKE`

## Git

- Branches: `feature/`, `fix/`, `hotfix/`
- Commits: Conventional Commits — `feat:`, `fix:`, `docs:`, `style:`
- PRs: `feature/*` → `develop` → `main`

## Tiers de usuario

- 🆓 **Free**: 1 listing por categoría
- 💼 **Pro**: Hasta 25 listings (asesores)
- 🏢 **Business**: Ilimitado (inmobiliarias, rent-a-car, concesionarios)
- 🏗️ **Developer**: Ilimitado + proyectos especiales (constructoras)

## MCPs disponibles

- **GitHub**: Repos, branches, PRs
- **Supabase**: Migrations, SQL, Edge Functions, types
- **Context7**: Docs actualizados de librerías

## Documentos de planificación

Todos en `.gemini/antigravity/brain/b946e220-c458-4930-bfc0-279e5edfffc6/`:

- `implementation_plan.md` — Concepto, arquitectura, DB schema
- `features.md` — 18 módulos, ~100 features, tiers, MVP/Post-MVP
- `user_flows.md` — Flujos de publicador y comprador
- `platform_review.md` — Review de Zillow, Airbnb, CarGurus, Turo, Idealista
- `agents.md` — Agentes AI, workflows, reglas detalladas
