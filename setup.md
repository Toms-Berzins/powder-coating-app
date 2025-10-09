Awesome—here’s your **tech stack + project bootstrap** rewritten in **Claude Code best-practices** style so you can drop it straight into your repo and work agentically.

---

# 0) Project goal (one-liner)

Powder-coating web app with a **WASM-powered instant quote calculator**, **minimal-step checkout**, and a **Rust (Axum) REST API** on **PostgreSQL**, all shipped with **Docker**. (React + TypeScript frontend.)
References you shared: Rust Axum + SQLx API patterns; React API access patterns. ([Rustfinity][1])

---

# 1) Repo layout (monorepo)

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
├─ .claude/                # settings, slash commands, prompts
└─ CLAUDE.md               # quickstart commands, style, rules (see below)
```

---

# 2) `CLAUDE.md` (check in at repo root)

```
# PowderCoater — Claude quickstart

## Goals
- Lightning-fast quotes in-browser via WASM (mirrors server logic).
- Minimal-step checkout (Stripe Checkout session, Apple/Google Pay).
- Rust Axum REST API with PostgreSQL (SQLx, migrations via sqlx-cli).
- Containerized dev/prod with docker-compose.

## Common commands
- Frontend:  cd apps/frontend && npm i && npm run dev
- Typecheck:  cd apps/frontend && npm run typecheck
- API:        cd apps/api && cargo run
- Migrations: cd db && sqlx migrate run
- WASM build: cd crates/quote_core && wasm-pack build --target web
- Compose:    cd infra/compose && docker compose -f dev.yml up --build

## Tech choices
- FE: React + TypeScript, Vite, TanStack Query, React Hook Form + Zod, Tailwind, shadcn/ui
- BE: Axum, SQLx(Postgres), utoipa(OpenAPI), tracing, tower-http, Redis (rate-limit/cache)
- DB: Postgres (+ pg_trgm, pgcrypto), sqlx-cli migrations
- Payments: Stripe Checkout (hosted)
- Observability: OpenTelemetry → Prometheus/Grafana, Sentry

## Code style
- Frontend: ESLint + Prettier; strongly typed API clients, Zod schemas mirroring OpenAPI
- Backend: cargo fmt/clippy; explicit SQLx queries; no panics in handlers; structured logs

## Testing
- FE unit: Vitest. E2E: Playwright.
- BE: cargo test + reqwest integration tests against test DB.
- Contract: OpenAPI schema checked in; clients generated.

## Safety & workflow
- IMPORTANT: Use feature branches, small PRs, and run typecheck + tests before commit.
- IMPORTANT: Keep `quote_core` as single source of truth; FE uses WASM, BE uses native.
- IMPORTANT: Update this file whenever commands/flows change.

```

Best-practice rationale and features are aligned with Anthropic’s **Claude Code: Best practices for agentic coding** (CLAUDE.md usage, curated tools, slash commands, headless mode). ([Anthropic][2])

---

# 3) Claude Code setup (allowlist + tools)

**`.claude/settings.json`**

```json
{
  "allowedTools": [
    "Edit",
    "Bash(npm:*)",
    "Bash(cargo:*)",
    "Bash(docker:*)",
    "Bash(gh:*)",
    "Bash(sqlx:*)",
    "Bash(git:*)"
  ],
  "model": "claude-3.5-sonnet"
}
```

(Adjust to your risk tolerance; add gradually.) ([Anthropic][2])

**`.mcp.json`** (optional; share tools across team)

```json
{
  "servers": {
    "puppeteer": { "command": "npx", "args": ["-y","@modelcontextprotocol/server-puppeteer"] },
    "sentry": { "command": "npx", "args": ["-y","@modelcontextprotocol/server-sentry"] }
  }
}
```

Now every dev (and Claude) gets the same toolbelt. ([Anthropic][2])

---

# 4) Slash commands (drop into `.claude/commands/`)

**`.claude/commands/init-project.md`**

```
Read the repo. DO NOT write code yet.
Make a one-page plan to:
1) scaffold frontend (Vite + TS + Tailwind + shadcn/ui),
2) scaffold Axum API with SQLx + migrations,
3) create shared quote_core crate and WASM build,
4) add Stripe Checkout minimal flow,
5) wire docker-compose dev.
Output: checklist + exact shell commands.
```

**`.claude/commands/add-endpoint.md`**

```
Add a new Axum endpoint: $ARGUMENTS
Steps:
1) update OpenAPI (utoipa),
2) add route, handler, dto, sqlx query,
3) add integration test (reqwest),
4) run sqlx check + tests, show results.
Return diffs + commands.
```

**`.claude/commands/wire-quote-wasm.md`**

```
Build quote_core to WASM and integrate to frontend.
Steps: wasm-pack build → import WASM → Zod schema bridge → live calculator component with RHF.
Ensure price parity with backend by snapshot tests.
```

(These follow the blog’s “custom slash commands” guidance.) ([Anthropic][2])

---

# 5) Common workflow with Claude Code

1. **Explore → Plan → Code → Commit** (ask Claude to read files first; no edits yet).
2. Work in **small, verifiable steps**; run **typecheck/tests** after each step.
3. Use **headless mode** in CI for automated issue triage or subjective lint. ([Anthropic][2])

**Example GitHub Action** (`.github/workflows/claude-triage.yml`)

```yaml
name: Claude Triage
on:
  issues:
    types: [opened]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g @anthropic-ai/claude-code
      - run: |
          claude -p "Analyze new issue and label: ${{ github.event.issue.title }} — ${{ github.event.issue.html_url }}.
          Use repo context and suggest next steps." --output-format stream-json
