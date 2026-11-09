# affectUI Agent / Orchestration integration

**Status: registry configured; Pro source not installed.** The registry is license-gated. Do not merge a UI route that imports the screen before the source is installed and committed.

## Install locally

1. Sign in at https://www.affectui.com and obtain your Pro access key from **Account → Downloads**.
2. In this repo root, add `AFFECTUI_TOKEN=aui_...` to `.env.local`. The repo's `.gitignore` ignores `.env*`; **never commit, log, or paste the key**.
3. Run:

   ```bash
   npx shadcn@latest add @affectui/agent-orchestration
   ```

   The `@affectui` registry in `components.json` sends `Authorization: Bearer ${AFFECTUI_TOKEN}`. Using the raw registry URL without that header returns HTTP 401.
4. Verify the CLI added `src/components/ui/agent-orchestration.tsx`, its **App Shell** and **Context Map** dependencies, and any `@hugeicons/react` / `@hugeicons/core-free-icons` packages required by the installed source.
5. Run `npm run build`. Review all generated files before committing; do **not** modify the component's styles, CSS variables or motion.

## Connect it to this app

The existing `src/screens/intelligence.tsx` **Agents** view is an agent directory with static preview records. Preserve that page. Give **Agent / Orchestration** its own run-detail route or screen, reached from a selected run, rather than replacing the directory.

Render the purchased screen from `@/components/ui/agent-orchestration` with:
- `project`, `runId`, `agents`, `events`, `elapsed`, and where available `spans`, `tools` and `live` from an actual run feed.
- Agent `parent` IDs for a real tree; statuses (`queued`, `running`, `waiting`, `done`, `failed`, `stopped`) from backend state.
- Tool/LLM spans with real timing, events, and measured tokens/cost. Missing measurement should remain unknown, not default to zero.
- `onResolve` and `onRunControl` wired to authenticated backend approval/run-control actions. Do not make those actions appear successful from a client-only state update. For sensitive approvals, retain your app's existing approval guardrails.
- `onNavigate` mapped to this app's real navigation IDs, not placeholder labels.

This repository currently has static agent data. Installing a React screen does **not** create a realtime orchestration backend, event stream, or accounting service. Add those separately or render an explicitly labeled, noninteractive preview until they exist.

## QA

- Test a running run, a waiting approval, failure/retry, and a completed run.
- Test desktop and mobile (especially widths below 640px), keyboard navigation, touch pan/zoom, dark/light modes, and reduced-motion preference.
- Give the component a full-height viewport container; avoid nesting scroll containers that break the canvas.
- Ensure private agent context/tool inputs are filtered and authorized before delivery to the browser.

Source: https://www.affectui.com/screens/agent-orchestration and https://www.affectui.com/docs/installation#pro
