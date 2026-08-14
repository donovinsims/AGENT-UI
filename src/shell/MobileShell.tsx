import { type ReactNode, useState } from 'react'
import { Plus, X, Search, Users, CheckSquare, StickyNote, Phone, Send, Upload, Bot, Sparkles } from 'lucide-react'
import { MOBILE_NAV, NAV, itemById } from '../lib/nav'
import { Avatar } from '../components/ui'
import { owner } from '../data/model'

const QUICK = [
  { label: 'Add lead', icon: Users },
  { label: 'Add task', icon: CheckSquare },
  { label: 'Log note', icon: StickyNote },
  { label: 'Log call', icon: Phone },
  { label: 'Draft outreach', icon: Send },
  { label: 'Upload file', icon: Upload },
  { label: 'Run agent', icon: Bot },
  { label: 'Ask agent', icon: Sparkles },
]

export function MobileShell({
  active,
  navigate,
  children,
}: {
  active: string
  navigate: (id: string) => void
  children: ReactNode
}) {
  const [quick, setQuick] = useState(false)
  const [more, setMore] = useState(false)
  const current = itemById(active)
  const activeTab = MOBILE_NAV.some((m) => m.id === active) ? active : 'more'

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-canvas)] text-[var(--color-text-primary)] flex flex-col">
      <header className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-[var(--color-hairline)]">
        <Avatar name={owner.name} color={owner.color} initials={owner.initials} size={24} />
        <span className="text-[15px] w-semibold">{current?.label ?? 'Operator OS'}</span>
        <button className="ml-auto grid place-items-center h-9 w-9 rounded-[8px] text-[var(--color-text-tertiary)]" aria-label="Search">
          <Search size={18} />
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto scroll-quiet">{children}</main>

      {/* FAB */}
      <button
        onClick={() => setQuick(true)}
        aria-label="Quick actions"
        className="fixed right-4 bottom-[76px] z-30 grid place-items-center h-14 w-14 rounded-full bg-[var(--color-brand)] text-white shadow-stack active:brightness-110"
      >
        <Plus size={24} />
      </button>

      {/* Bottom nav */}
      <nav className="h-16 shrink-0 grid grid-cols-5 border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV.map((m) => {
          const on = activeTab === m.id
          return (
            <button
              key={m.id}
              onClick={() => (m.id === 'more' ? setMore(true) : navigate(m.id))}
              className="flex flex-col items-center justify-center gap-1"
            >
              <m.icon size={21} className={on ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-tertiary)]'} />
              <span className={`text-[10px] w-medium ${on ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>{m.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Quick action sheet */}
      {quick && (
        <div className="fixed inset-0 z-40 flex items-end animate-overlay" style={{ background: 'var(--color-scrim)' }} onClick={() => setQuick(false)}>
          <div className="w-full rounded-t-[16px] bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 pb-8 animate-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[var(--color-border-strong)]" />
            <div className="grid grid-cols-4 gap-3">
              {QUICK.map((q) => (
                <button key={q.label} onClick={() => setQuick(false)} className="flex flex-col items-center gap-2 py-2">
                  <span className="grid place-items-center h-12 w-12 rounded-[12px] bg-[var(--color-level-2)] text-[var(--color-text-secondary)]">
                    <q.icon size={20} />
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)] text-center leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More sheet — full IA */}
      {more && (
        <div className="fixed inset-0 z-40 flex items-end animate-overlay" style={{ background: 'var(--color-scrim)' }} onClick={() => setMore(false)}>
          <div className="w-full max-h-[80vh] overflow-y-auto scroll-quiet rounded-t-[16px] bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 pb-8 animate-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[15px] w-semibold">All areas</span>
              <button onClick={() => setMore(false)} className="grid place-items-center h-8 w-8 rounded-[8px] text-[var(--color-text-tertiary)]"><X size={18} /></button>
            </div>
            {NAV.map((s) => (
              <div key={s.id} className="mb-3">
                <div className="text-[11px] w-medium uppercase tracking-[0.06em] text-[var(--color-text-muted)] px-1 py-1.5">{s.label}</div>
                {s.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => { navigate(i.id); setMore(false) }}
                    className="w-full flex items-center gap-3 h-11 px-2 rounded-[8px] text-[14px] text-[var(--color-text-secondary)] active:bg-[var(--color-surface-raised)]"
                  >
                    <i.icon size={18} className="text-[var(--color-text-tertiary)]" />
                    {i.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
