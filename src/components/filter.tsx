import { type ReactNode, useMemo } from "react"
import { Plus, X } from "lucide-react"
import { useUrlJsonState } from "../lib/url-state"
import { Popover, MenuLabel, MenuItem, MenuSeparator } from "./overlay"
import { Select } from "./form"

// ---- filter model (Circle/bazza-style: subject / operator / value) ----------
export type FilterOp = "is" | "isNot" | "contains" | "isEmpty" | "isNotEmpty"

export interface FilterChip {
  id: string
  column: string
  op: FilterOp
  value: string
}

export interface FilterColumn<T> {
  id: string
  label: string
  get: (item: T) => string | undefined
  /** present → pick-list values; absent → free-text (contains) */
  values?: { value: string; label: string; dot?: ReactNode }[]
}

export const OP_LABELS: Record<FilterOp, string> = {
  is: "is",
  isNot: "is not",
  contains: "contains",
  isEmpty: "is empty",
  isNotEmpty: "is not empty",
}

let chipSeq = 0
const newChipId = () => `f_${Date.now()}_${chipSeq++}`

export function useFilters<T>(
  key: string,
): [FilterChip[], (filters: FilterChip[]) => void] {
  return useUrlJsonState<FilterChip[]>(`filters:${key}`, [])
}

export function applyFilters<T>(
  items: T[],
  filters: FilterChip[],
  columns: FilterColumn<T>[],
): T[] {
  if (!filters.length) return items
  return items.filter((item) =>
    filters.every((chip) => {
      const column = columns.find((c) => c.id === chip.column)
      if (!column) return true
      const raw = column.get(item)
      const value = raw ?? ""
      switch (chip.op) {
        case "is":
          return value === chip.value
        case "isNot":
          return value !== chip.value
        case "contains":
          return value.toLowerCase().includes(chip.value.toLowerCase())
        case "isEmpty":
          return !value
        case "isNotEmpty":
          return Boolean(value)
      }
    }),
  )
}

// ---- filter UI ----------------------------------------------------------------
function ChipEditor({
  chip,
  columns,
  onSave,
  onRemove,
}: {
  chip: FilterChip
  columns: FilterColumn<any>[]
  onSave: (chip: FilterChip) => void
  onRemove: () => void
}) {
  const column = columns.find((c) => c.id === chip.column) ?? columns[0]
  const textOps: FilterOp[] = [
    "is",
    "isNot",
    "contains",
    "isEmpty",
    "isNotEmpty",
  ]
  const pickOps: FilterOp[] = ["is", "isNot", "isEmpty", "isNotEmpty"]
  const ops = column?.values ? pickOps : textOps
  const needsValue = chip.op !== "isEmpty" && chip.op !== "isNotEmpty"

  return (
    <div className="w-[260px] p-1.5">
      <div className="space-y-1.5">
        <Select
          value={chip.column}
          onChange={(columnId) => onSave({ ...chip, column: columnId })}
          options={columns.map((c) => ({ value: c.id, label: c.label }))}
        />
        <Select
          value={chip.op}
          onChange={(op) => onSave({ ...chip, op })}
          options={ops.map((op) => ({ value: op, label: OP_LABELS[op] }))}
        />
        {needsValue &&
          (column?.values ? (
            <Select
              value={chip.value || undefined}
              onChange={(value) => onSave({ ...chip, value })}
              options={column.values.map((v) => ({
                value: v.value,
                label: v.label,
                dot: v.dot,
              }))}
              placeholder="Select value…"
            />
          ) : (
            <input
              autoFocus
              value={chip.value}
              onChange={(e) => onSave({ ...chip, value: e.target.value })}
              placeholder="Value…"
              className="h-8 w-full rounded-md border border-border bg-popover px-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <button
          onClick={onRemove}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={13} /> Remove filter
        </button>
        <span className="text-[11px] text-muted-foreground">—</span>
      </div>
    </div>
  )
}

export function FilterBar<T>({
  filters,
  onChange,
  columns,
  items,
  className = "",
}: {
  filters: FilterChip[]
  onChange: (filters: FilterChip[]) => void
  columns: FilterColumn<T>[]
  items: T[]
  className?: string
}) {
  const filtered = useMemo(
    () => applyFilters(items, filters, columns),
    [items, filters, columns],
  )

  const add = (columnId: string) => {
    onChange([
      ...filters,
      { id: newChipId(), column: columnId, op: "is", value: "" },
    ])
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-container ${className}`}
    >
      {filters.map((chip) => {
        const column = columns.find((c) => c.id === chip.column)
        const valueLabel =
          column?.values?.find((v) => v.value === chip.value)?.label ??
          chip.value
        return (
          <Popover
            key={chip.id}
            panelClassName="min-w-[260px]"
            trigger={
              <button className="flex h-7 items-center gap-1 rounded-md border border-border bg-popover px-2 text-[12px] text-foreground transition-colors hover:bg-secondary">
                <span className="w-medium">{column?.label ?? chip.column}</span>
                <span className="text-muted-foreground">
                  {OP_LABELS[chip.op]}
                </span>
                {chip.op !== "isEmpty" && chip.op !== "isNotEmpty" && (
                  <span className="w-medium">{valueLabel || "…"}</span>
                )}
                <span className="ml-0.5 text-muted-foreground hover:text-foreground">
                  <X size={12} />
                </span>
              </button>
            }
          >
            {(close) => (
              <ChipEditor
                chip={chip}
                columns={columns}
                onSave={(next) =>
                  onChange(filters.map((f) => (f.id === chip.id ? next : f)))
                }
                onRemove={() => {
                  onChange(filters.filter((f) => f.id !== chip.id))
                  close()
                }}
              />
            )}
          </Popover>
        )
      })}
      <Popover
        trigger={
          <button className="flex h-7 items-center gap-1 rounded-md px-2 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Plus size={13} /> Filter
          </button>
        }
      >
        <div className="p-0.5">
          <MenuLabel>Add filter</MenuLabel>
          {columns.map((c) => (
            <MenuItem key={c.id} onSelect={() => add(c.id)}>
              {c.label}
            </MenuItem>
          ))}
          {filters.length > 0 && (
            <>
              <MenuSeparator />
              <MenuItem onSelect={() => onChange([])}>
                <span className="text-muted-foreground">Clear all filters</span>
              </MenuItem>
            </>
          )}
        </div>
      </Popover>
      {filters.length > 0 && (
        <span className="ml-auto text-[11px] tabular text-muted-foreground">
          {filtered.length} of {items.length}
        </span>
      )}
    </div>
  )
}
