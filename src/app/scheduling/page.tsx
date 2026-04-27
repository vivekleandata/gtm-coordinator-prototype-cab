import { CalendarCheck, Check, Clock, ShieldCheck, Users } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatCard, StatusChip } from "@/components/ui/primitives";
import { MEETINGS, OVERVIEW_KPIS } from "@/lib/fixtures";

const statusTone = {
  confirmed: "green",
  pending: "amber",
  rescheduled: "neutral",
} as const;

export default function SchedulingPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Agentic Scheduling"
        title="Meetings booked by agents — routed to the right human."
        description="Exactly-once booking with calendar locks, round-robin pool support, and automatic owner resolution. Agents stop stepping on each other; humans keep the handshake."
      />

      <Card className="p-4 flex items-center gap-3" emphasis>
        <Check className="w-4 h-4 text-emerald-600" />
        <div className="flex-1 text-[12.5px] text-ink-700">
          <span className="font-semibold text-ink-900">
            All calendar tokens healthy.
          </span>{" "}
          12 Google + 8 Microsoft calendars connected. Last verified 5 min ago.
          Token auto-refresh: enabled.
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Meetings · 30d"
          value={String(OVERVIEW_KPIS.meetingsBooked30d)}
          sublabel="↑ 18% vs last month"
          tone="brand"
          icon={<CalendarCheck className="w-4 h-4" />}
        />
        <StatCard
          label="First touch → meeting"
          value={`${OVERVIEW_KPIS.avgTimeToMeetingDays} days`}
          sublabel="↓ 0.4 days improvement"
          tone="green"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Double-books prevented"
          value="41"
          sublabel="Booking lock + exactly-once"
          tone="brand"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Round-robin pools"
          value="6"
          sublabel="EMEA-Ent, NA-SDR, + 4 others"
          tone="brand"
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="w-[160px]">When</div>
          <div className="flex-1">Record</div>
          <div className="w-[180px]">Booked by</div>
          <div className="w-[160px]">Assigned to</div>
          <div className="w-[220px]">Source</div>
          <div className="w-[110px]">Status</div>
        </div>
        <ul>
          {MEETINGS.map((m) => (
            <li
              key={m.id}
              className="px-4 h-14 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40"
            >
              <div className="w-[160px] text-[12.5px] text-ink-800">
                {m.when}{" "}
                <span className="text-muted tabular">· {m.duration}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900">
                  {m.recordName}
                </div>
                <div className="text-[11.5px] text-muted">{m.company}</div>
              </div>
              <div className="w-[180px] text-[12px] text-ink-700">
                {m.bookedBy}
              </div>
              <div className="w-[160px] text-[12px] text-ink-700">
                {m.assignedTo}
              </div>
              <div className="w-[220px] text-[11.5px] text-muted">
                {m.source}
              </div>
              <div className="w-[110px]">
                <StatusChip tone={statusTone[m.status]}>{m.status}</StatusChip>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <Section
            title="Exactly-once booking"
            description="Two agents try to book the same slot — only one succeeds."
          >
            <ol className="mt-3 space-y-2.5 text-[12.5px]">
              <TimeRow
                t="14:03:12"
                s="OneMind requests slot Tue 2pm for Jane Doe."
              />
              <TimeRow
                t="14:03:12"
                s="Coordinator acquires booking lock rec_jane_bigcorp (TTL 240s)."
                tone="brand"
              />
              <TimeRow t="14:03:14" s="11x Alice requests the same slot." />
              <TimeRow
                t="14:03:14"
                s="Coordinator returns WAIT — lock held by OneMind."
                tone="amber"
              />
              <TimeRow
                t="14:03:18"
                s="OneMind completes booking via Google Calendar API. Lock released."
                tone="green"
              />
              <TimeRow
                t="14:03:19"
                s="11x Alice's retry returns GO — finds conflicting meeting, chooses next slot."
              />
            </ol>
          </Section>
        </Card>
        <Card className="p-5">
          <Section
            title="Round-robin pool health"
            description="Load + availability across pools"
          >
            <ul className="mt-3 space-y-3 text-[12.5px]">
              {[
                { pool: "EMEA-Ent", owners: 6, load: 0.72, avail: "68%" },
                { pool: "NA-SDR", owners: 9, load: 0.41, avail: "82%" },
                { pool: "NA-East-AE", owners: 4, load: 0.88, avail: "31%" },
                { pool: "APJ-MM", owners: 3, load: 0.58, avail: "74%" },
              ].map((p) => (
                <li key={p.pool} className="flex items-center gap-3">
                  <div className="w-[120px] text-ink-900 font-semibold">
                    {p.pool}
                  </div>
                  <div className="w-[80px] text-muted text-[11.5px]">
                    {p.owners} owners
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className={
                        p.load > 0.8 ? "h-full bg-amber-500" : "h-full bg-brand"
                      }
                      style={{ width: `${p.load * 100}%` }}
                    />
                  </div>
                  <div className="w-[80px] text-right tabular text-ink-700">
                    {p.avail} free
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </Card>
      </div>
    </div>
  );
}

function TimeRow({
  t,
  s,
  tone = "neutral",
}: {
  t: string;
  s: string;
  tone?: "neutral" | "brand" | "amber" | "green";
}) {
  const color =
    tone === "brand"
      ? "text-brand-700"
      : tone === "amber"
        ? "text-amber-700"
        : tone === "green"
          ? "text-emerald-700"
          : "text-ink-700";
  return (
    <li className="flex gap-3">
      <span className="text-[11px] text-muted tabular font-mono w-[64px] shrink-0 pt-0.5">
        {t}
      </span>
      <span className={color}>{s}</span>
    </li>
  );
}
