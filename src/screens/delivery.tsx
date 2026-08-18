import { useMemo, useState } from "react"
import { Plus, File as FileIcon, Paperclip, BookOpen, Bot } from "lucide-react"
import {
  clients,
  projects,
  tasks,
  files,
  knowledge,
  meetings,
  people,
  PROJECT_STATES,
  TASK_STATES,
  companyById,
  personById,
  projectById,
  type Priority,
  type Project,
  type Task,
  type TaskState,
} from "../data/model"
import {
  Panel,
  Avatar,
  Badge,
  StatusDot,
  PriorityIcon,
  Button,
  Ring,
} from "../components/ui"
import { Page, Row, GroupHeader } from "./parts"
import { useFilters, applyFilters } from "../components/filter"
import { useDisplaySettings, type DisplaySettings } from "../components/display"
import { useCreatedRecords } from "../store/create"
import {
  TASK_FILTER_COLUMNS,
  TASK_GROUP_OPTIONS,
  TASK_ORDER_OPTIONS,
  groupTasks,
} from "./today"
import {
  DetailPanel,
  Field,
  StatusChip,
  PanelSection,
} from "../components/DetailPanel"

// ---------- Clients ----------
export function Clients() {
  return (
    <Page title="Clients" count={clients.length}>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1150px]">
        {clients.map((c) => {
          const proj = projects.filter((p) => p.clientId === c.id)
          return (
            <Panel key={c.id} className="p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="grid place-items-center h-9 w-9 rounded-[10px] text-[13px] w-semibold"
                  style={{ background: "var(--accent)" }}
                >
                  {c.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] w-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {c.industry} · {c.location}
                  </div>
                </div>
                {c.health && <StatusDot color={c.health} />}
              </div>
              <div className="flex items-center justify-between text-[12px] text-muted-foreground pt-2 border-t border-border">
                <span>
                  {proj.length} project{proj.length !== 1 && "s"}
                </span>
                <span>Owner {personById(c.owner)?.name.split(" ")[0]}</span>
              </div>
            </Panel>
          )
        })}
      </div>
    </Page>
  )
}

const PROJECT_FILTER_COLUMNS: import("../components/filter").FilterColumn<import("../data/model").Project>[] =
  [
    {
      id: "state",
      label: "State",
      get: (p) => p.state,
      values: PROJECT_STATES.map((s) => ({
        value: s.id,
        label: s.label,
        dot: <StatusDot color={s.color} ring={s.id !== "completed"} size={8} />,
      })),
    },
    {
      id: "health",
      label: "Health",
      get: (p) => p.health,
      values: ([
        "green",
        "yellow",
        "red",
        "blue",
        "orange",
        "teal",
        "gray",
      ] as const).map((c) => ({
        value: c,
        label: c,
        dot: <StatusDot color={c} size={8} />,
      })),
    },
    {
      id: "lead",
      label: "Lead",
      get: (p) => p.lead,
      values: people.map((p) => ({ value: p.id, label: p.name })),
    },
    { id: "name", label: "Name", get: (p) => p.name },
  ]

function groupProjects(items: Project[], display: DisplaySettings) {
  const sorted = [...items].sort((a, b) => {
    if (display.orderBy === "targetDate")
      return a.targetDate.localeCompare(b.targetDate)
    if (display.orderBy === "progress") return b.progress - a.progress
    return a.ref.localeCompare(b.ref)
  })
  if (!display.groupBy)
    return [
      {
        key: "all",
        label: "All projects",
        dot: null as React.ReactNode,
        stateColor: undefined as string | undefined,
        items: sorted,
      },
    ]
  if (display.groupBy === "health") {
    return (["green", "yellow", "red", "blue", "orange", "gray"] as const).map(
      (c) => ({
        key: c,
        label: c[0].toUpperCase() + c.slice(1),
        dot: <StatusDot color={c} />,
        stateColor: c,
        items: sorted.filter((p) => p.health === c),
      }),
    )
  }
  if (display.groupBy === "lead") {
    const groups: {
      key: string
      label: string
      dot: React.ReactNode
      stateColor?: string
      items: Project[]
    }[] = people.map((p) => ({
      key: p.id,
      label: p.name,
      dot: <Avatar {...p} size={16} />,
      stateColor: undefined,
      items: sorted.filter((pr) => pr.lead === p.id),
    }))
    groups.push({
      key: "unassigned",
      label: "Unassigned",
      dot: null,
      stateColor: undefined,
      items: sorted.filter((p) => !p.lead),
    })
    return groups
  }
  return PROJECT_STATES.map((s) => ({
    key: s.id,
    label: s.label,
    dot: <StatusDot color={s.color} ring={s.id !== "completed"} />,
    stateColor: s.color,
    items: sorted.filter((p) => p.state === s.id),
  }))
}

