import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Bot,
  Activity,
  ArrowRight,
  Scroll,
} from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import {
  Card,
  StatCard,
  StatusChip,
  ToolIcon,
} from "@/components/ui/primitives";
import { LiveDecisionFeed } from "@/components/live-decision-feed";
import { DecisionStackedBars } from "@/components/decision-stacked-bars";
import {
  AGENTS,
  AGENTS_BY_ID,
  COLLISIONS,
  OVERVIEW_KPIS,
  RECORDS,
  RECORDS_BY_ID,
} from "@/lib/fixtures";
import { formatNumber, pct } from "@/lib/utils";

export default function CommandCenter() {
  const topContested = [...RECORDS]
    .sort((a, b) => b.conflicts7d - a.conflicts7d)
    .slice(0, 4);

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-8">
      <PageHeader
        eyebrow="Command Center"
        title="Every AI agent in your GTM stack, coordinated."
        description="The control plane that 12 registered agents call before every action — authorizing, deconflicting, and attributing outcomes across 4,521 preflight requests in the last 24 hours."
        actions={
          <>
            <Link
              href="/preflight"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              <Zap className="w-3.5 h-3.5 text-brand" />
              Open live stream
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
            >
              Register agent <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Preflights · 24h"
          value={formatNumber(OVERVIEW_KPIS.preflights24h)}
          sublabel={`↑ 12.3% vs yesterday · p95 ${OVERVIEW_KPIS.p95LatencyMs} ms`}
          tone="brand"
          icon={<Zap className="w-4 h-4" />}
        />
        <StatCard
          label="GO rate"
          value={pct(OVERVIEW_KPIS.goRate)}
          sublabel={`${formatNumber(OVERVIEW_KPIS.goCount)} authorized actions`}
          tone="green"
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          label="Collisions prevented"
          value={formatNumber(OVERVIEW_KPIS.collisions24h)}
          sublabel={`${pct(OVERVIEW_KPIS.collisionRate)} of traffic · resolved in ≤10 ms`}
          tone="amber"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Active agents"
          value={String(OVERVIEW_KPIS.activeAgents)}
          sublabel={`${OVERVIEW_KPIS.pausedAgents} paused · 1 throttled`}
          tone="brand"
          icon={<Bot className="w-4 h-4" />}
        />
      </div>

      {/* Live stream (hero) */}
      <LiveDecisionFeed limit={8} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision distribution */}
        <Card className="lg:col-span-2 p-5">
          <Section
            title="Decision distribution · last 7 days"
            description="Every preflight call classified at the edge in sub-300 ms."
            action={
              <div className="flex items-center gap-3 text-[11.5px] text-muted">
                <LegendDot color="bg-emerald-500" label="GO" />
                <LegendDot color="bg-amber-500" label="WAIT" />
                <LegendDot color="bg-blue-500" label="REDIRECT" />
                <LegendDot color="bg-red-500" label="NO_GO" />
              </div>
            }
          >
            <DecisionStackedBars />
          </Section>
        </Card>

        {/* Agent health */}
        <Card className="p-5">
          <Section
            title="Agent health"
            description="12 agents across 7 vendors"
            action={
              <Link
                href="/directory/agents"
                className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
              >
                All agents <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <ul className="space-y-2 mt-2">
              {AGENTS.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center gap-2.5">
                  <ToolIcon color={a.color} initials={a.initials} size={22} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium text-ink-800 truncate">
                      {a.name}
                    </div>
                    <div className="text-[10.5px] text-muted tabular">
                      {formatNumber(a.preflights24h)} preflights ·{" "}
                      {pct(a.goRate, 0)} GO
                    </div>
                  </div>
                  {a.status === "active" && (
                    <StatusChip tone="green">Active</StatusChip>
                  )}
                  {a.status === "paused" && (
                    <StatusChip tone="neutral">Paused</StatusChip>
                  )}
                  {a.status === "throttled" && (
                    <StatusChip tone="amber">Throttled</StatusChip>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top contested records */}
        <Card className="p-5">
          <Section
            title="Top contested records"
            description="Where agents disagree the most — a signal for rule tuning."
            action={
              <Link
                href="/collisions"
                className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
              >
                Collisions <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <ul className="mt-2 divide-y divide-border">
              {topContested.map((r) => (
                <li key={r.id} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/records/${r.id}`}
                      className="text-[13px] font-medium text-ink-900 hover:text-brand-700"
                    >
                      {r.name}
                    </Link>
                    <div className="text-[11.5px] text-muted truncate">
                      {r.title} · {r.company}
                    </div>
                  </div>
                  <div className="flex items-center -space-x-1.5">
                    {r.agentsActive.map((aid) => {
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
                  <div className="w-16 text-right">
                    <div className="text-[13px] font-semibold text-ink-900 tabular">
                      {r.conflicts7d}
                    </div>
                    <div className="text-[10px] text-muted">conflicts · 7d</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </Card>

        {/* Recent collisions */}
        <Card className="p-5">
          <Section
            title="Recent collisions"
            description="Detected, resolved, logged — all under 10 ms."
            action={
              <Link
                href="/ledger"
                className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
              >
                <Scroll className="w-3 h-3" /> Ledger
              </Link>
            }
          >
            <ul className="mt-2 space-y-2.5">
              {COLLISIONS.slice(0, 4).map((c) => {
                const rec = RECORDS_BY_ID[c.recordId];
                const agentA = AGENTS_BY_ID[c.agentA];
                const agentB = AGENTS_BY_ID[c.agentB];
                return (
                  <li
                    key={c.id}
                    className="p-3 rounded-md border border-border bg-ink-50/40"
                  >
                    <div className="flex items-center gap-2 text-[11.5px] text-muted mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                      <span className="uppercase tracking-wide font-semibold text-ink-700">
                        {c.type.replace("-", " ")}
                      </span>
                      <span className="tabular">· {c.detectedAt}</span>
                      <span className="ml-auto tabular">{c.latencyMs} ms</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12.5px] text-ink-800">
                      {agentA && (
                        <ToolIcon
                          color={agentA.color}
                          initials={agentA.initials}
                          size={18}
                        />
                      )}
                      <span className="font-medium">{agentA?.name}</span>
                      <span className="text-muted">vs</span>
                      {agentB && (
                        <ToolIcon
                          color={agentB.color}
                          initials={agentB.initials}
                          size={18}
                        />
                      )}
                      <span className="font-medium">{agentB?.name}</span>
                      {rec && (
                        <>
                          <span className="text-muted">on</span>
                          <span>{rec.name}</span>
                        </>
                      )}
                    </div>
                    <div className="text-[11.5px] text-ink-600 mt-1">
                      → {c.resolution}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>
        </Card>
      </div>

      {/* Footer outcomes */}
      <Card className="p-5" emphasis>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <div className="text-[11px] uppercase tracking-wider text-brand font-semibold mb-1">
              Outcomes attributed · 30d
            </div>
            <h3 className="text-[20px] font-semibold hero-serif text-ink-900">
              {OVERVIEW_KPIS.attributedPipeline30d} pipeline ·{" "}
              {OVERVIEW_KPIS.attributedRevenue30d} closed revenue
            </h3>
            <p className="text-[12.5px] text-muted mt-1">
              {OVERVIEW_KPIS.meetingsBooked30d} meetings booked by agents · avg{" "}
              {OVERVIEW_KPIS.avgTimeToMeetingDays} days first‑touch to meeting
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/attribution"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              <Activity className="w-3.5 h-3.5 text-brand" /> Attribution
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
