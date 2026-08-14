# Operator OS — Authoritative Codex / AI Agent Handoff

> Last updated: 2026-08-14. Source of truth for any AI agent or contributor picking this up.

---

## 2. Product definition: what must be built

**Operator OS** is an internal, agent-native business operating system for an AI implementation business. It centralizes CRM, sales, outreach, proposals, client delivery, projects, tasks, files, knowledge, automations, and AI agent control in a single connected product.

Business lifecycle the product covers end-to-end:
```
Lead → Research → Contact → Outreach → Qualification → Opportunity
→ Follow-up → Proposal → Won Deal → Client → Implementation Project
→ Tasks & Milestones → Completion → Ongoing Client Success
```

The owner can perform every operation manually from desktop or mobile. Agents, CLI, and integrations call the same validated backend operations — they never click the UI or hold database credentials.

**Full product contract:** `src/imports/pasted_text/operator-os-guide.md` (identical to `operator-os-prd.md`). Everything below is derived from or consistent with that document.

### Non-negotiable product principles

## Current State (what is actually built right now)

This is a **Vite + React 19 + Tailwind CSS v4 SPA**. There is no Next.js, no Supabase, no routing library, no backend. All data is static seed records in `src/data/model.ts`. Navigation is driven by a single `active` string in `App.tsx` state.

### What exists

**Shell & navigation**
- `src/shell/DesktopShell.tsx` — 224px fixed sidebar, 5-section nav (29 items), active-state indigo highlight, badge counters, workspace switcher header, breadcrumb bar, ⌘K search button wired to CommandMenu.
- `src/shell/MobileShell.tsx` — 5-tab bottom nav (Today / Sales / Work / Agents / More), circular FAB, quick-action bottom sheet (8 actions), full "More" nav sheet with all 29 items.
- `src/components/CommandMenu.tsx` — ⌘K overlay, filters nav + 5 hardcoded actions, full keyboard nav (↑↓ Enter Esc).
- `src/lib/nav.ts` — `NAV` (5 sections, 29 items), `MOBILE_NAV`, `itemById` lookup.

**Design system** (`src/components/ui.tsx` + `src/index.css`)
- Full dark token contract in `@theme` block (see Design Contract section below).
- Primitives: `Button` (primary/secondary/ghost, sm/md), `IconButton`, `Kbd`, `StatusDot` (filled + ring variants), `PriorityIcon` (5 levels), `Avatar`, `Badge`, `Panel`, `SectionLabel`, `EmptyState`, `Ring` (SVG arc).
- Screen layout primitives in `src/screens/parts.tsx`: `Page` (sticky toolbar, view switcher, render-prop children), `Row` (38px list item), `GroupHeader` (sticky section divider).

**All 29 screens scaffolded** — every nav item renders a real, populated, on-brand screen:
- Today, MyWork, Inbox, Notifications
- SalesOverview, Leads, Companies, Contacts, Pipeline (kanban + list + forecast, native HTML5 drag), Outreach, Meetings, Proposals, Services
- Clients, Projects (list + kanban + Gantt timeline), Tasks, Calendar (month grid), Files, Knowledge
- IntelligenceCenter, Agents (grid → AgentDetail with autonomy selector + run history), Approvals, Automations (toggle list), ModelRouting
- ActivityFeed, Reports (KPIs + bar chart), Integrations, Developer (API keys with copy), Settings (tabbed)

**Data model** (`src/data/model.ts`)
- 14 TypeScript interfaces, ~80 interlinked seed records.
- Key exports: `people`, `companies`, `contacts`, `leads`, `opportunities`, `projects`, `tasks`, `meetings`, `proposals`, `outreach`, `inbox`, `agents`, `agentRuns`, `approvals`, `automations`, `integrations`, `activities`, `notifications`, `files`, `knowledge`, `services`, `runnerStatus`.
- Utility lookups: `personById`, `companyById`, `contactById`, `projectById`, `agentById`, `clients` (companies where `lifecycle === 'active_client'`), `fmtMoney`.
- Constants: `STAGES` (8 pipeline stages), `PROJECT_STATES` (6), `TASK_STATES` (6).
- `owner` is exported as the primary user (Marcus Vale).

**Installed packages** (beyond what AGENTS.md lists):
- `lucide-react` ^1.31 — all icons
- `recharts` ^3.10 — **installed but not yet used** (charts are CSS approximations)
- `@reduxjs/toolkit` and `react-redux` — **installed but not used** (no Redux store exists)

---

## What Is Missing or Broken — Prioritized

### P0 — Broken / misleading

1. **Recharts not wired.** `recharts` is installed but unused. Bar charts in `SalesOverview` (pipeline by stage) and `Reports` (revenue won) are CSS flex-height approximations. Data doesn't scale correctly and bars don't resize. Replace with real `<BarChart>` Recharts components. Wrap `<ResponsiveContainer>` in a div with explicit `min-h` — Recharts renders at 0px height inside flex parents otherwise.