```

(Headless mode pattern from the article.) ([Anthropic][2])

---

# 6) Stack specifics (concise)

**Frontend**

* Vite + React + TS, **TanStack Query** (API caching), **React Hook Form + Zod**, Tailwind + **shadcn/ui**, Lucide icons, react-i18next.
* Fetch/ Axios patterns from article map cleanly to TanStack Query. ([Medium][3])

**Backend**

* **Axum**, **Tokio**, **SQLx (Postgres)**, **utoipa (OpenAPI)**, **tower-http**, **argon2/JWT**, **Redis** (rate limit/cache), **tracing** + OTEL.
* Mirrors modern Axum + SQLx guidance (Dockerized Postgres + sqlx-cli). ([Rustfinity][1])

**Shared quote engine**

* `crates/quote_core/` in Rust. Compile to **WASM** for FE; import natively in BE to eliminate drift.

**Database**

* Tables: customers, quotes, jobs, materials, colors_ral, pricing_rules, surcharges, invoices, payments, audit_logs.
* Extensions: `pg_trgm`, `pgcrypto`.

**Payments**

* **Stripe Checkout** (hosted page) for minimal steps. Webhooks → order status.

**DevOps**

* **Docker** multi-stage builds (frontend + API), **docker-compose** for dev/stage, Traefik/Nginx + Let’s Encrypt, Cloudflare, GitHub Actions.

---

# 7) First Claude-driven increments (copy/paste as prompts)

**A. Bootstrap everything**

```
/project:init-project
```

**B. Generate OpenAPI + client**

```
Plan and implement minimal /health, /quotes/price (POST), /orders (POST).
- Update utoipa schema, expose Swagger UI at /docs.
- Generate typed client for frontend.
- Add reqwest integration tests.
- Run: cargo test, npm run typecheck. Return diffs + commands.
```

**C. Wire the quote WASM**

```
Create basic Rust crate `quote_core` with inputs: dimensions, surface area, material, prep level, color, turnaround, quantity, rush.
- Compile to WASM (wasm-pack build --target web).
- Frontend: <QuoteCalculator/> using RHF + Zod; live price updates.
- Backend: reuse the crate for validation.
- Add snapshot tests to ensure parity.
```

**D. Minimal checkout**

```
Add Stripe Checkout:
- Backend /checkout/session -> returns session URL.
- Frontend 'Accept & Pay' button → redirectToCheckout.
- Webhook handler updates order status.
- Provide env var list and test script.
```

---

# 8) Docker (dev) — files Claude can author for you

**`infra/compose/dev.yml`** (services: frontend, api, postgres, redis, proxy)
**Dockerfiles**: `apps/api/Dockerfile`, `apps/frontend/Dockerfile` (multi-stage)
**Makefile (optional)**: `make up/down/test/typecheck`
Have Claude write these from the plan above.

---

# 9) Validation checklist (per PR)

* `npm run typecheck` and `npm run test` (frontend) pass
* `cargo fmt -- --check`, `cargo clippy -- -D warnings`, `cargo test` pass
* `sqlx migrate run` applied; `sqlx prepare` checked in
* Pricing parity test: WASM vs native results match
* Lighthouse perf on quote page ≥ 95

---

If you like, I can **generate the initial files** (Dockerfiles, compose, Axum skeleton, Vite app, `quote_core` crate, and the slash commands) in one go — ready to run locally.

[1]: https://www.rustfinity.com/blog/create-high-performance-rest-api-with-rust "Create a High-Performance REST API with Rust"
[2]: https://www.anthropic.com/engineering/claude-code-best-practices "Claude Code Best Practices \ Anthropic"
[3]: https://article.arunangshudas.com/the-top-5-most-efficient-and-elegant-ways-to-access-apis-in-react-020447126a39 "Top 5 Most Efficient and Elegant Ways to Access APIs in React | by Arunangshu Das | Medium"
