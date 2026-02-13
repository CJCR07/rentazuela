# Rentazuela — AI Agent Guide

## Build/Lint/Test Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (run before committing major changes)
npm run lint         # ESLint check (MUST pass before committing)
npm run start        # Start production server
```

**Testing**: No test suite configured. TypeScript strict mode + ESLint provide validation.

## Project Overview

Marketplace web app for Venezuela — properties, vehicles, commercial spaces, investments. Dual-currency pricing (USD/VES). All UI text in Spanish.

**Stack**: Next.js 16.1.6 · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui (new-york style) · Supabase

## Code Style

### Imports
- Use `@/` path alias for all local imports: `@/components/ui/button`, `@/lib/utils`
- Order: React/Next imports → Third-party → Local (blank lines between groups)
- Type imports: `import type { ... }` for types only

### Formatting
- Double quotes for strings (Prettier default)
- Semicolons at statement ends
- Trailing commas in multiline structures

### Components
- Client components: `"use client"` directive at top of file
- Server components: no directive (default)
- Export named functions: `export function ComponentName() {}`
- File naming: kebab-case (`featured-section.tsx` → `FeaturedSection`)

```typescript
// Component template
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  title: string;
}

export function Component({ title }: ComponentProps) {
  return <div>{title}</div>;
}
```

### Types
- Use auto-generated Supabase types from `@/types/database`
- Convenience aliases in `@/types/index.ts`: `Listing`, `Profile`, etc.
- Prefer `type` keyword for type aliases: `export type ListingCategory = ...`
- Interface for component props only

### Naming Conventions
- **Components**: PascalCase (`HeroSlider`, `ListingCard`)
- **Files**: kebab-case (`hero-slider.tsx`)
- **Variables/functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE (`SITE_NAME`, `TIER_LIMITS`)
- **CSS variables**: kebab-case (`--brand`, `--brand-hover`)

### Comments
```typescript
/* ── Section Divider ── */
// Inline comment for quick notes
/** JSDoc for public APIs */
```

### Styling
- Tailwind v4 with `@import "tailwindcss"` (not `@tailwind` directives)
- Use `cn()` from `@/lib/utils` for conditional class merging
- Brand color: `bg-brand`, `text-brand` (Radiant Red)
- Dark mode via `next-themes` — use CSS variables

### Error Handling
- Server actions: try/catch with descriptive error messages
- Silent catches only when appropriate (e.g., cookie setting in middleware)
- Log errors to console in development

```typescript
try {
  // operation
} catch (error) {
  console.error("Operation failed:", error);
  throw new Error("User-friendly message");
}
```

## Supabase Usage

```typescript
// Client-side
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server-side (async!)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
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

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/constants/index.ts` | `TIER_LIMITS`, `STATES`, `NAV_ITEMS` |
| `src/types/database.ts` | Auto-generated Supabase types |
| `src/types/index.ts` | Convenience type aliases |
| `src/app/globals.css` | Tailwind + CSS variables |

## Common Tasks

**Add shadcn component**: `npx shadcn add <component>`

**Add new page**: Create `src/app/[route]/page.tsx` with default export

**Regenerate database types**:
```bash
npx supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
```

## Security

- Never commit `.env.local`
- Never log or expose `SUPABASE_SERVICE_ROLE_KEY`
- Input validation required on all user inputs
- RLS policies must be configured for production

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Optional: `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SITE_URL`
