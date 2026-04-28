import { PageHeader } from "@/components/ui/page-header";
import { RecordsFilters, EmptyRecordsState } from "@/components/records-table";

export default function QuotesPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Quotes"
        title="Quotes the Coordinator is watching."
        description="Custom CRM objects show up here once registered. The Coordinator listens for stage changes and routes them through the same preflight, ledger, and policy stack as standard objects."
      />

      <RecordsFilters placeholder="Search quotes by number, account, or owner…" />

      <EmptyRecordsState
        title="No quotes registered yet"
        description="Connect a custom Quote object via the Agent Directory to start streaming events into the ledger. Sample data lands here on first sync."
      />
    </div>
  );
}
