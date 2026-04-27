import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Clock, Coins } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import {
  Card,
  DecisionBadge,
  StatusChip,
  ToolIcon,
  StatCard,
} from "@/components/ui/primitives";
import { AGENTS_BY_ID, RECORDS_BY_ID, getDecisions } from "@/lib/fixtures";
import { formatRelative } from "@/lib/utils";

export default async function RecordDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = RECORDS_BY_ID[id];
  if (!record) notFound();

  const decisions = getDecisions().filter((d) => d.recordId === id);

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <Link
        href="/records"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Records
      </Link>

      <PageHeader
        eyebrow={`Record · ${record.company}`}
        title={record.name}
        description={`${record.title} · ${record.email}`}
        actions={
          <>
            <StatusChip tone="brand">{record.lifecycle}</StatusChip>
            <StatusChip tone="neutral">{record.tier}</StatusChip>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Owner"
          value={record.ownerName}
          sublabel={`${record.ownerRole} · ${record.ownerPod}`}
          tone="brand"
        />
        <StatCard
          label="Touches · 7d"
          value={`${record.touches7d} / ${record.budgetCap}`}
          sublabel={`Tier 1 cap · 14 per week`}
          tone={record.touches7d > record.budgetCap * 0.85 ? "amber" : "green"}
          icon={<Coins className="w-4 h-4" />}
        />
        <StatCard
          label="Conflicts · 7d"
          value={String(record.conflicts7d)}
          sublabel="Collisions resolved in-band"
          tone={record.conflicts7d > 4 ? "amber" : "green"}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Active agents"
          value={String(record.agentsActive.length)}
          sublabel={record.agentsActive
            .map((aid) => AGENTS_BY_ID[aid]?.name ?? aid)
            .join(", ")}
          tone="brand"
        />
      </div>

      {/* Timeline + side rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <Section
            title="Agent timeline"
            description="Every preflight and outcome on this record, across every agent."
          >
            <ol className="mt-4 relative border-l-2 border-ink-100 ml-2">
              {decisions.length === 0 && (
                <li className="pl-5 py-3 text-[12.5px] text-muted">
                  No decisions in the window.
                </li>
              )}
              {decisions.map((d) => {
                const agent = AGENTS_BY_ID[d.agentId];
                return (
                  <li key={d.id} className="pl-5 py-3 relative">
                    <span
                      className="absolute -left-[7px] top-4 w-3 h-3 rounded-full bg-white border-2"
                      style={{
                        borderColor:
                          d.decision === "GO"
                            ? "#16a34a"
                            : d.decision === "NO_GO"
                              ? "#dc2626"
                              : d.decision === "WAIT"
                                ? "#d97706"
                                : "#2563eb",
                      }}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {agent && (
                        <ToolIcon
                          color={agent.color}
                          initials={agent.initials}
                          size={18}
                        />
                      )}
                      <span className="text-[12.5px] font-semibold text-ink-900">
                        {agent?.name}
                      </span>
                      <code className="text-[11px] font-mono text-ink-600 bg-ink-50 px-1.5 py-0.5 rounded">
                        {d.action}
                      </code>
                      <DecisionBadge decision={d.decision} />
                      <span className="ml-auto text-[11px] text-muted tabular">
                        {formatRelative(d.tsMs)} · {d.latencyMs} ms
                      </span>
                    </div>
                    <div className="mt-1 text-[12.5px] text-ink-700">
                      {d.reason}
                    </div>
                    {d.outcome && (
                      <div className="mt-1 text-[11.5px] text-emerald-700">
                        → outcome: {d.outcome}
                      </div>
                    )}
                    {d.redirectedTo && (
                      <div className="mt-1 text-[11.5px] text-blue-700">
                        → redirected to: {d.redirectedTo}
                      </div>
                    )}
                    {d.waitUntil && (
                      <div className="mt-1 text-[11.5px] text-amber-700">
                        → retry after: {d.waitUntil}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Section>
        </Card>

        {/* Side rail */}
        <div className="space-y-6">
          <Card className="p-5">
            <Section title="Budget state" description="Tier 1 weekly caps">
              <ul className="mt-3 space-y-2.5 text-[12.5px]">
                {[
                  { c: "Email", used: 5, cap: 7 },
                  { c: "LinkedIn", used: 2, cap: 3 },
                  { c: "Chat", used: 3, cap: 6 },
                  { c: "Phone", used: 1, cap: 2 },
                ].map((row) => (
                  <li key={row.c} className="flex items-center gap-2">
                    <div className="w-20 text-ink-700">{row.c}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${(row.used / row.cap) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right tabular text-ink-700">
                      {row.used}/{row.cap}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          </Card>
          <Card className="p-5">
            <Section title="Policy context" description="Rules that apply here">
              <ul className="mt-3 space-y-2 text-[12.5px]">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      Enterprise Approval Gate
                    </div>
                    <div className="text-muted">
                      Tier-1 + open opp → outbound redirects to owner
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      EMEA Quiet Hours
                    </div>
                    <div className="text-muted">
                      Owner pod EMEA North · pause 18:00–08:00 local
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      Single-Sequence Lock
                    </div>
                    <div className="text-muted">
                      Active: 11x Alice · Outbound Q2
                    </div>
                  </div>
                </li>
              </ul>
            </Section>
          </Card>

          <Card className="p-5">
            <Section title="Resolved identifiers">
              <ul className="mt-3 space-y-1.5 text-[11.5px] font-mono text-ink-700">
                <li>email: {record.email}</li>
                <li>sfdc_id: 003Dp0000{record.id.slice(-6).toUpperCase()}</li>
                <li>
                  linkedin: /in/{record.companySlug}-{record.id.slice(-4)}
                </li>
                <li>phone_hash: sha256:a7f3...c0b1</li>
              </ul>
            </Section>
          </Card>
        </div>
      </div>
    </div>
  );
}
