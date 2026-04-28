import Link from "next/link";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { AGENTS_BY_ID, RECORDS } from "@/lib/fixtures";

type AccountRow = {
  company: string;
  companySlug: string;
  contactCount: number;
  topTier: string;
  lifecycle: string;
  primaryRecordId: string;
  agents: Set<string>;
  touches7d: number;
  conflicts7d: number;
  openOpp?: { amount: string; stage: string };
};

function rollupAccounts(): AccountRow[] {
  const byCompany = new Map<string, AccountRow>();
  for (const r of RECORDS) {
    const existing = byCompany.get(r.companySlug);
    if (!existing) {
      byCompany.set(r.companySlug, {
        company: r.company,
        companySlug: r.companySlug,
        contactCount: 1,
        topTier: r.tier,
        lifecycle: r.lifecycle,
        primaryRecordId: r.id,
        agents: new Set(r.agentsActive),
        touches7d: r.touches7d,
        conflicts7d: r.conflicts7d,
        openOpp: r.openOpp,
      });
    } else {
      existing.contactCount += 1;
      existing.touches7d += r.touches7d;
      existing.conflicts7d += r.conflicts7d;
      r.agentsActive.forEach((a) => existing.agents.add(a));
      if (r.openOpp && !existing.openOpp) existing.openOpp = r.openOpp;
    }
  }
  return [...byCompany.values()].sort((a, b) => b.touches7d - a.touches7d);
}

export default function AccountsPage() {
  const accounts = rollupAccounts();

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Accounts"
        title="Companies, rolled up from canonical contacts."
        description="Every record is grouped into the account it belongs to. Open opportunities, contact counts, and active agents — all in one place."
      />

      <RecordsFilters placeholder="Search accounts by company name or domain…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Account</div>
          <div className="w-[110px]">Tier</div>
          <div className="w-[140px]">Lifecycle</div>
          <div className="w-[110px] text-right">Contacts</div>
          <div className="w-[170px]">Active agents</div>
          <div className="w-[110px] text-right">Touches · 7d</div>
          <div className="w-[110px] text-right">Conflicts · 7d</div>
        </div>
        <ul>
          {accounts.map((a) => (
            <li
              key={a.companySlug}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/records/${a.primaryRecordId}`}
                    className="text-[13px] font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {a.company}
                  </Link>
                  <div className="text-[11.5px] text-muted truncate">
                    {a.companySlug}.com
                  </div>
                </div>
              </div>
              <div className="w-[110px]">
                <StatusChip tone="neutral">{a.topTier}</StatusChip>
              </div>
              <div className="w-[140px]">
                {a.lifecycle === "Opportunity" || a.lifecycle === "Customer" ? (
                  <StatusChip tone="green">
                    {a.lifecycle} {a.openOpp ? `· ${a.openOpp.amount}` : ""}
                  </StatusChip>
                ) : (
                  <StatusChip tone="neutral">{a.lifecycle}</StatusChip>
                )}
              </div>
              <div className="w-[110px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {a.contactCount}
              </div>
              <div className="w-[170px] flex items-center -space-x-1.5">
                {[...a.agents].map((aid) => {
                  const agent = AGENTS_BY_ID[aid];
                  return agent ? (
                    <ToolIcon
                      key={aid}
                      color={agent.color}
                      initials={agent.initials}
                      size={20}
                      className="ring-2 ring-white"
                    />
                  ) : null;
                })}
              </div>
              <div className="w-[110px] text-right tabular text-[12.5px] text-ink-800 font-medium">
                {a.touches7d}
              </div>
              <div className="w-[110px] text-right tabular">
                {a.conflicts7d > 0 ? (
                  <span className="text-[12.5px] font-semibold text-amber-700">
                    {a.conflicts7d}
                  </span>
                ) : (
                  <span className="text-[12.5px] text-muted">—</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
