import { Download, Lock } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, DecisionBadge, ToolIcon } from "@/components/ui/primitives";
import { AGENTS_BY_ID, RECORDS_BY_ID, getDecisions } from "@/lib/fixtures";
import { formatRelative } from "@/lib/utils";

export default function LedgerPage() {
  const all = getDecisions();
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Action Ledger"
        title="The immutable record of every agent decision."
        description="Append-only. Cryptographically chained. Queryable by agent, record, decision, or ruleset version. Compliance and audit without rebuilding the past."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </>
        }
      />

      <Card className="p-4 flex items-center gap-3" emphasis>
        <Lock className="w-4 h-4 text-brand" />
        <div className="flex-1 text-[12.5px] text-ink-700">
          <span className="font-semibold text-ink-900">24,518,472 entries</span>{" "}
          · last entry at offset 24,518,472 · chain valid · retained 13 months +
          archived to S3.
        </div>
        <code className="text-[10.5px] font-mono text-ink-600">
          sha256:a81d4c…2f7b
        </code>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["All decisions", "GO", "NO_GO", "WAIT", "REDIRECT"].map((f, i) => (
          <button
            key={f}
            className={
              i === 0
                ? "h-8 px-3 rounded-md bg-ink-900 text-white text-[12px] font-medium"
                : "h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12px] text-ink-700"
            }
          >
            {f}
          </button>
        ))}
        <div className="w-px h-5 bg-ink-200 mx-1" />
        <select className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-ink-700">
          <option>All agents</option>
          <option>11x Alice</option>
          <option>Warmly</option>
          <option>Clay</option>
        </select>
        <select className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-ink-700">
          <option>Last 24h</option>
          <option>Last 7d</option>
          <option>Last 30d</option>
        </select>
        <select className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-ink-700">
          <option>Ruleset v2026.04.1 (current)</option>
          <option>Ruleset v2026.03.4</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="w-[150px]">Timestamp</div>
          <div className="w-[130px]">Request</div>
          <div className="w-[160px]">Agent</div>
          <div className="w-[140px]">Action</div>
          <div className="flex-1">Record</div>
          <div className="w-[90px]">Decision</div>
          <div className="w-[300px]">Reason</div>
          <div className="w-[70px] text-right">Latency</div>
        </div>
        <ul>
          {all.map((e) => {
            const a = AGENTS_BY_ID[e.agentId];
            const r = RECORDS_BY_ID[e.recordId];
            return (
              <li
                key={e.id}
                className="px-4 py-2.5 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
              >
                <div className="w-[150px] text-[11.5px] text-muted tabular">
                  {formatRelative(e.tsMs)}
                </div>
                <code className="w-[130px] text-[11px] font-mono text-ink-600 truncate">
                  {e.id}
                </code>
                <div className="w-[160px] flex items-center gap-2 min-w-0">
                  {a && (
                    <ToolIcon color={a.color} initials={a.initials} size={18} />
                  )}
                  <span className="text-[12px] text-ink-800 truncate">
                    {a?.name}
                  </span>
                </div>
                <code className="w-[140px] text-[11px] font-mono text-ink-700 truncate">
                  {e.action}
                </code>
                <div className="flex-1 min-w-0 text-[12px] text-ink-700 truncate">
                  {r?.name}
                  <span className="text-muted"> · {r?.company}</span>
                </div>
                <div className="w-[90px]">
                  <DecisionBadge decision={e.decision} />
                </div>
                <div className="w-[300px] text-[11.5px] text-muted truncate">
                  {e.reason}
                </div>
                <div className="w-[70px] text-right text-[11.5px] text-ink-700 tabular">
                  {e.latencyMs} ms
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
