"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AGENTS_BY_ID, RECORDS_BY_ID, getDecisions } from "@/lib/fixtures";
import type { PreflightEntry } from "@/lib/fixtures";
import { DecisionBadge, ToolIcon } from "@/components/ui/primitives";
import { cn, formatRelative } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function LiveDecisionFeed({
  limit,
  showFooter = true,
  liveStream = false,
  streamIntervalMs = 3500,
}: {
  limit?: number;
  showFooter?: boolean;
  liveStream?: boolean;
  streamIntervalMs?: number;
}) {
  // tick drives relative-time + fresh-row decay rerenders
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const pool = useMemo(() => getDecisions(), []);
  const initial = useMemo(
    () => (limit ? pool.slice(0, limit) : pool),
    [pool, limit],
  );

  const [entries, setEntries] = useState<PreflightEntry[]>(initial);
  const cursorRef = useRef(limit ?? pool.length);

  useEffect(() => {
    if (!liveStream || !limit || pool.length === 0) return;
    const id = setInterval(() => {
      setEntries((prev) => {
        const source = pool[cursorRef.current % pool.length];
        cursorRef.current += 1;
        const arrival: PreflightEntry = {
          ...source,
          // unique key + fresh timestamp so motion treats it as a new row
          id: `${source.id}-arr-${cursorRef.current}`,
          tsMs: Date.now(),
        };
        return [arrival, ...prev].slice(0, limit);
      });
    }, streamIntervalMs);
    return () => clearInterval(id);
  }, [liveStream, limit, pool, streamIntervalMs]);

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
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{
                layout: { duration: 0.35, ease: "easeOut" },
                opacity: { duration: 0.25 },
                y: { duration: 0.3, ease: "easeOut" },
                height: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <FeedRow entry={e} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function FeedRow({ entry }: { entry: PreflightEntry }) {
  const agent = AGENTS_BY_ID[entry.agentId];
  const record = RECORDS_BY_ID[entry.recordId];
  const fresh = Date.now() - entry.tsMs < 1800;

  return (
    <div
      className={cn(
        "px-4 py-2.5 flex items-center gap-3 transition-colors duration-700",
        fresh ? "bg-brand-50/70" : "hover:bg-ink-50/50",
      )}
    >
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
    </div>
  );
}