2. **Reports view-switching is cosmetic.** The Overview / Sales / Delivery / Agents tabs render identical content for every tab. Each tab needs distinct content or the tabs should be removed until data supports them.

3. **Fast capture (Today screen) does nothing.** The textarea + Task/Note/Capture buttons have no handler. Should at minimum append to local task state and surface a confirmation.

4. **Light theme is in scope but not built.** Per `plans/background-i-m-building-compiled-parrot.md`, **full light theme parity is a confirmed requirement** — not optional. The current `index.css` has no `[data-theme="light"]` token block. The `ThemeProvider`, toggle button, and no-FOUC inline script in `index.html` are all missing. See the Light Theme section below for the exact token values.

### P1 — Core interactivity missing

5. **No create/edit flows.** "New lead," "Add task," "New proposal," etc. are all inert. Need a shared `Drawer` component (slide from right, ~480px) used for at minimum: New task, New lead, New opportunity, New project.

6. **Approve/Reject buttons are inert.** These are the highest-stakes interactive elements. Add optimistic removal from list on click with undo toast.

7. **Agent autonomy selector doesn't write state.** The segmented control in `AgentDetail` renders correctly but changing it has no effect.

8. **Automation toggles have no feedback.** Toggling works visually per-component but no toast confirms the change.

9. **Inbox comment input has no submit.** The textarea in the center pane needs a Send button and local state append.

### P2 — Polish

10. **Calendar is hardcoded to August 2026.** Use `new Date()` to compute the real current month, correct weekday offsets, and place events on their actual `scheduledAt` dates from the model.

11. **Gantt bars are eyeballed.** Compute real `left`/`width` from actual start/end dates rather than hardcoded percentages.

12. **No toast system.** The Developer screen's copy-to-clipboard already has the pattern (useState + setTimeout). Generalize to a fixed bottom-right toast stack used across Approve/Reject, capture, toggles, etc.

13. **EmptyState exists but is rarely used.** Wire it to zero-result conditions (all-read Notifications, filtered-empty Leads, etc.).

14. **No skeleton/loading states.** Stub a `Skeleton` component (pulsing gray block, composable width/height) before a backend is wired.

### P3 — Accessibility & reliability

15. **No ErrorBoundary.** A single runtime error in any screen crashes the whole app. Wrap the `<Screen>` render in `App.tsx` with an `ErrorBoundary` showing a fallback + "Try again."

16. **Missing ARIA.** Nav items need `role="navigation"` + `aria-current="page"`. `IconButton`s without visible text need `aria-label`. CommandMenu needs `role="dialog"` + `aria-modal`.

17. **No focus trap in sheets/overlays.** Tab escapes CommandMenu and mobile bottom sheets. Add `useFocusTrap` or install `focus-trap-react`.

18. **`Row` is not keyboard-operable.** Add `tabIndex={0}` + `onKeyDown` Enter-as-click.

### P4 — Architecture prep

19. **No shared mutable state.** Screens import directly from `model.ts`. Mutations (approve, create) won't propagate between screens. Add a lightweight `AppContext` holding mutable copies of the key collections with dispatch functions.

20. **Backend boundary is `model.ts`.** When Supabase is added, replace with `src/lib/api.ts` typed fetch functions and thin hooks (`useTasks()`, `useOpportunities()`). Design the hook signatures now wrapping static data so the swap is one file.

21. **Redux is installed but unused.** Either wire it for the AppContext mutation store (if P19 is implemented with Redux), or remove it. Dead weight in the bundle either way.

---

## Design Contract (Binding)

Source: `src/imports/linear-app-DESIGN-3.md`. Every component must use these tokens — no one-off hex, radius, shadow, or weight values anywhere.

### Dark theme (current, `:root`)

**Canvas and elevation ladder**
```
#08090a  canvas
#0f1011  level-1 (raised surface)
#141516  level-2 (row hover)
#191a1b  level-3
#1c1c1f  surface (panels, menus, inputs)
#232326  surface-raised (hover fills, chips)
#28282c  surface-active (active/pressed)
#000000d9  scrim (modal overlay)
```

**Text**
```
#f7f8f8  primary
#d0d6e0  secondary
#8a8f98  tertiary
#62666d  muted (placeholders, disabled, section headers)
```

**Borders**
```
#23252a  border (default hairline)
#34343a  border-strong
#3e3e44  border-input
#ffffff0d  hairline (translucent workhorse divider — use this everywhere)
#37393a  line (table/list dividers)
```

**Brand**
```
#5e6ad2  brand (primary buttons, active nav, selection, focus bg)
#7170ff  accent (links only)
rgba(94,106,210,.25)  ring (focus ring)
```

