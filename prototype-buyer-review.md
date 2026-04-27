# GTM Agent Coordinator — Buyer Review

**Prototype:** https://gtm-coordinator.vercel.app  
**Date:** 2026-04-23  
**Reviewed by:** five synthetic buyer personas (CIO, VP RevOps, RevOps Manager, CRO, CISO)  
**Context:** Pre-customer-conference readout on the visual prototype built in `products/gtm-coordinator/`

---

## Executive summary

All five buyers converged on the same core thesis: **Preflight as the primitive is the right
abstraction, and an immutable Action Ledger is the audit surface the market has been asking
for**. Every reviewer gave the concept credit; none recommended killing the deal.

Every reviewer stopped short of a PO. The gap between "interesting demo" and "I'd sign" lives
in five consistent themes:

1. Identity, key management and access control are prototype-grade
2. The policy authoring surface is read-only — can't be demoed as a builder
3. Attribution numbers lack a counterfactual / methodology
4. Partner preflight adoption is assumed, not demonstrated
5. Fail-open is marketed as a feature and read as a vulnerability

**Recommendation:** ship 3–5 targeted patches before the conference to blunt the sharpest
objections on the demo floor. Reserve the deeper security / identity / partner-adoption work
for the pilot conversation that follows.

---

## Methodology

Five subagents each played a distinct buyer persona for a 1,000–1,500-person B2B SaaS
company. Each agent had access to the live Vercel deployment and the project source
(`CLAUDE.md` + `src/lib/fixtures.ts`) and was asked to evaluate from their specific lens
with a structured reporting format.

| Persona | Role | Buying lens |
|---|---|---|
| CIO / Head of IT | Technical approver | Security, integration, vendor risk, audit |
| VP RevOps | Economic buyer | ROI, consolidation, attribution, rep experience |
| RevOps Manager | Daily user | Investigation speed, policy authoring, workload shape |
| CRO / VP Sales | Sponsor | Board-deck story, AE adoption, politics |
| CISO | Security gate | Threat model, key hygiene, fail-open behavior, ledger integrity |

---

## Cross-cutting findings

### What every persona said was working

- **Preflight primitive** (GO/NO_GO/WAIT/REDIRECT, sub-500ms, versioned rulesets)
- **Action Ledger** as the audit surface that finally answers "what did the agent do and why"
- **REDIRECT as a first-class decision** — not just allow/deny
- **Per-record (not per-agent) budgets with channel caps** — matches how RevOps already thinks
- **Booking-lock semantics with TTL** for `schedule_meeting` — solves a concrete double-touch pain
- **Collision resolution log** as a debuggable surface

### What every persona said was missing or broken

| # | Gap | Flagged by | Sharpest quote |
|---|---|---|---|
| 1 | Identity & key management is 2018-grade (`sk_live_*`, no TTL, no scope, no SSO/RBAC/SCIM) | CIO, CISO, RevOps Mgr | CISO: *"2018 API-key hygiene on a 2026 agent-blast-radius problem"* |
| 2 | Policy authoring is vaporware — rules are read-only strings, no dry-run, no diff, no rollback | RevOps Mgr, CIO, CISO | RevOps Mgr: *"This is the #1 thing the prototype has to prove is real"* |
| 3 | Attribution has no counterfactual, no methodology, no weighting | CRO, VP RevOps | CRO: *"A single attributed dollar figure with no control group is exactly the dashboard my CEO has learned to ignore"* |
| 4 | Partner preflight adoption is assumed, not demonstrated | VP RevOps, CISO | VP RevOps: *"If agent vendors don't adopt preflight, this is a dashboard"* |
| 5 | Fail-open is marketed as a feature, read as a vulnerability | CISO | *"Any attacker who can degrade Preflight gets to choose the moment the gate disappears"* |
| 6 | AE experience is missing from the demo — what does the rep see when REDIRECT fires? | CRO, RevOps Mgr | CRO: *"If Preflight ever says NO_GO on a rep-initiated action, we will have a mutiny by Tuesday"* |
| 7 | No Salesforce sync story — staleness SLA on owner/tier/lifecycle fields | RevOps Mgr | *"If the canonical record drifts from SFDC, every decision is wrong and I get paged more, not less"* |
| 8 | No avoided-cost / counterfactual number (only throughput numbers shown) | VP RevOps | *"Where's 'X duplicate touches blocked → Y prospects retained → $Z pipeline saved'?"* |

