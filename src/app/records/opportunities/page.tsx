import { PageHeader } from "@/components/ui/page-header";
import {
  RecordsTable,
  RecordsFilters,
  EmptyRecordsState,
} from "@/components/records-table";
import { RECORDS, RECORD_SET_SOURCES } from "@/lib/fixtures";
import { SourceMeta } from "@/components/ui/source-chip";

export default function OpportunitiesPage() {
  const opps = RECORDS.filter((r) => r.openOpp);
  const meta = RECORD_SET_SOURCES.opportunities;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Opportunities"
        title="Open opportunities the Coordinator is watching."
        description="Every contact tied to a live deal — with stage, amount, owner, and the agents currently active on the record."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search opportunities by record, owner, or stage…" />

      {opps.length > 0 ? (
        <RecordsTable records={opps} />
      ) : (
        <EmptyRecordsState
          title="No open opportunities"
          description="When agents qualify a contact into a deal, it shows up here. Synced from Salesforce in real-time."
        />
      )}
    </div>
  );
}
