# Rentazuela — Plan de Implementación

> Marketplace inmobiliario para Venezuela — Propiedades, Vehículos, Locales Comerciales e Inversiones.

---

## 📋 Resumen del Proyecto

**Rentazuela** es una plataforma marketplace diseñada para conectar a venezolanos con oportunidades inmobiliarias, vehículos y espacios comerciales. La plataforma opera con precios en USD (referencia en VES) y está optimizada para el mercado venezolano.

### Stack Tecnológico
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.1.6 | Framework React con App Router |
| React | 19 | UI Library |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | v4 | Estilos |
| shadcn/ui | latest | Componentes UI |
| Supabase | — | Database, Auth, Storage |
| Stripe | — | Pagos |
| Vercel | — | Deployment |

---

## Fase 1: Fundamentos del Proyecto ✅

### Objetivo
Establecer la base técnica del proyecto con configuraciones iniciales.

### Tareas Completadas
- [x] Inicializar proyecto Next.js 16 con TypeScript
- [x] Configurar Tailwind CSS v4 con tema oscuro por defecto
- [x] Instalar y configurar shadcn/ui (estilo "new-york")
- [x] Configurar Supabase Client
- [x] Crear estructura de carpetas del proyecto
- [x] Configurar ESLint y Prettier
- [x] Setup de variables de entorno (.env.local)

### Estructura de Carpetas
```
src/
├── app/              # Next.js App Router
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Navbar, Footer
│   ├── home/         # Homepage sections
│   └── listings/     # Listing components
├── lib/
│   ├── supabase/     # Database clients
│   ├── constants/    # App constants
│   └── utils.ts      # cn() utility
└── types/            # TypeScript types
```

### Archivos Clave Creados
- `middleware.ts` — Protección de rutas
- `src/lib/supabase/client.ts` — Cliente Supabase
- `src/lib/supabase/server.ts` — Server Client
- `src/lib/constants/index.ts` — Constantes globales
- `src/types/database.ts` — Tipos de Supabase

---

## Fase 2: Sistema de Autenticación ✅

### Objetivo
Implementar un sistema completo de autenticación con perfiles de usuario.

### Tareas Completadas
- [x] Crear tabla `profiles` en Supabase (vinculada a auth.users)
- [x] Página de Login (`/auth/login`)
- [x] Página de Registro (`/auth/register`)
- [x] Autenticación OAuth (Google, GitHub)
- [x] Middleware de protección de rutas
- [x] Formularios con validación
- [x] Manejo de estados de autenticación

### Tablas de Base de Datos
```sql
-- auth.users (manejada por Supabase Auth)
-- profiles (tabla personalizada)
- id (uuid, PK, vinculado a auth.users)
- email (text)
- full_name (text)
- avatar_url (text)
- phone (text)
- location (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Rutas Protegidas
- `/publicar` — Crear anuncio
- `/dashboard` — Panel de usuario
- `/mis-anuncios` — Gestión de listings
- `/favoritos` — Guardados

---

## Fase 3: Sistema de Búsqueda Avanzada ✅

### Objetivo
Crear un buscador inteligente que se adapte a cada categoría y subcategoría.

### Tareas Completadas
- [x] Buscador con 3 categorías principales:
  - Propiedades (Venta, Alquiler Largo Plazo, Alquiler Vacacional)
  - Vehículos (Venta, Alquiler)
  - Locales Comerciales (Venta, Alquiler)
- [x] Campos dinámicos por categoría:
  | Categoría | Campos |
  |-----------|--------|
  | Propiedades Venta | Ubicación, Tipo, Precio, Habitaciones |
  | Propiedades Alquiler | Ubicación, Tipo, Precio/mes, Habitaciones |
  | Propiedades Vacacional | Ubicación, Check-in, Check-out, Huéspedes, Rango de precio/noche |
  | Vehículos Venta | Ubicación, Tipo, Precio, Año |
  | Vehículos Alquiler | Lugar pickup, Tipo, Precio/día, Fecha pickup |
  | Locales Venta | Ubicación, Tipo, Precio |
  | Locales Alquiler | Ubicación, Tipo, Precio/mes |
- [x] Integración de componentes shadcn/ui:
  - Select dropdowns
  - Calendar (date picker)
  - Slider (rango de precios)
  - Popover
- [x] Lógica de precios inteligente:
  - Venta: sin sufijo (ej: `$50,000`)
  - Alquiler propiedades/locales: `/mes`
  - Alquiler vehículos: `/día`
  - Vacacional: `/noche`
- [x] UI transparente sin fondos
- [x] Hero slider con cambio de categorías
- [x] Sincronización de background con categoría seleccionada

### Componentes Principales
- `AdvancedSearch` — Buscador principal con campos dinámicos
- `HeroSlider` — Hero con imágenes de fondo
- `SearchBar` (legacy) — Buscador básico

---

## Fase 4: Listados y Páginas de Categoría ✅

### Objetivo
Mostrar listings reales desde Supabase con páginas de categoría funcionales.

### Tareas Completadas
- [x] Conectar búsqueda a base de datos real (Server Actions)
- [x] Tabla `listings` ya existe en Supabase
- [x] Página de resultados de búsqueda (propiedades, vehiculos, locales)
- [x] Página de detalle de listing (/listing/[id])
- [x] Paginación infinita ("Cargar más")
- [x] Galería de imágenes con Lightbox estilo Airbnb
- [x] Componentes nuevos: ListingCard, ListingGallery, ListingDetail, LoadMoreButton
- [ ] Sistema de filtros laterales (pendiente)
- [ ] Ordenamiento avanzado (pendiente)

### Estructura de Tabla `listings`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- category (enum: properties, vehicles, commercial)
- subcategory (enum: sale, rent, vacation)
- title (text)
- description (text)
- price (numeric)
- price_currency (default: USD)
- location (text)
- state (text)
- images (text[])
- features (jsonb)
- status (enum: active, pending, sold, inactive)
- created_at (timestamp)
- updated_at (timestamp)
```

