import type { ReactNode } from 'react'
import * as Lucide from 'lucide-react'
import type { Priority, StatusColor } from './data'
import { statusHex } from './data'

// Resolve a lucide icon by name (used by the data-driven sidebar).
export function Icon({
  name,
  size = 16,
  className,
  strokeWidth = 1.75,
}: {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}) {
  const Cmp = (Lucide as Record<string, unknown>)[name] as
    | Lucide.LucideIcon
    | undefined
  const Fallback = Lucide.Square
  const C = Cmp ?? Fallback
  return <C size={size} className={className} strokeWidth={strokeWidth} />
}

export function Avatar({
  name,
  initials,
  color,
  size = 20,
}: {
  name: string
  initials: string
  color: string
  size?: number
}) {
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white select-none"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size <= 20 ? 9 : 11,
        fontWeight: 590,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </span>
  )
}

export function StatusDot({ color, size = 8 }: { color: StatusColor; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: statusHex[color] }}
    />
  )
}

// Linear-style priority bar glyph.
export function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent') {
    return (
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-[3px]"
        style={{ background: 'var(--color-status-orange)' }}
      >
        <Lucide.AlertTriangle size={11} strokeWidth={2.5} color="#08090a" />
      </span>
    )
  }
  const bars = priority === 'high' ? 3 : priority === 'medium' ? 2 : priority === 'low' ? 1 : 0
  const heights = [5, 8, 11]
  return (
    <span className="inline-flex h-4 w-4 items-end justify-center gap-[2px] pb-[2px]" title={priority}>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{
            height: h,
            background: i < bars ? 'var(--color-text-secondary)' : 'var(--color-border-input)',
          }}
        />
      ))}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <span className="kbd">{children}</span>
}

export function Chip({
  children,
  color,
  className = '',
}: {
  children: ReactNode
  color?: StatusColor
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-[3px] text-[12px] w-medium text-[var(--color-text-secondary)] ${className}`}
      style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-level-1)' }}
    >
      {color && <StatusDot color={color} size={6} />}
      {children}
    </span>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'ghost'
export function Button({
  children,
  variant = 'secondary',
  onClick,
  className = '',
  title,
}: {
  children: ReactNode
  variant?: BtnVariant
  onClick?: () => void
  className?: string
  title?: string
}) {
  const base =
    'inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[13px] w-medium transition-colors duration-100'
  const styles: Record<BtnVariant, string> = {
    primary:
      'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]',
    secondary:
      'border border-[var(--color-border-input)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
    ghost:
      'text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
  }
  return (
    <button title={title} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function IconButton({
  name,
  onClick,
  title,
  active = false,
  size = 16,
}: {
  name: string
  onClick?: () => void
  title?: string
  active?: boolean
  size?: number
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors duration-100 ${
        active
          ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
          : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      <Icon name={name} size={size} />
    </button>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
      {children}
    </div>
  )
}

export function HealthPill({
  status,
}: {
  status: 'connected' | 'available' | 'offline' | 'unreachable'
}) {
  const map = {
    connected: { c: 'green' as StatusColor, t: 'Connected' },
    available: { c: 'blue' as StatusColor, t: 'Available' },
    offline: { c: 'muted' as StatusColor, t: 'Offline' },
    unreachable: { c: 'red' as StatusColor, t: 'Unreachable' },
  }
  const m = map[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] w-medium text-[var(--color-text-tertiary)]">
      <StatusDot color={m.c} size={6} />
      {m.t}
    </span>
  )
}
