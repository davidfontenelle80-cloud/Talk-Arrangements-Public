---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-3-1-live-testing
next_stage: stage-4-rollover-integration
cache_version: talk-arrangements-v42-planning-conflict-warnings
remove_when: fixed-arrangements-feature-complete-and-live-approved
---

# Temporary Fixed Arrangements Handoff

This file is temporary project memory. If another chat takes over, read this file first.

## Goal

Build a Fixed Arrangement Rules system for the Talk Arrangements app.

The system must allow fixed arrangements that are:

- Continuous until changed
- Limited to selected years
- Assigned to one month or multiple months

The system must never silently overwrite existing planning or schedule data.

## Safety Rules

- No silent overwrites.
- Planning rows win by default.
- Conflicts must be shown to the user.
- Any future override must require explicit confirmation.
- Do not change Firebase config, Firestore rules, cloud backup paths, or localStorage keys.
- Do not implement notifications or auto-send in this cycle.

## Completed Stages

### Stage 0.5 — Cleanup and Stabilization

Status: code implemented. David reported app looks good.

Commits:

- 39114a9ac255b2d694116196e4e3b71e8ae7f5dd
- 86bfacce557a8bd49993560fb212a8d4d75a4c68

### Stage 1 — Fixed Arrangement Data Model

Status: code implemented.

Commits:

- 4532c9526219766601acce8d7b5aa7eb9ae1ace4
- 301555a329a8e5223b3a5033811270a33c877b72

Data model:

```js
fixedArrangements: [
  {
    id: "uuid",
    congregation: "",
    months: [],
    mode: "continuous",
    years: [],
    note: ""
  }
]
```

Existing congregation.isFixed behavior was preserved. Rollover was not changed.

### Stage 2 — Fixed Arrangements Manager UI

Status: approved by David.

Commits:

- ac49fb8d96c4d66aa7a9d9474c00458d1982ff2b
- c6f12154e2fe99f4ac2e0863cafca38bf81a88c6

Expected behavior:

- Congregations tab shows Fixed Arrangements / Arreglos Fijos button.
- Manager modal opens.
- User can add, edit, and delete rules.
- Rules support congregation, multiple months, continuous mode, selected years, custom year, and note.
- Rules save into state.fixedArrangements.
- Rollover behavior is not changed yet.

### Stage 2.1 — Fixed Arrangements Manager UX Cleanup

Status: code implemented, David reported it works.

Commits:

- b2be195ee71709da84687b53ff484ddd9ce4b08c — Add fixed manager UX cleanup
- f66557e3e80a24e2d265f89fe1e3e06e2be4ba17 — Load fixed manager UX cleanup
- a17fc951d3ab72df85d51b4459fc74293466c377 — Bump cache for fixed manager UX cleanup
- 3a510fa203f1bb3f8e02fc29853ba384de0a1fda — Update handoff for stage 2.1 cleanup

Expected behavior:

- Continuous mode clears and disables years.
- Selected Years mode enables year selection.
- Selected Years still requires at least one year.
- Helper text explains that changing month by year should use separate rules.
- Duplicate month conflicts between active rules produce a warning before saving anyway.
- No rollover behavior changed.

### Stage 3 — Preview and Conflict Engine

Status: code implemented, live testing required.

Commits:

- 644d946649fc1e6b8089633707fb81728b003ff3 — Add fixed arrangement preview engine
- 8d804ffc0bad647cd20dc9508e464756b49d5d09 — Load fixed preview enhancement
- 169f1a511791b8f7dad45990528f412c4e1537c5 — Bump cache for fixed preview engine
- f4ef70c261014dc6ecb4c5330e71cfe409af03f5 — Update handoff for stage 3 preview

Expected behavior:

- Inside Fixed Arrangements manager, a Preview Next Year / Vista previa del próximo año button appears.
- Preview opens a modal.
- Preview has target year input.
- Preview does not change saved schedule data.
- Preview shows summary counts: Safe, Warnings, Conflicts, Skipped.
- Conflicts are highlighted red with warning icon.
- Warnings are highlighted yellow.
- Safe assignments are highlighted green.
- Skipped or expired rules are shown as skipped.
- Planning rows win by default.
- No rollover integration yet.

### Stage 3.1 — Planning Conflict Awareness

Status: code implemented, live testing required.

Commits:

- 2dbd14167b1f13ee95efae9216512a66c87c9f08 — Add planning fixed conflict warnings
- fafbc65b72cfddc21cc68030a961684bbe0f631e — Load planning conflict warnings
- 98274af9995c1d50a4ecc6270ba79db930291382 — Bump cache for planning conflict warnings

Cache:

```text
talk-arrangements-v42-planning-conflict-warnings
```

Expected behavior:

- Planning rows that conflict with active fixed rules are highlighted red.
- A Fixed Arrangement Conflict warning appears in the affected planning year panel.
- Warning shows month, planned congregation, and fixed congregation.
- Planning data is not overwritten or blocked.
- Fixed rules are not changed.
- No rollover behavior changed.

Known follow-up request added by David:

- Add clear-row button for Planning rows.
- Clear row should confirm first.
- Clear row should remove congregation, contact, confirmation, date, notes, and related row fields together.
- This prevents stale contact data remaining after congregation is cleared.
- Recommended as Stage 3.2 or Stage 5 polish.

## Stage 3.1 Live Test Checklist

- App loads after cache update.
- Create or use a fixed rule for a specific year/month.
- Go to Planning for that same year/month.
- Enter a different congregation.
- Confirm the row turns red or is visibly highlighted.
- Confirm a Fixed Arrangement Conflict warning appears near Year Check.
- Confirm warning shows planned vs fixed congregation.
- Confirm changing the planning row back to the fixed congregation removes the warning.
- Confirm no data is overwritten.
- Confirm English/Spanish, light/dark, mobile are usable.

## Next Stage

Stage 3.1 must be live-tested and approved. Then move to Stage 4 — Rollover Integration.

## Later Stages

Stage 4 — Rollover Integration.
Stage 4.5 — Hybrid Rollover Mode: manual or automatic, with safety checks.
Stage 5 — QA and polish.

Future only: message scheduler, push notifications, optional auto-send backend.

## Files Involved

- js/dashboard-notes.js
- js/fixed-preview.js
- js/fixed-manager-ux.js
- js/planning-conflicts.js
- sw.js
- js/a11y.js
- TEMP_FIXED_ARRANGEMENTS_HANDOFF.md

## Final Cleanup

When the Fixed Arrangements feature is complete and live-approved, delete this file:

TEMP_FIXED_ARRANGEMENTS_HANDOFF.md
