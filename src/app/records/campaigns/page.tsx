import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import { CAMPAIGNS, RECORD_SET_SOURCES, type Campaign } from "@/lib/fixtures";

const statusTone: Record<Campaign["status"], "green" | "amber" | "neutral"> = {
  Active: "green",
  Scheduled: "amber",
  Paused: "neutral",
  Completed: "neutral",
};

export default function CampaignsPage() {
  const meta = RECORD_SET_SOURCES.campaigns;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Campaigns"
        title="Marketing campaigns the Coordinator is watching."
        description="Marketo programs, Salesforce campaigns, and HubSpot workflows. Members rolled up against communication budgets — Tier-1 contacts already in 4 campaigns are at cap before any outbound agent can fire."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search campaigns by name, type, or owner…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Campaign</div>
          <div className="w-[140px]">Type</div>
          <div className="w-[100px] text-right">Members</div>
          <div className="w-[120px]">Status</div>
          <div className="w-[150px]">Owner</div>
          <div className="w-[140px]">Budget exposure</div>
          <div className="w-[110px]">Last send</div>
          <div className="w-[80px]">Source</div>
        </div>
        <ul>
          {CAMPAIGNS.map((c) => (
            <li
              key={c.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Megaphone className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {c.name}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {c.channel}
                  </div>
                </div>
              </div>
              <div className="w-[140px] text-[12.5px] text-ink-800 truncate">
                {c.type}
              </div>
              <div className="w-[100px] text-right tabular text-[12.5px] font-medium text-ink-800">
                {c.members.toLocaleString()}
              </div>
              <div className="w-[120px]">
                <StatusChip tone={statusTone[c.status]}>{c.status}</StatusChip>
              </div>
              <div className="w-[150px] text-[12.5px] text-ink-800 truncate">
                {c.ownerName}
              </div>
              <div className="w-[140px] flex items-center gap-2">
                <span
                  className={`text-[12.5px] tabular font-semibold ${
                    c.budgetExposure >= 20
                      ? "text-red-700"
                      : c.budgetExposure >= 10
                        ? "text-amber-700"
                        : "text-ink-700"
                  }`}
                >
                  {c.budgetExposure}%
                </span>
                <span className="text-[11px] text-muted">at cap</span>
              </div>
              <div className="w-[110px] text-[11.5px] text-muted truncate">
                {c.lastSendAt}
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
