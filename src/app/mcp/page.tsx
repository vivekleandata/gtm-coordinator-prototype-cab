import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { MCP_TOOLS } from "@/lib/fixtures";
import { Code2, Zap, Shield, Boxes } from "lucide-react";

export default function MCPPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="MCP & API"
        title="Built for the agent-native era."
        description="Every Coordinator capability is exposed three ways — REST for systems, the Model Context Protocol for AI agents, and the Partner SDK for vendors. Same contracts, same ledger."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            i: <Code2 className="w-4 h-4 text-brand" />,
            t: "REST",
            d: "OpenAPI 3.1 spec · Bearer auth · idempotency keys",
          },
          {
            i: <Boxes className="w-4 h-4 text-brand" />,
            t: "MCP Server",
            d: "7 tools · stdio + SSE transport · resource subscriptions",
          },
          {
            i: <Shield className="w-4 h-4 text-brand" />,
            t: "Partner SDK",
            d: "Node + Python · typed · retries + circuit breakers",
          },
        ].map((c) => (
          <Card
            key={c.t}
            className="p-4 flex items-start gap-3 product-card-hover"
          >
            <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              {c.i}
            </div>
            <div>
              <h3 className="text-[13.5px] font-semibold text-ink-900">
                {c.t}
              </h3>
              <p className="text-[12px] text-muted">{c.d}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <Section
          title="MCP tool definitions"
          description="Drop the Coordinator MCP server into any agent framework — Claude, LangGraph, custom — and these tools appear."
        >
          <ul className="mt-3 divide-y divide-border">
            {MCP_TOOLS.map((t) => (
              <li key={t.name} className="py-3 flex items-start gap-3">
                <code className="mono text-[12.5px] text-brand-700 font-semibold w-[170px] shrink-0">
                  {t.name}
                </code>
                <div className="flex-1">
                  <div className="text-[12.5px] text-ink-800">
                    {t.description}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.params.map((p) => (
                      <code
                        key={p}
                        className="px-1.5 py-0.5 rounded text-[10.5px] font-mono bg-ink-50 text-ink-700 border border-ink-100"
                      >
                        {p}
                      </code>
                    ))}
                  </div>
                </div>
                <StatusChip tone="green">GA</StatusChip>
              </li>
            ))}
          </ul>
        </Section>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <Section title="Node · Partner SDK">
            <pre className="mt-3 p-4 rounded-md bg-ink-900 text-ink-100 text-[11.5px] leading-relaxed overflow-auto font-mono">
              {`import { Coordinator } from "@leandata/coordinator";

const coord = new Coordinator({
  apiKey: process.env.COORDINATOR_KEY,
  agentId: "agt_my_custom_agent",
});

const decision = await coord.preflight({
  action: "send_email",
  record: { identifier: lead.email, identifier_type: "email" },
  context: { campaign: "q2-outbound" },
});

if (decision.decision === "GO") {
  await sendEmail(lead);
  await coord.logAction({ outcome: "email_sent" });
}`}
            </pre>
          </Section>
        </Card>
        <Card className="p-5">
          <Section title="Python · MCP client">
            <pre className="mt-3 p-4 rounded-md bg-ink-900 text-ink-100 text-[11.5px] leading-relaxed overflow-auto font-mono">
              {`from mcp.client import Client

async with Client("stdio://coordinator-mcp") as c:
    result = await c.call_tool(
        "preflight",
        {
            "agent_id": "agt_my_custom_agent",
            "action": "schedule_meeting",
            "record_identifier": "jane@bigcorp.com",
        },
    )
    if result["decision"] == "GO":
        await book_meeting(...)`}
            </pre>
          </Section>
        </Card>
      </div>

      <Card className="p-5" emphasis>
        <div className="flex items-center gap-4">
          <Zap className="w-6 h-6 text-brand shrink-0" />
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-ink-900 hero-serif">
              The Coordinator is a control plane, not a wall.
            </h3>
            <p className="text-[12.5px] text-muted mt-0.5">
              Fail-open mode means if the Coordinator is ever unreachable,
              agents still function — they just fall back to their own judgment.
              Observability on every decision.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