// ---------- Projects (Board / List / Timeline) ----------
export function Projects() {
  const [filters, setFilters] = useFilters("projects")
  const [openId, setOpenId] = useState<string | null>(null)
  const [display, setDisplay] = useDisplaySettings("projects", {
    groupBy: "state",
    orderBy: "ref",
    showEmptyGroups: false,
    columns: [],
  })
  const filtered = useMemo(
    () => applyFilters(projects, filters, PROJECT_FILTER_COLUMNS),
    [filters],
  )
  const openProject = projects.find((p) => p.id === openId)
  return (
    <Page
      title="Projects"
      count={projects.length}
      views={["List", "Board", "Timeline"]}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New project
        </Button>
      }
      scroll={false}
      filter={{
        filters,
        onChange: setFilters,
        columns: PROJECT_FILTER_COLUMNS,
        items: projects,
      }}
      display={{
        settings: display,
        onChange: setDisplay,
        groupOptions: [
          { id: "state", label: "State" },
          { id: "health", label: "Health" },
          { id: "lead", label: "Lead" },
          { id: "", label: "No grouping" },
        ],
        orderOptions: [
          { id: "ref", label: "Reference" },
          { id: "targetDate", label: "Target date" },
          { id: "progress", label: "Progress" },
        ],
      }}
      panel={
        openProject &&
        (() => {
          const st = PROJECT_STATES.find((s) => s.id === openProject.state)!
          const lead = personById(openProject.lead)
          const client = companyById(openProject.clientId)
          return (
            <DetailPanel
              title={openProject.name}
              refText={openProject.ref}
              onClose={() => setOpenId(null)}
            >
              <PanelSection label="Project">
                <Field label="State">
                  <StatusChip color={st.color} label={st.label} />
                </Field>
                <Field label="Health">
                  <StatusChip
                    color={openProject.health}
                    label={openProject.health}
                  />
                </Field>
                <Field label="Client">{client.name}</Field>
                <Field label="Lead">
                  {lead ? (
                    <>
                      <Avatar {...lead} size={18} />
                      {lead.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
                <Field label="Progress">
                  <span className="flex items-center gap-2">
                    <Ring
                      value={openProject.progress}
                      size={18}
                      color={`var(--color-status-${openProject.health})`}
                    />
                    <span className="tabular">{openProject.progress}%</span>
                  </span>
                </Field>
              </PanelSection>
              <PanelSection label="Schedule">
                <Field label="Start">{openProject.startDate}</Field>
                <Field label="Target">{openProject.targetDate}</Field>
              </PanelSection>
              <PanelSection label="Phases">
                <div className="flex flex-col gap-1 pt-0.5">
                  {openProject.phases.map((ph, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[12px] text-foreground"
                    >
                      <StatusDot
                        color={ph.done ? "green" : "gray"}
                        ring={!ph.done}
                        size={7}
                      />
                      <span
                        className={
                          ph.done ? "text-muted-foreground line-through" : ""
                        }
                      >
                        {ph.name}
                      </span>
                      <span className="ml-auto text-[11px] tabular text-muted-foreground">
                        {ph.start}–{ph.end}%
                      </span>
                    </div>
                  ))}
                </div>
              </PanelSection>
              <PanelSection label="Scope">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {openProject.scope}
                </p>
              </PanelSection>
            </DetailPanel>
          )
        })()
      }
    >
      {(view) =>
        view === "Board" ? (
          <ProjectBoard items={filtered} />
        ) : view === "Timeline" ? (
          <ProjectTimeline items={filtered} />
        ) : (
          <ProjectList items={filtered} display={display} onOpen={setOpenId} />
        )
      }
    </Page>
  )
}

function ProjectList({
  items,
  display,
  onOpen,
}: {
  items: Project[]
  display: DisplaySettings
  onOpen: (id: string) => void
}) {
  const groups = groupProjects(items, display)
  return (
    <div className="h-full overflow-y-auto scroll-quiet">
      {groups.map((g) => (
        <div key={g.key} className="group">
          <GroupHeader color={g.dot} label={g.label} count={g.items.length} />
          {g.items.map((p) => (
            <Row key={p.id} className="!h-[46px]" onClick={() => onOpen(p.id)}>
              <StatusDot color={g.stateColor as any ?? p.health} />
              <span className="text-[12px] tabular text-muted-foreground w-[58px] shrink-0">
                {p.ref}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] w-medium truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {companyById(p.clientId).name}
                </div>
              </div>
              <div className="w-24 hidden md:flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.progress}%`,
                      background: STATUS_HEX(p.health),
                    }}
                  />
                </div>
                <span className="text-[11px] tabular text-muted-foreground">
                  {p.progress}%
                </span>
              </div>
              <span className="text-[12px] text-muted-foreground w-[50px] text-right hidden lg:block">
                {p.targetDate}
              </span>
              <Avatar {...personById(p.lead)!} size={20} />
            </Row>
          ))}
        </div>
      ))}
    </div>
  )
}

