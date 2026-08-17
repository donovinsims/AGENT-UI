import { type ReactNode, useState } from "react"
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
  MoreHorizontal,
  GripVertical,
  Eye,
  EyeOff,
  Palette,
  RotateCcw,
} from "lucide-react"
import { NAV, itemById } from "../lib/nav"
import { owner } from "../data/model"
import { IconButton, Kbd, Avatar } from "../components/ui"
import { Tabs } from "../components/form"
import { Dialog, Popover, MenuItem, MenuSeparator } from "../components/overlay"
import { useTheme, type AppTheme } from "../theme/ThemeProvider"
import {
  useSidebarPrefs,
  sidebarPrefs,
  type BadgeStyle,
} from "../store/sidebar-prefs"
import { CreateModal } from "../components/CreateModal"
import type { CreateKind } from "../store/create"

function LinearMark({ size = 24 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[7px] bg-sidebar-accent shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="rounded-full"
        style={{
          width: size * 0.58,
          height: size * 0.58,
          background:
            "conic-gradient(from 210deg, var(--sidebar-foreground) 0 55%, var(--sidebar-primary) 55% 100%)",
        }}
      />
    </span>
  )
}

// ---- Appearance dialog: theme + Circle theme variants + custom theme ---------
const VARIANTS: { id: AppTheme; label: string; hint: string; swatch: string }[] = [
  {
    id: "default",
    label: "Default",
    hint: "System dark / light",
    swatch: "linear-gradient(135deg,#16161b 0 50%,#f5f5f7 50%)",
  },
  {
    id: "pure-light",
    label: "Pure light",
    hint: "Always light",
    swatch: "#ffffff",
  },
  {
    id: "magic-blue",
    label: "Magic blue",
    hint: "Indigo aurora",
    swatch: "linear-gradient(135deg,#191828,#575bc7)",
  },
  {
    id: "classic-dark",
    label: "Classic dark",
    hint: "Warm graphite",
    swatch: "#191a1f",
  },
  {
    id: "custom",
    label: "Custom",
    hint: "Your palette",
    swatch: "conic-gradient(#7c6cf0,#f2f3f5,#7c6cf0)",
  },
]

function AppearanceDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const {
    theme,
    setTheme,
    appTheme,
    setAppTheme,
    customTheme,
    setCustomTheme,
  } = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Appearance"
      width="max-w-[420px]"
    >
      <div className="space-y-4">
        <div>
          <div className="pb-1.5 text-[12px] w-medium text-muted-foreground">
            Theme
          </div>
          <Tabs
            value={theme}
            onChange={setTheme}
            tabs={[
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ]}
          />
        </div>
        <div>
          <div className="pb-1.5 text-[12px] w-medium text-muted-foreground">
            Appearance
          </div>
          <div className="space-y-1">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                onClick={() => setAppTheme(v.id)}
                aria-pressed={appTheme === v.id}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-2 py-1.5 text-left transition-colors ${
                  appTheme === v.id
                    ? "border-ring bg-secondary/60"
                    : "border-border bg-popover hover:bg-secondary"
                }`}
              >
                <span
                  className="h-7 w-7 shrink-0 rounded-md border border-border"
                  style={{ background: v.swatch }}
                />
                <span className="min-w-0">
                  <span className="block text-[13px] w-medium text-foreground">
                    {v.label}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {v.hint}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        {appTheme === "custom" && (
          <div>
            <div className="pb-1.5 text-[12px] w-medium text-muted-foreground">
              Custom palette
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-popover px-2.5 py-2">
              <label className="flex items-center gap-2 text-[13px] text-foreground">
                Accent
                <input
                  type="color"
                  value={customTheme.accent}
                  onChange={(e) =>
                    setCustomTheme({ ...customTheme, accent: e.target.value })
                  }
                  className="h-6 w-9 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Custom accent color"
                />
              </label>
              <label className="ml-auto flex items-center gap-2 text-[13px] text-foreground">
                Dark
                <button
                  role="switch"
                  aria-checked={customTheme.dark}
                  onClick={() =>
                    setCustomTheme({ ...customTheme, dark: !customTheme.dark })
                  }
                  className={`relative h-[18px] w-[30px] rounded-full transition-colors ${
                    customTheme.dark ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] h-[14px] w-[14px] rounded-full transition-[left] ${
                      customTheme.dark
                        ? "left-[14px] bg-primary-foreground"
                        : "left-[2px] bg-muted-foreground"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}

