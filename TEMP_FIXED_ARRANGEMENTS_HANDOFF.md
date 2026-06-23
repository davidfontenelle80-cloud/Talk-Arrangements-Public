---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-3-2a-live-testing
next_stage: stage-4-rollover-integration
cache_version: talk-arrangements-v44-banner-naming-polish
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

### Stage 2 — Fixed Arrangements Manager UI

Status: approved by David.

Commits:

- ac49fb8d96c4d66aa7a9d9474c00458d1982ff2b
- c6f12154e2fe99f4ac2e0863cafca38bf81a88c6

### Stage 2.1 — Fixed Arrangements Manager UX Cleanup

Status: code implemented, David reported it works.

Commits:

- b2be195ee71709da84687b53ff484ddd9ce4b08c
- f66557e3e80a24e2d265f89fe1e3e06e2be4ba17
- a17fc951d3ab72df85d51b4459fc74293466c377
- 3a510fa203f1bb3f8e02fc29853ba384de0a1fda

### Stage 3 — Preview and Conflict Engine

Status: code implemented, live testing required.

Commits:

- 644d946649fc1e6b8089633707fb81728b003ff3
- 8d804ffc0bad647cd20dc9508e464756b49d5d09
- 169f1a511791b8f7dad45990528f412c4e1537c5
- f4ef70c261014dc6ecb4c5330e71cfe409af03f5

### Stage 3.1 — Planning Conflict Awareness

Status: code implemented, David reported conflict banner works.

Commits:

- 2dbd14167b1f13ee95efae9216512a66c87c9f08
- fafbc65b72cfddc21cc68030a961684bbe0f631e
- 98274af9995c1d50a4ecc6270ba79db930291382
- bef5f3c8c45177e241793e329567f8ae4d964c5e

### Stage 3.2 — Planning Override Action

Status: approved with observations by David screenshot/testing.

Commits:

- fd1e8eb52113f1e0ec9fc921367e4d4bc214cebe
- a19f6264493d3f05722f6db2f17fea2debbbbc05
- d4ec18ae2d3a50f0ebc26303a90e28057a2a7891

### Stage 3.2A — Banner Naming Polish

Status: code implemented, live testing required.

Commits:

- 11e7c2a7aef4862d4aa3ca8fb47c4309304c5d6a — Polish planning banner labels
- 1c9cb62c699ed133fb52e39c073e099b7d11420c — Bump cache for banner naming polish

Cache:

```text
talk-arrangements-v44-banner-naming-polish
```

Expected behavior:

- Active unresolved planning conflicts are titled:
  - English: Active conflicts
  - Spanish: Conflictos activos
- Approved one-year overrides are titled:
  - English: Approved overrides
  - Spanish: Anulaciones aprobadas
- Existing conflict detection, override actions, fixed rules, and storage are unchanged.
- No rollover behavior changed.

Known follow-up request added by David:

- Add clear-row button for Planning rows.
- Clear row should confirm first.
- Clear row should remove congregation, contact, confirmation, date, notes, and related row fields together.
- This prevents stale contact data remaining after congregation is cleared.
- Recommended as Stage 3.3 or Stage 5 polish.

## Stage 3.2A Live Test Checklist

- App loads after cache update.
- Create or use a planning conflict.
- Confirm banner says Active conflicts / Conflictos activos.
- Override one conflict.
- Confirm override banner says Approved overrides / Anulaciones aprobadas.
- Confirm action buttons still work.
- Confirm English/Spanish, light/dark, mobile are usable.

## Next Stage

Stage 3.2A must be live-tested and approved. Then move to Stage 4 — Rollover Integration.

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
