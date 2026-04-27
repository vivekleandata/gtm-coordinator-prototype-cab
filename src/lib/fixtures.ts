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
  | "quiet-hours";

export type Policy = {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  scope: string;
  status: "active" | "draft" | "paused";
  enforcement: "block" | "warn" | "redirect";
  appliedTo: string;
  triggered7d: number;
  lastModified: string;
  rules: string[];
};

export const POLICIES: Policy[] = [
  {
    id: "pol_ent_approval",
    name: "Enterprise Approval Gate",
    description:
      "Require AE sign-off before any outbound on Tier-1 accounts with open opportunities.",
    type: "approval",
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
];

// ---------------------------------------------------------------------------
// Communication Budgets

export type BudgetTier = {
  name: string;
  weeklyTouches: number;
  dailyTouches: number;
  cooldownMinutes: number;
  channelCaps: Array<{ channel: string; cap: number; period: string }>;
};

export const BUDGETS: BudgetTier[] = [
  {
    name: "Tier 1 — Enterprise",
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
  {
    name: "Tier 2 — Mid-market",
    weeklyTouches: 10,
    dailyTouches: 2,
    cooldownMinutes: 90,
    channelCaps: [
      { channel: "Email", cap: 1, period: "per day" },
      { channel: "LinkedIn", cap: 1, period: "per day" },
      { channel: "Chat", cap: 2, period: "per day" },
    ],
  },
  {
    name: "Tier 3 — SMB",
    weeklyTouches: 6,
    dailyTouches: 1,
    cooldownMinutes: 240,
    channelCaps: [
      { channel: "Email", cap: 1, period: "per day" },
      { channel: "LinkedIn", cap: 1, period: "per week" },
    ],
  },
];

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

export type AgentAttribution = {
  agentId: string;
  meetings: number;
  pipeline: string;
  revenue: string;
  winRate: number;
  avgCycleDays: number;
};

export const ATTRIBUTION: AgentAttribution[] = [
  {
    agentId: "agt_11x_alice",
    meetings: 68,
    pipeline: "$2.1M",
    revenue: "$420K",
    winRate: 0.31,
    avgCycleDays: 42,
  },
  {
    agentId: "agt_onemind_sched",
    meetings: 34,
    pipeline: "$980K",
    revenue: "$210K",
    winRate: 0.29,
    avgCycleDays: 38,
  },
  {
    agentId: "agt_warmly_visitor",
    meetings: 21,
    pipeline: "$640K",
    revenue: "$120K",
    winRate: 0.26,
    avgCycleDays: 51,
  },
  {
    agentId: "agt_rev_outbound",
    meetings: 14,
    pipeline: "$380K",
    revenue: "$90K",
    winRate: 0.33,
    avgCycleDays: 36,
  },
  {
    agentId: "agt_zi_signals",
    meetings: 5,
    pipeline: "$110K",
    revenue: "$0",
    winRate: 0.0,
    avgCycleDays: 0,
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
// Lookups

export const AGENTS_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
export const RECORDS_BY_ID = Object.fromEntries(RECORDS.map((r) => [r.id, r]));
