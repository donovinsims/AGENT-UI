import { type ReactNode, useRef, useState } from 'react'
import { Plus, X, Search, Users, CheckSquare, StickyNote, Phone, Send, Upload, Bot, Sparkles, Moon, Sun } from 'lucide-react'
import { MOBILE_NAV, NAV, itemById } from '../lib/nav'
import { Avatar, IconButton } from '../components/ui'
import { owner } from '../data/model'
import { useTheme } from '../theme/ThemeProvider'
import { useToast } from '../components/Toast'
import { useFocusTrap } from '../components/useFocusTrap'

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
  const quickRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const { notify } = useToast()
  const current = itemById(active)
  const activeTab = MOBILE_NAV.some((m) => m.id === active) ? active : 'more'
  useFocusTrap(quick, quickRef)
  useFocusTrap(more, moreRef)
  const closeOnEscape = (event: React.KeyboardEvent, close: () => void) => { if (event.key === 'Escape') close() }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      <header className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-border">
        <Avatar name={owner.name} color={owner.color} initials={owner.initials} size={24} />
        <span className="text-sm w-semibold">{current?.label ?? 'Operator OS'}</span>
        <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className="ml-auto grid place-items-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent transition-colors" aria-label="Search">
          <Search size={18} />
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto scroll-quiet">{children}</main>

      {/* FAB */}
      <button
        onClick={() => setQuick(true)}
        aria-label="Quick actions"
        className="fixed right-4 bottom-[76px] z-30 grid place-items-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xs transition-transform active:scale-[0.96] active:brightness-110"
      >
        <Plus size={24} />
      </button>

      {/* Bottom nav */}
      <nav aria-label="Mobile navigation" className="h-16 shrink-0 grid grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV.map((m) => {
          const on = activeTab === m.id
          return (
            <button
              key={m.id}
              onClick={() => (m.id === 'more' ? setMore(true) : navigate(m.id))}
              aria-current={on ? 'page' : undefined}
              className="flex flex-col items-center justify-center gap-1"
            >
              <m.icon size={21} className={on ? 'text-foreground' : 'text-muted-foreground'} />
              <span className={`text-[10px] w-medium ${on ? 'text-foreground' : 'text-muted-foreground'}`}>{m.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Quick action sheet */}
      {quick && (
        <div className="fixed inset-0 z-40 flex items-end animate-overlay" style={{ background: 'var(--color-scrim)' }} onClick={() => setQuick(false)}>
          <div ref={quickRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Quick actions" onKeyDown={(event) => closeOnEscape(event, () => setQuick(false))} className="w-full rounded-t-xl bg-popover border-t border-border p-4 pb-8 animate-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
            <div className="grid grid-cols-4 gap-3">
              {QUICK.map((q) => (
                <button key={q.label} onClick={() => { setQuick(false); notify(`${q.label} is available in this preview only.`) }} className="flex flex-col items-center gap-2 py-2">
                  <span className="grid place-items-center h-12 w-12 rounded-lg bg-muted text-secondary-foreground">
                    <q.icon size={20} />
                  </span>
                  <span className="text-xs text-secondary-foreground text-center leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More sheet — full IA */}
      {more && (
        <div className="fixed inset-0 z-40 flex items-end animate-overlay" style={{ background: 'var(--color-scrim)' }} onClick={() => setMore(false)}>
          <div ref={moreRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="All areas" onKeyDown={(event) => closeOnEscape(event, () => setMore(false))} className="w-full max-h-[80vh] overflow-y-auto scroll-quiet rounded-t-xl bg-popover border-t border-border p-4 pb-8 animate-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm w-semibold">All areas</span>
              <IconButton onClick={() => setMore(false)} aria-label="Close all areas"><X size={16} /></IconButton>
            </div>
            <button onClick={toggleTheme} className="mb-3 flex h-11 w-full items-center gap-2 rounded-md px-2 text-sm text-secondary-foreground hover:bg-accent"><>{theme === 'dark' ? <Sun size={18} className="text-muted-foreground" /> : <Moon size={18} className="text-muted-foreground" />}</>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button>
            {NAV.map((s) => (
              <div key={s.id} className="mb-3">
                <div className="text-xs w-medium uppercase tracking-[0.06em] text-muted-foreground px-1 py-1.5">{s.label}</div>
                {s.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => { navigate(i.id); setMore(false) }}
                    className="w-full flex items-center gap-3 h-11 px-2 rounded-md text-sm text-secondary-foreground active:bg-accent"
                  >
                    <i.icon size={18} className="text-muted-foreground" />
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
