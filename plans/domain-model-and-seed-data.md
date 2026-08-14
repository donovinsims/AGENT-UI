# Operator OS — Frontend Domain Model & Seed Data Contract

> Status: frontend contract for the existing in-memory model. This document records the data shape the later Supabase/API/CLI/agent layer must preserve or deliberately migrate.
>
> Last verified: 2026-08-14 against `src/data/model.ts`.

## Boundary and rules

`src/data/model.ts` is the current **single frontend data boundary**. Screens import typed collections and lookup helpers from it directly. It is static seed data, not an authoritative production datastore.

When backend work begins:

- preserve stable, opaque IDs; do not make display names the join key;
- retain the relationships and state vocabularies documented here unless a migration is explicitly approved;
- replace collection access through a repository/query boundary incrementally—do not introduce a second competing seed model;
- return domain errors and permissions as data the UI can render; do not make agents or CLI clients click browser UI;
- treat all displayed operational and developer credentials as examples only, never real credentials.

## Identity and ownership

| Entity | ID pattern in seed | Primary relationships | Notes |
| --- | --- | --- | --- |
| Person | `u_*` | Owns companies/opportunities; leads projects; is task assignee; appears in activity | `owner` is `people[0]` (Marcus Vale) and represents the current primary user |
| Company | `c_*` | Has contacts, opportunities, meetings, projects/tasks/files through references | `lifecycle` distinguishes lead, prospect, active client, churned |
| Contact | `p_*` | Belongs to a company; participates in opportunity and outreach records | Contact IDs use `p_*`, distinct from internal People `u_*` IDs |

Current helpers: `personById(id?)`, `companyById(id)`, `contactById(id)`, and `clients` (companies where `lifecycle === 'active_client'`).

## Lifecycle model

```text
Company/Lead → research & qualification → opportunity → proposal → won opportunity
→ active client → implementation project → tasks/milestones/files → completion / ongoing success
```

The seed data intentionally models the business lifecycle across Sales, Delivery, Intelligence, and Operations. A backend migration must preserve references rather than flattening screens into independent datasets.

## Core CRM and sales entities

### Company

`Company`: `id`, `name`, `domain`, `industry`, `size`, `location`, `lifecycle`, `owner`, `tags`, optional `health`.

- `owner` references `Person.id`.
- `health` is a `StatusColor`; it conveys state, not decorative chrome.
- `lifecycle`: `lead | prospect | active_client | churned`.

### Contact

`Contact`: `id`, `name`, `initials`, `color`, `title`, `companyId`, `email`, `phone`, `lastTouch`.

- `companyId` references `Company.id`.
- Avatar/color fields are current presentation data. Long term, treat avatar styling separately from identity/profile data.

### Lead

`Lead`: `id`, `name`, `company`, `title`, `source`, `score`, `stage`, `owner`, `createdAt`, optional `evidence`.

- `owner` references `Person.id`.
- Current `company` is a display string, not a `companyId`. This is a deliberate migration gap: decide whether qualification creates/links a canonical Company record.
- `stage`: `new | researching | contacted | qualified | disqualified`.

### Opportunity

`Opportunity`: `id`, `ref`, `title`, `companyId`, `contactId`, `stage`, `value`, `priority`, `owner`, `closeDate`, `nextAction`, `service`, `labels`, optional `atRisk`.

- `companyId` → Company; `contactId` → Contact; `owner` → Person.
- `value` is numeric; keep currency and locale explicit in backend contracts rather than storing formatted money.
- `ref` is a human-facing reference such as `OPP-###`, not the primary key.
- Pipeline stages are the canonical `STAGES` vocabulary:
  `new`, `qualified`, `discovery`, `solution`, `proposal`, `negotiation`, `won`, `lost`.
- A move to `won` is the current trigger concept for “create project from template.” It requires validated transition and audit behavior in production.

### Proposal, outreach, meeting, and service

| Entity | Fields / relationships | State vocabulary |
| --- | --- | --- |
| Proposal | `id`, `ref`, title, `companyId`, `opportunityId`, value, status, updatedAt | `draft`, `internal_review`, `sent`, `viewed`, `accepted`, `rejected`, `expired` |
| OutreachThread | `id`, subject, `contactId`, `companyId`, state, preview, when, optional sequence/agentDrafted | `draft`, `scheduled`, `sent`, `replied`, `awaiting`, `bounced` |
| Meeting | `id`, title, type, `companyId`, when, duration, attendees, hasBrief, optional outcome | Types: Discovery, Demo, Follow-up, Client |
| Service | `id`, name, price, cadence, desc, active | `price` currently display text; introduce numeric pricing/currency if it becomes transactional |

## Delivery entities

### Project

`Project`: `id`, `ref`, `name`, `clientId`, optional `opportunityId`, `state`, `health`, `lead`, `progress`, `startDate`, `targetDate`, `phases`, `scope`.

