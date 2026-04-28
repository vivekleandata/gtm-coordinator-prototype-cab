import Link from "next/link";
import { Plus, Key } from "lucide-react";
import { Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { AGENTS } from "@/lib/fixtures";
import { formatNumber, pct } from "@/lib/utils";

export default function DirectoryAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-[16.5px] font-semibold text-ink-900">
            Registered agents ·{" "}
            {AGENTS.filter((a) => a.status === "active").length} active
          </h2>
          <p className="mt-1 text-[12.5px] text-muted max-w-2xl">
            Every agent authenticates with a scoped API key and declares the
            actions it will take. Revoke, pause, or throttle any agent in one
            click.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800">
            <Key className="w-3.5 h-3.5" /> Rotate keys
          </button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white">
            <Plus className="w-3.5 h-3.5" /> Register agent
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="w-[260px]">Agent</div>
          <div className="w-[110px]">Vendor</div>
          <div className="w-[100px]">Status</div>
          <div className="flex-1">Declared actions</div>
          <div className="w-[120px] text-right">Preflights · 24h</div>
          <div className="w-[80px] text-right">GO rate</div>
          <div className="w-[100px] text-right">Last active</div>
        </div>
        <ul>
          {AGENTS.map((a) => (
            <li
              key={a.id}
              className="px-4 h-14 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="w-[260px] flex items-center gap-2.5 min-w-0">
                <ToolIcon color={a.color} initials={a.initials} size={26} />
                <div className="min-w-0">
                  <Link
                    href={`/directory/agents/${a.id}`}
                    className="text-[13px] font-semibold text-ink-900 hover:text-brand-700 truncate block"
                  >
                    {a.name}
                  </Link>
                  <div className="text-[10.5px] text-muted font-mono truncate">
                    {a.apiKeyPreview}
                  </div>
                </div>
              </div>
              <div className="w-[110px] text-[12px] text-ink-700">
                {a.vendor}
              </div>
              <div className="w-[100px]">
                {a.status === "active" && (
                  <StatusChip tone="green">Active</StatusChip>
                )}
                {a.status === "paused" && (
                  <StatusChip tone="neutral">Paused</StatusChip>
                )}
                {a.status === "throttled" && (
                  <StatusChip tone="amber">Throttled</StatusChip>
                )}
                {a.status === "revoked" && (
                  <StatusChip tone="red">Revoked</StatusChip>
                )}
              </div>
              <div className="flex-1 flex flex-wrap gap-1">
                {a.declaredActions.map((ac) => (
                  <code
                    key={ac}
                    className="px-1.5 py-0.5 rounded text-[10.5px] font-mono bg-ink-50 text-ink-700 border border-ink-100"
                  >
                    {ac}
                  </code>
                ))}
              </div>
              <div className="w-[120px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {formatNumber(a.preflights24h)}
              </div>
              <div className="w-[80px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {pct(a.goRate, 0)}
              </div>
              <div className="w-[100px] text-right text-[11.5px] text-muted">
                {a.lastActive}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5" emphasis>
        <Section
          title="How agent registration works"
          description="Any agent can integrate in an afternoon."
        >
          <ol className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px] text-ink-800">
            {[
              {
                n: "1",
                t: "Register the agent",
                d: "Declare vendor, kind, and the exact set of actions the agent is allowed to request.",
              },
              {
                n: "2",
                t: "Receive a scoped key",
                d: "Keys are scoped to tenant + declared actions. Rotate, revoke, or throttle without downtime.",
              },
              {
                n: "3",
                t: "Call Preflight before each action",
                d: "The Coordinator returns a decision in <500 ms. Act, wait, redirect, or stop — no ambiguity.",
              },
            ].map((s) => (
              <li key={s.n} className="space-y-1">
                <div className="w-6 h-6 rounded-md bg-brand text-white flex items-center justify-center text-[11px] font-bold">
                  {s.n}
                </div>
                <div className="font-semibold text-ink-900">{s.t}</div>
                <div className="text-muted text-[12px]">{s.d}</div>
              </li>
            ))}
          </ol>
        </Section>
      </Card>
    </div>
  );
}
