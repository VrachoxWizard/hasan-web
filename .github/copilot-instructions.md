# Produkt Auto - AI Coding Agent Instructions

## Project Overview

Next.js 16 (App Router) vehicle dealership site with **Croatian/English/German i18n**, a custom HR-only CMS, and Zustand state management. Focuses on premium used vehicles with comparison, favorites, and financing calculator features.

## Key Architecture Patterns

### Internationalization (next-intl)

- **Routing**: Locale-prefixed routes via `[locale]` dynamic segment. Croatian (default) has no prefix, EN/DE use `/en`, `/de`
- **Locales**: Defined in `src/i18n/routing.ts` as `["hr", "en", "de"]`
- **Navigation**: Always use `Link` from `@/i18n/navigation`, never Next.js Link directly
- **Translations**: Access via `useTranslations("namespace")` hook. Message files in `src/i18n/messages/{locale}.json`
- **Server Components**: Call `await setRequestLocale(locale)` at top of page components for proper locale context

### State Management (Zustand + Persist)

- **Hydration Pattern**: All persisted stores use `skipHydration: true` and manual rehydration via `StoreHydration` component
- **Critical**: Check `hasHydrated` state before rendering UI dependent on store data to prevent SSR/client mismatches
- **Example**: `usporediStore` limits vehicle comparison to 3 items, stores in localStorage as `usporedi-storage`
- **Stores**: `favoritiStore` (favorites), `usporediStore` (comparison)

### Custom CMS (Prisma + SQLite)

- **CMS Route**: Admin UI is at `/cms` (login at `/cms/login`). CMS is HR-only and intentionally not locale-prefixed.
- **DB**: Prisma + SQLite. Vehicles and images are stored in the database.
- **Auth**: Single admin user via env vars + signed cookie session (`cms_session`).
- **Uploads**: Images are saved to `public/uploads` by `src/app/api/cms/upload/route.ts`.
- **CMS Design**: Modern, polished UI with gradient backgrounds, animated status messages, and drag-and-drop vehicle management.
- **Features**:
  - Dashboard (`/cms`): Drag-and-drop vehicles between "Vozila" and "Ekskluzivna vozila" cards
  - Add Vehicle (`/cms/vozila/novo`): Multi-section form with image upload, validation, and inline help
  - Edit Vehicle (`/cms/vozila/[id]`): Same form as add, pre-populated with vehicle data
  - Delete: Confirmation dialog ("Jeste li sigurni?") before deletion, with visual feedback
  - Login (`/cms/login`): Gradient background, animated form with icons
- **Components**:
  - `CmsDashboardClient.tsx`: Main dashboard with drag-and-drop and delete functionality
  - `VehicleFormClient.tsx`: Shared form for add/edit with 4 main sections (Osnovni podaci, Tehničke specifikacije, Opis i oprema, Slike)
- **Hydration Fix**: Use `suppressHydrationWarning` on Select components to prevent Radix UI ID mismatch warnings

### Design System & Styling

- **Color System**: Custom semantic tokens documented in `docs/COLOR_SYSTEM.md`
  - Use `text-savings` and `text-savings-label` for price discounts (NOT `text-success`)
  - Bronze/copper for "Ušteda" labels, teal-green for discounted prices
- **Design Tokens**: Centralized in `src/lib/designTokens.ts` - use these constants instead of hardcoded values
- **UI Components**: Radix UI + shadcn/ui in `src/components/ui/`. Modify via `components.json` config
- **CMS Styling Patterns**:
  - Gradient top borders on cards: `h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50`
  - Icon containers: `w-10 h-10 rounded-lg/xl bg-accent/10` with centered icons
  - Status messages: Animated with icons (AlertCircle, Loader2, CheckCircle2) and color-coded backgrounds
  - Buttons: Gradient primary buttons with shadow effects, outline with hover states
  - Form inputs: `h-11` height, `border-border/50`, `focus-visible:ring-accent`
  - Hover effects: `hover:shadow-xl transition-shadow duration-300`

### Data & Validation

- **Vehicle Type**: `Vozilo` interface in `src/types/vozilo.ts` defines all vehicle properties
- **Validation**: Zod schemas in `src/lib/schemas.ts` with **localized error messages**
  - Use `getContactFormSchema(locale)` for locale-specific validation
- **Honeypot**: Contact forms include `hp` field for spam prevention (should remain empty)

## Critical Developer Workflows

### Testing (Vitest + Testing Library)

