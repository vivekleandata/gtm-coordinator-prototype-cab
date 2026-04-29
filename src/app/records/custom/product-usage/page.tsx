import { Activity, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import {
  PRODUCT_USAGE,
  RECORD_SET_SOURCES,
  type ProductUsageRow,
} from "@/lib/fixtures";

function trendUI(row: ProductUsageRow) {
  if (row.trend === "up") {
    return {
      Icon: ArrowUpRight,
      tone: "text-emerald-700",
      label: `+${row.trendPct}%`,
    };
  }
  if (row.trend === "down") {
    return {
      Icon: ArrowDownRight,
      tone: "text-red-700",
      label: `${row.trendPct}%`,
    };
  }
  return { Icon: Minus, tone: "text-ink-500", label: "flat" };
}

export default function ProductUsagePage() {
  const meta = RECORD_SET_SOURCES["product-usage"];
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Product Usage"
        title="Product activity per workspace."
        description="Aggregated session telemetry from Snowflake + Segment. PLG triggers — feature-adoption + trial-signal events that ChurnZero and Artisan Ava both want to act on; Coordinator decides who gets the touch first."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search by workspace, account, or feature…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Workspace · Account</div>
          <div className="w-[120px] text-right">Sessions · 7d</div>
          <div className="flex-1">Top features</div>
          <div className="w-[120px]">Trend</div>
          <div className="w-[120px]">Last active</div>
          <div className="w-[80px]">Source</div>
        </div>
        <ul>
          {PRODUCT_USAGE.map((u) => {
            const t = trendUI(u);
            return (
              <li
                key={u.id}
                className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
              >
                <div className="flex-1 min-w-0 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-mono font-semibold text-ink-900 truncate">
                      {u.workspace}
                    </div>
                    <div className="text-[11.5px] text-muted truncate">
                      {u.account}
                    </div>
                  </div>
                </div>
                <div className="w-[120px] text-right tabular text-[12.5px] font-semibold text-ink-900">
                  {u.sessions7d.toLocaleString()}
                </div>
                <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                  {u.topFeatures.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-ink-50 text-[11px] text-ink-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="w-[120px]">
                  <span
                    className={`inline-flex items-center gap-1 text-[12.5px] font-semibold ${t.tone}`}
                  >
                    <t.Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </span>
                </div>
                <div className="w-[120px] text-[11.5px] text-muted truncate">
                  {u.lastActiveAt}
                </div>
                <div className="w-[80px]">
                  <SourceChip source={u.source} size="sm" />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
