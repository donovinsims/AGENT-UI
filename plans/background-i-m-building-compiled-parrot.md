# Operator OS — Full Frontend Build Plan (Dual-Theme)

## Context

We're building **Operator OS**, an internal, agent-native business operating system for an AI
implementation business serving local service businesses (CRM → sales → delivery →
agents/automation → operations). The product is one secure system where the owner, an authorized
CLI, or authorized AI agents run the whole business journey without duplicating data across tools.

Two source-of-truth documents govern this work:
- `src/imports/pasted_text/operator-os-guide-1.md` — the full product contract (IA, entities,
  lifecycle, screens, agent/automation surface, integration health).
- `src/imports/linear-app-DESIGN-3.md` + reference screenshots `IMG_4783–4786` — the binding visual
  language (Linear's dark UI system).

The repo is a bare Vite + React + Tailwind v4 scaffold — `src/App.tsx` is still the placeholder
dot-grid animation. Per the user's decision, we build the **complete frontend first** (client-side
only, in-memory seed data), then a separate agent wires the backend (Supabase, API, agents, CLI)
behind the same component contracts.

**Decision recorded this session:**
- Icons: **Lucide React** for all icons now; status/priority glyphs as small inline SVG to match
  Linear exactly. Icon fidelity (~65–70%) is accepted and revisited as a later polish pass.
- Fidelity target: **≥95% overall gestalt.** Where an element is hard to replicate 1:1, ship a
  low-effort alternative that enhances the UI equally (called out per-item below).
