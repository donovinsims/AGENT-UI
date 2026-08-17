import { useEffect, useState } from "react"
import { DesktopShell } from "./shell/DesktopShell"
import { MobileShell } from "./shell/MobileShell"
import { CommandMenu } from "./components/CommandMenu"
import { SCREENS } from "./screens"
import { itemById } from "./lib/nav"
import { ThemeProvider } from "./theme/ThemeProvider"
import { ToastProvider } from "./components/Toast"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { CreateModal } from "./components/CreateModal"
import type { CreateKind } from "./store/create"

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const on = () => setMobile(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return mobile
}

export default function App() {
  const [active, setActive] = useState("today")
  const [cmdOpen, setCmdOpen] = useState(false)
  const [createKind, setCreateKind] = useState<CreateKind | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Mobile "Agents" tab has no dedicated route id in SCREENS beyond 'agents'
  const routeId =
    active === "agents" && !SCREENS[active] ? "intelligence" : active
  const Screen = SCREENS[routeId] ?? SCREENS.today
  const navigate = (id: string) => {
    if (SCREENS[id] || itemById(id)) setActive(id)
    setCmdOpen(false)
  }

  const screen = (
    <ErrorBoundary>
      <Screen key={routeId} />
    </ErrorBoundary>
  )

  return (
    <ThemeProvider>
      <ToastProvider>
        {isMobile ? (
          <MobileShell active={active} navigate={navigate}>
            {screen}
          </MobileShell>
        ) : (
          <DesktopShell
            active={active}
            navigate={navigate}
            openCommand={() => setCmdOpen(true)}
          >
            {screen}
          </DesktopShell>
        )}
        <CommandMenu
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          navigate={navigate}
          onCreate={setCreateKind}
        />
        <CreateModal
          open={createKind !== null}
          initialKind={createKind ?? "task"}
          onClose={() => setCreateKind(null)}
          onCreated={(kind) => {
            setCreateKind(null)
            navigate(
              kind === "task"
                ? "tasks"
                : kind === "lead"
                  ? "leads"
                  : kind === "deal"
                    ? "pipeline"
                    : "today",
            )
          }}
        />
      </ToastProvider>
    </ThemeProvider>
  )
}
