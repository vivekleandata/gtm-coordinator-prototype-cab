import { PageHeader } from "@/components/ui/page-header";
import { RecordsFilters, EmptyRecordsState } from "@/components/records-table";

export default function OrdersPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Orders"
        title="Orders the Coordinator is watching."
        description="Order objects flow into the ledger the moment they're registered. Listen for status, amount, or fulfillment changes — same observability surface as accounts and opportunities."
      />

      <RecordsFilters placeholder="Search orders by number, account, or status…" />

      <EmptyRecordsState
        title="No orders registered yet"
        description="Connect a custom Order object via the Agent Directory to start streaming events into the ledger. Sample data lands here on first sync."
      />
    </div>
  );
}
