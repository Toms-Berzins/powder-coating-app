# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Powder-coating web app with a **WASM-powered instant quote calculator**, **minimal-step checkout**, and a **Rust (Axum) REST API** on **PostgreSQL**, all shipped with **Docker**. React + TypeScript frontend.

## Repository Structure (Monorepo)

```
powdercoater/
├─ apps/
│  ├─ frontend/            # Vite + React + TS + TanStack Query + Tailwind + shadcn/ui
│  └─ api/                 # Rust (Axum) REST API + SQLx + OpenAPI (utoipa)
├─ crates/
│  └─ quote_core/          # Rust crate: shared pricing logic (also compiled to WASM)
├─ infra/
│  ├─ docker/              # Dockerfiles, Traefik/Nginx reverse proxy
│  ├─ compose/             # docker-compose.*.yml
│  └─ ci/                  # GitHub Actions / headless Claude Code automations
├─ db/                     # migrations (sqlx)
└─ .claude/                # settings, slash commands, prompts
```

## Common Commands

- **Frontend dev**: `cd apps/frontend && npm i && npm run dev`
- **Typecheck**: `cd apps/frontend && npm run typecheck`
- **API server**: `cd apps/api && cargo run`
- **DB migrations**: `cd db && sqlx migrate run`
- **WASM build**: `cd crates/quote_core && wasm-pack build --target web`
- **Docker compose**: `cd infra/compose && docker compose -f dev.yml up --build`
- **Backend tests**: `cd apps/api && cargo test`
- **Frontend tests**: `cd apps/frontend && npm run test`
- **Linting**: `cd apps/api && cargo fmt -- --check && cargo clippy -- -D warnings`

## Tech Stack

**Frontend**
- Vite + React + TypeScript
- TanStack Query (API caching)
- React Hook Form + Zod (validation)
- Tailwind CSS + shadcn/ui
- Lucide icons
- react-i18next
- Framer Motion (animations)
- Stripe.js (payment processing)

**Backend**
- Axum (web framework)
- Tokio (async runtime)
- SQLx (PostgreSQL)
- utoipa (OpenAPI spec)
- tower-http (middleware)
- argon2/JWT (auth)
- Redis (rate limiting/caching)
- tracing + OpenTelemetry

**Shared Logic**
- `quote_core` crate in Rust
- Compiled to WASM for frontend
- Used natively in backend (single source of truth)

**Database**
- PostgreSQL with extensions: pg_trgm, pgcrypto
- Tables: customers, quotes, jobs, materials, colors_ral, pricing_rules, surcharges, invoices, payments, audit_logs
- Migrations via sqlx-cli

**Payments**
- Stripe Checkout (hosted page)
- Webhooks for order status updates

**DevOps**
- Docker multi-stage builds
- docker-compose for dev/staging
- Traefik/Nginx + Let's Encrypt
- GitHub Actions
- Prometheus/Grafana + Sentry

## Architecture Patterns

### Quote Calculation (WASM Bridge)
- `quote_core` contains all pricing logic
- Frontend uses WASM version for instant quotes
- Backend uses native version for validation/orders
- Snapshot tests ensure parity between WASM and native

### API Integration
- OpenAPI schema auto-generated via utoipa
- Typed clients generated for frontend
- Zod schemas mirror OpenAPI definitions
- TanStack Query handles caching/refetching

### Database Access
- Explicit SQLx queries (compile-time checked)
- No raw SQL strings
- Migrations checked into version control
- `sqlx prepare` output committed

## Code Style

**Frontend**
- ESLint + Prettier
- Strongly typed API clients
- Zod schemas mirroring OpenAPI
- Component organization: ui/, features/, lib/
- Micro-animations (200-500ms best practice)
- Step-by-step wizard flows with validation
- Modern 2025 UI/UX patterns (bento boxes, gradients, trust signals)

**Backend**
- `cargo fmt` + `cargo clippy` (zero warnings)
- Explicit SQLx queries
- No panics in handlers
- Structured logging with tracing
- Error types implement proper HTTP status mapping

## Testing Strategy

**Frontend**
- Unit tests: Vitest
- E2E tests: Playwright
- Component tests for quote calculator

**Backend**
- Unit tests: `cargo test`
- Integration tests: reqwest against test DB
- Contract tests: OpenAPI schema validation

**Cross-cutting**
- WASM vs native parity tests for `quote_core`
- Lighthouse performance tests (target ≥ 95 on quote page)

## Critical Workflows

### Adding a New Endpoint
1. Update OpenAPI schema (utoipa annotations)
2. Add route, handler, DTOs in Axum
3. Write SQLx queries
4. Add reqwest integration tests
5. Run `sqlx prepare` and commit the output
6. Generate frontend client types
7. Verify: `cargo test` and `npm run typecheck`

### Updating Quote Logic
1. Modify `crates/quote_core`
2. Rebuild WASM: `wasm-pack build --target web`
3. Run parity tests (WASM vs native)
4. Update frontend imports if needed
5. Verify both FE and BE quote endpoints

### Pre-commit Checklist
- `npm run typecheck` passes
- `npm run test` passes
- `cargo fmt -- --check` passes
- `cargo clippy -- -D warnings` passes
- `cargo test` passes
- `sqlx migrate run` applied
- `sqlx prepare` updated if queries changed

## Important Constraints

- **IMPORTANT**: `quote_core` is the single source of truth for pricing—never duplicate logic
- **IMPORTANT**: Use feature branches and small PRs; run typecheck + tests before commit
- **IMPORTANT**: No panics in production handlers; all errors must be handled gracefully
- **IMPORTANT**: Keep OpenAPI schema in sync with actual endpoints
- **IMPORTANT**: Never commit secrets; use environment variables for all sensitive config

