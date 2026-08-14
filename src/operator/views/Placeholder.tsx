import { Button, Icon } from '../ui'

export function Placeholder({
  icon,
  title,
  section,
}: {
  icon: string
  title: string
  section: string
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--color-hairline)] px-4">
        <Icon name={icon} size={15} className="text-[var(--color-text-tertiary)]" />
        <span className="text-[13px] w-semibold text-[var(--color-text-primary)]">{title}</span>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-[420px] text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-level-1)]">
            <Icon name={icon} size={22} className="text-[var(--color-text-tertiary)]" />
          </div>
          <h2 className="text-[16px] w-semibold text-[var(--color-text-primary)]">{title}</h2>
          <p className="mx-auto mt-1.5 text-[13px] leading-relaxed text-[var(--color-text-tertiary)]">
            The <span className="text-[var(--color-text-secondary)]">{title}</span> surface lives in the{' '}
            {section} area of Operator OS. It shares the same records, services, and design tokens as the built-out
            views — this is the next screen to flesh out in this direction.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button variant="secondary">
              <Icon name="Plus" size={14} /> New
            </Button>
            <Button variant="ghost">
              <Icon name="BookOpen" size={14} /> Docs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
