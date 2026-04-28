"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Coins,
  Pencil,
  Play,
  Plus,
  ShieldCheck,
  Timer,
  Wifi,
} from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import {
  POLICY_VERSIONS,
  type Policy,
  type PolicyCategory,
} from "@/lib/fixtures";
import { cn } from "@/lib/utils";

const typeLabel: Record<string, string> = {
  sequence: "Sequence",
  approval: "Approval",
  priority: "Priority",
  channel: "Channel",
  "quiet-hours": "Quiet hours",
  budget: "Budget",
};

const enforcementTone = {
  block: "red",
  warn: "amber",
  redirect: "brand",
} as const;

type CategoryDef = {
  key: PolicyCategory;
  label: string;
  blurb: string;
};

type AnyTab = "all" | PolicyCategory;

export function PoliciesClient({
  policies,
  categories,
}: {
  policies: Policy[];
  categories: CategoryDef[];
}) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") as AnyTab | null;
  const validKeys = new Set<AnyTab>(["all", ...categories.map((c) => c.key)]);
  const [active, setActive] = useState<AnyTab>(
    initial && validKeys.has(initial) ? initial : "all",
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: policies.length };
    for (const cat of categories) {
      c[cat.key] = policies.filter((p) => p.category === cat.key).length;
    }
    return c;
  }, [policies, categories]);

  const visible = useMemo(
    () =>
      active === "all"
        ? policies
        : policies.filter((p) => p.category === active),
    [active, policies],
  );

  const activeCategory = categories.find((c) => c.key === active);
  const newPolicyHref =
    active === "all" ? "/policies/new" : `/policies/new?category=${active}`;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Policy Engine"
        title="One place for every rule that governs agent behavior."
        description="Identity, communication budgets, sequencing, stage gates, approvals, compliance — all compiled to the same fast rules engine evaluated inside the 500 ms preflight budget. Author with chips, simulate against real traffic, diff vs. live, roll back."
        actions={
          <>
            <Link
              href="/policies/pol_ent_approval/edit"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              <Play className="w-3.5 h-3.5" /> Simulate a policy
            </Link>
            <Link
              href={newPolicyHref}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
            >
              <Plus className="w-3.5 h-3.5" /> New policy
            </Link>
          </>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center gap-1.5 flex-wrap border-b border-border -mx-1 px-1 pb-0.5">
          <Tab
            label="All"
            count={counts.all}
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {categories.map((cat) => (
            <Tab
              key={cat.key}
              label={cat.label}
              count={counts[cat.key] ?? 0}
              active={active === cat.key}
              onClick={() => setActive(cat.key)}
            />
          ))}
        </div>
        {activeCategory && (
          <p className="text-[12px] text-muted">{activeCategory.blurb}</p>
        )}
      </div>

      {active === "communication-budgets" && <BudgetEvaluationOrder />}

      {visible.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-[13px] text-muted">
            No policies in this category yet.
          </div>
          <Link
            href={newPolicyHref}
            className="inline-flex items-center gap-1.5 mt-3 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Create the first one
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((p) => (
            <PolicyCard key={p.id} policy={p} />
          ))}
        </div>
      )}

      <Card className="p-5" emphasis>
        <Section
          title="Why a builder, not a config file"
          description="The Policy Builder is the same surface RevOps uses today in FlowBuilder, applied to agent guardrails. Open any policy to author with condition chips, simulate against last-7d traffic, diff against the live version, and roll back to any prior author."
        >
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
            <Link
              href="/policies/pol_ent_approval/edit"
              className="rounded-md border border-border p-3 bg-surface hover:bg-ink-50 transition-colors"
            >
              <div className="text-[11px] uppercase text-muted font-semibold">
                Author
              </div>
              <div className="text-[14px] font-semibold text-ink-900 mt-0.5">
                Condition chips → live rule
              </div>
              <div className="text-muted mt-1">
                Pick fields, operators, values. The compiled rule updates as you
                edit. Same engine evaluates it in production.
              </div>
            </Link>
            <Link
              href="/policies/pol_quiet_hours/edit"
              className="rounded-md border border-border p-3 bg-surface hover:bg-ink-50 transition-colors"
            >
              <div className="text-[11px] uppercase text-muted font-semibold">
                Simulate
              </div>
              <div className="text-[14px] font-semibold text-ink-900 mt-0.5">
                412 decisions would flip
              </div>
              <div className="text-muted mt-1">
                Replays last 7 days of real preflight calls. See decisions that
                flip, AEs and records affected, sample flips by record.
              </div>
            </Link>
            <Link
              href="/policies/pol_ent_approval/edit"
              className="rounded-md border border-border p-3 bg-surface hover:bg-ink-50 transition-colors"
            >
              <div className="text-[11px] uppercase text-muted font-semibold">
                Diff & rollback
              </div>
              <div className="text-[14px] font-semibold text-ink-900 mt-0.5">
                4 prior versions, 1 click to restore
              </div>
              <div className="text-muted mt-1">
                Side-by-side diff vs. live. Restore any version (Mike Chen, Jen
                Park) — restores are themselves versioned.
              </div>
            </Link>
          </div>
        </Section>
      </Card>
    </div>
  );
}

