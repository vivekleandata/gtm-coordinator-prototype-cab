# gtm-coordinator

> **Project boundary (hard rule):** never edit, write, or otherwise mutate files under `/Users/vivekravisankar/Local/LeanData/products/agentic-gtm-platform/`. Edit/Write/MultiEdit/NotebookEdit on that path are denied at the harness level (`.claude/settings.local.json`). If a task requires changes there, stop and ask the user to switch to that project's session.


Visual prototype for the **GTM Agent Coordinator** — LeanData's control plane for
third-party AI agents (11x, Warmly, Clay, 1Mind, ZoomInfo, Regie.ai, Qualified,
plus in-house agents) operating across a customer's GTM stack.

Shown alongside `products/agentic-gtm-platform/prototypes/agp-app-v7` at the
customer conference: agp-app-v7 is the **workstation for humans**; this is the
**control plane for agents**.

## Core concept

Every AI agent calls `POST /v1/preflight` before acting. The Coordinator returns
`GO | NO_GO | WAIT | REDIRECT` in under 500 ms p95 based on canonical record
identity, ownership, communication budgets, policies, and collisions. Every
decision lands in an immutable Action Ledger.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind v3 with tokens matching `agp-app-v7` (same brand indigo, near-white canvas, product cards)
- framer-motion, lucide-react
- No backend. All data is in `src/lib/fixtures.ts`.

## Routes

- `/` — Command Center (hero KPIs, live decision feed, agent health, contested records, collisions)
- `/preflight` — Preflight stream (decisions feed + KPIs)
- `/collisions` — Collision log + resolution logic
- `/agents`, `/agents/[id]` — registered agents with declared actions
- `/records` — canonical records index
- `/records/contacts`, `/records/accounts`, `/records/opportunities` — by-object views
- `/records/custom/quotes`, `/records/custom/orders` — custom-object views
- `/records/[id]` — canonical record detail with cross-agent timeline
- `/ledger` — immutable action ledger with filters
- `/policies` — unified policy engine: identity, communication budgets, sequencing, stage gates, approvals, compliance — all in one tab strip with dry-run simulation. Communication budgets live as `category: "communication-budgets"` policy entries (formerly the standalone `/budgets` page). Deep link: `/policies?category=communication-budgets`.
- `/attribution` — outcome attribution per agent (pipeline, revenue, cycle)
- `/partners` — partner ecosystem grid + webhook deliveries
- `/mcp` — MCP tools + REST/SDK code snippets

## Dev

```
npm install
npm run dev       # http://localhost:3000
npx tsc --noEmit
npm run build
```

## Deploy

Production lives at `gtm-coordinator.vercel.app`. The Vercel project is linked to
`github.com/vivekleandata/gtm-coordinator-prototype-cab` — pushes to `main`
auto-deploy to production, branches get preview URLs, PRs get preview comments.
No manual `vercel deploy` needed.

## Fixtures

Tenant: Convex Software (same fictional tenant as agp-app-v7).
See `src/lib/fixtures.ts`: 8 agents, 6 records, 15 preflight decisions, 5 policies,
3 budget tiers, 5 collisions, 5 meetings, attribution rows, partner list, MCP tools.

## What NOT to build

- No backend / real API — all fixtures
- No auth / SSO / billing
- No writable settings (everything is read-only demo)
- No mobile polish
- No dark mode

## Session workflow

This project mirrors the agentic-gtm-platform handoff cadence so you can iterate across multiple sessions without losing context.

- **Start of session:** run `/resume-session` to read the latest handoff in `docs/handoffs/` and propose next steps.
- **End of session:** run `/save-session` to write a dated handoff (`docs/handoffs/YYYY-MM-DD-session-handoff.md`).
- **Same-day revisions:** the slash commands auto-suffix `-v2`, `-v3`, etc.
- **Notion patch log (CPO-facing):** every meaningful prototype change must be appended as a row in the **Patch Log** database under [GTM Controller Prototype - Changelog](https://www.notion.so/34f2127cacac80fa968ceecef99771af). Use `notion-create-pages` with `parent: { data_source_id: "403c7124-3696-4555-9913-674545bc3124" }`. Map each row to a buyer-review item from `prototype-buyer-review.md` and the persona(s) it unlocks. Page body: What changed · Why this matters · Demo path · Verification. Skip for cosmetic changes only.

Project-scoped command definitions live in `.claude/commands/save-session.md` and `.claude/commands/resume-session.md`.

## Stable snapshots

- **CAB v1.0** — git tag `cab-v1.0` (commit `1758e7b`). Frozen at the customer-conference build: 21 agents, 15 record sets with multi-source identity chips, 1Mind branding. Live URL: [gtm-coordinator-cab-v1-0.vercel.app](https://gtm-coordinator-cab-v1-0.vercel.app). GitHub release: [cab-v1.0](https://github.com/vivekleandata/gtm-coordinator-prototype-cab/releases/tag/cab-v1.0). Refer back to this snapshot any time `main` has moved on and you need the conference-state prototype.

## Pairing with agp-app-v7

This prototype lives alongside `../agentic-gtm-platform/prototypes/agp-app-v7`. They are shown together at the customer conference: AGP is the **workstation for humans**, gtm-coordinator is the **control plane for agents**. When a change here implies a corresponding change there (or vice versa), call it out in the session handoff so both projects' next-session Claudes notice.