### Campos Específicos por Categoría
**Propiedades:**
- property_type (apartment, house, townhouse, penthouse, land)
- bedrooms
- bathrooms
- square_meters
- parking_spaces

**Vehículos:**
- vehicle_type (sedan, suv, truck, luxury, economy)
- year
- mileage
- transmission
- fuel_type

**Locales:**
- commercial_type (office, retail, warehouse, coworking, restaurant)
- square_meters

### Páginas a Crear
- `/propiedades` — Listado de propiedades
- `/vehiculos` — Listado de vehículos
- `/locales` — Listado de locales
- `/inversiones` — Oportunidades de inversión
- `/[category]/[id]` — Detalle de listing

---

## Fase 5: Gestión de Listings (CRUD)

### Objetivo
Permitir a usuarios crear, editar y gestionar sus anuncios.

### Tareas
- [ ] Formulario multi-paso para crear listing
- [ ] Sistema de upload de imágenes (Supabase Storage)
- [ ] Editor de descripción enriquecido
- [ ] Validación de campos
- [ ] Preview antes de publicar
- [ ] Editar listing existente
- [ ] Eliminar listing
- [ ] Marcar como vendido/alquilado
- [ ] Renovación de anuncios

### Flujo de Creación
1. Seleccionar categoría
2. Completar información básica
3. Agregar ubicación (mapa integrado)
4. Subir imágenes (máx. 10)
5. Definir características específicas
6. Establecer precio y moneda
7. Preview y publicación

### Límites por Tier
| Tier | Listings Activos | Imágenes/Listing | Featured |
|------|------------------|------------------|----------|
| Free | 1 | 3 | No |
| Premium | 10 | 10 | 1/mes |
| Pro | Ilimitado | 20 | 5/mes |

---

## Fase 6: Panel de Usuario

### Objetivo
Dashboard para que usuarios gestionen su actividad en la plataforma.

### Tareas
- [ ] Dashboard principal con estadísticas
- [ ] Mis Anuncios — gestión de listings
- [ ] Favoritos — listings guardados
- [ ] Mensajes — sistema de consultas
- [ ] Configuración de perfil
- [ ] Cambiar contraseña
- [ ] Notificaciones
- [ ] Historial de pagos

### Componentes del Dashboard
- Stats cards (vistas, consultas, conversiones)
- Lista de listings con acciones rápidas
- Gráfico de rendimiento
- Alertas y notificaciones

---

## Fase 7: Sistema de Mensajería

### Objetivo
Comunicación directa entre compradores y vendedores.

### Tareas
- [ ] Tabla `conversations` y `messages`
- [ ] UI de chat en tiempo real
- [ ] Notificaciones de mensajes nuevos
- [ ] Mensajes predefinidos ("¿Sigue disponible?")
- [ ] Bloquear usuarios
- [ ] Reportar conversaciones

### Estructura
```sql
conversations:
- id (uuid)
- listing_id (uuid)
- buyer_id (uuid)
- seller_id (uuid)
- created_at

messages:
- id (uuid)
- conversation_id (uuid)
- sender_id (uuid)
- content (text)
- read (boolean)
- created_at
```

