import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/primitives";
import { RecordsTable, RecordsFilters } from "@/components/records-table";
import { RECORDS } from "@/lib/fixtures";

export default function RecordsPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Canonical Records"
        title="One identity per person — no matter how many agents touch them."
        description="The Coordinator resolves any identifier (email, phone, LinkedIn URL, CRM ID) to a single canonical record so every agent sees the same source of truth."
      />

      <RecordsFilters />

      <RecordsTable records={RECORDS} />

      <Card className="p-5 flex items-center gap-4" emphasis>
        <Users className="w-6 h-6 text-brand shrink-0" />
        <div className="text-[12.5px] text-ink-700">
          <span className="font-semibold text-ink-900">
            How we resolve identity.
          </span>{" "}
          The Coordinator matches on (1) exact email, (2) hashed phone + domain,
          (3) LinkedIn URL, (4) CRM external ID. Ambiguous matches trigger a
          WAIT decision so nothing is touched without consensus.
        </div>
      </Card>
    </div>
  );
}
