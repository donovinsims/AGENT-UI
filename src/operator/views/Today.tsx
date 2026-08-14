import {
  approvals,
  activityFeed,
  myTasks,
  meetings,
  systemHealth,
  personById,
  fmtMoney,
  opportunities,
} from '../data'
import { Avatar, Button, Chip, Icon, PriorityIcon, StatusDot } from '../ui'
import type { StatusColor } from '../data'

function Panel({
  title,
  count,
  action,
  children,
}: {
  title: string
  count?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-level-1)]">
      <div className="flex h-10 items-center gap-2 border-b border-[var(--color-hairline)] px-3.5">
        <h2 className="text-[13px] w-semibold text-[var(--color-text-primary)]">{title}</h2>
        {count && (
          <span className="tabular rounded-full bg-[var(--color-surface-raised)] px-1.5 text-[11px] w-medium text-[var(--color-text-tertiary)]">
            {count}
          </span>
        )}
        <div className="ml-auto">{action}</div>
      </div>
      <div>{children}</div>
    </section>
  )
}

const riskColor: Record<string, StatusColor> = {
  APR: 'yellow',
}

export function Today({ onNavigate }: { onNavigate: (id: string) => void }) {
  const pipelineValue = opportunities.reduce((s, o) => s + o.value, 0)
  const atRisk = opportunities.filter((o) => o.priority === 'urgent')

  return (
    <div className="scroll-quiet h-full overflow-y-auto">
      <div className="mx-auto max-w-[1120px] px-5 py-6 md:px-8">
        {/* Briefing */}
        <div className="animate-in mb-6">
          <div className="mb-1 flex items-center gap-2 text-[12px] w-medium text-[var(--color-text-tertiary)]">
            <Icon name="Sparkles" size={13} className="text-[var(--color-brand)]" />
            Thursday, August 14 · Daily brief by Executive Operations Agent
          </div>
          <h1 className="text-[26px] w-semibold leading-tight text-[var(--color-text-primary)]">
            Good morning. 3 approvals, 3 tasks due, and 2 deals need attention today.
          </h1>
          <p className="mt-1.5 max-w-[720px] text-[15px] text-[var(--color-text-secondary)]">
            ClearView Optometry countersigned overnight — the Pipeline Agent proposed moving it to Won
            (awaiting your approval). Lakeside Veterinary discovery is at 10:30; the Meeting Agent has a
            brief ready. The Mac Runner is offline, so FCM fallback is paused.
          </p>
        </div>

        {/* KPI strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Open pipeline', value: fmtMoney(pipelineValue), delta: '+$61k wk', icon: 'TrendingUp' },
            { label: 'Deals at risk', value: String(atRisk.length), delta: '2 urgent', icon: 'AlertTriangle' },
            { label: 'Agent runs today', value: '65', delta: '96% success', icon: 'Bot' },
            { label: 'Approvals waiting', value: '3', delta: 'oldest 1h', icon: 'ShieldCheck' },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-level-1)] p-3.5"
            >
              <div className="flex items-center gap-1.5 text-[12px] w-medium text-[var(--color-text-tertiary)]">
                <Icon name={k.icon} size={13} />
                {k.label}
              </div>
              <div className="mt-1.5 text-[24px] w-semibold tabular leading-none text-[var(--color-text-primary)]">
                {k.value}
              </div>
              <div className="mt-1.5 text-[12px] text-[var(--color-text-muted)]">{k.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left / main column */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Panel
              title="Approval requests"
              count={String(approvals.length)}
              action={
                <Button variant="ghost" onClick={() => onNavigate('approvals')} className="h-7 px-2 text-[12px]">
                  Review all <Icon name="ArrowRight" size={13} />
                </Button>
              }
            >
              {approvals.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onNavigate('approvals')}
                  className="flex w-full items-center gap-3 border-b border-[var(--color-hairline)] px-3.5 py-2.5 text-left transition-colors last:border-0 hover:bg-[var(--color-level-2)]"
                >
                  <StatusDot color={riskColor[a.id.slice(0, 3)] ?? (a.risk as StatusColor)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] w-medium text-[var(--color-text-primary)]">{a.title}</div>
                    <div className="truncate text-[12px] text-[var(--color-text-tertiary)]">
                      {a.agent} · {a.kind}
                    </div>
                  </div>
                  <span className="hidden shrink-0 text-[12px] text-[var(--color-text-muted)] sm:block">
                    {a.requested}
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="rounded-[6px] bg-[var(--color-brand)] px-2 py-1 text-[12px] w-medium text-white">
                      Approve
                    </span>
                    <span className="rounded-[6px] border border-[var(--color-border-input)] px-2 py-1 text-[12px] w-medium text-[var(--color-text-secondary)]">
                      Deny
                    </span>
                  </div>
                </button>
              ))}
            </Panel>

            <Panel
              title="Due today"
              count={String(myTasks.filter((t) => t.due === 'Today').length)}
              action={
                <Button variant="ghost" onClick={() => onNavigate('my-work')} className="h-7 px-2 text-[12px]">
                  My Work
                </Button>
              }
            >
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center gap-2.5 border-b border-[var(--color-hairline)] px-3.5 py-2 transition-colors last:border-0 hover:bg-[var(--color-level-2)]"
                >
                  <button className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-status-green)]">
                    <Icon name={t.status === 'progress' ? 'CircleDashed' : 'Circle'} size={15} />
                  </button>
                  <PriorityIcon priority={t.priority} />
                  <span className="tabular hidden w-[64px] shrink-0 text-[12px] text-[var(--color-text-muted)] sm:block">
                    {t.id}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--color-text-primary)]">
                    {t.title}
                  </span>
                  <Chip className="hidden md:inline-flex">{t.meta}</Chip>
                  <span
                    className={`tabular shrink-0 text-[12px] w-medium ${
                      t.due === 'Today' ? 'text-[var(--color-status-orange)]' : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {t.due}
                  </span>
                </div>
              ))}
            </Panel>

            <Panel title="Deals needing attention" count={String(atRisk.length)}>
              {atRisk.map((o) => (
                <button
                  key={o.id}
                  onClick={() => onNavigate('pipeline')}
                  className="flex w-full items-center gap-3 border-b border-[var(--color-hairline)] px-3.5 py-2.5 text-left transition-colors last:border-0 hover:bg-[var(--color-level-2)]"
                >
                  <PriorityIcon priority={o.priority} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] w-medium text-[var(--color-text-primary)]">
                      {o.company} — {o.title}
                    </div>
                    <div className="truncate text-[12px] text-[var(--color-text-tertiary)]">
                      {o.stage} · next: {o.nextAction}
                    </div>
                  </div>
                  <span className="tabular shrink-0 text-[13px] w-medium text-[var(--color-text-secondary)]">
                    {fmtMoney(o.value)}
                  </span>
                  <span className="hidden shrink-0 text-[12px] text-[var(--color-text-muted)] sm:block">
                    close {o.closeDate}
                  </span>
                </button>
              ))}
            </Panel>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <Panel title="Today's schedule">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-3.5 py-2.5 last:border-0"
                >
                  <span className="tabular w-[42px] shrink-0 text-[13px] w-medium text-[var(--color-text-secondary)]">
                    {m.time}
                  </span>
                  <span className="h-8 w-[2px] shrink-0 rounded-full bg-[var(--color-brand)]" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] w-medium text-[var(--color-text-primary)]">{m.title}</div>
                    <div className="text-[12px] text-[var(--color-text-tertiary)]">{m.kind}</div>
                  </div>
                </div>
              ))}
            </Panel>

            <Panel title="Recent activity">
              <div className="px-3.5 py-2">
                {activityFeed.map((f, i) => {
                  const p = personById(f.actorId)
                  return (
                    <div key={f.id} className="relative flex gap-3 pb-3.5 last:pb-0">
                      {i < activityFeed.length - 1 && (
                        <span className="absolute left-[9px] top-5 h-full w-px bg-[var(--color-hairline)]" />
                      )}
                      <div className="z-10 mt-0.5">
                        {f.agent ? (
                          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-surface-raised)]">
                            <Icon name="Bot" size={11} className="text-[var(--color-brand)]" />
                          </span>
                        ) : (
                          <Avatar name={p.name} initials={p.initials} color={p.color} size={18} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-[13px] leading-snug">
                        <span className="w-medium text-[var(--color-text-primary)]">
                          {f.agent ? 'Agent' : p.name.replace(' (Owner)', '')}
                        </span>{' '}
                        <span className="text-[var(--color-text-tertiary)]">{f.verb}</span>{' '}
                        <span className="text-[var(--color-text-secondary)]">{f.target}</span>
                        <span className="ml-1 text-[12px] text-[var(--color-text-muted)]">· {f.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            <Panel title="System health">
              <div className="grid grid-cols-1 divide-y divide-[var(--color-hairline)]">
                {systemHealth.map((h) => (
                  <div key={h.name} className="flex items-center justify-between px-3.5 py-2">
                    <span className="text-[13px] text-[var(--color-text-secondary)]">{h.name}</span>
                    <span className="flex items-center gap-1.5 text-[12px] w-medium text-[var(--color-text-tertiary)]">
                      <StatusDot
                        color={
                          h.status === 'connected'
                            ? 'green'
                            : h.status === 'available'
                              ? 'blue'
                              : h.status === 'unreachable'
                                ? 'red'
                                : 'muted'
                        }
                        size={6}
                      />
                      {h.status[0].toUpperCase() + h.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
