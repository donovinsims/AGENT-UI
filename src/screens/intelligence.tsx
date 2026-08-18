import { useState } from "react"
import {
  Sparkles,
  Play,
  Pause,
  Check,
  X,
  ArrowLeft,
  Cpu,
  ShieldCheck,
  Activity as ActivityIcon,
  Plus,
} from "lucide-react"
import {
  agents,
  agentById,
  agentRuns,
  approvals,
  automations,
  runnerStatus,
  type AutonomyLevel,
  type Agent,
} from "../data/model"
import {
  Panel,
  Button,
  Badge,
  StatusDot,
  Ring,
  SectionLabel,
} from "../components/ui"
import { Page, Row } from "./parts"
import { useToast } from "../components/Toast"

const AUTONOMY: { id: AutonomyLevel; label: string }[] = [
  { id: "observe", label: "Observe" },
  { id: "suggest", label: "Suggest" },
  { id: "draft", label: "Draft" },
  { id: "act", label: "Act" },
  { id: "operate", label: "Operate" },
]

const runColor = {
  running: "blue",
  completed: "green",
  failed: "red",
  awaiting_approval: "orange",
} as const

// ---------- Intelligence Center ----------
export function IntelligenceCenter() {
  const active = agents.filter((a) => a.status === "active").length
  const runs = agents.reduce((n, a) => n + a.runsToday, 0)
  return (
    <Page title="Intelligence Center">
      <div className="p-4 md:p-6 max-w-[1150px] space-y-4">
        <Panel
          className="p-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(94,106,210,.10), transparent)",
          }}
        >
          <div className="flex items-center gap-2 mb-2 text-sidebar-primary">
            <Sparkles size={16} />
            <SectionLabel className="!text-sidebar-primary">
              Executive briefing
            </SectionLabel>
          </div>
          <p className="text-[15px] leading-[1.6] text-muted-foreground max-w-2xl">
            Agents completed{" "}
            <span className="text-foreground w-medium">{runs} runs</span> today
            across sales, delivery and operations. Three actions await your
            approval, one deal is drifting, and the Mac Runner is offline —
            local-only automations are paused until it reconnects.
          </p>
        </Panel>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Active agents",
              value: `${active}/${agents.length}`,
              icon: Cpu,
            },
            { label: "Runs today", value: runs, icon: ActivityIcon },
            {
              label: "Awaiting approval",
              value: approvals.length,
              icon: ShieldCheck,
            },
            { label: "Avg success", value: "96%", icon: Sparkles },
          ].map((k) => (
            <Panel key={k.label} className="p-3.5">
              <k.icon size={15} className="text-muted-foreground mb-2" />
              <div className="text-[22px] w-semibold tabular leading-none">
                {k.value}
              </div>
              <div className="text-[12px] text-muted-foreground mt-1.5">
                {k.label}
              </div>
            </Panel>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <div className="flex items-center h-11 px-4 border-b border-border">
              <span className="text-[13px] w-semibold">Recent runs</span>
            </div>
            {agentRuns.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 h-[42px] px-4 border-b border-border last:border-0"
              >
                <StatusDot
                  color={runColor[r.status]}
                  ring={r.status === "running"}
                />
                <span className="text-[16px]">
                  {agentById(r.agentId).emoji}
                </span>
                <span className="text-[13px] truncate flex-1">{r.task}</span>
                {r.fellBack && <Badge color="orange">fell back</Badge>}
                <span className="text-[12px] text-muted-foreground tabular">
                  {r.when}
                </span>
              </div>
            ))}
          </Panel>
          <Panel>
            <div className="flex items-center h-11 px-4 border-b border-border">
              <span className="text-[13px] w-semibold">
                Model & runner health
              </span>
            </div>
            {runnerStatus.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 h-[42px] px-4 border-b border-border last:border-0"
              >
                <StatusDot color={r.color} />
                <span className="text-[13px] flex-1">{r.name}</span>
                <span className="text-[12px] text-muted-foreground">
                  {r.status}
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Page>
  )
}

