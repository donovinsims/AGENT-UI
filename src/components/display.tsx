import { useState } from "react"
import { SlidersHorizontal, Check } from "lucide-react"
import { Popover, MenuLabel, MenuItem, MenuSeparator } from "./overlay"
import { Checkbox } from "./form"

// ---- display settings (Circle display-settings-store port, persisted) --------
export interface DisplaySettings {
  groupBy: string
  orderBy: string
  showEmptyGroups: boolean
  columns: string[]
}

function load(key: string, defaults: DisplaySettings): DisplaySettings {
  try {
    const raw = window.localStorage.getItem(`operator-os-display:${key}`)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) as Partial<DisplaySettings> }
  } catch {
    return defaults
  }
}

export function useDisplaySettings(
  key: string,
  defaults: DisplaySettings,
): [DisplaySettings, (next: DisplaySettings) => void] {
  const [settings, setSettings] = useState<DisplaySettings>(() =>
    load(key, defaults),
  )
  const update = (next: DisplaySettings) => {
    setSettings(next)
    window.localStorage.setItem(
      `operator-os-display:${key}`,
      JSON.stringify(next),
    )
  }
  return [settings, update]
}

// ---- display options popover (Linear-style) ------------------------------------
export function DisplayOptions({
  settings,
  onChange,
  groupOptions,
  orderOptions,
  columnOptions,
}: {
  settings: DisplaySettings
  onChange: (next: DisplaySettings) => void
  groupOptions: { id: string; label: string }[]
  orderOptions: { id: string; label: string }[]
  columnOptions: { id: string; label: string }[]
}) {
  const toggle = (id: string) =>
    onChange({
      ...settings,
      columns: settings.columns.includes(id)
        ? settings.columns.filter((c) => c !== id)
        : [...settings.columns, id],
    })

  return (
    <Popover
      align="end"
      trigger={
        <button
          aria-label="Display options"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <SlidersHorizontal size={15} />
        </button>
      }
      panelClassName="w-[240px]"
    >
      <div className="p-0.5">
        <MenuLabel>Grouping</MenuLabel>
        {groupOptions.map((g) => (
          <MenuItem
            key={g.id}
            onSelect={() => onChange({ ...settings, groupBy: g.id })}
            active={settings.groupBy === g.id}
          >
            <span className="flex-1">{g.label}</span>
            {settings.groupBy === g.id && <Check size={14} />}
          </MenuItem>
        ))}

        <MenuSeparator />
        <MenuLabel>Ordering</MenuLabel>
        {orderOptions.map((o) => (
          <MenuItem
            key={o.id}
            onSelect={() => onChange({ ...settings, orderBy: o.id })}
            active={settings.orderBy === o.id}
          >
            <span className="flex-1">{o.label}</span>
            {settings.orderBy === o.id && <Check size={14} />}
          </MenuItem>
        ))}

        <MenuSeparator />
        <MenuLabel>View</MenuLabel>
        <div className="flex items-center gap-2 px-2 py-1">
          <Checkbox
            checked={settings.showEmptyGroups}
            onChange={() =>
              onChange({
                ...settings,
                showEmptyGroups: !settings.showEmptyGroups,
              })
            }
            label="Show empty groups"
          />
          <span className="text-[13px] text-foreground">Show empty groups</span>
        </div>

        {columnOptions.length > 0 && (
          <>
            <MenuSeparator />
            <MenuLabel>Columns</MenuLabel>
            <div className="px-1 pb-1">
              {columnOptions.map((c) => (
                <div key={c.id} className="flex items-center gap-2 px-1 py-0.5">
                  <Checkbox
                    checked={settings.columns.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    label={c.label}
                  />
                  <span className="text-[13px] text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Popover>
  )
}
