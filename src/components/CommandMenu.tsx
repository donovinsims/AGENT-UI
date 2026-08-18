import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  CornerDownLeft,
  Plus,
  Send,
  Bot,
  CheckSquare,
  FileText,
  Moon,
  Sun,
} from "lucide-react"
import { NAV } from "../lib/nav"
import { Kbd } from "./ui"
import { useTheme } from "../theme/ThemeProvider"
import { useFocusTrap } from "./useFocusTrap"
import type { CreateKind } from "../store/create"

interface Cmd {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
  run: () => void
}

export function CommandMenu({
  open,
  onClose,
  navigate,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  navigate: (id: string) => void
  onCreate: (kind: CreateKind) => void
}) {
  const { theme, toggleTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(open, dialogRef)

  const commands = useMemo<Cmd[]>(() => {
    const actions: Cmd[] = [
      {
        id: "act-theme",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
        hint: "Appearance",
        icon: theme === "dark" ? <Sun size={15} /> : <Moon size={15} />,
        run: toggleTheme,
      },
      {
        id: "act-lead",
        label: "Create lead",
        hint: "Action",
        icon: <Plus size={15} />,
        run: () => onCreate("lead"),
      },
      {
        id: "act-task",
        label: "Create task",
        hint: "Action",
        icon: <CheckSquare size={15} />,
        run: () => onCreate("task"),
      },
      {
        id: "act-outreach",
        label: "Draft outreach",
        hint: "Action",
        icon: <Send size={15} />,
        run: () => navigate("outreach"),
      },
      {
        id: "act-proposal",
        label: "New proposal",
        hint: "Action",
        icon: <FileText size={15} />,
        run: () => navigate("proposals"),
      },
      {
        id: "act-agent",
        label: "Run an agent",
        hint: "Action",
        icon: <Bot size={15} />,
        run: () => navigate("agents"),
      },
    ]
    const nav: Cmd[] = NAV.flatMap((s) =>
      s.items.map((i) => ({
        id: "nav-" + i.id,
        label: i.label,
        hint: s.label,
        icon: <i.icon size={15} />,
        run: () => navigate(i.id),
      })),
    )
    return [...actions, ...nav]
  }, [navigate, onCreate, theme, toggleTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      (c.label + " " + c.hint).toLowerCase().includes(q),
    )
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery("")
      setSel(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])
  useEffect(() => setSel(0), [query])

  if (!open) return null

  const choose = (c?: Cmd) => {
    if (!c) return
    c.run()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 animate-overlay"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="w-full max-w-[600px] rounded-lg bg-[var(--popover)] border border-[var(--border)] shadow-stack overflow-hidden animate-menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setSel((s) => Math.min(s + 1, filtered.length - 1))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSel((s) => Math.max(s - 1, 0))
          } else if (e.key === "Enter") {
            e.preventDefault()
            choose(filtered[sel])
          } else if (e.key === "Escape") onClose()
        }}
      >
        <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--muted-foreground)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            aria-label="Search commands"
            className="flex-1 bg-transparent outline-none text-base sm:text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[52vh] overflow-auto scroll-quiet py-1.5">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[var(--muted-foreground)]">
              No results
            </div>
          )}
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => choose(c)}
              className={`w-full flex items-center gap-3 px-3.5 h-9 text-left transition-colors duration-100 ${
                i === sel ? "bg-[var(--secondary)]" : ""
              }`}
            >
              <span className="text-[var(--muted-foreground)]">{c.icon}</span>
              <span className="text-[13px] text-[var(--foreground)] flex-1">
                {c.label}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                {c.hint}
              </span>
              {i === sel && (
                <CornerDownLeft
                  size={13}
                  className="text-[var(--muted-foreground)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
