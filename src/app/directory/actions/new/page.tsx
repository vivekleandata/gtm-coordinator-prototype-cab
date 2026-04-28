import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Boxes,
  Tag,
  Sparkles,
  Bell,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Card, StatusChip, ToolIcon } from "@/components/ui/primitives";
import { InfoHover } from "@/components/ui/info-hover";
import { DATA_SOURCES, DATA_SOURCES_BY_ID } from "@/lib/fixtures";

// Visual-only registration form. Pre-selected example: Opportunity stage
// change from Salesforce — same shape used by the example actions on the list.
const example = {
  sourceId: "src_sf_prod",
  object: "Opportunity",
  field: "StageName",
  trigger: "any-change" as const,
};

const objectChoices = [
  {
    value: "Opportunity",
    fields: [
      { name: "StageName", label: "Stage", type: "Picklist" },
      { name: "Amount", label: "Amount", type: "Currency" },
      { name: "CloseDate", label: "Close date", type: "Date" },
      {
        name: "ForecastCategory",
        label: "Forecast category",
        type: "Picklist",
      },
      { name: "OwnerId", label: "Owner", type: "Reference" },
    ],
  },
  {
    value: "Account",
    fields: [
      { name: "AccountStatus__c", label: "Status", type: "Picklist" },
      { name: "OwnerId", label: "Owner", type: "Reference" },
      { name: "RenewalDate__c", label: "Renewal date", type: "Date" },
      { name: "Tier__c", label: "Tier", type: "Picklist" },
      { name: "ARR__c", label: "ARR", type: "Currency" },
    ],
  },
  {
    value: "Contact",
    fields: [
      { name: "Email", label: "Email", type: "Email" },
      { name: "Title", label: "Title", type: "Text" },
      { name: "hubspot_score", label: "Lead score", type: "Number" },
    ],
  },
  {
    value: "Custom — Quote",
    fields: [
      { name: "Status", label: "Status", type: "Picklist" },
      { name: "Total", label: "Total", type: "Currency" },
    ],
  },
];

