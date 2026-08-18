import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

export type Theme = "dark" | "light"
export type AppTheme = "default" | "pure-light" | "magic-blue" | "classic-dark" | "custom"

/** Circle-style fully custom theme — CSS vars generated at runtime. */
export interface CustomTheme {
  dark: boolean
  background: string
  foreground: string
  container: string
  sidebar: string
  sidebarForeground: string
  accent: string
  primary: string
  primaryForeground: string
  border: string
  secondary: string
  mutedForeground: string
}

export const CUSTOM_THEME_KEYS: (keyof CustomTheme)[] = [
  "dark",
  "background",
  "foreground",
  "container",
  "sidebar",
  "sidebarForeground",
  "accent",
  "primary",
  "primaryForeground",
  "border",
  "secondary",
  "mutedForeground",
]

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  appTheme: AppTheme
  setAppTheme: (theme: AppTheme) => void
  customTheme: CustomTheme
  setCustomTheme: (theme: CustomTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE = {
  theme: "operator-os-theme",
  appTheme: "operator-os-app-theme",
  custom: "operator-os-custom-theme",
}

const DEFAULT_CUSTOM: CustomTheme = {
  dark: true,
  background: "#0f0f12",
  foreground: "#f2f3f5",
  container: "#16161b",
  sidebar: "#1c1c23",
  sidebarForeground: "#f2f3f5",
  accent: "#7c6cf0",
  primary: "#f2f3f5",
  primaryForeground: "#17171c",
  border: "#26262e",
  secondary: "#26262e",
  mutedForeground: "#9a9ba3",
}

function initialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = window.localStorage.getItem(STORAGE.theme)
  if (stored === "dark" || stored === "light") return stored
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark"
}

function initialAppTheme(): AppTheme {
  const stored =
    typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE.appTheme)
      : null
  return stored === "pure-light" ||
    stored === "magic-blue" ||
    stored === "classic-dark" ||
    stored === "custom"
    ? stored
    : "default"
}

function initialCustomTheme(): CustomTheme {
  try {
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE.custom)
        : null
    if (!raw) return DEFAULT_CUSTOM
    const parsed = JSON.parse(raw) as Partial<CustomTheme>
    return { ...DEFAULT_CUSTOM, ...parsed }
  } catch {
    return DEFAULT_CUSTOM
  }
}

/** Applies a custom theme's CSS vars to <html> (mounted inside ThemeProvider). */
export function ThemeApplier({ theme }: { theme: CustomTheme }) {
  useEffect(() => {
    const root = document.documentElement
    const vars: [string, string][] = [
      ["--background", theme.background],
      ["--foreground", theme.foreground],
      ["--container", theme.container],
      ["--sidebar", theme.sidebar],
      ["--sidebar-foreground", theme.sidebarForeground],
      ["--sidebar-accent", theme.secondary],
      ["--sidebar-border", theme.border],
      ["--sidebar-primary", theme.accent],
      ["--card", theme.container],
      ["--card-foreground", theme.foreground],
      ["--popover", theme.sidebar],
      ["--popover-foreground", theme.foreground],
      ["--primary", theme.primary],
      ["--primary-foreground", theme.primaryForeground],
      ["--secondary", theme.secondary],
      ["--secondary-foreground", theme.foreground],
      ["--accent", theme.secondary],
      ["--accent-foreground", theme.foreground],
      ["--muted", theme.secondary],
      ["--muted-foreground", theme.mutedForeground],
      ["--border", theme.border],
      ["--input", theme.border],
      ["--ring", theme.accent],
      ["--chart-1", theme.accent],
      ["--chart-2", theme.accent],
      ["--chart-3", theme.accent],
      ["--chart-4", theme.accent],
      ["--chart-5", theme.accent],
    ]
    for (const [key, value] of vars) root.style.setProperty(key, value)
    root.style.colorScheme = theme.dark ? "dark" : "light"
    return () => {
      for (const [key] of vars) root.style.removeProperty(key)
    }
  }, [theme])
  return null
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [appTheme, setAppThemeState] = useState<AppTheme>(initialAppTheme)
  const [customTheme, setCustomThemeState] =
    useState<CustomTheme>(initialCustomTheme)

  const apply = (next: Theme, variant: AppTheme) => {
    document.documentElement.classList.add("theme-switching")
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.dataset.theme = next
    document.documentElement.dataset.appTheme =
      variant === "default" ? "" : variant
    requestAnimationFrame(() =>
      document.documentElement.classList.remove("theme-switching"),
    )
  }

  const setTheme = (next: Theme) => {
    apply(next, appTheme)
    window.localStorage.setItem(STORAGE.theme, next)
    setThemeState(next)
  }

  const setAppTheme = (next: AppTheme) => {
    apply(theme, next)
    window.localStorage.setItem(STORAGE.appTheme, next)
    setAppThemeState(next)
  }

  const setCustomTheme = (next: CustomTheme) => {
    setCustomThemeState(next)
    window.localStorage.setItem(STORAGE.custom, JSON.stringify(next))
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.appTheme =
      appTheme === "default" ? "" : appTheme
    document.documentElement.style.colorScheme = theme
  }, [theme, appTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
        appTheme,
        setAppTheme,
        customTheme,
        setCustomTheme,
      }}
    >
      {appTheme === "custom" && <ThemeApplier theme={customTheme} />}
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error("useTheme must be used within ThemeProvider")
  return value
}
