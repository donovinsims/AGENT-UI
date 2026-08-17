import { useEffect, useState } from "react"
import { CheckSquare, Users, GitBranch, StickyNote } from "lucide-react"
import { Dialog } from "./overlay"
import { Tabs, Select } from "./form"
import { Button } from "./ui"
import { addRecord, type CreateKind } from "../store/create"
import { useToast } from "./Toast"
import { people, TASK_STATES, STAGES, type Priority } from "../data/model"

const KINDS: { id: CreateKind; label: string; icon: React.ReactNode }[] = [
  { id: "task", label: "Task", icon: <CheckSquare size={14} /> },
  { id: "lead", label: "Lead", icon: <Users size={14} /> },
  { id: "deal", label: "Deal", icon: <GitBranch size={14} /> },
  { id: "note", label: "Note", icon: <StickyNote size={14} /> },
]

const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low", "none"]

export function CreateModal({
  open,
  onClose,
  onCreated,
  initialKind = "task",
}: {
  open: boolean
  onClose: () => void
  onCreated: (kind: CreateKind) => void
  initialKind?: CreateKind
}) {
  const [kind, setKind] = useState<CreateKind>("task")
  const [title, setTitle] = useState("")
  const [detail, setDetail] = useState("")
  const [state, setState] = useState<string | undefined>()
  const [priority, setPriority] = useState<Priority | undefined>()
  const [assignee, setAssignee] = useState<string | undefined>()
  const [value, setValue] = useState("")
  const { notify } = useToast()

  useEffect(() => {
    if (open) setKind(initialKind)
  }, [initialKind, open])

  const reset = () => {
    setTitle("")
    setDetail("")
    setState(undefined)
    setPriority(undefined)
    setAssignee(undefined)
    setValue("")
  }

  const submit = () => {
    if (!title.trim()) return
    addRecord({
      kind,
      title: title.trim(),
      detail: detail.trim() || undefined,
      state,
      priority: priority ?? "none",
      assignee,
      value: kind === "deal" && value ? Number(value) : undefined,
    })
    notify(
      `${kind[0].toUpperCase()}${kind.slice(1)} created — added to the ${
        kind === "task"
          ? "Tasks"
          : kind === "lead"
            ? "Leads"
            : kind === "deal"
              ? "Pipeline"
              : "Today"
      } view.`,
    )
    reset()
    onClose()
    onCreated(kind)
  }

  return (
    <Dialog open={open} onClose={onClose} title="Create" width="max-w-[460px]">
      <div className="space-y-3">
        <Tabs
          value={kind}
          onChange={setKind}
          tabs={KINDS.map((k) => ({ id: k.id, label: k.label }))}
        />
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) submit()
          }}
          placeholder={
            kind === "task"
              ? "Task title…"
              : kind === "lead"
                ? "Lead name…"
                : kind === "deal"
                  ? "Deal title…"
                  : "Note…"
          }
          aria-label="Title"
          className="h-9 w-full rounded-md border border-input bg-popover px-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
        {kind === "task" && (
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={state}
              onChange={setState}
              placeholder="State"
              options={TASK_STATES.map((s) => ({
                value: s.id,
                label: s.label,
              }))}
            />
            <Select
              value={priority}
              onChange={setPriority}
              placeholder="Priority"
              options={PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
            <Select
              value={assignee}
              onChange={setAssignee}
              placeholder="Assignee"
              options={people.map((p) => ({
                value: p.id,
                label: p.name.split(" ")[0],
              }))}
            />
          </div>
        )}
        {kind === "lead" && (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={state}
              onChange={setState}
              placeholder="Stage"
              options={[
                "new",
                "researching",
                "contacted",
                "qualified",
                "disqualified",
              ].map((s) => ({ value: s, label: s }))}
            />
            <Select
              value={assignee}
              onChange={setAssignee}
              placeholder="Owner"
              options={people.map((p) => ({
                value: p.id,
                label: p.name.split(" ")[0],
              }))}
            />
          </div>
        )}
        {kind === "deal" && (
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={state}
              onChange={setState}
              placeholder="Stage"
              options={STAGES.filter(
                (s) => s.id !== "won" && s.id !== "lost",
              ).map((s) => ({ value: s.id, label: s.label }))}
            />
            <Select
              value={priority}
              onChange={setPriority}
              placeholder="Priority"
              options={PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder="Value ($)…"
              aria-label="Deal value"
              className="h-8 w-full rounded-md border border-input bg-popover px-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        )}
        {kind === "note" && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Details…"
            aria-label="Note details"
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-popover px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        )}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!title.trim()}
            onClick={submit}
          >
            Create {kind}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
