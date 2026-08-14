import { useState } from 'react'
import { Plus, TrendingUp, MoreHorizontal, Video, FileText } from 'lucide-react'
import {
  leads, companies, contacts, opportunities, meetings, proposals, outreach, services,
  STAGES, companyById, contactById, personById, fmtMoney, type Opportunity, type StageId,
} from '../data/model'
import { Panel, Avatar, Badge, StatusDot, PriorityIcon, Button, SectionLabel, Ring } from '../components/ui'
import { Page, Row, GroupHeader, FilterButton } from './parts'

// ---------- Sales Overview ----------
export function SalesOverview() {
  const open = opportunities.filter((o) => !['won', 'lost'].includes(o.stage))
  const byStage = STAGES.filter((s) => !['won', 'lost'].includes(s.id)).map((s) => ({
    ...s, items: open.filter((o) => o.stage === s.id), value: open.filter((o) => o.stage === s.id).reduce((a, o) => a + o.value, 0),
  }))
  const max = Math.max(...byStage.map((s) => s.value), 1)
  const won = opportunities.filter((o) => o.stage === 'won')
  return (
    <div className="h-full overflow-y-auto scroll-quiet px-4 md:px-8 py-6 max-w-[1180px] mx-auto">
      <h1 className="text-[20px] title mb-5">Sales Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { l: 'Open pipeline', v: fmtMoney(open.reduce((a, o) => a + o.value, 0)), s: `${open.length} deals`, c: 'var(--color-brand)' },
          { l: 'Weighted forecast', v: fmtMoney(Math.round(open.reduce((a, o) => a + o.value, 0) * 0.42)), s: 'this quarter', c: 'var(--color-status-blue)' },
          { l: 'Won QTD', v: fmtMoney(won.reduce((a, o) => a + o.value, 0)), s: `${won.length} deals`, c: 'var(--color-status-green)' },
          { l: 'Win rate', v: '58%', s: 'last 90 days', c: 'var(--color-status-teal)' },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <div className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-muted)] w-medium mb-1">{k.l}</div>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>{k.v}</div>
            <div className="text-[12px] text-[var(--color-text-tertiary)]">{k.s}</div>
          </Panel>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel className="p-4">
          <SectionLabel className="mb-4">Pipeline by stage</SectionLabel>
          <div className="flex flex-col gap-3">
            {byStage.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-[120px] flex items-center gap-2 shrink-0">
                  <StatusDot color={s.color} />
                  <span className="text-[12px] text-[var(--color-text-secondary)] truncate">{s.label}</span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-level-2)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(s.value / max) * 100}%`, background: 'var(--color-brand)' }} />
                </div>
                <span className="w-[52px] text-right text-[12px] tabular text-[var(--color-text-secondary)]">{fmtMoney(s.value)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4">
          <SectionLabel className="mb-4">Leaderboard</SectionLabel>
          <div className="flex flex-col gap-1">
            {['u_jori', 'u_zoe', 'u_owner'].map((id, i) => (
              <div key={id} className="flex items-center gap-3 h-10 px-2 rounded-[6px] hover:bg-[var(--color-level-2)]">
                <span className="text-[12px] tabular text-[var(--color-text-muted)] w-4">{i + 1}</span>
                <Avatar {...personById(id)!} size={22} />
                <span className="text-[13px] w-medium flex-1">{personById(id)!.name}</span>
                <span className="text-[13px] tabular w-medium">{fmtMoney([84000, 66000, 42000][i])}</span>
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
                  <span className="grid place-items-center h-4 w-8 rounded-[4px] text-[10px] w-bold tabular shrink-0" style={{ background: l.score >= 70 ? 'rgba(39,166,68,.15)' : l.score >= 45 ? 'rgba(240,191,0,.15)' : 'rgba(98,102,109,.15)', color: l.score >= 70 ? 'var(--color-status-green)' : l.score >= 45 ? 'var(--color-status-yellow)' : 'var(--color-text-muted)' }}>{l.score}</span>
                  <span className="text-[13px] w-medium truncate">{l.name}</span>
                  <span className="text-[13px] text-[var(--color-text-tertiary)] truncate">{l.company}</span>
                  <span className="text-[12px] text-[var(--color-text-muted)] hidden md:inline truncate flex-1">{l.evidence || l.title}</span>
                  <Badge className="ml-auto shrink-0">{l.source}</Badge>
                  <span className="text-[12px] text-[var(--color-text-muted)] w-[52px] text-right shrink-0">{l.createdAt}</span>
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
        <div className="flex items-center gap-3 h-9 px-4 md:px-5 text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-muted)] w-medium border-b border-[var(--color-hairline)]">
          <span className="flex-1">Company</span>
          <span className="w-[120px] hidden md:block">Industry</span>
          <span className="w-[90px] hidden lg:block">Size</span>
          <span className="w-[120px] hidden lg:block">Lifecycle</span>
          <span className="w-[70px]">Health</span>
          <span className="w-6" />
        </div>
        {companies.map((c) => (
          <Row key={c.id}>
            <span className="grid place-items-center h-6 w-6 rounded-[6px] text-[11px] w-semibold shrink-0" style={{ background: 'var(--color-level-3)', color: 'var(--color-text-secondary)' }}>{c.name[0]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] w-medium truncate">{c.name}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] truncate">{c.domain} · {c.location}</div>
            </div>
            <span className="w-[120px] text-[12px] text-[var(--color-text-tertiary)] hidden md:block truncate">{c.industry}</span>
            <span className="w-[90px] text-[12px] text-[var(--color-text-tertiary)] hidden lg:block">{c.size}</span>
            <span className="w-[120px] hidden lg:block"><Badge color={c.lifecycle === 'active_client' ? 'green' : c.lifecycle === 'prospect' ? 'blue' : 'gray'}>{c.lifecycle.replace('_', ' ')}</Badge></span>
            <span className="w-[70px]">{c.health && <StatusDot color={c.health} />}</span>
            <button className="w-6 grid place-items-center text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100"><MoreHorizontal size={15} /></button>
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
              <div className="text-[13px] w-medium truncate">{c.name}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] truncate">{c.title} · {companyById(c.companyId).name}</div>
            </div>
            <span className="text-[12px] text-[var(--color-text-tertiary)] hidden md:block truncate w-[200px]">{c.email}</span>
            <span className="text-[12px] text-[var(--color-text-muted)] hidden lg:block tabular w-[130px]">{c.phone}</span>
            <span className="text-[12px] text-[var(--color-text-muted)] w-[60px] text-right">{c.lastTouch}</span>
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
                className="w-[272px] shrink-0 flex flex-col"
              >
                <div className="flex items-center gap-2 px-1 pb-2">
                  <StatusDot color={s.color} ring={!['won', 'lost'].includes(s.id)} />
                  <span className="text-[13px] w-semibold">{s.label}</span>
                  <span className="text-[12px] text-[var(--color-text-muted)] tabular">{board[s.id].length}</span>
                  <span className="ml-auto text-[11px] tabular text-[var(--color-text-muted)]">{fmtMoney(board[s.id].reduce((a, o) => a + o.value, 0))}</span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto scroll-quiet pr-0.5">
                  {board[s.id].map((o) => (
                    <div
                      key={o.id}
                      draggable
                      onDragStart={() => setDrag({ id: o.id, from: s.id })}
                      className="rounded-[10px] bg-[var(--color-level-2)] border border-[var(--color-hairline)] p-3 hover:bg-[var(--color-level-3)] transition-colors cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] tabular text-[var(--color-text-muted)]">{o.ref}</span>
                        {o.atRisk && <Badge color="red" className="ml-auto">at risk</Badge>}
                      </div>
                      <div className="text-[13px] w-medium mb-1 leading-snug">{o.title}</div>
                      <div className="text-[12px] text-[var(--color-text-tertiary)] mb-2.5">{companyById(o.companyId).name}</div>
                      <div className="flex items-center gap-1.5">
                        <PriorityIcon priority={o.priority} />
                        <span className="text-[12px] tabular w-medium">{fmtMoney(o.value)}</span>
                        <span className="ml-auto text-[11px] text-[var(--color-text-muted)]">{o.closeDate}</span>
                        <Avatar {...personById(o.owner)!} size={18} />
                      </div>
                    </div>
                  ))}
                  <button className="h-8 rounded-[8px] text-[12px] text-[var(--color-text-muted)] hover:bg-[var(--color-level-2)] flex items-center justify-center gap-1"><Plus size={13} /> Add</button>
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
                <span className="text-[12px] tabular text-[var(--color-text-muted)] w-[64px] shrink-0">{o.ref}</span>
                <span className="text-[13px] w-medium truncate">{o.title}</span>
                <span className="text-[12px] text-[var(--color-text-tertiary)] hidden md:inline">{companyById(o.companyId).name}</span>
                {o.atRisk && <Badge color="red">at risk</Badge>}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  {o.labels.map((l) => <Badge key={l} className="hidden lg:inline-flex">{l}</Badge>)}
                  <span className="text-[13px] tabular w-medium w-[60px] text-right">{fmtMoney(o.value)}</span>
                  <span className="text-[12px] text-[var(--color-text-muted)] w-[52px] text-right">{o.closeDate}</span>
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
          { l: 'Weighted', v: fmtMoney(Math.round(open.reduce((a, o) => a + o.value * (weights[o.stage] || 0.3), 0))), c: 'var(--color-brand)' },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <div className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-muted)] w-medium mb-1">{k.l}</div>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>{k.v}</div>
          </Panel>
        ))}
      </div>
      <Panel>
        <div className="flex items-center gap-2 h-10 px-4 border-b border-[var(--color-hairline)]"><TrendingUp size={15} className="text-[var(--color-text-tertiary)]" /><span className="text-[13px] w-semibold">Weighted by deal</span></div>
        {open.map((o) => (
          <div key={o.id} className="flex items-center gap-3 h-11 px-4 border-b border-[var(--color-hairline)]">
            <span className="text-[13px] w-medium truncate flex-1">{o.title}</span>
            <Badge color={STAGES.find((s) => s.id === o.stage)!.color}>{STAGES.find((s) => s.id === o.stage)!.label}</Badge>
            <span className="text-[11px] tabular text-[var(--color-text-muted)] w-10 text-right">{Math.round((weights[o.stage] || 0.3) * 100)}%</span>
            <span className="text-[13px] tabular w-medium w-[64px] text-right">{fmtMoney(Math.round(o.value * (weights[o.stage] || 0.3)))}</span>
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
                <span className="text-[13px] w-medium truncate">{o.subject}</span>
                {o.agentDrafted && <Badge color="indigo">agent draft</Badge>}
              </div>
              <div className="text-[12px] text-[var(--color-text-muted)] truncate">{o.preview}</div>
            </div>
            {o.sequence && <Badge className="hidden lg:inline-flex">{o.sequence}</Badge>}
            <Badge className="capitalize">{o.state}</Badge>
            <span className="text-[12px] text-[var(--color-text-muted)] w-[80px] text-right shrink-0">{o.when}</span>
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
              <span className="grid place-items-center h-8 w-8 rounded-[8px] bg-[var(--color-level-2)] text-[var(--color-text-tertiary)]"><Video size={16} /></span>
              <div className="min-w-0">
                <div className="text-[14px] w-medium truncate">{m.title}</div>
                <div className="text-[12px] text-[var(--color-text-muted)]">{m.when} · {m.duration}</div>
              </div>
              <Badge className="ml-auto">{m.type}</Badge>
            </div>
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-[var(--color-hairline)]">
              <div className="flex -space-x-1.5">{m.attendees.map((a) => <span key={a} className="ring-2 ring-[var(--color-level-1)] rounded-full"><Avatar {...(personById(a) || contactById(a))!} size={20} /></span>)}</div>
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
            <FileText size={15} className="text-[var(--color-text-tertiary)] shrink-0" />
            <span className="text-[12px] tabular text-[var(--color-text-muted)] w-[70px] shrink-0">{p.ref}</span>
            <span className="text-[13px] w-medium truncate flex-1">{p.title}</span>
            <span className="text-[12px] text-[var(--color-text-tertiary)] hidden md:inline">{companyById(p.companyId).name}</span>
            <Badge color={statusColor[p.status]} className="capitalize">{p.status.replace('_', ' ')}</Badge>
            <span className="text-[13px] tabular w-medium w-[60px] text-right">{fmtMoney(p.value)}</span>
            <span className="text-[12px] text-[var(--color-text-muted)] w-[52px] text-right">{p.updatedAt}</span>
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
              <span className="text-[14px] w-semibold">{s.name}</span>
              {s.active ? <Badge color="green">active</Badge> : <Badge>draft</Badge>}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[22px] title tabular">{s.price}</span>
              <span className="text-[12px] text-[var(--color-text-muted)]">{s.cadence}</span>
            </div>
            <p className="text-[13px] text-[var(--color-text-tertiary)] leading-relaxed">{s.desc}</p>
          </Panel>
        ))}
      </div>
    </Page>
  )
}
