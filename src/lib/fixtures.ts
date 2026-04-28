// GTM Agent Coordinator — demo fixtures.
// Tenant: Convex Software (same as agp-app-v7, so the two demos feel like siblings).

export type AgentKind =
  | "ai-sdr"
  | "enrichment"
  | "scheduling"
  | "intent"
  | "custom";

export type AgentStatus = "active" | "paused" | "throttled" | "revoked";

export type Agent = {
  id: string;
  name: string;
  vendor: string;
  kind: AgentKind;
  status: AgentStatus;
  declaredActions: string[];
  apiKeyPreview: string;
  registeredAt: string;
  lastActive: string;
  preflights24h: number;
  goRate: number;
  color: string; // tool-icon background
  initials: string;
};

export const AGENTS: Agent[] = [
  {
    id: "agt_11x_alice",
    name: "11x Alice",
    vendor: "11x.ai",
    kind: "ai-sdr",
    status: "active",
    declaredActions: ["send_email", "send_linkedin", "schedule_meeting"],
    apiKeyPreview: "sk_live_...7f3a",
    registeredAt: "2026-01-14",
    lastActive: "2 min ago",
    preflights24h: 1847,
    goRate: 0.87,
    color: "#111111",
    initials: "11",
  },
  {
    id: "agt_warmly_visitor",
    name: "Warmly Visitor Bot",
    vendor: "Warmly",
    kind: "intent",
    status: "active",
    declaredActions: ["send_chat", "send_email", "notify_owner"],
    apiKeyPreview: "sk_live_...2b1c",
    registeredAt: "2025-11-02",
    lastActive: "5 min ago",
    preflights24h: 964,
    goRate: 0.72,
    color: "#f59e0b",
    initials: "Wa",
  },
  {
    id: "agt_clay_enrich",
    name: "Clay Enrichment",
    vendor: "Clay",
    kind: "enrichment",
    status: "active",
    declaredActions: ["enrich_record", "update_crm_field"],
    apiKeyPreview: "sk_live_...9c4e",
    registeredAt: "2025-09-21",
    lastActive: "8 min ago",
    preflights24h: 612,
    goRate: 0.98,
    color: "#dc2626",
    initials: "Cl",
  },
  {
    id: "agt_onemind_sched",
    name: "OneMind Scheduler",
    vendor: "OneMind",
    kind: "scheduling",
    status: "active",
    declaredActions: ["schedule_meeting", "reschedule"],
    apiKeyPreview: "sk_live_...5d2a",
    registeredAt: "2025-12-08",
    lastActive: "14 min ago",
    preflights24h: 218,
    goRate: 0.91,
    color: "#7c3aed",
    initials: "OM",
  },
  {
    id: "agt_zi_signals",
    name: "ZoomInfo Signals",
    vendor: "ZoomInfo",
    kind: "intent",
    status: "active",
    declaredActions: ["enrich_record", "notify_owner"],
    apiKeyPreview: "sk_live_...1e8f",
    registeredAt: "2025-08-30",
    lastActive: "22 min ago",
    preflights24h: 432,
    goRate: 0.95,
    color: "#0ea5e9",
    initials: "ZI",
  },
  {
    id: "agt_rev_outbound",
    name: "Convex Outbound Agent",
    vendor: "In-house",
    kind: "custom",
    status: "active",
    declaredActions: ["send_email", "add_to_sequence", "notify_owner"],
    apiKeyPreview: "sk_live_...c0de",
    registeredAt: "2026-02-03",
    lastActive: "1 min ago",
    preflights24h: 341,
    goRate: 0.84,
    color: "#4a4bd6",
    initials: "Cx",
  },
  {
    id: "agt_regie_ai",
    name: "Regie.ai Sequencer",
    vendor: "Regie.ai",
    kind: "ai-sdr",
    status: "throttled",
    declaredActions: ["send_email", "add_to_sequence"],
    apiKeyPreview: "sk_live_...a7b2",
    registeredAt: "2025-10-11",
    lastActive: "38 min ago",
    preflights24h: 127,
    goRate: 0.41,
    color: "#0891b2",
    initials: "Re",
  },
  {
    id: "agt_qualified_piper",
    name: "Qualified Piper",
    vendor: "Qualified",
    kind: "ai-sdr",
    status: "paused",
    declaredActions: ["send_chat", "schedule_meeting"],
    apiKeyPreview: "sk_live_...8e09",
    registeredAt: "2025-07-12",
    lastActive: "2h ago",
    preflights24h: 0,
    goRate: 0.68,
    color: "#16a34a",
    initials: "Qp",
  },
];

// ---------------------------------------------------------------------------
// Canonical records

export type Record = {
  id: string;
  name: string;
  email: string;
  company: string;
  companySlug: string;
  title: string;
  ownerName: string;
  ownerRole: string;
  ownerPod: string;
  openOpp?: { amount: string; stage: string };
  lifecycle: "Lead" | "MQL" | "SQL" | "Opportunity" | "Customer";
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  lastActivity: string;
  conflicts7d: number;
  touches7d: number;
  budgetCap: number;
  agentsActive: string[]; // agent ids
};

export const RECORDS: Record[] = [
  {
    id: "rec_jane_bigcorp",
    name: "Jane Doe",
    email: "jane@bigcorp.com",
    company: "BigCorp",
    companySlug: "bigcorp",
    title: "VP Revenue Operations",
    ownerName: "Mike Chen",
    ownerRole: "AE — Enterprise",
    ownerPod: "EMEA North",
    openOpp: { amount: "$180K", stage: "Negotiation" },
    lifecycle: "Opportunity",
    tier: "Tier 1",
    lastActivity: "2 min ago",
    conflicts7d: 8,
    touches7d: 11,
    budgetCap: 14,
    agentsActive: ["agt_11x_alice", "agt_warmly_visitor", "agt_onemind_sched"],
  },
  {
    id: "rec_john_startup",
    name: "John Smith",
    email: "john@startup.io",
    company: "StartupIO",
    companySlug: "startupio",
    title: "CTO",
    ownerName: "Sarah Johnson",
    ownerRole: "SDR — Mid-market",
    ownerPod: "NA West",
    lifecycle: "MQL",
    tier: "Tier 2",
    lastActivity: "5 min ago",
    conflicts7d: 6,
    touches7d: 9,
    budgetCap: 10,
    agentsActive: ["agt_11x_alice", "agt_warmly_visitor"],
  },
  {
    id: "rec_sarah_ent",
    name: "Sarah Williams",
    email: "sarah@enterprise.com",
    company: "Enterprise Co",
    companySlug: "enterprise-co",
    title: "Director of GTM Systems",
    ownerName: "Tom Anderson",
    ownerRole: "AE — Enterprise",
    ownerPod: "NA East",
    openOpp: { amount: "$50K", stage: "Discovery" },
    lifecycle: "SQL",
    tier: "Tier 1",
    lastActivity: "8 min ago",
    conflicts7d: 5,
    touches7d: 7,
    budgetCap: 12,
    agentsActive: ["agt_11x_alice", "agt_clay_enrich"],
  },
  {
    id: "rec_emma_tech",
    name: "Emma Walsh",
    email: "emma@tech.co",
    company: "Tech Co",
    companySlug: "tech-co",
    title: "Head of Marketing Ops",
    ownerName: "Priya Nair",
    ownerRole: "SDR — Enterprise",
    ownerPod: "EMEA North",
    lifecycle: "Lead",
    tier: "Tier 2",
    lastActivity: "15 min ago",
    conflicts7d: 4,
    touches7d: 5,
    budgetCap: 8,
    agentsActive: ["agt_onemind_sched", "agt_zi_signals"],
  },
  {
    id: "rec_mike_company",
    name: "Mike Rodriguez",
    email: "mike@company.com",
    company: "Company Inc",
    companySlug: "company-inc",
    title: "VP Sales",
    ownerName: "James Park",
    ownerRole: "AE — Enterprise",
    ownerPod: "NA West",
    openOpp: { amount: "$240K", stage: "Proposal" },
    lifecycle: "Opportunity",
    tier: "Tier 1",
    lastActivity: "12 min ago",
    conflicts7d: 3,
    touches7d: 6,
    budgetCap: 14,
    agentsActive: ["agt_11x_alice", "agt_warmly_visitor"],
  },
  {
    id: "rec_lena_atlas",
    name: "Lena Okafor",
    email: "lena@atlastech.com",
    company: "Atlas Tech",
    companySlug: "atlas-tech",
    title: "Chief Customer Officer",
    ownerName: "Lisa Park",
    ownerRole: "CSM — Strategic",
    ownerPod: "NA East",
    openOpp: { amount: "$720K ARR", stage: "Renewal" },
    lifecycle: "Customer",
    tier: "Tier 1",
    lastActivity: "3 min ago",
    conflicts7d: 2,
    touches7d: 4,
    budgetCap: 10,
    agentsActive: ["agt_clay_enrich", "agt_zi_signals"],
  },
];

// ---------------------------------------------------------------------------
// Preflight decisions (Action Ledger)

export type Decision = "GO" | "NO_GO" | "WAIT" | "REDIRECT";

export type PreflightEntry = {
  id: string;
  tsMs: number; // relative to "now"; newer first
  agentId: string;
  action: string;
  recordId: string;
  decision: Decision;
  reason: string;
  latencyMs: number;
  rulesetVersion: string;
  outcome?: string;
  redirectedTo?: string;
  waitUntil?: string;
};

// tsMs is computed off Date.now() at render time in the feed so it feels live.
// Here we store seconds-ago offsets.
type RawEntry = Omit<PreflightEntry, "tsMs"> & { secondsAgo: number };

