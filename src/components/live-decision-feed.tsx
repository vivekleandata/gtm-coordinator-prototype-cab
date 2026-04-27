"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AGENTS_BY_ID, RECORDS_BY_ID, getDecisions } from "@/lib/fixtures";
import type { PreflightEntry } from "@/lib/fixtures";
import { DecisionBadge, ToolIcon } from "@/components/ui/primitives";
import { formatRelative } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function LiveDecisionFeed({
  limit,
  showFooter = true,
}: {
  limit?: number;
  showFooter?: boolean;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const entries = useMemo(() => {
    const all = getDecisions();
    return limit ? all.slice(0, limit) : all;
    // tick drives relative-time rerender
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, limit]);

  return (
    <div className="product-card overflow-hidden">
      <div className="h-11 px-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[12.5px] font-semibold text-ink-900">
            Live preflight decisions
          </span>
          <span className="text-[11px] text-muted tabular">
            p95 287 ms · last 15 min
          </span>
        </div>
        {showFooter && (
          <button className="text-[11.5px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1">
            View full stream <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <ul className="divide-y divide-border">
        {entries.map((e) => (
          <FeedRow key={e.id} entry={e} />
        ))}
      </ul>
    </div>
  );
}

function FeedRow({ entry }: { entry: PreflightEntry }) {
  const agent = AGENTS_BY_ID[entry.agentId];
  const record = RECORDS_BY_ID[entry.recordId];
  const [isNew, setIsNew] = useState(false);
  const prev = useRef(entry.tsMs);
  useEffect(() => {
    if (prev.current !== entry.tsMs) {
      setIsNew(true);
      const id = setTimeout(() => setIsNew(false), 600);
      prev.current = entry.tsMs;
      return () => clearTimeout(id);
    }
  }, [entry.tsMs]);

  return (
    <li className="px-4 py-2.5 flex items-center gap-3 hover:bg-ink-50/50 transition-colors">
      <div className="w-14 shrink-0 text-[11px] text-muted tabular">
        {formatRelative(entry.tsMs)}
      </div>
      <div className="flex items-center gap-2 w-44 shrink-0">
        {agent && (
          <ToolIcon color={agent.color} initials={agent.initials} size={18} />
        )}
        <div className="text-[12px] text-ink-800 font-medium truncate">
          {agent?.name ?? entry.agentId}
        </div>
      </div>
      <code className="w-36 shrink-0 text-[11px] font-mono text-ink-600 truncate">
        {entry.action}
      </code>
      <div className="flex-1 min-w-0 text-[12px] text-ink-700 truncate">
        <span className="font-medium">{record?.name ?? "unknown"}</span>
        <span className="text-muted"> · {record?.company}</span>
      </div>
      <div className="w-20 shrink-0 flex justify-end">
        <DecisionBadge decision={entry.decision} />
      </div>
      <div className="w-[260px] shrink-0 text-[11.5px] text-muted truncate hidden lg:block">
        {entry.reason}
      </div>
      <div className="w-14 shrink-0 text-[11px] text-muted tabular text-right">
        {entry.latencyMs} ms
      </div>
      {isNew && (
        <span className="absolute w-1 h-full bg-brand/40 left-0 top-0 animate-fade-in" />
      )}
    </li>
  );
}
