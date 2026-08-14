# Operator OS — UI Screen Inventory

> Status: documentation only. This is a route-to-screen and capability map for the current Vite/React frontend. It does not authorize a new implementation phase.
>
> Last verified: 2026-08-14 against `src/lib/nav.ts`, `src/screens/index.tsx`, `src/App.tsx`, and the screen modules.

## Purpose and scope

Operator OS is a single-page frontend with **29 navigable desktop routes**. Route selection is currently local React state (`active` in `src/App.tsx`), not URL routing. Every route has a populated screen component and reads static, typed in-memory data from `src/data/model.ts`.

This document separates what is rendered today from what is actually persisted or operational. Until a later backend phase, content and most mutations are demonstration state only.

## Shell and navigation contract

| Surface | Current behavior | Source |
| --- | --- | --- |
| Desktop shell | Fixed 224px sidebar, five grouped navigation areas, workspace header, breadcrumb bar, command trigger | `src/shell/DesktopShell.tsx` |
| Mobile shell | Five bottom tabs, floating quick-action control, quick-action sheet, full “More” navigation sheet | `src/shell/MobileShell.tsx` |
| Command menu | ⌘/Ctrl K overlay with keyboard navigation; filters navigation and exposes five hardcoded actions | `src/components/CommandMenu.tsx` |
| Routing | `active` string selects a component in `SCREENS`; no URL, back/forward, deep link, or route guard behavior | `src/App.tsx`, `src/screens/index.tsx` |
| Navigation definitions | Five desktop groups, 29 desktop items; mobile promotes Today, Sales, Work, Agents, and More | `src/lib/nav.ts` |

**Mobile note:** `agents` is a real screen route. The fallback in `App.tsx` is defensive and should not be treated as a separate Intelligence route.

## Current screen matrix

### Today

| Route ID | Screen | Current purpose / primary data | Current interaction state |
| --- | --- | --- | --- |
| `today` | Today | Executive briefing, pipeline/approval/project KPI summary, approvals, risks, work, agent activity; `tasks`, `opportunities`, `approvals`, `agentRuns`, `meetings` | Fast capture UI and most CTAs are non-persistent; approval buttons are display-only |
| `my-work` | My Work | Owner-centric task and project work queue; `tasks`, people/project lookups | View/filter presentation only |
| `inbox` | Inbox | Work-item inbox with message detail, comments, and activity; `inbox` | Selection/detail is frontend-local; no durable comment or state mutation |
| `notifications` | Notifications | Read/unread activity notifications; `notifications` | Read state is seeded; no durable notification controls |

### Sales

| Route ID | Screen | Current purpose / primary data | Current interaction state |
| --- | --- | --- | --- |
| `sales-overview` | Sales Overview | Pipeline KPIs, stage summary and activity; `opportunities`, `STAGES` | Charts are CSS approximations, not data-visualization components |
| `leads` | Leads | Lead research and qualification list; `leads`, people | Listing/filter presentation; create/qualification workflows not implemented |
| `companies` | Companies | Account directory and lifecycle context; `companies`, people | Read-only presentation |
| `contacts` | Contacts | Contact directory tied to companies; `contacts`, companies | Read-only presentation |
| `pipeline` | Pipeline | Opportunity Kanban, list, and forecast representations; `opportunities`, `STAGES` | Native HTML5 drag changes only local visual order/state; no audit, validation, or persistence |
| `outreach` | Outreach | Outbound/reply threads; `outreach`, contacts, companies | Read-only thread presentation; no sending or drafting backend |
| `meetings` | Meetings | Discovery, demo, follow-up, and client meetings; `meetings` | Read-only presentation |
| `proposals` | Proposals | Proposal list and commercial status; `proposals`, opportunities, companies | Read-only presentation; accept/reject lifecycle absent |
| `services` | Services | Reusable service offer catalog; `services` | Read-only presentation |

### Delivery

| Route ID | Screen | Current purpose / primary data | Current interaction state |
| --- | --- | --- | --- |
| `clients` | Clients | Active-client view of companies; derived `clients` | Read-only presentation |
| `projects` | Projects | Delivery project list, Kanban, and Gantt-style timeline; `projects`, `PROJECT_STATES` | View switching is local; no project mutation workflow |
| `tasks` | Tasks | Cross-project task queue; `tasks`, people/projects/companies | Read-only presentation; no durable task creation or changes |
| `calendar` | Calendar | Month-grid delivery and sales calendar; `meetings`, tasks/projects as displayed | Read-only presentation |
| `files` | Files | Files linked to project, opportunity, or company references; `files` | Metadata-only; no storage/upload/download integration |
| `knowledge` | Knowledge | SOP, playbook, offer, template, and agent instruction library; `knowledge` | Metadata-only; document content/versioning unavailable |

