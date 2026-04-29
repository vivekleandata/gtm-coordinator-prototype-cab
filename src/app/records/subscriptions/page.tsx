import { Repeat } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, StatusChip } from "@/components/ui/primitives";
import { RecordsFilters } from "@/components/records-table";
import { SourceMeta, SourceChip } from "@/components/ui/source-chip";
import {
  RECORD_SET_SOURCES,
  SUBSCRIPTIONS,
  type Subscription,
} from "@/lib/fixtures";

const statusTone: Record<
  Subscription["status"],
  "green" | "amber" | "red" | "neutral"
> = {
  Active: "green",
  Renewing: "amber",
  "At risk": "red",
  Expired: "neutral",
  Cancelled: "neutral",
};

const healthTone: Record<
  Subscription["health"],
  "green" | "amber" | "red" | "neutral"
> = {
  Healthy: "green",
  Watch: "amber",
  "At risk": "red",
  Critical: "red",
};

export default function SubscriptionsPage() {
  const meta = RECORD_SET_SOURCES.subscriptions;
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-7">
      <PageHeader
        eyebrow="Records · Subscriptions"
        title="Paying-customer subscriptions, owned by CSMs."
        description="ARR, term, renewal date — joined from Salesforce contracts and Snowflake billing. Customer-stage policy redirects outbound agents to the CSM on every active subscription."
        meta={<SourceMeta sources={meta.sources} primary={meta.primary} />}
      />

      <RecordsFilters placeholder="Search subscriptions by account, plan, or CSM…" />

      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-3 border-b border-border text-[11px] uppercase tracking-wide text-ink-500 font-semibold">
          <div className="flex-1">Account</div>
          <div className="w-[180px]">Plan</div>
          <div className="w-[100px] text-right">ARR</div>
          <div className="w-[110px]">Status</div>
          <div className="w-[140px]">Term ends</div>
          <div className="w-[150px]">CSM</div>
          <div className="w-[110px]">Health</div>
          <div className="w-[110px]">Source</div>
        </div>
        <ul>
          {SUBSCRIPTIONS.map((s) => (
            <li
              key={s.id}
              className="px-4 h-16 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-ink-100 text-ink-700 flex items-center justify-center shrink-0">
                  <Repeat className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {s.account}
                  </div>
                </div>
              </div>
              <div className="w-[180px] text-[12.5px] text-ink-800 truncate">
                {s.plan}
              </div>
              <div className="w-[100px] text-right tabular text-[12.5px] font-semibold text-ink-900">
                {s.arr}
              </div>
              <div className="w-[110px]">
                <StatusChip tone={statusTone[s.status]}>{s.status}</StatusChip>
              </div>
              <div className="w-[140px] text-[12.5px] text-ink-800 truncate tabular">
                <div>{s.termEnd}</div>
                {s.daysToRenewal !== null && (
                  <div
                    className={`text-[11px] ${
                      s.daysToRenewal <= 30
                        ? "text-amber-700 font-medium"
                        : "text-muted"
                    }`}
                  >
                    {s.daysToRenewal === 0 ? "today" : `in ${s.daysToRenewal}d`}
                  </div>
                )}
              </div>
              <div className="w-[150px] text-[12.5px] text-ink-800 truncate">
                {s.csmName}
              </div>
              <div className="w-[110px]">
                <StatusChip tone={healthTone[s.health]}>{s.health}</StatusChip>
              </div>
              <div className="w-[110px] flex items-center gap-1">
                {s.sources.map((src) => (
                  <SourceChip key={src} source={src} size="sm" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
