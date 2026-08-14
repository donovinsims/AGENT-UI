import { useEffect, useMemo, useState } from 'react'
import { navSections } from './operator/data'
import { Sidebar } from './operator/Sidebar'
import { TopBar } from './operator/TopBar'
import { CommandMenu } from './operator/CommandMenu'
import { MobileNav } from './operator/MobileNav'
import { Button, Icon } from './operator/ui'
import { Today } from './operator/views/Today'
import { Pipeline } from './operator/views/Pipeline'
import { RecordDetail } from './operator/views/RecordDetail'
import { Agents } from './operator/views/Agents'
import { Approvals } from './operator/views/Approvals'
import { Placeholder } from './operator/views/Placeholder'

const navLookup = Object.fromEntries(
  navSections.flatMap((s) => s.items.map((i) => [i.id, { ...i, section: s.label }])),
) as Record<string, { id: string; label: string; icon: string; section: string }>

export default function App() {
  const [active, setActive] = useState('today')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = (id: string) => {
    setActive(id)
    setSidebarOpen(false)
  }

  const meta = navLookup[active] ?? navLookup.today
  const crumbs = useMemo(
    () => [
      { icon: meta.icon, label: meta.section },
      { icon: meta.icon, label: meta.label },
    ],
    [meta],
  )

  const topActions = (() => {
    if (active === 'today') {
      return (
        <Button variant="primary" className="hidden h-7 px-2.5 text-[12px] sm:inline-flex">
          <Icon name="Plus" size={14} /> Capture
        </Button>
      )
    }
    return null
  })()

  const renderView = () => {
    switch (active) {
      case 'today':
        return <Today onNavigate={navigate} />
      case 'pipeline':
        return <Pipeline />
      case 'inbox':
        return <RecordDetail />
      case 'agents':
        return <Agents />
      case 'approvals':
        return <Approvals />
      default:
        return <Placeholder icon={meta.icon} title={meta.label} section={meta.section} />
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar active={active} onNavigate={navigate} />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'var(--color-scrim)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="h-full w-[264px] max-w-[85%]"
            style={{ animation: 'staggerIn 0.16s var(--ease-quad)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar active={active} onNavigate={navigate} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          crumbs={crumbs}
          onOpenCommand={() => setCmdOpen(true)}
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
          actions={topActions}
        />
        <main className="min-h-0 flex-1 pb-16 md:pb-0">{renderView()}</main>
      </div>

      <MobileNav active={active} onNavigate={navigate} />
      <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
    </div>
  )
}
