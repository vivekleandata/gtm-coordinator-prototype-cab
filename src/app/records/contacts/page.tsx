import { PageHeader } from "@/components/ui/page-header";
import { RecordsTable, RecordsFilters } from "@/components/records-table";
import { RECORDS, RECORD_SET_SOURCES } from "@/lib/fixtures";
import { SourceMeta } from "@/components/ui/source-chip";

export default function ContactsPage() {
  // Every canonical record is a person → contacts.
  const contacts = RECORDS;
  const meta = RECORD_SET_SOURCES.contacts;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Contacts"
        title="Canonical contacts across every agent."
        description="People resolved to a single identity. Email, phone, LinkedIn, and CRM IDs collapse into one record so no two agents see a different version of the truth."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search contacts by email, name, or company…" />

      <RecordsTable records={contacts} />
    </div>
  );
}
