---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-3-live-testing
next_stage: stage-4-rollover-integration
cache_version: talk-arrangements-v40-fixed-preview-engine
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

### Stage 3 — Preview and Conflict Engine

Status: code implemented, live testing required.

Commits:

- 644d946649fc1e6b8089633707fb81728b003ff3 — Add fixed arrangement preview engine
- 8d804ffc0bad647cd20dc9508e464756b49d5d09 — Load fixed preview enhancement
- 169f1a511791b8f7dad45990528f412c4e1537c5 — Bump cache for fixed preview engine

Cache:

```text
talk-arrangements-v40-fixed-preview-engine
```

Expected behavior:

- Inside Fixed Arrangements manager, a Preview Next Year / Vista previa del próximo año button appears.
- Preview opens a modal.
- Preview has target year input.
- Preview does not change saved schedule data.
- Preview shows summary counts:
  - Safe
  - Warnings
  - Conflicts
  - Skipped
- Conflicts are highlighted red with warning icon.
- Warnings are highlighted yellow.
- Safe assignments are highlighted green.
- Skipped or expired rules are shown as skipped.
- Planning rows win by default.
- No rollover integration yet.

## Stage 3 Live Test Checklist

- App loads.
- Open Congregations.
- Open Fixed Arrangements.
- Confirm Preview Next Year button appears.
- Create at least one fixed rule if none exists.
- Open Preview Next Year.
- Confirm preview modal opens.
- Confirm target year is shown.
- Confirm Safe / Warnings / Conflicts / Skipped summary appears.
- Test a rule for a blank planning month and confirm it appears as Safe.
- Test a rule that conflicts with an existing Planning month and confirm it appears as Conflict.
- Test a selected-years rule outside the target year and confirm it appears as Skipped.
- Confirm no schedule data changes after closing preview.
- Confirm English and Spanish are acceptable.
- Confirm light and dark modes are readable.
- Confirm mobile/tablet layout is usable.
- Confirm no console errors.

## Next Stage

### Stage 4 — Rollover Integration

Not started.

Rules when implemented:

- Continuous rules apply every generated year.
- Selected-year rules apply only when the target year is included.
- Fixed rules fill blank months only by default.
- Planning/manual rows win unless user explicitly overrides.
- Override must require confirmation.
- Stage 4 must not start until Stage 3 is approved.

## Later Stages

Stage 4.5 — Hybrid Rollover Mode: manual or automatic, with safety checks.
Stage 5 — QA and polish.

Future only: message scheduler, push notifications, optional auto-send backend.

## Files Involved

- js/dashboard-notes.js
- js/fixed-preview.js
- sw.js
- js/a11y.js
- TEMP_FIXED_ARRANGEMENTS_HANDOFF.md

## Final Cleanup

When the Fixed Arrangements feature is complete and live-approved, delete this file:

TEMP_FIXED_ARRANGEMENTS_HANDOFF.md
