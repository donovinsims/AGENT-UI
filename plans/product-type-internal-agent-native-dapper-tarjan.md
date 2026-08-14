# Operator OS — Full Frontend Build Plan

## Context

We're building **Operator OS**, an internal, agent-native business operating system for an AI
implementation business (CRM → sales → delivery → agents/automation → operations). The attached
`operator-os-guide-1.md` is the full product contract; `linear-app-DESIGN-2.md` plus the four
Linear screenshots (IMG_4783–4786) define the binding visual language.

The current repo is a bare Vite + React + Tailwind v4 scaffold — `src/App.tsx` is only a
placeholder dot-grid animation with no real product in it. The PRD assumes a Next.js + Supabase
production stack, but this project is Vite/React and the user explicitly wants **the complete
frontend built first**, with the backend (Supabase, API, agents, CLI) wired up later by another
agent. So the deliverable here is a fully navigable, information-dense, Linear-styled frontend for
**every** navigation route, backed by an in-memory seed-data layer that a real backend can later
replace behind the same component contracts.

Goal: every sidebar item maps to a real, on-brand, populated screen; the primary lead → opportunity
→ client → project lifecycle is visible and connected; desktop and mobile are both first-class.

## Design contract (binding — from `linear-app-DESIGN-2.md`)

Applied as CSS variables in `src/index.css` and surfaced through Tailwind v4 `@theme`. Components use
semantic tokens only — no one-off hex/radius/shadow values.

- **Canvas + elevation:** `#08090a` → `#0f1011` → `#141516` → `#1c1c1f` → `#232326` → `#28282c`.
- **Text:** primary `#f7f8f8`, secondary `#d0d6e0`, tertiary `#8a8f98`, muted `#62666d`.
- **Borders:** hairline `#23252a`, translucent `#ffffff0d` (the workhorse divider), input `#3e3e44`.
- **Chrome accent:** indigo `#5e6ad2` (buttons, active nav, selection, focus ring
  `rgba(94,106,210,.25)`); violet `#7170ff` for links only.
- **Status hues** (`#f0bf00` yellow, `#27a644` green, `#eb5757` red, `#3caefe` blue, `#fc7840`
  orange, `#00b8cc` teal): **only** for state dots, priority glyphs, labels — never chrome.
- **Type:** Inter only, optical weights 400/510/590/680; titles 590 (never bold). Body 15px/1.6;
  rows/labels/meta 13px/510. Never 500/600/700. Wire Inter via Google Fonts `@import` in `index.css`.
- **Shape:** 4px grid; radius 6 (rows/ghost), 8 (buttons/inputs), 12 (menus/cards), 16 (panels).
- **Density:** 220px sidebar, 28px sidebar rows, 32px controls, 32–38px list rows, `#141516` row hover.
- **Motion:** CSS-native 100–160ms ease-out-quad; no springs/bounce; honor `prefers-reduced-motion`.
- **Depth:** hairline translucent borders do the work; reserve the layered stack-low shadow for
  menus/dialogs only.

## Architecture

Client-side SPA. No router dependency required — a lightweight in-app view state (or `react-router`
if it reads cleaner) drives navigation. Structure under `src/`:

- `src/App.tsx` — replaces the placeholder; mounts providers + the responsive shell, renders the
  active route. (The old dot-grid code is removed.)
- `src/index.css` — Tailwind import, Inter `@import`, `@theme` tokens, base body styles.
- `src/data/` — typed seed model + in-memory store: `types.ts` (companies, contacts, leads,
  opportunities, clients, projects, tasks, meetings, proposals, outreach, agents, runs, approvals,
  automations, activities, notifications, integrations, files, knowledge) and `seed.ts` with
  realistic, interconnected sample records (a lead that becomes a company → opportunity → won →
  client → project → tasks). This is the single boundary the backend later replaces.
- `src/lib/nav.ts` — the sidebar/route registry (the exact IA from PRD §7).
- `src/components/` — shared primitives that encode the token contract: `Button`, `IconButton`,
  `Kbd`, `Input`, `Badge`/`StatusDot`, `PriorityIcon`, `Avatar`, `ListRow`, `SectionHeader`,
  `Panel`, `Sheet` (mobile bottom sheet), `Toolbar`, `Breadcrumb`, `CommandMenu` (⌘K).