- **Light mode IS in scope — full parity with dark, built now** (user selected "Build both now,
  full parity"). Both themes are first-class and QA'd together every phase.

Goal: every sidebar item resolves to a real, populated, on-brand screen in **both themes**; the
lead → opportunity → client → project lifecycle is visible and connected; desktop and mobile are
both first-class.

## Design contract (binding — from `linear-app-DESIGN-3.md`)

Authored as semantic CSS variables in `src/index.css`, surfaced through Tailwind v4 `@theme`.
Components consume **semantic tokens only** — no one-off hex/radius/shadow values. This is what makes
dual-theme cheap: a single `[data-theme]` swap re-points every token.

**Dark palette (default):**
- Canvas + elevation: `#08090a` → `#0f1011` → `#141516` → `#1c1c1f` → `#232326` → `#28282c`.
- Text: primary `#f7f8f8`, secondary `#d0d6e0`, tertiary `#8a8f98`, muted `#62666d`.
- Borders: hairline `#23252a`, translucent `#ffffff0d` (workhorse divider), input `#3e3e44`.
- Chrome accent: indigo `#5e6ad2` (buttons, active nav, selection, focus ring
  `rgba(94,106,210,.25)`); violet `#7170ff` for links only.
- Status hues (`#f0bf00` yellow, `#27a644` green, `#eb5757` red, `#3caefe` blue, `#fc7840` orange,
  `#00b8cc` teal): **only** state dots, priority glyphs, labels — never chrome.

**Shared (theme-independent):**
- Type: Inter only, optical weights 400/510/590/680; titles 590 (never bold). Body 15px/1.6;
  rows/labels/meta 13px/510. Never 500/600/700. Wire Inter via Google Fonts `@import` in `index.css`.
- Shape: 4px grid; radius 6 (rows/ghost), 8 (buttons/inputs), 12 (menus/cards), 16 (panels).
- Density: 220px sidebar, 28px sidebar rows, 32px controls, 32–38px list rows.
- Motion: CSS-native 100–160ms ease-out-quad; no springs/bounce; honor `prefers-reduced-motion`.
- Depth: hairline translucent borders do the work; reserve the layered stack-low shadow for
  menus/dialogs only.

## Light theme (new — full parity)

Linear ships a light theme too; this is a **hand-tuned** light palette, not an inversion, applied via
`html[data-theme="light"]` overriding the same semantic tokens.

- **Canvas + elevation (light ladder):** canvas `#ffffff` → `#f9f9fb` → `#f4f5f8` → `#eeeff2` →
  `#e7e8ec` → `#dfe1e6` (light-to-dark step ladder mirroring the dark one's contrast rhythm).
- **Text:** primary `#08090a`, secondary `#3c4149`, tertiary `#6b7280`, muted `#8a8f98`.
- **Borders:** hairline `#e4e5e9`, translucent divider `#0000000d` (5% black — mirror of the dark
  5% white workhorse), input border `#c9ccd1`.
- **Chrome accent:** indigo stays `#5e6ad2` (brand is constant); focus ring
  `rgba(94,106,210,.35)` (slightly stronger for light bg); link violet `#5a58e6` (darkened for
  contrast on white).
- **Status hues (re-tuned for legibility on light):** dots/labels use darkened variants so they
  stay AA-legible on white — yellow `#c99a00`, green `#1f8a38`, red `#d13c3c`, blue `#1f8fdb`,
  orange `#e0632a`, teal `#008fa0`. Same semantic roles as dark.
- **Elevation for light:** hairline borders still primary; menus/dialogs get a soft light shadow
  (`0 2px 4px #0000000f, 0 4px 24px #0000001a`) since translucent-white glows don't read on white.
- **Row hover (light):** `#f4f5f8`; selected `#eeeff2`; ghost hover `#eeeff2`.

**Theme mechanics:**
- `ThemeProvider` (React context) sets `document.documentElement.dataset.theme`, persists to
  `localStorage` (`operator-os-theme`), defaults to `prefers-color-scheme` on first load, exposes
  `theme` + `setTheme`/`toggle`.
- Toggle lives in the breadcrumb bar (desktop) and the **More** screen (mobile); also a ⌘K command
  ("Toggle theme"). Sun/Moon Lucide icons.
- No FOUC: an inline script in `index.html` sets `data-theme` before React mounts.
- Every screen is QA'd in both themes each phase (dual-theme QA gate, see phases).

## Architecture

Client-side SPA. Lightweight in-app view state drives navigation (adopt `react-router-dom` only if
it reads cleaner for deep-linkable detail routes; decide during Phase 1). Structure under `src/`:

- `src/App.tsx` — replaces the placeholder; mounts `ThemeProvider` + data provider + the responsive
  shell; renders the active route. Old dot-grid code removed.
- `src/index.css` — Tailwind import, Inter `@import`, `@theme` token declarations, `:root` (dark)
  and `[data-theme="light"]` token blocks, base body styles. **No unlayered `*` reset** (respect
  Tailwind's layered reset per AGENTS.md).
- `src/theme/` — `ThemeProvider.tsx`, `useTheme.ts`.
- `src/data/` — typed seed model + in-memory store: `types.ts` (companies, contacts, leads,
  opportunities, clients, projects, tasks, meetings, proposals, outreach, agents, runs, approvals,
  automations, activities, notifications, integrations, files, knowledge) and `seed.ts` with
  realistic, interconnected records (a lead → company → opportunity → won → client → project →
  tasks). This is the single boundary the backend later replaces.
- `src/lib/nav.ts` — sidebar/route registry (exact IA from PRD §7).
- `src/components/` — token-encoding primitives: `Button`, `IconButton`, `Kbd`, `Input`,
  `Badge`/`StatusDot`, `PriorityIcon`, `Avatar`, `ListRow`, `SectionHeader`, `Panel`, `Sheet`
  (mobile bottom sheet), `Toolbar`, `Breadcrumb`, `CommandMenu` (⌘K), `ThemeToggle`.
- `src/shell/` — `DesktopShell.tsx` (220px sidebar + 48px breadcrumb bar + main + optional right
  panel) and `MobileShell.tsx` (5-item bottom nav `Today | Sales | Work | Agents | More` + FAB
  quick-action sheet). Breakpoint-selected; shared data/tokens.
- `src/screens/` — one module per route, grouped by section (`today/`, `sales/`, `delivery/`,
  `intelligence/`, `operations/`).
- `src/components/figma/ImageWithFallback.tsx` — avatars/imagery (icons via Lucide/inline SVG).

Icons: `lucide-react` (install) for compact line icons; status/priority as inline SVG glyphs to
match the reference exactly.

## ≥95% gestalt — hard-to-replicate elements & accepted alternatives

- **Custom optical font weights (510/590/680):** Inter Variable supports these via
  `font-variation-settings`/`font-weight` numerics — replicate exactly, no alternative needed.
- **Status/priority glyphs:** inline SVG bar-glyphs (matches Linear 1:1); Lucide only for nav/action
  icons. This is the main lever to push icon fidelity above the ~65–70% baseline where it matters.
- **Layered stack-low menu shadow (dark):** replicate the exact multi-layer recipe from spec §6.
- **Ambient white radial glows (dark):** subtle `rgba(255,255,255,.02–.04)` — replicate in dark;
  **alternative for light:** omit glows, lean on the light shadow recipe instead (glows don't read
  on white).
- **Drag-and-drop kanban:** desktop native HTML5 drag; **alternative everywhere (esp. mobile):**
  explicit "Move to…" menu so the interaction is complete without DnD polish.

## Build phases (all delivered this pass; each ends with a dual-theme QA gate)

### Phase 1 — Foundation + theming + shell + command center
- Token layer in `index.css` (dark `:root` + `[data-theme="light"]`); Inter wiring; `ThemeProvider`
  + toggle + no-FOUC inline script; shared component primitives (quality gate: keyboard focus, aria
  labels, 44px touch targets on mobile) — all built theme-agnostic via tokens.
- `DesktopShell` + `MobileShell` with full PRD IA (TODAY / SALES / DELIVERY / INTELLIGENCE /
  OPERATIONS), active-state indigo, section headers, favorites/teams treatment (matches IMG_4784).
- ⌘K `CommandMenu` (radius 12, stack-low shadow, kbd chips, keyboard nav; jumps to any route + core
  actions + "Toggle theme").
- **Today** command center + **My Work** + **Notifications**: briefing, approvals due, overdue
  tasks, follow-ups, at-risk deals/projects, upcoming meetings, agent activity, fast capture.
- **QA gate:** foundation screens verified in both themes.

### Phase 2 — Sales + delivery (flagship dense screens)
- **Pipeline** (Board / List / Forecast) — kanban styled after IMG_4786, PRD stages, desktop drag +
  explicit move menu everywhere; **Opportunity Detail** 3-pane.
- **Leads / Companies / Contacts** — dense saved-view lists with filters, tags, related records.
- **Inbox / Outreach / Meetings / Proposals / Services** — 3-pane record detail after IMG_4785
  (list + detail + right properties panel, Activity feed with comments).
- **Clients / Projects (Board / List / Timeline) / Tasks / Calendar / Files / Knowledge** — project
  + task states from PRD; project timeline with phases/milestones (vertical on mobile).
- **QA gate:** all sales/delivery screens verified in both themes.

### Phase 3 — Intelligence (agent-native surface)
- **Intelligence Center**, **Agents** directory + **Agent Detail** (config, autonomy levels,
  tools/scopes, model routing, run history), **Test Lab**, **Approvals** queue (one-hand mobile),
  **Automations** builder, **Model Routing** with the runner/integration health board
  (Codex / Mac Runner / FCM / Hermes / GitHub / Gmail per PRD §10).
- **QA gate:** all intelligence screens verified in both themes.

### Phase 4 — Operations + polish
- **Activity** (workspace timeline), **Reports**, **Integrations** center, **Developer** (API keys,
  OpenAPI/CLI/MCP docs, webhooks), **Settings** (incl. theme preference surfaced here too).
- Final consistency pass against the component quality gate; responsive verification; reduced-motion;
  **full dual-theme sweep of every route.**

Any screen not individually detailed still gets a real, populated, on-brand layout so **every nav
item resolves to a functional-looking route in both themes** — no blank stubs.

## Key files to create/modify
- Modify: `src/App.tsx` (replace placeholder), `src/index.css` (tokens for both themes + Inter),
  `index.html` (no-FOUC theme script).
- Create: `src/theme/*`, `src/data/*`, `src/lib/nav.ts`, `src/components/*` (incl. `ThemeToggle`),
  `src/shell/*`, `src/screens/**`, `src/components/figma/ImageWithFallback.tsx`.
- `package.json`: add `lucide-react` (and `react-router-dom` only if used for routing).

## Verification
- Dev server already runs on `$PORT`; confirm the app boots with no console errors.
- Toggle theme: dark ↔ light flips instantly with no FOUC on reload; preference persists across
  reloads; first-load respects `prefers-color-scheme`.
- Click through every sidebar route on desktop **in both themes** → each renders a populated,
  Linear-styled screen with legible status dots and correct contrast.
- Trace the lifecycle: seeded lead → company → opportunity → won → client → project → tasks,
  confirming shared records stay linked (no re-entry).
- Exercise ⌘K navigation (incl. "Toggle theme") and keyboard focus; toggle to a narrow viewport and
  confirm the mobile shell (bottom nav + quick-action sheet + bottom-sheet editors) takes over.
- Spot-check the token contract in both themes: no 500/600/700 weights, no status color used as
  chrome, hairline dividers not shadows, indigo-only accents.
- Confirm `prefers-reduced-motion` disables transitions.
