import Link from "next/link";
import { ArrowRight, Download, Lock } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, DecisionBadge, ToolIcon } from "@/components/ui/primitives";
import {
  AGENTS_BY_ID,
  DATA_SOURCES_BY_ID,
  RECORDS_BY_ID,
  REGISTERED_ACTIONS_BY_ID,
  getDataChanges,
  getDecisions,
} from "@/lib/fixtures";
import { cn, formatRelative } from "@/lib/utils";

type Stream = "all" | "decisions" | "data";

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ stream?: string }>;
}) {
  const sp = await searchParams;
  const stream: Stream =
    sp.stream === "data"
      ? "data"
      : sp.stream === "decisions"
        ? "decisions"
        : "all";

  const decisions = getDecisions();
  const dataChanges = getDataChanges();
  const showDecisions = stream === "all" || stream === "decisions";
  const showData = stream === "all" || stream === "data";

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Action Ledger"
        title="The immutable record of every agent decision and data change."
        description="Append-only. Cryptographically chained. Queryable by agent, action, record, decision, or ruleset version. Compliance and audit without rebuilding the past."
        actions={
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
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

      {/* Stream toggle */}
      <div className="flex items-center gap-1 border-b border-border -mx-1 px-1">
        <StreamTab
          href="/ledger"
          label="All"
          count={decisions.length + dataChanges.length}
          active={stream === "all"}
        />
        <StreamTab
          href="/ledger?stream=decisions"
          label="Agent decisions"
          count={decisions.length}
          active={stream === "decisions"}
        />
        <StreamTab
          href="/ledger?stream=data"
          label="Data changes"
          count={dataChanges.length}
          active={stream === "data"}
        />
        <div className="ml-auto pb-1">
          <Link
            href="/directory/actions"
            className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
          >
            Manage registered actions <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Filters — only relevant to decisions stream */}
      {showDecisions && (
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
      )}

      {showData && (
        <Card className="overflow-hidden">
          <div className="h-11 px-4 flex items-center justify-between border-b border-border">
            <div className="text-[13px] font-semibold text-ink-900">
              Data changes ·{" "}
              <span className="text-muted font-normal">
                appended by registered actions
              </span>
            </div>
            <Link
              href="/directory/actions"
              className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
            >
              {Object.keys(REGISTERED_ACTIONS_BY_ID).length} registered{" "}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-9 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
            <div className="w-[120px]">Timestamp</div>
            <div className="w-[120px]">Event</div>
            <div className="w-[170px]">Action</div>
            <div className="w-[170px]">Field</div>
            <div className="flex-1">Change</div>
            <div className="w-[180px]">Record</div>
            <div className="w-[140px] text-right">Actor</div>
          </div>
          <ul>
            {dataChanges.map((evt) => {
              const act = REGISTERED_ACTIONS_BY_ID[evt.actionId];
              const rec = RECORDS_BY_ID[evt.recordId];
              const src = act ? DATA_SOURCES_BY_ID[act.sourceId] : undefined;
              return (
                <li
                  key={evt.id}
                  className="px-4 py-2.5 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
                >
                  <div className="w-[120px] text-[11.5px] text-muted tabular">
                    {formatRelative(evt.tsMs)}
                  </div>
                  <code className="w-[120px] text-[11px] font-mono text-ink-600 truncate">
                    {evt.id}
                  </code>
                  <div className="w-[170px] flex items-center gap-2 min-w-0">
                    {src && (
                      <ToolIcon
                        color={src.color}
                        initials={src.initials}
                        size={18}
                      />
                    )}
                    <span className="text-[12px] text-ink-800 truncate">
                      {act?.name}
                    </span>
                  </div>
                  <code className="w-[170px] text-[11px] font-mono text-ink-700 truncate">
                    {act?.object}.{act?.field}
                  </code>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0 text-[11.5px]">
                    <code className="px-1 py-0.5 rounded text-[10.5px] font-mono bg-red-50 text-red-700 border border-red-100 truncate max-w-[140px]">
                      {evt.fromValue}
                    </code>
                    <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
                    <code className="px-1 py-0.5 rounded text-[10.5px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 truncate max-w-[140px]">
                      {evt.toValue}
                    </code>
                  </div>
                  <div className="w-[180px] text-[11.5px] text-ink-700 truncate">
                    {rec?.name}
                    <span className="text-muted"> · {rec?.company}</span>
                  </div>
                  <div className="w-[140px] text-[11px] text-muted tabular text-right truncate">
                    {evt.actor}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {showDecisions && (
        <Card className="overflow-hidden">
          <div className="h-11 px-4 flex items-center border-b border-border">
            <div className="text-[13px] font-semibold text-ink-900">
              Agent decisions ·{" "}
              <span className="text-muted font-normal">from /v1/preflight</span>
            </div>
          </div>
          <div className="h-9 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
            <div className="w-[120px]">Timestamp</div>
            <div className="w-[120px]">Request</div>
            <div className="w-[160px]">Agent</div>
            <div className="w-[140px]">Action</div>
            <div className="flex-1">Record</div>
            <div className="w-[90px]">Decision</div>
            <div className="w-[300px]">Reason</div>
            <div className="w-[70px] text-right">Latency</div>
          </div>
          <ul>
            {decisions.map((e) => {
              const a = AGENTS_BY_ID[e.agentId];
              const r = RECORDS_BY_ID[e.recordId];
              return (
                <li
                  key={e.id}
                  className="px-4 py-2.5 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
                >
                  <div className="w-[120px] text-[11.5px] text-muted tabular">
                    {formatRelative(e.tsMs)}
                  </div>
                  <code className="w-[120px] text-[11px] font-mono text-ink-600 truncate">
                    {e.id}
                  </code>
                  <div className="w-[160px] flex items-center gap-2 min-w-0">
                    {a && (
                      <ToolIcon
                        color={a.color}
                        initials={a.initials}
                        size={18}
                      />
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
      )}

      {stream === "data" && (
        <Card className="p-5" emphasis>
          <Section
            title="Where these rows come from"
            description="Each data-change row corresponds to a registered action — a (source, object, field) tuple with a trigger condition. Manage registrations in the Directory."
          >
            <div className="mt-3">
              <Link
                href="/directory/actions"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
              >
                Open Directory · Actions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Section>
        </Card>
      )}
    </div>
  );
}

function StreamTab({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center gap-1.5 h-9 px-3 -mb-px text-[12.5px] font-medium border-b-2 transition-colors",
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
    </Link>
  );
}