```bash
npm test              # Run tests
npm run test:ui       # Interactive UI mode
npm run test:coverage # With coverage (thresholds: 80%)
```

- **Setup**: `src/__tests__/setup.ts` mocks `next-intl` and `@/i18n/navigation`
- **Pattern**: Tests colocated in `src/__tests__/{components,lib,stores}/`
- **i18n Mocking**: Uses Croatian messages by default. Access via mocked `useTranslations`

### Running Development

```bash
npm run dev    # Starts dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

- **CMS**: Access at `http://localhost:3000/cms` after dev server starts
- **Hot Reload**: Works for code changes; locale changes require page refresh

### Environment Variables Required

```env
NEXT_PUBLIC_SITE_URL=https://produktauto.com
DATABASE_URL=file:./data/app.db
CMS_ADMIN_USERNAME=admin
CMS_ADMIN_PASSWORD=<strong-password>
CMS_SESSION_SECRET=<long-random-string>
CONTACT_EMAIL=produktauto@gmail.com
# Optional (not yet integrated):
# RESEND_API_KEY=<for-future-email-integration>
```

## Common Patterns & Conventions

### Client/Server Component Split

- **Server Default**: All components are Server Components unless marked `"use client"`
- **Client Indicators**: Hooks (useState, useEffect), event handlers, browser APIs, Zustand stores
- **Dynamic Imports**: Use for heavy client components (e.g., `QuickViewModal` in `VoziloCard.tsx`)

### Path Aliases

- **`@/*`**: Maps to `src/*` (configured in `tsconfig.json`)
- Always use absolute imports: `import { Vozilo } from "@/types/vozilo"`

### Component File Naming

- **Pages**: `page.tsx` in route folders
- **Layouts**: `layout.tsx` with locale support
- **Components**: PascalCase files (e.g., `VoziloCard.tsx`, `FloatingWhatsApp.tsx`)

### Contact Information

- **Single Source**: All contact details in `src/lib/constants.ts` under `CONTACT` and `WORKING_HOURS` exports
- Never hardcode phone numbers, addresses, or social links - always import from constants

### Image Optimization

- **Next.js Image**: Always use `next/image` with `priority={true}` for above-fold images
- **Allowed Domains**: Configured in `next.config.ts` (unsplash, pexels, etc.)
- **Formats**: AVIF + WebP with quality [75, 85]

## Anti-Patterns to Avoid

- ❌ Using `next/link` instead of `@/i18n/navigation` Link
- ❌ Accessing Zustand stores before hydration check
- ❌ Hardcoding colors instead of using design tokens
- ❌ Using `text-success` for price discounts (use `text-savings`)
- ❌ Creating localized schemas without checking `getContactFormSchema` pattern
- ❌ Rendering vehicle comparison UI before checking `hasHydrated` flag
- ❌ Forgetting `suppressHydrationWarning` on Radix Select components in forms
- ❌ Not adding confirmation dialogs for destructive actions (like delete)

## CMS Development Guidelines

### Dashboard Pattern

- Use drag-and-drop with clear visual feedback (GripVertical icons, hover states)
- Vehicle cards show: icon, title, year, price, position badge (for exclusive)
- Action buttons grouped: Edit (accent), Delete (destructive)
- Empty states with centered icons and helpful messages

### Form Pattern (Add/Edit Vehicle)

- **4-section structure**: Osnovni podaci, Tehničke specifikacije, Opis i oprema, Slike
- Each section has: gradient top border, icon, title, description
- Input heights: `h-11` for better touch targets
- Validation: Required fields, min/max constraints, at least 1 image
- Inline help: Placeholder examples, optional field hints, character limits
- Submit section: Info reminder, Cancel + Submit buttons (gradient with Save icon)

### Status Messages

- Error: Red with AlertCircle, slide-in animation
- Loading: Accent blue with Loader2 spinner
- Success: Green with CheckCircle2
- All in rounded-lg containers with padding and borders

### Delete Confirmation

- Use `window.confirm()` with Croatian message
- Include vehicle name in prompt
- Warn that action cannot be undone
- Show loading state during deletion

## Quick Reference

- **Type Definitions**: `src/types/vozilo.ts`
- **Utils**: `src/lib/utils.ts` (includes `cn()` for Tailwind merging)
- **Vehicle Helpers**: `src/lib/vozila.ts` (formatKilometraza, filterVozila, etc.)
- **Locale Config**: `src/i18n/routing.ts`
- **Test Mocks**: `src/__tests__/setup.ts`
