import { useEffect, useMemo, useRef, useState } from 'react'
import { navSections } from './data'
import { Icon, Kbd } from './ui'

interface Command {
  id: string
  label: string
  icon: string
  group: string
  navId?: string
  hint?: string
}

export function CommandMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = navSections.flatMap((s) =>
      s.items.map((i) => ({
        id: `go-${i.id}`,
        label: `Go to ${i.label}`,
        icon: i.icon,
        group: 'Navigate',
        navId: i.id,
      })),
    )
    const actions: Command[] = [
      { id: 'a-lead', label: 'Create lead', icon: 'UserPlus', group: 'Create', navId: 'leads', hint: 'L' },
      { id: 'a-opp', label: 'Create opportunity', icon: 'KanbanSquare', group: 'Create', navId: 'pipeline', hint: 'O' },
      { id: 'a-task', label: 'Create task', icon: 'ListChecks', group: 'Create', navId: 'tasks', hint: 'T' },
      { id: 'a-draft', label: 'Draft outreach', icon: 'Send', group: 'Create', navId: 'outreach' },
      { id: 'a-run', label: 'Run an agent', icon: 'Bot', group: 'Agents', navId: 'agents' },
      { id: 'a-appr', label: 'Review approvals', icon: 'ShieldCheck', group: 'Agents', navId: 'approvals' },
    ]
    return [...actions, ...nav]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  if (!open) return null

  const run = (c: Command) => {
    if (c.navId) onNavigate(c.navId)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const c = filtered[selected]
      if (c) run(c)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  // Group while preserving order
  const groups: { name: string; items: Command[] }[] = []
  filtered.forEach((c) => {
    const g = groups.find((x) => x.name === c.group)
    if (g) g.items.push(c)
    else groups.push({ name: c.group, items: [c] })
  })

  let flatIndex = -1

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: 'var(--color-scrim)', animation: 'overlayIn 0.12s var(--ease-quad)' }}
      onClick={onClose}
    >
      <div
        className="shadow-stack w-full max-w-[640px] overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ animation: 'menuIn 0.14s var(--ease-quad)' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--color-hairline)] px-4 py-3">
          <Icon name="Search" size={16} className="text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            className="w-full bg-transparent text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div className="scroll-quiet max-h-[52vh] overflow-y-auto py-1.5">
          {groups.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-[var(--color-text-muted)]">
              No results
            </div>
          )}
          {groups.map((g) => (
            <div key={g.name} className="mb-1">
              <div className="px-4 py-1 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                {g.name}
              </div>
              {g.items.map((c) => {
                flatIndex++
                const idx = flatIndex
                const isSel = idx === selected
                return (
                  <button
                    key={c.id}
                    onMouseEnter={() => setSelected(idx)}
                    onClick={() => run(c)}
                    className={`flex h-9 w-full items-center gap-3 px-4 text-[13px] transition-colors duration-75 ${
                      isSel ? 'bg-[var(--color-surface-raised)]' : ''
                    }`}
                  >
                    <Icon
                      name={c.icon}
                      size={16}
                      className={isSel ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}
                    />
                    <span className={isSel ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}>
                      {c.label}
                    </span>
                    {c.hint && (
                      <span className="ml-auto flex items-center gap-1">
                        <Kbd>{c.hint}</Kbd>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
