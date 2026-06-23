---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-2-live-testing
next_stage: stage-3-preview-conflict-engine
cache_version: talk-arrangements-v39-fixed-manager-ui
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

Status: code implemented, live testing required.

Commits:

- ac49fb8d96c4d66aa7a9d9474c00458d1982ff2b
- c6f12154e2fe99f4ac2e0863cafca38bf81a88c6

Cache:

```text
talk-arrangements-v39-fixed-manager-ui
```

Expected behavior:

- Congregations tab shows Fixed Arrangements / Arreglos Fijos button.
- Manager modal opens.
- User can add, edit, and delete rules.
- Rules support congregation, multiple months, continuous mode, selected years, custom year, and note.
- Rules save into state.fixedArrangements.
- Rollover behavior is not changed yet.

## Stage 2 Live Test Checklist

- App loads.
- Congregations tab opens.
- Fixed Arrangements button appears.
- Manager opens.
- Create rule works.
- Edit rule works.
- Delete rule works.
- Multiple months work.
- Selected years work.
- Custom year works.
- Rule remains after refresh.
- English and Spanish acceptable.
- Light and dark acceptable.
- Mobile/tablet acceptable.
- No console errors.

## Next Stage

### Stage 3 — Preview and Conflict Engine

Build a preview system that simulates fixed rules against a target year without changing saved schedule data.

Required:

- Preview next year before applying changes.
- Show safe fixed-rule assignments.
- Show conflicts.
- Show expired or not-applicable rules.
- Planning rows win by default.
- No automatic overwrite.

Do not implement rollover integration until Stage 3 is approved.

## Later Stages

Stage 4 — Rollover Integration.
Stage 4.5 — Hybrid Rollover Mode: manual or automatic, with safety checks.
Stage 5 — QA and polish.

Future only: message scheduler, push notifications, optional auto-send backend.

## Files Involved

- js/dashboard-notes.js
- sw.js
- js/a11y.js

## Final Cleanup

When the Fixed Arrangements feature is complete and live-approved, delete this file:

TEMP_FIXED_ARRANGEMENTS_HANDOFF.md