export default function RegisterActionPage() {
  const pickedSource = DATA_SOURCES_BY_ID[example.sourceId];
  const pickedObject = objectChoices.find((o) => o.value === example.object);
  const pickedField = pickedObject?.fields.find(
    (f) => f.name === example.field,
  );

  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto space-y-7">
      <Link
        href="/directory/actions"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Directory · Actions
      </Link>

      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-brand mb-1">
          Register an action
        </div>
        <h1 className="inline-flex items-center gap-2 text-[26px] leading-tight font-semibold tracking-tight text-ink-900 hero-serif">
          Pick a source, an object, a field. Done.
          <InfoHover>
            The Coordinator will watch every record in scope. The moment that
            field changes, an entry appears in the Action Ledger and any
            downstream policies, agents, or webhooks fire — under 500 ms.
          </InfoHover>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          {/* Step 1 — Source */}
          <Step n={1} icon={Database} title="Choose a data source">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {DATA_SOURCES.map((s) => {
                const selected = s.id === example.sourceId;
                return (
                  <label
                    key={s.id}
                    className={
                      "flex items-center gap-2.5 p-3 rounded-md border cursor-pointer transition-colors " +
                      (selected
                        ? "border-brand bg-brand-50/40"
                        : "border-border bg-surface hover:bg-ink-50/40")
                    }
                  >
                    <input
                      type="radio"
                      name="source"
                      defaultChecked={selected}
                      className="accent-brand"
                    />
                    <ToolIcon color={s.color} initials={s.initials} size={24} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-ink-900 truncate">
                        {s.label}
                      </div>
                      <div className="text-[11px] text-muted">
                        Last sync {s.lastSyncedAt}
                      </div>
                    </div>
                    {s.status === "connected" && (
                      <StatusChip tone="green">Live</StatusChip>
                    )}
                    {s.status === "degraded" && (
                      <StatusChip tone="amber">Degraded</StatusChip>
                    )}
                  </label>
                );
              })}
              <button className="flex items-center gap-2 p-3 rounded-md border border-dashed border-ink-300 text-[12.5px] text-ink-700 hover:bg-ink-50">
                <Plus className="w-3.5 h-3.5" /> Connect another source…
              </button>
            </div>
          </Step>

          {/* Step 2 — Object */}
          <Step n={2} icon={Boxes} title="Pick the object">
            <div className="flex flex-wrap gap-2">
              {objectChoices.map((o) => {
                const selected = o.value === example.object;
                return (
                  <label
                    key={o.value}
                    className={
                      "inline-flex items-center gap-2 px-3 h-9 rounded-md border text-[12.5px] cursor-pointer " +
                      (selected
                        ? "border-brand bg-brand-50 text-brand-700 font-semibold"
                        : "border-border bg-surface text-ink-700 hover:bg-ink-50")
                    }
                  >
                    <input
                      type="radio"
                      name="object"
                      defaultChecked={selected}
                      className="accent-brand"
                    />
                    {o.value}
                    <span className="text-[10.5px] text-muted tabular">
                      {o.fields.length} fields
                    </span>
                  </label>
                );
              })}
            </div>
          </Step>

          {/* Step 3 — Field */}
          <Step n={3} icon={Tag} title="Pick the field to watch">
            <div className="rounded-md border border-border overflow-hidden">
              <div className="h-9 px-3 flex items-center gap-3 border-b border-border text-[10.5px] uppercase tracking-wide font-semibold text-ink-500">
                <div className="w-[200px]">Field</div>
                <div className="w-[140px]">API name</div>
                <div className="w-[100px]">Type</div>
                <div className="flex-1 text-right">Watch</div>
              </div>
              <ul>
                {pickedObject?.fields.map((f) => {
                  const selected = f.name === example.field;
                  return (
                    <li
                      key={f.name}
                      className={
                        "px-3 py-2 flex items-center gap-3 border-b border-border last:border-b-0 " +
                        (selected ? "bg-brand-50/40" : "hover:bg-ink-50/40")
                      }
                    >
                      <div className="w-[200px] text-[12.5px] text-ink-900 font-medium">
                        {f.label}
                      </div>
                      <code className="w-[140px] text-[11px] font-mono text-ink-700 truncate">
                        {f.name}
                      </code>
                      <div className="w-[100px] text-[11.5px] text-muted">
                        {f.type}
                      </div>
                      <div className="flex-1 text-right">
                        <input
                          type="radio"
                          name="field"
                          defaultChecked={selected}
                          className="accent-brand"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Step>

          {/* Step 4 — Trigger */}
          <Step n={4} icon={Sparkles} title="What counts as a change">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                {
                  v: "any-change",
                  t: "Any change",
                  d: "Fire whenever the value mutates — even within the same picklist set.",
                },
                {
                  v: "enters",
                  t: "Enters value",
                  d: "Fire only when the field transitions into a specific value (e.g. 'Closed Won').",
                },
                {
                  v: "exits",
                  t: "Exits value",
                  d: "Fire when the field leaves a specific value (e.g. leaves 'On Hold').",
                },
                {
                  v: "crosses-threshold",
                  t: "Crosses threshold",
                  d: "Fire when a numeric field crosses a configured threshold in either direction.",
                },
              ].map((opt) => {
                const selected = opt.v === example.trigger;
                return (
                  <label
                    key={opt.v}
                    className={
                      "flex items-start gap-2 p-3 rounded-md border cursor-pointer transition-colors " +
                      (selected
                        ? "border-brand bg-brand-50/40"
                        : "border-border bg-surface hover:bg-ink-50/40")
                    }
                  >
                    <input
                      type="radio"
                      name="trigger"
                      defaultChecked={selected}
                      className="mt-0.5 accent-brand"
                    />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold text-ink-900">
                        {opt.t}
                      </div>
                      <div className="text-[11.5px] text-muted">{opt.d}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </Step>

          {/* Step 5 — Scope + fanout */}
          <Step n={5} icon={Bell} title="Scope and fanout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
                  Scope
                </div>
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-surface text-[12.5px] text-ink-800">
                  All open opportunities
                  <ChevronDown className="w-3.5 h-3.5 text-ink-400 ml-auto" />
                </div>
                <div className="text-[11px] text-muted">
                  Or choose: tier, owner pod, segment, named list. Scope
                  evaluates at change time.
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
                  On match
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Action Ledger (always)",
                    "Notify agent: Convex Outbound",
                    "Slack #pipeline-moves",
                    "+ add fanout…",
                  ].map((f, i) => (
                    <span
                      key={f}
                      className={
                        "text-[11px] px-1.5 py-0.5 rounded border " +
                        (i === 3
                          ? "border-dashed border-ink-300 text-ink-600 bg-surface"
                          : "border-brand-200 bg-brand-50 text-brand-700")
                      }
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Step>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-ink-900 hover:bg-ink-800 text-[13px] font-medium text-white"
            >
              <Check className="w-3.5 h-3.5" /> Register action
            </button>
            <Link
              href="/directory/actions"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-surface hover:bg-ink-50 text-[13px] font-medium text-ink-800"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Live preview rail */}
        <aside className="space-y-4">
          <Card className="p-4 space-y-3" emphasis>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Preview
            </div>
            <div>
              <div className="text-[14.5px] font-semibold text-ink-900">
                Opportunity stage change
              </div>
              <div className="text-[12px] text-muted">
                Fires the moment any field on a watched record changes.
              </div>
            </div>

            <div className="rounded-md border border-ink-100 bg-ink-50/60 p-2.5 space-y-2">
              <PreviewRow label="Source">
                {pickedSource && (
                  <span className="inline-flex items-center gap-1.5">
                    <ToolIcon
                      color={pickedSource.color}
                      initials={pickedSource.initials}
                      size={16}
                    />
                    <span className="text-[12px] text-ink-800 font-medium">
                      {pickedSource.label}
                    </span>
                  </span>
                )}
              </PreviewRow>
              <PreviewRow label="Object">
                <code className="text-[11px] font-mono text-ink-700 px-1.5 py-0.5 rounded border border-ink-100 bg-surface">
                  {example.object}
                </code>
              </PreviewRow>
              <PreviewRow label="Field">
                <code className="text-[11px] font-mono text-ink-700 px-1.5 py-0.5 rounded border border-ink-100 bg-surface">
                  {example.field}
                </code>
                <span className="text-[11px] text-muted ml-1">
                  {pickedField?.label} · {pickedField?.type}
                </span>
              </PreviewRow>
              <PreviewRow label="Trigger">
                <span className="text-[12px] text-ink-800 font-medium">
                  Any change
                </span>
              </PreviewRow>
            </div>

            <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500 pt-1">
              Sample ledger row
            </div>
            <div className="rounded-md border border-border p-2 text-[11px] font-mono text-ink-700 bg-ink-50/40 space-y-1">
              <div className="text-muted">
                evt_dc_8201 · 2 min ago · src_sf_prod
              </div>
              <div className="flex items-center gap-1">
                Opportunity.StageName
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <code className="px-1 py-0.5 rounded text-[10.5px] bg-red-50 text-red-700 border border-red-100">
                  Discovery
                </code>
                <ArrowRight className="w-3 h-3 text-ink-400" />
                <code className="px-1 py-0.5 rounded text-[10.5px] bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Proposal
                </code>
              </div>
              <div className="text-muted">
                actor: Mike Chen (AE) · record: Atlas Robotics
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Programmatic registration
            </div>
            <p className="text-[11.5px] text-muted">
              Same form is exposed as REST and MCP. Drop this into Terraform or
              a one-time migration:
            </p>
            <pre className="text-[10.5px] font-mono leading-relaxed bg-ink-900 text-ink-50 p-3 rounded-md overflow-x-auto">{`POST /v1/registered-actions
{
  "name": "Opportunity stage change",
  "source": "src_sf_prod",
  "object": "Opportunity",
  "field": "StageName",
  "trigger": "any-change",
  "scope": "open_opps",
  "fanout": ["ledger", "agent:convex_outbound"]
}`}</pre>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  icon: Icon,
  children,
}: {
  n: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-brand text-white flex items-center justify-center text-[12px] font-bold">
          {n}
        </div>
        <Icon className="w-4 h-4 text-ink-500" />
        <h2 className="text-[14px] font-semibold text-ink-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function PreviewRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <div className="w-[60px] text-[10.5px] uppercase tracking-wide text-muted font-semibold">
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