---

## Fase 8: Panel de Administración

### Objetivo
Herramientas para moderar y administrar la plataforma.

### Tareas
- [ ] Dashboard de admin
- [ ] Moderación de listings (aprobar/rechazar)
- [ ] Gestión de usuarios
- [ ] Reportes de contenido
- [ ] Estadísticas globales
- [ ] Configuración de precios
- [ ] Gestión de categorías

---

## Fase 9: Optimización y Escalabilidad

### Objetivo
Mejorar performance, SEO y experiencia de usuario antes del crecimiento masivo.

### Tareas
- [ ] Optimización de imágenes (WebP, lazy loading)
- [ ] Implementar búsqueda con Algolia/Meilisearch
- [ ] Cache con Redis
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] SEO avanzado (meta tags, sitemap)
- [ ] Analytics (Google Analytics, Hotjar)
- [ ] Testing (unit, integration, e2e)

---

## Fase 10: Monetización y Suscripciones

### Objetivo
Generar ingresos mediante suscripciones y listings destacados.

### Tareas
- [ ] Integración Stripe
- [ ] Tabla `subscriptions`
- [ ] Tabla `payments`
- [ ] Planes de suscripción:
  - **Free**: $0 — 1 listing, 3 fotos
  - **Premium**: $9.99/mes — 10 listings, 10 fotos, 1 featured
  - **Pro**: $24.99/mes — Ilimitado, 20 fotos, 5 featured
- [ ] Checkout de pago
- [ ] Facturación
- [ ] Cancelación y cambio de plan
- [ ] Listings destacados (Featured)

### Modelo de Ingresos
1. Suscripciones mensuales
2. Listings destacados individuales
3. Banner advertising (futuro)

---

## Fase 11: Funcionalidades Avanzadas

### Objetivo
Características premium para diferenciar la plataforma.

### Tareas
- [ ] Verificación de identidad (KYC)
- [ ] Verificación de listings (sello "Verificado")
- [ ] Tour virtual 360°
- [ ] Calculadora de hipotecas
- [ ] Comparador de listings
- [ ] Alertas de búsqueda (email/push)
- [ ] Recomendaciones con IA
- [ ] Integración con WhatsApp Business

---

## Checklist de Features

### MVP (Fases 1-5)
- [x] Autenticación completa
- [x] Búsqueda avanzada
- [x] Listings reales (conexión BD)
- [x] Página de detalle con galería
- [x] Paginación infinita
- [ ] Crear/editar listings
- [ ] Upload de imágenes
- [ ] Perfil de usuario

### V1.0 (Fases 6-7)
- [x] Dashboard completo
- [ ] Mensajería

### V1.5 (Fases 8-9)
- [ ] Panel admin básico
- [ ] Optimización y escalabilidad

### V2.0 (Fases 10-11)
- [ ] Suscripciones y monetización
- [ ] Featured listings
- [ ] Búsqueda avanzada (Algolia)
- [ ] Verificaciones
- [ ] Tours virtuales
- [ ] App móvil (PWA)
- [ ] IA recomendaciones

---

## Notas Técnicas

### Convenciones de Código
- Componentes: PascalCase (`HeroSlider.tsx`)
- Archivos: kebab-case (`hero-slider.tsx`)
- Funciones: camelCase (`handleSearch`)
- Constantes: SCREAMING_SNAKE_CASE

### Estilos
- Tailwind CSS v4 con `@import "tailwindcss"`
- CSS variables para colores de marca
- `cn()` utility para clases condicionales
- Dark mode por defecto

### Supabase
- Row Level Security (RLS) obligatorio
- Políticas por user_id
- Storage buckets públicos para imágenes

### Performance
- Server Components por defecto
- Client Components solo cuando necesario
- Suspense boundaries
- Image optimization con next/image

---

## Estado Actual

**Fases completadas:** 6/11 ✅
**Próxima fase:** Fase 7 — Sistema de Mensajería

### Últimos Cambios
- Server Actions para listings (getListings, getListingById, getSimilarListings)
- Página de propiedades conectada a BD real con paginación infinita
- Página de detalle con galería lightbox estilo Airbnb/Zillow
- Componente ListingDetail con contacto del propietario
- Componentes ListingCard adaptados para datos reales

### Próximos Pasos Inmediatos
1. Implementar filtros laterales en páginas de categoría
2. Crear formulario multi-paso para publicar listings
3. Sistema de upload de imágenes (Supabase Storage)
4. Panel de usuario para gestionar anuncios

---

*Última actualización: 2026-02-13*