const raw: RawEntry[] = [
  {
    id: "req_2H9F",
    secondsAgo: 3,
    agentId: "agt_rev_outbound",
    action: "send_email",
    recordId: "rec_lena_atlas",
    decision: "GO",
    reason: "No conflicts; within budget",
    latencyMs: 142,
    rulesetVersion: "v2026.04.1",
    outcome: "email_sent",
  },
  {
    id: "req_2H9E",
    secondsAgo: 12,
    agentId: "agt_11x_alice",
    action: "send_email",
    recordId: "rec_jane_bigcorp",
    decision: "WAIT",
    reason: "Owner Mike Chen touched 11 min ago — cooldown 15m",
    latencyMs: 187,
    rulesetVersion: "v2026.04.1",
    waitUntil: "14:28 UTC",
  },
  {
    id: "req_2H9D",
    secondsAgo: 28,
    agentId: "agt_warmly_visitor",
    action: "send_chat",
    recordId: "rec_john_startup",
    decision: "NO_GO",
    reason: "Weekly touch budget exhausted (9/9)",
    latencyMs: 98,
    rulesetVersion: "v2026.04.1",
  },
  {
    id: "req_2H9C",
    secondsAgo: 41,
    agentId: "agt_clay_enrich",
    action: "enrich_record",
    recordId: "rec_sarah_ent",
    decision: "GO",
    reason: "Enrichment exempt from outbound budget",
    latencyMs: 71,
    rulesetVersion: "v2026.04.1",
    outcome: "enriched_linkedin,title,company_size",
  },
  {
    id: "req_2H9B",
    secondsAgo: 63,
    agentId: "agt_11x_alice",
    action: "schedule_meeting",
    recordId: "rec_mike_company",
    decision: "WAIT",
    reason: "OneMind holds active booking lock (TTL 4m)",
    latencyMs: 156,
    rulesetVersion: "v2026.04.1",
  },
  {
    id: "req_2H9A",
    secondsAgo: 89,
    agentId: "agt_onemind_sched",
    action: "schedule_meeting",
    recordId: "rec_mike_company",
    decision: "GO",
    reason: "Lock acquired; round-robin to James Park",
    latencyMs: 211,
    rulesetVersion: "v2026.04.1",
    outcome: "meeting_booked_tue_2pm",
  },
  {
    id: "req_2H99",
    secondsAgo: 134,
    agentId: "agt_zi_signals",
    action: "notify_owner",
    recordId: "rec_emma_tech",
    decision: "GO",
    reason: "Intent signal — priority override",
    latencyMs: 64,
    rulesetVersion: "v2026.04.1",
    outcome: "slack_notified",
  },
  {
    id: "req_2H98",
    secondsAgo: 172,
    agentId: "agt_warmly_visitor",
    action: "send_chat",
    recordId: "rec_jane_bigcorp",
    decision: "REDIRECT",
    reason: "Open opp in Negotiation — route to owner instead of auto-chat",
    latencyMs: 143,
    rulesetVersion: "v2026.04.1",
    redirectedTo: "Mike Chen (AE)",
  },
  {
    id: "req_2H97",
    secondsAgo: 205,
    agentId: "agt_regie_ai",
    action: "send_email",
    recordId: "rec_john_startup",
    decision: "NO_GO",
    reason: "Agent throttled — 59% NO_GO rate (24h) exceeds threshold",
    latencyMs: 52,
    rulesetVersion: "v2026.04.1",
  },
  {
    id: "req_2H96",
    secondsAgo: 248,
    agentId: "agt_11x_alice",
    action: "send_linkedin",
    recordId: "rec_sarah_ent",
    decision: "GO",
    reason: "First touch this channel; within sequence budget",
    latencyMs: 118,
    rulesetVersion: "v2026.04.1",
    outcome: "linkedin_sent",
  },
  {
    id: "req_2H95",
    secondsAgo: 301,
    agentId: "agt_clay_enrich",
    action: "enrich_record",
    recordId: "rec_jane_bigcorp",
    decision: "GO",
    reason: "Allowed action type",
    latencyMs: 67,
    rulesetVersion: "v2026.04.1",
    outcome: "enriched_tech_stack",
  },
  {
    id: "req_2H94",
    secondsAgo: 372,
    agentId: "agt_11x_alice",
    action: "send_email",
    recordId: "rec_mike_company",
    decision: "WAIT",
    reason: "OneMind meeting pending — 24h quiet-hold policy",
    latencyMs: 163,
    rulesetVersion: "v2026.04.1",
  },
  {
    id: "req_2H93",
    secondsAgo: 422,
    agentId: "agt_rev_outbound",
    action: "add_to_sequence",
    recordId: "rec_emma_tech",
    decision: "REDIRECT",
    reason: "Already in nurture — route to Priya Nair for review",
    latencyMs: 92,
    rulesetVersion: "v2026.04.1",
    redirectedTo: "Priya Nair (SDR)",
  },
  {
    id: "req_2H92",
    secondsAgo: 481,
    agentId: "agt_zi_signals",
    action: "notify_owner",
    recordId: "rec_jane_bigcorp",
    decision: "GO",
    reason: "New buying-group signal detected",
    latencyMs: 58,
    rulesetVersion: "v2026.04.1",
    outcome: "slack_notified",
  },
  {
    id: "req_2H91",
    secondsAgo: 540,
    agentId: "agt_warmly_visitor",
    action: "send_email",
    recordId: "rec_mike_company",
    decision: "NO_GO",
    reason: "Agent not authorized for action 'send_email' on Tier-1 accounts",
    latencyMs: 44,
    rulesetVersion: "v2026.04.1",
  },
];

export function getDecisions(nowMs: number = Date.now()): PreflightEntry[] {
  return raw.map((r) => ({
    id: r.id,
    tsMs: nowMs - r.secondsAgo * 1000,
    agentId: r.agentId,
    action: r.action,
    recordId: r.recordId,
    decision: r.decision,
    reason: r.reason,
    latencyMs: r.latencyMs,
    rulesetVersion: r.rulesetVersion,
    outcome: r.outcome,
    redirectedTo: r.redirectedTo,
    waitUntil: r.waitUntil,
  }));
}

// ---------------------------------------------------------------------------
// Aggregate KPIs

export const OVERVIEW_KPIS = {
  preflights24h: 4521,
  goCount: 3847,
  goRate: 0.851,
  collisions24h: 142,
  collisionRate: 0.031,
  activeAgents: 12,
  pausedAgents: 2,
  p95LatencyMs: 287,
  sla: "≤500ms p95",
  uptime30d: "99.97%",
  meetingsBooked30d: 142,
  avgTimeToMeetingDays: 2.3,
  attributedPipeline30d: "$4.2M",
  attributedRevenue30d: "$840K",
};

// Decision distribution for sparkline (7d)
export const DECISION_DISTRIBUTION_7D: Array<{
  day: string;
  go: number;
  no_go: number;
  wait: number;
  redirect: number;
}> = [
  { day: "Wed", go: 3420, no_go: 412, wait: 119, redirect: 74 },
  { day: "Thu", go: 3614, no_go: 397, wait: 131, redirect: 82 },
  { day: "Fri", go: 3841, no_go: 428, wait: 142, redirect: 91 },
  { day: "Sat", go: 1247, no_go: 108, wait: 44, redirect: 22 },
  { day: "Sun", go: 982, no_go: 87, wait: 31, redirect: 18 },
  { day: "Mon", go: 4128, no_go: 471, wait: 156, redirect: 103 },
  { day: "Tue", go: 3847, no_go: 442, wait: 138, redirect: 94 },
];

// ---------------------------------------------------------------------------
// Policies

export type PolicyType =
  | "sequence"
  | "approval"
  | "priority"
  | "channel"
  | "quiet-hours"
  | "budget";

export type PolicyCategory =
  | "identity"
  | "communication-budgets"
  | "sequencing"
  | "stage-gates"
  | "approvals"
  | "compliance";

export type ChannelCap = { channel: string; cap: number; period: string };

export type BudgetMeta = {
  weeklyTouches: number;
  dailyTouches: number;
  cooldownMinutes: number;
  channelCaps: ChannelCap[];
};

export type Policy = {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  category: PolicyCategory;
  scope: string;
  status: "active" | "draft" | "paused";
  enforcement: "block" | "warn" | "redirect";
  appliedTo: string;
  triggered7d: number;
  lastModified: string;
  rules: string[];
  budget?: BudgetMeta;
};

export const POLICY_CATEGORIES: Array<{
  key: PolicyCategory;
  label: string;
  blurb: string;
}> = [
  {
    key: "identity",
    label: "Identity & ownership",
    blurb: "Who is allowed to act on a record. Humans always win.",
  },
  {
    key: "communication-budgets",
    label: "Communication budgets",
    blurb:
      "Shared touch budget per record across every agent — counted in Redis, enforced in ≤10 ms.",
  },
  {
    key: "sequencing",
    label: "Sequencing & cadence",
    blurb: "One coordinated outbound motion per record.",
  },
  {
    key: "stage-gates",
    label: "Stage gates",
    blurb: "Pipeline stage decides what agents may attempt.",
  },
  {
    key: "approvals",
    label: "Approvals",
    blurb: "Decisions that need a human signature first.",
  },
  {
    key: "compliance",
    label: "Compliance",
    blurb: "Hard rules that come from law, not preference.",
  },
];

