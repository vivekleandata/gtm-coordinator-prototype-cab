import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusChip } from "@/components/ui/primitives";
import { RecordDetailView } from "@/components/record-detail-view";
import {
  OWNER_SLACK_MESSAGES_BY_RECORD,
  RECORDS_BY_ID,
  getDecisions,
} from "@/lib/fixtures";

export default async function RecordDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = RECORDS_BY_ID[id];
  if (!record) notFound();

  const decisions = getDecisions().filter((d) => d.recordId === id);
  const slackMessages = OWNER_SLACK_MESSAGES_BY_RECORD[id] ?? [];

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <Link
        href="/records"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Records
      </Link>

      <PageHeader
        eyebrow={`Record · ${record.company}`}
        title={record.name}
        meta={`${record.title} · ${record.email}`}
        actions={
          <>
            <StatusChip tone="brand">{record.lifecycle}</StatusChip>
            <StatusChip tone="neutral">{record.tier}</StatusChip>
          </>
        }
      />

      <RecordDetailView
        record={record}
        decisions={decisions}
        slackMessages={slackMessages}
      />
    </div>
  );
}
