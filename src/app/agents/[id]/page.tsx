import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Key, Pause, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import {
  Card,
  DecisionBadge,
  StatCard,
  StatusChip,
  ToolIcon,
} from "@/components/ui/primitives";
import { AGENTS_BY_ID, RECORDS_BY_ID, getDecisions } from "@/lib/fixtures";
import { formatNumber, formatRelative, pct } from "@/lib/utils";

export default async function AgentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = AGENTS_BY_ID[id];
  if (!agent) notFound();

  const recent = getDecisions().filter((d) => d.agentId === id);

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Agents
      </Link>

      <div className="flex items-start gap-4">
        <ToolIcon color={agent.color} initials={agent.initials} size={48} />
        <div className="flex-1">
          <PageHeader
            eyebrow={`${agent.vendor} · ${agent.kind}`}
            title={agent.name}
            description={`Registered ${agent.registeredAt} · API key ${agent.apiKeyPreview}`}
            actions={
              <>
                <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
                  <Key className="w-3.5 h-3.5" /> Rotate key
                </button>
                <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              </>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Status"
          value={agent.status === "active" ? "Active" : agent.status}
          sublabel={`Last active ${agent.lastActive}`}
          tone={agent.status === "active" ? "green" : "amber"}
        />
        <StatCard
          label="Preflights · 24h"
          value={formatNumber(agent.preflights24h)}
          sublabel="Across all tenants"
          tone="brand"
        />
        <StatCard
          label="GO rate"
          value={pct(agent.goRate, 0)}
          sublabel="Healthy range · 70–95%"
          tone={agent.goRate < 0.5 ? "amber" : "green"}
        />
        <StatCard
          label="Declared actions"
          value={String(agent.declaredActions.length)}
          sublabel={agent.declaredActions.join(", ")}
          tone="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="h-11 px-4 flex items-center border-b border-border">
            <h2 className="text-[13px] font-semibold text-ink-900">
              Recent decisions
            </h2>
          </div>
          <ul className="divide-y divide-border">
            {recent.length === 0 ? (
              <li className="px-4 py-6 text-[12.5px] text-muted">
                No decisions in the window.
              </li>
            ) : (
              recent.map((d) => {
                const rec = RECORDS_BY_ID[d.recordId];
                return (
                  <li
                    key={d.id}
                    className="px-4 py-2.5 flex items-center gap-3"
                  >
                    <div className="w-[70px] text-[11px] text-muted tabular shrink-0">
                      {formatRelative(d.tsMs)}
                    </div>
                    <code className="w-[140px] text-[11px] font-mono text-ink-700 truncate">
                      {d.action}
                    </code>
                    <div className="flex-1 min-w-0 text-[12.5px] text-ink-800 truncate">
                      {rec?.name}
                      <span className="text-muted"> · {rec?.company}</span>
                    </div>
                    <DecisionBadge decision={d.decision} />
                    <div className="w-[60px] text-right text-[11px] text-muted tabular">
                      {d.latencyMs} ms
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <Section title="Authorization scope">
            <div className="mt-2 space-y-2 text-[12.5px]">
              <div className="text-muted">Actions this agent may request:</div>
              <ul className="space-y-1">
                {agent.declaredActions.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 px-2 py-1 rounded border border-ink-100 bg-ink-50/60"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                    <code className="mono text-[11.5px] text-ink-700">{a}</code>
                    <StatusChip tone="green">Allowed</StatusChip>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11.5px] text-muted">
                Actions outside this list are rejected at the edge with a NO_GO
                ·{" "}
                <code className="mono text-[10.5px]">action_not_declared</code>.
              </div>
            </div>
          </Section>
        </Card>
      </div>
    </div>
  );
}
