import { useState } from 'react'
import { inboxRows, detailRecord, personById, fmtMoney } from '../data'
import { Avatar, Chip, Icon, IconButton, PriorityIcon, StatusDot } from '../ui'

export function RecordDetail() {
  const [selected, setSelected] = useState(inboxRows[0].id)
  const [listOpen, setListOpen] = useState(true)
  const rec = detailRecord
  const assignee = personById(rec.assignee)

  return (
    <div className="flex h-full min-h-0">
      {/* Inbox list pane */}
      <div
        className={`flex w-full shrink-0 flex-col border-r border-[var(--color-hairline)] md:w-[340px] ${
          listOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <div className="flex h-11 items-center gap-2 border-b border-[var(--color-hairline)] px-4">
          <span className="text-[13px] w-semibold text-[var(--color-text-primary)]">Inbox</span>
          <Icon name="ChevronDown" size={13} className="text-[var(--color-text-tertiary)]" />
          <div className="ml-auto flex items-center gap-1">
            <IconButton name="ListFilter" title="Filter" />
            <IconButton name="SlidersHorizontal" title="Display" />
          </div>
        </div>
        <div className="scroll-quiet flex-1 overflow-y-auto">
          {inboxRows.map((r) => {
            const p = personById(r.actorId)
            const active = r.id === selected
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelected(r.id)
                  setListOpen(false)
                }}
                className={`flex w-full gap-3 border-b border-[var(--color-hairline)] px-4 py-3 text-left transition-colors ${
                  active ? 'bg-[var(--color-level-2)]' : 'hover:bg-[var(--color-level-1)]'
                }`}
              >
                <Avatar name={p.name} initials={p.initials} color={p.color} size={26} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-[13px] w-medium text-[var(--color-text-primary)]">
                      {r.title}
                    </span>
                    {r.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]" />}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-[var(--color-text-tertiary)]">{r.preview}</div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{r.time}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail pane */}
      <div className={`min-w-0 flex-1 flex-col ${listOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--color-hairline)] px-4">
          <button
            onClick={() => setListOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)] md:hidden"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <StatusDot color="teal" />
          <span className="tabular text-[13px] w-medium text-[var(--color-text-secondary)]">{rec.id}</span>
          <div className="ml-auto flex items-center gap-1">
            <IconButton name="Bot" title="Ask agent" />
            <IconButton name="Clock" title="History" />
            <IconButton name="Trash2" title="Delete" />
          </div>
        </div>

        <div className="scroll-quiet flex min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-8">
            <h1 className="text-[22px] w-semibold leading-tight text-[var(--color-text-primary)]">{rec.title}</h1>
            <div className="mt-4 space-y-3.5">
              {rec.body.map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-level-1)] px-3.5 py-3">
              <Icon name="Sparkles" size={16} className="text-[var(--color-brand)]" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] w-medium text-[var(--color-text-primary)]">
                  Discovery brief prepared by Meeting Agent
                </div>
                <div className="text-[12px] text-[var(--color-text-tertiary)]">
                  Call flow map, PMS integration questions, and objection prep
                </div>
              </div>
              <span className="text-[12px] text-[var(--color-text-muted)]">10m</span>
              <Icon name="ExternalLink" size={14} className="text-[var(--color-text-tertiary)]" />
            </div>

            {/* Activity */}
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-4 text-[13px]">
                <span className="w-semibold text-[var(--color-text-primary)]">Activity</span>
                <span className="text-[var(--color-text-tertiary)]">{rec.comments.length} comments</span>
              </div>
              <div className="space-y-4">
                {rec.comments.map((c) => {
                  const p = personById(c.authorId)
                  return (
                    <div key={c.id} className="flex gap-3">
                      <Avatar name={p.name} initials={p.initials} color={p.color} size={26} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[13px] w-medium text-[var(--color-text-primary)]">
                            {p.name.replace(' (Owner)', '')}
                          </span>
                          <span className="text-[12px] text-[var(--color-text-muted)]">{c.time}</span>
                        </div>
                        <p className="mt-1 rounded-[10px] rounded-tl-[2px] bg-[var(--color-level-2)] px-3 py-2 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3.5 py-2.5">
                  <input
                    placeholder="Add a comment…"
                    className="w-full bg-transparent text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                  />
                  <button className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-brand)] text-white">
                    <Icon name="ArrowUp" size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Properties pane */}
          <aside className="hidden w-[248px] shrink-0 border-l border-[var(--color-hairline)] px-4 py-5 lg:block">
            <div className="mb-2 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Properties
            </div>
            <PropRow icon="Circle" label="Status" value={rec.status} valueColor="teal" />
            <PropRow icon="BarChart3" label="Priority">
              <span className="flex items-center gap-1.5 text-[13px] w-medium capitalize text-[var(--color-text-primary)]">
                <PriorityIcon priority={rec.priority} /> {rec.priority}
              </span>
            </PropRow>
            <PropRow icon="CircleUser" label="Assignee">
              <span className="flex items-center gap-1.5 text-[13px] w-medium text-[var(--color-text-primary)]">
                <Avatar name={assignee.name} initials={assignee.initials} color={assignee.color} size={18} />
                {assignee.name.replace(' (Owner)', '')}
              </span>
            </PropRow>

            <div className="my-3 h-px bg-[var(--color-hairline)]" />
            <div className="mb-2 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Deal
            </div>
            <PropRow icon="DollarSign" label="Value">
              <span className="tabular text-[13px] w-medium text-[var(--color-text-primary)]">
                {fmtMoney(rec.value)}
              </span>
            </PropRow>
            <PropRow icon="FolderKanban" label="Project" value={rec.project} />
            <div className="mt-3">
              <div className="mb-1.5 text-[12px] text-[var(--color-text-tertiary)]">Labels</div>
              <div className="flex flex-wrap gap-1.5">
                {rec.labels.map((l) => (
                  <Chip key={l} color="brand" className="px-1.5 py-0.5 text-[11px]">
                    {l}
                  </Chip>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function PropRow({
  icon,
  label,
  value,
  valueColor,
  children,
}: {
  icon: string
  label: string
  value?: string
  valueColor?: 'teal'
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon name={icon} size={14} className="text-[var(--color-text-tertiary)]" />
      <span className="w-[64px] text-[13px] text-[var(--color-text-tertiary)]">{label}</span>
      {children ?? (
        <span className="flex items-center gap-1.5 text-[13px] w-medium text-[var(--color-text-primary)]">
          {valueColor && <StatusDot color={valueColor} />}
          {value}
        </span>
      )}
    </div>
  )
}
