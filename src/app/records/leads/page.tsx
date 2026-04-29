import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import {
  AGENTS_BY_ID,
  LEADS,
  RECORD_SET_SOURCES,
  type Lead,
} from "@/lib/fixtures";

const statusTone: Record<
  Lead["status"],
  "neutral" | "amber" | "green" | "red"
> = {
  New: "neutral",
  Working: "amber",
  Nurture: "neutral",
  MQL: "green",
  Disqualified: "red",
};

export default function LeadsPage() {
  const meta = RECORD_SET_SOURCES.leads;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Leads"
        title="Pre-conversion leads, resolved across systems."
        description="Marketo form-fills, HubSpot lifecycle leads, and Salesforce inbound — all collapsed to one canonical identity before any agent acts."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search leads by name, email, or company…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Lead</div>
          <div className="w-[140px]">Status</div>
          <div className="w-[80px] text-right">Score</div>
          <div className="w-[150px]">Owner</div>
          <div className="w-[140px]">Active agents</div>
          <div className="w-[110px]">Last touched</div>
          <div className="w-[110px]">Source</div>
        </div>
        <ul>
          {LEADS.map((l) => (
            <li
              key={l.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <UserPlus className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {l.name}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {l.email} · {l.company}
                  </div>
                </div>
              </div>
              <div className="w-[140px]">
                <StatusChip tone={statusTone[l.status]}>{l.status}</StatusChip>
              </div>
              <div className="w-[80px] text-right tabular text-[12.5px] font-semibold text-ink-800">
                {l.score}
              </div>
              <div className="w-[150px] text-[12.5px] text-ink-800 truncate">
                {l.ownerName}
              </div>
              <div className="w-[140px] flex items-center -space-x-1.5">
                {l.agentsActive.length === 0 ? (
                  <span className="text-[11.5px] text-muted">—</span>
                ) : (
                  l.agentsActive.map((aid) => {
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
                {l.lastTouched}
              </div>
              <div className="w-[110px] flex items-center gap-1">
                {l.sources.map((s) => (
                  <SourceChip key={s} source={s} size="sm" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
