import { Plus, Play, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { POLICIES } from "@/lib/fixtures";

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
        description="Policies compile to a fast rules engine evaluated inside the 500 ms preflight budget. Edit in plain English, simulate against real traffic, promote with one click."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
              <Play className="w-3.5 h-3.5" /> Simulate
            </button>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white">
              <Plus className="w-3.5 h-3.5" /> New policy
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {POLICIES.map((p) => (
          <Card key={p.id} className="p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[14.5px] font-semibold text-ink-900">
                    {p.name}
                  </h3>
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
                </div>
                <p className="text-[12.5px] text-muted mt-1">{p.description}</p>
              </div>
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
                <span className="text-ink-700 font-medium">{p.appliedTo}</span>
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
        ))}
      </div>

      <Card className="p-5" emphasis>
        <Section
          title="Dry-run simulation"
          description="Test a policy against 7 days of real traffic before it goes live."
        >
          <div className="mt-3 grid grid-cols-3 gap-4 text-[12.5px]">
            <div className="rounded-md border border-border p-3 bg-surface">
              <div className="text-[11px] uppercase text-muted font-semibold">
                Would block
              </div>
              <div className="text-[20px] font-semibold text-red-700 mt-1 tabular">
                412
              </div>
              <div className="text-muted">vs 231 baseline — up 78%</div>
            </div>
            <div className="rounded-md border border-border p-3 bg-surface">
              <div className="text-[11px] uppercase text-muted font-semibold">
                Would redirect
              </div>
              <div className="text-[20px] font-semibold text-blue-700 mt-1 tabular">
                87
              </div>
              <div className="text-muted">to owner — 12 AEs impacted</div>
            </div>
            <div className="rounded-md border border-border p-3 bg-surface">
              <div className="text-[11px] uppercase text-muted font-semibold">
                Net effect
              </div>
              <div className="text-[20px] font-semibold text-emerald-700 mt-1 tabular">
                −31%
              </div>
              <div className="text-muted">outbound noise on open opps</div>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}
