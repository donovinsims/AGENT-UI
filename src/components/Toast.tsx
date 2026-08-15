import { createContext, type ReactNode, useContext, useState } from 'react'
import { Check, X } from 'lucide-react'

type Toast = { id: number; message: string }
const ToastContext = createContext<{ notify: (message: string) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = (message: string) => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500)
  }
  return <ToastContext.Provider value={{ notify }}>
    {children}
    <div className="fixed right-4 bottom-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => <div key={toast.id} role="status" className="flex items-center gap-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 shadow-stack text-[13px] text-[var(--color-text-primary)]">
        <Check size={15} className="text-[var(--color-status-green)]" aria-hidden="true" />
        <span className="flex-1">{toast.message}</span>
        <button onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} aria-label="Dismiss notification" className="grid h-7 w-7 place-items-center rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)]"><X size={14} /></button>
      </div>)}
    </div>
  </ToastContext.Provider>
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used within ToastProvider')
  return value
}
