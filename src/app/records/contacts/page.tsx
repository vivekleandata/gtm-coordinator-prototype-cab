import { PageHeader } from "@/components/ui/page-header";
import { RecordsTable, RecordsFilters } from "@/components/records-table";
import { RECORDS } from "@/lib/fixtures";

export default function ContactsPage() {
  // Every canonical record is a person → contacts.
  const contacts = RECORDS;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Contacts"
        title="Canonical contacts across every agent."
        description="People resolved to a single identity. Email, phone, LinkedIn, and CRM IDs collapse into one record so no two agents see a different version of the truth."
      />

      <RecordsFilters placeholder="Search contacts by email, name, or company…" />

      <RecordsTable records={contacts} />
    </div>
  );
}
