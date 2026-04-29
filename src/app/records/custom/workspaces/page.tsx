import { Server } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import { RECORD_SET_SOURCES, WORKSPACES, type Workspace } from "@/lib/fixtures";

const statusTone: Record<
  Workspace["status"],
  "green" | "amber" | "neutral" | "red"
> = {
  Active: "green",
  Trial: "amber",
  Inactive: "neutral",
  Suspended: "red",
};

export default function WorkspacesPage() {
  const meta = RECORD_SET_SOURCES.workspaces;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Workspaces"
        title="Product tenants, joined to CRM accounts."
        description="One Salesforce Account ↔ many Snowflake workspaces. The Coordinator routes product-led signals (trial expansion, seat adds) to the right CSM/AE without double-touching the parent account."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search workspaces by name, account, or plan…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Workspace</div>
          <div className="w-[150px]">Account</div>
          <div className="w-[120px]">Plan</div>
          <div className="w-[80px] text-right">Seats</div>
          <div className="w-[80px] text-right">MAU</div>
          <div className="w-[120px]">Created</div>
          <div className="w-[110px]">Status</div>
          <div className="w-[110px]">Source</div>
        </div>
        <ul>
          {WORKSPACES.map((w) => (
            <li
              key={w.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Server className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-mono font-semibold text-ink-900 truncate">
                    {w.name}
                  </div>
                </div>
              </div>
              <div className="w-[150px] text-[12.5px] text-ink-800 truncate">
                {w.account}
              </div>
              <div className="w-[120px] text-[12.5px] text-ink-800 truncate">
                {w.plan}
              </div>
              <div className="w-[80px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {w.seats}
              </div>
              <div className="w-[80px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {w.mau}
              </div>
              <div className="w-[120px] text-[11.5px] text-muted truncate tabular">
                {w.createdAt}
              </div>
              <div className="w-[110px]">
                <StatusChip tone={statusTone[w.status]}>{w.status}</StatusChip>
              </div>
              <div className="w-[110px] flex items-center gap-1">
                {w.sources.map((s) => (
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
