import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta } from "@/components/ui/source-chip";
import { MEETINGS, RECORD_SET_SOURCES, type Meeting } from "@/lib/fixtures";

const statusTone: Record<Meeting["status"], "green" | "amber" | "neutral"> = {
  confirmed: "green",
  pending: "amber",
  rescheduled: "neutral",
};

const statusLabel: Record<Meeting["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  rescheduled: "Rescheduled",
};

export default function MeetingsPage() {
  const meta = RECORD_SET_SOURCES.meetings;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Meetings"
        title="Booked meetings — every scheduling tool, one ledger."
        description="BookIt, 1Mind, Chili Piper, calendar plugins, and Gong-recorded calls all flow into one canonical Meeting record. Booking locks and 24h quiet-holds visible to every agent."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search meetings by attendee or company…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Attendee</div>
          <div className="w-[160px]">Booked by</div>
          <div className="w-[160px]">Assigned to</div>
          <div className="w-[120px]">When</div>
          <div className="w-[80px]">Duration</div>
          <div className="flex-1">Source</div>
          <div className="w-[120px]">Status</div>
        </div>
        <ul>
          {MEETINGS.map((m) => (
            <li
              key={m.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {m.recordName}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {m.company}
                  </div>
                </div>
              </div>
              <div className="w-[160px] text-[12.5px] text-ink-800 truncate">
                {m.bookedBy}
              </div>
              <div className="w-[160px] text-[12.5px] text-ink-800 truncate">
                {m.assignedTo}
              </div>
              <div className="w-[120px] text-[12.5px] text-ink-800 truncate">
                {m.when}
              </div>
              <div className="w-[80px] text-[12.5px] text-ink-800 tabular">
                {m.duration}
              </div>
              <div className="flex-1 text-[11.5px] text-muted truncate">
                {m.source}
              </div>
              <div className="w-[120px]">
                <StatusChip tone={statusTone[m.status]}>
                  {statusLabel[m.status]}
                </StatusChip>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
