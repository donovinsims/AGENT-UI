# Operator OS — Backend Integration Contract (Deferred)

> Status: future-facing integration contract. Frontend remains Vite + React + Tailwind with static in-memory data pending Phase 1.
>
> Last updated: 2026-08-14.

## Appwrite project (connected)

An Appwrite project is already provisioned. Credentials are loaded from Vite env vars (gitignored).

| Field | Value |
|---|---|
| Project | `Operator OS` |
| Project ID | `6a83ccb1003df382ce3c` |
| Dashboard URL | `https://cloud.appwrite.io/console/project-fra-6a83ccb1003df382ce3c` |
| Credentials file | `src/lib/appwrite.ts` (client config from Vite env vars) |
| KV client | `src/lib/kv.ts` |

When Phase 1 begins, import credentials from env vars via `src/lib/appwrite.ts` exclusively. Never hardcode project refs or keys elsewhere.

## Objective

Replace the static `src/data/model.ts` source with a secure, validated business-operation layer without changing the product’s core principle:

> The owner may operate manually from desktop or mobile. Agents, CLI, automations, integrations, and future APIs call the **same validated backend operations**. They never click the UI or receive direct database credentials.

## Non-negotiable boundary

```text
Web UI ─┐
Mobile UI ─┼─> authenticated application/API boundary ─> validated domain operations ─> database/storage/integrations
CLI ─────┤                                             └> audit/event stream
Agents ──┤
Automations / webhooks ─┘
```

Clients differ in authentication and presentation, not in their ability to bypass policy or data validation.

### Prohibited shortcuts

- No browser-only mutation that is not represented by a validated domain operation.
- No direct database credentials in agents, CLI tools, browsers, or third-party integrations.
- No client-selected tenant/workspace identifier trusted without authorization checks.
- No status-only agent execution without durable run/audit records.
- No developer screen mock API key promoted into a real secret path.

## Phased implementation order

### Phase 0 — frontend preservation (current)

- Keep the SPA and existing route/screen component boundaries intact.
- Keep `src/data/model.ts` as the seed fixture source until each screen has an equivalent query/mutation adapter.
- Appwrite is connected but not yet wired to UI data paths; keep `src/data/model.ts` as the seed source until each screen has an equivalent query/mutation adapter.

### Phase 1 — foundation

1. Add authenticated workspace/organization context.
2. Define membership, roles, permission checks, and tenant isolation.
3. Establish a typed data access/repository boundary replacing direct screen imports incrementally.
4. Add audit event infrastructure before high-stakes mutations (approvals, outreach sends, agent action, lifecycle transitions).
5. Introduce feature-safe loading, empty, forbidden, error, and retry UI contracts.

### Phase 2 — core business lifecycle

1. CRM: companies, contacts, leads, opportunities.
2. Sales actions: stage transitions, meetings, outreach, proposals.
3. Delivery: clients, projects, tasks, files/knowledge metadata.
4. Transaction/event operations for won-deal → client/project conversion.

### Phase 3 — agent-native operations

1. Agents and versioned configuration/scopes.
2. Agent runs, tool calls, artifacts, model routes, and failure/retry states.
3. Approvals with decision, actor, rationale, expiry, and append-only audit history.
4. Automations and integrations with guarded dispatch and idempotency.
5. CLI/API/MCP surfaces that invoke the same application operations.

### Phase 4 — realtime and operational quality

- scoped subscriptions for activity, notifications, approval queues, pipeline/project updates, and long-running agent runs;
- search/indexing and reporting queries;
- observability, rate limiting, queues, retries, dead-letter or manual-recovery workflows;
- backup, retention, export/deletion, and security review.

## Canonical domain-operation shape

The implementation may use REST, RPC, server actions, or another transport, but every mutation should conceptually support:

```ts
interface OperationRequest<TInput> {
  input: TInput
  idempotencyKey?: string
  expectedVersion?: string
  clientContext?: {
    surface: 'web' | 'mobile' | 'cli' | 'agent' | 'automation' | 'integration'
    requestId?: string
  }
}

interface OperationResult<TData> {
  data: TData
  auditEventId: string
  version?: string
}
```

Returned errors should be typed and renderable: `unauthenticated`, `forbidden`, `not_found`, `validation_failed`, `conflict`, `approval_required`, `rate_limited`, `integration_unavailable`, `retryable_failure`, and `internal_error`.

Never expose raw backend/provider error text to users or agents without a deliberate safe mapping.

## High-priority operations

