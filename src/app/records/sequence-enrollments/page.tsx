import { ListOrdered, Bot } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import {
  AGENTS_BY_ID,
  RECORD_SET_SOURCES,
  SEQUENCE_ENROLLMENTS,
  type SequenceEnrollment,
} from "@/lib/fixtures";

const statusTone: Record<
  SequenceEnrollment["status"],
  "green" | "amber" | "neutral" | "brand"
> = {
  Active: "green",
  Paused: "neutral",
  Completed: "neutral",
  "Out of office": "amber",
  Replied: "brand",
};

export default function SequenceEnrollmentsPage() {
  const meta = RECORD_SET_SOURCES["sequence-enrollments"];
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Sequence Enrollments"
        title="Active sequence + program enrollments."
        description="Outreach sequences, Marketo smart campaigns, HubSpot workflows — every contact's enrollment state in one place. Single-sequence-lock policy lives or dies on this view."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search enrollments by contact, sequence, or owner…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Contact · Sequence</div>
          <div className="w-[120px]">Step</div>
          <div className="w-[150px]">Status</div>
          <div className="w-[170px]">Enrolled by</div>
          <div className="w-[110px]">Last send</div>
          <div className="w-[80px]">Source</div>
          <div className="w-[100px] text-right">Collisions</div>
        </div>
        <ul>
          {SEQUENCE_ENROLLMENTS.map((e) => {
            const enroller =
              e.enrolledByKind === "agent" ? AGENTS_BY_ID[e.enrolledBy] : null;
            return (
              <li
                key={e.id}
                className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
              >
                <div className="flex-1 min-w-0 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-ink-900 truncate">
                      {e.contact} · {e.account}
                    </div>
                    <div className="text-[11.5px] text-muted truncate">
                      {e.sequence}
                    </div>
                  </div>
                </div>
                <div className="w-[120px] text-[12.5px] text-ink-800 truncate tabular">
                  {e.step}
                </div>
                <div className="w-[150px]">
                  <StatusChip tone={statusTone[e.status]}>
                    {e.status}
                  </StatusChip>
                </div>
                <div className="w-[170px] flex items-center gap-2 min-w-0">
                  {enroller ? (
                    <ToolIcon
                      color={enroller.color}
                      initials={enroller.initials}
                      size={20}
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-md bg-ink-100 text-ink-500 flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-[12.5px] text-ink-800 truncate">
                    {enroller ? enroller.name : e.enrolledBy}
                  </span>
                </div>
                <div className="w-[110px] text-[11.5px] text-muted truncate">
                  {e.lastSendAt}
                </div>
                <div className="w-[80px]">
                  <SourceChip source={e.source} size="sm" />
                </div>
                <div className="w-[100px] text-right tabular">
                  {e.collisions7d > 0 ? (
                    <span className="text-[12.5px] font-semibold text-amber-700">
                      {e.collisions7d}
                    </span>
                  ) : (
                    <span className="text-[12.5px] text-muted">—</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