---

## The ten-item conference patch list

Ranked by **demo delta per hour of work**. These are visual-prototype patches — sized to blunt
the first-level objection of each persona, not to actually secure a platform.

### Tier 1 — ship before the conference (each unlocks multiple personas)

**1. Rep-view card on `/records/[id]`**  
Mock Slack DM to the owner (Mike Chen) when Warmly gets redirected:
*"Warmly wanted to chat Jane Doe. I held it — open opp in Negotiation, your move."*  
Flips the record timeline from a surveillance read to a "this product protects the rep" read.  
*Unlocks:* CRO's AE-mutiny concern, RevOps Mgr's "what does the rep see" question.

**2. Counterfactual on `/attribution`**  
Change hero to *"$4.2M attributed vs $2.9M matched-holdout baseline · n=318 accounts · Shapley
multi-touch"*, plus a methodology tooltip with three radio options (first-touch / linear /
Shapley).  
*Unlocks:* CRO will cite the number to the CEO; VP RevOps can defend it to Finance.

**3. Policy Builder preview on `/policies`**  
Condition chips, scope picker, enforcement radio, and a *"Simulate on last 7d traffic → 87
decisions would flip, 12 AEs affected"* panel. Doesn't need to save — needs to look real.  
*Unlocks:* RevOps Mgr's #1 must-prove-real, CIO's policy-versioning concern (partially),
CISO's dry-run requirement (partially).

### Tier 2 — ship if there's time

**4. `/security` (or `/compliance`) page**  
SOC2 Type II badge, sub-processor list, data-residency toggle (US/EU), SIEM webhook config,
ledger retention dial. Even as stubs this is the page the security review opens first.  
*Unlocks:* CIO's top-five deal blockers; CISO's sub-processor + residency questions.

**5. Agent Security tab on `/agents/[id]`**  
Scoped API key (not `sk_live_*`), rotate/revoke with "blast radius: 1,847 preflights/day"
confirm, IP allowlist, data-scope matrix (reads email ✓ / reads opp amount ✗).  
*Unlocks:* CIO's key hygiene objection; CISO's key-theft threat partially.

**6. Partner adoption indicator on `/partners`**  
"Coordination contract signed" badge per partner + outbound anomaly widget:
*"11x: 1,847 preflights vs 1,823 actions reported — 98.7% coverage."*  
*Unlocks:* VP RevOps' #1 deal risk; RevOps Mgr's "what about vendors that don't call
preflight" worry.

**7. Policy chip on `/ledger` + record timeline**  
`[pol_ent_approval]` as a clickable pill next to each reason string. 15-minute change that
converts the ledger from a log into a debugger.  
*Unlocks:* RevOps Mgr's explicit 15-minute ask.

### Tier 3 — polish, nice to have

**8. Collisions → dollars on `/`**  
Reword "142 collisions prevented" to "142 collisions prevented · est. $680K pipeline
protected." One line of copy, huge framing shift.  
*Unlocks:* VP RevOps' avoided-cost ask.

**9. Fail-closed-by-default banner**  
A one-line status on `/preflight`: *"Default: fail-closed on write actions. Fail-open: customer-scoped, time-boxed, ledger-annotated."* Flips the CISO's most dangerous read.  
*Unlocks:* CISO's fail-open objection at the demo level.

**10. Demo script / guided-tour persona switcher**  
A persona picker in the top-bar (CIO / CRO / RevOps Mgr) that reorders the home KPIs to
lead with **risk prevented** vs **revenue attributed** vs **collisions triaged**.
Mirrors the pattern the agp-app-v7 sibling already uses.  
*Unlocks:* The conference-floor question "which one of these people should I show this to."

---

## Deal-blockers that are *not* fixable in the prototype

Be explicit in the sales motion that these will be answered in the pilot conversation, not
on the demo floor:

- **SSO / SAML / OIDC / SCIM / RBAC** — CIO will ask by minute three. Have an auth
  roadmap ready.
- **Write-action fail-closed semantics** — a real product decision, not a UI change. The
  CISO is right: fail-open on write-authorization is a vulnerability.
- **SOC2 Type II + DPA + sub-processor list + data-residency commitments** — legal +
  compliance artifacts, not screens.