| Domain | Required operations | Important validation/audit behavior |
| --- | --- | --- |
| CRM | create/update Company, Contact, Lead; qualify/disqualify Lead | Membership, owner assignment, lifecycle transition rules, change audit |
| Pipeline | create/update Opportunity; move stage; mark won/lost | Expected version for drag/drop; stage rules; won/lost reason; audit; idempotency |
| Proposal | create/revise/send/view/accept/reject Proposal | Commercial approval policy, recipient verification, immutable sent revision/artifact |
| Outreach | draft, request approval, schedule, send, classify reply | Approval gate, provider status, idempotency, opt-out/compliance policies, audit |
| Delivery | create Project from template; create/update Task; update project health/state | Client/link validation, template version, assignment permission, state audit |
| Files/knowledge | upload metadata, grant access, link entity, version knowledge | Signed storage, workspace policy, virus/content workflow as appropriate, revision history |
| Agent | configure/pause/resume Agent; create/run/cancel AgentRun | Scope/policy validation, model-route decision, initiator attribution, run/tool/artifact audit |
| Approval | request, approve, reject, expire/cancel approval | Authorized decision-maker, one terminal decision, reason, actor, timestamp, affected operation link |
| Automation | enable/disable Automation; dispatch/retry run | Event definition, policy check, idempotency, retry/failure trace |
| Integrations | connect/revoke/test/sync integration | OAuth/secret isolation, workspace scope, credential lifecycle, safe status projection |

## Data and tenancy contract

- Every durable business record belongs to exactly one workspace/organization, even if the initial application has only one.
- Every query and mutation is scoped server-side by authenticated membership, never by an untrusted client filter alone.
- Current seed entity relationships and state vocabularies are recorded in `plans/domain-model-and-seed-data.md` and should inform the first schema/migration design.
- Human-readable references (`OPP-*`, `PRJ-*`) are not primary keys.
- Use ISO timestamps and canonical money/currency fields in APIs; relative time and formatted currency belong in the UI.
- Use an explicit version/revision or updated-at concurrency strategy for list drag/drop, approvals, task/project edits, and lifecycle transitions.

## Agent, CLI, and integration safety

### Agents

- Agents act only through scoped tool/domain-operation permissions.
- Autonomy levels (`observe`, `suggest`, `draft`, `act`, `operate`) are policy inputs, not cosmetic UI values.
- “Act” and “operate” require per-action authorization, workspace guardrails, and any required human approval—not a blanket bypass.
- Persist a run record for every execution, including initiator, configured model route, fallback decision, input/output/artifact references, tool calls, state, timestamps, and errors.

### CLI and MCP/API surfaces

- Use user or service identity with least-privilege scopes; never reuse a browser session secret as a generic API key.
- Each operation must produce the same validation and audit result as its web equivalent.
- Support idempotency for any write that can be retried by a CLI, webhook, queue, or agent runner.
- Require explicit workspace targeting only after authorization resolves that target.

### Integrations and secrets

- Store provider credentials server-side in a managed secret store or an equivalent protected mechanism.
- The frontend receives only safe integration status and configuration summaries.
- Do not place credentials in Vite environment variables intended for client code.
- Include token refresh/revocation, health checks, provider-rate-limit handling, and disconnect/recovery state in the integration design.

## Frontend data-access migration

The desired direction is:

```text
Today: screen → src/data/model.ts
Later: screen → query/mutation hook or repository → authenticated API → domain operation
```

Migration requirements:

1. Preserve existing screen components and shared UI primitives where possible.
2. Use typed loading, empty, error, and unavailable states per query/mutation.
3. Optimistically update only operations with a rollback/refresh strategy; approvals, sending, and lifecycle transitions must show definitive server results.
4. Replace hardcoded seed lookups by capability, not through a single large “global store” rewrite.
5. Maintain desktop/mobile parity: a successful operation must be reflected consistently across both shells.
6. Treat theme as presentation-only; no data path may rely on dark/light styling classes or raw visual colors.

## UI states every backed action needs

| State | Requirement |
| --- | --- |
| Loading | Preserve layout density and communicate pending work without showing stale success as current |
| Empty | Explain the absence and show an authorized next action when one exists |
| Validation failure | Keep user input, identify field/action issue, avoid raw server error text |
| Forbidden | State that access is unavailable without implying the record does not exist |
| Conflict | Explain concurrent change and offer refresh/review; avoid blind overwrite |
| Offline/provider failure | Distinguish local app failure from integration/runner unavailability; provide safe retry when applicable |
| Success | Confirm the server-committed result and expose audit/history context for high-stakes actions |
| Realtime update | Attribute external/agent updates and avoid disrupting in-progress local edits |

## Acceptance gates before turning on real writes

- [ ] Workspace isolation and role-based authorization are enforced server-side.
- [ ] A web user, CLI identity, agent identity, and integration identity cannot bypass the same operation policy.
- [ ] High-stakes actions record immutable audit events with actor, source surface, timestamp, before/after or operation payload, and result.
- [ ] All retryable writes accept idempotency keys or have a documented equivalent.
- [ ] Approval decisions cannot be double-applied or silently overwritten.
- [ ] Real keys/tokens never appear in frontend bundles, seed data, screenshots, logs, or Developer UI.
- [ ] Query/mutation failure states are designed and checked in dark and light themes.
- [ ] The current 29-route screen inventory remains reachable during migration.