### Intelligence

| Route ID | Screen | Current purpose / primary data | Current interaction state |
| --- | --- | --- | --- |
| `intelligence` | Intelligence Center | Agent operating overview, run health, approvals, and model/runner status; `agents`, `agentRuns`, `approvals`, `runnerStatus` | Dashboard only; no live runner connection |
| `agents` | Agents / Agent Detail | Agent catalog and selected-agent run history, scopes, model/fallback, and autonomy control; `agents`, `agentRuns` | Detail selection is local; autonomy selector is not persisted or operational |
| `approvals` | Approvals | Human approval queue for agent actions; `approvals` | Approve/reject affordances are not backed by state transitions, undo, or audit logs |
| `automations` | Automations | Trigger/action automation registry; `automations` | Toggle is UI-only and has no backend execution or feedback contract |
| `model-routing` | Model Routing | Model-lane and runner routing/status; `runnerStatus`, integrations context | Read-only presentation |

### Operations

| Route ID | Screen | Current purpose / primary data | Current interaction state |
| --- | --- | --- | --- |
| `activity` | Activity | Cross-domain activity feed; `activities` | Read-only presentation |
| `reports` | Reports | Business KPIs and revenue visualization; opportunities/projects/agents as rendered | Overview/Sales/Delivery/Agents tabs currently show the same content; chart bars are CSS approximations |
| `integrations` | Integrations | Connected, available, offline, and unreachable service inventory; `integrations` | Status is seeded; connect/reconnect/configure flows absent |
| `developer` | Developer | Intended API/CLI/MCP/Webhook surfaces and masked key list | Copy works client-side; displayed keys and surfaces are mock data, not credentials or live APIs |
| `settings` | Settings | Workspace, member, security, and billing settings views | Tabs are local; data is static and edits are absent |

## Shared primitives and expected reuse

| Area | Existing shared pieces |
| --- | --- |
| UI primitives | `Button`, `IconButton`, `Kbd`, `StatusDot`, `PriorityIcon`, `Avatar`, `Badge`, `Panel`, `SectionLabel`, `EmptyState`, `Ring` in `src/components/ui.tsx` |
| Screen layout | `Page`, `FilterButton`, `Row`, `GroupHeader` in `src/screens/parts.tsx` |
| Navigation | `NAV`, `MOBILE_NAV`, `ALL_ITEMS`, `itemById` in `src/lib/nav.ts` |
| Data boundary | Typed collections and ID lookups in `src/data/model.ts` |

Before adding a new primitive or changing a common layout convention, check these modules first. The future data layer should replace model access behind the screens rather than duplicate these route-level presentation responsibilities.

## Cross-screen data dependency map

```text
People ────────────────┬── Companies ── Contacts ── Outreach / Meetings
                       │       │              └── Opportunities ── Proposals
                       │       │                       │
                       │       └── Active clients     └── Projects ── Tasks / Files
                       │                                      │
                       └── Assignees / owners                 └── Calendar / Today

Agents ── Agent runs ── Approvals ── Automations ── Integrations / model routing
                                  └── Today / Notifications / Activity
```

## UX gaps that matter to later implementation

1. **No real routing contract.** Decide whether URL routing, deep links, and browser navigation belong in the next frontend phase before wiring backend pages.
2. **No shared mutation surface.** New lead/task/opportunity/project actions need a common drawer/modal, validation, optimistic-update, failure, and undo pattern.
3. **No durable state model.** Current drag, toggles, selections, and “approve/reject” affordances are isolated local UI behavior or inert.
4. **No entity detail routing.** Agent detail exists internally; CRM, opportunity, project, task, proposal, and client detail records lack a stable navigable detail contract.
5. **No theme parity yet.** The shell and every screen must be checked in both dark and light themes once the token theme mechanism is introduced.

## Source of truth precedence

1. `plans/i-noticed-we-have-lexical-wigderson.md` — authoritative project handoff and current implementation status.
2. `src/imports/linear-app-DESIGN-3.md` — binding visual/design contract.
3. This inventory — current screen and route map.
4. Source modules listed above — implementation truth if documents drift.