## Development Workflow

1. **Explore → Plan → Code → Commit** (read files first; no edits until plan is clear)
2. Work in small, verifiable steps
3. Run typecheck/tests after each significant change
4. Use slash commands for common scaffolding tasks

## User Journey

### Quote Generation Flow (Step-by-Step Wizard)
1. **Step 1: Dimensions** - User enters part measurements (length, width, height in mm)
2. **Step 2: Material** - Select material type (aluminum, steel, etc.)
3. **Step 3: Prep Level** - Choose surface preparation level
4. **Step 4: Details** - Enter color (RAL code), quantity, turnaround days, rush option
5. **Real-time pricing** - Quote updates instantly as user fills in each step
6. **Progress tracking** - Visual indicators show completion status for each step
7. **Validation** - Cannot proceed to next step until current step is complete

### Checkout Flow (2025 Best Practices)
1. **Contact Information**
   - Email, name, phone, company (optional)
   - Shipping address (street, city, postal code)
   - Single-column layout for better UX
   - Inline validation with micro-animations

2. **Payment Processing**
   - Stripe Checkout integration
   - Trust signals: SSL badges, security indicators, payment logos
   - Progress indicator showing current step
   - Mobile-optimized with autocomplete support
   - Back button to return to quote

3. **Security Features**
   - 256-bit SSL encryption
   - PCI-compliant payment forms
   - Visible trust badges (Shield, Lock icons)
   - Privacy assurances near form fields

## UI/UX Features (2025 Trends)

### Design Patterns Implemented
- **Bento box layouts** - Modern card-based grid design
- **Organic shapes** - Soft gradient backgrounds with blurred circles
- **Micro-interactions** - Smooth animations (200-500ms duration)
- **Progress indicators** - Step-by-step visual guidance
- **Trust signals** - Security badges, live indicators, verification icons
- **Gradient text** - Modern heading styles with bg-clip-text
- **Hover effects** - Border transitions, scale transforms, shadow elevation
- **Real-time feedback** - Live price updates, instant validation
- **Mobile-first** - Responsive layouts optimized for all devices

### Animation Guidelines
- Step transitions: 300ms slide animations
- Price updates: Spring animations with bounce effect
- Progress bars: 400ms smooth transitions
- Micro-animations: 200-500ms (industry best practice)
- Hover effects: 300ms scale/shadow changes
- Keep animations under 50KB for performance

### Checkout UX Best Practices
- Single-column form layout (easier to scan and complete)
- Inline validation (immediate feedback)
- Autofill support (faster completion)
- Progress visualization (2-step process)
- Trust signals placement (next to payment fields)
- Mobile optimization (59% of ecommerce sales in 2025)
- Security assurances (reduce 25% abandonment rate)
- Payment method logos (visual trust indicators)

## Internationalization (i18n)

### Languages Supported
- **English (EN)** - Default language
- **Latvian (LV)** - Full translation support

### i18n Architecture
- **Library**: react-i18next with i18next-browser-languagedetector
- **Configuration**: `apps/frontend/src/i18n/config.ts`
- **Translations**: JSON files in `apps/frontend/src/i18n/locales/`
  - `en.json` - English translations
  - `lv.json` - Latvian translations
- **Language Detection**: Automatic detection from localStorage or browser settings
- **Persistence**: Selected language saved to localStorage
- **Fallback**: Falls back to English if translation key is missing

### Translation Structure
```
{
  "hero": { /* Hero section translations */ },
  "quote": {
    "form": { /* Quote form step-by-step wizard */ },
    "price": { /* Price display component */ }
  },
  "checkout": {
    "contact": { /* Contact information form */ },
    "payment": { /* Payment section */ },
    "orderSummary": { /* Order summary */ }
  },
  "common": { /* Shared translations */ }
}
```

### Language Switcher
- **Component**: `apps/frontend/src/components/LanguageSwitcher.tsx`
- **Position**: Fixed top-right corner (z-index: 50)
- **Interaction**: Click to toggle between EN ↔ LV
- **Animation**: Framer Motion with hover/tap effects
- **Visual**: Shows current language → next language (e.g., "EN → LV")

### Usage in Components
```typescript
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  )
}
```

### Adding New Translations
1. Add translation keys to both `en.json` and `lv.json`
2. Use consistent nesting structure (e.g., `section.component.element`)
3. Import `useTranslation` hook in component
4. Replace hardcoded strings with `t('translation.key')`
5. Test language switching in browser
6. Run typecheck: `npm run typecheck`

### Translated Components
- ✅ HeroSection - Main hero banner with titles, CTAs, trust signals, RAL badge
- ✅ QuoteSection - Quote section introduction badge, title, subtitle
- ✅ QuoteForm - Full 4-step wizard with all labels and validation
- ✅ QuotePriceDisplay - Price breakdown and trust badges
- ✅ CheckoutSection - Contact info, payment, order summary (ready for integration)
- ✅ LanguageSwitcher - Language toggle component

### i18n Best Practices
- **Key naming**: Use descriptive, hierarchical keys (e.g., `quote.form.step1.title`)
- **Placeholders**: Use interpolation for dynamic values: `t('key', { value: dynamicValue })`
- **Pluralization**: Use i18next plural rules when needed
- **Context**: Keep translations in context-specific namespaces
- **Consistency**: Maintain consistent terminology across all translations
- **Testing**: Always test both languages after adding new translations

### Performance Considerations
- Translations loaded once at app initialization
- No HTTP requests for translations (bundled in app)
- Minimal bundle size impact (~10KB for both languages)
- No re-renders when switching languages (only text content updates)
- /clear