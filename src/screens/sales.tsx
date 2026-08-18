import { useMemo, useState } from "react"
import { Plus, TrendingUp, MoreHorizontal, Video, FileText } from "lucide-react"
import {
  leads,
  companies,
  contacts,
  opportunities,
  meetings,
  proposals,
  outreach,
  services,
  people,
  STAGES,
  companyById,
  contactById,
  personById,
  fmtMoney,
  type Opportunity,
  type StageId,
  type Priority,
} from "../data/model"
import {
  Panel,
  Avatar,
  Badge,
  StatusDot,
  PriorityIcon,
  Button,
  SectionLabel,
  Ring,
} from "../components/ui"
import { Page, Row, GroupHeader } from "./parts"
import {
  useFilters,
  applyFilters,
  type FilterColumn,
} from "../components/filter"
import { useDisplaySettings, type DisplaySettings } from "../components/display"
import { useCreatedRecords } from "../store/create"
import {
  DetailPanel,
  Field,
  StatusChip,
  PanelSection,
} from "../components/DetailPanel"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
}

const OPP_FILTER_COLUMNS: FilterColumn<Opportunity>[] = [
  {
    id: "stage",
    label: "Stage",
    get: (o) => o.stage,
    values: STAGES.map((s) => ({
      value: s.id,
      label: s.label,
      dot: (
        <StatusDot
          color={s.color}
          ring={!["won", "lost"].includes(s.id)}
          size={8}
        />
      ),
    })),
  },
  {
    id: "priority",
    label: "Priority",
    get: (o) => o.priority,
    values: (Object.keys(PRIORITY_ORDER) as Priority[]).map((p) => ({
      value: p,
      label: p,
    })),
  },
  {
    id: "owner",
    label: "Owner",
    get: (o) => o.owner,
    values: people.map((p) => ({ value: p.id, label: p.name })),
  },
  { id: "title", label: "Title", get: (o) => o.title },
]

