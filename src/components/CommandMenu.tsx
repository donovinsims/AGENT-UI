import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, Plus, Send, Bot, CheckSquare, FileText } from 'lucide-react'
import { NAV } from '../lib/nav'
import { Kbd } from './ui'

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
}: {
  open: boolean
  onClose: () => void
  navigate: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Cmd[]>(() => {
    const actions: Cmd[] = [
      { id: 'act-lead', label: 'Create lead', hint: 'Action', icon: <Plus size={15} />, run: () => navigate('leads') },
      { id: 'act-task', label: 'Create task', hint: 'Action', icon: <CheckSquare size={15} />, run: () => navigate('tasks') },
      { id: 'act-outreach', label: 'Draft outreach', hint: 'Action', icon: <Send size={15} />, run: () => navigate('outreach') },
      { id: 'act-proposal', label: 'New proposal', hint: 'Action', icon: <FileText size={15} />, run: () => navigate('proposals') },
      { id: 'act-agent', label: 'Run an agent', hint: 'Action', icon: <Bot size={15} />, run: () => navigate('agents') },
    ]
    const nav: Cmd[] = NAV.flatMap((s) =>
      s.items.map((i) => ({
        id: 'nav-' + i.id,
        label: i.label,
        hint: s.label,
        icon: <i.icon size={15} />,
        run: () => navigate(i.id),
      })),
    )
    return [...actions, ...nav]
  }, [navigate])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => (c.label + ' ' + c.hint).toLowerCase().includes(q))
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery('')
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
      style={{ background: 'var(--color-scrim)', backdropFilter: 'blur(2px)' }}
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[600px] rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-stack overflow-hidden animate-menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
          else if (e.key === 'Enter') { e.preventDefault(); choose(filtered[sel]) }
          else if (e.key === 'Escape') onClose()
        }}
      >
        <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-[var(--color-hairline)]">
          <Search size={16} className="text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[52vh] overflow-auto scroll-quiet py-1.5">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[var(--color-text-muted)]">No results</div>
          )}
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => choose(c)}
              className={`w-full flex items-center gap-3 px-3.5 h-9 text-left transition-colors duration-100 ${
                i === sel ? 'bg-[var(--color-surface-raised)]' : ''
              }`}
            >
              <span className="text-[var(--color-text-tertiary)]">{c.icon}</span>
              <span className="text-[13px] text-[var(--color-text-primary)] flex-1">{c.label}</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">{c.hint}</span>
              {i === sel && <CornerDownLeft size={13} className="text-[var(--color-text-muted)]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
