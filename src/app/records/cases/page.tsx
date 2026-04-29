import { LifeBuoy, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import { CASES, RECORD_SET_SOURCES, type SupportCase } from "@/lib/fixtures";

const priorityTone: Record<
  SupportCase["priority"],
  "red" | "amber" | "neutral"
> = {
  P1: "red",
  P2: "amber",
  P3: "neutral",
  P4: "neutral",
};

const statusTone: Record<
  SupportCase["status"],
  "neutral" | "amber" | "green" | "red"
> = {
  New: "amber",
  Working: "amber",
  "Waiting on customer": "neutral",
  Escalated: "red",
  Resolved: "green",
};

export default function CasesPage() {
  const meta = RECORD_SET_SOURCES.cases;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Cases"
        title="Support cases gating outbound."
        description="Open Salesforce + Zendesk cases linked to a contact. P1 cases automatically pause outbound sequences on the same account until resolution — visible to every agent that runs preflight."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search cases by subject, account, or owner…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Case</div>
          <div className="w-[80px]">Priority</div>
          <div className="w-[160px]">Status</div>
          <div className="w-[140px]">Owner</div>
          <div className="w-[140px]">Outbound</div>
          <div className="w-[110px]">Opened</div>
          <div className="w-[80px]">Source</div>
        </div>
        <ul>
          {CASES.map((c) => (
            <li
              key={c.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {c.subject}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {c.account} · {c.contact}
                  </div>
                </div>
              </div>
              <div className="w-[80px]">
                <StatusChip tone={priorityTone[c.priority]}>
                  {c.priority}
                </StatusChip>
              </div>
              <div className="w-[160px]">
                <StatusChip tone={statusTone[c.status]}>{c.status}</StatusChip>
              </div>
              <div className="w-[140px] text-[12.5px] text-ink-800 truncate">
                {c.ownerName}
              </div>
              <div className="w-[140px]">
                {c.blocksOutbound ? (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-red-700">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Outbound paused
                  </span>
                ) : (
                  <span className="text-[11.5px] text-muted">—</span>
                )}
              </div>
              <div className="w-[110px] text-[11.5px] text-muted truncate">
                {c.openedAt}
              </div>
              <div className="w-[80px]">
                <SourceChip source={c.source} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
