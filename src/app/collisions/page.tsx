import { PageHeader, Section } from "@/components/ui/page-header";
import {
  Card,
  StatCard,
  StatusChip,
  ToolIcon,
} from "@/components/ui/primitives";
import {
  AGENTS_BY_ID,
  COLLISIONS,
  OVERVIEW_KPIS,
  RECORDS_BY_ID,
} from "@/lib/fixtures";
import { ShieldCheck, Zap, Swords } from "lucide-react";

const typeTone = {
  overlap: "amber",
  "lock-contention": "brand",
  redundant: "neutral",
  cooldown: "amber",
} as const;

export default function CollisionsPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Collisions"
        title="When two agents want the same record — we don't flip a coin."
        description="Deterministic resolution with priority rules, booking locks, and cooldown windows. Every collision is resolved in ≤10 ms and written to the ledger for audit."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Collisions · 24h"
          value={String(OVERVIEW_KPIS.collisions24h)}
          sublabel={`${(OVERVIEW_KPIS.collisionRate * 100).toFixed(1)}% of traffic`}
          tone="amber"
          icon={<Swords className="w-4 h-4" />}
        />
        <StatCard
          label="Avg resolution"
          value="7 ms"
          sublabel="p99 · 12 ms (Redis)"
          tone="green"
          icon={<Zap className="w-4 h-4" />}
        />
        <StatCard
          label="Auto-resolved"
          value="94.4%"
          sublabel="Resolved deterministically by policy"
          tone="green"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Conflicts directed to human approval"
          value="8"
          sublabel="Owner notified · 4‑min review window"
          tone="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
            <div className="w-[100px]">Detected</div>
            <div className="flex-1">Record</div>
            <div className="w-[180px]">Conflict</div>
            <div className="w-[100px]">Type</div>
            <div className="w-[70px] text-right">Latency</div>
          </div>
          <ul>
            {COLLISIONS.map((c) => {
              const r = RECORDS_BY_ID[c.recordId];
              const a = AGENTS_BY_ID[c.agentA];
              const b = AGENTS_BY_ID[c.agentB];
              const winner = c.winner
                ? AGENTS_BY_ID[c.winner]?.name
                : undefined;
              return (
                <li
                  key={c.id}
                  className="px-4 py-3 border-b border-border last:border-b-0 flex items-start gap-3 hover:bg-ink-50/40"
                >
                  <div className="w-[100px] text-[11.5px] text-muted tabular shrink-0">
                    {c.detectedAt}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-ink-900">
                      {r?.name}
                      <span className="text-muted font-normal">
                        {" "}
                        · {r?.company}
                      </span>
                    </div>
                    <div className="mt-1 text-[11.5px] text-ink-700">
                      → {c.resolution}
                      {winner && (
                        <span className="text-emerald-700 font-medium">
                          {" "}
                          · winner: {winner}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-[180px] flex items-center gap-1.5 shrink-0">
                    {a && (
                      <ToolIcon
                        color={a.color}
                        initials={a.initials}
                        size={18}
                      />
                    )}
                    <span className="text-[11.5px] text-ink-700 truncate">
                      {a?.name}
                    </span>
                    <span className="text-muted text-[10px]">vs</span>
                    {b && (
                      <ToolIcon
                        color={b.color}
                        initials={b.initials}
                        size={18}
                      />
                    )}
                    <span className="text-[11.5px] text-ink-700 truncate">
                      {b?.name}
                    </span>
                  </div>
                  <div className="w-[100px] shrink-0">
                    <StatusChip tone={typeTone[c.type]}>{c.type}</StatusChip>
                  </div>
                  <div className="w-[70px] text-right text-[11.5px] text-ink-700 tabular shrink-0">
                    {c.latencyMs} ms
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="lg:col-span-2 p-5">
          <Section
            title="Resolution logic"
            description="What the Coordinator considers, in order."
          >
            <ol className="mt-3 space-y-2.5 text-[12.5px]">
              {[
                {
                  n: "1",
                  t: "Booking lock",
                  d: "If any agent holds a 4-minute lock on the record, contenders WAIT.",
                },
                {
                  n: "2",
                  t: "Policy priority",
                  d: "Owner-scoped policies (e.g., CSM owns customers) beat vendor priority.",
                },
                {
                  n: "3",
                  t: "Vendor priority",
                  d: "Tenant-configurable: Warmly > ZoomInfo > 11x > Regie, for example.",
                },
                {
                  n: "4",
                  t: "Cooldown window",
                  d: "Newer request WAITs until the older touch clears its cooldown.",
                },
                {
                  n: "5",
                  t: "Fallback REDIRECT",
                  d: "If both agents are equally authorized, escalate to owner.",
                },
              ].map((s) => (
                <li key={s.n} className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-brand-50 text-brand-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">{s.t}</div>
                    <div className="text-muted">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </Card>
      </div>
    </div>
  );
}
