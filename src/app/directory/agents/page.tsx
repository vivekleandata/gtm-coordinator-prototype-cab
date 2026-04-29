import Link from "next/link";
import { Plus, Key } from "lucide-react";
import { Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { InfoHover } from "@/components/ui/info-hover";
import { AGENTS, AGENT_CATEGORIES, type Agent } from "@/lib/fixtures";
import { formatNumber, pct } from "@/lib/utils";

type Group = { key: string; label: string; blurb: string; agents: Agent[] };

function groupAgents(): Group[] {
  const seen = new Set<string>();
  const groups: Group[] = AGENT_CATEGORIES.map((cat) => {
    const agents = AGENTS.filter((a) => cat.kinds.includes(a.kind));
    agents.forEach((a) => seen.add(a.id));
    return {
      key: cat.key,
      label: cat.label,
      blurb: cat.blurb,
      agents,
    };
  }).filter((g) => g.agents.length > 0);

  // Anything not matched lands in a fallback bucket so the count always adds up.
  const orphans = AGENTS.filter((a) => !seen.has(a.id));
  if (orphans.length > 0) {
    groups.push({
      key: "other",
      label: "Other",
      blurb: "Agents without a declared category yet.",
      agents: orphans,
    });
  }
  return groups;
}

const STATUS_CHIP: Record<
  Agent["status"],
  { tone: "green" | "neutral" | "amber" | "red"; label: string }
> = {
  active: { tone: "green", label: "Active" },
  paused: { tone: "neutral", label: "Paused" },
  throttled: { tone: "amber", label: "Throttled" },
  revoked: { tone: "red", label: "Revoked" },
};

export default function DirectoryAgentsPage() {
  const groups = groupAgents();
  const totalActive = AGENTS.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="inline-flex items-center gap-2 text-[16.5px] font-semibold text-ink-900">
            Registered agents · {totalActive} active across {groups.length}{" "}
            categories
            <InfoHover>
              Every agent authenticates with a scoped API key and declares the
              actions it will take. Revoke, pause, or throttle any agent in one
              click.
            </InfoHover>
          </h2>
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

      {/* Category jump-bar */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <a
              key={g.key}
              href={`#cat-${g.key}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-ink-50 text-[11.5px] text-ink-700"
            >
              <span className="font-medium text-ink-800">{g.label}</span>
              <span className="text-muted tabular">{g.agents.length}</span>
            </a>
          ))}
        </div>
      </Card>

      {groups.map((g) => (
        <section key={g.key} id={`cat-${g.key}`} className="space-y-2.5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-[13.5px] font-semibold text-ink-900">
                {g.label}{" "}
                <span className="text-muted font-normal">
                  · {g.agents.length}
                </span>
              </h3>
              <p className="text-[11.5px] text-muted mt-0.5">{g.blurb}</p>
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
              {g.agents.map((a) => {
                const chip = STATUS_CHIP[a.status];
                return (
                  <li
                    key={a.id}
                    className="px-4 h-14 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
                  >
                    <div className="w-[260px] flex items-center gap-2.5 min-w-0">
                      <ToolIcon
                        color={a.color}
                        initials={a.initials}
                        size={26}
                      />
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
                      <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
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
                );
              })}
            </ul>
          </Card>
        </section>
      ))}

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
