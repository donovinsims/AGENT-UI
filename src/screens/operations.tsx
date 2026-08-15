import { useState } from 'react'
import { Plus, Copy, Check, TrendingUp, TrendingDown, Bot } from 'lucide-react'
import { activities, integrations, personById, opportunities, projects, fmtMoney } from '../data/model'
import { Panel, Badge, StatusDot, Avatar, Button, SectionLabel } from '../components/ui'
import { Page } from './parts'

const kindColor = { sales: 'blue', delivery: 'teal', agent: 'indigo', system: 'gray' } as const

// ---------- Activity ----------
export function ActivityFeed() {
  return (
    <Page title="Activity">
      <div className="p-4 md:p-6 max-w-[720px]">
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[var(--color-hairline)]" />
          {activities.map((a, i) => {
            const actor = a.actor === 'agent' ? null : a.actor === 'system' ? null : personById(a.actor)
            return (
              <div key={i} className="relative pb-5">
                <span className="absolute -left-6 top-0.5"><StatusDot color={kindColor[a.kind]} size={9} /></span>
                <div className="flex items-center gap-2 flex-wrap text-[13px]">
                  {actor ? <Avatar {...actor} size={18} /> : <span className="grid place-items-center h-[18px] w-[18px] rounded-full bg-[var(--color-level-3)]">{a.kind === 'agent' ? <Bot size={11} /> : <span className="text-[10px]">⚙</span>}</span>}
                  <span className="w-medium">{a.actor === 'agent' ? 'An agent' : a.actor === 'system' ? 'System' : actor?.name}</span>
                  <span className="text-[var(--color-text-secondary)]">{a.text}</span>
                  <span className="w-medium text-[var(--color-text-primary)]">{a.target}</span>
                  <span className="text-[var(--color-text-muted)] ml-auto text-[12px]">{a.when}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Page>
  )
}

// ---------- Reports ----------
export function Reports() {
  const pipelineValue = opportunities.reduce((n, o) => n + o.value, 0)
  const bars = [
    { m: 'Mar', v: 38 }, { m: 'Apr', v: 52 }, { m: 'May', v: 44 },
    { m: 'Jun', v: 61 }, { m: 'Jul', v: 73 }, { m: 'Aug', v: 68 },
  ]
  const max = Math.max(...bars.map((b) => b.v))
  return (
    <Page title="Reports" views={['Overview', 'Sales', 'Delivery', 'Agents']}>
      <div className="p-4 md:p-6 space-y-4 max-w-[1100px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Pipeline value', value: fmtMoney(pipelineValue), delta: '+12%', up: true },
            { label: 'Win rate', value: '34%', delta: '+4pt', up: true },
            { label: 'Active projects', value: String(projects.length), delta: '+2', up: true },
            { label: 'Avg cycle time', value: '18d', delta: '-3d', up: true },
          ].map((k) => (
            <Panel key={k.label} className="p-4">
              <div className="text-[12px] text-[var(--color-text-muted)]">{k.label}</div>
              <div className="text-[24px] w-semibold tabular mt-1.5 leading-none">{k.value}</div>
              <div className={`flex items-center gap-1 mt-2 text-[12px] w-medium ${k.up ? 'text-[var(--color-status-green)]' : 'text-[var(--color-status-red)]'}`}>
                {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {k.delta}
              </div>
            </Panel>
          ))}
        </div>

        <Panel className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] w-semibold">Revenue won — last 6 months</span>
            <Badge color="green">$336k total</Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {bars.map((b) => (
              <div key={b.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-[5px] bg-[var(--color-brand)] transition-[height,opacity]" style={{ height: `${(b.v / max) * 100}%`, opacity: 0.55 + (b.v / max) * 0.45 }} />
                <span className="text-[11px] text-[var(--color-text-muted)]">{b.m}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  )
}

// ---------- Integrations ----------
export function Integrations() {
  const statusMap = { connected: 'green', offline: 'red', unreachable: 'red', available: 'gray' } as const
  const cats = [...new Set(integrations.map((i) => i.category))]
  return (
    <Page title="Integrations" count={integrations.length}>
      <div className="p-4 md:p-6 space-y-5 max-w-[1000px]">
        {cats.map((cat) => (
          <div key={cat}>
            <SectionLabel className="mb-2 px-1">{cat}</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrations.filter((i) => i.category === cat).map((i) => (
                <Panel key={i.name} className="p-4 flex items-center gap-3">
                  <span className="grid place-items-center h-10 w-10 rounded-[10px] bg-[var(--color-level-3)] text-[14px] w-semibold">{i.name[0]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><span className="text-[14px] w-medium">{i.name}</span><StatusDot color={statusMap[i.status]} ring={i.status === 'available'} /></div>
                    <div className="text-[12px] text-[var(--color-text-muted)] truncate">{i.detail}</div>
                  </div>
                  <Button size="sm" variant={i.status === 'available' ? 'primary' : 'secondary'}>
                    {i.status === 'available' ? 'Connect' : i.status === 'connected' ? 'Manage' : 'Retry'}
                  </Button>
                </Panel>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

// ---------- Developer ----------
export function Developer() {
  const [copied, setCopied] = useState('')
  const keys = [
    { name: 'CLI token — Marcus', prefix: 'sk_live_ops_', tail: '7f2a', created: 'Jul 12', lastUsed: '2h ago' },
    { name: 'Codex agent runner', prefix: 'sk_live_agt_', tail: 'b91c', created: 'Jun 03', lastUsed: '18m ago' },
    { name: 'MCP server (Hermes)', prefix: 'sk_live_mcp_', tail: '4de0', created: 'Aug 01', lastUsed: '1h ago' },
  ]
  const surfaces = [
    { name: 'REST API', detail: 'OpenAPI 3.1 · 214 endpoints', badge: 'v1' },
    { name: 'CLI', detail: 'operator — full business surface', badge: 'v0.9' },
    { name: 'MCP server', detail: '38 tools exposed to agents', badge: 'live' },
    { name: 'Webhooks', detail: '6 subscriptions · HMAC signed', badge: '6' },
  ]
  const copy = (t: string) => { navigator.clipboard?.writeText(t); setCopied(t); setTimeout(() => setCopied(''), 1200) }
  return (
    <Page title="Developer">
      <div className="p-4 md:p-6 space-y-5 max-w-[1000px]">
        <div>
          <SectionLabel className="mb-2 px-1">Surfaces</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {surfaces.map((s) => (
              <Panel key={s.name} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] w-medium">{s.name}</div>
                  <div className="text-[12px] text-[var(--color-text-muted)]">{s.detail}</div>
                </div>
                <Badge color="indigo">{s.badge}</Badge>
              </Panel>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <SectionLabel>API keys</SectionLabel>
            <Button size="sm" variant="secondary"><Plus size={14} /> New key</Button>
          </div>
          <Panel>
            {keys.map((k) => {
              const masked = `${k.prefix}••••${k.tail}`
              return (
                <div key={k.name} className="flex items-center gap-3 h-[54px] px-4 border-b border-[var(--color-hairline)] last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] w-medium">{k.name}</div>
                    <div className="text-[12px] text-[var(--color-text-muted)] font-mono">{masked}</div>
                  </div>
                  <span className="text-[12px] text-[var(--color-text-muted)] hidden md:block">Used {k.lastUsed}</span>
                  <button onClick={() => copy(masked)} className="grid place-items-center h-7 w-7 rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)]">
                    {copied === masked ? <Check size={14} className="text-[var(--color-status-green)]" /> : <Copy size={14} />}
                  </button>
                </div>
              )
            })}
          </Panel>
        </div>
      </div>
    </Page>
  )
}

// ---------- Settings ----------
export function Settings() {
  const [tab, setTab] = useState('Workspace')
  const tabs = ['Workspace', 'Members', 'Security', 'Billing']
  return (
    <Page title="Settings">
      <div className="p-4 md:p-6 max-w-[820px]">
        <div className="flex items-center gap-0.5 rounded-[8px] bg-[var(--color-level-2)] p-0.5 w-fit mb-5">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`h-7 px-3 rounded-[6px] text-[12px] w-medium ${tab === t ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>{t}</button>
          ))}
        </div>

        {tab === 'Members' ? (
          <Panel>
            {['u_owner', 'u_karri', 'u_andreas', 'u_jori', 'u_zoe', 'u_tom'].map((id) => {
              const p = personById(id)!
              return (
                <div key={id} className="flex items-center gap-3 h-[52px] px-4 border-b border-[var(--color-hairline)] last:border-0">
                  <Avatar {...p} size={26} />
                  <div className="min-w-0 flex-1"><div className="text-[13px] w-medium">{p.name}</div></div>
                  <Badge color={id === 'u_owner' ? 'indigo' : undefined}>{p.role}</Badge>
                </div>
              )
            })}
          </Panel>
        ) : (
          <div className="space-y-3">
            {(tab === 'Workspace'
              ? [['Workspace name', 'Operator OS'], ['URL', 'operator.os'], ['Owner', 'Marcus Vale'], ['Timezone', 'America/Chicago'], ['Default model lane', 'Codex (local)']]
              : tab === 'Security'
              ? [['Two-factor auth', 'Enabled'], ['SSO', 'Google Workspace'], ['Session timeout', '30 days'], ['Row-level security', 'Enforced'], ['Audit log', 'Retained 1 year']]
              : [['Plan', 'Operator — internal'], ['Seats', '6 of 10'], ['Billing cycle', 'Annual'], ['Next invoice', 'Jan 1, 2027']]
            ).map(([k, v]) => (
              <Panel key={k} className="flex items-center justify-between h-[52px] px-4">
                <span className="text-[13px] text-[var(--color-text-secondary)]">{k}</span>
                <span className="text-[13px] w-medium">{v}</span>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}
