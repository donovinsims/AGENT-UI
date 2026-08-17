import { type ReactNode, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useFocusTrap } from "./useFocusTrap"

// ---- Dialog ----------------------------------------------------------------
export function Dialog({
  open,
  onClose,
  title,
  children,
  width = "max-w-[440px]",
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(open, ref)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh] animate-overlay"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onMouseDown={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        className={`w-full ${width} rounded-lg border border-border bg-popover text-popover-foreground shadow-stack animate-menu`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-4">
            <span className="text-[14px] w-semibold">{title}</span>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="ml-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// ---- Popover ---------------------------------------------------------------
export function Popover({
  trigger,
  children,
  align = "start",
  side = "bottom",
  className = "",
  panelClassName = "",
  open: controlledOpen,
  onOpenChange,
}: {
  trigger: ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
  align?: "start" | "end"
  side?: "bottom" | "top"
  className?: string
  panelClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internal, setInternal] = useState(false)
  const open = controlledOpen ?? internal
  const setOpen = (next: boolean) => {
    setInternal(next)
    onOpenChange?.(next)
  }
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const content =
    typeof children === "function" ? children(() => setOpen(false)) : children
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-40 min-w-[190px] rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-popover animate-menu ${
            side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${align === "end" ? "right-0" : "left-0"} ${panelClassName}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ---- Menu building blocks --------------------------------------------------
export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 pb-1 pt-1.5 text-[11px] w-medium uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

export function MenuItem({
  children,
  onSelect,
  active,
  className = "",
}: {
  children: ReactNode
  onSelect?: () => void
  active?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground ${
        active ? "bg-secondary text-secondary-foreground" : ""
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-border" />
}

// ---- Tooltip ----------------------------------------------------------------
export function Tooltip({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground opacity-0 shadow-popover transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}
