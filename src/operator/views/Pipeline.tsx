import { useMemo, useState } from 'react'
import {
  opportunities as seed,
  pipelineStages,
  personById,
  fmtMoney,
  type Opportunity,
} from '../data'
import { Avatar, Button, Chip, Icon, PriorityIcon } from '../ui'

type ViewMode = 'board' | 'list' | 'forecast'

const stageColor: Record<string, string> = {
  'New Opportunity': 'var(--color-text-muted)',
  Qualified: 'var(--color-status-blue)',
  Discovery: 'var(--color-status-teal)',
  'Solution Defined': 'var(--color-accent)',
  'Proposal Sent': 'var(--color-status-yellow)',
  Negotiation: 'var(--color-status-orange)',
}

function OppCard({
  o,
  onMove,
  onDragStart,
}: {
  o: Opportunity
  onMove: (id: string, stage: string) => void
  onDragStart: (id: string) => void
}) {
  const [menu, setMenu] = useState(false)
  const owner = personById(o.ownerId)
  return (
    <div
      draggable
      onDragStart={() => onDragStart(o.id)}
      className="group relative cursor-grab rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-level-2)] p-2.5 transition-colors hover:border-[var(--color-border-strong)] active:cursor-grabbing"
    >
      <div className="flex items-center gap-2">
        <PriorityIcon priority={o.priority} />
        <span className="tabular text-[11px] text-[var(--color-text-muted)]">{o.id}</span>
        <button
          onClick={() => setMenu((m) => !m)}
          className="ml-auto text-[var(--color-text-muted)] opacity-0 transition-opacity hover:text-[var(--color-text-primary)] group-hover:opacity-100"
        >
          <Icon name="Ellipsis" size={14} />
        </button>
      </div>
      <div className="mt-1.5 text-[13px] w-medium leading-snug text-[var(--color-text-primary)]">
        {o.title}
      </div>
      <div className="mt-0.5 text-[12px] text-[var(--color-text-tertiary)]">{o.company}</div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {o.labels.map((l) => (
          <Chip key={l} className="px-1.5 py-0.5 text-[11px]">
            {l}
          </Chip>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-2 border-t border-[var(--color-hairline)] pt-2">
        <span className="tabular text-[12px] w-medium text-[var(--color-text-secondary)]">
          {fmtMoney(o.value)}
        </span>
        <span className="text-[11px] text-[var(--color-text-muted)]">· {o.closeDate}</span>
        <Avatar name={owner.name} initials={owner.initials} color={owner.color} size={18} />
      </div>

      {menu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
          <div className="shadow-stack absolute right-2 top-8 z-20 w-52 overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] py-1">
            <div className="px-3 py-1 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Move to stage
            </div>
            {pipelineStages.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onMove(o.id, s)
                  setMenu(false)
                }}
                className={`flex h-8 w-full items-center gap-2 px-3 text-[13px] transition-colors hover:bg-[var(--color-surface-raised)] ${
                  s === o.stage ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: stageColor[s] }} />
                {s}
                {s === o.stage && <Icon name="Check" size={13} className="ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function Pipeline() {
  const [opps, setOpps] = useState<Opportunity[]>(seed)
  const [mode, setMode] = useState<ViewMode>('board')
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const move = (id: string, stage: string) =>
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)))

  const byStage = useMemo(() => {
    const map: Record<string, Opportunity[]> = {}
    pipelineStages.forEach((s) => (map[s] = []))
    opps.forEach((o) => map[o.stage]?.push(o))
    return map
  }, [opps])

  const total = opps.reduce((s, o) => s + o.value, 0)

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--color-hairline)] px-4">
        <div className="flex items-center gap-1.5 text-[13px] w-medium text-[var(--color-text-secondary)]">
          <Icon name="KanbanSquare" size={15} className="text-[var(--color-text-tertiary)]" />
          {opps.length} open · {fmtMoney(total)}
        </div>
        <div className="ml-2 flex items-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-level-1)] p-0.5">
          {(['board', 'list', 'forecast'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`h-6 rounded-[6px] px-2.5 text-[12px] w-medium capitalize transition-colors ${
                mode === m
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="h-7 px-2 text-[12px]">
            <Icon name="ListFilter" size={14} /> Filter
          </Button>
          <Button variant="primary" className="h-7 px-2.5 text-[12px]">
            <Icon name="Plus" size={14} /> New
          </Button>
        </div>
      </div>

      {mode === 'board' && (
        <div className="scroll-quiet flex-1 overflow-x-auto">
          <div className="flex h-full min-w-max gap-3 p-4">
            {pipelineStages.map((stage) => {
              const items = byStage[stage]
              const sum = items.reduce((s, o) => s + o.value, 0)
              return (
                <div
                  key={stage}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(stage)
                  }}
                  onDragLeave={() => setDragOver((s) => (s === stage ? null : s))}
                  onDrop={() => {
                    if (dragId) move(dragId, stage)
                    setDragId(null)
                    setDragOver(null)
                  }}
                  className={`flex w-[272px] flex-col rounded-[12px] border transition-colors ${
                    dragOver === stage
                      ? 'border-[var(--color-brand)] bg-[var(--color-level-1)]'
                      : 'border-[var(--color-hairline)] bg-[var(--color-canvas)]'
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: stageColor[stage] }} />
                    <span className="text-[13px] w-semibold text-[var(--color-text-primary)]">{stage}</span>
                    <span className="tabular text-[12px] text-[var(--color-text-muted)]">{items.length}</span>
                    <span className="tabular ml-auto text-[12px] w-medium text-[var(--color-text-tertiary)]">
                      {fmtMoney(sum)}
                    </span>
                  </div>
                  <div className="scroll-quiet flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
                    {items.map((o) => (
                      <OppCard key={o.id} o={o} onMove={move} onDragStart={setDragId} />
                    ))}
                    <button className="flex h-8 items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-[var(--color-border)] text-[12px] w-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-tertiary)]">
                      <Icon name="Plus" size={13} /> Add
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'list' && (
        <div className="scroll-quiet flex-1 overflow-y-auto">
          {pipelineStages.map((stage) => {
            const items = byStage[stage]
            if (!items.length) return null
            return (
              <div key={stage}>
                <div className="sticky top-0 z-10 flex items-center gap-2 bg-[var(--color-level-1)] px-4 py-1.5 backdrop-blur">
                  <span className="h-2 w-2 rounded-full" style={{ background: stageColor[stage] }} />
                  <span className="text-[12px] w-semibold text-[var(--color-text-secondary)]">{stage}</span>
                  <span className="tabular text-[12px] text-[var(--color-text-muted)]">{items.length}</span>
                </div>
                {items.map((o) => {
                  const owner = personById(o.ownerId)
                  return (
                    <div
                      key={o.id}
                      className="flex h-9 items-center gap-3 border-b border-[var(--color-hairline)] px-4 transition-colors hover:bg-[var(--color-level-2)]"
                    >
                      <PriorityIcon priority={o.priority} />
                      <span className="tabular hidden w-[68px] shrink-0 text-[12px] text-[var(--color-text-muted)] sm:block">
                        {o.id}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--color-text-primary)]">
                        {o.title}
                        <span className="ml-2 text-[var(--color-text-muted)]">{o.company}</span>
                      </span>
                      <span className="tabular hidden shrink-0 text-[13px] w-medium text-[var(--color-text-secondary)] sm:block">
                        {fmtMoney(o.value)}
                      </span>
                      <span className="tabular hidden w-[52px] shrink-0 text-[12px] text-[var(--color-text-muted)] md:block">
                        {o.closeDate}
                      </span>
                      <Avatar name={owner.name} initials={owner.initials} color={owner.color} size={18} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {mode === 'forecast' && (
        <div className="scroll-quiet flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-[720px] space-y-2">
            {pipelineStages.map((stage) => {
              const items = byStage[stage]
              const sum = items.reduce((s, o) => s + o.value, 0)
              const pct = total ? (sum / total) * 100 : 0
              return (
                <div
                  key={stage}
                  className="rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-level-1)] p-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: stageColor[stage] }} />
                    <span className="text-[13px] w-medium text-[var(--color-text-primary)]">{stage}</span>
                    <span className="tabular ml-auto text-[13px] w-semibold text-[var(--color-text-secondary)]">
                      {fmtMoney(sum)}
                    </span>
                    <span className="tabular w-[42px] text-right text-[12px] text-[var(--color-text-muted)]">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: stageColor[stage] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