- `clientId` references an active-client Company.
- `opportunityId` references the source opportunity when the project originated from a won deal.
- `lead` references `Person.id`.
- `progress` is numeric (currently UI percentage semantics); define its calculation/source of truth before backend persistence.
- `phases` is currently embedded `{ name, start, end, done }[]`, using timeline-relative numeric positions. If phases become independently editable/auditable, normalize them into project milestones.
- Project state vocabulary is the exported `PROJECT_STATES` constant: `planned`, `active`, `waiting`, `blocked`, `review`, `completed`.

### Task

`Task`: `id`, `ref`, `title`, `state`, `priority`, optional `assignee`, optional `projectId`, optional `companyId`, optional `due`, `labels`, optional `agentAssigned`.

- `assignee` → Person; `projectId` → Project; `companyId` → Company.
- A task may be cross-cutting: neither project nor company is required in the current seed contract.
- Task state vocabulary is the exported `TASK_STATES` constant: `backlog`, `ready`, `in_progress`, `waiting`, `review`, `done`.
- `Priority`: `none`, `low`, `medium`, `high`, `urgent`.

### Files and knowledge

| Entity | Fields / relationships | Migration notes |
| --- | --- | --- |
| FileRec | `id`, name, kind, size, `linkedTo`, owner, updatedAt | `linkedTo` is polymorphic text (`PRJ-*`, `OPP-*`, or company ID). Replace with a typed link/join model before storage integration. `size` is display text, not bytes. |
| KnowledgeDoc | `id`, title, category, updatedAt, attachedAgents | No document body, revision, author, access policy, or explicit agent relation exists yet. |

Knowledge categories: `SOP`, `Playbook`, `Template`, `Offer`, `Agent Instruction`.

## Intelligence and operational entities

| Entity | Fields / relationships | State vocabulary / notes |
| --- | --- | --- |
| Agent | `id`, name, purpose, autonomy, status, model, fallback, runsToday, successRate, scopes, emoji, lastRun | Autonomy: `observe`, `suggest`, `draft`, `act`, `operate`; status: `active`, `paused`, `draft`. Model strings are display-only until a routing service exists. |
| AgentRun | `id`, `agentId`, initiator, task, status, model, fellBack, duration, when, tokens | Status: `running`, `completed`, `failed`, `awaiting_approval`. Must become an append-only/auditable execution record. |
| Approval | `id`, action, agent, detail, risk, requestedAt, scope | Current `agent` is display text, not an ID; approval decision/history is not yet modeled. |
| Automation | `id`, name, trigger, action, enabled, runs, lastRun | Trigger/action are display text. A backend needs typed event, policy, run, and failure semantics. |
| Integration | name, category, status, detail | No ID or credential reference. Status: `connected`, `offline`, `unreachable`, `available`. |
| Activity | actor, text, target, when, kind | UI feed model only; no immutable event ID or timestamp yet. |
| Notification | `id`, title, detail, when, unread, kind | Kind: `mention`, `approval`, `assigned`, `reply`, `system`; needs recipient and read-at semantics. |

`runnerStatus` is a display projection of runner/integration state and should not become a separate source of truth from integrations/routing data.

## ID and reference migration rules

1. **Keep opaque IDs stable.** Existing IDs are frontend fixtures, but later records should use immutable UUIDs/ULIDs or equivalent opaque IDs. Human-readable `ref` fields remain separately unique display identifiers.
2. **Do not rely on names.** `AgentRun.agentId`, Company/Contact/Opportunity/Project/Task IDs, and Person IDs are the supported joins; display names may change.
3. **Repair known weak references.** Lead.company, Approval.agent, FileRec.linkedTo, Activity actor/target, and Automation trigger/action are display-oriented seed fields requiring typed relationships or event models.
4. **Use timestamps, not relative strings.** Seed values like `2d ago`, `Today`, and `Blocked` are display fixtures. APIs need timezone-aware ISO timestamps plus derived UI labels.
5. **Separate state from presentation.** Avatar colors, emoji, `price`/`size` display strings, and status colors need canonical data/presentation mapping rather than direct database storage where inappropriate.

## Seed-data acceptance checks

Before changing `src/data/model.ts` or introducing a repository layer:

- every foreign-key-like field resolves to a known seed record or is explicitly optional;
- no state value falls outside its exported state vocabulary;
- a won opportunity can be traced to its proposal(s), client Company, and optional delivery Project;
- tasks, files, and meetings retain their project/company context;
- agent runs and approvals remain traceable to a stable agent identity;
- UI screens preserve their existing data access behavior until their replacement queries are ready.

## Deferred production concerns

These are intentionally **not** implemented by the seed model and need explicit backend design later:

- organization/workspace tenancy and membership;
- roles, permission grants, and row-level access policy;
- authoritative audit log and immutable agent-run history;
- document/file storage and signed access;
- real integration credentials, OAuth/token refresh, and secret management;
- validation, idempotency, concurrency/versioning, retry handling, and realtime updates;
- monetary currency, timezone, date semantics, and full-text search.
