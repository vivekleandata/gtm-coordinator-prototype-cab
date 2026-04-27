"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Beaker,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import {
  AGENT_ECONOMICS,
  AGENTS_BY_ID,
  ATTRIBUTION,
  ATTRIBUTION_COUNTERFACTUAL,
  ATTRIBUTION_STUDY,
  AVOIDED_COST,
  MEETING_QUALITY,
  METHODOLOGY_NOTES,
  OUTCOMES,
  type AgentAttribution,
  type AttributionMethod,
} from "@/lib/fixtures";
import { cn, pct } from "@/lib/utils";

const METHODS: AttributionMethod[] = ["first-touch", "linear", "shapley"];

function formatDollars(thousands: number): string {
  if (thousands === 0) return "$0";
  if (thousands >= 1000) {
    const m = thousands / 1000;
    return `$${m.toFixed(m >= 10 ? 1 : 2)}M`;
  }
  return `$${Math.round(thousands)}K`;
}

function formatDelta(thousands: number): string {
  const sign = thousands >= 0 ? "+" : "−";
  return `${sign}${formatDollars(Math.abs(thousands))}`;
}

export default function AttributionPage() {
  const [method, setMethod] = useState<AttributionMethod>("shapley");
  const [recomputing, setRecomputing] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const counterfactual = ATTRIBUTION_COUNTERFACTUAL[method];

  function pickMethod(next: AttributionMethod) {
    if (next === method) return;
    setRecomputing(true);
    setMethod(next);
    window.setTimeout(() => setRecomputing(false), 520);
  }

  const sortedAttribution = useMemo(
    () =>
      [...ATTRIBUTION].sort(
        (a, b) => b.pipelineByMethod[method] - a.pipelineByMethod[method],
      ),
    [method],
  );

  const totalAttributed = useMemo(
    () => ATTRIBUTION.reduce((sum, a) => sum + a.pipelineByMethod[method], 0),
    [method],
  );

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Outcome attribution"
        title="Attributed pipeline against a matched-holdout baseline."
        description="Every Coordinator decision lands on an account. We hold out a CUPED-style synthetic control built from pre-period firmographic and intent features, then compute multi-touch credit across agents. Switch methodology to see how credit reshapes."
        actions={
          <>
            <Link
              href="/ledger"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              Open ledger
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
            >
              Export to board deck
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      />

      <CounterfactualHero
        method={method}
        onMethod={pickMethod}
        recomputing={recomputing}
        counterfactual={counterfactual}
        methodologyOpen={methodologyOpen}
        onToggleMethodology={() => setMethodologyOpen((v) => !v)}
      />

      <AvoidedCostBlock />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        <AgentEffectivenessCard
          method={method}
          recomputing={recomputing}
          rows={sortedAttribution}
          totalAttributed={totalAttributed}
        />
        <MeetingQualityCard />
      </div>

      <CostPerOppCard method={method} />

      <RecentOutcomesCard />

      <Card className="p-5">
        <Section
          title="Methodology — for the auditor in the room"
          description="Why this number survives a Finance review."
        >
          <MethodologyDetails method={method} />
        </Section>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero — counterfactual + methodology toggle

function CounterfactualHero({
  method,
  onMethod,
  recomputing,
  counterfactual,
  methodologyOpen,
  onToggleMethodology,
}: {
  method: AttributionMethod;
  onMethod: (m: AttributionMethod) => void;
  recomputing: boolean;
  counterfactual: (typeof ATTRIBUTION_COUNTERFACTUAL)[AttributionMethod];
  methodologyOpen: boolean;
  onToggleMethodology: () => void;
}) {
  const note = METHODOLOGY_NOTES[method];
  const lift = counterfactual.liftK;
  const liftPct = counterfactual.liftPct;

  return (
    <Card className="overflow-hidden p-0" emphasis>
      <div className="px-5 pt-4 pb-3 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-brand-700" />
          <span className="text-[11.5px] uppercase tracking-wider font-semibold text-brand-700">
            Multi-touch attribution · matched-holdout
          </span>
          <StatusChip tone="green">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              {counterfactual.pValue}
            </span>
          </StatusChip>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
            Methodology
          </span>
          <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => onMethod(m)}
                className={cn(
                  "h-7 px-2.5 rounded text-[12px] font-medium transition-colors",
                  m === method
                    ? "bg-brand text-white"
                    : "text-ink-700 hover:bg-ink-50",
                )}
              >
                {METHODOLOGY_NOTES[m].label}
              </button>
            ))}
          </div>
          <button
            onClick={onToggleMethodology}
            className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-border bg-surface hover:bg-ink-50 text-[11.5px] font-medium text-ink-700"
            aria-label="Methodology details"
          >
            <Info className="w-3.5 h-3.5" />
            {methodologyOpen ? "Hide method" : "Method"}
            {methodologyOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="px-6 pt-6 pb-5 relative">
          <div className="text-[12px] uppercase tracking-wider font-semibold text-muted">
            Attributed pipeline · 90d
          </div>
          <div className="mt-2 flex items-baseline gap-3 flex-wrap">
            <span
              className={cn(
                "hero-serif text-[56px] leading-none font-semibold tracking-tight text-ink-900 tabular transition-opacity",
                recomputing && "opacity-50",
              )}
            >
              {formatDollars(counterfactual.attributedPipelineK)}
            </span>
            <span className="text-[15px] text-muted">attributed</span>
            <span className="text-[24px] text-ink-400 font-light">·</span>
            <span
              className={cn(
                "text-[28px] leading-none font-semibold text-ink-500 tabular transition-opacity",
                recomputing && "opacity-50",
              )}
            >
              {formatDollars(counterfactual.baselinePipelineK)}
            </span>
            <span className="text-[13px] text-muted">
              matched-holdout baseline
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold tabular">
              <TrendingUp className="w-3 h-3 mr-1 inline-block" />
              {formatDelta(lift)} lift · {pct(liftPct, 1)}
            </span>
            <span className="chip border border-ink-200 bg-ink-50 text-ink-700 tabular">
              {counterfactual.pValue}
            </span>
            <span className="chip border border-ink-200 bg-ink-50 text-ink-700 tabular">
              n = {ATTRIBUTION_STUDY.treatedAccounts.toLocaleString()} accounts
            </span>
            <span className="chip border border-ink-200 bg-ink-50 text-ink-700 tabular">
              95% CI [{formatDollars(counterfactual.confidenceLow)},{" "}
              {formatDollars(counterfactual.confidenceHigh)}]
            </span>
            <span className="chip border border-ink-200 bg-ink-50 text-ink-700">
              {note.label}
            </span>
          </div>

          <p className="mt-4 text-[13px] text-ink-700 leading-relaxed max-w-2xl">
            <span className="font-semibold text-ink-900">{note.label}.</span>{" "}
            {note.oneLiner}{" "}
            <span className="text-muted">
              Recomputed against the same {ATTRIBUTION_STUDY.treatedAccounts}
              -account treated cohort and {ATTRIBUTION_STUDY.controlAccounts}
              -account matched control. The lift number changes with method; the
              n and p-value do not.
            </span>
          </p>

          {recomputing && (
            <div className="absolute top-4 right-5 inline-flex items-center gap-1.5 text-[11.5px] text-brand-700 font-medium animate-fade-in">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Recomputing on {ATTRIBUTION_STUDY.treatedAccounts} accounts…
            </div>
          )}
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-border bg-ink-50/50 px-5 py-4 grid grid-cols-2 gap-3">
          <SidekickStat
            label="Attributed revenue"
            value={formatDollars(counterfactual.attributedRevenueK)}
            sub={`vs ${formatDollars(counterfactual.baselineRevenueK)} baseline`}
            tone="brand"
            recomputing={recomputing}
          />
          <SidekickStat
            label="Blended win rate"
            value={pct(counterfactual.blendedWinRate, 0)}
            sub={`vs ${pct(counterfactual.baselineWinRate, 0)} baseline`}
            tone="green"
            recomputing={recomputing}
          />
          <SidekickStat
            label="Cycle time"
            value={`${counterfactual.cycleDays}d`}
            sub={`↓ ${counterfactual.baselineCycleDays - counterfactual.cycleDays}d vs baseline`}
            tone="green"
            recomputing={recomputing}
          />
          <SidekickStat
            label="Cohort window"
            value={`${ATTRIBUTION_STUDY.windowDays}d`}
            sub={`${ATTRIBUTION_STUDY.cohortStart} → ${ATTRIBUTION_STUDY.cohortEnd}`}
            tone="brand"
            recomputing={recomputing}
          />
        </div>
      </div>

      {methodologyOpen && (
        <div className="border-t border-border bg-ink-50/40 px-6 py-4 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {METHODS.map((m) => {
              const n = METHODOLOGY_NOTES[m];
              const cf = ATTRIBUTION_COUNTERFACTUAL[m];
              const active = m === method;
              return (
                <div
                  key={m}
                  className={cn(
                    "rounded-md border p-3 transition-colors",
                    active
                      ? "border-brand-200 bg-brand-50/50"
                      : "border-border bg-surface",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink-900">
                      {n.label}
                    </span>
                    {active && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                    )}
                  </div>
                  <p className="mt-1 text-[11.5px] text-ink-700 leading-snug">
                    {n.oneLiner}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted leading-snug">
                    {n.details}
                  </p>
                  <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] tabular">
                    <span className="text-muted">Lift</span>
                    <span className="font-semibold text-ink-800">
                      {formatDelta(cf.liftK)} · {pct(cf.liftPct, 1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

function SidekickStat({
  label,
  value,
  sub,
  tone,
  recomputing,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "brand" | "green";
  recomputing: boolean;
}) {
  const dot = tone === "brand" ? "before:bg-brand" : "before:bg-emerald-500";
  return (
    <div
      className={cn(
        "relative rounded-md border border-border bg-surface p-3 overflow-hidden",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-[2px]",
        dot,
      )}
    >
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-[20px] font-semibold tracking-tight text-ink-900 tabular display transition-opacity",
          recomputing && "opacity-50",
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-muted tabular mt-0.5">{sub}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avoided cost — collisions translated to dollars

function AvoidedCostBlock() {
  const a = AVOIDED_COST;
  return (
    <Card className="p-5">
      <Section
        title="Pipeline protected by the Coordinator"
        description="Decisions the agent stack would have made without preflight, blocked at the gate. Translated into dollars at the average $14K-per-Tier-1-touch cost of duplicate outreach."
      >
        <div className="mt-2 grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4">
          <div className="rounded-md border border-border bg-ink-50/60 p-4">
            <div className="text-[11.5px] uppercase tracking-wider font-semibold text-muted">
              Avoided cost · 30d
            </div>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-[12px] text-ink-700 tabular">
                {a.collisionsBlocked} collisions blocked
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
              <span className="text-[12px] text-ink-700 tabular">
                {a.duplicateTouchesBlocked} duplicate touches
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
              <span className="text-[12px] text-ink-700 tabular">
                {a.prospectsRetained} prospects retained
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="hero-serif text-[36px] leading-none font-semibold text-ink-900 tabular">
                {formatDollars(a.pipelineProtectedK)}
              </span>
              <span className="text-[13px] text-muted">pipeline protected</span>
              <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold tabular">
                +{formatDollars(a.revenueProtectedK)} revenue at our win rate
              </span>
            </div>
            <p className="mt-3 text-[12px] text-muted leading-snug">
              This is the number Finance asks for and the dashboard hasn&apos;t
              had: the dollar value of the touches we prevented from happening.
              It does not double-count attributed pipeline — it represents
              accounts the stack would have burned out instead of advancing.
            </p>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="px-3 py-2 bg-ink-50/60 border-b border-border text-[11px] uppercase tracking-wider font-semibold text-ink-600">
              By policy · last 30d
            </div>
            <ul className="divide-y divide-border">
              {a.byPolicy.map((p) => (
                <li
                  key={p.policyId}
                  className="px-3 py-2 flex items-center gap-3 text-[12.5px]"
                >
                  <Link
                    href={`/policies/${p.policyId}/edit`}
                    className="font-medium text-ink-800 hover:text-brand-700 truncate flex-1"
                  >
                    {p.label}
                  </Link>
                  <span className="text-muted tabular w-[80px] text-right">
                    {p.blocked} blocked
                  </span>
                  <span className="font-semibold text-ink-900 tabular w-[64px] text-right">
                    {formatDollars(p.protectedK)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Per-agent effectiveness — the methodology-driven split

function AgentEffectivenessCard({
  method,
  recomputing,
  rows,
  totalAttributed,
}: {
  method: AttributionMethod;
  recomputing: boolean;
  rows: AgentAttribution[];
  totalAttributed: number;
}) {
  const max = Math.max(...rows.map((r) => r.pipelineByMethod[method]), 1);
  return (
    <Card className="p-5">
      <Section
        title="Per-agent attribution split"
        description={`Pipeline credit by agent under the ${METHODOLOGY_NOTES[method].label.toLowerCase()} model. Every bar resizes when methodology changes.`}
        action={
          <StatusChip tone="brand">
            <span className="inline-flex items-center gap-1 tabular">
              <BarChart3 className="w-3 h-3" />
              {METHODOLOGY_NOTES[method].label}
            </span>
          </StatusChip>
        }
      >
        <div
          className={cn(
            "mt-3 space-y-2 transition-opacity",
            recomputing && "opacity-60",
          )}
        >
          {rows.map((row) => {
            const agent = AGENTS_BY_ID[row.agentId];
            const pipelineK = row.pipelineByMethod[method];
            const revenueK = row.revenueByMethod[method];
            const ratio = pipelineK / max;
            const share = totalAttributed > 0 ? pipelineK / totalAttributed : 0;
            return (
              <div
                key={row.agentId}
                className="grid grid-cols-[24px_minmax(160px,200px)_minmax(0,1fr)_72px_72px_60px_60px] items-center gap-3 text-[12.5px]"
              >
                {agent && (
                  <ToolIcon
                    color={agent.color}
                    initials={agent.initials}
                    size={22}
                  />
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900 truncate">
                    {agent?.name ?? row.agentId}
                  </div>
                  <div className="text-[11px] text-muted">
                    {row.meetings > 0
                      ? `${row.meetings} meetings · ${pct(share, 0)} share`
                      : `assist-only · ${pct(share, 0)} share`}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full bg-brand transition-[width] duration-500 ease-out"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <div className="text-right font-semibold text-ink-900 tabular">
                  {formatDollars(pipelineK)}
                </div>
                <div className="text-right text-ink-700 tabular">
                  {revenueK > 0 ? formatDollars(revenueK) : "—"}
                </div>
                <div className="text-right text-ink-700 tabular">
                  {row.winRate > 0 ? pct(row.winRate, 0) : "—"}
                </div>
                <div className="text-right text-muted tabular">
                  {row.avgCycleDays > 0 ? `${row.avgCycleDays}d` : "—"}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-[24px_minmax(160px,200px)_minmax(0,1fr)_72px_72px_60px_60px] items-center gap-3 pt-2 border-t border-border text-[10.5px] uppercase tracking-wide text-ink-500 font-semibold">
          <span />
          <span />
          <span>Pipeline · {METHODOLOGY_NOTES[method].label}</span>
          <span className="text-right">Pipeline</span>
          <span className="text-right">Revenue</span>
          <span className="text-right">Win</span>
          <span className="text-right">Cycle</span>
        </div>
      </Section>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Meeting quality — agent-booked vs AE-booked

function MeetingQualityCard() {
  const [agent, ae] = MEETING_QUALITY;
  const rows: Array<{
    label: string;
    agentVal: string;
    aeVal: string;
    delta: string;
    deltaTone: "green" | "amber" | "neutral";
  }> = [
    {
      label: "Show rate",
      agentVal: pct(agent.showRate, 0),
      aeVal: pct(ae.showRate, 0),
      delta: `${Math.round((agent.showRate - ae.showRate) * 100)}pp`,
      deltaTone: agent.showRate >= ae.showRate ? "green" : "amber",
    },
    {
      label: "SAO conversion",
      agentVal: pct(agent.saoRate, 0),
      aeVal: pct(ae.saoRate, 0),
      delta: `${Math.round((agent.saoRate - ae.saoRate) * 100)}pp`,
      deltaTone: agent.saoRate >= ae.saoRate ? "green" : "amber",
    },
    {
      label: "Stage-2 reach",
      agentVal: pct(agent.stage2Rate, 0),
      aeVal: pct(ae.stage2Rate, 0),
      delta: `${Math.round((agent.stage2Rate - ae.stage2Rate) * 100)}pp`,
      deltaTone: agent.stage2Rate >= ae.stage2Rate ? "green" : "amber",
    },
    {
      label: "Closed-won rate",
      agentVal: pct(agent.closedWonRate, 0),
      aeVal: pct(ae.closedWonRate, 0),
      delta: `${Math.round((agent.closedWonRate - ae.closedWonRate) * 100)}pp`,
      deltaTone: agent.closedWonRate >= ae.closedWonRate ? "green" : "amber",
    },
    {
      label: "Avg deal size",
      agentVal: formatDollars(agent.avgDealSizeK),
      aeVal: formatDollars(ae.avgDealSizeK),
      delta: `${Math.round(agent.avgDealSizeK - ae.avgDealSizeK)}K`,
      deltaTone: agent.avgDealSizeK >= ae.avgDealSizeK ? "green" : "neutral",
    },
  ];

  return (
    <Card className="p-5">
      <Section
        title="Meeting quality · agent vs AE"
        description="The CRO board ask. Agent-booked meetings are within 5pp of AE-booked on every quality metric."
      >
        <div className="mt-3 grid grid-cols-2 gap-2">
          <QualityHeader label="Agent-booked" count={agent.meetings} accent />
          <QualityHeader label="AE-booked" count={ae.meetings} />
        </div>
        <ul className="mt-2 divide-y divide-border">
          {rows.map((r) => (
            <li
              key={r.label}
              className="py-2 grid grid-cols-[1fr_60px_60px_56px] items-center gap-2"
            >
              <span className="text-[12px] text-muted">{r.label}</span>
              <span className="text-[13px] font-semibold text-ink-900 tabular text-right">
                {r.agentVal}
              </span>
              <span className="text-[13px] text-ink-700 tabular text-right">
                {r.aeVal}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold tabular text-right",
                  r.deltaTone === "green" && "text-emerald-700",
                  r.deltaTone === "amber" && "text-amber-700",
                  r.deltaTone === "neutral" && "text-ink-500",
                )}
              >
                {r.delta}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 pt-2 border-t border-border text-[11.5px] text-muted leading-snug">
          Quality holds; volume is +48% from agent-booked. The story for the
          board is:{" "}
          <span className="text-ink-700 font-medium">
            same quality, more meetings
          </span>{" "}
          — not{" "}
          <span className="text-ink-700 font-medium">
            cheap meetings that don&apos;t close
          </span>
          .
        </p>
      </Section>
    </Card>
  );
}

function QualityHeader({
  label,
  count,
  accent,
}: {
  label: string;
  count: number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2.5 py-1.5",
        accent
          ? "border-brand-200 bg-brand-50/60"
          : "border-border bg-ink-50/40",
      )}
    >
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-600">
        {label}
      </div>
      <div className="text-[15px] font-semibold text-ink-900 tabular">
        {count} meetings
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cost per opp across the agent stack

function CostPerOppCard({ method }: { method: AttributionMethod }) {
  const rows = AGENT_ECONOMICS.map((e) => {
    const attribution = ATTRIBUTION.find((a) => a.agentId === e.agentId);
    const pipelineK = attribution?.pipelineByMethod[method] ?? 0;
    const dollarsBack = e.monthlyCostK > 0 ? pipelineK / e.monthlyCostK : 0;
    return { ...e, pipelineK, dollarsBack };
  }).sort((a, b) => b.dollarsBack - a.dollarsBack);
  const totalCost = rows.reduce((sum, r) => sum + r.monthlyCostK, 0);
  const totalPipeline = rows.reduce((sum, r) => sum + r.pipelineK, 0);
  const blendedReturn = totalCost > 0 ? totalPipeline / totalCost : 0;

  return (
    <Card className="p-5">
      <Section
        title="Cost per opp across the agent stack"
        description="License + usage cost per agent vs pipeline returned under the active methodology. The two columns at right are the only ones that re-rank when you switch method."
        action={
          <StatusChip tone="brand">
            Stack: ${totalCost}K/mo · {formatDollars(totalPipeline)} returned ·{" "}
            {Math.round(blendedReturn)}× blended
          </StatusChip>
        }
      >
        <div className="mt-3 rounded-md border border-border overflow-hidden">
          <div className="grid grid-cols-[24px_minmax(160px,1.2fr)_80px_80px_84px_minmax(0,1fr)_80px] items-center gap-3 px-3 py-2 bg-ink-50/60 border-b border-border text-[10.5px] uppercase tracking-wide font-semibold text-ink-600">
            <span />
            <span>Agent</span>
            <span className="text-right">$/mo</span>
            <span className="text-right">Opps · 30d</span>
            <span className="text-right">$/opp</span>
            <span>Return on spend</span>
            <span className="text-right">Pipeline</span>
          </div>
          <ul className="divide-y divide-border">
            {rows.map((r) => {
              const agent = AGENTS_BY_ID[r.agentId];
              const maxReturn = Math.max(...rows.map((x) => x.dollarsBack), 1);
              const ratio = r.dollarsBack / maxReturn;
              const isOutlier = r.dollarsBack < 20 && r.monthlyCostK > 0;
              return (
                <li
                  key={r.agentId}
                  className="grid grid-cols-[24px_minmax(160px,1.2fr)_80px_80px_84px_minmax(0,1fr)_80px] items-center gap-3 px-3 py-2 text-[12.5px]"
                >
                  {agent && (
                    <ToolIcon
                      color={agent.color}
                      initials={agent.initials}
                      size={22}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900 truncate">
                      {agent?.name ?? r.agentId}
                    </div>
                    <div className="text-[10.5px] text-muted">
                      {agent?.vendor ?? "—"}
                    </div>
                  </div>
                  <span className="text-right text-ink-800 tabular">
                    ${r.monthlyCostK}K
                  </span>
                  <span className="text-right text-ink-700 tabular">
                    {r.oppsCreated30d > 0 ? r.oppsCreated30d : "—"}
                  </span>
                  <span className="text-right text-ink-700 tabular">
                    {r.costPerOppK > 0
                      ? `$${(r.costPerOppK * 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                      : "—"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-[width] duration-500",
                          isOutlier ? "bg-amber-400" : "bg-brand",
                        )}
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[11.5px] font-semibold tabular w-[44px] text-right",
                        isOutlier ? "text-amber-700" : "text-ink-800",
                      )}
                    >
                      {Math.round(r.dollarsBack)}×
                    </span>
                  </div>
                  <span className="text-right text-ink-900 font-semibold tabular">
                    {r.pipelineK > 0 ? formatDollars(r.pipelineK) : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-2 text-[11.5px] text-muted leading-snug">
          ZoomInfo Signals returns 10× under Shapley (vs ~5× under first-touch)
          because spread methods reward the assist-only motions enrichment and
          intent agents actually run. The CRO question — &quot;which line items
          do I cut?&quot; — has a different answer per methodology, which is
          itself the argument for showing all three.
        </p>
      </Section>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Recent outcomes (kept, demoted)

function RecentOutcomesCard() {
  return (
    <Card className="p-5">
      <Section
        title="Recent closed & late-stage opportunities"
        description="The 5 most recent treated-cohort outcomes feeding the model."
      >
        <ul className="mt-2 divide-y divide-border">
          {OUTCOMES.map((o) => (
            <li
              key={o.company}
              className="py-2.5 flex items-center gap-3 text-[12.5px]"
            >
              <div className="w-[200px] font-semibold text-ink-900 truncate">
                {o.company}
              </div>
              <div className="w-[120px]">
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
              <div className="w-[80px] text-ink-800 font-semibold tabular">
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
  );
}

// ---------------------------------------------------------------------------
// Methodology details / footnote

function MethodologyDetails({ method }: { method: AttributionMethod }) {
  const note = METHODOLOGY_NOTES[method];
  return (
    <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-md border border-border bg-ink-50/40 p-4 space-y-3 text-[12.5px] text-ink-700 leading-relaxed">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-ink-900">
              How the baseline is built
            </div>
            <p className="mt-1">
              We hold {ATTRIBUTION_STUDY.controlAccounts} accounts out of the
              Coordinator-treated cohort, matched 1:1 against the treated set on{" "}
              <span className="font-medium text-ink-800">
                {ATTRIBUTION_STUDY.matchedFeatures.join(" · ")}
              </span>
              . Pipeline and revenue figures for the control set come from{" "}
              <span className="font-medium text-ink-800">
                {ATTRIBUTION_STUDY.controlSource}
              </span>
              . The model reuses the experiment harness from{" "}
              <span className="font-mono text-[11.5px] text-ink-800">
                {ATTRIBUTION_STUDY.inheritedFromAgp}
              </span>{" "}
              so the same pre-period adjustment runs against both arms.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-ink-900">
              How {note.label.toLowerCase()} assigns credit
            </div>
            <p className="mt-1">{note.details}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-ink-900">
              What the lift number is not
            </div>
            <p className="mt-1">
              The lift is incremental pipeline above the matched-holdout
              baseline — not gross attributed pipeline minus zero. It does not
              double-count the avoided-cost number above; that is pipeline that
              never entered the funnel in either arm.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border p-4 space-y-3 text-[12px]">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted">
            Cohort
          </div>
          <div className="mt-0.5 text-ink-800 tabular">
            {ATTRIBUTION_STUDY.cohortStart} → {ATTRIBUTION_STUDY.cohortEnd}
          </div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted">
            Treated · control
          </div>
          <div className="mt-0.5 text-ink-800 tabular">
            n = {ATTRIBUTION_STUDY.treatedAccounts} ·{" "}
            {ATTRIBUTION_STUDY.controlAccounts}
          </div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted">
            Matched on
          </div>
          <ul className="mt-1 space-y-0.5">
            {ATTRIBUTION_STUDY.matchedFeatures.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-ink-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t border-border text-[11px] text-muted tabular">
          Refreshed {ATTRIBUTION_STUDY.refreshedAt}
        </div>
      </div>
    </div>
  );
}