function Tab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-1.5 h-8 px-3 -mb-px text-[12.5px] font-medium border-b-2 transition-colors",
        active
          ? "border-brand text-ink-900"
          : "border-transparent text-ink-600 hover:text-ink-900",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "tabular text-[10.5px] px-1.5 h-[18px] rounded-full inline-flex items-center justify-center font-semibold",
          active ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-600",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function PolicyCard({ policy }: { policy: Policy }) {
  const versions = POLICY_VERSIONS[policy.id] ?? [];
  const headVersion = versions[0]?.version ?? 1;
  const isBudget = policy.type === "budget" && policy.budget;
  const Icon = isBudget ? Coins : ShieldCheck;
  const iconBg = isBudget
    ? "bg-amber-50 border-amber-100"
    : "bg-brand-50 border-brand-100";
  const iconColor = isBudget ? "text-amber-700" : "text-brand-700";

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-md border flex items-center justify-center shrink-0",
            iconBg,
          )}
        >
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/policies/${policy.id}/edit`}
              className="text-[14.5px] font-semibold text-ink-900 hover:text-brand-700"
            >
              {policy.name}
            </Link>
            <StatusChip tone="neutral">{typeLabel[policy.type]}</StatusChip>
            <StatusChip tone={enforcementTone[policy.enforcement]}>
              {policy.enforcement}
            </StatusChip>
            {policy.status === "active" && (
              <StatusChip tone="green">Active</StatusChip>
            )}
            {policy.status === "paused" && (
              <StatusChip tone="neutral">Paused</StatusChip>
            )}
            {policy.status === "draft" && (
              <StatusChip tone="amber">Draft</StatusChip>
            )}
            <StatusChip tone="neutral">v{headVersion}</StatusChip>
          </div>
          <p className="text-[12.5px] text-muted mt-1">{policy.description}</p>
        </div>
        <Link
          href={`/policies/${policy.id}/edit`}
          className="shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded-md border border-border bg-surface hover:bg-ink-50 text-[11.5px] font-medium text-ink-700"
        >
          <Pencil className="w-3 h-3" /> Edit
        </Link>
      </div>

      {isBudget && policy.budget ? (
        <BudgetRuleBody budget={policy.budget} />
      ) : (
        <div className="rounded-md bg-ink-900 p-3 font-mono text-[11px] text-ink-100 leading-relaxed">
          {policy.rules.map((r, i) => (
            <div key={i}>{r}</div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11.5px] text-muted border-t border-border pt-2">
        <div>
          Scope:{" "}
          <span className="text-ink-700 font-medium">{policy.scope}</span> ·
          Applied to{" "}
          <span className="text-ink-700 font-medium">{policy.appliedTo}</span>
        </div>
        <div>
          Triggered{" "}
          <span className="text-ink-700 font-medium tabular">
            {policy.triggered7d}
          </span>{" "}
          × in last 7d
        </div>
      </div>
    </Card>
  );
}

function BudgetRuleBody({ budget }: { budget: NonNullable<Policy["budget"]> }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <BudgetStat
          icon={<Wifi className="w-3 h-3" />}
          label="Weekly"
          value={budget.weeklyTouches}
        />
        <BudgetStat
          icon={<Wifi className="w-3 h-3" />}
          label="Daily"
          value={budget.dailyTouches}
        />
        <BudgetStat
          icon={<Timer className="w-3 h-3" />}
          label="Cooldown"
          value={`${budget.cooldownMinutes}m`}
        />
      </div>
      <div className="space-y-1">
        <div className="text-[10.5px] uppercase tracking-wide text-muted font-semibold">
          Channel caps
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11.5px]">
          {budget.channelCaps.map((c) => (
            <li
              key={c.channel}
              className="flex items-center justify-between border-b border-border/60 last:border-b-0 pb-0.5 last:pb-0"
            >
              <span className="text-ink-800">{c.channel}</span>
              <span className="text-muted tabular">
                {c.cap} {c.period}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BudgetStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-md border border-border bg-ink-50/40 p-2 text-center">
      <div className="text-[18px] font-semibold text-ink-900 tabular leading-tight">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted font-semibold inline-flex items-center gap-1 justify-center mt-0.5">
        {icon}
        {label}
      </div>
    </div>
  );
}

function BudgetEvaluationOrder() {
  return (
    <Card className="p-5" emphasis>
      <Section
        title="Budget evaluation order"
        description="Budgets compile to the same engine as every other policy — most specific wins."
      >
        <ol className="mt-3 grid md:grid-cols-4 gap-3 text-[12px]">
          {[
            {
              n: "1",
              label: "Record override",
              detail: "VIP, DNC, executive flag",
            },
            { n: "2", label: "Segment tier", detail: "Tier 1 / 2 / 3" },
            {
              n: "3",
              label: "Channel cap",
              detail: "Email / LinkedIn / chat / phone",
            },
            {
              n: "4",
              label: "Global floor",
              detail: "Tenant-wide minimum",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-md border border-border bg-surface p-3"
            >
              <div className="w-5 h-5 rounded bg-brand text-white flex items-center justify-center text-[10px] font-bold mb-1.5">
                {s.n}
              </div>
              <div className="text-ink-900 font-semibold">{s.label}</div>
              <div className="text-muted">{s.detail}</div>
            </li>
          ))}
        </ol>
      </Section>
    </Card>
  );
}
