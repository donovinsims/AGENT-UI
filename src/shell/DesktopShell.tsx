import { type ReactNode } from 'react'
import {
  Search, PenSquare, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus, HelpCircle, Circle,
} from 'lucide-react'
import { NAV, itemById } from '../lib/nav'
import { owner } from '../data/model'
import { IconButton, Kbd, Avatar } from '../components/ui'

function LinearMark() {
  return (
    <span className="grid place-items-center h-6 w-6 rounded-[7px] bg-[var(--color-surface-3,#28282c)] shrink-0" style={{ background: '#2a2a2e' }}>
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ background: 'conic-gradient(from 210deg, #f7f8f8 0 55%, #5e6ad2 55% 100%)' }}
      />
    </span>
  )
}

export function DesktopShell({
  active,
  navigate,
  openCommand,
  children,
}: {
  active: string
  navigate: (id: string) => void
  openCommand: () => void
  children: ReactNode
}) {
  const current = itemById(active)
  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-canvas)] flex text-[var(--color-text-primary)]">
      {/* Sidebar */}
      <aside className="w-[224px] shrink-0 flex flex-col border-r border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        {/* workspace switcher */}
        <div className="flex items-center gap-2 h-[52px] px-3">
          <LinearMark />
          <button className="flex items-center gap-1 text-[14px] w-semibold hover:text-[var(--color-text-primary)]">
            Operator OS <ChevronDown size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
          <div className="ml-auto flex items-center gap-0.5">
            <IconButton onClick={openCommand} aria-label="Search"><Search size={16} /></IconButton>
            <IconButton aria-label="Compose"><PenSquare size={15} /></IconButton>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scroll-quiet px-2 pb-3">
          {NAV.map((section) => (
            <div key={section.id} className="mb-3">
              <div className="px-2 pt-2 pb-1">
                <span className="text-[11px] w-medium uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                  {section.label}
                </span>
              </div>
              {section.items.map((item) => {
                const on = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`group w-full flex items-center gap-2.5 h-7 px-2 rounded-[6px] text-[13px] w-medium transition-colors duration-100 ${
                      on
                        ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <item.icon size={16} className={on ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-tertiary)]'} />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge != null && (
                      <span className="text-[11px] tabular text-[var(--color-text-muted)] px-1.5 rounded bg-[var(--color-surface)] w-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--color-hairline)] px-3 h-11 flex items-center gap-2">
          <Avatar name={owner.name} color={owner.color} initials={owner.initials} size={22} />
          <div className="min-w-0">
            <div className="text-[12px] w-medium truncate leading-tight">{owner.name}</div>
            <div className="text-[10px] text-[var(--color-text-muted)] leading-tight">Owner</div>
          </div>
          <button className="ml-auto flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
            <HelpCircle size={14} />
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top breadcrumb bar */}
        <header className="h-12 shrink-0 flex items-center gap-1 px-3 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
          <IconButton aria-label="Back"><ChevronLeft size={17} /></IconButton>
          <IconButton aria-label="Forward" className="opacity-50"><ChevronRight size={17} /></IconButton>
          <IconButton aria-label="History"><Clock size={15} /></IconButton>
          <div className="flex items-center gap-2 ml-1 text-[13px]">
            {current && <current.icon size={15} className="text-[var(--color-text-tertiary)]" />}
            <span className="w-medium">{current?.label ?? 'Operator OS'}</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={openCommand}
              className="hidden lg:flex items-center gap-2 h-8 px-2.5 rounded-[8px] border border-[var(--color-border)] text-[12px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Search size={14} /> Search <Kbd>⌘K</Kbd>
            </button>
            <IconButton aria-label="New"><Plus size={16} /></IconButton>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}

export { Circle as Dot }
