import { type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { useUrlState } from "../lib/url-state"
import { Tabs } from "../components/form"
import { Button, IconButton } from "../components/ui"
import { FilterBar } from "../components/filter"
import { DisplayOptions, type DisplaySettings } from "../components/display"

// Page wrapper: Circle-style toolbar header (h-10) + optional filter bar +
// scrollable body. The active view is URL-synced (nuqs-style) per page.

export interface PageDisplayProps {
  settings: DisplaySettings
  onChange: (next: DisplaySettings) => void
  groupOptions: { id: string; label: string }[]
  orderOptions: { id: string; label: string }[]
  columnOptions?: { id: string; label: string }[]
}

export function Page({
  title,
  count,
  views,
  actions,
  filter,
  display,
  panel,
  children,
  scroll = true,
  /** right-side detail panel (absolute within the page) */
}: {
  title: string
  count?: number
  views?: string[]
  actions?: ReactNode
  filter?: {
    filters: import("../components/filter").FilterChip[]
    onChange: (filters: import("../components/filter").FilterChip[]) => void
    columns: import("../components/filter").FilterColumn<any>[]
    items: any[]
  }
  panel?: ReactNode
  display?: PageDisplayProps
  children: ReactNode | ((view?: string) => ReactNode)
  scroll?: boolean
}) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  const [view, setView] = useUrlState<string>(`view:${slug}`, views?.[0] ?? "")

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center gap-2 px-2.5 lg:px-3 border-b border-border bg-container">
        <button className="flex items-center gap-1.5 text-[14px] w-semibold text-foreground">
          {title}
          {count != null && (
            <span className="text-muted-foreground w-medium tabular">
              {count}
            </span>
          )}
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
        {views && views.length > 0 && (
          <Tabs
            value={view || views[0]}
            onChange={setView}
            tabs={views.map((v) => ({ id: v, label: v }))}
          />
        )}
        <div className="ml-auto flex items-center gap-0.5">
          {actions}
          {display && (
            <DisplayOptions
              settings={display.settings}
              onChange={display.onChange}
              groupOptions={display.groupOptions}
              orderOptions={display.orderOptions}
              columnOptions={display.columnOptions ?? []}
            />
          )}
        </div>
      </div>
      {filter && <FilterBar {...filter} />}
      <div
        data-active-view={view}
        className={`flex-1 min-h-0 ${
          scroll ? "overflow-y-auto scroll-quiet" : "overflow-hidden"
        } bg-container`}
      >
        {typeof children === "function"
          ? (children as (v?: string) => ReactNode)(view)
          : children}
      </div>
      {panel}
    </div>
  )
}

// Ghost filter chip button (secondary screens, pre-filter-bar)
export function FilterButton({
  children = "Filter",
}: {
  children?: ReactNode
}) {
  return (
    <Button variant="ghost" size="sm">
      {children}
    </Button>
  )
}

// Dense list row (Circle: h-11). Hover/cursor affordance only when interactive.
export function Row({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  const interactive = Boolean(onClick)
  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={`group flex h-11 items-center gap-3 border-b border-border bg-container px-2.5 lg:px-3 ${
        interactive
          ? "cursor-pointer transition-colors hover:bg-secondary/60"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Grouping header (Circle: h-10, sticky under the toolbar).
export function GroupHeader({
  color,
  label,
  count,
  onAdd,
}: {
  color?: ReactNode
  label: string
  count: number
  onAdd?: () => void
}) {
  return (
    <div className="group sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-border bg-container px-2.5 lg:px-3">
      {color}
      <span className="text-[13px] w-semibold text-foreground">{label}</span>
      <span className="tabular text-[12px] text-muted-foreground">{count}</span>
      <button
        onClick={onAdd}
        aria-label={`Add to ${label}`}
        className="ml-auto grid h-6 w-6 place-items-center rounded-[5px] text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground group-hover:opacity-100 focus:opacity-100"
      >
        +
      </button>
    </div>
  )
}

export { IconButton }
