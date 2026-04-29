import { cn } from "@/lib/utils";
import {
  DATA_SOURCES,
  type DataSource,
  type DataSourceKind,
} from "@/lib/fixtures";

const SOURCE_BY_KIND: Record<DataSourceKind, DataSource> = Object.fromEntries(
  DATA_SOURCES.map((s) => [s.kind, s]),
) as Record<DataSourceKind, DataSource>;

type Size = "xs" | "sm" | "md";

const SIZE: Record<Size, string> = {
  xs: "w-[13px] h-[13px] text-[7px]",
  sm: "w-4 h-4 text-[8px]",
  md: "w-5 h-5 text-[9px]",
};

export function SourceChip({
  source,
  size = "sm",
  withLabel = false,
  className,
}: {
  source: DataSourceKind;
  size?: Size;
  withLabel?: boolean;
  className?: string;
}) {
  const ds = SOURCE_BY_KIND[source];
  if (!ds) return null;
  if (withLabel) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface pl-1 pr-2 py-0.5",
          className,
        )}
        title={ds.label}
      >
        <span
          className={cn(
            "shrink-0 inline-flex items-center justify-center rounded-[3px] text-white font-bold tracking-tight leading-none",
            SIZE[size],
          )}
          style={{ backgroundColor: ds.color }}
          aria-hidden
        >
          {ds.initials}
        </span>
        <span className="text-[11px] font-medium text-ink-700">
          {ds.vendor}
        </span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "shrink-0 inline-flex items-center justify-center rounded-[3px] text-white font-bold tracking-tight leading-none",
        SIZE[size],
        className,
      )}
      style={{ backgroundColor: ds.color }}
      title={ds.vendor}
      aria-label={ds.vendor}
    >
      {ds.initials}
    </span>
  );
}

export function SourceChipStack({
  sources,
  size = "xs",
  max = 3,
  className,
}: {
  sources: DataSourceKind[];
  size?: Size;
  max?: number;
  className?: string;
}) {
  if (sources.length === 0) return null;
  const visible = sources.slice(0, max);
  const overflow = sources.length - visible.length;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className="inline-flex items-center -space-x-0.5">
        {visible.map((s) => (
          <span
            key={s}
            className="ring-1 ring-surface rounded-[3px] inline-flex"
          >
            <SourceChip source={s} size={size} />
          </span>
        ))}
      </span>
      {overflow > 0 && (
        <span className="ml-1 text-[10px] text-ink-500">+{overflow}</span>
      )}
    </span>
  );
}

export function SourceMeta({
  sources,
  primary,
  className,
}: {
  sources: DataSourceKind[];
  primary?: DataSourceKind;
  className?: string;
}) {
  if (sources.length === 0) return null;
  const primaryIdx = primary ? sources.indexOf(primary) : -1;
  const ordered =
    primaryIdx > 0
      ? [sources[primaryIdx], ...sources.filter((_, i) => i !== primaryIdx)]
      : sources;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 flex-wrap", className)}
    >
      <span className="text-[11.5px] uppercase tracking-wider font-semibold text-ink-500">
        Sourced from
      </span>
      {ordered.map((s, i) => (
        <SourceChip
          key={s}
          source={s}
          size="sm"
          withLabel
          className={
            primary && i === 0 ? "border-brand/40 bg-brand-50/40" : undefined
          }
        />
      ))}
    </span>
  );
}