// ---------- Agents directory + detail ----------
export function Agents() {
  const [openId, setOpenId] = useState<string | null>(null)
  if (openId)
    return (
      <AgentDetail agent={agentById(openId)} onBack={() => setOpenId(null)} />
    )
  return (
    <Page
      title="Agents"
      count={agents.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New agent
        </Button>
      }
    >
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-w-[1200px]">
        {agents.map((a) => (
          <Panel
            key={a.id}
            className="p-4 cursor-pointer hover:bg-secondary transition-colors"
          >
            <button
              onClick={() => setOpenId(a.id)}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="grid place-items-center h-10 w-10 rounded-[10px] bg-accent text-[18px]">
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] w-medium truncate">
                      {a.name}
                    </span>
                  </div>
                  <div className="text-[12px] text-muted-foreground line-clamp-2 mt-0.5">
                    {a.purpose}
                  </div>
                </div>
                <StatusDot
                  color={
                    a.status === "active"
                      ? "green"
                      : a.status === "paused"
                        ? "gray"
                        : "yellow"
                  }
                  ring={a.status !== "active"}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color="indigo">{a.autonomy}</Badge>
                <Badge>{a.model}</Badge>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-[12px] text-muted-foreground">
                <span>{a.runsToday} runs today</span>
                <span className="flex items-center gap-1.5">
                  <Ring
                    value={a.successRate}
                    size={18}
                    color="var(--color-status-green)"
                  />{" "}
                  {a.successRate}%
                </span>
              </div>
            </button>
          </Panel>
        ))}
      </div>
    </Page>
  )
}

