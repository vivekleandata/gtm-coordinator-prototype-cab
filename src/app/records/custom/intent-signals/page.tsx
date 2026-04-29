import { Radar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import {
  AGENTS_BY_ID,
  INTENT_SIGNALS,
  RECORD_SET_SOURCES,
} from "@/lib/fixtures";

export default function IntentSignalsPage() {
  const meta = RECORD_SET_SOURCES["intent-signals"];
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Intent Signals"
        title="Account-level intent — deduped across providers."
        description="Same surge fires from ZoomInfo and Snowflake first-party data; Coordinator collapses them so 11x doesn't trigger twice. Tier-1 approval gating is wired to score thresholds on this view."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search intent by account or topic…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Account · Topic</div>
          <div className="w-[80px] text-right">Score</div>
          <div className="w-[120px] text-right">Surge Δ</div>
          <div className="w-[170px]">Triggered agents</div>
          <div className="w-[120px]">First seen</div>
          <div className="w-[150px]">Sources</div>
        </div>
        <ul>
          {INTENT_SIGNALS.map((sig) => (
            <li
              key={sig.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Radar className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {sig.account}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {sig.topic}
                  </div>
                </div>
              </div>
              <div className="w-[80px] text-right">
                <span
                  className={`text-[13px] font-semibold tabular ${
                    sig.score >= 80
                      ? "text-emerald-700"
                      : sig.score >= 60
                        ? "text-amber-700"
                        : "text-ink-700"
                  }`}
                >
                  {sig.score}
                </span>
              </div>
              <div className="w-[120px] text-right">
                <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold tabular text-emerald-700">
                  <TrendingUp className="w-3.5 h-3.5" />+{sig.surgeDelta}%
                </span>
              </div>
              <div className="w-[170px] flex items-center -space-x-1.5">
                {sig.triggeredAgents.length === 0 ? (
                  <span className="text-[11.5px] text-muted">—</span>
                ) : (
                  sig.triggeredAgents.map((aid) => {
                    const a = AGENTS_BY_ID[aid];
                    return a ? (
                      <ToolIcon
                        key={aid}
                        color={a.color}
                        initials={a.initials}
                        size={20}
                        className="ring-2 ring-white"
                      />
                    ) : null;
                  })
                )}
              </div>
              <div className="w-[120px] text-[11.5px] text-muted truncate">
                {sig.firstSeenAt}
              </div>
              <div className="w-[150px] flex items-center gap-1">
                {sig.sources.map((s) => (
                  <SourceChip key={s} source={s} size="sm" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
