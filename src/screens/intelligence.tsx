import { useState } from 'react'
import { Sparkles, Play, Pause, Check, X, ArrowLeft, Cpu, ShieldCheck, Activity as ActivityIcon, Plus } from 'lucide-react'
import {
  agents, agentById, agentRuns, approvals, automations, runnerStatus,
  type AutonomyLevel, type Agent,
} from '../data/model'
import { Panel, Button, IconButton, Badge, StatusDot, Ring, SectionLabel } from '../components/ui'
import { Page, Row } from './parts'
import { useToast } from '../components/Toast'

const AUTONOMY: { id: AutonomyLevel; label: string }[] = [
  { id: 'observe', label: 'Observe' },
  { id: 'suggest', label: 'Suggest' },
  { id: 'draft', label: 'Draft' },
  { id: 'act', label: 'Act' },
  { id: 'operate', label: 'Operate' },
]

const runColor = { running: 'blue', completed: 'green', failed: 'red', awaiting_approval: 'orange' } as const

// ---------- Intelligence Center ----------
export function IntelligenceCenter() {
  const active = agents.filter((a) => a.status === 'active').length
  const runs = agents.reduce((n, a) => n + a.runsToday, 0)
  return (
    <Page title="Intelligence Center">
      <div className="p-4 md:p-6 max-w-[1150px] space-y-4">
        {/* Executive briefing — flat section, no hero card */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Sparkles size={15} />
            <SectionLabel>Executive briefing</SectionLabel>
          </div>
          <p className="text-sm leading-[1.6] text-muted-foreground max-w-2xl">
            Agents completed <span className="text-foreground w-medium">{runs} runs</span> today across sales, delivery and operations. Three actions await your approval, one deal is drifting, and the Mac Runner is offline — local-only automations are paused until it reconnects.
          </p>
        </div>

        {/* Stat row — flat sections, no giant cards */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {[
            { label: 'Active agents', value: `${active}/${agents.length}`, icon: Cpu },
            { label: 'Runs today', value: runs, icon: ActivityIcon },
            { label: 'Awaiting approval', value: approvals.length, icon: ShieldCheck },
            { label: 'Avg success', value: '96%', icon: Sparkles },
          ].map((k) => (
            <div key={k.label} className="flex items-center gap-1.5 text-sm">
              <k.icon size={14} className="text-muted-foreground" />
              <span className="tabular w-semibold">{k.value}</span>
              <span className="text-xs text-muted-foreground">{k.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <div className="flex items-center h-10 px-4 border-b border-border">
              <span className="text-xs w-semibold uppercase tracking-[0.06em] text-muted-foreground">Recent runs</span>
            </div>
            {agentRuns.slice(0, 5).map((r) => (
              <Row key={r.id} className="last:border-0">
                <StatusDot color={runColor[r.status]} ring={r.status === 'running'} />
                <span className="text-sm shrink-0">{agentById(r.agentId).emoji}</span>
                <span className="text-sm truncate flex-1 min-w-0" title={r.task}>{r.task}</span>
                {r.fellBack && <Badge color="orange">fell back</Badge>}
                <span className="text-xs text-muted-foreground tabular shrink-0">{r.when}</span>
              </Row>
            ))}
          </Panel>
          <Panel>
            <div className="flex items-center h-10 px-4 border-b border-border">
              <span className="text-xs w-semibold uppercase tracking-[0.06em] text-muted-foreground">Model &amp; runner health</span>
            </div>
            {runnerStatus.map((r) => (
              <Row key={r.name} className="last:border-0">
                <StatusDot color={r.color} />
                <span className="text-sm truncate flex-1 min-w-0" title={r.name}>{r.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{r.status}</span>
              </Row>
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
  if (openId) return <AgentDetail agent={agentById(openId)} onBack={() => setOpenId(null)} />
  return (
    <Page title="Agents" count={agents.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> New agent</Button>}>
      <div className="max-w-[1200px]">
        {agents.map((a) => (
          <Row key={a.id} onClick={() => setOpenId(a.id)}>
            <span className="grid place-items-center h-7 w-7 rounded-md bg-muted text-sm shrink-0">{a.emoji}</span>
            <span className="text-sm w-semibold truncate flex-1 min-w-0" title={a.name}>{a.name}</span>
            <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md border border-border bg-muted text-xs w-medium text-muted-foreground shrink-0">
              <StatusDot color={a.status === 'active' ? 'green' : a.status === 'paused' ? 'gray' : 'yellow'} size={6} ring={a.status !== 'active'} />
              {a.status === 'active' ? 'Active' : a.status === 'paused' ? 'Paused' : 'Draft'}
            </span>
            <Badge color="indigo" className="hidden md:inline-flex">{a.autonomy}</Badge>
            <Badge className="hidden lg:inline-flex">{a.model}</Badge>
            <span className="text-xs text-muted-foreground tabular hidden md:block shrink-0">{a.runsToday} runs today</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 hidden sm:flex">
              <Ring value={a.successRate} size={16} color="var(--color-status-green)" />
              {a.successRate}%
            </span>
          </Row>
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
        <IconButton aria-label="Back" onClick={onBack}><ArrowLeft size={16} /></IconButton>
        <span className="text-sm">{agent.emoji}</span>
        <span className="text-sm w-semibold">{agent.name}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="secondary">{agent.status === 'active' ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Activate</>}</Button>
          <Button size="sm" variant="primary"><Play size={13} /> Run now</Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scroll-quiet grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        <div className="p-4 md:p-6 space-y-4 border-r border-border">
          <p className="text-sm leading-[1.6] text-muted-foreground max-w-2xl">{agent.purpose}</p>

          <div>
            <SectionLabel className="mb-2">Autonomy level</SectionLabel>
            <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5 w-fit">
              {AUTONOMY.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setAutonomy(l.id); notify(`${agent.name} is set to ${l.label.toLowerCase()} for this preview.`) }}
                  aria-pressed={l.id === autonomy}
                  className={`h-7 px-3 grid place-items-center rounded-md text-xs w-medium transition-colors duration-100 ${l.id === autonomy ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Higher levels can act without approval within granted scopes. Sensitive scopes always require confirmation.</p>
          </div>

          <div>
            <SectionLabel className="mb-2">Tool scopes</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {agent.scopes.map((s) => <Badge key={s} color={s.includes('approval') ? 'orange' : 'indigo'}>{s}</Badge>)}
            </div>
          </div>

          <div>
            <SectionLabel className="mb-2">Run history</SectionLabel>
            <Panel>
              {runs.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">No runs yet.</div>}
              {runs.map((r) => (
                <Row key={r.id} className="last:border-0">
                  <StatusDot color={runColor[r.status]} ring={r.status === 'running'} />
                  <span className="text-sm truncate flex-1 min-w-0" title={r.task}>{r.task}</span>
                  <span className="text-xs text-muted-foreground tabular hidden md:block shrink-0">{r.tokens}</span>
                  <span className="text-xs text-muted-foreground tabular w-[52px] text-right shrink-0">{r.duration}</span>
                  <span className="text-xs text-muted-foreground w-[52px] text-right shrink-0">{r.when}</span>
                </Row>
              ))}
            </Panel>
          </div>
        </div>

        <aside className="p-4 md:p-5 space-y-4 bg-muted/40">
          {[
            { k: 'Status', v: agent.status },
            { k: 'Primary model', v: agent.model },
            { k: 'Fallback', v: agent.fallback },
            { k: 'Runs today', v: String(agent.runsToday) },
            { k: 'Success rate', v: `${agent.successRate}%` },
            { k: 'Last run', v: agent.lastRun },
          ].map((p) => (
            <div key={p.k} className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{p.k}</span>
              <span className="text-sm w-medium text-right">{p.v}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

// ---------- Approvals ----------
export function Approvals() {
  const [pending, setPending] = useState(() => approvals.map((approval) => approval.id))
  const { notify } = useToast()
  return (
    <Page title="Approvals" count={approvals.length}>
      <div className="max-w-[760px]">
        {approvals.filter((approval) => pending.includes(approval.id)).map((a) => (
          <Row key={a.id} className="!h-[56px]">
            <StatusDot color={a.risk} />
            <div className="min-w-0 flex-1">
              <div className="text-sm w-medium truncate" title={a.action}>{a.action}</div>
              <div className="text-xs text-muted-foreground truncate" title={a.detail}>{a.detail}</div>
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Badge color="indigo">{a.agent}</Badge>
              <Badge>{a.scope}</Badge>
              <span className="text-xs text-muted-foreground">{a.requestedAt}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" variant="primary" onClick={() => { setPending((items) => items.filter((id) => id !== a.id)); notify('Approved locally. This preview did not run the action.') }}><Check size={14} /> Approve</Button>
              <Button size="sm" variant="secondary" onClick={() => { setPending((items) => items.filter((id) => id !== a.id)); notify('Rejected locally. This preview did not change an approval.') }}><X size={14} /> Reject</Button>
            </div>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Automations ----------
export function Automations() {
  const [state, setState] = useState(() => Object.fromEntries(automations.map((a) => [a.id, a.enabled])))
  const { notify } = useToast()
  return (
    <Page title="Automations" count={automations.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> New automation</Button>}>
      <div>
        {automations.map((a) => (
          <Row key={a.id}>
            <button
              onClick={() => { setState((s) => ({ ...s, [a.id]: !s[a.id] })); notify(`${a.name} updated for this preview only.`) }}
              aria-label={`${state[a.id] ? 'Pause' : 'Enable'} ${a.name}`}
              aria-pressed={state[a.id]}
              className={`relative h-[18px] w-[30px] rounded-full transition-colors duration-100 shrink-0 ${state[a.id] ? 'bg-primary' : 'bg-input'}`}
            >
              <span className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-background shadow-xs transition-[left] duration-100 ${state[a.id] ? 'left-[14px]' : 'left-[2px]'}`} />
            </button>
            <span className="text-sm w-medium truncate flex-1 min-w-0" title={a.name}>{a.name}</span>
            <span className="text-xs text-muted-foreground truncate hidden xl:block max-w-[280px] shrink-0" title={`When ${a.trigger} → ${a.action}`}>When {a.trigger} → {a.action}</span>
            <span className="text-xs text-muted-foreground tabular hidden md:block shrink-0">{a.runs} runs</span>
            <span className="text-xs text-muted-foreground w-[56px] text-right shrink-0">{a.lastRun}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Model Routing ----------
export function ModelRouting() {
  const lanes = [
    { name: 'Codex (local)', role: 'Primary · coding & operations', color: 'green' as const, status: 'Available' },
    { name: 'business-backup', role: 'Fallback · reasoning & comms', color: 'green' as const, status: 'Available' },
    { name: 'coding-backup', role: 'Fallback · code generation', color: 'green' as const, status: 'Available' },
    { name: 'Mac Runner', role: 'Local-only execution', color: 'red' as const, status: 'Offline' },
    { name: 'FCM Router', role: 'Model routing bus', color: 'red' as const, status: 'Unreachable' },
  ]
  return (
    <Page title="Model Routing">
      <div className="p-4 md:p-6 space-y-4 max-w-[1000px]">
        <Panel className="p-4">
          <SectionLabel className="mb-3">Routing policy</SectionLabel>
          <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
            <Badge color="green">Codex (local)</Badge><span className="text-muted-foreground">→ if unavailable →</span>
            <Badge color="blue">business-backup</Badge><span className="text-muted-foreground">→ then →</span>
            <Badge color="teal">coding-backup</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Runs that fall back are flagged in run history. Sensitive scopes never route to external lanes without approval.</p>
        </Panel>

        <div>
          <SectionLabel className="mb-2 px-1">Lanes &amp; runners</SectionLabel>
          <Panel>
            {lanes.map((l) => (
              <Row key={l.name} className="last:border-0">
                <StatusDot color={l.color} ring={l.color === 'red'} />
                <span className="text-sm w-medium truncate flex-1 min-w-0" title={l.name}>{l.name}</span>
                <span className="text-xs text-muted-foreground truncate hidden lg:block max-w-[260px] shrink-0" title={l.role}>{l.role}</span>
                <span className={`text-xs w-medium shrink-0 ${l.color === 'red' ? 'text-[var(--color-status-red)]' : 'text-muted-foreground'}`}>{l.status}</span>
              </Row>
            ))}
          </Panel>
        </div>
      </div>
    </Page>
  )
}
