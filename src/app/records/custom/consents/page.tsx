import { Lock, Check, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import { CONSENTS, RECORD_SET_SOURCES, type Consent } from "@/lib/fixtures";

const dsrTone: Record<
  Consent["dsrStatus"],
  "neutral" | "amber" | "red" | "green"
> = {
  "—": "neutral",
  Pending: "red",
  "In progress": "amber",
  Fulfilled: "green",
};

function ConsentCell({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
      <Check className="w-3.5 h-3.5" />
      opt-in
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-700">
      <X className="w-3.5 h-3.5" />
      opt-out
    </span>
  );
}

export default function ConsentsPage() {
  const meta = RECORD_SET_SOURCES.consents;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Consents"
        title="Consent state — every channel, every region."
        description="OneTrust is the source of truth; HubSpot, Marketo, and Salesforce all sync from this ledger. Hard NO_GO surface for opt-outs and active DSRs — every agent reads the same consent state on preflight."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search consents by person, email, or region…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Person</div>
          <div className="w-[80px]">Region</div>
          <div className="w-[110px]">Email</div>
          <div className="w-[110px]">Phone</div>
          <div className="w-[110px]">SMS</div>
          <div className="w-[120px]">DSR</div>
          <div className="w-[110px]">Updated</div>
          <div className="w-[140px]">Source</div>
        </div>
        <ul>
          {CONSENTS.map((c) => (
            <li
              key={c.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {c.person}
                  </div>
                  <div className="text-[11.5px] text-muted truncate">
                    {c.email}
                  </div>
                </div>
              </div>
              <div className="w-[80px] text-[12.5px] text-ink-800">
                {c.region}
              </div>
              <div className="w-[110px]">
                <ConsentCell on={c.emailOptIn} />
              </div>
              <div className="w-[110px]">
                <ConsentCell on={c.phoneOptIn} />
              </div>
              <div className="w-[110px]">
                <ConsentCell on={c.smsOptIn} />
              </div>
              <div className="w-[120px]">
                <StatusChip tone={dsrTone[c.dsrStatus]}>
                  {c.dsrStatus}
                </StatusChip>
              </div>
              <div className="w-[110px] text-[11.5px] text-muted truncate">
                {c.updatedAt}
              </div>
              <div className="w-[140px] flex items-center gap-1">
                {c.sources.map((s) => (
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
