import { useSyncExternalStore } from "react"
import { NAV } from "../lib/nav"

// ---- sidebar preferences (Circle sidebar-prefs-store port) ----------------
export type BadgeStyle = "count" | "dot"

export interface SidebarPrefs {
  badgeStyle: BadgeStyle
  /** section id → ordered item ids */
  order: Record<string, string[]>
  /** item id → hidden */
  hidden: Record<string, boolean>
}

const STORAGE_KEY = "operator-os-sidebar-prefs"

function defaultPrefs(): SidebarPrefs {
  return {
    badgeStyle: "count",
    order: Object.fromEntries(NAV.map((s) => [s.id, s.items.map((i) => i.id)])),
    hidden: {},
  }
}

function load(): SidebarPrefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPrefs()
    const parsed = JSON.parse(raw) as Partial<SidebarPrefs>
    const base = defaultPrefs()
    return {
      badgeStyle: parsed.badgeStyle === "dot" ? "dot" : "count",
      order: { ...base.order, ...(parsed.order ?? {}) },
      hidden: parsed.hidden ?? {},
    }
  } catch {
    return defaultPrefs()
  }
}

let prefs: SidebarPrefs = load()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

function commit(next: SidebarPrefs) {
  prefs = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  emit()
}

export const sidebarPrefs = {
  get: () => prefs,
  setBadgeStyle: (badgeStyle: BadgeStyle) => commit({ ...prefs, badgeStyle }),
  setHidden: (itemId: string, hidden: boolean) => {
    const next = { ...prefs, hidden: { ...prefs.hidden, [itemId]: hidden } }
    if (!hidden) delete next.hidden[itemId]
    commit(next)
  },
  setOrder: (sectionId: string, ordered: string[]) =>
    commit({ ...prefs, order: { ...prefs.order, [sectionId]: ordered } }),
  reset: () => commit(defaultPrefs()),
}

export function useSidebarPrefs() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => prefs,
  )
}
