import { Coins } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { BUDGETS } from "@/lib/fixtures";

export default function BudgetsPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Communication Budgets"
        title="One touch budget per record — across every agent."
        description="Whether it’s 11x, Warmly, your in-house agent or a human SDR — the budget is shared. The Coordinator enforces it in Redis in ≤10 ms."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {BUDGETS.map((b) => (
          <Card key={b.name} className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-brand" />
                <h3 className="text-[14.5px] font-semibold text-ink-900">
                  {b.name}
                </h3>
              </div>
              <p className="text-[11.5px] text-muted mt-0.5">
                Shared across all agents, counted per record.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Ring label="Weekly" value={b.weeklyTouches} />
              <Ring label="Daily" value={b.dailyTouches} />
              <Ring label="Cooldown" value={`${b.cooldownMinutes}m`} />
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wide text-muted font-semibold">
                Channel caps
              </div>
              <ul className="space-y-1 text-[12px]">
                {b.channelCaps.map((c) => (
                  <li
                    key={c.channel}
                    className="flex items-center justify-between border-t border-border first:border-t-0 pt-1 first:pt-0"
                  >
                    <span className="text-ink-800">{c.channel}</span>
                    <span className="text-muted tabular">
                      {c.cap} {c.period}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5" emphasis>
        <Section
          title="Budget evaluation order"
          description="Policies evaluate hierarchically — most specific wins."
        >
          <ol className="mt-3 grid md:grid-cols-4 gap-3 text-[12px]">
            {[
              {
                n: "1",
                label: "Record override",
                detail: "VIP, DNC, executive flag",
              },
              {
                n: "2",
                label: "Segment tier",
                detail: "Tier 1 / 2 / 3",
              },
              {
                n: "3",
                label: "Channel cap",
                detail: "Email / LinkedIn / chat / phone",
              },
              {
                n: "4",
                label: "Global floor",
                detail: "Tenant-wide minimum",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-md border border-border bg-surface p-3"
              >
                <div className="w-5 h-5 rounded bg-brand text-white flex items-center justify-center text-[10px] font-bold mb-1.5">
                  {s.n}
                </div>
                <div className="text-ink-900 font-semibold">{s.label}</div>
                <div className="text-muted">{s.detail}</div>
              </li>
            ))}
          </ol>
        </Section>
      </Card>

      <Card className="p-5">
        <Section
          title="Recent budget enforcement"
          description="NO_GO and WAIT decisions driven by budget alone · last 24h"
        >
          <ul className="mt-3 divide-y divide-border">
            {[
              {
                record: "John Smith · StartupIO",
                rule: "Tier 2 · weekly cap 9/9",
                agent: "Warmly",
                decision: "NO_GO",
              },
              {
                record: "Jane Doe · BigCorp",
                rule: "Tier 1 · owner cooldown 60m",
                agent: "11x Alice",
                decision: "WAIT",
              },
              {
                record: "Emma Walsh · Tech Co",
                rule: "Tier 2 · email daily cap 1/1",
                agent: "Regie.ai",
                decision: "NO_GO",
              },
              {
                record: "Mike Rodriguez · Company Inc",
                rule: "Tier 1 · channel LinkedIn 1/1",
                agent: "11x Alice",
                decision: "WAIT",
              },
            ].map((r, i) => (
              <li
                key={i}
                className="py-2.5 flex items-center gap-3 text-[12.5px]"
              >
                <div className="flex-1 text-ink-800">{r.record}</div>
                <div className="w-[240px] text-muted">{r.rule}</div>
                <div className="w-[120px] text-ink-700">{r.agent}</div>
                <div className="w-[80px]">
                  <StatusChip tone={r.decision === "NO_GO" ? "red" : "amber"}>
                    {r.decision}
                  </StatusChip>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Card>
    </div>
  );
}

function Ring({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex-1 rounded-md border border-border bg-surface p-3 text-center">
      <div className="text-[22px] font-semibold text-ink-900 tabular">
        {value}
      </div>
      <div className="text-[10.5px] uppercase tracking-wide text-muted font-semibold">
        {label}
      </div>
    </div>
  );
}