function STATUS_HEX(c: string) {
  return `var(--color-status-${c})`
}

function ProjectBoard({ items = projects }: { items?: Project[] }) {
  return (
    <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
      {PROJECT_STATES.map((s) => {
        const columnItems = items.filter((p) => p.state === s.id)
        return (
          <div key={s.id} className="w-[280px] shrink-0">
            <div className="flex items-center gap-2 px-1 pb-2">
              <StatusDot color={s.color} ring={s.id !== "completed"} />
              <span className="text-[13px] w-semibold">{s.label}</span>
              <span className="text-[12px] text-muted-foreground tabular">
                {items.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((p) => (
                <Panel key={p.id} className="p-3 bg-secondary">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] tabular text-muted-foreground">
                      {p.ref}
                    </span>
                    <span className="ml-auto">
                      <StatusDot color={p.health} size={7} />
                    </span>
                  </div>
                  <div className="text-[13px] w-medium mb-1">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mb-2.5">
                    {companyById(p.clientId).name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Ring
                      value={p.progress}
                      size={22}
                      color={STATUS_HEX(p.health)}
                    />
                    <span className="text-[11px] tabular text-muted-foreground">
                      {p.progress}%
                    </span>
                    <Avatar {...personById(p.lead)!} size={18} />
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProjectTimeline({ items = projects }: { items?: Project[] }) {
  const months = ["Aug", "Sep", "Oct"]
  return (
    <div className="h-full overflow-auto scroll-quiet p-4 md:p-6">
      {/* month header (desktop) */}
      <div
        className="hidden md:grid mb-2 pl-[220px]"
        style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
      >
        {months.map((m) => (
          <div
            key={m}
            className="text-[11px] w-medium uppercase tracking-[0.05em] text-muted-foreground border-l border-border pl-2"
          >
            {m}
          </div>
        ))}
      </div>
      {items.map((p) => (
        <div key={p.id} className="mb-4">
          {/* desktop gantt */}
          <div className="hidden md:flex items-center">
            <div className="w-[220px] shrink-0 pr-3">
              <div className="text-[13px] w-medium truncate">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">
                {p.startDate} → {p.targetDate}
              </div>
            </div>
            <div className="relative flex-1 h-8 rounded-[8px] bg-card border border-border overflow-hidden">
              {p.phases.map((ph, i) => (
                <div
                  key={i}
                  className="absolute top-1 bottom-1 rounded-[5px] flex items-center px-2"
                  style={{
                    left: `${ph.start}%`,
                    width: `${ph.end - ph.start}%`,
                    background: ph.done
                      ? "rgba(94,106,210,.35)"
                      : "rgba(94,106,210,.15)",
                    border: "1px solid rgba(94,106,210,.4)",
                  }}
                >
                  <span className="text-[10px] text-muted-foreground truncate">
                    {ph.name}
                  </span>
                </div>
              ))}
              <div
                className="absolute top-0 bottom-0 w-px bg-[var(--color-status-red)]"
                style={{ left: `${p.progress}%` }}
              />
            </div>
          </div>
          {/* mobile vertical phases */}
          <div className="md:hidden">
            <div className="text-[14px] w-medium mb-1">{p.name}</div>
            <div className="pl-2 border-l-2 border-border flex flex-col gap-2 mt-2">
              {p.phases.map((ph, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <StatusDot
                    color={ph.done ? "green" : "gray"}
                    ring={!ph.done}
                  />
                  <span
                    className={
                      ph.done
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground"
                    }
                  >
                    {ph.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------- Tasks ----------
export function Tasks() {
  const [filters, setFilters] = useFilters("tasks")
  const [openId, setOpenId] = useState<string | null>(null)
  const [display, setDisplay] = useDisplaySettings("tasks", {
    groupBy: "state",
    orderBy: "priority",
    showEmptyGroups: false,
    columns: [],
  })
  const created = useCreatedRecords().filter((r) => r.kind === "task")
  const allTasks = useMemo<Task[]>(
    () => [
      ...created.map((r, i) => ({
        id: r.id,
        ref: `NEW-${String(i + 1).padStart(2, "0")}`,
        title: r.title,
        state: r.state as TaskState ?? "backlog",
        priority: r.priority as Priority ?? "none",
        assignee: r.assignee,
        labels: [],
        agentAssigned: false,
      })),
      ...tasks,
    ],
    [created],
  )
  const filtered = useMemo(
    () => applyFilters(allTasks, filters, TASK_FILTER_COLUMNS),
    [allTasks, filters],
  )
  const groups = useMemo(
    () => groupTasks(filtered, display),
    [filtered, display],
  )
  const openTask = allTasks.find((t) => t.id === openId)

  return (
    <Page
      title="Tasks"
      count={allTasks.length}
      views={["List", "Board"]}
      filter={{
        filters,
        onChange: setFilters,
        columns: TASK_FILTER_COLUMNS,
        items: allTasks,
      }}
      display={{
        settings: display,
        onChange: setDisplay,
        groupOptions: TASK_GROUP_OPTIONS,
        orderOptions: TASK_ORDER_OPTIONS,
      }}
      panel={
        openTask &&
        (() => {
          const st = TASK_STATES.find((s) => s.id === openTask.state)!
          const project = openTask.projectId
            ? projectById(openTask.projectId)
            : undefined
          const assignee = openTask.assignee
            ? personById(openTask.assignee)
            : undefined
          return (
            <DetailPanel
              title={openTask.title}
              refText={openTask.ref}
              onClose={() => setOpenId(null)}
              icon={<PriorityIcon priority={openTask.priority} />}
            >
              <PanelSection label="Status">
                <Field label="State">
                  <StatusChip color={st.color} label={st.label} />
                </Field>
                <Field label="Priority">
                  <span className="capitalize">{openTask.priority}</span>
                </Field>
                <Field label="Assignee">
                  {assignee ? (
                    <>
                      <Avatar {...assignee} size={18} />
                      {assignee.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </Field>
              </PanelSection>
              <PanelSection label="Context">
                <Field label="Project">
                  {project ? (
                    project.ref
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
                <Field label="Due">
                  {openTask.due ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
                <Field label="Labels">
                  {openTask.labels.length > 0 ? (
                    openTask.labels.map((l) => <Badge key={l}>{l}</Badge>)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
              </PanelSection>
              {openTask.agentAssigned && (
                <PanelSection label="Automation">
                  <StatusChip color="indigo" label="Agent assigned" />
                </PanelSection>
              )}
            </DetailPanel>
          )
        })()
      }
    >
      {(view) =>
        view === "Board" ? (
          <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
            {TASK_STATES.map((s) => {
              const items = filtered.filter((t) => t.state === s.id)
              return (
                <div key={s.id} className="w-[264px] shrink-0">
                  <div className="flex items-center gap-2 px-1 pb-2">
                    <StatusDot color={s.color} ring={s.id !== "done"} />
                    <span className="text-[13px] w-semibold">{s.label}</span>
                    <span className="text-[12px] text-muted-foreground tabular">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map((t) => (
                      <Panel key={t.id} className="p-2.5 bg-secondary">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] tabular text-muted-foreground">
                            {t.ref}
                          </span>
                          {t.agentAssigned && (
                            <Badge color="indigo" className="ml-auto">
                              agent
                            </Badge>
                          )}
                        </div>
                        <div className="text-[13px] w-medium mb-2">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PriorityIcon priority={t.priority} />
                          {t.projectId && (
                            <span className="text-[11px] text-muted-foreground truncate">
                              {projectById(t.projectId).ref}
                            </span>
                          )}
                          {t.assignee && (
                            <span className="ml-auto">
                              <Avatar {...personById(t.assignee)!} size={18} />
                            </span>
                          )}
                        </div>
                      </Panel>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            {groups.map((g) => (
              <div key={g.key} className="group">
                <GroupHeader
                  color={g.dot}
                  label={g.label}
                  count={g.items.length}
                />
                {g.items.map((t) => (
                  <Row key={t.id} onClick={() => setOpenId(t.id)}>
                    <PriorityIcon priority={t.priority} />
                    <StatusDot
                      color={g.stateColor ?? "gray"}
                      ring={g.stateColor ? g.stateColor !== "green" : true}
                    />
                    <span className="text-[12px] tabular text-muted-foreground w-[78px] shrink-0">
                      {t.ref}
                    </span>
                    <span
                      className="text-[13px] truncate flex-1"
                      title={t.title}
                    >
                      {t.title}
                    </span>
                    {t.agentAssigned && <Badge color="indigo">agent</Badge>}
                    {t.labels.map((l) => (
                      <Badge key={l} className="hidden lg:inline-flex">
                        {l}
                      </Badge>
                    ))}
                    {t.due && (
                      <span
                        className={`text-[12px] w-[56px] text-right ${
                          t.due === "Blocked"
                            ? "text-[var(--color-status-red)]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {t.due}
                      </span>
                    )}
                    {t.assignee ? (
                      <Avatar {...personById(t.assignee)!} size={20} />
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-dashed border-input" />
                    )}
                  </Row>
                ))}
              </div>
            ))}
          </div>
        )
      }
    </Page>
  )
}

// ---------- Calendar ----------
export function Calendar() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1)
  const firstOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const eventDate = (when: string) => {
    if (when.startsWith("Today")) return today.getDate()
    if (when.startsWith("Tomorrow"))
      return new Date(year, month, today.getDate() + 1).getDate()
    const found = when.match(/^([A-Z][a-z]{2}) (\d{1,2})/)
    if (!found) return null
    const eventMonth = new Date(`${found[1]} 1, ${year}`).getMonth()
    return eventMonth === month ? Number(found[2]) : null
  }
  const events = meetings.reduce<Record<number, {
    label: string
    color: string
  }[]>>((result, meeting) => {
    const date = eventDate(meeting.when)
    if (date)
      (result[date] ??= []).push({
        label: meeting.title,
        color:
          meeting.type === "Client"
            ? "green"
            : meeting.type === "Demo"
              ? "indigo"
              : "blue",
      })
    return result
  }, {})
  return (
    <Page title="Calendar" views={["Month", "Week", "Agenda"]}>
      <div className="p-4 md:p-6">
        <h2 className="mb-3 text-[15px] w-semibold">
          {first.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </h2>
        <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-[12px] overflow-hidden border border-border">
          {days.map((d) => (
            <div
              key={d}
              className="bg-card px-2 py-1.5 text-[11px] w-medium uppercase tracking-[0.05em] text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {Array.from({
            length: Math.ceil((firstOffset + daysInMonth) / 7) * 7,
          }).map((_, i) => {
            const date = i - firstOffset + 1
            const inMonth = date >= 1 && date <= daysInMonth
            const evs = events[date] || []
            const isToday = date === today.getDate()
            return (
              <div key={i} className="bg-container min-h-[92px] p-1.5">
                <div
                  className={`text-[12px] tabular mb-1 ${
                    isToday
                      ? "grid place-items-center h-5 w-5 rounded-full bg-sidebar-primary text-sidebar-primary-foreground"
                      : inMonth
                        ? "text-muted-foreground"
                        : "text-muted-foreground opacity-40"
                  }`}
                >
                  {inMonth ? date : ""}
                </div>
                <div className="flex flex-col gap-1">
                  {evs.map((e, j) => (
                    <div
                      key={j}
                      className="text-[10px] px-1 py-0.5 rounded truncate"
                      style={{
                        background: `color-mix(in srgb, var(--color-status-${e.color}) 18%, transparent)`,
                        color: `var(--color-status-${e.color})`,
                      }}
                    >
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Page>
  )
}

// ---------- Files ----------
export function Files() {
  return (
    <Page
      title="Files"
      count={files.length}
      actions={
        <Button size="sm" variant="primary">
          <Paperclip size={14} /> Upload
        </Button>
      }
    >
      <div>
        <div className="flex items-center gap-3 h-9 px-4 md:px-5 text-[11px] uppercase tracking-[0.05em] text-muted-foreground w-medium border-b border-border">
          <span className="flex-1">Name</span>
          <span className="w-[90px] hidden md:block">Linked to</span>
          <span className="w-[70px] hidden lg:block">Size</span>
          <span className="w-[80px]">Owner</span>
          <span className="w-[52px] text-right">Updated</span>
        </div>
        {files.map((f) => (
          <Row key={f.id}>
            <FileIcon size={15} className="text-muted-foreground shrink-0" />
            <span className="text-[13px] w-medium truncate flex-1">
              {f.name}
            </span>
            <span className="w-[90px] hidden md:block">
              <Badge>{f.linkedTo}</Badge>
            </span>
            <span className="w-[70px] text-[12px] text-muted-foreground hidden lg:block tabular">
              {f.size}
            </span>
            <span className="w-[80px]">
              <Avatar {...personById(f.owner)!} size={20} />
            </span>
            <span className="w-[52px] text-[12px] text-muted-foreground text-right">
              {f.updatedAt}
            </span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Knowledge ----------
export function Knowledge() {
  const catColor: Record<string, string> = {
    SOP: "blue",
    Playbook: "green",
    Template: "teal",
    Offer: "yellow",
    "Agent Instruction": "indigo",
  }
  return (
    <Page
      title="Knowledge"
      count={knowledge.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New doc
        </Button>
      }
    >
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1100px]">
        {knowledge.map((k) => (
          <Panel key={k.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center h-8 w-8 rounded-[8px] bg-secondary text-muted-foreground">
                <BookOpen size={16} />
              </span>
              <Badge color={catColor[k.category] as never} className="ml-auto">
                {k.category}
              </Badge>
            </div>
            <div className="text-[14px] w-medium mb-1">{k.title}</div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground mt-2 pt-2 border-t border-border">
              <span>Updated {k.updatedAt}</span>
              {k.attachedAgents > 0 && (
                <span className="ml-auto flex items-center gap-1">
                  <Bot size={12} /> {k.attachedAgents}
                </span>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </Page>
  )
}
