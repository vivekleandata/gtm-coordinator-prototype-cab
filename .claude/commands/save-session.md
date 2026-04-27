---
description: End-of-session wrap-up — write a git handoff doc to docs/handoffs/. (Notion Session Log is optional; see below.)
---

# Save Session — gtm-coordinator

Produce a git handoff doc. Notion is opt-in for this project (see §2).

## 1. Git handoff doc

Write to `docs/handoffs/YYYY-MM-DD-session-handoff.md` (working dir: `/Users/vivekravisankar/Local/LeanData/products/gtm-coordinator`). If a file already exists for today, append `-v2`, `-v3`, etc.

Frontmatter (mirror agentic-gtm-platform's taxonomy):

```yaml
---
title: Session handoff — <1-line frame>
type: handoff
status: snapshot
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: <prior handoff filename or null>
superseded_by: null
tags: [handoff, gtm-coordinator, ...topical-tags]
---
```

Body structure (follow the style of prior handoffs in `docs/handoffs/` once they exist; until then, mirror `../agentic-gtm-platform/docs/handoffs/` for the rhythm):

```
# Session handoff — <Session title>

**Session date:** YYYY-MM-DD
**Working directory:** /Users/vivekravisankar/Local/LeanData/products/gtm-coordinator
**Owner:** Vivek Ravisankar
**Session duration:** ~Nh
**Prior handoff:** docs/handoffs/<prior file or "none — first handoff">

One-line frame: <what shipped or moved>.

## What happened this session
<chronological narrative, 5-10 bullets, each a concrete action or finding>

## File state

### Modified — <surface>
- `path/to/file.tsx` — what changed and why

### Created
- `path/to/file.tsx` — purpose

### Untouched but related
- `path/to/file.tsx` — why it matters

### Deployed
- Prod (current): https://gtm-coordinator.vercel.app (deploy dpl_…)

## Decisions made
<load-bearing in-session calls — keep terse, lead with the decision then the reason>

## Risks surfaced
<new risks only — say "None new" if nothing changed>

## Open questions surfaced
<list>

## Open work

### Next actions (pick any — flag blockers)
1. ...
2. ...

### Queued
- ...

### Blocked
- ... (or "None.")

## Start here on resume
<the single most important section — concrete, copy-pasteable next-actions for cold-pickup by next-session Claude. If multiple tracks, label them.>

### Do NOT
<sharp edges next-session Claude should avoid — load-bearing fixtures, retained-for-deep-link routes, etc.>

## Reference
- Prior handoff chain: ...
- Production URL: https://gtm-coordinator.vercel.app
- Tests: `cd /Users/vivekravisankar/Local/LeanData/products/gtm-coordinator && npx tsc --noEmit && npm run build`
- Skills invoked this session: ...
```

The handoff is for next-session Claude + the engineering team. Include enough detail that a cold-start pickup works without re-reading today's conversation.

## 2. Notion Session Log entry (optional — currently SKIP by default)

gtm-coordinator does not yet have its own Notion workspace. Two options:

- **Default (skip):** Don't write to the AGP Session Log database — it's scoped to agentic-gtm-platform and cross-project entries muddy the timeline.
- **If the user has set one up:** create a page in the dedicated gtm-coordinator Session Log DB. Ask the user for the data_source_id the first time.

If you do write to a shared DB later, prefix Session Title with `[gtm-coord]` so AGP and gtm-coordinator entries are visually separable in queries.

## Style rules

- Git handoff is rich + technical. Optional Notion entry is scannable + stakeholder-friendly.
- Scan git log (if the repo is git-initialized) for commits this session; reference hashes in the handoff.
- Never skip the "Start here on resume" section — it's the most valuable part of the handoff.
- If today was mostly conversation / decisions / planning (no code), the handoff is still worth writing; decisions decay without context.
- gtm-coordinator is paired with agp-app-v7 ("control plane for agents" vs. "workstation for humans"). When a session decision affects that pairing, call it out explicitly so the AGP project handoff can mirror it.

## Report back (under 200 words)

1. Handoff path + 1-line summary.
2. Whether you wrote a Notion entry (and URL if so) or skipped it (default).
3. Anything the user should verify or push back on before the session context is lost.