// ---------- Sales Overview ----------
export function SalesOverview() {
  const open = opportunities.filter((o) => !["won", "lost"].includes(o.stage))
  const byStage = STAGES.filter((s) => !["won", "lost"].includes(s.id)).map(
    (s) => ({
      ...s,
      items: open.filter((o) => o.stage === s.id),
      value: open
        .filter((o) => o.stage === s.id)
        .reduce((a, o) => a + o.value, 0),
    }),
  )
  const won = opportunities.filter((o) => o.stage === "won")
  return (
    <div className="h-full overflow-y-auto scroll-quiet px-4 md:px-8 py-6 max-w-[1180px] mx-auto">
      <h1 className="text-[20px] title mb-5">Sales Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            l: "Open pipeline",
            v: fmtMoney(open.reduce((a, o) => a + o.value, 0)),
            s: `${open.length} deals`,
            c: "var(--sidebar-primary)",
          },
          {
            l: "Weighted forecast",
            v: fmtMoney(
              Math.round(open.reduce((a, o) => a + o.value, 0) * 0.42),
            ),
            s: "this quarter",
            c: "var(--color-status-blue)",
          },
          {
            l: "Won QTD",
            v: fmtMoney(won.reduce((a, o) => a + o.value, 0)),
            s: `${won.length} deals`,
            c: "var(--color-status-green)",
          },
          {
            l: "Win rate",
            v: "58%",
            s: "last 90 days",
            c: "var(--color-status-teal)",
          },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <div className="text-[11px] uppercase tracking-[0.05em] text-muted-foreground w-medium mb-1">
              {k.l}
            </div>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>
              {k.v}
            </div>
            <div className="text-[12px] text-muted-foreground">{k.s}</div>
          </Panel>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel className="p-4">
          <SectionLabel className="mb-4">Pipeline by stage</SectionLabel>
          <div className="h-52" aria-label="Pipeline value by stage">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStage} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={76}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => fmtMoney(Number(value ?? 0))}
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--sidebar-primary)"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="p-4">
          <SectionLabel className="mb-4">Leaderboard</SectionLabel>
          <div className="flex flex-col gap-1">
            {["u_jori", "u_zoe", "u_owner"].map((id, i) => (
              <div
                key={id}
                className="flex items-center gap-3 h-10 px-2 rounded-[6px] hover:bg-secondary"
              >
                <span className="text-[12px] tabular text-muted-foreground w-4">
                  {i + 1}
                </span>
                <Avatar {...personById(id)!} size={22} />
                <span className="text-[13px] w-medium flex-1">
                  {personById(id)!.name}
                </span>
                <span className="text-[13px] tabular w-medium">
                  {fmtMoney([84000, 66000, 42000][i])}
                </span>
                <Ring value={[72, 58, 40][i]} size={26} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

const LEAD_STAGES = [
  { id: "new", label: "New", color: "gray" as const },
  { id: "researching", label: "Researching", color: "blue" as const },
  { id: "contacted", label: "Contacted", color: "yellow" as const },
  { id: "qualified", label: "Qualified", color: "green" as const },
  { id: "disqualified", label: "Disqualified", color: "red" as const },
]

const LEAD_FILTER_COLUMNS: FilterColumn<import("../data/model").Lead>[] = [
  {
    id: "stage",
    label: "Stage",
    get: (l) => l.stage,
    values: LEAD_STAGES.map((s) => ({
      value: s.id,
      label: s.label,
      dot: <StatusDot color={s.color} ring size={8} />,
    })),
  },
  {
    id: "source",
    label: "Source",
    get: (l) => l.source,
    values: [...new Set(leads.map((l) => l.source))].map((s) => ({
      value: s,
      label: s,
    })),
  },
  {
    id: "owner",
    label: "Owner",
    get: (l) => l.owner,
    values: people.map((p) => ({ value: p.id, label: p.name })),
  },
  { id: "name", label: "Name", get: (l) => l.name },
]

// ---------- Leads ----------
export function Leads() {
  const [filters, setFilters] = useFilters("leads")
  const [openId, setOpenId] = useState<string | null>(null)
  const [display, setDisplay] = useDisplaySettings("leads", {
    groupBy: "stage",
    orderBy: "score",
    showEmptyGroups: false,
    columns: [],
  })
  const created = useCreatedRecords().filter((r) => r.kind === "lead")
  const allLeads = useMemo<import("../data/model").Lead[]>(
    () => [
      ...created.map((r, i) => ({
        id: r.id,
        name: r.title,
        company: "New inbound",
        title: r.assignee
          ? personById(r.assignee)?.name.split(" ")[0] + "'s lead"
          : "New lead",
        source: "Created",
        score: 35,
        stage: (r.state ?? "new") as import("../data/model").Lead["stage"],
        owner:
          r.assignee ?? people.find((p) => p.id === "me")?.id ?? people[0].id,
        createdAt: "Today",
        evidence: r.detail,
      })),
      ...leads,
    ],
    [created],
  )
  const filtered = useMemo(
    () => applyFilters(allLeads, filters, LEAD_FILTER_COLUMNS),
    [allLeads, filters],
  )

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        display.orderBy === "createdAt"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.score - a.score,
      ),
    [filtered, display],
  )
  const openLead = allLeads.find((l) => l.id === openId)

  return (
    <Page
      title="Leads"
      count={allLeads.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New lead
        </Button>
      }
      filter={{
        filters,
        onChange: setFilters,
        columns: LEAD_FILTER_COLUMNS,
        items: allLeads,
      }}
      display={{
        settings: display,
        onChange: setDisplay,
        groupOptions: [
          { id: "stage", label: "Stage" },
          { id: "source", label: "Source" },
          { id: "owner", label: "Owner" },
          { id: "", label: "No grouping" },
        ],
        orderOptions: [
          { id: "score", label: "Score" },
          { id: "createdAt", label: "Created" },
        ],
      }}
      panel={
        openLead &&
        (() => {
          const st = LEAD_STAGES.find((s) => s.id === openLead.stage)!
          const owner = personById(openLead.owner)
          return (
            <DetailPanel title={openLead.name} onClose={() => setOpenId(null)}>
              <PanelSection label="Lead">
                <Field label="Stage">
                  <StatusChip color={st.color} label={st.label} />
                </Field>
                <Field label="Score">
                  <span className="tabular w-medium">{openLead.score}</span>
                </Field>
                <Field label="Source">
                  <Badge>{openLead.source}</Badge>
                </Field>
              </PanelSection>
              <PanelSection label="Context">
                <Field label="Company">{openLead.company}</Field>
                <Field label="Role">{openLead.title}</Field>
                <Field label="Owner">
                  {owner ? (
                    <>
                      <Avatar {...owner} size={18} />
                      {owner.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
                <Field label="Created">{openLead.createdAt}</Field>
              </PanelSection>
              {openLead.evidence && (
                <PanelSection label="Signal">
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    {openLead.evidence}
                  </p>
                </PanelSection>
              )}
            </DetailPanel>
          )
        })()
      }
    >
      <div>
        {display.groupBy === "stage" &&
          LEAD_STAGES.map((st) => {
            const items = sorted.filter((l) => l.stage === st.id)
            if (!items.length && !display.showEmptyGroups) return null
            return (
              <div key={st.id} className="group">
                <GroupHeader
                  color={<StatusDot color={st.color} ring />}
                  label={st.label}
                  count={items.length}
                />
                {items.map((l) => (
                  <Row key={l.id} onClick={() => setOpenId(l.id)}>
                    <span
                      className="grid place-items-center h-4 w-8 rounded-[4px] text-[10px] w-bold tabular shrink-0"
                      style={{
                        background:
                          l.score >= 70
                            ? "rgba(39,166,68,.15)"
                            : l.score >= 45
                              ? "rgba(240,191,0,.15)"
                              : "rgba(98,102,109,.15)",
                        color:
                          l.score >= 70
                            ? "var(--color-status-green)"
                            : l.score >= 45
                              ? "var(--color-status-yellow)"
                              : "var(--muted-foreground)",
                      }}
                    >
                      {l.score}
                    </span>
                    <span
                      className="text-[13px] w-medium truncate"
                      title={l.name}
                    >
                      {l.name}
                    </span>
                    <span
                      className="text-[13px] text-muted-foreground truncate"
                      title={l.company}
                    >
                      {l.company}
                    </span>
                    <span
                      className="text-[12px] text-muted-foreground hidden md:inline truncate flex-1"
                      title={l.evidence || l.title}
                    >
                      {l.evidence || l.title}
                    </span>
                    <Badge className="ml-auto shrink-0">{l.source}</Badge>
                    <span className="text-[12px] text-muted-foreground w-[52px] text-right shrink-0">
                      {l.createdAt}
                    </span>
                    <Avatar {...personById(l.owner)!} size={20} />
                  </Row>
                ))}
              </div>
            )
          })}
        {display.groupBy === "source" &&
          [...new Set(sorted.map((l) => l.source))].map((src) => {
            const items = sorted.filter((l) => l.source === src)
            if (!items.length) return null
            return (
              <div key={src} className="group">
                <GroupHeader label={src} count={items.length} />
                {items.map((l) => (
                  <Row key={l.id} onClick={() => setOpenId(l.id)}>
                    <span
                      className="text-[13px] w-medium truncate"
                      title={l.name}
                    >
                      {l.name}
                    </span>
                    <span className="text-[13px] text-muted-foreground truncate flex-1">
                      {l.company}
                    </span>
                    <span className="text-[12px] tabular text-muted-foreground shrink-0">
                      {l.score}
                    </span>
                    <Avatar {...personById(l.owner)!} size={20} />
                  </Row>
                ))}
              </div>
            )
          })}
        {display.groupBy === "owner" &&
          people.map((p) => {
            const items = sorted.filter((l) => l.owner === p.id)
            if (!items.length && !display.showEmptyGroups) return null
            return (
              <div key={p.id} className="group">
                <GroupHeader
                  color={<Avatar {...p} size={16} />}
                  label={p.name}
                  count={items.length}
                />
                {items.map((l) => (
                  <Row key={l.id} onClick={() => setOpenId(l.id)}>
                    <span
                      className="text-[13px] w-medium truncate"
                      title={l.name}
                    >
                      {l.name}
                    </span>
                    <span className="text-[13px] text-muted-foreground truncate flex-1">
                      {l.company}
                    </span>
                    <Badge className="ml-auto shrink-0">{l.source}</Badge>
                    <span className="text-[12px] tabular text-muted-foreground shrink-0">
                      {l.score}
                    </span>
                  </Row>
                ))}
              </div>
            )
          })}
        {!display.groupBy &&
          sorted.map((l) => (
            <Row key={l.id} onClick={() => setOpenId(l.id)}>
              <span
                className="grid place-items-center h-4 w-8 rounded-[4px] text-[10px] w-bold tabular shrink-0"
                style={{
                  background:
                    l.score >= 70
                      ? "rgba(39,166,68,.15)"
                      : l.score >= 45
                        ? "rgba(240,191,0,.15)"
                        : "rgba(98,102,109,.15)",
                  color:
                    l.score >= 70
                      ? "var(--color-status-green)"
                      : l.score >= 45
                        ? "var(--color-status-yellow)"
                        : "var(--muted-foreground)",
                }}
              >
                {l.score}
              </span>
              <span className="text-[13px] w-medium truncate" title={l.name}>
                {l.name}
              </span>
              <span
                className="text-[13px] text-muted-foreground truncate"
                title={l.company}
              >
                {l.company}
              </span>
              <span
                className="text-[12px] text-muted-foreground hidden md:inline truncate flex-1"
                title={l.evidence || l.title}
              >
                {l.evidence || l.title}
              </span>
              <Badge className="ml-auto shrink-0">{l.source}</Badge>
              <span className="text-[12px] text-muted-foreground w-[52px] text-right shrink-0">
                {l.createdAt}
              </span>
              <Avatar {...personById(l.owner)!} size={20} />
            </Row>
          ))}
      </div>
    </Page>
  )
}

// ---------- Companies ----------
export function Companies() {
  return (
    <Page
      title="Companies"
      count={companies.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> Add
        </Button>
      }
    >
      <div>
        <div className="flex items-center gap-3 h-9 px-4 md:px-5 text-[11px] uppercase tracking-[0.05em] text-muted-foreground w-medium border-b border-border">
          <span className="flex-1">Company</span>
          <span className="w-[120px] hidden md:block">Industry</span>
          <span className="w-[90px] hidden lg:block">Size</span>
          <span className="w-[120px] hidden lg:block">Lifecycle</span>
          <span className="w-[70px]">Health</span>
          <span className="w-6" />
        </div>
        {companies.map((c) => (
          <Row key={c.id}>
            <span
              className="grid place-items-center h-6 w-6 rounded-[6px] text-[11px] w-semibold shrink-0"
              style={{
                background: "var(--accent)",
                color: "var(--muted-foreground)",
              }}
            >
              {c.name[0]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] w-medium truncate">{c.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {c.domain} · {c.location}
              </div>
            </div>
            <span className="w-[120px] text-[12px] text-muted-foreground hidden md:block truncate">
              {c.industry}
            </span>
            <span className="w-[90px] text-[12px] text-muted-foreground hidden lg:block">
              {c.size}
            </span>
            <span className="w-[120px] hidden lg:block">
              <Badge
                color={
                  c.lifecycle === "active_client"
                    ? "green"
                    : c.lifecycle === "prospect"
                      ? "blue"
                      : "gray"
                }
              >
                {c.lifecycle.replace("_", " ")}
              </Badge>
            </span>
            <span className="w-[70px]">
              {c.health && <StatusDot color={c.health} />}
            </span>
            <button className="w-6 grid place-items-center text-muted-foreground hover:text-muted-foreground">
              <MoreHorizontal size={15} />
            </button>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Contacts ----------
export function Contacts() {
  return (
    <Page
      title="Contacts"
      count={contacts.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> Add
        </Button>
      }
    >
      <div>
        {contacts.map((c) => (
          <Row key={c.id}>
            <Avatar {...c} size={24} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] w-medium truncate" title={c.name}>
                {c.name}
              </div>
              <div
                className="text-[11px] text-muted-foreground truncate"
                title={`${c.title} · ${companyById(c.companyId).name}`}
              >
                {c.title} · {companyById(c.companyId).name}
              </div>
            </div>
            <span
              className="text-[12px] text-muted-foreground hidden md:block truncate w-[200px]"
              title={c.email}
            >
              {c.email}
            </span>
            <span className="text-[12px] text-muted-foreground hidden lg:block tabular w-[130px]">
              {c.phone}
            </span>
            <span className="text-[12px] text-muted-foreground w-[60px] text-right">
              {c.lastTouch}
            </span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Pipeline (Board / List / Forecast) ----------
export function Pipeline() {
  const [filters, setFilters] = useFilters("pipeline")
  const [openId, setOpenId] = useState<string | null>(null)
  const [display, setDisplay] = useDisplaySettings("pipeline", {
    groupBy: "stage",
    orderBy: "value",
    showEmptyGroups: false,
    columns: [],
  })
  const created = useCreatedRecords().filter((r) => r.kind === "deal")
  const allOpps = useMemo<Opportunity[]>(
    () => [
      ...created.map((r, i) => ({
        id: r.id,
        ref: `OPP-${String(101 + i)}`,
        title: r.title,
        companyId: companies[0].id,
        contactId: contacts[0].id,
        stage: (r.state ?? "new") as StageId,
        value: r.value ?? 12000,
        priority: r.priority as Priority ?? "medium",
        owner: r.assignee ?? people[0].id,
        closeDate: "Q4",
        nextAction: "Qualify",
        service: "Growth",
        labels: [],
      })),
      ...opportunities,
    ],
    [created],
  )
  const filtered = useMemo(
    () => applyFilters(allOpps, filters, OPP_FILTER_COLUMNS),
    [allOpps, filters],
  )

  const [moves, setMoves] = useState<Record<string, StageId>>({})
  const [drag, setDrag] = useState<{ id: string; from: StageId } | null>(null)

  const stageOf = (o: Opportunity) => moves[o.id] ?? o.stage

  const move = (id: string, from: StageId, to: StageId) => {
    if (from === to) return
    setMoves((m) => ({ ...m, [id]: to }))
  }

  const boardItems = useMemo(() => {
    return STAGES.map((s) => ({
      stage: s,
      items: filtered.filter((o) => stageOf(o) === s.id),
    }))
  }, [filtered, moves])

  const openOpp = allOpps.find((o) => o.id === openId)

  return (
    <Page
      title="Pipeline"
      count={allOpps.length}
      views={["Board", "List", "Forecast"]}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New
        </Button>
      }
      scroll={false}
      filter={{
        filters,
        onChange: setFilters,
        columns: OPP_FILTER_COLUMNS,
        items: allOpps,
      }}
      display={{
        settings: display,
        onChange: setDisplay,
        groupOptions: [
          { id: "stage", label: "Stage" },
          { id: "priority", label: "Priority" },
          { id: "owner", label: "Owner" },
          { id: "", label: "No grouping" },
        ],
        orderOptions: [
          { id: "value", label: "Value" },
          { id: "priority", label: "Priority" },
          { id: "closeDate", label: "Close date" },
        ],
      }}
      panel={
        openOpp &&
        (() => {
          const st = STAGES.find((s) => s.id === stageOf(openOpp))!
          const owner = personById(openOpp.owner)
          const company = companyById(openOpp.companyId)
          return (
            <DetailPanel
              title={openOpp.title}
              refText={openOpp.ref}
              onClose={() => setOpenId(null)}
              icon={<PriorityIcon priority={openOpp.priority} />}
            >
              <PanelSection label="Deal">
                <Field label="Stage">
                  <StatusChip color={st.color} label={st.label} />
                </Field>
                <Field label="Value">
                  <span className="tabular w-medium">
                    {fmtMoney(openOpp.value)}
                  </span>
                </Field>
                {openOpp.atRisk && (
                  <Field label="Flag">
                    <StatusChip color="red" label="At risk" />
                  </Field>
                )}
                <Field label="Priority">
                  <span className="capitalize">{openOpp.priority}</span>
                </Field>
              </PanelSection>
              <PanelSection label="Context">
                <Field label="Company">{company.name}</Field>
                <Field label="Owner">
                  {owner ? (
                    <>
                      <Avatar {...owner} size={18} />
                      {owner.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
                <Field label="Close">{openOpp.closeDate}</Field>
                <Field label="Next action">{openOpp.nextAction}</Field>
                <Field label="Service">{openOpp.service}</Field>
                <Field label="Labels">
                  {openOpp.labels.length > 0 ? (
                    openOpp.labels.map((l) => <Badge key={l}>{l}</Badge>)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Field>
              </PanelSection>
            </DetailPanel>
          )
        })()
      }
    >
      {(view) =>
        view === "List" ? (
          <PipelineList items={filtered} display={display} onOpen={setOpenId} />
        ) : view === "Forecast" ? (
          <PipelineForecast items={filtered} />
        ) : (
          <div className="h-full overflow-x-auto scroll-quiet flex gap-3 p-4">
            {boardItems.map(({ stage: s, items }) => (
              <div
                key={s.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (drag) move(drag.id, drag.from, s.id)
                  setDrag(null)
                }}
                className="w-[272px] shrink-0 flex flex-col"
              >
                <div className="flex items-center gap-2 px-1 pb-2">
                  <StatusDot
                    color={s.color}
                    ring={!["won", "lost"].includes(s.id)}
                  />
                  <span className="text-[13px] w-semibold">{s.label}</span>
                  <span className="text-[12px] text-muted-foreground tabular">
                    {items.length}
                  </span>
                  <span className="ml-auto text-[11px] tabular text-muted-foreground">
                    {fmtMoney(items.reduce((a, o) => a + o.value, 0))}
                  </span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto scroll-quiet pr-0.5">
                  {items.map((o) => (
                    <div
                      key={o.id}
                      draggable
                      onClick={() => setOpenId(o.id)}
                      onDragStart={() => setDrag({ id: o.id, from: s.id })}
                      className="rounded-[10px] bg-secondary border border-border p-3 hover:bg-accent transition-colors cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] tabular text-muted-foreground">
                          {o.ref}
                        </span>
                        {o.atRisk && (
                          <Badge color="red" className="ml-auto">
                            at risk
                          </Badge>
                        )}
                      </div>
                      <div className="text-[13px] w-medium mb-1 leading-snug">
                        {o.title}
                      </div>
                      <div className="text-[12px] text-muted-foreground mb-2.5">
                        {companyById(o.companyId).name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PriorityIcon priority={o.priority} />
                        <span className="text-[12px] tabular w-medium">
                          {fmtMoney(o.value)}
                        </span>
                        <span className="ml-auto text-[11px] text-muted-foreground">
                          {o.closeDate}
                        </span>
                        <Avatar {...personById(o.owner)!} size={18} />
                      </div>
                    </div>
                  ))}
                  <button className="h-8 rounded-[8px] text-[12px] text-muted-foreground hover:bg-secondary flex items-center justify-center gap-1">
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </Page>
  )
}

function PipelineList({
  items,
  display,
  onOpen,
}: {
  items: Opportunity[]
  display: DisplaySettings
  onOpen: (id: string) => void
}) {
  const sorted = [...items].sort((a, b) => {
    if (display.orderBy === "priority")
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (display.orderBy === "closeDate")
      return a.closeDate.localeCompare(b.closeDate)
    return b.value - a.value
  })
  const groups =
    display.groupBy === "priority"
      ? (Object.keys(PRIORITY_ORDER) as Priority[]).map((p) => ({
          key: p,
          label: p[0].toUpperCase() + p.slice(1),
          dot: <PriorityIcon priority={p} />,
          items: sorted.filter((o) => o.priority === p),
        }))
      : display.groupBy === "owner"
        ? people.map((p) => ({
            key: p.id,
            label: p.name,
            dot: <Avatar {...p} size={16} />,
            items: sorted.filter((o) => o.owner === p.id),
          }))
        : STAGES.map((s) => ({
            key: s.id,
            label: s.label,
            dot: (
              <StatusDot
                color={s.color}
                ring={!["won", "lost"].includes(s.id)}
              />
            ),
            items: sorted.filter((o) => o.stage === s.id),
          }))
  return (
    <div className="h-full overflow-y-auto scroll-quiet">
      {groups.map((g) => {
        if (!g.items.length && !display.showEmptyGroups) return null
        return (
          <div key={g.key} className="group">
            <GroupHeader color={g.dot} label={g.label} count={g.items.length} />
            {g.items.map((o) => (
              <Row key={o.id} onClick={() => onOpen(o.id)}>
                <PriorityIcon priority={o.priority} />
                <span className="text-[12px] tabular text-muted-foreground w-[64px] shrink-0">
                  {o.ref}
                </span>
                <span className="text-[13px] w-medium truncate" title={o.title}>
                  {o.title}
                </span>
                <span className="text-[12px] text-muted-foreground hidden md:inline">
                  {companyById(o.companyId).name}
                </span>
                {o.atRisk && <Badge color="red">at risk</Badge>}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  {o.labels.map((l) => (
                    <Badge key={l} className="hidden lg:inline-flex">
                      {l}
                    </Badge>
                  ))}
                  <span className="text-[13px] tabular w-medium w-[60px] text-right">
                    {fmtMoney(o.value)}
                  </span>
                  <span className="text-[12px] text-muted-foreground w-[52px] text-right">
                    {o.closeDate}
                  </span>
                  <Avatar {...personById(o.owner)!} size={20} />
                </div>
              </Row>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function PipelineForecast({ items }: { items: Opportunity[] }) {
  const open = items.filter((o) => !["won", "lost"].includes(o.stage))
  const weights: Record<string, number> = {
    new: 0.1,
    qualified: 0.25,
    discovery: 0.4,
    solution: 0.55,
    proposal: 0.7,
    negotiation: 0.85,
  }
  return (
    <div className="h-full overflow-y-auto scroll-quiet px-4 md:px-8 py-6 max-w-[900px] mx-auto">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            l: "Committed",
            v: fmtMoney(50500),
            c: "var(--color-status-green)",
          },
          {
            l: "Best case",
            v: fmtMoney(139500),
            c: "var(--color-status-blue)",
          },
          {
            l: "Weighted",
            v: fmtMoney(
              Math.round(
                open.reduce(
                  (a, o) => a + o.value * (weights[o.stage] || 0.3),
                  0,
                ),
              ),
            ),
            c: "var(--sidebar-primary)",
          },
        ].map((k) => (
          <Panel key={k.l} className="p-3.5">
            <div className="text-[11px] uppercase tracking-[0.05em] text-muted-foreground w-medium mb-1">
              {k.l}
            </div>
            <div className="text-[22px] title tabular" style={{ color: k.c }}>
              {k.v}
            </div>
          </Panel>
        ))}
      </div>
      <Panel>
        <div className="flex items-center gap-2 h-10 px-4 border-b border-border">
          <TrendingUp size={15} className="text-muted-foreground" />
          <span className="text-[13px] w-semibold">Weighted by deal</span>
        </div>
        {open.map((o) => (
          <div
            key={o.id}
            className="flex items-center gap-3 h-11 px-4 border-b border-border"
          >
            <span className="text-[13px] w-medium truncate flex-1">
              {o.title}
            </span>
            <Badge color={STAGES.find((s) => s.id === o.stage)!.color}>
              {STAGES.find((s) => s.id === o.stage)!.label}
            </Badge>
            <span className="text-[11px] tabular text-muted-foreground w-10 text-right">
              {Math.round((weights[o.stage] || 0.3) * 100)}%
            </span>
            <span className="text-[13px] tabular w-medium w-[64px] text-right">
              {fmtMoney(Math.round(o.value * (weights[o.stage] || 0.3)))}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ---------- Outreach ----------
export function Outreach() {
  const stateColor: Record<string, "gray" | "blue" | "green" | "yellow" | "orange" | "red"> =
    {
      draft: "gray",
      scheduled: "blue",
      sent: "blue",
      replied: "green",
      awaiting: "yellow",
      bounced: "red",
    }
  return (
    <Page
      title="Outreach"
      count={outreach.length}
      views={["Queue", "Sent", "Replies"]}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> Draft
        </Button>
      }
    >
      <div>
        {outreach.map((o) => (
          <Row key={o.id}>
            <StatusDot
              color={stateColor[o.state]}
              ring={["draft", "scheduled"].includes(o.state)}
            />
            <Avatar {...contactById(o.contactId)} size={22} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] w-medium truncate">
                  {o.subject}
                </span>
                {o.agentDrafted && <Badge color="indigo">agent draft</Badge>}
              </div>
              <div className="text-[12px] text-muted-foreground truncate">
                {o.preview}
              </div>
            </div>
            {o.sequence && (
              <Badge className="hidden lg:inline-flex">{o.sequence}</Badge>
            )}
            <Badge className="capitalize">{o.state}</Badge>
            <span className="text-[12px] text-muted-foreground w-[80px] text-right shrink-0">
              {o.when}
            </span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Meetings ----------
export function Meetings() {
  return (
    <Page
      title="Meetings"
      count={meetings.length}
      views={["Upcoming", "Past"]}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> Schedule
        </Button>
      }
    >
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[1000px]">
        {meetings.map((m) => (
          <Panel key={m.id} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="grid place-items-center h-8 w-8 rounded-[8px] bg-secondary text-muted-foreground">
                <Video size={16} />
              </span>
              <div className="min-w-0">
                <div className="text-[14px] w-medium truncate">{m.title}</div>
                <div className="text-[12px] text-muted-foreground">
                  {m.when} · {m.duration}
                </div>
              </div>
              <Badge className="ml-auto">{m.type}</Badge>
            </div>
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-border">
              <div className="flex -space-x-1.5">
                {m.attendees.map((a) => (
                  <span
                    key={a}
                    className="ring-2 ring-[var(--card)] rounded-full"
                  >
                    <Avatar {...(personById(a) || contactById(a))!} size={20} />
                  </span>
                ))}
              </div>
              {m.hasBrief ? (
                <Badge color="indigo" className="ml-auto">
                  brief ready
                </Badge>
              ) : (
                <Button size="sm" variant="ghost" className="ml-auto">
                  Generate brief
                </Button>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </Page>
  )
}

// ---------- Proposals ----------
export function Proposals() {
  const statusColor: Record<string, "gray" | "blue" | "yellow" | "orange" | "green" | "red"> =
    {
      draft: "gray",
      internal_review: "orange",
      sent: "blue",
      viewed: "yellow",
      accepted: "green",
      rejected: "red",
      expired: "gray",
    }
  return (
    <Page
      title="Proposals"
      count={proposals.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> New proposal
        </Button>
      }
    >
      <div>
        {proposals.map((p) => (
          <Row key={p.id}>
            <FileText size={15} className="text-muted-foreground shrink-0" />
            <span className="text-[12px] tabular text-muted-foreground w-[70px] shrink-0">
              {p.ref}
            </span>
            <span
              className="text-[13px] w-medium truncate flex-1"
              title={p.title}
            >
              {p.title}
            </span>
            <span className="text-[12px] text-muted-foreground hidden md:inline">
              {companyById(p.companyId).name}
            </span>
            <Badge color={statusColor[p.status]} className="capitalize">
              {p.status.replace("_", " ")}
            </Badge>
            <span className="text-[13px] tabular w-medium w-[60px] text-right">
              {fmtMoney(p.value)}
            </span>
            <span className="text-[12px] text-muted-foreground w-[52px] text-right">
              {p.updatedAt}
            </span>
          </Row>
        ))}
      </div>
    </Page>
  )
}

// ---------- Services ----------
export function Services() {
  return (
    <Page
      title="Services"
      count={services.length}
      actions={
        <Button size="sm" variant="primary">
          <Plus size={14} /> Add offer
        </Button>
      }
    >
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1100px]">
        {services.map((s) => (
          <Panel key={s.id} className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] w-semibold">{s.name}</span>
              {s.active ? (
                <Badge color="green">active</Badge>
              ) : (
                <Badge>draft</Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[22px] title tabular">{s.price}</span>
              <span className="text-[12px] text-muted-foreground">
                {s.cadence}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
          </Panel>
        ))}
      </div>
    </Page>
  )
}
