import { Plus, File as FileIcon, Paperclip, BookOpen, Bot } from 'lucide-react'
import {
  clients, projects, tasks, files, knowledge,
  PROJECT_STATES, TASK_STATES, companyById, personById, projectById,
} from '../data/model'
import { Panel, Avatar, Badge, StatusDot, PriorityIcon, Button, Ring } from '../components/ui'
import { Page, Row, GroupHeader } from './parts'

// ---------- Clients ----------
export function Clients() {
  return (
    <Page title="Clients" count={clients.length}>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1150px]">
        {clients.map((c) => {
          const proj = projects.filter((p) => p.clientId === c.id)
          return (
            <Panel key={c.id} className="p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="grid place-items-center h-9 w-9 rounded-[10px] text-[13px] w-semibold" style={{ background: 'var(--color-level-3)' }}>{c.name[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] w-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate">{c.industry} · {c.location}</div>
                </div>
                {c.health && <StatusDot color={c.health} />}
              </div>
              <div className="flex items-center justify-between text-[12px] text-[var(--color-text-tertiary)] pt-2 border-t border-[var(--color-hairline)]">
                <span>{proj.length} project{proj.length !== 1 && 's'}</span>
                <span>Owner {personById(c.owner)?.name.split(' ')[0]}</span>
              </div>
            </Panel>
          )
        })}
      </div>
    </Page>
  )
}

// ---------- Projects (Board / List / Timeline) ----------
export function Projects() {
  return (
    <Page title="Projects" count={projects.length} views={['List', 'Board', 'Timeline']} actions={<Button size="sm" variant="primary"><Plus size={14} /> New project</Button>} scroll={false}>
      {(view) =>
        view === 'Board' ? <ProjectBoard /> : view === 'Timeline' ? <ProjectTimeline /> : <ProjectList />
      }
    </Page>
  )
}

