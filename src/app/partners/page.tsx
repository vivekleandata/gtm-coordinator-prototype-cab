import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { PARTNERS } from "@/lib/fixtures";
import { Plug, Webhook } from "lucide-react";

export default function PartnersPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Partners"
        title="The AI agent ecosystem, on a common substrate."
        description="Every partner plugs in the same way: register an agent, declare actions, call Preflight. No custom integration per vendor, no point-to-point conflicts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PARTNERS.map((p) => (
          <Card
            key={p.slug}
            className="p-4 product-card-hover cursor-pointer space-y-3"
          >
            <div className="flex items-start gap-3">
              <ToolIcon color={p.logoColor} initials={p.initials} size={34} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-ink-900">
                    {p.name}
                  </h3>
                  {p.status === "connected" && (
                    <StatusChip tone="green">Connected</StatusChip>
                  )}
                  {p.status === "available" && (
                    <StatusChip tone="neutral">Available</StatusChip>
                  )}
                  {p.status === "coming-soon" && (
                    <StatusChip tone="amber">Soon</StatusChip>
                  )}
                </div>
                <div className="text-[11px] text-muted uppercase tracking-wide font-semibold mt-0.5">
                  {p.category}
                </div>
              </div>
            </div>
            <p className="text-[12.5px] text-muted leading-relaxed">
              {p.description}
            </p>
            <div className="text-[11.5px] text-ink-700 border-t border-border pt-2 flex items-center justify-between">
              <span>
                {p.agentsRegistered > 0
                  ? `${p.agentsRegistered} agent${p.agentsRegistered > 1 ? "s" : ""} registered`
                  : "No agents registered"}
              </span>
              <span className="text-brand-700 font-medium">
                {p.status === "connected" ? "Manage →" : "Connect →"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <Section
          title="Webhook deliveries · last 24h"
          description="Outbound notifications to partners when decisions flip"
        >
          <ul className="mt-3 divide-y divide-border">
            {[
              {
                t: "2 min ago",
                event: "decision.redirected",
                partner: "11x",
                status: "200",
                tone: "green",
              },
              {
                t: "5 min ago",
                event: "budget.exhausted",
                partner: "Warmly",
                status: "200",
                tone: "green",
              },
              {
                t: "12 min ago",
                event: "agent.throttled",
                partner: "Regie.ai",
                status: "200",
                tone: "green",
              },
              {
                t: "38 min ago",
                event: "meeting.booked",
                partner: "OneMind",
                status: "200",
                tone: "green",
              },
              {
                t: "1h ago",
                event: "collision.detected",
                partner: "Warmly",
                status: "500 → retried 200",
                tone: "amber",
              },
            ].map((row, i) => (
              <li
                key={i}
                className="py-2.5 flex items-center gap-3 text-[12.5px]"
              >
                <Webhook className="w-3.5 h-3.5 text-muted" />
                <code className="font-mono text-[11.5px] text-ink-700 w-[180px]">
                  {row.event}
                </code>
                <div className="flex-1 text-ink-700">{row.partner}</div>
                <div
                  className={
                    row.tone === "green"
                      ? "chip bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "chip bg-amber-50 text-amber-700 border border-amber-200"
                  }
                >
                  {row.status}
                </div>
                <div className="w-[80px] text-right text-[11px] text-muted tabular">
                  {row.t}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Card>

      <Card className="p-5" emphasis>
        <div className="flex items-center gap-4">
          <Plug className="w-6 h-6 text-brand shrink-0" />
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-ink-900 hero-serif">
              Built your own agent?
            </h3>
            <p className="text-[12.5px] text-muted mt-0.5">
              Use the Partner SDK (Node / Python) or the MCP server to register
              a custom agent in an afternoon. Same API, same ledger, same
              guardrails.
            </p>
          </div>
          <a
            href="/mcp"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
          >
            Read docs →
          </a>
        </div>
      </Card>
    </div>
  );
}
