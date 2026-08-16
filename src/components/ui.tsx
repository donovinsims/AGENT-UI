import { type ReactNode, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import type { StatusColor, Priority } from '../data/model'

// ---- status color map (product semantics preserved) -----------------------
export const STATUS_HEX: Record<StatusColor, string> = {
  blue: 'var(--color-status-blue)',
  green: 'var(--color-status-green)',
  red: 'var(--color-status-red)',
  orange: 'var(--color-status-orange)',
  yellow: 'var(--color-status-yellow)',
  teal: 'var(--color-status-teal)',
  gray: 'var(--muted-foreground)',
  indigo: 'var(--sidebar-primary)',
}

// ---- Button ---------------------------------------------------------------
// Circle system: 14px / 500, radius 8px, 16px icons, 3px focus ring.
// Sizes: xxs 24 / xs 28 / sm 32 / default 36 / lg 40 / icon 36.
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'icon'
export function Button({
  variant = 'secondary',
  children,
  className = '',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none transition-[color,box-shadow,background-color,transform] duration-100 active:scale-[0.96] disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50'
  const sizes: Record<Size, string> = {
    xxs: 'h-6 gap-1.5 px-2.5',
    xs: 'h-7 gap-1.5 px-2.5',
    sm: 'h-8 gap-1.5 px-3',
    md: 'h-9 px-4',
    lg: 'h-10 px-6',
    icon: 'h-9 w-9',
  }
  const variants: Record<Variant, string> = {
    primary: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function IconButton({
  children,
  className = '',
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={`grid place-items-center h-8 w-8 rounded-md text-muted-foreground transition-[color,background-color,transform] duration-100 active:scale-[0.96] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
        active ? 'bg-accent text-accent-foreground' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <span className="kbd">{children}</span>
}

// ---- Status dot + priority --------------------------------------------------
export function StatusDot({ color, size = 8, ring }: { color: StatusColor; size?: number; ring?: boolean }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: ring ? 'transparent' : STATUS_HEX[color],
        border: ring ? `1.6px solid ${STATUS_HEX[color]}` : 'none',
      }}
    />
  )
}

// Circle-style priority bars: 16px footprint, restrained opacity, compact bars.
export function PriorityIcon({ priority, className = '' }: { priority: Priority; className?: string }) {
  const bars = { none: 0, low: 1, medium: 2, high: 3, urgent: 3 }[priority]
  const bar = (on: boolean, h: number) => (
    <rect x={1.5 + (h - 3)} y={h === 3 ? 2 : 5} width="3" height={h === 3 ? 12 : 9} rx="1" fill="currentColor" opacity={on ? 1 : 0.4} />
  )
  if (priority === 'urgent') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={className} aria-label="Urgent priority" role="img" focusable="false">
        <path d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4L9 4L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={className} aria-label={`${priority} priority`} role="img" focusable="false">
      {bar(bars > 2, 3)}
      {bar(bars > 1, 7)}
      {bar(bars > 0, 11)}
    </svg>
  )
}

// ---- Avatar -----------------------------------------------------------------
export function Avatar({ name, color, initials, size = 20 }: { name?: string; color?: string; initials?: string; size?: number }) {
  return (
    <span
      title={name}
      className="grid place-items-center rounded-full text-white w-medium shrink-0"
      style={{ width: size, height: size, background: color || 'var(--color-avatar-fallback)', fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  )
}

// ---- Badge / label chip -----------------------------------------------------
export function Badge({ children, color, className = '' }: { children: ReactNode; color?: StatusColor; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-border px-2.5 h-6 text-xs font-medium text-foreground whitespace-nowrap w-fit shrink-0 ${className}`}
    >
      {color && <StatusDot color={color} size={6} />}
      {children}
    </span>
  )
}

// ---- Panel / card -----------------------------------------------------------
// Circle card: 14px radius, 1px border, card surface, subtle shadow.
// Used only for actual grouped content — not for tables/CRM lists.
export function Panel({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card text-card-foreground shadow-xs ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground ${className}`}>
      {children}
    </div>
  )
}

// ---- Empty state ------------------------------------------------------------
export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="text-sm text-foreground w-medium">{title}</div>
      {hint && <div className="text-xs text-muted-foreground max-w-xs">{hint}</div>}
    </div>
  )
}

// ---- Progress ring ----------------------------------------------------------
export function Ring({ value, size = 30, color = 'var(--sidebar-primary)' }: { value: number; size?: number; color?: string }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth="3" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
