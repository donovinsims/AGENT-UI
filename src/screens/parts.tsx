import { type ReactNode, useState } from 'react'
import { SlidersHorizontal, ListFilter, ChevronDown } from 'lucide-react'
import { Button, IconButton } from '../components/ui'

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
      <div className="h-10 shrink-0 flex items-center gap-2 px-4 md:px-6 border-b border-border">
        <button className="flex items-center gap-1.5 text-sm w-semibold">
          {title}
          {count != null && <span className="text-muted-foreground w-medium tabular">{count}</span>}
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
        {views && (
          <div className="ml-2 flex items-center gap-1">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                data-view={v}
                className={`h-7 px-2.5 rounded-md text-xs w-medium transition-colors duration-100 ${
                  view === v
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          {actions}
          <IconButton aria-label="Filter view"><ListFilter size={15} /></IconButton>
          <IconButton aria-label="View settings"><SlidersHorizontal size={15} /></IconButton>
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
    <Button variant="ghost" size="sm" className="text-muted-foreground">
      <ListFilter size={14} /> Filter
    </Button>
  )
}

// A dense list-row shell. Hover/cursor affordance only when the row is interactive.
// Circle operational rows: 44px, 24px horizontal padding.
export function Row({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const interactive = Boolean(onClick)
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick?.() } } : undefined}
      className={`group flex items-center gap-3 h-11 px-4 md:px-6 border-b border-border ${
        interactive ? 'hover:bg-muted/50 transition-colors duration-100 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function GroupHeader({ color, label, count }: { color?: ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 h-9 px-4 md:px-6 bg-muted/30 border-b border-border sticky top-0 z-10">
      {color}
      <span className="text-[13px] w-semibold">{label}</span>
      <span className="text-xs text-muted-foreground tabular">{count}</span>
      <button className="ml-auto grid place-items-center h-6 w-6 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">+</button>
    </div>
  )
}