- **Signed coordination contracts with at least 3 agent vendors** — the product is only
  as real as the partners who commit to calling preflight. This is the single biggest
  deal risk the VP RevOps will surface.
- **Salesforce sync staleness SLA** — ownership, tier, lifecycle live in SFDC; a drift
  SLA between SFDC and canonical records is a pilot prerequisite for RevOps Manager trust.
- **Ledger integrity model** — tamper-evident (LeanData-signed) vs tamper-proof
  (externally-anchored Merkle root) is a regulatory-exam question. Needs a position.

---

## Per-persona verdicts

### CIO / Head of IT — *pilot, not buy*

> *"The control-plane thesis is right — 'every agent calls preflight before acting, every
> decision in an immutable ledger' is exactly the seam I've been trying to put under the GTM
> team's Warmly/Clay/11x sprawl — but the prototype shows zero of the security, SSO, and
> lifecycle plumbing I need to sign a purchase order."*

**Sold me:** preflight primitive with versioned rulesets; immutable ledger; booking-lock
semantics; single MCP + REST + SDK surface area.

**Deal-blockers:** no SSO/RBAC/SCIM; undefined data residency and PII handling; no SOC2 /
SLA / DPA in the artifact; no SIEM export; no policy versioning / approval / rollback.

**Wished the prototype showed:** key-management screen with scopes + rotation; "what agent X
can see" field-level read/write matrix; ledger export with signed hash chain; pricing meter
/ cost guardrail; tenant-wide kill switch with RBAC.

**Pilot-to-buy unlocks:** Agent Security tab; `/compliance` route; policy versioning + dry-run.

### VP RevOps — *I'd pilot, not PO*

> *"The preflight + ledger concept is the right primitive and nothing else in my stack has
> it — but the ROI math is hand-waved and I can't yet tell if this replaces budget or adds
> to it."*

**Slide to CRO:** one control plane across the 7-agent stack; $4.2M / $840K attributable to
specific agents; collision / duplicate-touch prevention quantified.

**Where the story leaks:** attribution methodology absent; only 5 collisions shown vs 142
claimed; preflight requires vendor adoption and the prototype doesn't prove which partners
actually call it; budgets look opinionated, not configurable; no *avoided* number, only
throughput.

**Demands before paying:** signed coordination contracts with ≥3 partners; shadow mode on
real SFDC data for 2 weeks; defensible attribution methodology; rip-and-replace budget proof;
a rep-side artifact (what Mike sees in Slack when REDIRECT fires).

**Feels extra:** `/mcp` (move to docs); "available/coming-soon" partners (hide until connected);
ruleset version strings surfaced in the feed.

**Biggest deal risk:** *"If agent vendors don't adopt preflight, this becomes a passive
observability layer I'm paying a control-plane price for — and I'll have bought a dashboard,
not a coordinator."*

### RevOps Manager — *I'd live here (if the policy builder is real)*

> *"This is the first tool I've seen that takes the 'who's touching what' problem seriously
> and doesn't just bolt an agent onto existing LeanData routing."*

**Investigation story:** can answer "why did Jane get 3 touches" in ~2 minutes using
`/records/[id]` + `/collisions`, down from 20 minutes today. Gets stuck on: timeline doesn't
show human-sent email bodies (has to tab to SFDC); ledger doesn't render the actual email
that was sent by 11x.

**Policy reality check:** the `/policies` page is a read-only preview of rule strings. No
form, no condition chips, no scope picker, no dry-run simulator. Compared to LeanData's
existing FlowBuilder, this is a step backwards *as shown*. **#1 thing the prototype must
prove is real.**

**Would recommend it:** (1) immutable per-record cross-agent ledger kills the whose-fault
meeting outright; (2) REDIRECT as first-class; (3) preflight as a throttle choke point
(Regie auto-throttled at 41% GO rate); (4) per-record budget primitive; (5) booking lock
with TTL.

**Would say "not yet":** policy builder is vaporware; no SFDC round-trip / staleness SLA;
no anomaly detection for agents that skip preflight.

**15-minute UX fix:** add clickable policy chips (`[pol_quiet_hours]`) next to the reason
text in `/ledger` and on record timelines. Converts the ledger from a log into a debugger.

### CRO / VP Sales — *I'd sponsor a 90-day pilot, not a platform bet*

> *"It's a governance layer for our agent stack — interesting, but right now it's a
> risk-reduction story dressed up as a pipeline story, and I don't buy the $4.2M until I
> see the counterfactual."*

