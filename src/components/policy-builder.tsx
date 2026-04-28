"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  History,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, StatusChip } from "@/components/ui/primitives";
import { useSearchParams } from "next/navigation";
import {
  CONDITION_FIELDS,
  NEW_POLICY_SIMULATION,
  POLICIES,
  POLICY_CATEGORIES,
  POLICY_VERSIONS,
  SCOPE_FACETS,
  SIMULATION_RESULTS,
  type Policy,
  type PolicyCategory,
  type PolicyType,
  type PolicyVersion,
  type SimulationResult,
} from "@/lib/fixtures";

type Decision = "GO" | "NO_GO" | "WAIT" | "REDIRECT";

type Enforcement = "block" | "warn" | "redirect";

type Condition = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

type ScopeSelection = Partial<
  Record<"tier" | "lifecycle" | "pod" | "vertical", string[]>
>;

const TYPE_OPTIONS: Array<{ value: PolicyType; label: string; hint: string }> =
  [
    { value: "approval", label: "Approval", hint: "Hold for human sign-off" },
    {
      value: "sequence",
      label: "Sequence",
      hint: "Single-sequence guardrails",
    },
    { value: "priority", label: "Priority", hint: "Owner / channel priority" },
    { value: "channel", label: "Channel", hint: "Channel-level routing" },
    {
      value: "quiet-hours",
      label: "Quiet hours",
      hint: "Time-of-day suppression",
    },
    {
      value: "budget",
      label: "Budget",
      hint: "Communication budget per record",
    },
  ];

const DEFAULT_TYPE_FOR_CATEGORY: Record<PolicyCategory, PolicyType> = {
  identity: "priority",
  "communication-budgets": "budget",
  sequencing: "sequence",
  "stage-gates": "approval",
  approvals: "approval",
  compliance: "approval",
};

const ENFORCEMENT_OPTIONS: Array<{
  value: Enforcement;
  decision: Decision;
  label: string;
  description: string;
  toneClass: string;
}> = [
  {
    value: "block",
    decision: "NO_GO",
    label: "Block",
    description: "Return NO_GO. Action is dropped. Logged in ledger.",
    toneClass: "border-red-200 bg-red-50",
  },
  {
    value: "warn",
    decision: "WAIT",
    label: "Wait",
    description: "Return WAIT. Action holds until condition clears.",
    toneClass: "border-amber-200 bg-amber-50",
  },
  {
    value: "redirect",
    decision: "REDIRECT",
    label: "Redirect",
    description: "Return REDIRECT. Routes to owner / CSM / queue.",
    toneClass: "border-blue-200 bg-blue-50",
  },
];

const REDIRECT_TARGETS = ["Owner (Slack DM)", "CSM", "RevOps Queue", "Manager"];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function inferTypeRules(p: Policy): Condition[] {
  const lookup: Record<string, string> = {
    "record.tier == 'Tier 1'": "==Tier 1",
    "record.openOpp.stage IN ('Negotiation','Proposal')":
      "INNegotiation, Proposal",
    "action.category == 'outbound'": "==outbound",
    "record.pod LIKE 'EMEA%'": "LIKEEMEA%",
    "local_time NOT IN (08:00–18:00)": "NOT IN08:00–18:00",
    "record.activeSequence IS NOT NULL": "IS NOT NULL",
    "action.type == 'add_to_sequence'": "==add_to_sequence",
    "record.lifecycle == 'Customer'": "==Customer",
    "action.channel == 'email'": "==email",
    "requester.kind IN ('ai-sdr','intent')": "INai-sdr, intent",
    "action.type == 'schedule_meeting'": "==schedule_meeting",
  };
  const rules: Condition[] = [];
  for (const line of p.rules) {
    const cleaned = line.replace(/^IF\s+|^AND\s+|^THEN.*$/g, "").trim();
    for (const [pattern, packed] of Object.entries(lookup)) {
      if (cleaned.includes(pattern)) {
        const fieldMatch = pattern.match(/^([\w.]+)/);
        const opMatch = packed.match(
          /^(==|!=|IN|NOT IN|LIKE|IS NOT NULL|IS NULL)/,
        );
        if (!fieldMatch || !opMatch) continue;
        rules.push({
          id: uid(),
          field: fieldMatch[1],
          operator: opMatch[1],
          value: packed.slice(opMatch[1].length),
        });
      }
    }
  }
  if (rules.length === 0) {
    rules.push({
      id: uid(),
      field: "record.tier",
      operator: "==",
      value: "Tier 1",
    });
  }
  return rules;
}

