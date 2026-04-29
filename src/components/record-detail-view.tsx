"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Coins,
  Eye,
  MessageSquare,
  Hash,
  Bell,
  Bookmark,
  Search,
  Smile,
  Plus,
  Bold,
  Italic,
  Link2,
  AtSign,
  Send,
  CheckCircle2,
  CornerDownRight,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  DecisionBadge,
  ToolIcon,
  StatCard,
} from "@/components/ui/primitives";
import { Section } from "@/components/ui/page-header";
import { cn, formatRelative } from "@/lib/utils";
import {
  AGENTS_BY_ID,
  REP_GUARANTEE,
  REP_IMPACT_BY_DECISION,
  type Agent,
  type OwnerSlackAction,
  type OwnerSlackMessage,
  type PreflightEntry,
  type Record as CanonicalRecord,
} from "@/lib/fixtures";

type ViewMode = "coordinator" | "owner";

export function RecordDetailView({
  record,
  decisions,
  slackMessages,
}: {
  record: CanonicalRecord;
  decisions: PreflightEntry[];
  slackMessages: OwnerSlackMessage[];
}) {
  const [view, setView] = useState<ViewMode>("coordinator");
  const [guaranteeOpen, setGuaranteeOpen] = useState(false);

  return (
    <div className="space-y-5">
      <RepGuaranteeBanner
        open={guaranteeOpen}
        onToggle={() => setGuaranteeOpen((o) => !o)}
      />

      <ViewToggle
        view={view}
        onChange={setView}
        recordName={record.name}
        ownerName={record.ownerName}
        unreadCount={slackMessages.filter((m) => m.unread).length}
      />

      <AnimatePresence mode="wait">
        {view === "coordinator" ? (
          <motion.div
            key="coordinator"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <CoordinatorView record={record} decisions={decisions} />
          </motion.div>
        ) : (
          <motion.div
            key="owner"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <OwnerView record={record} slackMessages={slackMessages} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AE-protection guarantee — the political insurance line.

function RepGuaranteeBanner({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50/60">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
        </span>
        <span className="text-[12.5px] text-emerald-900">
          <span className="font-semibold">{REP_GUARANTEE.short}</span>
          <span className="text-emerald-800/80 hidden sm:inline">
            {" "}
            Coordinator only governs agent traffic — rep-initiated actions
            short-circuit Preflight.
          </span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium tabular shrink-0">
          {REP_GUARANTEE.policyLabel}
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              open && "rotate-90",
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-emerald-200/70 space-y-2">
              <p className="text-[12.5px] text-emerald-900 leading-relaxed max-w-3xl">
                {REP_GUARANTEE.long}
              </p>
              <pre className="bg-ink-900 text-emerald-200 font-mono text-[11px] rounded p-3 leading-relaxed overflow-x-auto">
                {REP_GUARANTEE.ruleSnippet.join("\n")}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View toggle — Coordinator ↔ Owner.

function ViewToggle({
  view,
  onChange,
  recordName,
  ownerName,
  unreadCount,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  recordName: string;
  ownerName: string;
  unreadCount: number;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="inline-flex items-center rounded-lg border border-border bg-surface p-1 shadow-sm">
        <ToggleButton
          active={view === "coordinator"}
          onClick={() => onChange("coordinator")}
          icon={<Eye className="w-3.5 h-3.5" />}
          label="Coordinator view"
          sub="Agent timeline · decisions · policies"
        />
        <ToggleButton
          active={view === "owner"}
          onClick={() => onChange("owner")}
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          label="Owner view"
          sub={`What ${ownerName.split(" ")[0]} sees in Slack`}
          badge={unreadCount > 0 ? unreadCount : undefined}
        />
      </div>
      <div className="text-[11.5px] text-muted">
        Same data on{" "}
        <span className="font-medium text-ink-700">{recordName}</span> · two
        narratives. Click to flip the framing.
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all",
        active
          ? "bg-brand text-white shadow-sm"
          : "text-ink-700 hover:bg-ink-50",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center w-6 h-6 rounded shrink-0",
          active ? "bg-white/15" : "bg-ink-100 text-ink-700",
        )}
      >
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-[12.5px] font-semibold leading-tight">
          {label}
        </span>
        <span
          className={cn(
            "block text-[10.5px] leading-tight tabular",
            active ? "text-white/80" : "text-muted",
          )}
        >
          {sub}
        </span>
      </span>
      {badge !== undefined && (
        <span
          className={cn(
            "ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold tabular",
            active ? "bg-white text-brand" : "bg-red-500 text-white",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Coordinator view — original timeline, reframed copy.

function CoordinatorView({
  record,
  decisions,
}: {
  record: CanonicalRecord;
  decisions: PreflightEntry[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Owner"
          value={record.ownerName}
          sublabel={`${record.ownerRole} · ${record.ownerPod}`}
          tone="brand"
        />
        <StatCard
          label="Touches · 7d"
          value={`${record.touches7d} / ${record.budgetCap}`}
          sublabel="Tier 1 cap · 14 per week"
          tone={record.touches7d > record.budgetCap * 0.85 ? "amber" : "green"}
          icon={<Coins className="w-4 h-4" />}
        />
        <StatCard
          label="Held for owner · 7d"
          value={String(record.conflicts7d)}
          sublabel="Agent actions Coordinator caught"
          tone={record.conflicts7d > 4 ? "amber" : "green"}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Active agents"
          value={String(record.agentsActive.length)}
          sublabel={record.agentsActive
            .map((aid) => AGENTS_BY_ID[aid]?.name ?? aid)
            .join(", ")}
          tone="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <Section
            title="Agent oversight timeline"
            description={`Every agent attempt on this record — what Coordinator did on ${record.ownerName.split(" ")[0]}'s behalf.`}
          >
            <ol className="mt-4 relative border-l-2 border-ink-100 ml-2">
              {decisions.length === 0 && (
                <li className="pl-5 py-3 text-[12.5px] text-muted">
                  No decisions in the window.
                </li>
              )}
              {decisions.map((d) => {
                const agent = AGENTS_BY_ID[d.agentId];
                const repImpact = REP_IMPACT_BY_DECISION[d.id];
                return (
                  <li key={d.id} className="pl-5 py-3 relative">
                    <span
                      className="absolute -left-[7px] top-4 w-3 h-3 rounded-full bg-white border-2"
                      style={{
                        borderColor:
                          d.decision === "GO"
                            ? "#16a34a"
                            : d.decision === "NO_GO"
                              ? "#dc2626"
                              : d.decision === "WAIT"
                                ? "#d97706"
                                : "#2563eb",
                      }}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {agent && (
                        <ToolIcon
                          color={agent.color}
                          initials={agent.initials}
                          size={18}
                        />
                      )}
                      <span className="text-[12.5px] font-semibold text-ink-900">
                        {agent?.name}
                      </span>
                      <code className="text-[11px] font-mono text-ink-600 bg-ink-50 px-1.5 py-0.5 rounded">
                        {d.action}
                      </code>
                      <DecisionBadge decision={d.decision} />
                      <span className="ml-auto text-[11px] text-muted tabular">
                        {formatRelative(d.tsMs)} · {d.latencyMs} ms
                      </span>
                    </div>
                    {repImpact && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-ink-900 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{repImpact}</span>
                      </div>
                    )}
                    <div className="mt-1 text-[12px] text-muted leading-snug">
                      <span className="text-ink-500">Engine reason:</span>{" "}
                      {d.reason}
                    </div>
                    {d.outcome && (
                      <div className="mt-1 text-[11.5px] text-emerald-700">
                        → outcome: {d.outcome}
                      </div>
                    )}
                    {d.redirectedTo && (
                      <div className="mt-1 text-[11.5px] text-blue-700">
                        → redirected to: {d.redirectedTo}
                      </div>
                    )}
                    {d.waitUntil && (
                      <div className="mt-1 text-[11.5px] text-amber-700">
                        → retry after: {d.waitUntil}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Section>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <Section title="Budget state" description="Tier 1 weekly caps">
              <ul className="mt-3 space-y-2.5 text-[12.5px]">
                {[
                  { c: "Email", used: 5, cap: 7 },
                  { c: "LinkedIn", used: 2, cap: 3 },
                  { c: "Chat", used: 3, cap: 6 },
                  { c: "Phone", used: 1, cap: 2 },
                ].map((row) => (
                  <li key={row.c} className="flex items-center gap-2">
                    <div className="w-20 text-ink-700">{row.c}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${(row.used / row.cap) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right tabular text-ink-700">
                      {row.used}/{row.cap}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          </Card>
          <Card className="p-5">
            <Section title="Policy context" description="Rules that apply here">
              <ul className="mt-3 space-y-2 text-[12.5px]">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      Enterprise Approval Gate
                    </div>
                    <div className="text-muted">
                      Tier-1 + open opp → outbound redirects to owner
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      EMEA Quiet Hours
                    </div>
                    <div className="text-muted">
                      Owner pod EMEA North · pause 18:00–08:00 local
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-ink-900">
                      Single-Sequence Lock
                    </div>
                    <div className="text-muted">
                      Active: 11x Alice · Outbound Q2
                    </div>
                  </div>
                </li>
              </ul>
            </Section>
          </Card>

          <Card className="p-5">
            <Section title="Resolved identifiers">
              <ul className="mt-3 space-y-1.5 text-[11.5px] font-mono text-ink-700">
                <li>email: {record.email}</li>
                <li>sfdc_id: 003Dp0000{record.id.slice(-6).toUpperCase()}</li>
                <li>
                  linkedin: /in/{record.companySlug}-{record.id.slice(-4)}
                </li>
                <li>phone_hash: sha256:a7f3...c0b1</li>
              </ul>
            </Section>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Owner view — Slack DM mock.

function OwnerView({
  record,
  slackMessages,
}: {
  record: CanonicalRecord;
  slackMessages: OwnerSlackMessage[];
}) {
  const ownerFirst = record.ownerName.split(" ")[0];
  const sortedMessages = [...slackMessages].sort(
    (a, b) => b.secondsAgo - a.secondsAgo, // oldest first (Slack convention)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <SlackWindow
          ownerName={record.ownerName}
          messages={sortedMessages}
          recordName={record.name}
          empty={slackMessages.length === 0}
        />
      </div>
      <div className="space-y-4">
        <Card className="p-5" emphasis>
          <Section
            title={`What ${ownerFirst} sees`}
            description="Coordinator runs as a Slack app in your workspace. Only the owner of a record gets these — and only when an agent action affects them."
          >
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              <BulletRow
                icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                label="Held, not hidden"
                copy={`${slackMessages.length} agent attempts on ${record.name.split(" ")[0]} — all surfaced to ${ownerFirst} with one-click controls.`}
              />
              <BulletRow
                icon={<MessageSquare className="w-3.5 h-3.5 text-brand" />}
                label='"Your move" framing'
                copy="Approve, hand off, or hold from Slack. Coordinator never decides for the rep — it stages the decision."
              />
              <BulletRow
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-ink-500" />}
                label="No agent NO_GO on rep actions"
                copy="When the rep responds in-thread or sends from Salesforce, Preflight short-circuits to GO. Always."
              />
            </ul>
          </Section>
        </Card>

        <Card className="p-5">
          <Section
            title="This week on this record"
            description="Owner-side activity summary"
          >
            <div className="mt-3 space-y-2 text-[12.5px]">
              <SummaryRow
                label="Agent actions held"
                value={`${slackMessages.length}`}
                tone="amber"
              />
              <SummaryRow
                label="Awaiting your decision"
                value={`${slackMessages.filter((m) => m.unread).length}`}
                tone="brand"
              />
              <SummaryRow
                label="Approved by you"
                value={`${slackMessages.filter((m) => m.resolved === "approved").length}`}
                tone="green"
              />
              <SummaryRow
                label="Auto-resolved"
                value={`${slackMessages.filter((m) => m.resolved === "held").length}`}
                tone="neutral"
              />
            </div>
          </Section>
        </Card>

        <Card className="p-5">
          <Section title="Coordinator app · install detail">
            <ul className="mt-2.5 space-y-1.5 text-[11.5px] font-mono text-ink-700">
              <li>workspace: convex-software.slack.com</li>
              <li>app_id: A06GTMC0RD</li>
              <li>scopes: chat:write, im:write, users:read</li>
              <li>installed_by: jen.park@convex.com</li>
            </ul>
          </Section>
        </Card>
      </div>
    </div>
  );
}

function BulletRow({
  icon,
  label,
  copy,
}: {
  icon: React.ReactNode;
  label: string;
  copy: string;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="font-semibold text-ink-900">{label}</div>
        <div className="text-muted">{copy}</div>
      </div>
    </li>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "green" | "amber" | "neutral";
}) {
  const map = {
    brand: "text-brand-700",
    green: "text-emerald-700",
    amber: "text-amber-700",
    neutral: "text-ink-700",
  } as const;
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-700">{label}</span>
      <span className={cn("font-semibold tabular", map[tone])}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slack mock — chrome + thread.

function SlackWindow({
  ownerName,
  messages,
  recordName,
  empty,
}: {
  ownerName: string;
  messages: OwnerSlackMessage[];
  recordName: string;
  empty?: boolean;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-ink-200 shadow-md bg-white">
      {/* Slack window chrome */}
      <div className="bg-[#350d36] flex items-center gap-2 px-3 py-2 border-b border-black/30">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center text-[11.5px] text-white/70 font-medium">
          Convex Software · Slack
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr] min-h-[560px]">
        {/* Slack sidebar */}
        <SlackSidebar ownerName={ownerName} />

        {/* Main */}
        <div className="flex flex-col bg-white min-w-0">
          <SlackChannelHeader ownerName={ownerName} recordName={recordName} />
          <div className="flex-1 overflow-y-auto px-1.5 py-3">
            {empty ? (
              <SlackEmptyState recordName={recordName} ownerName={ownerName} />
            ) : (
              <>
                <DateDivider label="Today" />
                <div className="space-y-1">
                  {messages.map((msg, i) => (
                    <SlackMessage
                      key={msg.id}
                      message={msg}
                      showHeader={
                        i === 0 ||
                        messages[i - 1].secondsAgo - msg.secondsAgo > 1800
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <SlackComposer ownerName={ownerName} />
        </div>
      </div>
    </div>
  );
}

function SlackSidebar({ ownerName }: { ownerName: string }) {
  const ownerFirst = ownerName.split(" ")[0];
  return (
    <div className="bg-[#3f0e40] text-white/85 text-[12.5px] flex flex-col">
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">Convex</div>
          <div className="flex items-center gap-1 text-[10.5px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {ownerFirst}
          </div>
        </div>
        <Search className="w-3.5 h-3.5 text-white/60" />
      </div>

      <SidebarSection
        label="Channels"
        items={[
          { hash: true, name: "ae-emea", muted: true },
          { hash: true, name: "deal-bigcorp", muted: true },
          { hash: true, name: "wins", muted: true },
        ]}
      />

      <SidebarSection
        label="Apps"
        items={[
          {
            app: true,
            name: "GTM Coordinator",
            initials: "Co",
            color: "#4a4bd6",
            unread: 4,
            active: true,
          },
          {
            app: true,
            name: "Salesforce",
            initials: "SF",
            color: "#00a1e0",
          },
          { app: true, name: "1Mind", initials: "1M", color: "#7c3aed" },
        ]}
      />

      <SidebarSection
        label="Direct messages"
        items={[
          { dm: true, name: "Jen Park", initials: "JP" },
          { dm: true, name: "Priya Nair", initials: "PN" },
          { dm: true, name: "Tom Anderson", initials: "TA" },
        ]}
      />
    </div>
  );
}

type SidebarItem = {
  hash?: boolean;
  app?: boolean;
  dm?: boolean;
  name: string;
  initials?: string;
  color?: string;
  muted?: boolean;
  unread?: number;
  active?: boolean;
};

function SidebarSection({
  label,
  items,
}: {
  label: string;
  items: SidebarItem[];
}) {
  return (
    <div className="py-1">
      <div className="px-3 py-1 text-[10.5px] uppercase tracking-wider text-white/50 font-semibold">
        {label}
      </div>
      <ul>
        {items.map((it, i) => (
          <li
            key={i}
            className={cn(
              "px-3 py-1 flex items-center gap-2 truncate",
              it.active ? "bg-[#1164a3] text-white" : "hover:bg-white/5",
              it.muted ? "text-white/55" : "text-white/85",
            )}
          >
            {it.hash && <Hash className="w-3 h-3 shrink-0" />}
            {it.app && (
              <span
                className="w-3.5 h-3.5 rounded-[3px] flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: it.color }}
              >
                {it.initials}
              </span>
            )}
            {it.dm && (
              <span className="w-3.5 h-3.5 rounded-[3px] bg-white/15 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                {it.initials}
              </span>
            )}
            <span className="truncate text-[12px]">{it.name}</span>
            {it.unread !== undefined && (
              <span className="ml-auto inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9.5px] font-bold tabular shrink-0">
                {it.unread}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlackChannelHeader({
  ownerName,
  recordName,
}: {
  ownerName: string;
  recordName: string;
}) {
  const ownerFirst = ownerName.split(" ")[0];
  return (
    <div className="border-b border-ink-200 px-4 py-2 flex items-center gap-3">
      <span className="w-5 h-5 rounded-[4px] bg-brand flex items-center justify-center text-[9.5px] font-bold text-white">
        Co
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-ink-900 leading-tight">
          GTM Coordinator
          <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-500 bg-ink-100 rounded px-1 py-0.5">
            App
          </span>
        </div>
        <div className="text-[11px] text-muted truncate">
          DM with {ownerFirst} · scoped to{" "}
          <span className="font-medium text-ink-700">{recordName}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-ink-500">
        <Bell className="w-4 h-4" />
        <Bookmark className="w-4 h-4" />
      </div>
    </div>
  );
}

function SlackEmptyState({
  recordName,
  ownerName,
}: {
  recordName: string;
  ownerName: string;
}) {
  const ownerFirst = ownerName.split(" ")[0];
  return (
    <div className="px-6 py-12 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-brand text-white text-[12px] font-bold mb-3">
        Co
      </div>
      <div className="text-[14px] font-semibold text-ink-900">
        Quiet week on {recordName}.
      </div>
      <p className="mt-1 text-[12.5px] text-muted max-w-sm mx-auto leading-relaxed">
        Coordinator hasn&apos;t held anything for {ownerFirst} on this record.
        No agent action tripped a policy in the last 7 days — so no DMs were
        sent.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        All clear
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 my-2">
      <div className="flex-1 border-t border-ink-200" />
      <div className="text-[10.5px] font-semibold text-ink-700 px-2 py-0.5 rounded-full border border-ink-200 bg-white">
        {label}
      </div>
      <div className="flex-1 border-t border-ink-200" />
    </div>
  );
}

function SlackMessage({
  message,
  showHeader,
}: {
  message: OwnerSlackMessage;
  showHeader: boolean;
}) {
  const agent = AGENTS_BY_ID[message.agentId];
  return (
    <div
      className={cn(
        "group px-3 py-1 hover:bg-[#f8f8f8] transition-colors",
        message.unread && "bg-[#fff8e1] hover:bg-[#fff3c4]",
      )}
    >
      <div className="flex gap-2.5">
        {showHeader ? (
          <span className="w-9 h-9 rounded-[5px] bg-brand flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            Co
          </span>
        ) : (
          <span className="w-9 shrink-0 text-[10px] text-ink-400 tabular text-right pt-0.5 opacity-0 group-hover:opacity-100">
            {message.absoluteTime.replace(/^Today at /, "")}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {showHeader && (
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[13px] font-bold text-ink-900">
                GTM Coordinator
              </span>
              <span className="text-[9.5px] font-semibold uppercase tracking-wider text-ink-500 bg-ink-100 rounded px-1 py-[1px]">
                App
              </span>
              <span
                className="text-[11px] text-muted ml-0.5"
                title={message.absoluteTime}
              >
                {message.absoluteTime}
              </span>
            </div>
          )}
          <SlackBlockKitCard message={message} agent={agent} />
        </div>
      </div>
    </div>
  );
}

function SlackBlockKitCard({
  message,
  agent,
}: {
  message: OwnerSlackMessage;
  agent: Agent | undefined;
}) {
  return (
    <div className="mt-1 max-w-[640px] rounded-md border-l-[3px] border-l-brand bg-white border border-ink-200 shadow-sm overflow-hidden">
      <div className="p-3 space-y-2">
        <div className="text-[13.5px] text-ink-900 font-semibold leading-snug">
          {message.headline}
        </div>
        <div className="text-[12.5px] text-ink-700 leading-relaxed">
          {message.body}
        </div>
        {message.context && (
          <blockquote className="text-[12px] text-ink-600 italic border-l-2 border-ink-200 pl-2.5 leading-relaxed">
            {message.context}
          </blockquote>
        )}

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {agent && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-ink-200 bg-ink-50 text-[10.5px] font-medium text-ink-700">
              <ToolIcon
                color={agent.color}
                initials={agent.initials}
                size={12}
              />
              {agent.name}
            </span>
          )}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-ink-200 bg-ink-50 text-[10.5px] font-mono text-ink-700">
            {message.channel}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-ink-200 bg-ink-50 text-[10.5px] font-medium text-ink-700">
            <ShieldCheck className="w-2.5 h-2.5" />
            {message.policyLabel}
          </span>
          <DecisionBadge decision={message.decision} />
        </div>

        {message.resolved ? (
          <ResolvedFooter resolved={message.resolved} />
        ) : (
          <SlackActionButtons actions={message.actions} />
        )}
      </div>
    </div>
  );
}

function SlackActionButtons({ actions }: { actions: OwnerSlackAction[] }) {
  const config: {
    [K in OwnerSlackAction]: {
      label: string;
      style: "primary" | "danger" | "default";
    };
  } = {
    approve: { label: "Approve", style: "primary" },
    handoff: { label: "Hand off to me", style: "default" },
    hold: { label: "Hold", style: "default" },
    "view-record": { label: "View record", style: "default" },
    snooze: { label: "Snooze 24h", style: "default" },
  };
  return (
    <div className="flex items-center gap-1.5 pt-2 flex-wrap border-t border-ink-100">
      {actions.map((a) => {
        const c = config[a];
        return (
          <button
            key={a}
            type="button"
            className={cn(
              "h-7 px-2.5 rounded text-[12px] font-semibold transition-colors",
              c.style === "primary"
                ? "bg-[#007a5a] text-white hover:bg-[#148567]"
                : c.style === "danger"
                  ? "bg-[#e01e5a] text-white hover:bg-[#c41a4f]"
                  : "bg-white border border-ink-300 text-ink-800 hover:bg-ink-50",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function ResolvedFooter({
  resolved,
}: {
  resolved: NonNullable<OwnerSlackMessage["resolved"]>;
}) {
  const map = {
    approved: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "You approved this",
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    held: {
      icon: <ShieldCheck className="w-3 h-3" />,
      label: "Auto-held by Coordinator",
      tone: "text-ink-700 bg-ink-50 border-ink-200",
    },
    "handed-off": {
      icon: <CornerDownRight className="w-3 h-3" />,
      label: "Handed off to you",
      tone: "text-blue-700 bg-blue-50 border-blue-200",
    },
  } as const;
  const r = map[resolved];
  return (
    <div
      className={cn(
        "mt-1 inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-medium",
        r.tone,
      )}
    >
      {r.icon}
      {r.label}
    </div>
  );
}

function SlackComposer({ ownerName }: { ownerName: string }) {
  const ownerFirst = ownerName.split(" ")[0];
  return (
    <div className="border-t border-ink-200 px-3 py-2.5">
      <div className="rounded-md border border-ink-300 bg-white">
        <div className="flex items-center gap-1 px-2 py-1 border-b border-ink-100 text-ink-500">
          <Bold className="w-3 h-3" />
          <Italic className="w-3 h-3" />
          <Link2 className="w-3 h-3" />
          <span className="w-px h-3 bg-ink-200 mx-1" />
          <AtSign className="w-3 h-3" />
          <Smile className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Plus className="w-4 h-4 text-ink-400" />
          <span className="flex-1 text-[12.5px] text-ink-400">
            Reply to GTM Coordinator…
          </span>
          <Send className="w-4 h-4 text-ink-300" />
        </div>
      </div>
      <div className="mt-1 text-[10.5px] text-ink-500">
        Replying as{" "}
        <span className="font-medium text-ink-700">{ownerFirst}</span> · this
        thread is private to you and the Coordinator app.
      </div>
    </div>
  );
}
