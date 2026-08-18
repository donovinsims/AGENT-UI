import { type ReactNode } from "react"
import { Check } from "lucide-react"
import { Popover } from "./overlay"

// ---- Select (popover-based list picker) -------------------------------------
export interface SelectOption<T extends string = string> {
  value: T
  label: string
  dot?: ReactNode
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  trigger,
}: {
  value: T | null | undefined
  onChange: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  trigger?: ReactNode
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <Popover
      trigger={
        trigger ?? (
          <button className="flex h-8 w-full items-center gap-2 rounded-md border border-border bg-popover px-2.5 text-[13px] text-foreground transition-colors hover:bg-secondary">
            {selected?.dot}
            <span
              className={`flex-1 truncate text-left ${
                selected ? "" : "text-muted-foreground"
              }`}
            >
              {selected?.label ?? placeholder}
            </span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="text-muted-foreground"
              aria-hidden="true"
            >
              <path
                d="M1.5 3.5L5 7l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )
      }
      panelClassName="min-w-[220px]"
    >
      {(close) => (
        <div className="max-h-[280px] overflow-y-auto scroll-quiet p-0.5">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value)
                close()
              }}
              className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-foreground transition-colors hover:bg-secondary"
            >
              {o.dot}
              <span className="flex-1 truncate">{o.label}</span>
              {value === o.value && (
                <Check size={14} className="shrink-0 text-foreground" />
              )}
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}

// ---- Switch ------------------------------------------------------------------
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label?: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[18px] w-[30px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-secondary"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full transition-[left] ${
          checked ? "left-[14px]" : "left-[2px]"
        } ${checked ? "bg-primary-foreground" : "bg-muted-foreground"}`}
      />
    </button>
  )
}

// ---- Checkbox -----------------------------------------------------------------
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border transition-colors ${
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-popover hover:bg-secondary"
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  )
}

// ---- Tabs (segmented control) ---------------------------------------------------
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  className = "",
}: {
  value: T
  onChange: (tab: T) => void
  tabs: { id: T; label: string; count?: number }[]
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg bg-secondary p-0.5 ${className}`}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          aria-pressed={value === t.id}
          className={`h-6 px-2.5 rounded-[6px] text-[12px] w-medium transition-colors ${
            value === t.id
              ? "bg-popover text-foreground shadow-popover"
              : "text-muted-foreground hover:text-secondary-foreground"
          }`}
        >
          {t.label}
          {t.count != null && (
            <span className="ml-1 tabular text-muted-foreground">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