function compileRules(
  conditions: Condition[],
  enforcement: Enforcement,
  redirectTarget: string,
): string[] {
  const lines: string[] = [];
  conditions.forEach((c, i) => {
    const prefix = i === 0 ? "IF" : "AND";
    const valuePart = formatValue(c.operator, c.value);
    const opAndValue =
      c.operator === "IS NULL" || c.operator === "IS NOT NULL"
        ? c.operator
        : `${c.operator} ${valuePart}`;
    lines.push(`${prefix} ${c.field} ${opAndValue}`.trim());
  });
  const decision =
    enforcement === "block"
      ? "NO_GO"
      : enforcement === "warn"
        ? "WAIT"
        : `REDIRECT to ${redirectTarget.split(" ")[0].toLowerCase()}`;
  lines.push(`THEN decision = ${decision}`);
  return lines;
}

function formatValue(op: string, raw: string) {
  if (!raw) return "";
  if (op === "IN" || op === "NOT IN") {
    const items = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 1 && items[0].includes("–")) return `(${items[0]})`;
    return `(${items.map((v) => `'${v}'`).join(",")})`;
  }
  if (op === "LIKE") return `'${raw}'`;
  return `'${raw}'`;
}

function formatScope(scope: ScopeSelection): string {
  const parts: string[] = [];
  for (const facet of SCOPE_FACETS) {
    const values = scope[facet.key];
    if (values && values.length > 0) {
      parts.push(`${facet.label}: ${values.join(" / ")}`);
    }
  }
  return parts.length ? parts.join(" · ") : "All records";
}

function appliedToFromScope(scope: ScopeSelection): string {
  const counts: Record<string, number> = {
    "Tier 1": 142,
    "Tier 2": 318,
    "Tier 3": 612,
    Customer: 284,
    "EMEA North": 188,
    "EMEA South": 130,
    Lead: 1240,
    SQL: 412,
    Opportunity: 318,
  };
  const facets = Object.values(scope).flat().filter(Boolean) as string[];
  if (facets.length === 0) return "All records";
  const total = facets.reduce((acc, key) => acc + (counts[key] ?? 80), 0);
  return `${total.toLocaleString()} accounts`;
}

export type BuilderMode = "new" | "edit";

