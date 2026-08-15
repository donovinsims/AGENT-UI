import { type RefObject, useEffect, useRef } from 'react'

export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement | null>) {
  const previous = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!active || !ref.current) return
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const node = ref.current
    const focusable = () => [...node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute('hidden'))
    const first = focusable()[0] ?? node
    first.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return event.preventDefault()
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus() }
      if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus() }
    }
    node.addEventListener('keydown', onKeyDown)
    return () => { node.removeEventListener('keydown', onKeyDown); previous.current?.focus() }
  }, [active, ref])
}
