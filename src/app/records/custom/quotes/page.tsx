import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { AGENTS_BY_ID, QUOTES, type Quote } from "@/lib/fixtures";

const stageTone: Record<Quote["stage"], "neutral" | "amber" | "green"> = {
  Draft: "neutral",
  "In Review": "neutral",
  "Pending Signature": "amber",
  Signed: "green",
  Expired: "neutral",
};

export default function QuotesPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Quotes"
        title="Quotes the Coordinator is watching."
        description="Custom CRM objects flow into the same observability surface as standard ones. Listen for stage changes, route them through preflight, and resolve agent collisions on revenue artifacts."
      />

      <RecordsFilters placeholder="Search quotes by number, account, or owner…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="w-[140px]">Quote #</div>
          <div className="flex-1">Account · Contact</div>
          <div className="w-[120px] text-right">Amount</div>
          <div className="w-[160px]">Stage</div>
          <div className="w-[160px]">Owner</div>
          <div className="w-[150px]">Active agents</div>
          <div className="w-[110px]">Last activity</div>
          <div className="w-[90px] text-right">Conflicts</div>
        </div>
        <ul>
          {QUOTES.map((q) => (
            <li
              key={q.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="w-[140px] flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <span className="text-[12.5px] font-mono text-ink-800 truncate">
                  {q.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900 truncate">
                  {q.account}
                </div>
                <div className="text-[11.5px] text-muted truncate">
                  {q.primaryContact}
                </div>
              </div>
              <div className="w-[120px] text-right tabular text-[13px] font-semibold text-ink-900">
                {q.amount}
              </div>
              <div className="w-[160px]">
                <StatusChip tone={stageTone[q.stage]}>{q.stage}</StatusChip>
              </div>
              <div className="w-[160px] text-[12.5px] text-ink-800 truncate">
                {q.ownerName}
              </div>
              <div className="w-[150px] flex items-center -space-x-1.5">
                {q.agentsActive.length === 0 ? (
                  <span className="text-[11.5px] text-muted">—</span>
                ) : (
                  q.agentsActive.map((aid) => {
                    const a = AGENTS_BY_ID[aid];
                    return a ? (
                      <ToolIcon
                        key={aid}
                        color={a.color}
                        initials={a.initials}
                        size={20}
                        className="ring-2 ring-white"
                      />
                    ) : null;
                  })
                )}
              </div>
              <div className="w-[110px] text-[11.5px] text-muted truncate">
                {q.lastActivity}
              </div>
              <div className="w-[90px] text-right tabular">
                {q.conflicts7d > 0 ? (
                  <span className="text-[12.5px] font-semibold text-amber-700">
                    {q.conflicts7d}
                  </span>
                ) : (
                  <span className="text-[12.5px] text-muted">—</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 flex items-center gap-4" emphasis>
        <FileText className="w-6 h-6 text-brand shrink-0" />
        <div className="text-[12.5px] text-ink-700">
          <span className="font-semibold text-ink-900">
            Why quotes are here.
          </span>{" "}
          The Coordinator subscribes to <code>Quote.Status</code>,{" "}
          <code>Quote.TotalAmount</code>, and <code>Quote.OwnerId</code> the
          moment the object is registered — agent or human edits both land in
          the Action Ledger so RevOps can audit pricing motion across the
          quote-to-cash flow.
        </div>
      </Card>
    </div>
  );
}
