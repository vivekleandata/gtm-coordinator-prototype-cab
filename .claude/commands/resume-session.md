---
description: Cold-start pickup — read the most recent git handoff, summarize state, and propose concrete next steps.
---

# Resume Session — gtm-coordinator

Purpose: restore the full working context from the last session without requiring the user to re-explain anything.

Working directory: `/Users/vivekravisankar/Local/LeanData/products/gtm-coordinator`.

## 1. Find the most recent handoff

Glob `docs/handoffs/*.md`. Pick the most recent by date + version suffix (e.g., `2026-04-26-v2-session-handoff.md` beats `2026-04-26-session-handoff.md`). If there are multiple from the same date with different suffixes, the one with the latest `-vN` wins.

If no handoffs exist yet (only `.gitkeep`), tell the user — this is a fresh session-tracking setup and `/resume-session` doesn't have anything to resume from. Offer to walk the repo (`CLAUDE.md`, `prototype-buyer-review.md`, `src/app/`) to build a fresh state summary instead.

## 2. Read the handoff entirely

Use the Read tool on the full file. Do NOT skim. The handoff was written specifically so cold-start Claude can pick up without loss. Every section matters — especially "Start here on resume," which is where the previous session put the concrete actionable next steps.

## 3. Optionally cross-reference Notion

gtm-coordinator does not currently mirror sessions into a dedicated Notion DB. Skip the cross-check unless the user has explicitly set one up and shared the data_source_id. Do NOT query the agentic-gtm-platform Session Log — it's scoped to that project.

## 4. Check memory for any project-level updates

The auto-memory index for this project lives at `/Users/vivekravisankar/.claude/projects/-Users-vivekravisankar-Local-LeanData-products-gtm-coordinator/memory/MEMORY.md` (auto-loaded if it exists). Scan for any `type: feedback` or `type: project` memories that have been updated since the handoff was written — those may override what the handoff says.

If no memory exists yet, that's expected for a new project — Claude will start building it as the user provides preferences and project context.

## 5. Surface state + propose next steps

Respond with:

1. **One-paragraph recap** — what happened last session (2–3 sentences, citing the handoff's session title).
2. **Current state** — what exists in the prototype, where the project is in its phase.
3. **Open work** — what's blocked vs queued vs in-flight.
4. **Proposed next steps** — pull directly from the handoff's "Start here on resume" section. If it has multiple tracks, present them as parallel options.
5. **Anything that needs user input before I proceed** — e.g., pairing decisions with agp-app-v7, customer-conference scoping, or external dependencies.

## 6. Wait for direction

Do NOT start executing next steps automatically. The user may want to:
- Pick a track
- Redirect entirely based on context you don't have (e.g., feedback from a stakeholder between sessions)
- Ask clarifying questions

Present the options and let the user choose.

## Style rules

- If the "Start here on resume" section in the handoff is concrete and unambiguous, quote it directly rather than paraphrasing.
- Never invent context that isn't in the handoff or memory. If something is unclear, say so.
- Keep the initial response scannable — ~200-300 words. The user has just come in cold too; give them the shape before the details.
- If the most recent handoff is older than ~5 days, flag that the context may be stale and recommend a quick project-state refresh (git log, recent file changes, `npx tsc --noEmit`).
- gtm-coordinator is paired with `../agentic-gtm-platform/prototypes/agp-app-v7` (control plane for agents vs. workstation for humans). If the handoff references coordinated changes, mention them so the user can decide whether to resume both projects.
