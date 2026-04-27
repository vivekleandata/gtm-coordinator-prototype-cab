import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatCard } from "@/components/ui/primitives";
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

      {/* API preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <Section
            title="Request"
            description="Agents call POST /v1/preflight before any action."
          >
            <pre className="mt-3 p-4 rounded-md bg-ink-900 text-ink-100 text-[11.5px] leading-relaxed overflow-auto font-mono">
              {`POST /v1/preflight
Authorization: Bearer sk_live_...7f3a

{
  "agent_id":   "agt_11x_alice",
  "action":     "send_email",
  "record": {
    "identifier":      "jane@bigcorp.com",
    "identifier_type": "email"
  },
  "context": {
    "campaign_id":   "q2-outbound",
    "sequence_step": 3
  }
}`}
            </pre>
          </Section>
        </Card>
        <Card className="p-5">
          <Section
            title="Response"
            description="Decision + reason + binding outcome token — all in one call."
          >
            <pre className="mt-3 p-4 rounded-md bg-ink-900 text-ink-100 text-[11.5px] leading-relaxed overflow-auto font-mono">
              {`200 OK
x-coordinator-latency: 142ms

{
  "decision":         "WAIT",
  "request_id":       "req_01HXYZ2H9E",
  "record_id":        "rec_jane_bigcorp",
  "reason":           "owner_cooldown",
  "reason_detail":    "Owner Mike Chen touched 11 min ago — cooldown 15m",
  "retry_after_ms":   240000,
  "policy_triggered": ["pol_ent_approval"],
  "ruleset_version":  "v2026.04.1",
  "ledger_offset":    24518472
}`}
            </pre>
          </Section>
        </Card>
      </div>

      {/* Live feed */}
      <LiveDecisionFeed showFooter={false} />
    </div>
  );
}