function AgentDetail({ agent, onBack }: { agent: Agent; onBack: () => void }) {
  const runs = agentRuns.filter((r) => r.agentId === agent.id)
  const [autonomy, setAutonomy] = useState(agent.autonomy)
  const { notify } = useToast()
  return (
    <div className="h-full flex flex-col">
      <div className="h-11 shrink-0 flex items-center gap-2 px-4 md:px-5 border-b border-border">
        <button
          onClick={onBack}
          className="grid place-items-center h-7 w-7 rounded-[6px] text-muted-foreground hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-[16px]">{agent.emoji}</span>
        <span className="text-[14px] w-semibold">{agent.name}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="secondary">
            {agent.status === "active" ? (
              <>
                <Pause size={13} /> Pause
              </>
            ) : (
              <>
                <Play size={13} /> Activate
              </>
            )}
          </Button>
          <Button size="sm" variant="primary">
            <Play size={13} /> Run now
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scroll-quiet grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        <div className="p-4 md:p-6 space-y-4 border-r border-border">
          <p className="text-[15px] leading-[1.6] text-muted-foreground max-w-2xl">
            {agent.purpose}
          </p>

          <div>
            <SectionLabel className="mb-2">Autonomy level</SectionLabel>
            <div className="flex items-center gap-0.5 rounded-[8px] bg-secondary p-0.5 w-fit">
              {AUTONOMY.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setAutonomy(l.id)
                    notify(
                      `${agent.name} is set to ${l.label.toLowerCase()} for this preview.`,
                    )
                  }}
                  aria-pressed={l.id === autonomy}
                  className={`h-7 px-3 grid place-items-center rounded-[6px] text-[12px] w-medium ${
                    l.id === autonomy
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground mt-2">
              Higher levels can act without approval within granted scopes.
              Sensitive scopes always require confirmation.
            </p>
          </div>

          <div>
            <SectionLabel className="mb-2">Tool scopes</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {agent.scopes.map((s) => (
                <Badge
                  key={s}
                  color={s.includes("approval") ? "orange" : "indigo"}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel className="mb-2">Run history</SectionLabel>
            <Panel>
              {runs.length === 0 && (
                <div className="px-4 py-6 text-[13px] text-muted-foreground">
                  No runs yet.
                </div>
              )}
              {runs.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 h-[42px] px-4 border-b border-border last:border-0"
                >
                  <StatusDot
                    color={runColor[r.status]}
                    ring={r.status === "running"}
                  />
                  <span className="text-[13px] truncate flex-1">{r.task}</span>
                  <span className="text-[12px] text-muted-foreground tabular hidden md:block">
                    {r.tokens}
                  </span>
                  <span className="text-[12px] text-muted-foreground tabular w-[52px] text-right">
                    {r.duration}
                  </span>
                  <span className="text-[12px] text-muted-foreground w-[52px] text-right">
                    {r.when}
                  </span>
                </div>
              ))}
            </Panel>
          </div>
        </div>

        <aside className="p-4 md:p-5 space-y-4 bg-card">
          {[
            { k: "Status", v: agent.status },
            { k: "Primary model", v: agent.model },
            { k: "Fallback", v: agent.fallback },
            { k: "Runs today", v: String(agent.runsToday) },
            { k: "Success rate", v: `${agent.successRate}%` },
            { k: "Last run", v: agent.lastRun },
          ].map((p) => (
            <div key={p.k} className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">{p.k}</span>
              <span className="text-[13px] w-medium">{p.v}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

// ---------- Approvals ----------
export function Approvals() {
  const [pending, setPending] = useState(() =>
    approvals.map((approval) => approval.id),
  )
  const { notify } = useToast()
  return (
    <Page title="Approvals" count={approvals.length}>
      <div className="p-4 md:p-6 space-y-3 max-w-[760px]">
        {approvals
          .filter((approval) => pending.includes(approval.id))
          .map((a) => (
            <Panel key={a.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5">
                  <StatusDot color={a.risk} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] w-medium">{a.action}</div>
                  <div className="text-[13px] text-muted-foreground mt-0.5">
                    {a.detail}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge color="indigo">{a.agent}</Badge>
                    <Badge>{a.scope}</Badge>
                    <span className="text-[12px] text-muted-foreground">
                      {a.requestedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setPending((items) => items.filter((id) => id !== a.id))
                    notify(
                      "Approved locally. This preview did not run the action.",
                    )
                  }}
                >
                  <Check size={14} /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setPending((items) => items.filter((id) => id !== a.id))
                    notify(
                      "Rejected locally. This preview did not change an approval.",
                    )
                  }}
                >
                  <X size={14} /> Reject
                </Button>
                <Button size="sm" variant="ghost" className="ml-auto">
                  View details
                </Button>
              </div>
            </Panel>
          ))}
      </div>
    </Page>
  )
}

// ---------- Automations ----------
export function Automations() {
  const [state, setState] = useState(() =>
    Object.fromEntries(automations.map((a) => [a.id, a.enabled])),
  )
  const { notify } = useToast()
  return (
    <Page
      title="Automations"
      count={automations.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New automation
        </Button>
      }
    >
      <div>
        {automations.map((a) => (
          <Row key={a.id} className="!h-[54px]">
            <button
              onClick={() => {
                setState((s) => ({ ...s, [a.id]: !s[a.id] }))
                notify(`${a.name} updated for this preview only.`)
              }}
              aria-label={`${state[a.id] ? "Pause" : "Enable"} ${a.name}`}
              aria-pressed={state[a.id]}
              className={`relative h-[18px] w-[30px] rounded-full transition-colors shrink-0 ${
                state[a.id] ? "bg-sidebar-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-[left] ${
                  state[a.id] ? "left-[14px]" : "left-[2px]"
                }`}
              />
            </button>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] w-medium truncate">{a.name}</div>
              <div className="text-[12px] text-muted-foreground truncate">
                When {a.trigger} → {a.action}
              </div>
            </div>
            <span className="text-[12px] text-muted-foreground tabular hidden md:block">
              {a.runs} runs
            </span>
            <span className="text-[12px] text-muted-foreground w-[56px] text-right">
              {a.lastRun}
            </span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Model Routing ----------
export function ModelRouting() {
  const lanes = [
    {
      name: "Codex (local)",
      role: "Primary · coding & operations",
      color: "green" as const,
      status: "Available",
    },
    {
      name: "business-backup",
      role: "Fallback · reasoning & comms",
      color: "green" as const,
      status: "Available",
    },
    {
      name: "coding-backup",
      role: "Fallback · code generation",
      color: "green" as const,
      status: "Available",
    },
    {
      name: "Mac Runner",
      role: "Local-only execution",
      color: "red" as const,
      status: "Offline",
    },
    {
      name: "FCM Router",
      role: "Model routing bus",
      color: "red" as const,
      status: "Unreachable",
    },
  ]
  return (
    <Page title="Model Routing">
      <div className="p-4 md:p-6 space-y-4 max-w-[1000px]">
        <Panel className="p-4">
          <SectionLabel className="mb-3">Routing policy</SectionLabel>
          <div className="flex items-center gap-2 flex-wrap text-[13px] text-muted-foreground">
            <Badge color="green">Codex (local)</Badge>
            <span className="text-muted-foreground">→ if unavailable →</span>
            <Badge color="blue">business-backup</Badge>
            <span className="text-muted-foreground">→ then →</span>
            <Badge color="teal">coding-backup</Badge>
          </div>
          <p className="text-[12px] text-muted-foreground mt-3">
            Runs that fall back are flagged in run history. Sensitive scopes
            never route to external lanes without approval.
          </p>
        </Panel>

        <div>
          <SectionLabel className="mb-2 px-1">Lanes & runners</SectionLabel>
          <Panel>
            {lanes.map((l) => (
              <div
                key={l.name}
                className="flex items-center gap-3 h-[52px] px-4 border-b border-border last:border-0"
              >
                <StatusDot color={l.color} ring={l.color === "red"} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] w-medium">{l.name}</div>
                  <div className="text-[12px] text-muted-foreground">
                    {l.role}
                  </div>
                </div>
                <span
                  className={`text-[12px] w-medium ${
                    l.color === "red"
                      ? "text-[var(--color-status-red)]"
                      : "text-muted-foreground"
                  }`}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Page>
  )
}