export function PolicyBuilder({
  mode,
  policyId,
}: {
  mode: BuilderMode;
  policyId?: string;
}) {
  const policy = useMemo<Policy | undefined>(
    () =>
      mode === "edit" ? POLICIES.find((p) => p.id === policyId) : undefined,
    [mode, policyId],
  );
  const versions: PolicyVersion[] = useMemo(
    () => (policy ? (POLICY_VERSIONS[policy.id] ?? []) : []),
    [policy],
  );
  const baselineSim: SimulationResult = useMemo(
    () =>
      policy
        ? (SIMULATION_RESULTS[policy.id] ?? NEW_POLICY_SIMULATION)
        : NEW_POLICY_SIMULATION,
    [policy],
  );

  const searchParams = useSearchParams();
  const initialCategory = useMemo<PolicyCategory>(() => {
    if (policy) return policy.category;
    const param = searchParams?.get("category") as PolicyCategory | null;
    if (param && POLICY_CATEGORIES.some((c) => c.key === param)) {
      return param;
    }
    return "approvals";
  }, [policy, searchParams]);

  const [name, setName] = useState(policy?.name ?? "Untitled policy");
  const [description, setDescription] = useState(
    policy?.description ?? "Describe what this policy is meant to enforce.",
  );
  const [category, setCategory] = useState<PolicyCategory>(initialCategory);
  const [type, setType] = useState<PolicyType>(
    policy?.type ?? DEFAULT_TYPE_FOR_CATEGORY[initialCategory],
  );
  const [scope, setScope] = useState<ScopeSelection>(() => seedScope(policy));
  const [conditions, setConditions] = useState<Condition[]>(
    policy ? inferTypeRules(policy) : seedConditions(),
  );
  const [enforcement, setEnforcement] = useState<Enforcement>(
    policy?.enforcement ?? "redirect",
  );
  const [redirectTarget, setRedirectTarget] = useState(REDIRECT_TARGETS[0]);
  const [status, setStatus] = useState<Policy["status"]>(
    policy?.status ?? "draft",
  );

  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const compiled = useMemo(
    () => compileRules(conditions, enforcement, redirectTarget),
    [conditions, enforcement, redirectTarget],
  );

  const dirty = useMemo(() => {
    if (!policy) return true;
    if (policy.rules.join("\n") !== compiled.join("\n")) return true;
    if (policy.enforcement !== enforcement) return true;
    if (policy.name !== name) return true;
    if (policy.description !== description) return true;
    return false;
  }, [policy, compiled, enforcement, name, description]);

  function runSimulation() {
    setSimulating(true);
    setSimResult(null);
    setTimeout(() => {
      setSimResult(buildSimResult(baselineSim, dirty));
      setSimulating(false);
    }, 650);
  }

  function restoreVersion(v: PolicyVersion) {
    if (!policy) return;
    setConditions(inferTypeRules({ ...policy, rules: v.rules }));
    setSimResult(null);
  }

  return (
    <div className="px-8 py-7 max-w-[1500px] mx-auto space-y-5">
      <BuilderHeader
        mode={mode}
        name={name}
        status={status}
        onStatus={setStatus}
        dirty={dirty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-5 items-start">
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div>
              <Label>Name</Label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 h-9 px-3 rounded-md border border-border bg-surface text-[13.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-surface text-[13px] text-ink-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <div>
              <Label>Category</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {POLICY_CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setCategory(c.key);
                      // sensible default type when category changes
                      setType(DEFAULT_TYPE_FOR_CATEGORY[c.key]);
                    }}
                    className={cn(
                      "h-7 px-2.5 rounded-full border text-[12px] font-medium transition-colors",
                      category === c.key
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : "bg-surface border-border text-ink-700 hover:bg-ink-50",
                    )}
                    title={c.blurb}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Type</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      "h-7 px-2.5 rounded-full border text-[12px] font-medium transition-colors",
                      type === t.value
                        ? "bg-brand text-white border-brand"
                        : "bg-surface border-border text-ink-700 hover:bg-ink-50",
                    )}
                    title={t.hint}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <SectionTitle
              eyebrow="Scope"
              title="Where does this apply?"
              hint="Select one or more facets. Leave empty for all records."
            />
            <div className="space-y-2.5">
              {SCOPE_FACETS.map((facet) => (
                <ScopeRow
                  key={facet.key}
                  facet={facet}
                  selected={scope[facet.key] ?? []}
                  onToggle={(value) =>
                    setScope((s) => toggleFacet(s, facet.key, value))
                  }
                />
              ))}
            </div>
            <div className="text-[11.5px] text-muted pt-1 border-t border-border mt-1">
              <span className="text-ink-700 font-medium">
                {formatScope(scope)}
              </span>{" "}
              · estimated {appliedToFromScope(scope)}
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <SectionTitle
              eyebrow="Conditions"
              title="When this policy fires"
              hint="All conditions are AND-ed. The compiled rule preview updates live."
            />
            <div className="space-y-2">
              {conditions.map((c, i) => (
                <ConditionRow
                  key={c.id}
                  index={i}
                  condition={c}
                  onChange={(next) =>
                    setConditions((rows) =>
                      rows.map((r) => (r.id === c.id ? next : r)),
                    )
                  }
                  onRemove={() =>
                    setConditions((rows) => rows.filter((r) => r.id !== c.id))
                  }
                />
              ))}
            </div>
            <button
              onClick={() =>
                setConditions((rows) => [
                  ...rows,
                  {
                    id: uid(),
                    field: "action.category",
                    operator: "==",
                    value: "outbound",
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-dashed border-ink-300 text-[12px] font-medium text-ink-700 hover:bg-ink-50"
            >
              <Plus className="w-3.5 h-3.5" /> AND condition
            </button>
          </Card>

          <Card className="p-5 space-y-3">
            <SectionTitle
              eyebrow="Enforcement"
              title="What happens when conditions match?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ENFORCEMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEnforcement(opt.value)}
                  className={cn(
                    "text-left rounded-md border p-3 transition-all",
                    enforcement === opt.value
                      ? `${opt.toneClass} border-current shadow-sm`
                      : "border-border bg-surface hover:bg-ink-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "chip border font-semibold tabular text-[10.5px]",
                        opt.decision === "NO_GO" &&
                          "bg-red-50 text-red-700 border-red-200",
                        opt.decision === "WAIT" &&
                          "bg-amber-50 text-amber-700 border-amber-200",
                        opt.decision === "REDIRECT" &&
                          "bg-blue-50 text-blue-700 border-blue-200",
                      )}
                    >
                      {opt.decision}
                    </span>
                    <span className="text-[13px] font-semibold text-ink-900">
                      {opt.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-muted leading-snug">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
            {enforcement === "redirect" && (
              <div>
                <Label>Redirect target</Label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {REDIRECT_TARGETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setRedirectTarget(t)}
                      className={cn(
                        "h-7 px-2.5 rounded-full border text-[12px] font-medium",
                        redirectTarget === t
                          ? "bg-ink-900 text-white border-ink-900"
                          : "bg-surface border-border text-ink-700 hover:bg-ink-50",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-ink-50/60">
              <div className="text-[11.5px] uppercase tracking-wider font-semibold text-ink-600">
                Compiled rule · live preview
              </div>
              <StatusChip tone="brand">
                v
                {(policy?.lastModified ? (versions[0]?.version ?? 1) : 0) +
                  (dirty ? 1 : 0)}{" "}
                · draft
              </StatusChip>
            </div>
            <div className="bg-ink-900 p-4 font-mono text-[11.5px] text-ink-100 leading-relaxed">
              {compiled.map((line, i) => (
                <div
                  key={i}
                  className={
                    i === compiled.length - 1 ? "text-emerald-300" : ""
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-4">
          <Card className="p-5 space-y-3" emphasis>
            <div className="flex items-center justify-between">
              <SectionTitle
                eyebrow="Dry-run"
                title="Simulate on last 7 days of traffic"
              />
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 disabled:opacity-60 text-[12.5px] font-medium text-white"
              >
                {simulating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Running…
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Run simulation
                  </>
                )}
              </button>
            </div>
            {!simResult && !simulating && (
              <div className="text-[12.5px] text-muted">
                Replays {baselineSim.evaluated.toLocaleString()} preflight calls
                from the last {baselineSim.windowDays} days against this draft.
                Nothing is written.
              </div>
            )}
            {simulating && (
              <div className="space-y-2">
                <SkeletonBar />
                <SkeletonBar />
                <SkeletonBar />
              </div>
            )}
            {simResult && <SimulationOutput result={simResult} />}
          </Card>

          {policy && (
            <Card className="p-5 space-y-3">
              <SectionTitle
                eyebrow="Diff"
                title={`v${versions[0]?.version ?? 1} → draft`}
              />
              <DiffView before={policy.rules} after={compiled} clean={!dirty} />
            </Card>
          )}

          {policy && versions.length > 0 && (
            <Card className="p-5 space-y-3">
              <SectionTitle
                eyebrow="History"
                title="Version history"
                hint="Restore any version. Restores are themselves versioned."
              />
              <ul className="divide-y divide-border -mx-1">
                {versions.map((v) => (
                  <li
                    key={v.version}
                    className="px-1 py-2.5 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-ink-50 border border-ink-200 flex items-center justify-center text-[11px] font-semibold text-ink-700 tabular shrink-0">
                      v{v.version}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12.5px] font-medium text-ink-900">
                          {v.author}
                        </span>
                        <span className="text-[11px] text-muted">
                          {v.authorRole}
                        </span>
                        <span className="text-[11px] text-muted tabular">
                          {v.timestamp}
                        </span>
                      </div>
                      <p className="text-[12px] text-ink-700 mt-0.5 leading-snug">
                        {v.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => restoreVersion(v)}
                      className="shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded-md border border-border bg-surface hover:bg-ink-50 text-[11.5px] font-medium text-ink-700"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function BuilderHeader({
  mode,
  name,
  status,
  onStatus,
  dirty,
}: {
  mode: BuilderMode;
  name: string;
  status: Policy["status"];
  onStatus: (s: Policy["status"]) => void;
  dirty: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="min-w-0">
        <Link
          href="/policies"
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted hover:text-ink-700 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Policies
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <h1 className="text-[24px] leading-tight font-semibold tracking-tight text-ink-900 hero-serif">
            {name || (mode === "new" ? "New policy" : "Untitled policy")}
          </h1>
          {dirty && <StatusChip tone="amber">Unsaved draft</StatusChip>}
        </div>
        <p className="mt-1.5 text-[12.5px] text-muted">
          {mode === "new"
            ? "Author a new policy. Simulate before activating — nothing writes until you publish."
            : "Edit, simulate, and diff against the live version. Restores are versioned."}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusSelect value={status} onChange={onStatus} />
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
          Save draft
        </button>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-brand hover:bg-brand-700 text-[12.5px] font-medium text-white">
          {mode === "new" ? "Publish" : "Promote draft"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: Policy["status"];
  onChange: (s: Policy["status"]) => void;
}) {
  const tone =
    value === "active" ? "green" : value === "paused" ? "neutral" : "amber";
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Policy["status"])}
        className="appearance-none h-8 pl-2.5 pr-7 rounded-md border border-border bg-surface text-[12.5px] font-medium text-ink-800 hover:bg-ink-50 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
      <span className="sr-only">{tone}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] uppercase tracking-wider font-semibold text-ink-600">
      {children}
    </label>
  );
}

function SectionTitle({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-brand">
        {eyebrow}
      </div>
      <h2 className="text-[14px] font-semibold text-ink-900 mt-0.5">{title}</h2>
      {hint && <p className="text-[11.5px] text-muted mt-0.5">{hint}</p>}
    </div>
  );
}

function ScopeRow({
  facet,
  selected,
  onToggle,
}: {
  facet: (typeof SCOPE_FACETS)[number];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide font-semibold text-ink-600 mb-1">
        {facet.label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {facet.options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "h-7 px-2.5 rounded-full border text-[12px] font-medium",
                active
                  ? "bg-brand-50 text-brand-700 border-brand-200"
                  : "bg-surface border-border text-ink-700 hover:bg-ink-50",
              )}
            >
              {active && <span className="mr-1">✓</span>}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConditionRow({
  index,
  condition,
  onChange,
  onRemove,
}: {
  index: number;
  condition: Condition;
  onChange: (c: Condition) => void;
  onRemove: () => void;
}) {
  const field = CONDITION_FIELDS.find((f) => f.id === condition.field);
  const operators = field?.operators ?? ["==", "!="];
  const values = field?.values;
  const showValue =
    condition.operator !== "IS NULL" && condition.operator !== "IS NOT NULL";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted w-10 shrink-0">
        {index === 0 ? "IF" : "AND"}
      </span>
      <select
        value={condition.field}
        onChange={(e) =>
          onChange({ ...condition, field: e.target.value, value: "" })
        }
        className="h-8 pl-2 pr-6 rounded-md border border-border bg-surface text-[12.5px] font-mono text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {CONDITION_FIELDS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value })}
        className="h-8 pl-2 pr-6 rounded-md border border-border bg-surface text-[12.5px] font-mono text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      {showValue &&
        (values ? (
          <select
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
            className="h-8 pl-2 pr-6 rounded-md border border-border bg-surface text-[12.5px] text-ink-800 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">Select…</option>
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
            placeholder="value"
            className="h-8 px-2 rounded-md border border-border bg-surface text-[12.5px] text-ink-800 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        ))}
      <button
        onClick={onRemove}
        className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-500 hover:bg-ink-50 hover:text-red-700"
        aria-label="Remove condition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function SkeletonBar() {
  return <div className="h-3 rounded bg-ink-100 animate-pulse" />;
}

function SimulationOutput({ result }: { result: SimulationResult }) {
  const flipsTone = result.flips === 0 ? "text-ink-700" : "text-amber-700";
  const goDelta = result.after.GO - result.before.GO;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <SimStat
          label="Decisions flip"
          value={result.flips.toLocaleString()}
          sub={`of ${result.evaluated.toLocaleString()} evaluated`}
          tone={flipsTone}
        />
        <SimStat
          label="AEs affected"
          value={result.aesAffected.toString()}
          sub="across pods"
        />
        <SimStat
          label="Records affected"
          value={result.recordsAffected.toString()}
          sub={goDelta < 0 ? `${goDelta} GO` : "no GO change"}
        />
      </div>
      <DistributionBar before={result.before} after={result.after} />
      {result.sampleFlips.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-600 mb-1.5">
            Sample flips ({result.sampleFlips.length})
          </div>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-[11.5px]">
              <tbody>
                {result.sampleFlips.map((s, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-t border-border first:border-t-0",
                      i % 2 === 1 && "bg-ink-50/40",
                    )}
                  >
                    <td className="px-2.5 py-1.5 text-ink-800 font-medium align-top">
                      {s.record}
                      <div className="text-[10.5px] text-muted font-normal">
                        owner · {s.owner} · {s.agent}
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <DecisionDot d={s.from} />
                        <ArrowRight className="w-3 h-3 text-ink-400" />
                        <DecisionDot d={s.to} />
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 text-muted align-top">
                      {s.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SimStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-2.5">
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted">
        {label}
      </div>
      <div
        className={cn(
          "text-[18px] font-semibold tabular mt-0.5",
          tone ?? "text-ink-900",
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-muted tabular">{sub}</div>
    </div>
  );
}

function DistributionBar({
  before,
  after,
}: {
  before: SimulationResult["before"];
  after: SimulationResult["after"];
}) {
  const total = before.GO + before.NO_GO + before.WAIT + before.REDIRECT;
  const seg = (n: number) => `${(n / total) * 100}%`;
  const Row = ({
    label,
    data,
  }: {
    label: string;
    data: SimulationResult["before"];
  }) => (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[10.5px] uppercase tracking-wider font-semibold text-muted">
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full overflow-hidden border border-border bg-ink-50 flex">
        <div className="bg-emerald-400" style={{ width: seg(data.GO) }} />
        <div className="bg-red-400" style={{ width: seg(data.NO_GO) }} />
        <div className="bg-amber-400" style={{ width: seg(data.WAIT) }} />
        <div className="bg-blue-400" style={{ width: seg(data.REDIRECT) }} />
      </div>
    </div>
  );
  return (
    <div className="space-y-1.5">
      <Row label="Before" data={before} />
      <Row label="After" data={after} />
      <div className="flex items-center gap-3 text-[10.5px] text-muted pl-16">
        <Legend dot="bg-emerald-400" label="GO" />
        <Legend dot="bg-red-400" label="NO_GO" />
        <Legend dot="bg-amber-400" label="WAIT" />
        <Legend dot="bg-blue-400" label="REDIRECT" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("w-2 h-2 rounded-full", dot)} />
      {label}
    </span>
  );
}

function DecisionDot({ d }: { d: Decision }) {
  const map: Record<Decision, string> = {
    GO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    NO_GO: "bg-red-50 text-red-700 border-red-200",
    WAIT: "bg-amber-50 text-amber-700 border-amber-200",
    REDIRECT: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-1.5 h-5 rounded border font-semibold text-[10px] tabular",
        map[d],
      )}
    >
      {d}
    </span>
  );
}

function DiffView({
  before,
  after,
  clean,
}: {
  before: string[];
  after: string[];
  clean: boolean;
}) {
  if (clean) {
    return (
      <div className="rounded-md border border-dashed border-border p-3 text-[12px] text-muted bg-ink-50/40">
        No changes vs. live version.
      </div>
    );
  }
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] leading-relaxed">
      <div className="rounded-md bg-ink-900 p-3 text-ink-100 border border-ink-800">
        <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold mb-1.5 font-sans">
          Live · v
          {POLICY_VERSIONS &&
            (Object.values(POLICY_VERSIONS)[0]?.[0]?.version ?? "1")}
        </div>
        {before.map((line, i) => (
          <div
            key={i}
            className={cn(
              "px-1 -mx-1 rounded",
              !afterSet.has(line) && "bg-red-900/40 text-red-200",
            )}
          >
            {!afterSet.has(line) ? "- " : "  "}
            {line}
          </div>
        ))}
      </div>
      <div className="rounded-md bg-ink-900 p-3 text-ink-100 border border-emerald-900">
        <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1.5 font-sans">
          Draft
        </div>
        {after.map((line, i) => (
          <div
            key={i}
            className={cn(
              "px-1 -mx-1 rounded",
              !beforeSet.has(line) && "bg-emerald-900/40 text-emerald-200",
            )}
          >
            {!beforeSet.has(line) ? "+ " : "  "}
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildSimResult(
  baseline: SimulationResult,
  dirty: boolean,
): SimulationResult {
  if (!dirty) {
    return {
      ...baseline,
      flips: 0,
      aesAffected: 0,
      recordsAffected: 0,
      after: baseline.before,
      sampleFlips: [],
    };
  }
  return baseline;
}

function seedConditions(): Condition[] {
  return [
    { id: uid(), field: "record.tier", operator: "==", value: "Tier 1" },
    {
      id: uid(),
      field: "action.category",
      operator: "==",
      value: "outbound",
    },
  ];
}

function seedScope(p?: Policy): ScopeSelection {
  if (!p) return {};
  const scope: ScopeSelection = {};
  if (p.scope.includes("Tier-1")) scope.tier = ["Tier 1"];
  if (p.scope.includes("EMEA")) scope.pod = ["EMEA North", "EMEA South"];
  if (p.scope.toLowerCase().includes("customer"))
    scope.lifecycle = ["Customer"];
  return scope;
}

function toggleFacet(
  s: ScopeSelection,
  key: keyof ScopeSelection,
  value: string,
): ScopeSelection {
  const current = s[key] ?? [];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return { ...s, [key]: next };
}
