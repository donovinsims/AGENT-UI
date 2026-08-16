import { useState } from 'react'
import {
  ShieldCheck, AlertTriangle, CalendarClock, Bot, ArrowUpRight, Plus, MessageSquare, Trash2, Clock, Circle, ArrowLeft,
} from 'lucide-react'
import {
  approvals, tasks, opportunities, meetings, agentRuns, notifications, inbox,
  personById, companyById, owner, fmtMoney, agentById, type InboxItem, STAGES, TASK_STATES,
} from '../data/model'
import { Panel, SectionLabel, Avatar, Badge, StatusDot, PriorityIcon, Button, IconButton } from '../components/ui'
import { Page, Row, GroupHeader } from './parts'
import { useToast } from '../components/Toast'

// Flat dashboard section header (Circle grammar: list content is not carded).
function DashboardSection({ title, icon, count, children, cta }: { title: string; icon: React.ReactNode; count?: number; children: React.ReactNode; cta?: string }) {
  return (
    <section className="flex flex-col">
      <div className="flex items-center gap-2 h-10 px-3.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm w-semibold">{title}</span>
        {count != null && <span className="text-xs text-muted-foreground tabular">{count}</span>}
        {cta && <button className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors duration-100">{cta}<ArrowUpRight size={12} /></button>}
      </div>
      <div className="flex flex-col">{children}</div>
    </section>
  )
}

function MiniRow({ children, dot }: { children: React.ReactNode; dot?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 h-11 px-3.5 border-b border-border last:border-0 text-sm">
      {dot}
      {children}
    </div>
  )
}

export function Today() {
  const [note, setNote] = useState('')
  const { notify } = useToast()
  const overdue = tasks.filter((t) => t.due === 'Today' || t.due === 'Blocked')
  const atRisk = opportunities.filter((o) => o.atRisk)
  const won = opportunities.filter((o) => o.stage === 'won').reduce((s, o) => s + o.value, 0)
  const open = opportunities.filter((o) => !['won', 'lost'].includes(o.stage))
  const pipeValue = open.reduce((s, o) => s + o.value, 0)

  return (
    <div className="h-full overflow-y-auto scroll-quiet">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-6">
        {/* Greeting + briefing */}
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-xl title">Good morning, {owner.name.split(' ')[0]}</h1>
          <span className="text-xs text-muted-foreground">Thursday, Aug 14</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-[65ch] leading-relaxed">
          <span className="text-foreground w-medium">Executive brief · </span>
          3 approvals waiting, 2 deals at risk (BrightSmile & Harbor), and Northwind delivery is on track at 66%.
          Agents ran 43 tasks overnight with 1 failure on the pipeline scan. Mac Runner is offline — FCM routing unavailable.
        </p>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Open pipeline', value: fmtMoney(pipeValue), sub: `${open.length} deals`, color: 'text-foreground' },
            { label: 'Won this quarter', value: fmtMoney(won), sub: '2 deals', color: 'text-[var(--color-status-green)]' },
            { label: 'Active projects', value: '3', sub: '1 in review', color: 'text-[var(--color-status-blue)]' },
            { label: 'Approvals due', value: String(approvals.length), sub: 'needs you', color: 'text-[var(--color-status-yellow)]' },
          ].map((k) => (
            <Panel key={k.label} className="p-4">
              <div className="text-xs uppercase tracking-[0.05em] text-muted-foreground w-medium mb-1">{k.label}</div>
              <div className={`text-xl title tabular ${k.color}`}>{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.sub}</div>
            </Panel>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* left: approvals + at risk + overdue */}
          <div className="lg:col-span-2 flex flex-col divide-y divide-border">
            <DashboardSection title="Approvals" icon={<ShieldCheck size={15} />} count={approvals.length} cta="Queue">
              {approvals.map((a) => (
                <MiniRow key={a.id} dot={<StatusDot color={a.risk} />}>
                  <span className="w-medium truncate">{a.action}</span>
                  <span className="text-xs text-muted-foreground truncate hidden sm:inline">· {a.detail}</span>
                  <div className="ml-auto flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-muted-foreground">{a.agent}</span>
                    <Button size="sm" variant="ghost" onClick={() => notify('Rejected locally. This preview did not change an approval.')}>Reject</Button>
                    <Button size="sm" variant="primary" onClick={() => notify('Approved locally. This preview did not run the action.')}>Approve</Button>
                  </div>
                </MiniRow>
              ))}
            </DashboardSection>

            <DashboardSection title="Deals at risk" icon={<AlertTriangle size={15} />} count={atRisk.length} cta="Pipeline">
              {atRisk.map((o) => (
                <MiniRow key={o.id} dot={<PriorityIcon priority={o.priority} />}>
                  <span className="w-medium truncate">{o.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{companyById(o.companyId).name}</span>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Badge color={STAGES.find((s) => s.id === o.stage)!.color}>{STAGES.find((s) => s.id === o.stage)!.label}</Badge>
                    <span className="text-xs tabular w-medium">{fmtMoney(o.value)}</span>
                  </div>
                </MiniRow>
              ))}
            </DashboardSection>

            <DashboardSection title="Due today & overdue" icon={<Clock size={15} />} count={overdue.length} cta="My Work">
              {overdue.map((t) => (
                <MiniRow key={t.id} dot={<StatusDot color={TASK_STATES.find((s) => s.id === t.state)!.color} ring={t.state !== 'done'} />}>
                  <PriorityIcon priority={t.priority} />
                  <span className="truncate">{t.title}</span>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    {t.agentAssigned && <Badge color="indigo">agent</Badge>}
                    <span className={`text-xs w-medium ${t.due === 'Blocked' ? 'text-[var(--color-status-red)]' : 'text-[var(--color-status-yellow)]'}`}>{t.due}</span>
                    {t.assignee && <Avatar {...personById(t.assignee)!} size={18} />}
                  </div>
                </MiniRow>
              ))}
            </DashboardSection>
          </div>

          {/* right: meetings + agent activity + capture */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col divide-y divide-border">
              <DashboardSection title="Upcoming meetings" icon={<CalendarClock size={15} />} count={meetings.length}>
                {meetings.slice(0, 4).map((m) => (
                  <MiniRow key={m.id} dot={<StatusDot color="blue" />}>
                    <div className="min-w-0">
                      <div className="truncate w-medium">{m.title}</div>
                      <div className="text-xs text-muted-foreground">{m.when} · {m.duration}</div>
                    </div>
                    {m.hasBrief && <Badge className="ml-auto shrink-0">brief</Badge>}
                  </MiniRow>
                ))}
              </DashboardSection>

              <DashboardSection title="Recent agent activity" icon={<Bot size={15} />} cta="Runs">
                {agentRuns.slice(0, 5).map((r) => {
                  const a = agentById(r.agentId)
                  const c = r.status === 'completed' ? 'green' : r.status === 'failed' ? 'red' : r.status === 'running' ? 'yellow' : 'orange'
                  return (
                    <MiniRow key={r.id} dot={<StatusDot color={c as never} ring={r.status === 'running'} />}>
                      <span className="text-sm leading-none">{a.emoji}</span>
                      <div className="min-w-0">
                        <div className="truncate w-medium text-sm">{r.task}</div>
                        <div className="text-xs text-muted-foreground truncate">{a.name} · {r.when}</div>
                      </div>
                    </MiniRow>
                  )
                })}
              </DashboardSection>
            </div>

            <Panel className="p-4">
              <SectionLabel className="mb-2">Fast capture</SectionLabel>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Log a note, task, or ask an agent…"
                aria-label="Fast capture"
                rows={2}
                className="w-full resize-none bg-secondary border border-input rounded-lg px-3 py-2 text-base sm:text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <Button size="sm" variant="ghost" onClick={() => notify('Task capture is a local preview.')}><Plus size={13} /> Task</Button>
                <Button size="sm" variant="ghost" onClick={() => notify('Note capture is a local preview.')}><MessageSquare size={13} /> Note</Button>
                <Button size="sm" variant="primary" className="ml-auto" onClick={() => { if (!note.trim()) return notify('Enter a note before capturing it.'); setNote(''); notify('Saved for this preview only.') }}>Capture</Button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MyWork() {
  const groups = TASK_STATES.map((s) => ({ ...s, items: tasks.filter((t) => t.state === s.id) })).filter((g) => g.items.length)
  return (
    <Page title="My Work" count={tasks.length} views={['List', 'Board', 'Calendar']}>
      {(view) =>
        view === 'Board' ? (
          <KanbanTasks />
        ) : (
          <div>
            {groups.map((g) => (
              <div key={g.id} className="group">
                <GroupHeader color={<StatusDot color={g.color} ring={g.id !== 'done'} />} label={g.label} count={g.items.length} />
                {g.items.map((t) => (
                  <Row key={t.id}>
                    <PriorityIcon priority={t.priority} />
                    <StatusDot color={g.color} ring={g.id !== 'done'} />
                    <span className="text-xs tabular text-muted-foreground w-[74px] shrink-0">{t.ref}</span>
                    <span className="text-sm w-semibold truncate flex-1" title={t.title}>{t.title}</span>
                    {t.agentAssigned && <Badge color="indigo">agent</Badge>}
                    {t.labels.map((l) => <Badge key={l}>{l}</Badge>)}
                    {t.due && <span className="text-xs text-muted-foreground w-[56px] text-right shrink-0">{t.due}</span>}
                    {t.assignee ? <Avatar {...personById(t.assignee)!} size={20} /> : <span className="h-5 w-5 rounded-full border border-dashed border-border" />}
                  </Row>
                ))}
              </div>
            ))}
          </div>
        )
      }
    </Page>
  )
}

function KanbanTasks() {
  return (
    <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
      {TASK_STATES.map((s) => {
        const items = tasks.filter((t) => t.state === s.id)
        return (
          <div key={s.id} className="w-[264px] shrink-0 flex flex-col">
            <div className="flex items-center gap-2 px-1 pb-2">
              <StatusDot color={s.color} ring={s.id !== 'done'} />
              <span className="text-sm w-semibold">{s.label}</span>
              <span className="text-xs text-muted-foreground tabular">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <Panel key={t.id} className="p-3 hover:bg-muted/50 transition-colors duration-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs tabular text-muted-foreground">{t.ref}</span>
                    {t.agentAssigned && <Badge color="indigo" className="ml-auto">agent</Badge>}
                  </div>
                  <div className="text-sm w-medium mb-2">{t.title}</div>
                  <div className="flex items-center gap-1.5">
                    <PriorityIcon priority={t.priority} />
                    {t.labels.map((l) => <Badge key={l}>{l}</Badge>)}
                    {t.assignee && <span className="ml-auto"><Avatar {...personById(t.assignee)!} size={18} /></span>}
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

export function Notifications() {
  return (
    <Page title="Notifications" count={notifications.filter((n) => n.unread).length} actions={<Button size="sm" variant="ghost">Mark all read</Button>}>
      <div>
        {notifications.map((n) => (
          <Row key={n.id}>
            {n.unread ? <StatusDot color="indigo" size={7} /> : <span className="w-[7px]" />}
            <div className="min-w-0 flex-1">
              <span className="text-sm w-semibold" title={n.title}>{n.title}</span>
              <span className="text-xs text-muted-foreground"> — {n.detail}</span>
            </div>
            <Badge>{n.kind}</Badge>
            <span className="text-xs text-muted-foreground w-[42px] text-right shrink-0">{n.when}</span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---- Inbox master/detail (list → tap → conversation → back) ----------------
export function Inbox() {
  const [sel, setSel] = useState<InboxItem>(inbox[0])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [comment, setComment] = useState('')
  const { notify } = useToast()
  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* list pane */}
      <div className={`${mobileOpen ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] xl:w-[360px] shrink-0 border-r border-border flex-col`}>
        <div className="h-10 shrink-0 flex items-center px-4 md:px-6 border-b border-border">
          <span className="text-sm w-semibold">Inbox</span>
          <span className="ml-2 text-xs text-muted-foreground tabular">{inbox.filter((i) => i.unread).length} unread</span>
        </div>
        <div className="flex-1 overflow-y-auto scroll-quiet">
          {inbox.map((it) => (
            <button
              key={it.id}
              onClick={() => { setSel(it); setMobileOpen(true) }}
              className={`w-full flex items-center gap-3 text-left h-11 px-4 md:px-6 border-b border-border transition-colors duration-100 ${
                sel.id === it.id ? 'bg-accent' : 'hover:bg-muted/50'
              }`}
            >
              <Avatar {...(personById('u_' + it.actor) || { initials: it.actor === 'agent' ? '🤖' : it.actor[0].toUpperCase() })} size={20} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm w-semibold truncate" title={it.title}>{it.title}</span>
                  {it.unread && <StatusDot color="indigo" size={7} />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{it.meta} · {it.when}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* detail pane */}
      <div className={`${mobileOpen ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 overflow-y-auto scroll-quiet flex-col`}>
        <div className="h-10 shrink-0 flex items-center gap-2 px-3 md:px-5 border-b border-border sticky top-0 bg-container z-10">
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Back to inbox" className="md:hidden -ml-1.5"><ArrowLeft size={16} /></IconButton>
          <StatusDot color="blue" ring />
          <span className="text-xs tabular text-muted-foreground">{sel.ref}</span>
          <div className="ml-auto flex items-center gap-1">
            <IconButton aria-label="Delete conversation"><Trash2 size={15} /></IconButton>
            <IconButton aria-label="Snooze conversation"><Clock size={15} /></IconButton>
          </div>
        </div>
        <div className="max-w-[65ch] px-5 md:px-8 py-6">
          <h1 className="text-xl title mb-4 leading-snug">{sel.title}</h1>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-6">{sel.body}</div>

          {sel.labels.length > 0 && (
            <div className="flex gap-1.5 mb-6">{sel.labels.map((l) => <Badge key={l} color={l === 'at-risk' ? 'red' : l === 'agent' ? 'indigo' : undefined}>{l}</Badge>)}</div>
          )}

          <div className="flex items-center gap-3 mb-4 pt-4 border-t border-border">
            <span className="text-sm w-semibold">Activity</span>
            <span className="text-xs text-muted-foreground">{sel.comments.length} comments</span>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {sel.activity.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusDot color="gray" size={6} />
                <span className="w-medium text-foreground">{personById(a.actor)?.name.split(' ')[0] ?? a.actor}</span> {a.text}
              </div>
            ))}
          </div>

          {sel.comments.map((c, i) => (
            <div key={i} className="rounded-lg bg-muted/50 border border-border p-3.5 mb-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Avatar {...personById(c.author)!} size={20} />
                <span className="text-sm w-medium">{personById(c.author)?.name}</span>
                <span className="text-xs text-muted-foreground">{c.when}</span>
              </div>
              <div className="text-sm text-foreground leading-relaxed">{c.body}</div>
              {c.nested && (
                <div className="mt-3 ml-3 pl-3 border-l-2 border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar {...personById(c.nested.author)!} size={20} />
                    <span className="text-xs w-medium">{personById(c.nested.author)?.name}</span>
                    <span className="text-xs text-muted-foreground">{c.nested.when}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.nested.body}</div>
                </div>
              )}
            </div>
          ))}

          <form onSubmit={(event) => { event.preventDefault(); if (!comment.trim()) return; setComment(''); notify('Comment added for this preview only.') }} className="mt-2 flex gap-2">
            <label className="sr-only" htmlFor="inbox-comment">Add a comment</label>
            <input id="inbox-comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment…" className="min-w-0 flex-1 h-9 rounded-lg border border-input bg-secondary px-3.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" />
            <Button type="submit" size="sm" variant="primary">Send</Button>
          </form>
        </div>
      </div>

      {/* right properties pane */}
      <aside className="w-[248px] shrink-0 border-l border-border p-4 hidden xl:block">
        <SectionLabel className="mb-3">Properties</SectionLabel>
        <PropRow icon={<Circle size={15} className="text-muted-foreground" />} label="Status" value={TASK_STATES.find((s) => s.id === sel.state)?.label ?? 'Todo'} />
        <PropRow icon={<PriorityIcon priority={sel.priority} />} label="Priority" value={sel.priority} />
        <PropRow icon={<span className="h-4 w-4 rounded-full border border-dashed border-border" />} label="Assignee" value="Unassigned" />
        {sel.project && <PropRow icon={<StatusDot color="teal" />} label="Project" value={sel.project} />}
        <div className="mt-5">
          <SectionLabel className="mb-2">Labels</SectionLabel>
          <div className="flex flex-wrap gap-1.5">{sel.labels.map((l) => <Badge key={l} color={l === 'agent' ? 'indigo' : undefined}>{l}</Badge>)}</div>
        </div>
      </aside>
    </div>
  )
}

function PropRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 h-8 text-sm">
      {icon}
      <span className="text-muted-foreground w-[64px] shrink-0">{label}</span>
      <span className="capitalize text-foreground truncate">{value}</span>
    </div>
  )
}
