import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react"
import type { StatusColor, Priority } from "../data/model"

// ---- status color map -------------------------------------------------------
export const STATUS_HEX: Record<StatusColor, string> = {
  blue: "var(--color-status-blue)",
  green: "var(--color-status-green)",
  red: "var(--color-status-red)",
  orange: "var(--color-status-orange)",
  yellow: "var(--color-status-yellow)",
  teal: "var(--color-status-teal)",
  gray: "var(--muted-foreground)",
  indigo: "var(--sidebar-primary)",
}

// ---- Button -----------------------------------------------------------------
type Variant = "primary" | "secondary" | "ghost"
export function Button({
  variant = "secondary",
  children,
  className = "",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: "sm" | "md"
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md w-medium select-none transition-[background,color,box-shadow,filter,transform] duration-150 active:scale-[0.96] disabled:opacity-40"
  const sizes =
    size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]"
  const variants: Record<Variant, string> = {
    primary: "bg-primary text-primary-foreground shadow hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
  }
  return (
    <button
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({
  children,
  className = "",
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={`grid place-items-center h-8 w-8 rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 active:scale-[0.96] hover:bg-secondary hover:text-foreground ${
        active ? "bg-secondary text-foreground" : ""
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
export function StatusDot({
  color,
  size = 8,
  ring,
}: {
  color: StatusColor
  size?: number
  ring?: boolean
}) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: ring ? "transparent" : STATUS_HEX[color],
        border: ring ? `1.6px solid ${STATUS_HEX[color]}` : "none",
      }}
    />
  )
}

export function PriorityIcon({ priority }: { priority: Priority }) {
  const bars = { none: 0, low: 1, medium: 2, high: 3, urgent: 3 }[priority]
  if (priority === "urgent") {
    return (
      <span
        className="grid place-items-center h-3.5 w-3.5 rounded-[3px]"
        style={{ background: "var(--color-status-orange)" }}
      >
        <span className="text-[9px] leading-none text-white w-bold">!</span>
      </span>
    )
  }
  if (priority === "none") {
    return (
      <span
        className="inline-flex items-end gap-[1.5px] h-3.5"
        title="No priority"
      >
        {[3, 5, 7].map((h) => (
          <span
            key={h}
            className="w-[2px] rounded-[1px] bg-muted-foreground opacity-40"
            style={{ height: h }}
          />
        ))}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-end gap-[1.5px] h-3.5"
      title={`${priority} priority`}
    >
      {[3, 5, 7].map((h, i) => (
        <span
          key={h}
          className="w-[2px] rounded-[1px]"
          style={{
            height: h,
            background:
              i < bars
                ? "var(--secondary-foreground)"
                : "var(--muted-foreground)",
            opacity: i < bars ? 1 : 0.4,
          }}
        />
      ))}
    </span>
  )
}

// ---- Avatar -----------------------------------------------------------------
export function Avatar({
  name,
  color,
  initials,
  size = 20,
}: {
  name?: string
  color?: string
  initials?: string
  size?: number
}) {
  return (
    <span
      title={name}
      className="grid place-items-center rounded-full text-white w-medium shrink-0"
      style={{
        width: size,
        height: size,
        background: color || "var(--secondary)",
        fontSize: size * 0.42,
      }}
    >
      {initials}
    </span>
  )
}

// ---- Badge / label chip -----------------------------------------------------
export function Badge({
  children,
  color,
  className = "",
}: {
  children: ReactNode
  color?: StatusColor
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-md text-[11px] w-medium border border-border bg-secondary text-secondary-foreground whitespace-nowrap ${className}`}
    >
      {color && <StatusDot color={color} size={6} />}
      {children}
    </span>
  )
}

// ---- Panel / card -----------------------------------------------------------
export function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`text-[11px] w-medium uppercase tracking-[0.06em] text-muted-foreground ${className}`}
    >
      {children}
    </div>
  )
}

// ---- Empty state ------------------------------------------------------------
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-2.5">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="text-[14px] text-secondary-foreground w-medium">
        {title}
      </div>
      {hint && (
        <div className="text-[13px] text-muted-foreground max-w-xs">{hint}</div>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

// ---- Progress ring ----------------------------------------------------------
export function Ring({
  value,
  size = 30,
  color = "var(--sidebar-primary)",
}: {
  value: number
  size?: number
  color?: string
}) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="3"
      />
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
