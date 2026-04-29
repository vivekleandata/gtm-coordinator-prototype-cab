import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/primitives";
import { LiveDecisionFeed } from "@/components/live-decision-feed";
import { OVERVIEW_KPIS } from "@/lib/fixtures";
import { formatNumber, pct } from "@/lib/utils";
import { Gauge, Zap, Clock, ShieldCheck } from "lucide-react";

export default function PreflightPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Preflight API"
        title="The control point every agent calls before acting."
        description="A single deterministic decision — GO, NO_GO, WAIT, or REDIRECT — returned in under 500 ms p95. Every call is structured, reasoned, and appended to the immutable Action Ledger."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Requests · last 24h"
          value={formatNumber(OVERVIEW_KPIS.preflights24h)}
          sublabel="9 vendor agents + 3 in-house"
          tone="brand"
          icon={<Zap className="w-4 h-4" />}
        />
        <StatCard
          label="p95 latency"
          value={`${OVERVIEW_KPIS.p95LatencyMs} ms`}
          sublabel={`SLA ${OVERVIEW_KPIS.sla}`}
          tone="green"
          icon={<Gauge className="w-4 h-4" />}
        />
        <StatCard
          label="GO rate"
          value={pct(OVERVIEW_KPIS.goRate)}
          sublabel="Remaining: 10% NO_GO · 3% WAIT · 2% REDIRECT"
          tone="brand"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Uptime · 30d"
          value={OVERVIEW_KPIS.uptime30d}
          sublabel="Fail-open degrade: 0 incidents"
          tone="green"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Live feed */}
      <LiveDecisionFeed showFooter={false} />
    </div>
  );
}
