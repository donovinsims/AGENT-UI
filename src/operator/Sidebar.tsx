import { navSections, systemHealth } from './data'
import { Icon, HealthPill } from './ui'

export function Sidebar({
  active,
  onNavigate,
}: {
  active: string
  onNavigate: (id: string) => void
}) {
  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      {/* Workspace switcher */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--color-brand)] text-white">
          <Icon name="Hexagon" size={15} strokeWidth={2.2} />
        </div>
        <span className="text-[13px] w-semibold text-[var(--color-text-primary)]">Operator OS</span>
        <Icon name="ChevronDown" size={13} className="text-[var(--color-text-tertiary)]" />
        <div className="ml-auto flex items-center gap-0.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]">
            <Icon name="Search" size={15} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]">
            <Icon name="PenSquare" size={15} />
          </button>
        </div>
      </div>

      <nav className="scroll-quiet flex-1 overflow-y-auto px-2 pb-4">
        {navSections.map((section) => (
          <div key={section.id} className="mb-1 mt-3 first:mt-1">
            <div className="mb-1 px-2 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group flex h-7 w-full items-center gap-2.5 rounded-[6px] px-2 text-[13px] w-medium transition-colors duration-100 ${
                    isActive
                      ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    className={
                      isActive
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]'
                    }
                  />
                  <span className="truncate">{item.label}</span>
                  {item.badge != null && (
                    <span className="ml-auto tabular text-[11px] w-medium text-[var(--color-text-muted)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Runner / integration health */}
      <div className="border-t border-[var(--color-hairline)] px-3 py-2.5">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
          <Icon name="Cpu" size={12} /> System
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {systemHealth.slice(0, 4).map((h) => (
            <div key={h.name} className="flex items-center justify-between gap-1 overflow-hidden">
              <span className="truncate text-[12px] text-[var(--color-text-tertiary)]">{h.name}</span>
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background:
                    h.status === 'connected'
                      ? 'var(--color-status-green)'
                      : h.status === 'available'
                        ? 'var(--color-status-blue)'
                        : h.status === 'unreachable'
                          ? 'var(--color-status-red)'
                          : 'var(--color-text-muted)',
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 hidden">
          <HealthPill status="connected" />
        </div>
      </div>
    </aside>
  )
}
