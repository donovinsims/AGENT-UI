import { type ReactNode } from 'react'
import {
  Search, PenSquare, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus, HelpCircle, Circle, Moon, Sun,
} from 'lucide-react'
import { NAV, itemById } from '../lib/nav'
import { owner } from '../data/model'
import { IconButton, Kbd, Avatar } from '../components/ui'
import { useTheme } from '../theme/ThemeProvider'

function LinearMark() {
  return (
    <span className="grid place-items-center h-6 w-6 rounded-md bg-sidebar-accent shrink-0">
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ background: 'conic-gradient(from 210deg, var(--color-sidebar-foreground) 0 55%, var(--color-primary) 55% 100%)' }}
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
  const { theme, toggleTheme } = useTheme()
  const current = itemById(active)
  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-[244px] shrink-0 flex flex-col border-r border-border bg-background">
        {/* workspace switcher */}
        <div className="flex items-center gap-2 h-[52px] px-3">
          <LinearMark />
          <button className="flex items-center gap-1 h-8 px-1 -mx-1 rounded-md text-sm w-semibold hover:text-foreground hover:bg-accent transition-colors">
            Operator OS <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="ml-auto flex items-center gap-0.5">
            <IconButton onClick={openCommand} aria-label="Search"><Search size={16} /></IconButton>
            <IconButton aria-label="Compose"><PenSquare size={15} /></IconButton>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto scroll-quiet px-2 pb-3">
          {NAV.map((section) => (
            <div key={section.id} className="mb-3">
              <div className="px-2 pt-2 pb-1">
                <span className="text-xs w-medium uppercase tracking-[0.06em] text-muted-foreground">
                  {section.label}
                </span>
              </div>
              {section.items.map((item) => {
                const on = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    aria-current={on ? 'page' : undefined}
                    className={`group w-full flex items-center gap-2.5 h-7 px-2 rounded-md text-xs w-medium transition-colors duration-100 ${
                      on
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge != null && (
                      <span className="text-xs tabular text-muted-foreground px-1.5 rounded bg-muted w-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 h-11 flex items-center gap-2">
          <Avatar name={owner.name} color={owner.color} initials={owner.initials} size={22} />
          <div className="min-w-0">
            <div className="text-xs w-medium truncate leading-tight">{owner.name}</div>
            <div className="text-xs text-muted-foreground leading-tight">Owner</div>
          </div>
          <button className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <HelpCircle size={14} />
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 p-2">
        {/* Circle shell framing: bordered + rounded inner container */}
        <div className="h-full w-full rounded-md border border-border bg-container overflow-hidden flex flex-col">
          {/* Top breadcrumb bar */}
          <header className="h-10 shrink-0 flex items-center gap-1 px-3 border-b border-border">
            <IconButton aria-label="Back"><ChevronLeft size={16} /></IconButton>
            <IconButton aria-label="Forward" className="opacity-50"><ChevronRight size={16} /></IconButton>
            <IconButton aria-label="History"><Clock size={16} /></IconButton>
            <div className="flex items-center gap-2 ml-1 text-sm">
              {current && <current.icon size={16} className="text-muted-foreground" />}
              <span className="w-medium">{current?.label ?? 'Operator OS'}</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <IconButton onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</></IconButton>
              <button
                onClick={openCommand}
                className="hidden lg:flex items-center gap-2 h-8 px-2.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                <Search size={15} /> Search <Kbd>⌘K</Kbd>
              </button>
              <IconButton aria-label="New"><Plus size={16} /></IconButton>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}

export { Circle as Dot }
