import { useState } from 'react'
import { Icon } from './ui'

const items = [
  { id: 'today', label: 'Today', icon: 'Sparkles' },
  { id: 'pipeline', label: 'Sales', icon: 'KanbanSquare' },
  { id: 'my-work', label: 'Work', icon: 'ListChecks' },
  { id: 'agents', label: 'Agents', icon: 'Bot' },
  { id: 'more', label: 'More', icon: 'LayoutGrid' },
]

const quickActions = [
  { label: 'Add lead', icon: 'UserPlus', to: 'leads' },
  { label: 'Add task', icon: 'ListChecks', to: 'tasks' },
  { label: 'Log note', icon: 'StickyNote', to: 'activity' },
  { label: 'Log call', icon: 'Phone', to: 'activity' },
  { label: 'Draft outreach', icon: 'Send', to: 'outreach' },
  { label: 'Upload file', icon: 'Paperclip', to: 'files' },
  { label: 'Run agent', icon: 'Bot', to: 'agents' },
  { label: 'Ask agent', icon: 'Sparkles', to: 'intelligence' },
]

export function MobileNav({
  active,
  onNavigate,
}: {
  active: string
  onNavigate: (id: string) => void
}) {
  const [sheet, setSheet] = useState(false)

  return (
    <>
      {sheet && (
        <div
          className="fixed inset-0 z-40 flex items-end md:hidden"
          style={{ background: 'var(--color-scrim)', animation: 'overlayIn 0.12s var(--ease-quad)' }}
          onClick={() => setSheet(false)}
        >
          <div
            className="w-full rounded-t-[16px] border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 pb-8"
            style={{ animation: 'staggerIn 0.16s var(--ease-quad)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[var(--color-border-input)]" />
            <div className="mb-3 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Quick actions
            </div>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => {
                    onNavigate(q.to)
                    setSheet(false)
                  }}
                  className="flex flex-col items-center gap-2 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-level-1)] px-2 py-3 text-[var(--color-text-secondary)] transition-colors active:bg-[var(--color-surface-raised)]"
                >
                  <Icon name={q.icon} size={20} className="text-[var(--color-text-primary)]" />
                  <span className="text-center text-[11px] w-medium leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]/95 backdrop-blur-xl md:hidden">
        {items.map((it) => {
          const isActive = it.id === active || (it.id === 'more' && false)
          return (
            <button
              key={it.id}
              onClick={() => (it.id === 'more' ? setSheet(true) : onNavigate(it.id))}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              <Icon
                name={it.icon}
                size={20}
                className={isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-tertiary)]'}
              />
              <span
                className={`text-[10px] w-medium ${
                  isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'
                }`}
              >
                {it.label}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
