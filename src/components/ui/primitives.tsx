import { cn } from "@/lib/utils";
import type { Decision } from "@/lib/fixtures";

export function Card({
  className,
  emphasis,
  children,
}: {
  className?: string;
  emphasis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(emphasis ? "emphasis-card" : "product-card", className)}>
      {children}
    </div>
  );
}

export function ToolIcon({
  color,
  initials,
  size = 22,
  className,
}: {
  color: string;
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("tool-icon", className)}
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size < 20 ? 9 : 10,
      }}
    >
      {initials}
    </span>
  );
}

const decisionStyles: Record<Decision, string> = {
  GO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NO_GO: "bg-red-50 text-red-700 border-red-200",
  WAIT: "bg-amber-50 text-amber-700 border-amber-200",
  REDIRECT: "bg-blue-50 text-blue-700 border-blue-200",
};

export function DecisionBadge({ decision }: { decision: Decision }) {
  return (
    <span
      className={cn(
        "chip border font-semibold tabular",
        decisionStyles[decision],
      )}
    >
      {decision}
    </span>
  );
}

export function StatusChip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "green" | "amber" | "red" | "brand";
  children: React.ReactNode;
}) {
  const map = {
    neutral: "bg-ink-50 text-ink-700 border-ink-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
  } as const;
  return <span className={cn("chip border", map[tone])}>{children}</span>;
}

export function StatCard({
  label,
  value,
  sublabel,
  tone,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: React.ReactNode;
  tone?: "green" | "amber" | "red" | "brand";
  icon?: React.ReactNode;
}) {
  const toneBorder = tone
    ? {
        green: "before:bg-emerald-500",
        amber: "before:bg-amber-500",
        red: "before:bg-red-500",
        brand: "before:bg-brand",
      }[tone]
    : "before:bg-ink-200";
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-[2px]",
        toneBorder,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11.5px] text-muted font-medium uppercase tracking-wide">
          {label}
        </div>
        {icon && <div className="text-ink-400">{icon}</div>}
      </div>
      <div className="mt-1.5 text-[26px] font-semibold tracking-tight text-ink-900 display">
        {value}
      </div>
      {sublabel && (
        <div className="mt-1 text-[11.5px] text-muted tabular">{sublabel}</div>
      )}
    </Card>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded border border-ink-200 bg-ink-50 text-[10px] font-mono text-ink-600">
      {children}
    </kbd>
  );
}