function ProjectList() {
  return (
    <div className="h-full overflow-y-auto scroll-quiet">
      {PROJECT_STATES.map((s) => {
        const items = projects.filter((p) => p.state === s.id)
        if (!items.length) return null
        return (
          <div key={s.id} className="group">
            <GroupHeader color={<StatusDot color={s.color} ring={s.id !== 'completed'} />} label={s.label} count={items.length} />
            {items.map((p) => (
              <Row key={p.id} className="!h-[46px]">
                <StatusDot color={p.health} />
                <span className="text-[12px] tabular text-[var(--color-text-muted)] w-[58px] shrink-0">{p.ref}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] w-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate">{companyById(p.clientId).name}</div>
                </div>
                <div className="w-24 hidden md:flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--color-level-2)] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: STATUS_HEX(p.health) }} /></div>
                  <span className="text-[11px] tabular text-[var(--color-text-muted)]">{p.progress}%</span>
                </div>
                <span className="text-[12px] text-[var(--color-text-muted)] w-[50px] text-right hidden lg:block">{p.targetDate}</span>
                <Avatar {...personById(p.lead)!} size={20} />
              </Row>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function STATUS_HEX(c: string) {
  return `var(--color-status-${c})`
}

function ProjectBoard() {
  return (
    <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
      {PROJECT_STATES.map((s) => {
        const items = projects.filter((p) => p.state === s.id)
        return (
          <div key={s.id} className="w-[280px] shrink-0">
            <div className="flex items-center gap-2 px-1 pb-2">
              <StatusDot color={s.color} ring={s.id !== 'completed'} />
              <span className="text-[13px] w-semibold">{s.label}</span>
              <span className="text-[12px] text-[var(--color-text-muted)] tabular">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((p) => (
                <Panel key={p.id} className="p-3 bg-[var(--color-level-2)]">
                  <div className="flex items-center gap-2 mb-1.5"><span className="text-[11px] tabular text-[var(--color-text-muted)]">{p.ref}</span><span className="ml-auto"><StatusDot color={p.health} size={7} /></span></div>
                  <div className="text-[13px] w-medium mb-1">{p.name}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mb-2.5">{companyById(p.clientId).name}</div>
                  <div className="flex items-center gap-2">
                    <Ring value={p.progress} size={22} color={STATUS_HEX(p.health)} />
                    <span className="text-[11px] tabular text-[var(--color-text-muted)]">{p.progress}%</span>
                    <Avatar {...personById(p.lead)!} size={18} />
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProjectTimeline() {
  const months = ['Aug', 'Sep', 'Oct']
  return (
    <div className="h-full overflow-auto scroll-quiet p-4 md:p-6">
      {/* month header (desktop) */}
      <div className="hidden md:grid mb-2 pl-[220px]" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
        {months.map((m) => <div key={m} className="text-[11px] w-medium uppercase tracking-[0.05em] text-[var(--color-text-muted)] border-l border-[var(--color-hairline)] pl-2">{m}</div>)}
      </div>
      {projects.map((p) => (
        <div key={p.id} className="mb-4">
          {/* desktop gantt */}
          <div className="hidden md:flex items-center">
            <div className="w-[220px] shrink-0 pr-3">
              <div className="text-[13px] w-medium truncate">{p.name}</div>
              <div className="text-[11px] text-[var(--color-text-muted)]">{p.startDate} → {p.targetDate}</div>
            </div>
            <div className="relative flex-1 h-8 rounded-[8px] bg-[var(--color-level-1)] border border-[var(--color-hairline)] overflow-hidden">
              {p.phases.map((ph, i) => (
                <div key={i} className="absolute top-1 bottom-1 rounded-[5px] flex items-center px-2" style={{ left: `${ph.start}%`, width: `${ph.end - ph.start}%`, background: ph.done ? 'rgba(94,106,210,.35)' : 'rgba(94,106,210,.15)', border: '1px solid rgba(94,106,210,.4)' }}>
                  <span className="text-[10px] text-[var(--color-text-secondary)] truncate">{ph.name}</span>
                </div>
              ))}
              <div className="absolute top-0 bottom-0 w-px bg-[var(--color-status-red)]" style={{ left: `${p.progress}%` }} />
            </div>
          </div>
          {/* mobile vertical phases */}
          <div className="md:hidden">
            <div className="text-[14px] w-medium mb-1">{p.name}</div>
            <div className="pl-2 border-l-2 border-[var(--color-hairline)] flex flex-col gap-2 mt-2">
              {p.phases.map((ph, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <StatusDot color={ph.done ? 'green' : 'gray'} ring={!ph.done} />
                  <span className={ph.done ? 'text-[var(--color-text-tertiary)] line-through' : 'text-[var(--color-text-secondary)]'}>{ph.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------- Tasks ----------
export function Tasks() {
  return (
    <Page title="Tasks" count={tasks.length} views={['List', 'Board']}>
      {(view) =>
        view === 'Board' ? (
          <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
            {TASK_STATES.map((s) => {
              const items = tasks.filter((t) => t.state === s.id)
              return (
                <div key={s.id} className="w-[264px] shrink-0">
                  <div className="flex items-center gap-2 px-1 pb-2"><StatusDot color={s.color} ring={s.id !== 'done'} /><span className="text-[13px] w-semibold">{s.label}</span><span className="text-[12px] text-[var(--color-text-muted)] tabular">{items.length}</span></div>
                  <div className="flex flex-col gap-2">
                    {items.map((t) => (
                      <Panel key={t.id} className="p-2.5 bg-[var(--color-level-2)]">
                        <div className="flex items-center gap-2 mb-1.5"><span className="text-[11px] tabular text-[var(--color-text-muted)]">{t.ref}</span>{t.agentAssigned && <Badge color="indigo" className="ml-auto">agent</Badge>}</div>
                        <div className="text-[13px] w-medium mb-2">{t.title}</div>
                        <div className="flex items-center gap-1.5"><PriorityIcon priority={t.priority} />{t.projectId && <span className="text-[11px] text-[var(--color-text-muted)] truncate">{projectById(t.projectId).ref}</span>}{t.assignee && <span className="ml-auto"><Avatar {...personById(t.assignee)!} size={18} /></span>}</div>
                      </Panel>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            {TASK_STATES.map((s) => {
              const items = tasks.filter((t) => t.state === s.id)
              if (!items.length) return null
              return (
                <div key={s.id} className="group">
                  <GroupHeader color={<StatusDot color={s.color} ring={s.id !== 'done'} />} label={s.label} count={items.length} />
                  {items.map((t) => (
                    <Row key={t.id}>
                      <PriorityIcon priority={t.priority} />
                      <StatusDot color={s.color} ring={s.id !== 'done'} />
                      <span className="text-[12px] tabular text-[var(--color-text-muted)] w-[78px] shrink-0">{t.ref}</span>
                      <span className="text-[13px] truncate flex-1">{t.title}</span>
                      {t.agentAssigned && <Badge color="indigo">agent</Badge>}
                      {t.labels.map((l) => <Badge key={l} className="hidden lg:inline-flex">{l}</Badge>)}
                      {t.due && <span className={`text-[12px] w-[56px] text-right ${t.due === 'Blocked' ? 'text-[var(--color-status-red)]' : 'text-[var(--color-text-tertiary)]'}`}>{t.due}</span>}
                      {t.assignee ? <Avatar {...personById(t.assignee)!} size={20} /> : <span className="h-5 w-5 rounded-full border border-dashed border-[var(--color-border-strong)]" />}
                    </Row>
                  ))}
                </div>
              )
            })}
          </div>
        )
      }
    </Page>
  )
}

// ---------- Calendar ----------
export function Calendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const start = 11 // Aug 11 Monday
  const events: Record<number, { label: string; color: string }[]> = {
    14: [{ label: 'Summit Discovery 2p', color: 'blue' }, { label: 'Harbor Demo 4:30p', color: 'indigo' }],
    15: [{ label: 'Northwind sync 10a', color: 'green' }],
    18: [{ label: 'BrightSmile renewal 1p', color: 'orange' }],
    20: [{ label: 'Verde handoff', color: 'teal' }],
    16: [{ label: 'PRJ-24 QA due', color: 'yellow' }],
  }
  return (
    <Page title="Calendar" views={['Month', 'Week', 'Agenda']}>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-7 gap-px bg-[var(--color-hairline)] rounded-[12px] overflow-hidden border border-[var(--color-hairline)]">
          {days.map((d) => <div key={d} className="bg-[var(--color-level-1)] px-2 py-1.5 text-[11px] w-medium uppercase tracking-[0.05em] text-[var(--color-text-muted)]">{d}</div>)}
          {Array.from({ length: 28 }).map((_, i) => {
            const date = start + i - 3
            const inMonth = date >= 1 && date <= 31
            const evs = events[date] || []
            const isToday = date === 14
            return (
              <div key={i} className="bg-[var(--color-canvas)] min-h-[92px] p-1.5">
                <div className={`text-[12px] tabular mb-1 ${isToday ? 'grid place-items-center h-5 w-5 rounded-full bg-[var(--color-brand)] text-white' : inMonth ? 'text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-muted)] opacity-40'}`}>{inMonth ? date : ''}</div>
                <div className="flex flex-col gap-1">
                  {evs.map((e, j) => (
                    <div key={j} className="text-[10px] px-1 py-0.5 rounded truncate" style={{ background: `color-mix(in srgb, var(--color-status-${e.color}) 18%, transparent)`, color: `var(--color-status-${e.color})` }}>{e.label}</div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Page>
  )
}

// ---------- Files ----------
export function Files() {
  return (
    <Page title="Files" count={files.length} actions={<Button size="sm" variant="primary"><Paperclip size={14} /> Upload</Button>}>
      <div>
        <div className="flex items-center gap-3 h-9 px-4 md:px-5 text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-muted)] w-medium border-b border-[var(--color-hairline)]">
          <span className="flex-1">Name</span><span className="w-[90px] hidden md:block">Linked to</span><span className="w-[70px] hidden lg:block">Size</span><span className="w-[80px]">Owner</span><span className="w-[52px] text-right">Updated</span>
        </div>
        {files.map((f) => (
          <Row key={f.id}>
            <FileIcon size={15} className="text-[var(--color-text-tertiary)] shrink-0" />
            <span className="text-[13px] w-medium truncate flex-1">{f.name}</span>
            <span className="w-[90px] hidden md:block"><Badge>{f.linkedTo}</Badge></span>
            <span className="w-[70px] text-[12px] text-[var(--color-text-muted)] hidden lg:block tabular">{f.size}</span>
            <span className="w-[80px]"><Avatar {...personById(f.owner)!} size={20} /></span>
            <span className="w-[52px] text-[12px] text-[var(--color-text-muted)] text-right">{f.updatedAt}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Knowledge ----------
export function Knowledge() {
  const catColor: Record<string, string> = { SOP: 'blue', Playbook: 'green', Template: 'teal', Offer: 'yellow', 'Agent Instruction': 'indigo' }
  return (
    <Page title="Knowledge" count={knowledge.length} actions={<Button size="sm" variant="primary"><Plus size={14} /> New doc</Button>}>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1100px]">
        {knowledge.map((k) => (
          <Panel key={k.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center h-8 w-8 rounded-[8px] bg-[var(--color-level-2)] text-[var(--color-text-tertiary)]"><BookOpen size={16} /></span>
              <Badge color={catColor[k.category] as never} className="ml-auto">{k.category}</Badge>
            </div>
            <div className="text-[14px] w-medium mb-1">{k.title}</div>
            <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] mt-2 pt-2 border-t border-[var(--color-hairline)]">
              <span>Updated {k.updatedAt}</span>
              {k.attachedAgents > 0 && <span className="ml-auto flex items-center gap-1"><Bot size={12} /> {k.attachedAgents}</span>}
            </div>
          </Panel>
        ))}
      </div>
    </Page>
  )
}