**Status hues** — use ONLY for state dots, priority icons, labels. Never in chrome.
```
#3caefe  blue
#27a644  green
#eb5757  red
#fc7840  orange
#f0bf00  yellow
#00b8cc  teal
```

### Light theme (required — not yet built)

Apply via `html[data-theme="light"]` overriding the same CSS custom property names. This is a hand-tuned palette, not an inversion.

**Canvas and elevation ladder (light)**
```
#ffffff    canvas
#f9f9fb    level-1
#f4f5f8    level-2 (row hover: same token, different value)
#eeeff2    level-3
#e7e8ec    surface
#dfe1e6    surface-raised
#d8dae0    surface-active
#000000bf  scrim
```

**Text (light)**
```
#08090a   primary
#3c4149   secondary
#6b7280   tertiary
#8a8f98   muted
```

**Borders (light)**
```
#e4e5e9   border
#d0d2d8   border-strong
#c9ccd1   border-input
#0000000d  hairline (5% black — mirror of the dark 5% white)
#d5d7db   line
```

**Brand (light — same indigo, adjusted ring)**
```
#5e6ad2              brand (unchanged)
#5a58e6              accent (darkened for contrast on white)
rgba(94,106,210,.35) ring (slightly stronger)
```

**Status hues re-tuned for light legibility**
```
#1f8fdb  blue
#1f8a38  green
#d13c3c  red
#e0632a  orange
#c99a00  yellow
#008fa0  teal
```