// ---- Customize sidebar: reorder + visibility + badge style --------------------
function CustomizeSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const prefs = useSidebarPrefs()
  const [dragId, setDragId] = useState<string | null>(null)

  const dropOn = (sectionId: string, targetId: string) => {
    if (!dragId || dragId === targetId) return
    const order = [...(prefs.order[sectionId] ?? [])]
    const from = order.indexOf(dragId)
    const to = order.indexOf(targetId)
    if (from === -1 || to === -1) return
    order.splice(from, 1)
    order.splice(to, 0, dragId)
    sidebarPrefs.setOrder(sectionId, order)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Customize sidebar"
      width="max-w-[380px]"
    >
      <div className="flex items-center justify-between pb-3">
        <span className="text-[12px] w-medium text-muted-foreground">
          Badge style
        </span>
        <Tabs
          value={prefs.badgeStyle}
          onChange={(b) => sidebarPrefs.setBadgeStyle(b as BadgeStyle)}
          tabs={[
            { id: "count", label: "Count" },
            { id: "dot", label: "Dot" },
          ]}
        />
      </div>
      <div className="max-h-[320px] space-y-3 overflow-y-auto scroll-quiet">
        {NAV.map((section) => {
          const order =
            prefs.order[section.id] ?? section.items.map((i) => i.id)
          return (
            <div key={section.id}>
              <div className="pb-1 text-[11px] w-medium uppercase tracking-[0.06em] text-muted-foreground">
                {section.label}
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-popover">
                {order.map((id) => {
                  const item = section.items.find((i) => i.id === id)
                  if (!item) return null
                  const hidden = Boolean(prefs.hidden[id])
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={() => setDragId(id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => dropOn(section.id, id)}
                      className={`flex items-center gap-1.5 border-b border-border px-1.5 py-1 last:border-b-0 ${
                        dragId === id ? "bg-secondary opacity-60" : ""
                      } ${hidden ? "opacity-40" : ""}`}
                    >
                      <GripVertical
                        size={13}
                        className="cursor-grab text-muted-foreground/60 active:cursor-grabbing"
                      />
                      <item.icon size={14} className="text-muted-foreground" />
                      <span className="flex-1 truncate text-[13px] text-foreground">
                        {item.label}
                      </span>
                      <button
                        onClick={() => sidebarPrefs.setHidden(id, !hidden)}
                        aria-label={
                          hidden ? `Show ${item.label}` : `Hide ${item.label}`
                        }
                        className="grid h-6 w-6 place-items-center rounded-[5px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <button
        onClick={() => sidebarPrefs.reset()}
        className="mt-3 flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <RotateCcw size={13} /> Reset to defaults
      </button>
    </Dialog>
  )
}

// ---- Sidebar nav item ----------------------------------------------------------
function NavRow({
  icon: Icon,
  label,
  badge,
  active,
  badgeStyle,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  label: string
  badge?: number
  active: boolean
  badgeStyle: BadgeStyle
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center gap-2.5 h-7 px-2 rounded-[6px] text-[13px] w-medium transition-colors duration-100 ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      }`}
    >
      <Icon
        size={16}
        className={
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
        }
      />
      <span className="flex-1 truncate text-left">{label}</span>
      {badge != null &&
        (badgeStyle === "count" ? (
          <span className="grid h-[17px] min-w-[17px] place-items-center rounded-[6px] bg-sidebar-accent px-1 text-[10px] tabular w-medium text-sidebar-foreground/80">
            {badge}
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary/70" />
        ))}
    </button>
  )
}

// ---- Shell -------------------------------------------------------------------
export function DesktopShell({
  active,
  navigate,
  openCommand,
  children,
}: {
  active: string
  navigate: (id: string) => void
  openCommand: () => void
  children: ReactNode
}) {
  const { theme, toggleTheme } = useTheme()
  const prefs = useSidebarPrefs()
  const [createOpen, setCreateOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)

  const current = itemById(active)
  const hiddenItems = NAV.flatMap((s) =>
    (prefs.order[s.id] ?? s.items.map((i) => i.id))
      .filter((id) => prefs.hidden[id])
      .map((id) => ({ id, section: s })),
  )

  const onCreated = (kind: CreateKind) => {
    navigate(
      kind === "task"
        ? "tasks"
        : kind === "lead"
          ? "leads"
          : kind === "deal"
            ? "pipeline"
            : "today",
    )
  }

  return (
    <div className="flex h-svh w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-[232px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        {/* org switcher */}
        <div className="flex h-[52px] items-center gap-2 px-3">
          <LinearMark />
          <button className="flex items-center gap-1 text-[14px] w-semibold text-sidebar-foreground hover:opacity-80">
            Operator OS{" "}
            <ChevronDown size={14} className="text-sidebar-foreground/50" />
          </button>
        </div>

        {/* New */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex h-8 w-full items-center gap-1.5 rounded-md bg-sidebar-primary px-3 text-[13px] w-medium text-sidebar-primary-foreground shadow transition-[background,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            <Plus size={15} /> New
          </button>
        </div>

        {/* nav */}
        <nav
          aria-label="Primary navigation"
          className="flex-1 overflow-y-auto scroll-quiet px-2 pb-3"
        >
          {NAV.map((section) => {
            const order =
              prefs.order[section.id] ?? section.items.map((i) => i.id)
            const visible = order.filter(
              (id) =>
                section.items.some((i) => i.id === id) && !prefs.hidden[id],
            )
            if (!visible.length) return null
            return (
              <div key={section.id} className="mb-2">
                <div className="px-2 pb-1 pt-2">
                  <span className="text-[11px] w-medium uppercase tracking-[0.06em] text-sidebar-foreground/50">
                    {section.label}
                  </span>
                </div>
                {visible.map((id) => {
                  const item = section.items.find((i) => i.id === id)!
                  return (
                    <NavRow
                      key={id}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      active={active === id}
                      badgeStyle={prefs.badgeStyle}
                      onClick={() => navigate(id)}
                    />
                  )
                })}
              </div>
            )
          })}

          {/* More: hidden items + customize */}
          <div className="mb-2">
            <div className="px-2 pb-1 pt-2">
              <span className="text-[11px] w-medium uppercase tracking-[0.06em] text-sidebar-foreground/50">
                More
              </span>
            </div>
            <Popover
              trigger={
                <button className="flex h-7 w-full items-center gap-2.5 rounded-[6px] px-2 text-[13px] w-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground">
                  <MoreHorizontal
                    size={16}
                    className="text-sidebar-foreground/50"
                  />
                  <span className="flex-1 text-left">More</span>
                  {hiddenItems.length > 0 && (
                    <span className="grid h-[17px] min-w-[17px] place-items-center rounded-[6px] bg-sidebar-accent px-1 text-[10px] tabular w-medium text-sidebar-foreground/80">
                      {hiddenItems.length}
                    </span>
                  )}
                </button>
              }
              align="start"
              panelClassName="w-[220px]"
            >
              <div className="p-0.5">
                {hiddenItems.length > 0 ? (
                  hiddenItems.map(({ id, section }) => {
                    const item = section.items.find((i) => i.id === id)!
                    return (
                      <MenuItem key={id} onSelect={() => navigate(id)}>
                        <item.icon
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="flex-1">{item.label}</span>
                      </MenuItem>
                    )
                  })
                ) : (
                  <div className="px-2 py-1.5 text-[12px] text-muted-foreground">
                    All items visible
                  </div>
                )}
                <MenuSeparator />
                <MenuItem onSelect={() => setCustomizeOpen(true)}>
                  <span className="flex-1">Customize sidebar…</span>
                </MenuItem>
              </div>
            </Popover>
          </div>
        </nav>

        {/* footer */}
        <div className="flex h-11 items-center gap-2 border-t border-sidebar-border px-3">
          <Avatar
            name={owner.name}
            color={owner.color}
            initials={owner.initials}
            size={22}
          />
          <div className="min-w-0">
            <div className="truncate text-[12px] w-medium leading-tight text-sidebar-foreground">
              {owner.name}
            </div>
            <div className="text-[10px] leading-tight text-sidebar-foreground/50">
              Owner
            </div>
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            <button
              onClick={() => setAppearanceOpen(true)}
              aria-label="Appearance"
              className="grid h-7 w-7 place-items-center rounded-[6px] text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Palette size={14} />
            </button>
            <button
              aria-label="Help"
              className="grid h-7 w-7 place-items-center rounded-[6px] text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <HelpCircle size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column: Circle rounded inset container */}
      <div className="flex h-full min-w-0 flex-1 lg:p-2">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 bg-container lg:rounded-lg lg:border lg:border-border">
          {/* toolbar */}
          <header className="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-container px-2.5 lg:px-3">
            <IconButton aria-label="Back" onClick={() => window.history.back()}>
              <ChevronLeft size={17} />
            </IconButton>
            <IconButton
              aria-label="Forward"
              onClick={() => window.history.forward()}
              className="opacity-50"
            >
              <ChevronRight size={17} />
            </IconButton>
            <div className="ml-1 flex items-center gap-2 text-[13px] text-foreground">
              {current && (
                <current.icon size={15} className="text-muted-foreground" />
              )}
              <span className="w-medium">
                {current?.label ?? "Operator OS"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${
                  theme === "dark" ? "light" : "dark"
                } theme`}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button
                onClick={openCommand}
                className="hidden h-8 items-center gap-2 rounded-md border border-border bg-popover px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-secondary lg:flex"
              >
                <Search size={14} /> Search <Kbd>⌘K</Kbd>
              </button>
              <IconButton
                onClick={() => setCreateOpen(true)}
                aria-label="New"
                className="text-foreground"
              >
                <Plus size={16} />
              </IconButton>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </div>

      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
      <AppearanceDialog
        open={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
      />
      <CustomizeSidebar
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />
    </div>
  )
}
