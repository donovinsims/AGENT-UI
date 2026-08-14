import { type ReactNode, useState } from 'react'
import { SlidersHorizontal, ListFilter, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui'

// Page wrapper: sticky toolbar header + scrollable body.
export function Page({
  title,
  count,
  views,
  actions,
  children,
  scroll = true,
}: {
  title: string
  count?: number
  views?: string[]
  actions?: ReactNode
  children: ReactNode | ((view?: string) => ReactNode)
  scroll?: boolean
}) {
  const [view, setView] = useState(views?.[0])
  return (
    <div className="h-full flex flex-col">
      <div className="h-11 shrink-0 flex items-center gap-2 px-4 md:px-5 border-b border-[var(--color-hairline)]">
        <button className="flex items-center gap-1.5 text-[14px] w-semibold">
          {title}
          {count != null && <span className="text-[var(--color-text-muted)] w-medium tabular">{count}</span>}
          <ChevronDown size={13} className="text-[var(--color-text-tertiary)]" />
        </button>
        {views && (
          <div className="ml-2 flex items-center gap-0.5 rounded-[8px] bg-[var(--color-level-2)] p-0.5">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                data-view={v}
                className={`h-6 px-2.5 rounded-[6px] text-[12px] w-medium transition-colors ${
                  view === v ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          {actions}
          <button className="grid place-items-center h-7 w-7 rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)]"><ListFilter size={15} /></button>
          <button className="grid place-items-center h-7 w-7 rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)]"><SlidersHorizontal size={15} /></button>
        </div>
      </div>
      {/* provide selected view to children via data attr on wrapper */}
      <div data-active-view={view} className={`flex-1 min-h-0 ${scroll ? 'overflow-y-auto scroll-quiet' : 'overflow-hidden'}`}>
        {typeof children === 'function' ? (children as (v?: string) => ReactNode)(view) : children}
      </div>
    </div>
  )
}

// Simpler filter chip button
export function FilterButton() {
  return (
    <Button variant="ghost" size="sm" className="text-[var(--color-text-tertiary)]">
      <ListFilter size={14} /> Filter
    </Button>
  )
}

// A dense list-row shell
export function Row({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 h-[38px] px-4 md:px-5 border-b border-[var(--color-hairline)] hover:bg-[var(--color-level-2)] transition-colors duration-100 cursor-default ${className}`}
    >
      {children}
    </div>
  )
}

export function GroupHeader({ color, label, count }: { color?: ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 h-9 px-4 md:px-5 bg-[var(--color-level-1)] border-b border-[var(--color-hairline)] sticky top-0 z-10">
      {color}
      <span className="text-[13px] w-semibold">{label}</span>
      <span className="text-[12px] text-[var(--color-text-muted)] tabular">{count}</span>
      <button className="ml-auto grid place-items-center h-6 w-6 rounded-[5px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-surface-raised)]">+</button>
    </div>
  )
}