**Shadows (light — required because translucent-white glows don't read on white)**
```
menus/dialogs: 0 2px 4px #0000000f, 0 4px 24px #0000001a
```

### Typography (both themes — never changes)

- Font family: `"Inter Variable", "SF Pro Display", -apple-system, "Segoe UI", Roboto, sans-serif`
- Optical weights: 400, 510, 590, 680 — accessed via `font-weight` numerics on Inter Variable
- **Never use 500, 600, or 700**
- Titles: weight 590, never bold
- Body: 15px / 1.6 / weight 400
- Rows, labels, metadata: 13px / weight 510
- OpenType features: `"cv01", "ss03"` globally (cleaner geometric alternates)
- Wired via Google Fonts CSS2 `@import` at the top of `src/index.css`

### Shape and density

```
Radii:
  4px   — code, kbd chips
  6px   — rows, ghost buttons, sidebar items
  8px   — buttons, inputs, controls
  12px  — menus, command menu, cards
  16px  — large panels, bottom sheets

Control heights:
  28px  — sidebar nav rows
  32px  — buttons, inputs (md)
  28px  — buttons (sm)
  32–38px — list rows
  44px  — minimum mobile touch target

Sidebar width: 220–224px
Spacing grid: 4px base
```

### Motion

```
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)  (ease-out-quad)
Range: 100–160ms for all transitions
Never: springs, bounce, slow fades, decorative animation
Always: honor prefers-reduced-motion (collapse to 0.01ms)
```

### Theme mechanics (to be built)

- `ThemeProvider` (React context) sets `document.documentElement.dataset.theme`, persists to `localStorage` key `operator-os-theme`, defaults to `prefers-color-scheme` on first load.
- Toggle: Sun/Moon Lucide icons in the desktop breadcrumb bar and mobile More sheet. Also a ⌘K command: "Toggle theme."
- No-FOUC: an inline `<script>` in `index.html` reads `localStorage` and sets `data-theme` before React mounts.
- Files needed: `src/theme/ThemeProvider.tsx`, `src/theme/useTheme.ts`.

### Do / Don't (component quality gate)

**Do:**
- Use semantic CSS tokens — never hardcode hex, radius, shadow, or weight values in components
- Keep density high: 28px sidebar rows, 32px controls, 32–38px list rows
- Use `#ffffff0d` translucent hairline as the default divider (not border-color)
- Restrict indigo to: primary buttons, active nav, selected controls, focus ring
- Restrict status hues to: state dots, priority icons, label chips
- Support keyboard navigation and visible `:focus-visible` on every interactive element
- 44px minimum touch target for primary mobile actions
- 100–160ms ease-out-quad transitions, CSS-native

**Don't:**
- Use font weights 500, 600, or 700
- Use status hues in chrome (navigation, headers, backgrounds)
- Replace hairline borders with heavy drop shadows
- Make motion bouncy, springy, or slow
- Add padding that loosens the density — it breaks the shell's character
- Write color/radius/shadow values inline in JSX or as one-off Tailwind classes

---

## File Map

```text
src/
  main.tsx                 — React entrypoint; imports index.css; mounts App into #root
  App.tsx                  — Shell router (desktop/mobile split at 768px); ⌘K state; active route state
  index.css                — Tailwind v4 @import; Google Fonts @import (must be first); @theme token block; base body; utility classes
  data/
    model.ts               — All TypeScript interfaces + seed data + utility functions (backend boundary)
  lib/
    nav.ts                 — NAV sections/items, MOBILE_NAV, itemById helper
  components/
    ui.tsx                 — All design system primitives (Button, IconButton, Kbd, StatusDot, PriorityIcon, Avatar, Badge, Panel, SectionLabel, EmptyState, Ring)
    CommandMenu.tsx        — ⌘K overlay with keyboard nav
  screens/
    index.tsx              — Route ID → component map (SCREENS record)
    parts.tsx              — Page, Row, GroupHeader shared layout primitives
    today.tsx              — Today, MyWork, Inbox, Notifications
    sales.tsx              — SalesOverview, Leads, Companies, Contacts, Pipeline, Outreach, Meetings, Proposals, Services
    delivery.tsx           — Clients, Projects, Tasks, Calendar, Files, Knowledge
    intelligence.tsx       — IntelligenceCenter, Agents, Approvals, Automations, ModelRouting
    operations.tsx         — ActivityFeed, Reports, Integrations, Developer, Settings
  shell/
    DesktopShell.tsx       — 224px sidebar + breadcrumb header + main slot
    MobileShell.tsx        — Bottom nav + FAB + quick-action sheet + More sheet
  [theme/]                 — ThemeProvider.tsx + useTheme.ts (to be created)
index.html                 — Vite HTML shell; will need no-FOUC theme script
```

---

## Source Documents (read these before making product decisions)

| File | Purpose |
|---|---|
| `src/imports/pasted_text/operator-os-guide.md` | Full product contract — IA, entities, lifecycle, screens, agents, data model, phases |
| `src/imports/pasted_text/operator-os-prd.md` | Duplicate of the above (same content) |
| `src/imports/linear-app-DESIGN-3.md` | Binding visual spec — tokens, typography, component sizes, do/don't rules, agent prompt snippet |
| `src/imports/DESIGN.md` | Additional Linear design analysis — color roles, typography details, border system |
| `plans/background-i-m-building-compiled-parrot.md` | Previous build plan — records the dual-theme decision and light palette values |
| `plans/product-type-internal-agent-native-dapper-tarjan.md` | Earlier build plan — detailed phase breakdown and architecture decisions |

---

## Verification Checklist (run after any change)

- [ ] `npx tsc --noEmit` — exits clean, zero errors
- [ ] `pnpm vite build` — exits clean
- [ ] Every sidebar route renders a populated, on-brand screen
- [ ] Token spot-check: no 500/600/700 weights, no status color in chrome, hairline dividers (not box-shadow), indigo-only accents
- [ ] New interactive element: test Tab, Enter, Esc as well as mouse
- [ ] New screen content: test at 375px (mobile) and 1280px (desktop)
- [ ] Any chart: verify renders at non-zero height in a flex parent
- [ ] Any modal/sheet: focus is trapped, Esc closes it
- [ ] Both themes: every changed screen looks correct in dark AND light

- [ ] It preserves the connected lifecycle and one-source-of-truth data model.
- [ ] It works at desktop and mobile interaction levels; no critical dependence on hover, drag, or a desktop-only pane.
- [ ] It is complete in dark **and** light themes with semantic tokens only.
- [ ] It uses Inter 400/510/590/680 correctly; no 500/600/700 regressions.
- [ ] It uses indigo only for chrome and uses status colors only for explicit state/priority/data semantics.
- [ ] It follows dense sizing, 4px rhythm, hairline depth, short CSS-native motion, and keyboard-first interaction.
- [ ] It includes loading, empty, error, permission, confirmation, and success states appropriate to the action.
- [ ] It is accessible with keyboard, focus-visible treatment, appropriate ARIA semantics, and dialogs/sheets that contain focus.
- [ ] It uses protected typed backend operations, validation, auditability, and policy checks when backend work is in scope.
- [ ] It is checked in both themes and at representative mobile/desktop widths; run only relevant type/build/runtime checks proportional to the change.

## Next Work (do not start without explicit instruction)

Priority order for the next agent:

1. **Light theme** — `[data-theme="light"]` token block in `index.css`, `ThemeProvider`, toggle in shell, no-FOUC script in `index.html`. Verify every screen in light.
2. **Recharts** — replace CSS bar charts in `SalesOverview` and `Reports` with real Recharts components.
3. **ErrorBoundary** — wrap screen render in `App.tsx`.
4. **Toast system** — generalize Developer screen's copy pattern; wire to Approve/Reject and fast capture.
5. **Search button** — wire desktop header and mobile header search buttons to open CommandMenu.
6. **ARIA pass** — `aria-label` on all icon-only buttons, `aria-current="page"` on active nav item, `role="dialog"` on CommandMenu.
