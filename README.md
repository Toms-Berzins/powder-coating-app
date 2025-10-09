# Powder Coating Web App

Professional powder coating service with instant online quotes, full RAL color range, and fast turnaround for the Baltic region.

## Tech Stack

**Frontend**
- Vite + React + TypeScript
- TanStack Query (API caching)
- React Hook Form + Zod (validation)
- Tailwind CSS + shadcn/ui
- react-i18next (EN/LV)

**Backend**
- Rust + Axum (REST API)
- SQLx + PostgreSQL
- OpenAPI (utoipa)
- Redis (caching/rate limiting)

**Shared Logic**
- `quote_core` crate (compiled to WASM for frontend, used natively in backend)

## Quick Start

### Prerequisites
- Node.js 20+
- Rust 1.75+
- PostgreSQL 16
- Docker & Docker Compose (optional)

### Development

**Frontend**
```bash
cd apps/frontend
npm install
npm run dev
# http://localhost:5173
```

**Backend API**
```bash
cd apps/api
cargo run
# http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

**WASM Build**
```bash
cd crates/quote_core
cargo install wasm-pack  # if not installed
wasm-pack build --target web
```

**Docker Compose (All Services)**
```bash
cd infra/compose
docker compose -f dev.yml up --build
# Frontend: http://localhost:3000
# API: http://localhost:8000
```

## Project Structure

```
powder-coating-app/
├─ apps/
│  ├─ frontend/          # React frontend
│  └─ api/               # Rust API
├─ crates/
│  └─ quote_core/        # Shared pricing logic (WASM + native)
├─ db/                   # SQLx migrations
├─ infra/
│  ├─ docker/            # Dockerfiles
│  └─ compose/           # Docker Compose configs
├─ content/              # Website copy (EN/LV)
├─ public/               # Static assets + i18n
└─ .claude/              # Claude Code commands
```

## Development Commands

See [CLAUDE.md](./CLAUDE.md) for complete command reference.

**Frontend**
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run typecheck` - Type checking
- `npm test` - Run tests

**Backend**
- `cargo run` - Start API server
- `cargo test` - Run tests
- `cargo fmt` - Format code
- `cargo clippy` - Lint

**Database**
- `sqlx migrate add <name>` - Create migration
- `sqlx migrate run` - Apply migrations

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/powdercoater

# API
API_PORT=8000

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# See .env.example for complete list
```

## Architecture

### Quote Calculation (WASM Bridge)
- `quote_core` contains all pricing logic
- Frontend uses WASM version for instant quotes
- Backend uses native version for validation
- Snapshot tests ensure parity

### API Integration
- OpenAPI schema auto-generated
- Typed clients for frontend
- TanStack Query for caching

## Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm test && cargo test`
4. Run type checking: `npm run typecheck`
5. Format code: `npm run format && cargo fmt`
6. Create PR

## License

Proprietary - PowderCoater Latvia