**Story to CEO:** one traffic cop across 8 agents; every action logged for Legal and the
board; early-read $840K / 42-day cycle — but wants a second quarter before board-deck
citation.

**AE reaction worry:** timeline reads like surveillance unless framed as *agent* oversight;
AEs seeing "6 bots already touched my account" feels boxed-out; a NO_GO on a rep-initiated
action would cause a mutiny by Tuesday.

**Missing for the board deck:** counterfactual / holdout / matched-control math;
agent-booked vs AE-booked meeting quality comparison (show-rate, SAO, stage-2 conversion);
cost-per-opp across the agent stack; collisions-prevented translated to dollars of pipeline
protected.

**Politics:** winners — RevOps VP (owns the agent layer, gets board airtime),
Legal/Compliance (auditable ledger), CRO (if cycle-time number holds). Losers — individual
agent vendors pushed behind a control plane, and whoever owns the current attribution model
in Marketing Ops. Fund out of RevOps budget so AEs never see a line item called "agent
governance tax."

**One change for attribution before citing:** change the hero from
*"$4.2M attributed pipeline"* to *"$4.2M pipeline vs $X.XM matched-holdout baseline,
p<0.05, n=___ accounts"* with a methodology tooltip.

### CISO — *yellow, leaning red for regulated pilots*

> *"Strong ideas (preflight gate, ledger, collision control) wrapped in prototype-grade
> identity and integrity claims that don't survive a threat model."*

**Threat residuals:**

| Threat | Prototype claim | Residual concern |
|---|---|---|
| Compromised agent spraying customers | Preflight + declared-actions + throttle | `declaredActions` is self-attested metadata, not a signed manifest bound to the request |
| Tampered audit history | "Cryptographically chained" ledger | Single-operator Merkle log is tamper-evident at best; no external anchor or witness cited |
| Key theft / impersonation | `sk_live_*`, status can be `revoked` | Long-lived bearer tokens, no scope/audience/mTLS/JWT exp, revocation latency undefined |
| Policy bypass by insider | `enforcement: block/warn/redirect` | No author / approver separation, no signed policy bundle, no break-glass record |

**Security-review questions:** revocation p99 propagation time; ledger trust model + external
anchor; fail-open behavior under induced Preflight outage; decision-record physical location
+ residency; MCP call-level authorization scoping.

**Fail-open verdict:** fail-open on the write / authorization surface is an invitation.
An attacker who degrades Preflight gets to choose the moment the gate disappears — and the
ledger will dutifully record thousands of GOs that were "engine unavailable, allowed by
default." **Must be fail-closed by default on write actions**, with a time-boxed
customer-controlled exception and a red banner in the ledger.

**Required to sign:** short-TTL scope-bound credentials (JWT/DPoP or mTLS) per-tenant
per-agent; signed binding action manifest; externally-anchored ledger; fail-closed default
on write-category MCP tools; separation of duties on policies with auto-expiring break-glass.

**Lost confidence on:** `/agents/agt_11x_alice` — `sk_live_...7f3a`, free-form declared
actions, no TTL / scope / rotation timestamp.

**Earned credit on:** `/preflight` — the four-outcome decision contract with versioned
rulesets and human-readable reasons is the right primitive.

---

## Recommendations

### If you have one day before the conference
Ship Tier 1 patches #1, #2, #3 (Rep-view card, counterfactual attribution, Policy Builder
preview). These three unlock the CRO, VP RevOps, and RevOps Manager objections.

### If you have three days
Add #4 (`/security` stub) and #6 (partner adoption indicator). These are the two pages
the CIO and VP RevOps open first.

### If you have a week
Add #5 (Agent Security tab), #7 (policy chips on ledger), #8 (dollar framing on
collisions). The prototype now survives first-level scrutiny from all five personas.

### For the pilot conversation after the conference
A one-page spec covering SSO/SAML/SCIM roadmap, write-action fail-closed semantics,
SOC2 + DPA + sub-processor list, partner coordination-contract status, and SFDC sync
staleness SLA. These are artifacts, not screens — but the deals turn on them.

---

## One-line recommendation

Of everything above, **three patches unlock three reviewers**: the rep-view Slack card,
the counterfactual on attribution, and the policy builder preview. If you ship nothing
else, ship those.
