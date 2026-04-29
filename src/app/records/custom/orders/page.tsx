import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta } from "@/components/ui/source-chip";
import {
  AGENTS_BY_ID,
  ORDERS,
  RECORD_SET_SOURCES,
  type Order,
} from "@/lib/fixtures";

const statusTone: Record<Order["status"], "neutral" | "amber" | "green"> = {
  Provisioning: "amber",
  Active: "green",
  "Renewal Pending": "amber",
  "Past Due": "amber",
  Cancelled: "neutral",
};

export default function OrdersPage() {
  const meta = RECORD_SET_SOURCES.orders;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Custom · Orders"
        title="Orders the Coordinator is watching."
        description="Order objects flow into the ledger the moment they're registered. Listen for status, amount, or fulfillment changes — same observability surface as accounts and opportunities."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search orders by number, account, or status…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="w-[140px]">Order #</div>
          <div className="flex-1">Account</div>
          <div className="w-[120px] text-right">Amount</div>
          <div className="w-[160px]">Status</div>
          <div className="w-[180px]">Term</div>
          <div className="w-[150px]">Active agents</div>
          <div className="w-[140px]">Last activity</div>
          <div className="w-[90px] text-right">Conflicts</div>
        </div>
        <ul>
          {ORDERS.map((o) => (
            <li
              key={o.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="w-[140px] flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Boxes className="w-3.5 h-3.5" />
                </span>
                <span className="text-[12.5px] font-mono text-ink-800 truncate">
                  {o.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900 truncate">
                  {o.account}
                </div>
                <div className="text-[11.5px] text-muted truncate">
                  {o.ownerName}
                </div>
              </div>
              <div className="w-[120px] text-right tabular text-[13px] font-semibold text-ink-900">
                {o.amount}
              </div>
              <div className="w-[160px]">
                <StatusChip tone={statusTone[o.status]}>{o.status}</StatusChip>
              </div>
              <div className="w-[180px] text-[11.5px] text-muted truncate">
                {o.startsOn}
              </div>
              <div className="w-[150px] flex items-center -space-x-1.5">
                {o.agentsActive.length === 0 ? (
                  <span className="text-[11.5px] text-muted">—</span>
                ) : (
                  o.agentsActive.map((aid) => {
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
                  })
                )}
              </div>
              <div className="w-[140px] text-[11.5px] text-muted truncate">
                {o.lastActivity}
              </div>
              <div className="w-[90px] text-right tabular">
                {o.conflicts7d > 0 ? (
                  <span className="text-[12.5px] font-semibold text-amber-700">
                    {o.conflicts7d}
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
        <Boxes className="w-6 h-6 text-brand shrink-0" />
        <div className="text-[12.5px] text-ink-700">
          <span className="font-semibold text-ink-900">
            Why orders matter to a Coordinator.
          </span>{" "}
          Subscribing to <code>Order.Status</code>,{" "}
          <code>Order.RenewalDate</code>, and <code>Order.AmountDue</code> turns
          a custom object into a first-class signal — a Past Due flip can pause
          outbound sequences, gate marketing nurture, and notify the CSM agent
          all from one ledger event.
        </div>
      </Card>
    </div>
  );
}
