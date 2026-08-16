import { useState } from 'react'
import { Plus, TrendingUp, MoreHorizontal, Video, FileText } from 'lucide-react'
import {
  leads, companies, contacts, opportunities, meetings, proposals, outreach, services,
  STAGES, companyById, contactById, personById, fmtMoney, type Opportunity, type StageId,
} from '../data/model'
import { Panel, Avatar, Badge, StatusDot, PriorityIcon, Button, SectionLabel, Ring } from '../components/ui'
import { Page, Row, GroupHeader, FilterButton } from './parts'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// ---------- Sales Overview ----------
export function SalesOverview() {
  const open = opportunities.filter((o) => !['won', 'lost'].includes(o.stage))
  const byStage = STAGES.filter((s) => !['won', 'lost'].includes(s.id)).map((s) => ({
    ...s, items: open.filter((o) => o.stage === s.id), value: open.filter((o) => o.stage === s.id).reduce((a, o) => a + o.value, 0),
  }))
  const won = opportunities.filter((o) => o.stage === 'won')
  return (
    <div className="h-full overflow-y-auto scroll-quiet px-4 md:px-8 py-6 max-w-[1180px] mx-auto">
      <h1 className="text-sm w-semibold mb-5">Sales Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { l: 'Open pipeline', v: fmtMoney(open.reduce((a, o) => a + o.value, 0)), s: `${open.length} deals`, c: 'var(--color-primary)' },
          { l: 'Weighted forecast', v: fmtMoney(Math.round(open.reduce((a, o) => a + o.value, 0) * 0.42)), s: 'this quarter', c: 'var(--color-status-blue)' },
          { l: 'Won QTD', v: fmtMoney(won.reduce((a, o) => a + o.value, 0)), s: `${won.length} deals`, c: 'var(--color-status-green)' },
          { l: 'Win rate', v: '58%', s: 'last 90 days', c: 'var(--color-status-teal)' },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <SectionLabel className="mb-1">{k.l}</SectionLabel>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.s}</div>
          </Panel>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel className="p-4">
          <SectionLabel className="mb-4">Pipeline by stage</SectionLabel>
          <div className="h-52" aria-label="Pipeline value by stage"><ResponsiveContainer width="100%" height="100%"><BarChart data={byStage} layout="vertical" margin={{ left: 8 }}><XAxis type="number" hide /><YAxis type="category" dataKey="label" width={76} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} /><Tooltip formatter={(value) => fmtMoney(Number(value ?? 0))} cursor={{ fill: 'var(--muted)' }} contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8 }} /><Bar dataKey="value" fill="var(--primary)" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel className="p-4">
          <SectionLabel className="mb-4">Leaderboard</SectionLabel>
          <div className="flex flex-col gap-1">
            {['u_jori', 'u_zoe', 'u_owner'].map((id, i) => (
              <div key={id} className="flex items-center gap-3 h-10 px-2">
                <span className="text-xs tabular text-muted-foreground w-4">{i + 1}</span>
                <Avatar {...personById(id)!} size={22} />
                <span className="text-sm w-medium flex-1">{personById(id)!.name}</span>
                <span className="text-sm tabular w-medium">{fmtMoney([84000, 66000, 42000][i])}</span>
                <Ring value={[72, 58, 40][i]} size={26} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

// ---------- Leads ----------
export function Leads() {
  const stages = [
    { id: 'new', label: 'New', color: 'gray' as const },
    { id: 'researching', label: 'Researching', color: 'blue' as const },
    { id: 'contacted', label: 'Contacted', color: 'yellow' as const },
    { id: 'qualified', label: 'Qualified', color: 'green' as const },
    { id: 'disqualified', label: 'Disqualified', color: 'red' as const },
  ]
  return (
    <Page title="Leads" count={leads.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> New lead</Button>}>
      <div>
        {stages.map((st) => {
          const items = leads.filter((l) => l.stage === st.id)
          if (!items.length) return null
          return (
            <div key={st.id} className="group">
              <GroupHeader color={<StatusDot color={st.color} ring />} label={st.label} count={items.length} />
              {items.map((l) => (
                <Row key={l.id}>
                  <span className="grid place-items-center h-4 w-8 rounded-sm text-xs w-semibold tabular shrink-0" style={{ background: l.score >= 70 ? 'rgba(39,166,68,.15)' : l.score >= 45 ? 'rgba(240,191,0,.15)' : 'rgba(98,102,109,.15)', color: l.score >= 70 ? 'var(--color-status-green)' : l.score >= 45 ? 'var(--color-status-yellow)' : 'var(--muted-foreground)' }}>{l.score}</span>
                  <span className="text-sm w-medium truncate" title={l.name}>{l.name}</span>
                  <span className="text-sm text-muted-foreground truncate" title={l.company}>{l.company}</span>
                  <span className="text-xs text-muted-foreground hidden md:inline truncate flex-1" title={l.evidence || l.title}>{l.evidence || l.title}</span>
                  <Badge className="ml-auto shrink-0">{l.source}</Badge>
                  <span className="text-xs text-muted-foreground w-[52px] text-right shrink-0">{l.createdAt}</span>
                  <Avatar {...personById(l.owner)!} size={20} />
                </Row>
              ))}
            </div>
          )
        })}
      </div>
    </Page>
  )
}

// ---------- Companies ----------
export function Companies() {
  return (
    <Page title="Companies" count={companies.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> Add</Button>}>
      <div>
        <div className="flex items-center gap-3 h-10 px-4 md:px-6 text-xs uppercase tracking-[0.06em] text-muted-foreground w-medium border-b border-border">
          <span className="flex-1">Company</span>
          <span className="w-[120px] hidden md:block">Industry</span>
          <span className="w-[90px] hidden lg:block">Size</span>
          <span className="w-[120px] hidden lg:block">Lifecycle</span>
          <span className="w-[70px]">Health</span>
          <span className="w-6" />
        </div>
        {companies.map((c) => (
          <Row key={c.id}>
            <span className="grid place-items-center h-6 w-6 rounded-sm text-xs w-semibold shrink-0 bg-secondary text-secondary-foreground">{c.name[0]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm w-medium truncate">{c.name}</div>
              <div className="text-xs text-muted-foreground truncate">{c.domain} · {c.location}</div>
            </div>
            <span className="w-[120px] text-xs text-muted-foreground hidden md:block truncate">{c.industry}</span>
            <span className="w-[90px] text-xs text-muted-foreground hidden lg:block">{c.size}</span>
            <span className="w-[120px] hidden lg:block"><Badge color={c.lifecycle === 'active_client' ? 'green' : c.lifecycle === 'prospect' ? 'blue' : 'gray'}>{c.lifecycle.replace('_', ' ')}</Badge></span>
            <span className="w-[70px]">{c.health && <StatusDot color={c.health} />}</span>
            <button className="w-6 grid place-items-center text-muted-foreground hover:text-foreground" aria-label={`More actions for ${c.name}`}><MoreHorizontal size={15} /></button>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Contacts ----------
export function Contacts() {
  return (
    <Page title="Contacts" count={contacts.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> Add</Button>}>
      <div>
        {contacts.map((c) => (
          <Row key={c.id}>
            <Avatar {...c} size={24} />
            <div className="flex-1 min-w-0">
              <div className="text-sm w-medium truncate" title={c.name}>{c.name}</div>
              <div className="text-xs text-muted-foreground truncate" title={`${c.title} · ${companyById(c.companyId).name}`}>{c.title} · {companyById(c.companyId).name}</div>
            </div>
            <span className="text-xs text-muted-foreground hidden md:block truncate w-[200px]" title={c.email}>{c.email}</span>
            <span className="text-xs text-muted-foreground hidden lg:block tabular w-[130px]">{c.phone}</span>
            <span className="text-xs text-muted-foreground w-[60px] text-right">{c.lastTouch}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Pipeline (Board / List / Forecast) ----------
export function Pipeline() {
  const [board, setBoard] = useState<Record<string, Opportunity[]>>(() => {
    const map: Record<string, Opportunity[]> = {}
    STAGES.forEach((s) => (map[s.id] = opportunities.filter((o) => o.stage === s.id)))
    return map
  })
  const [drag, setDrag] = useState<{ id: string; from: StageId } | null>(null)

  const move = (id: string, from: StageId, to: StageId) => {
    if (from === to) return
    setBoard((b) => {
      const opp = b[from].find((o) => o.id === id)!
      return { ...b, [from]: b[from].filter((o) => o.id !== id), [to]: [{ ...opp, stage: to }, ...b[to]] }
    })
  }

  return (
    <Page title="Pipeline" views={['Board', 'List', 'Forecast']} actions={<><FilterButton /><Button size="sm" variant="primary"><Plus size={14} /> New</Button></>} scroll={false}>
      {(view) =>
        view === 'List' ? (
          <PipelineList />
        ) : view === 'Forecast' ? (
          <PipelineForecast />
        ) : (
          <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
            {STAGES.map((s) => (
              <div
                key={s.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (drag) move(drag.id, drag.from, s.id); setDrag(null) }}
                className="w-[272px] shrink-0 flex flex-col rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                  <StatusDot color={s.color} ring={!['won', 'lost'].includes(s.id)} />
                  <span className="text-sm w-semibold">{s.label}</span>
                  <span className="text-xs text-muted-foreground tabular">{board[s.id].length}</span>
                  <span className="ml-auto text-xs tabular text-muted-foreground">{fmtMoney(board[s.id].reduce((a, o) => a + o.value, 0))}</span>
                </div>
                <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto scroll-quiet p-2 pt-1">
                  {board[s.id].map((o) => (
                    <div
                      key={o.id}
                      draggable
                      onDragStart={() => setDrag({ id: o.id, from: s.id })}
                      className="rounded-lg bg-card border border-border shadow-xs p-2.5 hover:bg-muted/50 transition-colors duration-100 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs tabular text-muted-foreground">{o.ref}</span>
                        {o.atRisk && <Badge color="red" className="ml-auto">at risk</Badge>}
                      </div>
                      <div className="text-sm w-medium mb-1 leading-snug">{o.title}</div>
                      <div className="text-xs text-muted-foreground mb-2.5">{companyById(o.companyId).name}</div>
                      <div className="flex items-center gap-1.5">
                        <PriorityIcon priority={o.priority} />
                        <span className="text-xs tabular w-medium">{fmtMoney(o.value)}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{o.closeDate}</span>
                        <Avatar {...personById(o.owner)!} size={18} />
                      </div>
                    </div>
                  ))}
                  <button className="h-8 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-1"><Plus size={13} /> Add</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </Page>
  )
}

function PipelineList() {
  return (
    <div className="h-full overflow-y-auto scroll-quiet">
      {STAGES.map((s) => {
        const items = opportunities.filter((o) => o.stage === s.id)
        if (!items.length) return null
        return (
          <div key={s.id} className="group">
            <GroupHeader color={<StatusDot color={s.color} ring={!['won', 'lost'].includes(s.id)} />} label={s.label} count={items.length} />
            {items.map((o) => (
              <Row key={o.id}>
                <PriorityIcon priority={o.priority} />
                <span className="text-xs tabular text-muted-foreground w-[64px] shrink-0">{o.ref}</span>
                <span className="text-sm w-medium truncate" title={o.title}>{o.title}</span>
                <span className="text-xs text-muted-foreground hidden md:inline">{companyById(o.companyId).name}</span>
                {o.atRisk && <Badge color="red">at risk</Badge>}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  {o.labels.map((l) => <Badge key={l} className="hidden lg:inline-flex">{l}</Badge>)}
                  <span className="text-sm tabular w-medium w-[60px] text-right">{fmtMoney(o.value)}</span>
                  <span className="text-xs text-muted-foreground w-[52px] text-right">{o.closeDate}</span>
                  <Avatar {...personById(o.owner)!} size={20} />
                </div>
              </Row>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function PipelineForecast() {
  const open = opportunities.filter((o) => !['won', 'lost'].includes(o.stage))
  const weights: Record<string, number> = { new: 0.1, qualified: 0.25, discovery: 0.4, solution: 0.55, proposal: 0.7, negotiation: 0.85 }
  return (
    <div className="h-full overflow-y-auto scroll-quiet px-4 md:px-8 py-6 max-w-[900px] mx-auto">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { l: 'Committed', v: fmtMoney(50500), c: 'var(--color-status-green)' },
          { l: 'Best case', v: fmtMoney(139500), c: 'var(--color-status-blue)' },
          { l: 'Weighted', v: fmtMoney(Math.round(open.reduce((a, o) => a + o.value * (weights[o.stage] || 0.3), 0))), c: 'var(--color-primary)' },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <SectionLabel className="mb-1">{k.l}</SectionLabel>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>{k.v}</div>
          </Panel>
        ))}
      </div>
      <Panel>
        <div className="flex items-center gap-2 h-10 px-4 border-b border-border"><TrendingUp size={15} className="text-muted-foreground" /><span className="text-sm w-semibold">Weighted by deal</span></div>
        {open.map((o) => (
          <div key={o.id} className="flex items-center gap-3 h-11 px-4 border-b border-border last:border-b-0">
            <span className="text-sm w-medium truncate flex-1">{o.title}</span>
            <Badge color={STAGES.find((s) => s.id === o.stage)!.color}>{STAGES.find((s) => s.id === o.stage)!.label}</Badge>
            <span className="text-xs tabular text-muted-foreground w-10 text-right">{Math.round((weights[o.stage] || 0.3) * 100)}%</span>
            <span className="text-sm tabular w-medium w-[64px] text-right">{fmtMoney(Math.round(o.value * (weights[o.stage] || 0.3)))}</span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ---------- Outreach ----------
export function Outreach() {
  const stateColor: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red'> = {
    draft: 'gray', scheduled: 'blue', sent: 'blue', replied: 'green', awaiting: 'yellow', bounced: 'red',
  }
  return (
    <Page title="Outreach" count={outreach.length} views={['Queue', 'Sent', 'Replies']} actions={<Button size="sm" variant="primary"><Plus size={14} /> Draft</Button>}>
      <div>
        {outreach.map((o) => (
          <Row key={o.id}>
            <StatusDot color={stateColor[o.state]} ring={['draft', 'scheduled'].includes(o.state)} />
            <Avatar {...contactById(o.contactId)} size={22} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm w-medium truncate">{o.subject}</span>
                {o.agentDrafted && <Badge color="indigo">agent draft</Badge>}
              </div>
              <div className="text-xs text-muted-foreground truncate">{o.preview}</div>
            </div>
            {o.sequence && <Badge className="hidden lg:inline-flex">{o.sequence}</Badge>}
            <Badge className="capitalize">{o.state}</Badge>
            <span className="text-xs text-muted-foreground w-[80px] text-right shrink-0">{o.when}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Meetings ----------
export function Meetings() {
  return (
    <Page title="Meetings" count={meetings.length} views={['Upcoming', 'Past']} actions={<Button size="sm" variant="primary"><Plus size={14} /> Schedule</Button>}>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[1000px]">
        {meetings.map((m) => (
          <Panel key={m.id} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="grid place-items-center h-8 w-8 rounded-md bg-muted text-muted-foreground"><Video size={16} /></span>
              <div className="min-w-0">
                <div className="text-sm w-medium truncate">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.when} · {m.duration}</div>
              </div>
              <Badge className="ml-auto">{m.type}</Badge>
            </div>
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-border">
              <div className="flex -space-x-1.5">{m.attendees.map((a) => <span key={a} className="ring-2 ring-card rounded-full"><Avatar {...(personById(a) || contactById(a))!} size={20} /></span>)}</div>
              {m.hasBrief ? <Badge color="indigo" className="ml-auto">brief ready</Badge> : <Button size="sm" variant="ghost" className="ml-auto">Generate brief</Button>}
            </div>
          </Panel>
        ))}
      </div>
    </Page>
  )
}

// ---------- Proposals ----------
export function Proposals() {
  const statusColor: Record<string, 'gray' | 'blue' | 'yellow' | 'orange' | 'green' | 'red'> = {
    draft: 'gray', internal_review: 'orange', sent: 'blue', viewed: 'yellow', accepted: 'green', rejected: 'red', expired: 'gray',
  }
  return (
    <Page title="Proposals" count={proposals.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> New proposal</Button>}>
      <div>
        {proposals.map((p) => (
          <Row key={p.id}>
            <FileText size={15} className="text-muted-foreground shrink-0" />
            <span className="text-xs tabular text-muted-foreground w-[70px] shrink-0">{p.ref}</span>
            <span className="text-sm w-medium truncate flex-1" title={p.title}>{p.title}</span>
            <span className="text-xs text-muted-foreground hidden md:inline">{companyById(p.companyId).name}</span>
            <Badge color={statusColor[p.status]} className="capitalize">{p.status.replace('_', ' ')}</Badge>
            <span className="text-sm tabular w-medium w-[60px] text-right">{fmtMoney(p.value)}</span>
            <span className="text-xs text-muted-foreground w-[52px] text-right">{p.updatedAt}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Services ----------
export function Services() {
  return (
    <Page title="Services" count={services.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> Add offer</Button>}>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1100px]">
        {services.map((s) => (
          <Panel key={s.id} className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm w-semibold">{s.name}</span>
              {s.active ? <Badge color="green">active</Badge> : <Badge>draft</Badge>}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[22px] title tabular">{s.price}</span>
              <span className="text-xs text-muted-foreground">{s.cadence}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </Panel>
        ))}
      </div>
    </Page>
  )
}
