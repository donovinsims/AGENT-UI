import { useSyncExternalStore } from "react"

// In-memory created records (Circle's issues-store pattern, minimal): the
// Create modal appends here; screens merge these into their seeded lists.
// A real backend later replaces this boundary.

export type CreateKind = "task" | "lead" | "deal" | "note"

export interface CreatedRecord {
  id: string
  kind: CreateKind
  title: string
  detail?: string
  /** task state id | lead stage id | deal stage id */
  state?: string
  priority?: string
  assignee?: string
  value?: number
}

let records: CreatedRecord[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function addRecord(record: Omit<CreatedRecord, "id">) {
  records = [
    ...records,
    {
      ...record,
      id: `created_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    },
  ]
  emit()
  return records[records.length - 1]
}

export const createdStore = {
  getRecords: () => records,
}

export function useCreatedRecords() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => records,
  )
}