export const POLICIES: Policy[] = [
  {
    id: "pol_ent_approval",
    name: "Enterprise Approval Gate",
    description:
      "Require AE sign-off before any outbound on Tier-1 accounts with open opportunities.",
    type: "approval",
    category: "approvals",
    scope: "Tier-1 + open opp",
    status: "active",
    enforcement: "redirect",
    appliedTo: "142 accounts",
    triggered7d: 87,
    lastModified: "2026-04-18",
    rules: [
      "IF record.tier == 'Tier 1' AND record.openOpp.stage IN ('Negotiation','Proposal')",
      "AND action.category == 'outbound'",
      "THEN decision = REDIRECT to owner (Slack DM + dashboard review)",
    ],
  },
  {
    id: "pol_quiet_hours",
    name: "EMEA Quiet Hours",
    description:
      "Suppress automated touches between 18:00–08:00 local time for EMEA accounts.",
    type: "quiet-hours",
    category: "communication-budgets",
    scope: "EMEA North/South",
    status: "active",
    enforcement: "block",
    appliedTo: "318 accounts",
    triggered7d: 412,
    lastModified: "2026-03-22",
    rules: [
      "IF record.pod LIKE 'EMEA%' AND local_time NOT IN (08:00–18:00)",
      "THEN decision = WAIT until next business hour",
    ],
  },
  {
    id: "pol_sequence_order",
    name: "Single-Sequence Lock",
    description:
      "Only one outbound sequence can be active on a record at a time.",
    type: "sequence",
    category: "sequencing",
    scope: "All records",
    status: "active",
    enforcement: "block",
    appliedTo: "All",
    triggered7d: 238,
    lastModified: "2026-02-09",
    rules: [
      "IF record.activeSequence IS NOT NULL AND action.type == 'add_to_sequence'",
      "AND requester.agentId != record.activeSequence.agentId",
      "THEN decision = NO_GO",
    ],
  },
  {
    id: "pol_channel_priority",
    name: "Channel Priority — CSM Owns Customers",
    description:
      "On Customer lifecycle, route outbound agents away from inbox; CSM owns the thread.",
    type: "priority",
    category: "identity",
    scope: "lifecycle = Customer",
    status: "active",
    enforcement: "redirect",
    appliedTo: "Customers",
    triggered7d: 61,
    lastModified: "2026-04-02",
    rules: [
      "IF record.lifecycle == 'Customer' AND action.channel == 'email'",
      "AND requester.kind IN ('ai-sdr','intent')",
      "THEN decision = REDIRECT to CSM",
    ],
  },
  {
    id: "pol_meeting_exclusive",
    name: "Meeting Booking Exclusivity",
    description:
      "Hold a 4-minute booking lock — only one scheduling agent books per record.",
    type: "sequence",
    category: "sequencing",
    scope: "action = schedule_meeting",
    status: "active",
    enforcement: "block",
    appliedTo: "All",
    triggered7d: 44,
    lastModified: "2026-01-11",
    rules: [
      "IF action.type == 'schedule_meeting' AND booking_lock_exists(record.id, ttl=240s)",
      "AND requester.agentId != lock.holder",
      "THEN decision = WAIT",
    ],
  },
  {
    id: "pol_budget_tier1",
    name: "Tier 1 — Enterprise Budget",
    description:
      "Shared communication budget across every agent and human SDR for enterprise accounts. 14 weekly touches, 60 min cooldown between touches.",
    type: "budget",
    category: "communication-budgets",
    scope: "tier = Tier 1",
    status: "active",
    enforcement: "block",
    appliedTo: "142 accounts",
    triggered7d: 184,
    lastModified: "2026-04-12",
    rules: [
      "IF record.tier == 'Tier 1'",
      "AND record.touchesThisWeek >= 14 OR record.touchesToday >= 3",
      "AND now - record.lastTouchAt < 60m",
      "THEN decision = NO_GO (budget exhausted)",
    ],
    budget: {
      weeklyTouches: 14,
      dailyTouches: 3,
      cooldownMinutes: 60,
      channelCaps: [
        { channel: "Email", cap: 2, period: "per day" },
        { channel: "LinkedIn", cap: 1, period: "per day" },
        { channel: "Chat", cap: 3, period: "per day" },
        { channel: "Phone", cap: 1, period: "per day" },
      ],
    },
  },
  {
    id: "pol_budget_tier2",
    name: "Tier 2 — Mid-market Budget",
    description:
      "Shared touch budget for mid-market accounts. 10 weekly touches, 90 min cooldown.",
    type: "budget",
    category: "communication-budgets",
    scope: "tier = Tier 2",
    status: "active",
    enforcement: "block",
    appliedTo: "318 accounts",
    triggered7d: 296,
    lastModified: "2026-04-12",
    rules: [
      "IF record.tier == 'Tier 2'",
      "AND record.touchesThisWeek >= 10 OR record.touchesToday >= 2",
      "AND now - record.lastTouchAt < 90m",
      "THEN decision = NO_GO (budget exhausted)",
    ],
    budget: {
      weeklyTouches: 10,
      dailyTouches: 2,
      cooldownMinutes: 90,
      channelCaps: [
        { channel: "Email", cap: 1, period: "per day" },
        { channel: "LinkedIn", cap: 1, period: "per day" },
        { channel: "Chat", cap: 2, period: "per day" },
      ],
    },
  },
  {
    id: "pol_budget_tier3",
    name: "Tier 3 — SMB Budget",
    description:
      "Shared touch budget for SMB accounts. 6 weekly touches, 4 hour cooldown.",
    type: "budget",
    category: "communication-budgets",
    scope: "tier = Tier 3",
    status: "active",
    enforcement: "block",
    appliedTo: "612 accounts",
    triggered7d: 432,
    lastModified: "2026-04-12",
    rules: [
      "IF record.tier == 'Tier 3'",
      "AND record.touchesThisWeek >= 6 OR record.touchesToday >= 1",
      "AND now - record.lastTouchAt < 240m",
      "THEN decision = NO_GO (budget exhausted)",
    ],
    budget: {
      weeklyTouches: 6,
      dailyTouches: 1,
      cooldownMinutes: 240,
      channelCaps: [
        { channel: "Email", cap: 1, period: "per day" },
        { channel: "LinkedIn", cap: 1, period: "per week" },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Policy Builder — condition options, version history, simulation results

export type ConditionField = {
  id: string;
  label: string;
  group: "Record" | "Action" | "Requester" | "Context";
  operators: string[];
  values?: string[];
};

export const CONDITION_FIELDS: ConditionField[] = [
  {
    id: "record.tier",
    label: "record.tier",
    group: "Record",
    operators: ["==", "!=", "IN"],
    values: ["Tier 1", "Tier 2", "Tier 3", "Unranked"],
  },
  {
    id: "record.lifecycle",
    label: "record.lifecycle",
    group: "Record",
    operators: ["==", "!=", "IN"],
    values: ["Lead", "MQL", "SQL", "Opportunity", "Customer", "Churned"],
  },
  {
    id: "record.openOpp.stage",
    label: "record.openOpp.stage",
    group: "Record",
    operators: ["==", "!=", "IN", "IS NOT NULL"],
    values: [
      "Discovery",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ],
  },
  {
    id: "record.pod",
    label: "record.pod",
    group: "Record",
    operators: ["==", "!=", "LIKE"],
    values: ["AMER East", "AMER West", "EMEA North", "EMEA South", "APAC"],
  },
  {
    id: "record.activeSequence",
    label: "record.activeSequence",
    group: "Record",
    operators: ["IS NULL", "IS NOT NULL"],
  },
  {
    id: "action.category",
    label: "action.category",
    group: "Action",
    operators: ["==", "!=", "IN"],
    values: ["outbound", "research", "scheduling", "enrichment", "internal"],
  },
  {
    id: "action.channel",
    label: "action.channel",
    group: "Action",
    operators: ["==", "!=", "IN"],
    values: ["email", "linkedin", "phone", "sms", "in-app"],
  },
  {
    id: "action.type",
    label: "action.type",
    group: "Action",
    operators: ["==", "!="],
    values: [
      "send_email",
      "add_to_sequence",
      "schedule_meeting",
      "post_comment",
      "enrich_contact",
    ],
  },
  {
    id: "requester.kind",
    label: "requester.kind",
    group: "Requester",
    operators: ["==", "!=", "IN"],
    values: [
      "ai-sdr",
      "intent",
      "scheduling",
      "enrichment",
      "research",
      "internal",
    ],
  },
  {
    id: "local_time",
    label: "local_time",
    group: "Context",
    operators: ["IN", "NOT IN"],
    values: ["08:00–18:00", "18:00–08:00", "09:00–17:00 weekdays"],
  },
];

export type ScopeFacet = {
  key: "tier" | "lifecycle" | "pod" | "vertical";
  label: string;
  options: string[];
};

export const SCOPE_FACETS: ScopeFacet[] = [
  {
    key: "tier",
    label: "Tier",
    options: ["Tier 1", "Tier 2", "Tier 3", "Unranked"],
  },
  {
    key: "lifecycle",
    label: "Lifecycle",
    options: ["Lead", "MQL", "SQL", "Opportunity", "Customer", "Churned"],
  },
  {
    key: "pod",
    label: "Pod / Region",
    options: ["AMER East", "AMER West", "EMEA North", "EMEA South", "APAC"],
  },
  {
    key: "vertical",
    label: "Vertical",
    options: ["FinServ", "Healthcare", "Tech", "Retail", "Manufacturing"],
  },
];

export type PolicyVersion = {
  version: number;
  timestamp: string;
  author: string;
  authorRole: string;
  summary: string;
  rules: string[];
};

export const POLICY_VERSIONS: { [policyId: string]: PolicyVersion[] } = {
  pol_ent_approval: [
    {
      version: 4,
      timestamp: "2026-04-18 14:22 PT",
      author: "Mike Chen",
      authorRole: "RevOps Mgr",
      summary: "Tightened to Negotiation + Proposal only (was: any open opp).",
      rules: [
        "IF record.tier == 'Tier 1' AND record.openOpp.stage IN ('Negotiation','Proposal')",
        "AND action.category == 'outbound'",
        "THEN decision = REDIRECT to owner (Slack DM + dashboard review)",
      ],
    },
    {
      version: 3,
      timestamp: "2026-03-09 10:11 PT",
      author: "Mike Chen",
      authorRole: "RevOps Mgr",
      summary: "Added dashboard-review side-effect to redirect.",
      rules: [
        "IF record.tier == 'Tier 1' AND record.openOpp.stage IS NOT NULL",
        "AND action.category == 'outbound'",
        "THEN decision = REDIRECT to owner (Slack DM + dashboard review)",
      ],
    },
    {
      version: 2,
      timestamp: "2026-02-14 09:45 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Switched enforcement from BLOCK to REDIRECT.",
      rules: [
        "IF record.tier == 'Tier 1' AND record.openOpp.stage IS NOT NULL",
        "AND action.category == 'outbound'",
        "THEN decision = REDIRECT to owner",
      ],
    },
    {
      version: 1,
      timestamp: "2026-01-22 16:08 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Initial enterprise approval gate.",
      rules: [
        "IF record.tier == 'Tier 1' AND record.openOpp.stage IS NOT NULL",
        "AND action.category == 'outbound'",
        "THEN decision = NO_GO",
      ],
    },
  ],
  pol_quiet_hours: [
    {
      version: 3,
      timestamp: "2026-03-22 11:02 PT",
      author: "Mike Chen",
      authorRole: "RevOps Mgr",
      summary: "Narrowed window to local 08:00–18:00 (was: 09:00–17:00).",
      rules: [
        "IF record.pod LIKE 'EMEA%' AND local_time NOT IN (08:00–18:00)",
        "THEN decision = WAIT until next business hour",
      ],
    },
    {
      version: 2,
      timestamp: "2026-02-01 13:30 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Switched WAIT to honor next-business-hour vs. drop.",
      rules: [
        "IF record.pod LIKE 'EMEA%' AND local_time NOT IN (09:00–17:00)",
        "THEN decision = WAIT until next business hour",
      ],
    },
    {
      version: 1,
      timestamp: "2026-01-12 08:14 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Initial EMEA quiet hours.",
      rules: [
        "IF record.pod LIKE 'EMEA%' AND local_time NOT IN (09:00–17:00)",
        "THEN decision = NO_GO",
      ],
    },
  ],
  pol_sequence_order: [
    {
      version: 2,
      timestamp: "2026-02-09 15:50 PT",
      author: "Mike Chen",
      authorRole: "RevOps Mgr",
      summary: "Added cross-agent guard.",
      rules: [
        "IF record.activeSequence IS NOT NULL AND action.type == 'add_to_sequence'",
        "AND requester.agentId != record.activeSequence.agentId",
        "THEN decision = NO_GO",
      ],
    },
    {
      version: 1,
      timestamp: "2026-01-08 09:00 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Initial single-sequence lock.",
      rules: [
        "IF record.activeSequence IS NOT NULL AND action.type == 'add_to_sequence'",
        "THEN decision = NO_GO",
      ],
    },
  ],
  pol_channel_priority: [
    {
      version: 1,
      timestamp: "2026-04-02 10:18 PT",
      author: "Mike Chen",
      authorRole: "RevOps Mgr",
      summary: "Initial CSM channel priority.",
      rules: [
        "IF record.lifecycle == 'Customer' AND action.channel == 'email'",
        "AND requester.kind IN ('ai-sdr','intent')",
        "THEN decision = REDIRECT to CSM",
      ],
    },
  ],
  pol_meeting_exclusive: [
    {
      version: 1,
      timestamp: "2026-01-11 14:00 PT",
      author: "Jen Park",
      authorRole: "VP RevOps",
      summary: "Initial booking-lock exclusivity.",
      rules: [
        "IF action.type == 'schedule_meeting' AND booking_lock_exists(record.id, ttl=240s)",
        "AND requester.agentId != lock.holder",
        "THEN decision = WAIT",
      ],
    },
  ],
};

export type SimulationResult = {
  windowDays: number;
  evaluated: number;
  flips: number;
  aesAffected: number;
  recordsAffected: number;
  before: { GO: number; NO_GO: number; WAIT: number; REDIRECT: number };
  after: { GO: number; NO_GO: number; WAIT: number; REDIRECT: number };
  sampleFlips: Array<{
    record: string;
    owner: string;
    agent: string;
    from: "GO" | "NO_GO" | "WAIT" | "REDIRECT";
    to: "GO" | "NO_GO" | "WAIT" | "REDIRECT";
    reason: string;
  }>;
};

export const SIMULATION_RESULTS: { [policyId: string]: SimulationResult } = {
  pol_ent_approval: {
    windowDays: 7,
    evaluated: 18_412,
    flips: 87,
    aesAffected: 12,
    recordsAffected: 64,
    before: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
    after: { GO: 14_823, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 561 },
    sampleFlips: [
      {
        record: "Convex · Acme Industries",
        owner: "Mike Chen",
        agent: "Warmly",
        from: "GO",
        to: "REDIRECT",
        reason: "Tier 1 + Negotiation stage → owner DM",
      },
      {
        record: "Convex · Helix Bio",
        owner: "Priya Shah",
        agent: "11x · Alice",
        from: "GO",
        to: "REDIRECT",
        reason: "Tier 1 + Proposal stage → owner DM",
      },
      {
        record: "Convex · Northwind Trading",
        owner: "Diego Alvarez",
        agent: "Regie.ai",
        from: "GO",
        to: "REDIRECT",
        reason: "Tier 1 + Negotiation stage → owner DM",
      },
      {
        record: "Convex · Globex Corp",
        owner: "Mike Chen",
        agent: "Clay",
        from: "GO",
        to: "REDIRECT",
        reason: "Tier 1 + Proposal stage → owner DM",
      },
      {
        record: "Convex · Stark Holdings",
        owner: "Sarah Lee",
        agent: "OneMind",
        from: "GO",
        to: "REDIRECT",
        reason: "Tier 1 + Negotiation stage → owner DM",
      },
    ],
  },
  pol_quiet_hours: {
    windowDays: 7,
    evaluated: 18_412,
    flips: 412,
    aesAffected: 28,
    recordsAffected: 318,
    before: { GO: 15_322, NO_GO: 1_428, WAIT: 1_188, REDIRECT: 474 },
    after: { GO: 14_910, NO_GO: 1_428, WAIT: 1_600, REDIRECT: 474 },
    sampleFlips: [
      {
        record: "Convex · Banque Lyon",
        owner: "Camille Rousseau",
        agent: "11x · Alice",
        from: "GO",
        to: "WAIT",
        reason: "EMEA + 21:14 local → next business hour",
      },
      {
        record: "Convex · Siemens Health",
        owner: "Anders Vogel",
        agent: "Regie.ai",
        from: "GO",
        to: "WAIT",
        reason: "EMEA + 22:30 local → next business hour",
      },
      {
        record: "Convex · Holberton SAS",
        owner: "Camille Rousseau",
        agent: "Warmly",
        from: "GO",
        to: "WAIT",
        reason: "EMEA + 19:42 local → next business hour",
      },
    ],
  },
  pol_sequence_order: {
    windowDays: 7,
    evaluated: 18_412,
    flips: 238,
    aesAffected: 34,
    recordsAffected: 184,
    before: { GO: 15_148, NO_GO: 1_602, WAIT: 1_188, REDIRECT: 474 },
    after: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
    sampleFlips: [
      {
        record: "Convex · Acme Industries",
        owner: "Mike Chen",
        agent: "Regie.ai",
        from: "GO",
        to: "NO_GO",
        reason: "11x already owns active sequence",
      },
    ],
  },
  pol_channel_priority: {
    windowDays: 7,
    evaluated: 18_412,
    flips: 61,
    aesAffected: 8,
    recordsAffected: 47,
    before: { GO: 14_971, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 413 },
    after: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
    sampleFlips: [
      {
        record: "Convex · Wayne Enterprises",
        owner: "Sasha Patel · CSM",
        agent: "11x · Alice",
        from: "GO",
        to: "REDIRECT",
        reason: "Customer lifecycle + email → CSM owns thread",
      },
    ],
  },
  pol_meeting_exclusive: {
    windowDays: 7,
    evaluated: 18_412,
    flips: 44,
    aesAffected: 11,
    recordsAffected: 38,
    before: { GO: 14_954, NO_GO: 1_840, WAIT: 1_144, REDIRECT: 474 },
    after: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
    sampleFlips: [
      {
        record: "Convex · Helix Bio",
        owner: "Priya Shah",
        agent: "OneMind",
        from: "GO",
        to: "WAIT",
        reason: "Booking lock held by Qualified (180s remaining)",
      },
    ],
  },
};

export const NEW_POLICY_SIMULATION: SimulationResult = {
  windowDays: 7,
  evaluated: 18_412,
  flips: 0,
  aesAffected: 0,
  recordsAffected: 0,
  before: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
  after: { GO: 14_910, NO_GO: 1_840, WAIT: 1_188, REDIRECT: 474 },
  sampleFlips: [],
};

// ---------------------------------------------------------------------------
// Communication Budgets — now expressed as Policy entries with category
// "communication-budgets". This shim is kept for any code that still reaches
// for the old BUDGETS array; it is derived from POLICIES so a single edit
// updates everywhere.

export type BudgetTier = {
  name: string;
  weeklyTouches: number;
  dailyTouches: number;
  cooldownMinutes: number;
  channelCaps: ChannelCap[];
};

export const BUDGET_POLICIES: Policy[] = POLICIES.filter(
  (p) => p.category === "communication-budgets" && p.budget,
);

export const BUDGETS: BudgetTier[] = BUDGET_POLICIES.filter(
  (p) => p.budget,
).map((p) => ({
  name: p.name,
  weeklyTouches: p.budget!.weeklyTouches,
  dailyTouches: p.budget!.dailyTouches,
  cooldownMinutes: p.budget!.cooldownMinutes,
  channelCaps: p.budget!.channelCaps,
}));

// ---------------------------------------------------------------------------
// Collisions

export type Collision = {
  id: string;
  detectedAt: string;
  recordId: string;
  agentA: string;
  agentB: string;
  type: "overlap" | "lock-contention" | "redundant" | "cooldown";
  resolution: string;
  winner?: string;
  latencyMs: number;
};

export const COLLISIONS: Collision[] = [
  {
    id: "col_01",
    detectedAt: "2 min ago",
    recordId: "rec_jane_bigcorp",
    agentA: "agt_11x_alice",
    agentB: "agt_warmly_visitor",
    type: "cooldown",
    resolution: "11x deferred — Warmly touched 11 min ago",
    winner: "agt_warmly_visitor",
    latencyMs: 8,
  },
  {
    id: "col_02",
    detectedAt: "6 min ago",
    recordId: "rec_mike_company",
    agentA: "agt_11x_alice",
    agentB: "agt_onemind_sched",
    type: "lock-contention",
    resolution: "OneMind holds booking lock → 11x WAIT",
    winner: "agt_onemind_sched",
    latencyMs: 6,
  },
  {
    id: "col_03",
    detectedAt: "14 min ago",
    recordId: "rec_sarah_ent",
    agentA: "agt_11x_alice",
    agentB: "agt_clay_enrich",
    type: "redundant",
    resolution: "Clay enrichment allowed (read-only) + 11x GO",
    latencyMs: 7,
  },
  {
    id: "col_04",
    detectedAt: "22 min ago",
    recordId: "rec_jane_bigcorp",
    agentA: "agt_warmly_visitor",
    agentB: "agt_zi_signals",
    type: "overlap",
    resolution: "ZoomInfo notify allowed; Warmly auto-chat redirected to owner",
    winner: "agt_zi_signals",
    latencyMs: 9,
  },
  {
    id: "col_05",
    detectedAt: "38 min ago",
    recordId: "rec_emma_tech",
    agentA: "agt_rev_outbound",
    agentB: "agt_regie_ai",
    type: "overlap",
    resolution: "Sequence lock held by Convex Outbound → Regie NO_GO",
    winner: "agt_rev_outbound",
    latencyMs: 5,
  },
];

// ---------------------------------------------------------------------------
// Scheduling

export type Meeting = {
  id: string;
  recordName: string;
  company: string;
  bookedBy: string;
  assignedTo: string;
  when: string;
  duration: string;
  source: string;
  status: "confirmed" | "pending" | "rescheduled";
};

export const MEETINGS: Meeting[] = [
  {
    id: "mtg_1",
    recordName: "Jane Doe",
    company: "BigCorp",
    bookedBy: "OneMind Scheduler",
    assignedTo: "Mike Chen",
    when: "Tue 2:00 PM",
    duration: "30m",
    source: "Round-robin pool 'EMEA-Ent'",
    status: "confirmed",
  },
  {
    id: "mtg_2",
    recordName: "Mike Rodriguez",
    company: "Company Inc",
    bookedBy: "OneMind Scheduler",
    assignedTo: "James Park",
    when: "Tue 3:30 PM",
    duration: "45m",
    source: "Direct assignment",
    status: "confirmed",
  },
  {
    id: "mtg_3",
    recordName: "Emma Walsh",
    company: "Tech Co",
    bookedBy: "11x Alice",
    assignedTo: "Priya Nair",
    when: "Wed 11:00 AM",
    duration: "30m",
    source: "Round-robin pool 'EMEA-SDR'",
    status: "pending",
  },
  {
    id: "mtg_4",
    recordName: "Sarah Williams",
    company: "Enterprise Co",
    bookedBy: "Convex Outbound",
    assignedTo: "Tom Anderson",
    when: "Wed 4:00 PM",
    duration: "30m",
    source: "Owner lookup",
    status: "confirmed",
  },
  {
    id: "mtg_5",
    recordName: "Lena Okafor",
    company: "Atlas Tech",
    bookedBy: "OneMind Scheduler",
    assignedTo: "Lisa Park",
    when: "Thu 10:00 AM",
    duration: "60m",
    source: "QBR — direct",
    status: "rescheduled",
  },
];

// ---------------------------------------------------------------------------
// Attribution

export type AttributionMethod = "first-touch" | "linear" | "shapley";

export type AgentAttribution = {
  agentId: string;
  meetings: number;
  // Per-method dollar splits (in thousands of dollars, demo numbers).
  // First-touch concentrates credit on early-funnel agents.
  // Shapley spreads it more evenly. Linear sits between.
  pipelineByMethod: { [K in AttributionMethod]: number };
  revenueByMethod: { [K in AttributionMethod]: number };
  winRate: number;
  avgCycleDays: number;
};

export const ATTRIBUTION: AgentAttribution[] = [
  {
    agentId: "agt_11x_alice",
    meetings: 68,
    pipelineByMethod: {
      "first-touch": 2680, // $2.68M — outbound = first-touch heavy
      linear: 2100,
      shapley: 1820,
    },
    revenueByMethod: {
      "first-touch": 540,
      linear: 420,
      shapley: 360,
    },
    winRate: 0.31,
    avgCycleDays: 42,
  },
  {
    agentId: "agt_onemind_sched",
    meetings: 34,
    pipelineByMethod: {
      "first-touch": 410, // schedulers rarely first-touch
      linear: 980,
      shapley: 1240,
    },
    revenueByMethod: {
      "first-touch": 90,
      linear: 210,
      shapley: 280,
    },
    winRate: 0.29,
    avgCycleDays: 38,
  },
  {
    agentId: "agt_warmly_visitor",
    meetings: 21,
    pipelineByMethod: {
      "first-touch": 820, // visitor intent often surfaces first
      linear: 640,
      shapley: 540,
    },
    revenueByMethod: {
      "first-touch": 160,
      linear: 120,
      shapley: 100,
    },
    winRate: 0.26,
    avgCycleDays: 51,
  },
  {
    agentId: "agt_rev_outbound",
    meetings: 14,
    pipelineByMethod: {
      "first-touch": 240,
      linear: 380,
      shapley: 460,
    },
    revenueByMethod: {
      "first-touch": 60,
      linear: 90,
      shapley: 110,
    },
    winRate: 0.33,
    avgCycleDays: 36,
  },
  {
    agentId: "agt_clay_enrich",
    meetings: 0,
    pipelineByMethod: {
      "first-touch": 0, // enrichment is never first or last touch
      linear: 70,
      shapley: 180,
    },
    revenueByMethod: {
      "first-touch": 0,
      linear: 18,
      shapley: 48,
    },
    winRate: 0.0,
    avgCycleDays: 0,
  },
  {
    agentId: "agt_zi_signals",
    meetings: 5,
    pipelineByMethod: {
      "first-touch": 50,
      linear: 110,
      shapley: 160,
    },
    revenueByMethod: {
      "first-touch": 0,
      linear: 0,
      shapley: 12,
    },
    winRate: 0.0,
    avgCycleDays: 0,
  },
];

// Counterfactual / methodology — three pre-computed worlds.
// "Matched-holdout" baseline is a CUPED-style synthetic control built from
// pre-period account features (firmographic, intent, prior-quarter pipeline).
// All numbers are demo-only.
export type AttributionCounterfactual = {
  attributedPipelineK: number; // sum across agents
  baselinePipelineK: number; // matched-holdout estimate
  liftK: number;
  liftPct: number;
  pValue: string; // formatted "p<0.05" / "p<0.01"
  confidenceLow: number; // K
  confidenceHigh: number; // K
  attributedRevenueK: number;
  baselineRevenueK: number;
  blendedWinRate: number;
  baselineWinRate: number;
  cycleDays: number;
  baselineCycleDays: number;
};

export const ATTRIBUTION_COUNTERFACTUAL: {
  [K in AttributionMethod]: AttributionCounterfactual;
} = {
  "first-touch": {
    attributedPipelineK: 4200,
    baselinePipelineK: 3140,
    liftK: 1060,
    liftPct: 0.337,
    pValue: "p<0.05",
    confidenceLow: 720,
    confidenceHigh: 1400,
    attributedRevenueK: 850,
    baselineRevenueK: 640,
    blendedWinRate: 0.28,
    baselineWinRate: 0.24,
    cycleDays: 42,
    baselineCycleDays: 53,
  },
  linear: {
    attributedPipelineK: 4280,
    baselinePipelineK: 2940,
    liftK: 1340,
    liftPct: 0.456,
    pValue: "p<0.01",
    confidenceLow: 970,
    confidenceHigh: 1710,
    attributedRevenueK: 858,
    baselineRevenueK: 612,
    blendedWinRate: 0.28,
    baselineWinRate: 0.24,
    cycleDays: 42,
    baselineCycleDays: 53,
  },
  shapley: {
    attributedPipelineK: 4400,
    baselinePipelineK: 2900,
    liftK: 1500,
    liftPct: 0.517,
    pValue: "p<0.01",
    confidenceLow: 1110,
    confidenceHigh: 1890,
    attributedRevenueK: 880,
    baselineRevenueK: 600,
    blendedWinRate: 0.28,
    baselineWinRate: 0.24,
    cycleDays: 42,
    baselineCycleDays: 53,
  },
};

export const ATTRIBUTION_STUDY = {
  windowDays: 90,
  treatedAccounts: 318,
  controlAccounts: 318,
  matchedFeatures: [
    "industry",
    "employee band",
    "ARR band",
    "tier",
    "prior-quarter pipeline",
    "intent decile",
  ],
  cohortStart: "2026-01-26",
  cohortEnd: "2026-04-25",
  controlSource: "Pre-Coordinator pods (US-East, EMEA-South) + holdout 10%",
  refreshedAt: "2026-04-26 06:00 UTC",
  inheritedFromAgp: "agp-app-v7 / experiment exp_coord_holdout_v3",
};

export const METHODOLOGY_NOTES: {
  [K in AttributionMethod]: {
    label: string;
    oneLiner: string;
    details: string;
  };
} = {
  "first-touch": {
    label: "First-touch",
    oneLiner: "100% credit to the first agent that surfaces the account.",
    details:
      "Concentrates credit on early-funnel agents (11x, Warmly). Strong for pipeline-creation accountability, weak for closing motion. Inherited from the legacy MarTech model — included for reconciliation with Marketing Ops.",
  },
  linear: {
    label: "Linear",
    oneLiner: "Equal credit across every agent that touched the account.",
    details:
      "Each agent on the path gets 1/n. Simple, defensible, neutral across funnel stage. Best when you want the table to read as 'which agents are on the winning paths' without weighting.",
  },
  shapley: {
    label: "Shapley (multi-touch)",
    oneLiner:
      "Game-theoretic credit based on each agent's marginal contribution.",
    details:
      "Computes the average marginal lift each agent adds across all permutations of touch sequences, against the matched-holdout baseline. Spreads credit toward agents that actually move conversion — schedulers, enrichment — that linear and first-touch under-report. Default for the board deck.",
  },
};

// ---------------------------------------------------------------------------
// Avoided-cost (collisions translated to pipeline protected)

export type AvoidedCostBreakdown = {
  collisionsBlocked: number;
  duplicateTouchesBlocked: number;
  prospectsRetained: number; // would-have-churned-from-fatigue
  pipelineProtectedK: number;
  revenueProtectedK: number;
  byPolicy: Array<{
    policyId: string;
    label: string;
    blocked: number;
    protectedK: number;
  }>;
};

export const AVOIDED_COST: AvoidedCostBreakdown = {
  collisionsBlocked: 142,
  duplicateTouchesBlocked: 487,
  prospectsRetained: 64,
  pipelineProtectedK: 680,
  revenueProtectedK: 142,
  byPolicy: [
    {
      policyId: "pol_ent_approval",
      label: "Tier-1 approval",
      blocked: 38,
      protectedK: 240,
    },
    {
      policyId: "pol_quiet_hours",
      label: "EMEA quiet hours",
      blocked: 41,
      protectedK: 110,
    },
    {
      policyId: "pol_seq_dedupe",
      label: "Sequence dedupe",
      blocked: 51,
      protectedK: 220,
    },
    {
      policyId: "pol_chan_cap",
      label: "Channel caps",
      blocked: 12,
      protectedK: 110,
    },
  ],
};

// ---------------------------------------------------------------------------
// Meeting quality — agent-booked vs AE-booked
// CRO board-deck ask: are agent-booked meetings the same quality as AE-booked?

export type MeetingQualityRow = {
  bookedBy: "Agent" | "AE";
  meetings: number;
  showRate: number;
  saoRate: number; // SAO conversion (sales accepted opportunity)
  stage2Rate: number; // % that reach stage-2 (Discovery → Proposal)
  closedWonRate: number;
  avgDealSizeK: number;
};

export const MEETING_QUALITY: MeetingQualityRow[] = [
  {
    bookedBy: "Agent",
    meetings: 142,
    showRate: 0.78,
    saoRate: 0.61,
    stage2Rate: 0.42,
    closedWonRate: 0.28,
    avgDealSizeK: 168,
  },
  {
    bookedBy: "AE",
    meetings: 96,
    showRate: 0.83,
    saoRate: 0.64,
    stage2Rate: 0.45,
    closedWonRate: 0.26,
    avgDealSizeK: 174,
  },
];

// ---------------------------------------------------------------------------
// Cost per opp across the agent stack
// CRO ask: what does each agent cost us per opp it produces?

export type AgentEconomics = {
  agentId: string;
  monthlyCostK: number; // license + usage in $K
  oppsCreated30d: number;
  costPerOppK: number; // monthlyCostK / oppsCreated30d, pre-computed
  pipelinePerDollar: number; // pipeline$ per $1 spend
};

export const AGENT_ECONOMICS: AgentEconomics[] = [
  {
    agentId: "agt_11x_alice",
    monthlyCostK: 18,
    oppsCreated30d: 41,
    costPerOppK: 0.439,
    pipelinePerDollar: 117,
  },
  {
    agentId: "agt_onemind_sched",
    monthlyCostK: 6,
    oppsCreated30d: 22,
    costPerOppK: 0.273,
    pipelinePerDollar: 163,
  },
  {
    agentId: "agt_warmly_visitor",
    monthlyCostK: 9,
    oppsCreated30d: 14,
    costPerOppK: 0.643,
    pipelinePerDollar: 71,
  },
  {
    agentId: "agt_rev_outbound",
    monthlyCostK: 4,
    oppsCreated30d: 9,
    costPerOppK: 0.444,
    pipelinePerDollar: 95,
  },
  {
    agentId: "agt_clay_enrich",
    monthlyCostK: 5,
    oppsCreated30d: 0,
    costPerOppK: 0,
    pipelinePerDollar: 14,
  },
  {
    agentId: "agt_zi_signals",
    monthlyCostK: 11,
    oppsCreated30d: 4,
    costPerOppK: 2.75,
    pipelinePerDollar: 10,
  },
];

// Recent outcomes
export const OUTCOMES = [
  {
    company: "Globex Systems",
    stage: "Closed Won",
    amount: "$240K",
    influencedBy: ["agt_11x_alice", "agt_onemind_sched"],
    days: 3,
  },
  {
    company: "Initech Partners",
    stage: "Closed Won",
    amount: "$120K",
    influencedBy: ["agt_warmly_visitor", "agt_rev_outbound"],
    days: 7,
  },
  {
    company: "Stark Industries",
    stage: "Negotiation",
    amount: "$480K",
    influencedBy: ["agt_11x_alice", "agt_clay_enrich", "agt_onemind_sched"],
    days: 12,
  },
  {
    company: "Hooli",
    stage: "Proposal",
    amount: "$180K",
    influencedBy: ["agt_zi_signals", "agt_rev_outbound"],
    days: 14,
  },
  {
    company: "Cyberdyne",
    stage: "Discovery",
    amount: "$64K",
    influencedBy: ["agt_11x_alice"],
    days: 2,
  },
];

// ---------------------------------------------------------------------------
// Partners

export type Partner = {
  name: string;
  slug: string;
  status: "connected" | "available" | "coming-soon";
  category: "AI SDR" | "Enrichment" | "Scheduling" | "Intent" | "Custom";
  description: string;
  agentsRegistered: number;
  logoColor: string;
  initials: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "11x",
    slug: "11x",
    status: "connected",
    category: "AI SDR",
    description: "Digital AI SDRs — Alice (outbound) and Julian (inbound).",
    agentsRegistered: 1,
    logoColor: "#111111",
    initials: "11",
  },
  {
    name: "Warmly",
    slug: "warmly",
    status: "connected",
    category: "Intent",
    description: "Signal-based account intent and website visitor chat.",
    agentsRegistered: 1,
    logoColor: "#f59e0b",
    initials: "Wa",
  },
  {
    name: "Clay",
    slug: "clay",
    status: "connected",
    category: "Enrichment",
    description: "Data enrichment and waterfall research.",
    agentsRegistered: 1,
    logoColor: "#dc2626",
    initials: "Cl",
  },
  {
    name: "OneMind",
    slug: "onemind",
    status: "connected",
    category: "Scheduling",
    description: "Agentic meeting scheduling across round-robin pools.",
    agentsRegistered: 1,
    logoColor: "#7c3aed",
    initials: "OM",
  },
  {
    name: "ZoomInfo",
    slug: "zoominfo",
    status: "connected",
    category: "Intent",
    description: "Buying group signals, intent data, firmographics.",
    agentsRegistered: 1,
    logoColor: "#0ea5e9",
    initials: "ZI",
  },
  {
    name: "Regie.ai",
    slug: "regie",
    status: "connected",
    category: "AI SDR",
    description: "AI-generated sequences and content.",
    agentsRegistered: 1,
    logoColor: "#0891b2",
    initials: "Re",
  },
  {
    name: "Qualified",
    slug: "qualified",
    status: "connected",
    category: "AI SDR",
    description: "Piper — AI SDR embedded in the website.",
    agentsRegistered: 1,
    logoColor: "#16a34a",
    initials: "Qp",
  },
  {
    name: "Outreach",
    slug: "outreach",
    status: "available",
    category: "AI SDR",
    description: "Sequenced outbound platform.",
    agentsRegistered: 0,
    logoColor: "#eab308",
    initials: "Ou",
  },
  {
    name: "Apollo",
    slug: "apollo",
    status: "available",
    category: "AI SDR",
    description: "Data + outbound engagement.",
    agentsRegistered: 0,
    logoColor: "#6366f1",
    initials: "Ap",
  },
  {
    name: "Custom / SDK",
    slug: "custom",
    status: "connected",
    category: "Custom",
    description: "Register your own agents via the Partner SDK or MCP server.",
    agentsRegistered: 1,
    logoColor: "#4a4bd6",
    initials: "SDK",
  },
];

// ---------------------------------------------------------------------------
// MCP tools

export const MCP_TOOLS = [
  {
    name: "preflight",
    description: "Check whether an action is authorized before executing it.",
    params: ["agent_id", "action", "record_identifier", "context?"],
  },
  {
    name: "resolve_record",
    description:
      "Resolve any identifier (email, phone, LinkedIn URL) to a canonical record.",
    params: ["identifier", "identifier_type"],
  },
  {
    name: "get_ownership",
    description: "Look up the owner, pod, and routing assignment for a record.",
    params: ["record_id"],
  },
  {
    name: "get_availability",
    description: "Fetch available meeting slots for a pool or owner.",
    params: ["pool_id | owner_id", "window", "duration"],
  },
  {
    name: "book_meeting",
    description: "Book a meeting with exactly-once semantics.",
    params: ["slot_id", "record_id", "attendees[]"],
  },
  {
    name: "log_action",
    description: "Append an action to the immutable ledger.",
    params: ["agent_id", "action", "record_id", "outcome"],
  },
  {
    name: "get_budget",
    description: "Inspect remaining communication budget for a record.",
    params: ["record_id"],
  },
];

// ---------------------------------------------------------------------------
// Owner Slack DMs — what the AE sees when Coordinator holds an agent action.
// Buyer-review patch #1 (Tier-1): "Rep-view card on /records/[id]"
//
// Each message corresponds to a decision the Coordinator made on the rep's
// behalf. Coordinator only ever DMs the owner when an *agent* action is held,
// redirected, or waited — rep-initiated actions are never gated. The DM is
// framed as protection ("I held it — your move"), not surveillance.
//
// The Slack mock renders these as Block-Kit-style cards with action buttons.

export type OwnerSlackAction =
  | "approve"
  | "hold"
  | "handoff"
  | "view-record"
  | "snooze";

export type OwnerSlackMessage = {
  id: string;
  decisionId: string; // ties back to PreflightEntry.id
  recordId: string;
  agentId: string;
  decision: Decision;
  channel: string; // attempted channel: email / chat / linkedin / meeting
  policyId: string; // policy that fired
  policyLabel: string; // human-readable policy name
  secondsAgo: number; // for relative timestamp
  absoluteTime: string; // "Today at 2:18 PM"
  headline: string; // bold first line, plain-language framing
  body: string; // 1-2 sentence context
  context?: string; // optional inline italic context (e.g. agent's draft preview)
  actions: OwnerSlackAction[];
  unread?: boolean;
  resolved?: "approved" | "held" | "handed-off"; // if rep already acted
};

export const OWNER_SLACK_MESSAGES_BY_RECORD: {
  [recordId: string]: OwnerSlackMessage[];
} = {
  rec_jane_bigcorp: [
    {
      id: "msg_jane_01",
      decisionId: "req_2H98",
      recordId: "rec_jane_bigcorp",
      agentId: "agt_warmly_visitor",
      decision: "REDIRECT",
      channel: "chat",
      policyId: "pol_ent_approval",
      policyLabel: "Enterprise Approval Gate",
      secondsAgo: 172,
      absoluteTime: "Today at 2:18 PM",
      headline: "Warmly wanted to chat Jane Doe. I held it — your move.",
      body: "Open opp in Negotiation ($180K) — auto-chat would have stepped on your thread. Approve to let it run, hand off to me to take it directly, or hold and Warmly will defer for 24h.",
      context:
        'Warmly draft: "Hey Jane — saw you back on the pricing page. Want me to grab a slot with Mike?"',
      actions: ["approve", "handoff", "hold"],
      unread: true,
    },
    {
      id: "msg_jane_02",
      decisionId: "req_jane_regie",
      recordId: "rec_jane_bigcorp",
      agentId: "agt_regie_ai",
      decision: "NO_GO",
      channel: "email",
      policyId: "pol_sequence_order",
      policyLabel: "Single-Sequence Lock",
      secondsAgo: 1320,
      absoluteTime: "Today at 1:54 PM",
      headline: "Regie.ai tried to start a 6-step outbound. I blocked it.",
      body: "11x Alice already owns the active sequence on Jane. I dropped Regie's send so Jane doesn't get two parallel cadences. No action needed — flagging so you know.",
      actions: ["view-record", "snooze"],
      resolved: "held",
    },
    {
      id: "msg_jane_03",
      decisionId: "req_2H9E",
      recordId: "rec_jane_bigcorp",
      agentId: "agt_11x_alice",
      decision: "WAIT",
      channel: "email",
      policyId: "pol_ent_approval",
      policyLabel: "Cooldown · 15 min",
      secondsAgo: 2400,
      absoluteTime: "Today at 1:38 PM",
      headline: "11x Alice paused — you touched Jane 11 minutes ago.",
      body: "Holding her email until 2:28 PM so the cadence doesn't double-up on yours. Approve to send now, or let it auto-release.",
      actions: ["approve", "hold"],
      unread: false,
    },
    {
      id: "msg_jane_04",
      decisionId: "req_jane_onemind_dbl",
      recordId: "rec_jane_bigcorp",
      agentId: "agt_onemind_sched",
      decision: "WAIT",
      channel: "meeting",
      policyId: "pol_meeting_exclusive",
      policyLabel: "Meeting Booking Exclusivity",
      secondsAgo: 5400,
      absoluteTime: "Today at 12:48 PM",
      headline: "OneMind almost double-booked Jane. Booking lock held it.",
      body: "Qualified Piper had a 4-min booking lock active when OneMind tried to schedule. OneMind is queued — if Piper drops the lock, OneMind picks it up.",
      actions: ["view-record"],
      resolved: "held",
    },
    {
      id: "msg_jane_05",
      decisionId: "req_jane_clay",
      recordId: "rec_jane_bigcorp",
      agentId: "agt_clay_enrich",
      decision: "REDIRECT",
      channel: "linkedin",
      policyId: "pol_channel_priority",
      policyLabel: "Channel Priority — AE owns Tier-1",
      secondsAgo: 9700,
      absoluteTime: "Today at 11:36 AM",
      headline: "Clay tried to LinkedIn-DM Jane. Routed to you instead.",
      body: "Tier-1 + open opp — agent LinkedIn DMs go through the owner. I drafted a handoff in your inbox. Send as-is or edit.",
      actions: ["handoff", "hold"],
      resolved: "approved",
    },
  ],
  rec_mike_company: [
    {
      id: "msg_mike_01",
      decisionId: "req_2H9B",
      recordId: "rec_mike_company",
      agentId: "agt_11x_alice",
      decision: "WAIT",
      channel: "meeting",
      policyId: "pol_meeting_exclusive",
      policyLabel: "Meeting Booking Exclusivity",
      secondsAgo: 63,
      absoluteTime: "Today at 2:20 PM",
      headline: "11x Alice tried to schedule with Mike — OneMind has the lock.",
      body: "OneMind is mid-booking flow with the round-robin pool (TTL 4m). Holding 11x until OneMind drops the lock or it expires.",
      actions: ["view-record"],
      unread: true,
    },
    {
      id: "msg_mike_02",
      decisionId: "req_2H91",
      recordId: "rec_mike_company",
      agentId: "agt_warmly_visitor",
      decision: "NO_GO",
      channel: "email",
      policyId: "pol_ent_approval",
      policyLabel: "Tier-1 Outbound Authorization",
      secondsAgo: 540,
      absoluteTime: "Today at 2:11 PM",
      headline: "Warmly is not authorized to email Tier-1 accounts.",
      body: "Blocked at the gate — Warmly's declared actions don't include email on Tier-1 records. No action needed.",
      actions: ["view-record"],
      resolved: "held",
    },
  ],
  rec_emma_tech: [
    {
      id: "msg_emma_01",
      decisionId: "req_2H93",
      recordId: "rec_emma_tech",
      agentId: "agt_rev_outbound",
      decision: "REDIRECT",
      channel: "email",
      policyId: "pol_sequence_order",
      policyLabel: "Single-Sequence Lock",
      secondsAgo: 422,
      absoluteTime: "Today at 2:13 PM",
      headline: "Convex Outbound wanted to add Emma to a new nurture.",
      body: "She's already in nurture-q2-emea. Sent it to Priya for review instead of dropping it on the floor.",
      actions: ["view-record", "handoff"],
      unread: true,
    },
  ],
  rec_john_startup: [
    {
      id: "msg_john_01",
      decisionId: "req_2H9D",
      recordId: "rec_john_startup",
      agentId: "agt_warmly_visitor",
      decision: "NO_GO",
      channel: "chat",
      policyId: "pol_chan_cap",
      policyLabel: "Channel cap · 9/9 weekly",
      secondsAgo: 28,
      absoluteTime: "Today at 2:21 PM",
      headline: "Warmly hit the weekly touch budget on John (9/9).",
      body: "Holding all outbound until next Monday. Override if you have new context — otherwise we'll let the cooldown ride.",
      actions: ["approve", "hold"],
      unread: true,
    },
  ],
  // rec_sarah_ent and rec_lena_atlas intentionally omitted — render as
  // "quiet week, nothing held" empty state to show breadth.
};

// Per-decision rep-impact framing — flips the timeline copy from
// agent-centric ("Warmly REDIRECTed") to owner-centric ("Held on Mike's
// behalf"). Only attached to decisions that affect the rep's surface.
export const REP_IMPACT_BY_DECISION: { [decisionId: string]: string } = {
  req_2H9E: "Held on Mike's behalf — your last touch was 11 min ago.",
  req_2H98: "Routed to Mike — auto-chat held while owner chooses.",
  req_2H95: "Silent enrichment — never reaches Mike's inbox.",
  req_2H9B: "Held on James's behalf — booking lock protects the slot.",
  req_2H9A: "Booked into James's pool — round-robin honored.",
  req_2H93: "Routed to Priya for review — protects existing nurture.",
  req_2H92: "Mike notified — buying-group signal, no auto-touch.",
  req_2H91: "Blocked at the gate — Warmly cannot email Tier-1.",
  req_2H9D: "Held on Sarah Johnson's behalf — weekly cap reached.",
  req_2H97: "Held — Regie running 59% NO_GO, throttled by the gate.",
  req_2H96: "Allowed — first touch this channel, within budget.",
  req_2H94: "Held on James's behalf — meeting pending, 24h quiet.",
  req_2H99: "Priya notified — intent signal, owner gets first look.",
  req_2H9F: "Allowed — internal CSM action on a customer record.",
  req_2H9C: "Silent enrichment — never reaches Tom's inbox.",
};

// ---------------------------------------------------------------------------
// AE-protection guarantee — the political insurance line.
// Surfaced as a persistent pill on /records/[id] in both views.
export const REP_GUARANTEE = {
  short: "AE actions are never blocked.",
  long: "Coordinator only governs agent traffic. Anything you initiate from Salesforce, your inbox, LinkedIn, or your sequencer always returns GO at the gate. Preflight cannot fire NO_GO on a rep-initiated action — that path is short-circuited at the policy layer.",
  policyId: "pol_rep_passthrough",
  policyLabel: "Rep Passthrough · pol_rep_passthrough",
  ruleSnippet: [
    "IF requester.kind == 'human' AND requester.userId == record.ownerId",
    "THEN decision = GO  // bypass all policy gates",
  ],
};

// ---------------------------------------------------------------------------
// Custom objects: Quotes & Orders

export type Quote = {
  id: string;
  number: string;
  account: string;
  accountSlug: string;
  primaryContact: string;
  amount: string;
  stage: "Draft" | "In Review" | "Pending Signature" | "Signed" | "Expired";
  ownerName: string;
  lastActivity: string;
  agentsActive: string[];
  conflicts7d: number;
};

export const QUOTES: Quote[] = [
  {
    id: "q_2026_0411",
    number: "Q-2026-0411",
    account: "BigCorp",
    accountSlug: "bigcorp",
    primaryContact: "Jane Doe",
    amount: "$184,000",
    stage: "Pending Signature",
    ownerName: "Mike Chen",
    lastActivity: "12 min ago",
    agentsActive: ["agt_convex_outbound", "agt_clay_enrich"],
    conflicts7d: 0,
  },
  {
    id: "q_2026_0412",
    number: "Q-2026-0412",
    account: "Atlas Tech",
    accountSlug: "atlas-tech",
    primaryContact: "Lena Okafor",
    amount: "$62,500",
    stage: "In Review",
    ownerName: "Lisa Park",
    lastActivity: "1 hr ago",
    agentsActive: ["agt_11x_alice", "agt_regie_seq"],
    conflicts7d: 1,
  },
  {
    id: "q_2026_0413",
    number: "Q-2026-0413",
    account: "Enterprise Co",
    accountSlug: "enterprise-co",
    primaryContact: "Sarah Williams",
    amount: "$420,000",
    stage: "Draft",
    ownerName: "Tom Anderson",
    lastActivity: "3 hr ago",
    agentsActive: ["agt_zoominfo_signals"],
    conflicts7d: 0,
  },
  {
    id: "q_2026_0414",
    number: "Q-2026-0414",
    account: "StartupIO",
    accountSlug: "startupio",
    primaryContact: "John Smith",
    amount: "$28,800",
    stage: "Signed",
    ownerName: "Sarah Johnson",
    lastActivity: "Yesterday",
    agentsActive: ["agt_qualified_piper"],
    conflicts7d: 0,
  },
  {
    id: "q_2026_0415",
    number: "Q-2026-0415",
    account: "Tech Co",
    accountSlug: "tech-co",
    primaryContact: "Emma Walsh",
    amount: "$96,400",
    stage: "Pending Signature",
    ownerName: "Priya Nair",
    lastActivity: "4 hr ago",
    agentsActive: ["agt_warmly_visitor", "agt_convex_outbound"],
    conflicts7d: 2,
  },
  {
    id: "q_2026_0416",
    number: "Q-2026-0416",
    account: "Company Inc",
    accountSlug: "company-inc",
    primaryContact: "Mike Rodriguez",
    amount: "$54,200",
    stage: "Expired",
    ownerName: "James Park",
    lastActivity: "8 days ago",
    agentsActive: [],
    conflicts7d: 0,
  },
];

export type Order = {
  id: string;
  number: string;
  account: string;
  accountSlug: string;
  amount: string;
  status:
    | "Provisioning"
    | "Active"
    | "Renewal Pending"
    | "Past Due"
    | "Cancelled";
  ownerName: string;
  startsOn: string;
  lastActivity: string;
  agentsActive: string[];
  conflicts7d: number;
};

export const ORDERS: Order[] = [
  {
    id: "o_2026_1018",
    number: "O-2026-1018",
    account: "BigCorp",
    accountSlug: "bigcorp",
    amount: "$184,000",
    status: "Provisioning",
    ownerName: "Mike Chen",
    startsOn: "May 1, 2026",
    lastActivity: "9 min ago",
    agentsActive: ["agt_convex_outbound"],
    conflicts7d: 0,
  },
  {
    id: "o_2026_1019",
    number: "O-2026-1019",
    account: "StartupIO",
    accountSlug: "startupio",
    amount: "$28,800",
    status: "Active",
    ownerName: "Sarah Johnson",
    startsOn: "Mar 14, 2026",
    lastActivity: "2 days ago",
    agentsActive: [],
    conflicts7d: 0,
  },
  {
    id: "o_2026_0921",
    number: "O-2026-0921",
    account: "Enterprise Co",
    accountSlug: "enterprise-co",
    amount: "$612,500",
    status: "Renewal Pending",
    ownerName: "Tom Anderson",
    startsOn: "Renews Jun 30, 2026",
    lastActivity: "30 min ago",
    agentsActive: ["agt_zoominfo_signals", "agt_clay_enrich"],
    conflicts7d: 1,
  },
  {
    id: "o_2026_0822",
    number: "O-2026-0822",
    account: "Atlas Tech",
    accountSlug: "atlas-tech",
    amount: "$48,000",
    status: "Past Due",
    ownerName: "Lisa Park",
    startsOn: "Started Feb 1, 2026",
    lastActivity: "Invoice 14d overdue",
    agentsActive: ["agt_regie_seq"],
    conflicts7d: 3,
  },
  {
    id: "o_2026_0723",
    number: "O-2026-0723",
    account: "Tech Co",
    accountSlug: "tech-co",
    amount: "$96,400",
    status: "Active",
    ownerName: "Priya Nair",
    startsOn: "Jan 8, 2026",
    lastActivity: "3 hr ago",
    agentsActive: ["agt_warmly_visitor"],
    conflicts7d: 0,
  },
  {
    id: "o_2026_0624",
    number: "O-2026-0624",
    account: "Company Inc",
    accountSlug: "company-inc",
    amount: "$54,200",
    status: "Cancelled",
    ownerName: "James Park",
    startsOn: "Cancelled Apr 10, 2026",
    lastActivity: "18 days ago",
    agentsActive: [],
    conflicts7d: 0,
  },
];

// ---------------------------------------------------------------------------
// Registered Actions (data-change watches)
//
// A registered action binds a (source, object, field) tuple. When the field
// changes on any record in scope, the change is recorded in the Action Ledger
// alongside the agent decisions — giving operators one view of "what
// happened" across both agent intent and underlying record state.

export type DataSourceKind =
  | "salesforce"
  | "hubspot"
  | "snowflake"
  | "gainsight"
  | "stripe"
  | "zendesk"
  | "segment";

export type DataSource = {
  id: string;
  kind: DataSourceKind;
  label: string; // human-friendly name, e.g. "Salesforce · Convex Prod"
  vendor: string;
  initials: string;
  color: string;
  status: "connected" | "degraded" | "disconnected";
  lastSyncedAt: string;
};

export const DATA_SOURCES: DataSource[] = [
  {
    id: "src_sf_prod",
    kind: "salesforce",
    label: "Salesforce · Convex Prod",
    vendor: "Salesforce",
    initials: "SF",
    color: "#00a1e0",
    status: "connected",
    lastSyncedAt: "12s ago",
  },
  {
    id: "src_hubspot",
    kind: "hubspot",
    label: "HubSpot · Marketing",
    vendor: "HubSpot",
    initials: "Hu",
    color: "#ff7a59",
    status: "connected",
    lastSyncedAt: "47s ago",
  },
  {
    id: "src_snowflake",
    kind: "snowflake",
    label: "Snowflake · CONVEX_DW",
    vendor: "Snowflake",
    initials: "Sn",
    color: "#29b5e8",
    status: "connected",
    lastSyncedAt: "3 min ago",
  },
  {
    id: "src_gainsight",
    kind: "gainsight",
    label: "Gainsight · CS",
    vendor: "Gainsight",
    initials: "Gs",
    color: "#fcb40a",
    status: "connected",
    lastSyncedAt: "1 min ago",
  },
  {
    id: "src_stripe",
    kind: "stripe",
    label: "Stripe · Billing",
    vendor: "Stripe",
    initials: "St",
    color: "#635bff",
    status: "connected",
    lastSyncedAt: "9 min ago",
  },
  {
    id: "src_zendesk",
    kind: "zendesk",
    label: "Zendesk · Support",
    vendor: "Zendesk",
    initials: "Zd",
    color: "#03363d",
    status: "degraded",
    lastSyncedAt: "22 min ago",
  },
];

export type RegisteredActionStatus = "active" | "paused";

export type RegisteredAction = {
  id: string;
  name: string;
  description: string;
  sourceId: string;
  object: string; // canonical object name in source (e.g. Opportunity)
  field: string; // field path (e.g. StageName)
  fieldLabel: string; // human-friendly name (e.g. "Stage")
  trigger: "any-change" | "enters" | "exits" | "crosses-threshold";
  watchValue?: string; // e.g. "Closed Won" for "enters"
  scope: string; // human description of which records are watched
  recordsInScope: number;
  observedActions: string[]; // tags, e.g. "policy:tier1", "ledger:append"
  fanout: string[]; // what happens on a change — slack, agent broadcast, ledger
  events7d: number;
  registeredBy: string;
  registeredAt: string;
  lastEventAt: string;
  status: RegisteredActionStatus;
};

export const REGISTERED_ACTIONS: RegisteredAction[] = [
  {
    id: "act_opp_stage",
    name: "Opportunity stage change",
    description:
      "Watch every Opportunity for a stage transition. Triggers downstream agents (handoff, contracting, CSM intro) and gets every change into the Action Ledger.",
    sourceId: "src_sf_prod",
    object: "Opportunity",
    field: "StageName",
    fieldLabel: "Stage",
    trigger: "any-change",
    scope: "All open opportunities",
    recordsInScope: 412,
    observedActions: ["preflight.stage_gate", "ledger.append"],
    fanout: [
      "Notify agent: Convex Outbound",
      "Slack #pipeline-moves",
      "Action Ledger",
    ],
    events7d: 87,
    registeredBy: "Mike Chen",
    registeredAt: "2026-02-14",
    lastEventAt: "2 min ago",
    status: "active",
  },
  {
    id: "act_account_status",
    name: "Account status change",
    description:
      "Watch Account.Status across customers and prospects. Used to gate outbound when an account becomes At-Risk or Churned.",
    sourceId: "src_sf_prod",
    object: "Account",
    field: "AccountStatus__c",
    fieldLabel: "Status",
    trigger: "any-change",
    scope: "Tier 1 + Tier 2 accounts",
    recordsInScope: 460,
    observedActions: ["policy.lifecycle_gate", "ledger.append"],
    fanout: ["Pause outbound agents", "Notify CSM owner", "Action Ledger"],
    events7d: 19,
    registeredBy: "Jen Park",
    registeredAt: "2026-01-09",
    lastEventAt: "11 min ago",
    status: "active",
  },
  {
    id: "act_opp_closed_won",
    name: "Opportunity → Closed Won",
    description:
      "Specifically the moment an Opportunity enters Closed Won. Kicks off CSM intro, billing handoff, and customer-marketing motion.",
    sourceId: "src_sf_prod",
    object: "Opportunity",
    field: "StageName",
    fieldLabel: "Stage",
    trigger: "enters",
    watchValue: "Closed Won",
    scope: "All opportunities",
    recordsInScope: 412,
    observedActions: ["agent.csm_intro", "agent.billing_handoff"],
    fanout: [
      "Provision CSM agent",
      "Stripe customer creation",
      "Action Ledger",
    ],
    events7d: 9,
    registeredBy: "Mike Chen",
    registeredAt: "2026-03-02",
    lastEventAt: "44 min ago",
    status: "active",
  },
  {
    id: "act_lead_score",
    name: "Lead score crosses 80",
    description:
      "Threshold watch on Lead.Score. Once a lead crosses 80, push to active outbound queue for human review.",
    sourceId: "src_hubspot",
    object: "Contact",
    field: "hubspot_score",
    fieldLabel: "Lead score",
    trigger: "crosses-threshold",
    watchValue: "≥ 80",
    scope: "Net-new leads, last 30 days",
    recordsInScope: 1284,
    observedActions: ["agent.handoff_sdr", "ledger.append"],
    fanout: ["SDR Slack DM", "Add to active sequence (after preflight)"],
    events7d: 142,
    registeredBy: "Priya Nair",
    registeredAt: "2026-02-21",
    lastEventAt: "3 min ago",
    status: "active",
  },
  {
    id: "act_arr_change",
    name: "Customer MRR change ≥ 10%",
    description:
      "Threshold on monthly recurring revenue from Stripe. Used for expansion alerting and churn risk dashboards.",
    sourceId: "src_stripe",
    object: "Subscription",
    field: "amount_mrr",
    fieldLabel: "MRR",
    trigger: "crosses-threshold",
    watchValue: "± 10%",
    scope: "Active paid subscriptions",
    recordsInScope: 218,
    observedActions: ["agent.expansion_signal", "ledger.append"],
    fanout: ["Notify CSM", "Action Ledger", "Slack #expansion"],
    events7d: 23,
    registeredBy: "Maya Patel",
    registeredAt: "2026-03-18",
    lastEventAt: "1h ago",
    status: "active",
  },
  {
    id: "act_renewal_date",
    name: "Renewal date moved",
    description:
      "Detect when a renewal date shifts on an Account. Frequently a leading indicator of churn or expansion timing.",
    sourceId: "src_gainsight",
    object: "Account",
    field: "RenewalDate__c",
    fieldLabel: "Renewal date",
    trigger: "any-change",
    scope: "Active customers",
    recordsInScope: 196,
    observedActions: ["policy.renewal_freeze", "ledger.append"],
    fanout: ["Notify CSM owner", "Pause outbound agents 7d", "Action Ledger"],
    events7d: 6,
    registeredBy: "Maya Patel",
    registeredAt: "2026-04-04",
    lastEventAt: "5h ago",
    status: "active",
  },
  {
    id: "act_owner_change",
    name: "Account owner changed",
    description:
      "Any change to Account.OwnerId. Triggers re-evaluation of every active sequence and a re-assignment of agent attribution.",
    sourceId: "src_sf_prod",
    object: "Account",
    field: "OwnerId",
    fieldLabel: "Owner",
    trigger: "any-change",
    scope: "All accounts",
    recordsInScope: 1170,
    observedActions: ["policy.ownership_lock", "ledger.append"],
    fanout: ["Re-route active sequences", "Update attribution graph"],
    events7d: 14,
    registeredBy: "Jen Park",
    registeredAt: "2025-12-19",
    lastEventAt: "27 min ago",
    status: "active",
  },
  {
    id: "act_support_csat",
    name: "CSAT drops below 4",
    description:
      "Watch Zendesk CSAT roll-up per account. A drop below 4 over rolling 7 days flags an at-risk customer.",
    sourceId: "src_zendesk",
    object: "Account",
    field: "csat_rolling_7d",
    fieldLabel: "CSAT (7d)",
    trigger: "crosses-threshold",
    watchValue: "< 4",
    scope: "Active customers",
    recordsInScope: 196,
    observedActions: ["policy.at_risk", "ledger.append"],
    fanout: ["Slack #cs-at-risk", "Pause expansion agents"],
    events7d: 3,
    registeredBy: "Maya Patel",
    registeredAt: "2026-04-19",
    lastEventAt: "2h ago",
    status: "paused",
  },
  {
    id: "act_intent_score",
    name: "Intent surge",
    description:
      "Snowflake-derived 6sense intent score crosses 70 on a target account. Fires the inbound-warm-handoff agent.",
    sourceId: "src_snowflake",
    object: "Account",
    field: "intent_score_6sense",
    fieldLabel: "Intent score",
    trigger: "crosses-threshold",
    watchValue: "≥ 70",
    scope: "Target account list (ABM Q2)",
    recordsInScope: 348,
    observedActions: ["agent.warm_inbound", "ledger.append"],
    fanout: ["Warmly notification", "Notify owner", "Action Ledger"],
    events7d: 41,
    registeredBy: "Mike Chen",
    registeredAt: "2026-03-24",
    lastEventAt: "8 min ago",
    status: "active",
  },
];

export type DataChangeEvent = {
  id: string;
  actionId: string;
  recordId: string;
  fromValue: string;
  toValue: string;
  secondsAgo: number;
  actor: string; // who/what made the change in the source system
};

const dataChangeRaw: DataChangeEvent[] = [
  {
    id: "evt_dc_8201",
    actionId: "act_opp_stage",
    recordId: "rec_lena_atlas",
    fromValue: "Discovery",
    toValue: "Proposal",
    secondsAgo: 142,
    actor: "Mike Chen (AE)",
  },
  {
    id: "evt_dc_8200",
    actionId: "act_opp_stage",
    recordId: "rec_jane_bigcorp",
    fromValue: "Proposal",
    toValue: "Negotiation",
    secondsAgo: 312,
    actor: "Mike Chen (AE)",
  },
  {
    id: "evt_dc_8199",
    actionId: "act_lead_score",
    recordId: "rec_emma_tech",
    fromValue: "76",
    toValue: "84",
    secondsAgo: 188,
    actor: "HubSpot scoring engine",
  },
  {
    id: "evt_dc_8198",
    actionId: "act_account_status",
    recordId: "rec_mike_company",
    fromValue: "Active",
    toValue: "At Risk",
    secondsAgo: 661,
    actor: "Maya Patel (CSM)",
  },
  {
    id: "evt_dc_8197",
    actionId: "act_owner_change",
    recordId: "rec_sarah_ent",
    fromValue: "James Park",
    toValue: "Mike Chen",
    secondsAgo: 1622,
    actor: "RevOps round-robin",
  },
  {
    id: "evt_dc_8196",
    actionId: "act_intent_score",
    recordId: "rec_jane_bigcorp",
    fromValue: "62",
    toValue: "78",
    secondsAgo: 482,
    actor: "6sense via Snowflake",
  },
  {
    id: "evt_dc_8195",
    actionId: "act_arr_change",
    recordId: "rec_sarah_ent",
    fromValue: "$8,400",
    toValue: "$11,200",
    secondsAgo: 3641,
    actor: "Stripe billing",
  },
  {
    id: "evt_dc_8194",
    actionId: "act_opp_closed_won",
    recordId: "rec_lena_atlas",
    fromValue: "Negotiation",
    toValue: "Closed Won",
    secondsAgo: 2641,
    actor: "Mike Chen (AE)",
  },
  {
    id: "evt_dc_8193",
    actionId: "act_renewal_date",
    recordId: "rec_mike_company",
    fromValue: "2026-08-12",
    toValue: "2026-10-12",
    secondsAgo: 18001,
    actor: "James Park (CSM)",
  },
];

export type DataChangeEntry = DataChangeEvent & { tsMs: number };

export function getDataChanges(nowMs: number = Date.now()): DataChangeEntry[] {
  return dataChangeRaw.map((e) => ({
    ...e,
    tsMs: nowMs - e.secondsAgo * 1000,
  }));
}

// ---------------------------------------------------------------------------
// Lookups

export const AGENTS_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
export const RECORDS_BY_ID = Object.fromEntries(RECORDS.map((r) => [r.id, r]));
export const DATA_SOURCES_BY_ID = Object.fromEntries(
  DATA_SOURCES.map((s) => [s.id, s]),
);
export const REGISTERED_ACTIONS_BY_ID = Object.fromEntries(
  REGISTERED_ACTIONS.map((a) => [a.id, a]),
);
