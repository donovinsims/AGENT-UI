import { useState } from 'react'
import { approvals as seed, type Approval } from '../data'
import { Icon, StatusDot } from '../ui'
import type { StatusColor } from '../data'

type Decision = 'pending' | 'approved' | 'denied'

export function Approvals() {
  const [state, setState] = useState<Record<string, Decision>>(
    Object.fromEntries(seed.map((a) => [a.id, 'pending'])),
  )
  const [open, setOpen] = useState<string | null>(seed[0].id)

  const decide = (id: string, d: Decision) => setState((s) => ({ ...s, [id]: d }))
  const pending = seed.filter((a) => state[a.id] === 'pending')

  return (
    <div className="scroll-quiet h-full overflow-y-auto">
      <div className="mx-auto max-w-[860px] px-5 py-6 md:px-8">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-[22px] w-semibold leading-tight text-[var(--color-text-primary)]">Approvals</h1>
          <span className="tabular rounded-full bg-[var(--color-surface-raised)] px-2 py-0.5 text-[12px] w-medium text-[var(--color-text-tertiary)]">
            {pending.length} pending
          </span>
        </div>
        <p className="mb-5 text-[13px] text-[var(--color-text-tertiary)]">
          External sends, commercial status changes, and bulk actions require your sign-off. Every decision is
          logged to the immutable activity trail.
        </p>

        <div className="space-y-2.5">
          {seed.map((a) => (
            <ApprovalCard
              key={a.id}
              a={a}
              decision={state[a.id]}
              expanded={open === a.id}
              onToggle={() => setOpen((o) => (o === a.id ? null : a.id))}
              onDecide={(d) => decide(a.id, d)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ApprovalCard({
  a,
  decision,
  expanded,
  onToggle,
  onDecide,
}: {
  a: Approval
  decision: Decision
  expanded: boolean
  onToggle: () => void
  onDecide: (d: Decision) => void
}) {
  const decided = decision !== 'pending'
  return (
    <div
      className={`overflow-hidden rounded-[12px] border bg-[var(--color-level-1)] transition-colors ${
        decided ? 'border-[var(--color-hairline)] opacity-70' : 'border-[var(--color-border)]'
      }`}
    >
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <StatusDot color={a.risk as StatusColor} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] w-medium text-[var(--color-text-primary)]">{a.title}</div>
          <div className="truncate text-[12px] text-[var(--color-text-tertiary)]">
            <span className="inline-flex items-center gap-1">
              <Icon name="Bot" size={12} /> {a.agent}
            </span>{' '}
            · {a.kind} · {a.requested}
          </div>
        </div>
        {decided ? (
          <span
            className="flex shrink-0 items-center gap-1 text-[12px] w-medium capitalize"
            style={{
              color: decision === 'approved' ? 'var(--color-status-green)' : 'var(--color-status-red)',
            }}
          >
            <Icon name={decision === 'approved' ? 'Check' : 'X'} size={13} /> {decision}
          </span>
        ) : (
          <Icon
            name="ChevronDown"
            size={16}
            className={`shrink-0 text-[var(--color-text-tertiary)] transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {expanded && !decided && (
        <div className="border-t border-[var(--color-hairline)] px-4 py-3.5">
          <p className="text-[14px] leading-relaxed text-[var(--color-text-secondary)]">{a.detail}</p>
          <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[var(--color-level-2)] px-3 py-2 text-[12px] text-[var(--color-text-tertiary)]">
            <Icon name="ShieldCheck" size={14} className="text-[var(--color-text-tertiary)]" />
            Reversible action · agent stays within scope · secrets never exposed in prompt or log
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => onDecide('approved')}
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-[var(--color-brand)] px-3.5 text-[13px] w-medium text-white transition-colors hover:bg-[var(--color-brand-hover)]"
            >
              <Icon name="Check" size={14} /> Approve
            </button>
            <button
              onClick={() => onDecide('denied')}
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3.5 text-[13px] w-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-raised)]"
            >
              <Icon name="X" size={14} /> Deny
            </button>
            <button className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] w-medium text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]">
              <Icon name="Pencil" size={13} /> Edit draft
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
