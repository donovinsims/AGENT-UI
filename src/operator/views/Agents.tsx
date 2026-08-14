import { useState } from 'react'
import { agents, systemHealth, type Agent } from '../data'
import { Button, Icon, StatusDot } from '../ui'
import type { StatusColor } from '../data'

const statusMap: Record<Agent['status'], { c: StatusColor; t: string }> = {
  active: { c: 'green', t: 'Active' },
  idle: { c: 'muted', t: 'Idle' },
  paused: { c: 'yellow', t: 'Paused' },
}

const autonomyRank: Record<Agent['autonomy'], number> = {
  Observe: 1,
  Suggest: 2,
  Draft: 3,
  'Act within policy': 4,
  'Operate workflow': 5,
}

function AutonomyMeter({ level }: { level: Agent['autonomy'] }) {
  const rank = autonomyRank[level]
  return (
    <span className="flex items-center gap-1" title={level}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-1 w-3 rounded-full"
          style={{ background: i <= rank ? 'var(--color-brand)' : 'var(--color-surface-raised)' }}
        />
      ))}
    </span>
  )
}

export function Agents() {
  const [emergency, setEmergency] = useState(false)

  return (
    <div className="scroll-quiet h-full overflow-y-auto">
      <div className="mx-auto max-w-[1120px] px-5 py-6 md:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-[22px] w-semibold leading-tight text-[var(--color-text-primary)]">
              Agent control plane
            </h1>
            <p className="mt-0.5 text-[13px] text-[var(--color-text-tertiary)]">
              {agents.filter((a) => a.status === 'active').length} active ·{' '}
              {agents.reduce((s, a) => s + a.runsToday, 0)} runs today · owner retains approval &amp; audit control
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" className="h-8 px-2.5 text-[12px]">
              <Icon name="FlaskConical" size={14} /> Test Lab
            </Button>
            <Button variant="secondary">
              <Icon name="Plus" size={14} /> New agent
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEmergency((e) => !e)}
              className={emergency ? 'border-[var(--color-status-red)] text-[var(--color-status-red)]' : ''}
            >
              <Icon name="OctagonAlert" size={14} />
              {emergency ? 'Agents halted' : 'Emergency stop'}
            </Button>
          </div>
        </div>

        {emergency && (
          <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-[13px] w-medium"
            style={{ borderColor: 'var(--color-status-red)', background: 'rgba(235,87,87,0.08)', color: 'var(--color-status-red)' }}>
            <Icon name="OctagonAlert" size={15} />
            Emergency stop engaged — all agent execution paused. Manual work and approvals remain available.
          </div>
        )}

        {/* Runner lanes */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { title: 'Codex — primary lane', sub: 'Owner ChatGPT login · local', item: systemHealth[0] },
            { title: 'FCM — backup lane', sub: 'coding + business backup', item: systemHealth[2] },
            { title: 'Mac Runner', sub: 'Local-only ops & repair', item: systemHealth[1] },
          ].map((lane) => (
            <div key={lane.title} className="rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-level-1)] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] w-semibold text-[var(--color-text-primary)]">{lane.title}</span>
                <StatusDot
                  color={
                    lane.item.status === 'available'
                      ? 'blue'
                      : lane.item.status === 'connected'
                        ? 'green'
                        : lane.item.status === 'unreachable'
                          ? 'red'
                          : 'muted'
                  }
                />
              </div>
              <div className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">{lane.sub}</div>
              <div className="mt-2 text-[12px] w-medium capitalize text-[var(--color-text-secondary)]">
                {lane.item.status}
              </div>
            </div>
          ))}
        </div>

        {/* Agent directory table */}
        <div className="overflow-hidden rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-level-1)]">
          <div className="hidden grid-cols-[1fr_120px_92px_130px_88px] items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-2 text-[11px] w-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] md:grid">
            <span>Agent</span>
            <span>Autonomy</span>
            <span>Runs</span>
            <span>Model / fallback</span>
            <span className="text-right">Budget</span>
          </div>
          {agents.map((a) => {
            const st = statusMap[a.status]
            return (
              <div
                key={a.id}
                className="grid grid-cols-1 items-center gap-2 border-b border-[var(--color-hairline)] px-4 py-3 transition-colors last:border-0 hover:bg-[var(--color-level-2)] md:grid-cols-[1fr_120px_92px_130px_88px] md:gap-3 md:py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-surface-raised)]">
                    <Icon name="Bot" size={15} className="text-[var(--color-brand)]" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] w-medium text-[var(--color-text-primary)]">{a.name}</span>
                      <span className="flex shrink-0 items-center gap-1 text-[11px] w-medium text-[var(--color-text-tertiary)]">
                        <StatusDot color={st.c} size={6} /> {st.t}
                      </span>
                    </div>
                    <div className="truncate text-[12px] text-[var(--color-text-tertiary)]">{a.purpose}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:block">
                  <span className="text-[11px] text-[var(--color-text-muted)] md:hidden">Autonomy</span>
                  <AutonomyMeter level={a.autonomy} />
                </div>
                <div className="tabular text-[13px] text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-text-primary)] w-medium">{a.runsToday}</span>
                  <span className="ml-1.5 text-[12px] text-[var(--color-text-muted)]">{a.successRate}%</span>
                </div>
                <div className="text-[12px] text-[var(--color-text-tertiary)]">
                  <div className="w-medium text-[var(--color-text-secondary)]">{a.model}</div>
                  <div className="text-[var(--color-text-muted)]">→ {a.fallback}</div>
                </div>
                <div className="flex items-center gap-2 md:block md:text-right">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)] md:mb-1 md:w-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${a.budgetUsed}%`,
                        background: a.budgetUsed > 75 ? 'var(--color-status-orange)' : 'var(--color-brand)',
                      }}
                    />
                  </div>
                  <span className="tabular text-[11px] text-[var(--color-text-muted)]">{a.budgetUsed}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
