import { useState } from 'react'
import { Plus, Copy, Check, TrendingUp, Bot } from 'lucide-react'
import { activities, integrations, personById, opportunities, projects, fmtMoney } from '../data/model'
import { Panel, Badge, StatusDot, Avatar, Button, SectionLabel, IconButton } from '../components/ui'
import { Page, Row } from './parts'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const kindColor = { sales: 'blue', delivery: 'teal', agent: 'indigo', system: 'gray' } as const

// ---------- Activity ----------
export function ActivityFeed() {
  return (
    <Page title="Activity">
      <div className="p-4 md:p-6 max-w-[720px]">
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
          {activities.map((a, i) => {
            const actor = a.actor === 'agent' ? null : a.actor === 'system' ? null : personById(a.actor)
            return (
              <div key={i} className="relative pb-5">
                <span className="absolute -left-6 top-0.5"><StatusDot color={kindColor[a.kind]} size={9} /></span>
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  {actor ? <Avatar {...actor} size={18} /> : <span className="grid place-items-center h-[18px] w-[18px] rounded-full bg-muted">{a.kind === 'agent' ? <Bot size={11} /> : <span className="text-[10px]">⚙</span>}</span>}
                  <span className="w-medium">{a.actor === 'agent' ? 'An agent' : a.actor === 'system' ? 'System' : actor?.name}</span>
                  <span className="text-muted-foreground">{a.text}</span>
                  <span className="w-medium text-foreground">{a.target}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{a.when}</span>
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
  const contentByView = {
    Overview: { title: 'Revenue won — last 6 months', metrics: [['Pipeline value', fmtMoney(pipelineValue), '+12%'], ['Win rate', '34%', '+4pt'], ['Active projects', String(projects.length), '+2'], ['Avg cycle time', '18d', '-3d']] },
    Sales: { title: 'Sales velocity — last 6 months', metrics: [['Open pipeline', fmtMoney(pipelineValue), '+12%'], ['Qualified deals', '14', '+3'], ['Proposals sent', '9', '+2'], ['Win rate', '34%', '+4pt']] },
    Delivery: { title: 'Delivery throughput — last 6 months', metrics: [['Active projects', String(projects.length), '+2'], ['On-track projects', '2', '+1'], ['Average progress', '61%', '+5pt'], ['Cycle time', '18d', '-3d']] },
    Agents: { title: 'Agent runs — last 6 months', metrics: [['Runs completed', '328', '+18%'], ['Success rate', '96%', '+2pt'], ['Approvals requested', '18', '-4'], ['Fallback rate', '3%', '-1pt']] },
  }
  return (
    <Page title="Reports" views={['Overview', 'Sales', 'Delivery', 'Agents']}>
      {(selectedView) => {
        const content = contentByView[(selectedView ?? 'Overview') as keyof typeof contentByView]
        return <div className="p-4 md:p-6 space-y-4 max-w-[1100px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {content.metrics.map(([label, value, delta]) => (
            <Panel key={label} className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-2xl w-semibold tabular mt-1.5 leading-none">{value}</div>
              <div className="flex items-center gap-1 mt-2 text-xs w-medium text-[var(--color-status-green)]">
                <TrendingUp size={13} /> {delta}
              </div>
            </Panel>
          ))}
        </div>

        <Panel className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm w-semibold">{content.title}</span>
            <Badge color="green">$336k total</Badge>
          </div>
          <div className="h-48" aria-label={`${content.title} chart`}><ResponsiveContainer width="100%" height="100%"><BarChart data={bars}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} /><YAxis hide /><Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8 }} /><Bar dataKey="v" fill="var(--chart-1)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
      </div>
      }}
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
            {integrations.filter((i) => i.category === cat).map((i) => (
              <Row key={i.name} className="gap-3 last:border-0">
                <span className="grid place-items-center h-7 w-7 rounded-md bg-muted text-sm w-semibold shrink-0">{i.name[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="text-sm w-semibold truncate">{i.name}</span></div>
                  <div className="text-xs text-muted-foreground truncate">{i.detail}</div>
                </div>
                <Badge color={statusMap[i.status]}>{i.status[0].toUpperCase() + i.status.slice(1)}</Badge>
                <Button size="sm" variant={i.status === 'available' ? 'primary' : 'secondary'}>
                  {i.status === 'available' ? 'Connect' : i.status === 'connected' ? 'Manage' : 'Retry'}
                </Button>
              </Row>
            ))}
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
          {surfaces.map((s) => (
            <Row key={s.name} className="gap-3 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="text-sm w-medium truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.detail}</div>
              </div>
              <Badge color="indigo">{s.badge}</Badge>
            </Row>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <SectionLabel>API keys</SectionLabel>
            <Button size="sm" variant="secondary"><Plus size={14} /> New key</Button>
          </div>
          {keys.map((k) => {
            const masked = `${k.prefix}••••${k.tail}`
            return (
              <Row key={k.name} className="gap-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="text-sm w-medium truncate">{k.name}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{masked}</div>
                </div>
                <span className="text-xs text-muted-foreground hidden md:block shrink-0">Used {k.lastUsed}</span>
                <IconButton aria-label="Copy API key" onClick={() => copy(masked)}>
                  {copied === masked ? <Check size={14} className="text-[var(--color-status-green)]" /> : <Copy size={14} />}
                </IconButton>
              </Row>
            )
          })}
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
        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-1 w-fit mb-5">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-[color,box-shadow,background-color] duration-100 active:scale-[0.96] ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>
          ))}
        </div>

        {tab === 'Members' ? (
          ['u_owner', 'u_karri', 'u_andreas', 'u_jori', 'u_zoe', 'u_tom'].map((id) => {
            const p = personById(id)!
            return (
              <Row key={id} className="gap-3 last:border-0">
                <Avatar {...p} size={26} />
                <div className="min-w-0 flex-1"><div className="text-sm w-medium truncate">{p.name}</div></div>
                <Badge color={id === 'u_owner' ? 'indigo' : undefined}>{p.role}</Badge>
              </Row>
            )
          })
        ) : (
          <div>
            {(tab === 'Workspace'
              ? [['Workspace name', 'Operator OS'], ['URL', 'operator.os'], ['Owner', 'Marcus Vale'], ['Timezone', 'America/Chicago'], ['Default model lane', 'Codex (local)']]
              : tab === 'Security'
              ? [['Two-factor auth', 'Enabled'], ['SSO', 'Google Workspace'], ['Session timeout', '30 days'], ['Row-level security', 'Enforced'], ['Audit log', 'Retained 1 year']]
              : [['Plan', 'Operator — internal'], ['Seats', '6 of 10'], ['Billing cycle', 'Annual'], ['Next invoice', 'Jan 1, 2027']]
            ).map(([k, v]) => (
              <Row key={k} className="last:border-0">
                <span className="text-sm text-muted-foreground">{k}</span>
                <span className="text-sm w-medium ml-auto">{v}</span>
              </Row>
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}
