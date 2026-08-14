import type { ReactNode } from 'react'
import { Icon, Kbd } from './ui'

export function TopBar({
  crumbs,
  onOpenCommand,
  onToggleSidebar,
  actions,
}: {
  crumbs: { icon: string; label: string }[]
  onOpenCommand: () => void
  onToggleSidebar: () => void
  actions?: ReactNode
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b border-[var(--color-hairline)] px-3">
      <button
        onClick={onToggleSidebar}
        className="mr-1 flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] md:hidden"
      >
        <Icon name="PanelLeft" size={16} />
      </button>
      <button className="hidden h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] md:flex">
        <Icon name="ChevronLeft" size={16} />
      </button>
      <button className="hidden h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] md:flex">
        <Icon name="ChevronRight" size={16} />
      </button>

      <nav className="ml-1 flex min-w-0 items-center gap-1.5 text-[13px]">
        {crumbs.map((c, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <span className="text-[var(--color-text-muted)]">/</span>}
            <Icon
              name={c.icon}
              size={14}
              className={i === crumbs.length - 1 ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'}
            />
            <span
              className={`truncate ${
                i === crumbs.length - 1
                  ? 'w-semibold text-[var(--color-text-primary)]'
                  : 'w-medium text-[var(--color-text-tertiary)]'
              }`}
            >
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {actions}
        <button
          onClick={onOpenCommand}
          className="hidden items-center gap-2 rounded-[8px] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[13px] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] sm:flex"
        >
          <Icon name="Search" size={14} />
          <span className="w-medium">Search or run command</span>
          <Kbd>⌘K</Kbd>
        </button>
        <button
          onClick={onOpenCommand}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] sm:hidden"
        >
          <Icon name="Search" size={16} />
        </button>
      </div>
    </header>
  )
}
