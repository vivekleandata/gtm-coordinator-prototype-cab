import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  className,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-wider font-semibold text-brand mb-1">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink-900 hero-serif">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13.5px] text-muted max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-[14.5px] font-semibold text-ink-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[12.5px] text-muted mt-0.5">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
