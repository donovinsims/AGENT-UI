import { type ReactNode, useEffect } from "react"
import { X } from "lucide-react"
import { SectionLabel, StatusDot } from "./ui"

// Right-side entity detail panel (Linear/Circle style), anchored inside Page.
export function DetailPanel({
  title,
  refText,
  icon,
  onClose,
  children,
}: {
  title: string
  refText?: string
  icon?: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <aside
      role="dialog"
      aria-label={`${title} details`}
      className="absolute inset-y-0 right-0 z-30 flex w-[340px] max-w-[85%] animate-sheet flex-col border-l border-border bg-popover shadow-popover"
    >
      <header className="flex items-start gap-2.5 border-b border-border p-3.5">
        {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-[14px] w-medium text-foreground"
            title={title}
          >
            {title}
          </div>
          {refText && (
            <div className="text-[11px] tabular text-muted-foreground">
              {refText}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={15} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto scroll-quiet p-3.5">
        {children}
      </div>
    </aside>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="shrink-0 text-[12px] text-muted-foreground">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-foreground">
        {children}
      </span>
    </div>
  )
}

export function StatusChip({
  color,
  label,
}: {
  color: import("../data/model").StatusColor
  label: string
}) {
  return (
    <span className="inline-flex h-[22px] items-center gap-1.5 rounded-md border border-border bg-secondary px-2 text-[11px] w-medium text-secondary-foreground">
      <StatusDot color={color} size={6} />
      {label}
    </span>
  )
}

export function PanelSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="pt-3 first:pt-0">
      <SectionLabel className="pb-1.5">{label}</SectionLabel>
      {children}
    </div>
  )
}
