import { useCallback, useEffect, useState } from "react"

// nuqs-style URL state without a router: reads/writes the query string of the
// current SPA URL via the History API. Back/forward stay wired through popstate.

function readParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key)
}

function writeParam(key: string, value: string | null, replace = false) {
  const url = new URL(window.location.href)
  if (value == null) url.searchParams.delete(key)
  else url.searchParams.set(key, value)
  window.history[replace ? "replaceState" : "pushState"]({}, "", url)
}

export function useUrlState<T extends string>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(
    () => readParam(key) as T | null ?? initial,
  )

  useEffect(() => {
    const onPop = () => setValue(readParam(key) as T | null ?? initial)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [key, initial])

  const set = useCallback(
    (next: T) => {
      writeParam(key, !next || next === initial ? null : next)
      setValue(next)
    },
    [key, initial],
  )

  return [value, set]
}

export function useUrlJsonState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
  const parse = (raw: string | null): T => {
    if (!raw) return initial
    try {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(initial))
        return (Array.isArray(parsed) ? parsed : initial) as T
      if (initial !== null && typeof initial === "object") {
        return (
          parsed !== null &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
            ? { ...initial, ...parsed }
            : initial
        ) as T
      }
      return parsed as T
    } catch {
      return initial
    }
  }

  const [value, setValue] = useState<T>(() => {
    return parse(readParam(key))
  })

  useEffect(() => {
    const onPop = () => {
      setValue(parse(readParam(key)))
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [key, initial])

  const set = useCallback(
    (next: T) => {
      writeParam(key, JSON.stringify(next))
      setValue(next)
    },
    [key],
  )

  return [value, set]
}
