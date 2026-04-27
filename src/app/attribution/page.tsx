import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatCard, ToolIcon } from "@/components/ui/primitives";
import {
  AGENTS_BY_ID,
  ATTRIBUTION,
  OUTCOMES,
  OVERVIEW_KPIS,
} from "@/lib/fixtures";
import { pct } from "@/lib/utils";
import { TrendingUp, DollarSign, Target, Timer } from "lucide-react";

export default function AttributionPage() {
  const maxPipeline = Math.max(
    ...ATTRIBUTION.map((a) => parsePipeline(a.pipeline)),
  );

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Outcome Attribution"
        title="Which agents actually move the pipeline?"
        description="The Coordinator joins every preflight → action → CRM outcome. See influenced pipeline, win rate, cycle time, and ROI per agent — across vendors."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Attributed pipeline · 30d"
          value={OVERVIEW_KPIS.attributedPipeline30d}
          sublabel="From 142 agent-booked meetings"
          tone="brand"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Attributed revenue · 30d"
          value={OVERVIEW_KPIS.attributedRevenue30d}
          sublabel="Closed-won influenced by agents"
          tone="green"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="Blended win rate"
          value="28%"
          sublabel="Agent-sourced vs 24% baseline"
          tone="brand"
          icon={<Target className="w-4 h-4" />}
        />
        <StatCard
          label="Cycle time"
          value="42 days"
          sublabel="↓ 11 days vs human-only"
          tone="green"
          icon={<Timer className="w-4 h-4" />}
        />
      </div>

      <Card className="p-5">
        <Section
          title="Agent effectiveness · 30d"
          description="Multi-touch attribution across every agent decision."
        >
          <div className="mt-4 space-y-3">
            {ATTRIBUTION.map((a) => {
              const agent = AGENTS_BY_ID[a.agentId];
              const ratio = parsePipeline(a.pipeline) / maxPipeline;
              return (
                <div key={a.agentId} className="flex items-center gap-3">
                  {agent && (
                    <ToolIcon
                      color={agent.color}
                      initials={agent.initials}
                      size={22}
                    />
                  )}
                  <div className="w-[180px] min-w-0">
                    <div className="text-[13px] font-semibold text-ink-900 truncate">
                      {agent?.name ?? a.agentId}
                    </div>
                    <div className="text-[11px] text-muted">
                      {a.meetings} meetings
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                    <div className="w-[80px] text-right text-[12.5px] font-semibold text-ink-900 tabular">
                      {a.pipeline}
                    </div>
                  </div>
                  <div className="w-[80px] text-right text-[12px] text-ink-700 tabular">
                    {a.revenue}
                  </div>
                  <div className="w-[70px] text-right text-[12px] text-ink-700 tabular">
                    {pct(a.winRate, 0)}
                  </div>
                  <div className="w-[70px] text-right text-[12px] text-muted tabular">
                    {a.avgCycleDays > 0 ? `${a.avgCycleDays}d` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 pt-3 border-t border-border text-[10.5px] uppercase tracking-wide text-ink-500 font-semibold">
            <span className="ml-[calc(22px+12px+180px+12px)] flex-1">
              Influenced pipeline
            </span>
            <span className="w-[80px] text-right">Revenue</span>
            <span className="w-[70px] text-right">Win rate</span>
            <span className="w-[70px] text-right">Cycle</span>
          </div>
        </Section>
      </Card>

      <Card className="p-5">
        <Section
          title="Recent outcomes"
          description="Closed opportunities and the agents that touched them."
        >
          <ul className="mt-3 divide-y divide-border">
            {OUTCOMES.map((o) => (
              <li
                key={o.company}
                className="py-3 flex items-center gap-3 text-[12.5px]"
              >
                <div className="w-[200px] font-semibold text-ink-900 truncate">
                  {o.company}
                </div>
                <div className="w-[140px]">
                  <span
                    className={
                      o.stage === "Closed Won"
                        ? "chip bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "chip bg-blue-50 text-blue-700 border border-blue-200"
                    }
                  >
                    {o.stage}
                  </span>
                </div>
                <div className="w-[100px] text-ink-800 font-semibold tabular">
                  {o.amount}
                </div>
                <div className="flex-1 flex items-center gap-1 -space-x-1.5">
                  {o.influencedBy.map((aid) => {
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
                  })}
                </div>
                <div className="text-[11.5px] text-muted tabular">
                  {o.days}d cycle
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Card>
    </div>
  );
}

function parsePipeline(s: string): number {
  const n = parseFloat(s.replace(/[^\d.]/g, ""));
  if (s.includes("M")) return n * 1000;
  return n; // K
}
