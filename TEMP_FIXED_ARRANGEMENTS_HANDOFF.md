---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-4a-batch-4-1-terminology-polish-code-implemented-live-testing-required
next_stage: stage-4b-after-david-approval
cache_version: talk-arrangements-v51-terminology-polish
remove_when: fixed-arrangements-feature-complete-and-live-approved
---

# Temporary Fixed Arrangements Handoff

Read this file before continuing work on the Fixed Arrangements / Rollover feature.

## Goal

Build a safe Fixed Arrangement / Rollover system that clearly shows conflicts before any future rollover apply step.

## Safety Rules

- No silent overwrites.
- Show conflicts clearly.
- Preview and wording batches are display-only.
- Do not begin Stage 4B until David approves the live UI.

## Current Status

### Stage 4A Batch 4.1 — Terminology Polish
Status: code implemented / live testing required.

Commits:
- 285c5b18dc63eb1319f6f035c97de0d6d1072b17 — Polish planning conflict terminology
- e4409adefbfd637bdbc6376b596ccc10ea8798ca — Bump cache for terminology polish
- this handoff update commit records Batch 4.1 state

Files changed:
- js/planning-conflicts.js
- sw.js
- TEMP_FIXED_ARRANGEMENTS_HANDOFF.md

Cache:
- talk-arrangements-v51-terminology-polish

Batch 4.1 behavior:
- English conflict banner now says: Review needed.
- Spanish conflict banner now says: Revisión necesaria.
- Planned / Planificado changed to Current Schedule / Programa actual.
- Fixed / Fijo changed to Fixed Arrangement / Arreglo fijo.
- Override button changed to Keep Current Schedule / Mantener programa actual.
- Approved override section wording was softened.
- Confirmation dialogs and toast messages were updated to match.
- No rollover apply behavior was added.

## Prior Stage Notes

- Stage 4A Batch 3 preview engine was live-tested by David and showed summary cards plus month-by-month results.
- Stage 4A Batch 3 load repair fixed the script-loading issue by loading feature scripts after js/app.js.
- Stage 4A Batch 4 clarified rollover preview conflicts and bumped cache to talk-arrangements-v50-rollover-preview-polish.

## Batch 4.1 Live Checklist

- App loads after cache update.
- English wording appears correctly.
- Spanish wording appears correctly.
- Buttons still perform the same actions.
- Confirmation dialogs still appear.
- Approved current schedule section still appears for existing year-only keeps.
- Mobile and desktop remain usable.
- Light and dark mode remain usable.
- No console errors.

## Next Stage

Stop after Stage 4A Batch 4.1. Do not begin Stage 4B until David tests and approves.

After approval: Stage 4B — Apply Rollover with explicit confirmation, conflict review, and no silent overwrite.

## Known Follow-up

- Add a clear-row button for Planning rows later.
- Clear row should confirm first and clear the related row fields together.