- `src/shell/` — `DesktopShell.tsx` (220px sidebar + 48px breadcrumb bar + main + optional right
  panel) and `MobileShell.tsx` (5-item bottom nav `Today | Sales | Work | Agents | More` + FAB
  quick-action sheet). Chosen at a breakpoint per PRD §4.3 — separate components, shared data/tokens.
- `src/screens/` — one module per route, grouped by section (`today/`, `sales/`, `delivery/`,
  `intelligence/`, `operations/`).
- `src/components/figma/ImageWithFallback.tsx` — used for any avatars/imagery (icons via inline SVG).

Icons: use `lucide-react` (install) for the compact line icons matching Linear; render status/
priority as small inline SVG glyphs to match the reference exactly.

## Build phases (all delivered this pass; sequenced for coherence)

### Phase 1 — Foundation + shell + command center
- Token layer in `index.css`; Inter wiring; shared component primitives (the quality gate:
  keyboard focus, aria labels, 44px touch targets on mobile).
- `DesktopShell` + `MobileShell` with the full PRD IA (TODAY / SALES / DELIVERY / INTELLIGENCE /
  OPERATIONS), active-state indigo, section headers, favorites/teams treatment (matches IMG_4784).
- ⌘K `CommandMenu` (surface `#1c1c1f`, radius 12, stack-low shadow, kbd chips, keyboard nav,
  jumps to any route + core actions).
- **Today** command center + **My Work** + **Notifications**: briefing, approvals due, overdue
  tasks, follow-ups, at-risk deals/projects, upcoming meetings, agent activity, fast capture.

### Phase 2 — Sales + delivery (the flagship dense screens)
- **Pipeline** (Board / List / Forecast) — kanban styled after IMG_4786 cycle board, with the PRD
  stages, drag on desktop + explicit move menu everywhere; **Opportunity Detail** 3-pane.
- **Leads / Companies / Contacts** — dense saved-view lists with filters, tags, related records.
- **Inbox / Outreach / Meetings / Proposals / Services** — 3-pane record detail styled after
  IMG_4785 (list + detail + right properties panel, Activity feed with comments).
- **Clients / Projects (Board / List / Timeline) / Tasks / Calendar / Files / Knowledge** —
  project states + task states from PRD; project timeline with phases/milestones (vertical on mobile).

### Phase 3 — Intelligence (agent-native surface)
- **Intelligence Center**, **Agents** directory + **Agent Detail** (config, autonomy levels, tools/
  scopes, model routing, run history), **Test Lab**, **Approvals** queue (one-hand mobile),
  **Automations** builder, **Model Routing** with the runner/integration health board
  (Codex / Mac Runner / FCM / Hermes / GitHub / Gmail statuses per PRD §10).

### Phase 4 — Operations + polish
- **Activity** (workspace timeline), **Reports**, **Integrations** center, **Developer** (API keys,
  OpenAPI/CLI/MCP surface docs, webhooks), **Settings**.
- Final consistency pass against the component quality gate; responsive verification; reduced-motion.

Any screen not individually detailed still gets a real, populated, on-brand layout (list/board/detail
as appropriate) so **every nav item resolves to a functional-looking route** — none are blank stubs.

## Key files to create/modify
- Modify: `src/App.tsx` (replace placeholder), `src/index.css` (tokens + Inter).
- Create: `src/data/*`, `src/lib/nav.ts`, `src/components/*`, `src/shell/*`, `src/screens/**`,
  `src/components/figma/ImageWithFallback.tsx`.
- `package.json`: add `lucide-react` (and `react-router-dom` only if used for routing).

## Verification
- Dev server already runs on `$PORT`; confirm the app boots with no console errors.
- Click through every sidebar route on desktop → each renders a populated Linear-styled screen.
- Trace the lifecycle: open the seeded lead → its company → opportunity → won → client → project →
  tasks, confirming shared records stay linked (no re-entry).
- Exercise ⌘K navigation and keyboard focus; toggle to a narrow viewport and confirm the mobile
  shell (bottom nav + quick-action sheet + bottom-sheet editors) takes over.
- Spot-check the token contract: no 500/600/700 weights, no status color used as chrome, hairline
  dividers not shadows, indigo-only accents.
- Confirm `prefers-reduced-motion` disables transitions.
