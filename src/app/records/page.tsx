import Link from "next/link";
import { Search, Users } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { AGENTS_BY_ID, RECORDS } from "@/lib/fixtures";

export default function RecordsPage() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Canonical Records"
        title="One identity per person — no matter how many agents touch them."
        description="The Coordinator resolves any identifier (email, phone, LinkedIn URL, CRM ID) to a single canonical record so every agent sees the same source of truth."
      />

      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-lg flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-surface">
          <Search className="w-3.5 h-3.5 text-ink-400" />
          <input
            placeholder="Search by email, name, or company…"
            className="flex-1 bg-transparent outline-none text-[13px] text-ink-800 placeholder:text-ink-400"
          />
        </div>
        <select className="h-9 rounded-md border border-border bg-surface px-3 text-[12.5px] text-ink-800">
          <option>All lifecycles</option>
          <option>Lead</option>
          <option>MQL</option>
          <option>Opportunity</option>
          <option>Customer</option>
        </select>
        <select className="h-9 rounded-md border border-border bg-surface px-3 text-[12.5px] text-ink-800">
          <option>All tiers</option>
          <option>Tier 1</option>
          <option>Tier 2</option>
          <option>Tier 3</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Record</div>
          <div className="w-[180px]">Owner</div>
          <div className="w-[120px]">Lifecycle</div>
          <div className="w-[170px]">Active agents</div>
          <div className="w-[110px] text-right">Touches · 7d</div>
          <div className="w-[110px] text-right">Conflicts · 7d</div>
        </div>
        <ul>
          {RECORDS.map((r) => (
            <li
              key={r.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/records/${r.id}`}
                  className="text-[13px] font-semibold text-ink-900 hover:text-brand-700"
                >
                  {r.name}
                </Link>
                <div className="text-[11.5px] text-muted truncate">
                  {r.email} · {r.title} · {r.company}
                </div>
              </div>
              <div className="w-[180px] min-w-0">
                <div className="text-[12.5px] text-ink-800 truncate">
                  {r.ownerName}
                </div>
                <div className="text-[10.5px] text-muted truncate">
                  {r.ownerRole}
                </div>
              </div>
              <div className="w-[120px]">
                {r.lifecycle === "Opportunity" || r.lifecycle === "Customer" ? (
                  <StatusChip tone="green">
                    {r.lifecycle} {r.openOpp ? `· ${r.openOpp.amount}` : ""}
                  </StatusChip>
                ) : (
                  <StatusChip tone="neutral">{r.lifecycle}</StatusChip>
                )}
              </div>
              <div className="w-[170px] flex items-center -space-x-1.5">
                {r.agentsActive.map((aid) => {
                  const a = AGENTS_BY_ID[aid];
                  return a ? (
                    <ToolIcon
                      key={aid}
                      color={a.color}
                      initials={a.initials}
                      size={20}
                      className="ring-2 ring-white"
                    />
                  ) : null;
                })}
              </div>
              <div className="w-[110px] text-right tabular">
                <div className="text-[12.5px] text-ink-800 font-medium">
                  {r.touches7d}
                  <span className="text-muted font-normal">
                    {" "}
                    / {r.budgetCap}
                  </span>
                </div>
                <TouchBar touches={r.touches7d} cap={r.budgetCap} />
              </div>
              <div className="w-[110px] text-right tabular">
                {r.conflicts7d > 0 ? (
                  <span className="text-[12.5px] font-semibold text-amber-700">
                    {r.conflicts7d}
                  </span>
                ) : (
                  <span className="text-[12.5px] text-muted">—</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

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

function TouchBar({ touches, cap }: { touches: number; cap: number }) {
  const ratio = Math.min(1, touches / cap);
  const over = ratio > 0.85;
  return (
    <div className="h-1 rounded-full bg-ink-100 mt-1 overflow-hidden">
      <div
        className={`h-full ${over ? "bg-amber-500" : "bg-brand"}`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
