import Link from "next/link";
import {
  Plus,
  Database,
  ArrowRight,
  Clock,
  Activity,
  GitBranch,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Section } from "@/components/ui/page-header";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import {
  REGISTERED_ACTIONS,
  DATA_SOURCES_BY_ID,
  DATA_SOURCES,
  getDataChanges,
  RECORDS_BY_ID,
  REGISTERED_ACTIONS_BY_ID,
} from "@/lib/fixtures";
import { formatNumber, formatRelative } from "@/lib/utils";

const triggerLabel: Record<string, string> = {
  "any-change": "Any change",
  enters: "Enters value",
  exits: "Exits value",
  "crosses-threshold": "Crosses threshold",
};

const triggerIcon: Record<string, typeof Activity> = {
  "any-change": GitBranch,
  enters: ArrowRight,
  exits: ArrowRight,
  "crosses-threshold": TrendingUp,
};

export default function DirectoryActionsPage() {
  const recentChanges = getDataChanges().slice(0, 6);
  const totalEvents7d = REGISTERED_ACTIONS.reduce(
    (sum, a) => sum + a.events7d,
    0,
  );
  const activeCount = REGISTERED_ACTIONS.filter(
    (a) => a.status === "active",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-[16.5px] font-semibold text-ink-900">
            Registered actions · {activeCount} active
          </h2>
          <p className="mt-1 text-[12.5px] text-muted max-w-2xl">
            Tell the Coordinator which data changes matter. Every matching
            change is appended to the{" "}
            <Link
              href="/ledger?stream=data"
              className="text-brand-700 hover:underline font-medium"
            >
              Action Ledger
            </Link>{" "}
            with from/to values, source, and actor — ready for policies and
            agents to react.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ledger?stream=data"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
          >
            <Filter className="w-3.5 h-3.5" /> View in Ledger
          </Link>
          <Link
            href="/directory/actions/new"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Register an action
          </Link>
        </div>
      </div>

      {/* Source rail */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-3.5 h-3.5 text-ink-500" />
          <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
            Connected sources
          </div>
          <div className="text-[11.5px] text-muted ml-auto tabular">
            {totalEvents7d} change events · 7d
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {DATA_SOURCES.map((s) => {
            const tone =
              s.status === "connected"
                ? "green"
                : s.status === "degraded"
                  ? "amber"
                  : "red";
            const watching = REGISTERED_ACTIONS.filter(
              (a) => a.sourceId === s.id,
            ).length;
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-surface"
              >
                <ToolIcon color={s.color} initials={s.initials} size={20} />
                <div className="text-[12px] text-ink-800 font-medium">
                  {s.label}
                </div>
                <span className="text-[11px] text-muted">
                  {watching} watching
                </span>
                <StatusChip tone={tone}>
                  {s.status === "connected"
                    ? "Live"
                    : s.status === "degraded"
                      ? "Degraded"
                      : "Off"}
                </StatusChip>
              </div>
            );
          })}
          <Link
            href="/directory/actions/new"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-dashed border-ink-300 text-[12px] text-ink-600 hover:bg-ink-50 hover:text-ink-900"
          >
            <Plus className="w-3.5 h-3.5" /> Connect a source
          </Link>
        </div>
      </Card>

      {/* Action cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {REGISTERED_ACTIONS.map((act) => {
          const src = DATA_SOURCES_BY_ID[act.sourceId];
          const TriggerIcon = triggerIcon[act.trigger] ?? GitBranch;
          return (
            <Card key={act.id} className="p-4 space-y-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14.5px] font-semibold text-ink-900 truncate">
                      {act.name}
                    </h3>
                    {act.status === "active" ? (
                      <StatusChip tone="green">Active</StatusChip>
                    ) : (
                      <StatusChip tone="neutral">Paused</StatusChip>
                    )}
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Source · Object · Field tuple */}
              <div className="flex items-center gap-1.5 text-[11.5px] flex-wrap rounded-md border border-ink-100 bg-ink-50/50 p-2">
                {src && (
                  <>
                    <ToolIcon
                      color={src.color}
                      initials={src.initials}
                      size={16}
                    />
                    <span className="text-ink-800 font-medium">
                      {src.vendor}
                    </span>
                  </>
                )}
                <ArrowRight className="w-3 h-3 text-ink-400" />
                <code className="px-1.5 py-0.5 rounded text-[10.5px] font-mono bg-surface text-ink-700 border border-ink-100">
                  {act.object}
                </code>
                <ArrowRight className="w-3 h-3 text-ink-400" />
                <code className="px-1.5 py-0.5 rounded text-[10.5px] font-mono bg-surface text-ink-700 border border-ink-100">
                  {act.field}
                </code>
                <span className="ml-auto inline-flex items-center gap-1 text-ink-700">
                  <TriggerIcon className="w-3 h-3 text-brand" />
                  <span className="font-medium">
                    {triggerLabel[act.trigger]}
                  </span>
                  {act.watchValue && (
                    <code className="px-1 py-0.5 rounded text-[10px] font-mono bg-surface text-ink-700 border border-ink-100">
                      {act.watchValue}
                    </code>
                  )}
                </span>
              </div>

              {/* Fanout */}
              <div className="space-y-1.5">
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-500">
                  On match
                </div>
                <div className="flex flex-wrap gap-1">
                  {act.fanout.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <Stat
                  label="Records in scope"
                  value={formatNumber(act.recordsInScope)}
                />
                <Stat label="Events · 7d" value={formatNumber(act.events7d)} />
                <Stat label="Last event" value={act.lastEventAt} icon={Clock} />
              </div>

              <div className="text-[11px] text-muted pt-1 border-t border-border flex items-center justify-between gap-2">
                <span>
                  Scope: <span className="text-ink-700">{act.scope}</span>
                </span>
                <span>
                  Registered by{" "}
                  <span className="text-ink-700">{act.registeredBy}</span> ·{" "}
                  {act.registeredAt}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent change events preview */}
      <Card className="overflow-hidden">
        <div className="h-11 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-brand" />
            <h2 className="text-[13px] font-semibold text-ink-900">
              Recent matches across registered actions
            </h2>
          </div>
          <Link
            href="/ledger?stream=data"
            className="text-[12px] text-brand-700 hover:underline font-medium inline-flex items-center gap-1"
          >
            Open full stream <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ul>
          {recentChanges.map((evt) => {
            const act = REGISTERED_ACTIONS_BY_ID[evt.actionId];
            const rec = RECORDS_BY_ID[evt.recordId];
            const src = act ? DATA_SOURCES_BY_ID[act.sourceId] : undefined;
            return (
              <li
                key={evt.id}
                className="px-4 py-2.5 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-ink-50/40 transition-colors"
              >
                <div className="w-[80px] text-[11px] text-muted tabular shrink-0">
                  {formatRelative(evt.tsMs)}
                </div>
                {src && (
                  <ToolIcon
                    color={src.color}
                    initials={src.initials}
                    size={20}
                  />
                )}
                <div className="w-[170px] min-w-0 text-[12px] text-ink-800 truncate font-medium">
                  {act?.name}
                </div>
                <code className="w-[140px] text-[11px] font-mono text-ink-700 truncate">
                  {act?.object}.{act?.field}
                </code>
                <div className="flex items-center gap-1.5 text-[11.5px] flex-1 min-w-0">
                  <code className="px-1 py-0.5 rounded text-[10.5px] font-mono bg-red-50 text-red-700 border border-red-100">
                    {evt.fromValue}
                  </code>
                  <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
                  <code className="px-1 py-0.5 rounded text-[10.5px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {evt.toValue}
                  </code>
                </div>
                <div className="w-[180px] text-[11.5px] text-muted truncate">
                  {rec?.name}
                  <span className="text-ink-400"> · {rec?.company}</span>
                </div>
                <div className="w-[140px] text-[11px] text-muted truncate text-right">
                  {evt.actor}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* How it works */}
      <Card className="p-5" emphasis>
        <Section
          title="How action registration works"
          description="The same primitive that makes agents safe to deploy — explicit, observable, governed — applied to the data side."
        >
          <ol className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px] text-ink-800">
            {[
              {
                n: "1",
                t: "Pick a source",
                d: "Connect a system of record. Salesforce, HubSpot, Snowflake, Stripe, Zendesk, Gainsight, or any webhook-emitting system.",
              },
              {
                n: "2",
                t: "Choose object + field",
                d: "Tell the Coordinator which object (Opportunity, Account, Contact, custom) and which field (Stage, Status, MRR, score) it should watch.",
              },
              {
                n: "3",
                t: "Define what counts",
                d: "Any change, enters/exits a value, or crosses a threshold. Scope to a record list. The Coordinator does the rest.",
              },
            ].map((s) => (
              <li key={s.n} className="space-y-1">
                <div className="w-6 h-6 rounded-md bg-brand text-white flex items-center justify-center text-[11px] font-bold">
                  {s.n}
                </div>
                <div className="font-semibold text-ink-900">{s.t}</div>
                <div className="text-muted text-[12px]">{s.d}</div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2">
            <Link
              href="/directory/actions/new"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
            >
              <Plus className="w-3.5 h-3.5" /> Register an action
            </Link>
            <Link
              href="/ledger?stream=data"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] font-medium text-ink-800"
            >
              See it in the Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Section>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-muted font-semibold">
        {label}
      </div>
      <div className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-900 tabular">
        {Icon && <Icon className="w-3 h-3 text-ink-400" />}
        {value}
      </div>
    </div>
  );
}
