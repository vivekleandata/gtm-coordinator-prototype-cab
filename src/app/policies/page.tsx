import Link from "next/link";
import { Pencil, Play, Plus, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { POLICIES, POLICY_VERSIONS } from "@/lib/fixtures";

const typeLabel: Record<string, string> = {
  sequence: "Sequence",
  approval: "Approval",
  priority: "Priority",
  channel: "Channel",
  "quiet-hours": "Quiet hours",
};

const enforcementTone = {
  block: "red",
  warn: "amber",
  redirect: "brand",
} as const;

export default function PoliciesPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Policies"
        title="Deterministic rules that shape every decision."
        description="Policies compile to a fast rules engine evaluated inside the 500 ms preflight budget. Author with chips, simulate against real traffic, diff vs. live, and roll back any version."
        actions={
          <>
            <Link
              href="/policies/pol_ent_approval/edit"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              <Play className="w-3.5 h-3.5" /> Simulate a policy
            </Link>
            <Link
              href="/policies/new"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
            >
              <Plus className="w-3.5 h-3.5" /> New policy
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {POLICIES.map((p) => {
          const versions = POLICY_VERSIONS[p.id] ?? [];
          const headVersion = versions[0]?.version ?? 1;
          return (
            <Card key={p.id} className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/policies/${p.id}/edit`}
                      className="text-[14.5px] font-semibold text-ink-900 hover:text-brand-700"
                    >
                      {p.name}
                    </Link>
                    <StatusChip tone="neutral">{typeLabel[p.type]}</StatusChip>
                    <StatusChip tone={enforcementTone[p.enforcement]}>
                      {p.enforcement}
                    </StatusChip>
                    {p.status === "active" && (
                      <StatusChip tone="green">Active</StatusChip>
                    )}
                    {p.status === "paused" && (
                      <StatusChip tone="neutral">Paused</StatusChip>
                    )}
                    {p.status === "draft" && (
                      <StatusChip tone="amber">Draft</StatusChip>
                    )}
                    <StatusChip tone="neutral">v{headVersion}</StatusChip>
                  </div>
                  <p className="text-[12.5px] text-muted mt-1">
                    {p.description}
                  </p>
                </div>
                <Link
                  href={`/policies/${p.id}/edit`}
                  className="shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded-md border border-border bg-surface hover:bg-ink-50 text-[11.5px] font-medium text-ink-700"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
              </div>

              <div className="rounded-md bg-ink-900 p-3 font-mono text-[11px] text-ink-100 leading-relaxed">
                {p.rules.map((r, i) => (
                  <div key={i}>{r}</div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11.5px] text-muted border-t border-border pt-2">
                <div>
                  Scope:{" "}
                  <span className="text-ink-700 font-medium">{p.scope}</span> ·
                  Applied to{" "}
                  <span className="text-ink-700 font-medium">
                    {p.appliedTo}
                  </span>
                </div>
                <div>
                  Triggered{" "}
                  <span className="text-ink-700 font-medium tabular">
                    {p.triggered7d}
                  </span>{" "}
                  × in last 7d
                </div>
              </div>
            </Card>
          );
        })}
      </div>

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
