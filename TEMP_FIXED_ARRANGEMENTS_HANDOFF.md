---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-23
owner: David
feature: fixed-arrangement-rules
current_stage: stage-4a-batch-2-live-testing
next_stage: stage-4a-batch-3-preview-engine
cache_version: talk-arrangements-v46-rollover-preview-shell
remove_when: fixed-arrangements-feature-complete-and-live-approved
---

# Temporary Fixed Arrangements Handoff

This file is temporary project memory. If another chat takes over, read this file first.

## Goal

Build a Fixed Arrangement Rules system for the Talk Arrangements app.

The system must allow fixed arrangements that are continuous, limited to selected years, and assigned to one month or multiple months. The system must never silently overwrite existing planning or schedule data.

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
Commits: 39114a9ac255b2d694116196e4e3b71e8ae7f5dd, 86bfacce557a8bd49993560fb212a8d4d75a4c68

### Stage 1 — Fixed Arrangement Data Model
Status: code implemented.
Commits: 4532c9526219766601acce8d7b5aa7eb9ae1ace4, 301555a329a8e5223b3a5033811270a33c877b72

### Stage 2 — Fixed Arrangements Manager UI
Status: approved by David.
Commits: ac49fb8d96c4d66aa7a9d9474c00458d1982ff2b, c6f12154e2fe99f4ac2e0863cafca38bf81a88c6

### Stage 2.1 — Fixed Arrangements Manager UX Cleanup
Status: code implemented, David reported it works.
Commits: b2be195ee71709da84687b53ff484ddd9ce4b08c, f66557e3e80a24e2d265f89fe1e3e06e2be4ba17, a17fc951d3ab72df85d51b4459fc74293466c377, 3a510fa203f1bb3f8e02fc29853ba384de0a1fda

### Stage 3 — Preview and Conflict Engine
Status: code implemented, live testing required.
Commits: 644d946649fc1e6b8089633707fb81728b003ff3, 8d804ffc0bad647cd20dc9508e464756b49d5d09, 169f1a511791b8f7dad45990528f412c4e1537c5, f4ef70c261014dc6ecb4c5330e71cfe409af03f5

### Stage 3.1 — Planning Conflict Awareness
Status: code implemented, David reported conflict banner works.
Commits: 2dbd14167b1f13ee95efae9216512a66c87c9f08, fafbc65b72cfddc21cc68030a961684bbe0f631e, 98274af9995c1d50a4ecc6270ba79db930291382, bef5f3c8c45177e241793e329567f8ae4d964c5e

### Stage 3.2 — Planning Override Action
Status: approved with observations by David screenshot/testing.
Commits: fd1e8eb52113f1e0ec9fc921367e4d4bc214cebe, a19f6264493d3f05722f6db2f17fea2debbbbc05, d4ec18ae2d3a50f0ebc26303a90e28057a2a7891

### Stage 3.2A — Banner Naming Polish
Status: code implemented, live testing required.
Commits: 11e7c2a7aef4862d4aa3ca8fb47c4309304c5d6a, 1c9cb62c699ed133fb52e39c073e099b7d11420c, 0455de88231940751279ce0849e1d9e8a9a10660
Cache: talk-arrangements-v44-banner-naming-polish

### Stage 4A — Rollover Preview and Review
Status: batch 2 code implemented, live testing required.
Batch 1 — bootstrap only.
Commits:
- b4b5243d90199dd18e871bbdacd0ab9cc1dd2302 — Add rollover preview placeholder/bootstrap file
- eaa928b0a79e5eaf15a41cd60bb5028402e35995 — Load rollover preview bootstrap
- 181935a96b44c046429024b1881cecb72805edb0 — Bump cache for rollover preview bootstrap
- 0cb8acb368a3fca184c1ac69d5bd44ea70a43a53 — Update handoff for rollover preview bootstrap

Batch 2 — UI shell only.
Commits:
- fc6cb8f52a65527d71d3e5c17333c1f9b948f3b6 — Add rollover preview UI shell
- 8f679a1bc9acfdff1ccf0c930b9f1915c8d22e61 — Bump cache for rollover preview shell

Cache: talk-arrangements-v46-rollover-preview-shell
Expected behavior:
- Preview Rollover / Vista previa button appears near Next Year.
- Modal opens.
- Modal shows source year and target year selectors.
- Modal shows placeholder note only.
- Apply button is disabled.
- No preview calculation yet.
- No data changes.
- No rollover logic changes.

Known follow-up request added by David:
- Add clear-row button for Planning rows.
- Clear row should confirm first.
- Clear row should remove congregation, contact, confirmation, date, notes, and related row fields together.
- This prevents stale contact data remaining after congregation is cleared.
- Recommended as Stage 3.3 or Stage 5 polish.

## Stage 4A Batch 2 Live Test Checklist

- App loads after cache update.
- Preview Rollover button appears near Next Year.
- Modal opens and closes.
- Source/Target year selectors appear.
- Apply button is disabled.
- No data changes after closing.
- English/Spanish labels are acceptable.
- Mobile/desktop layout usable.
- No console errors.

## Next Stage

Stage 4A Batch 3 — preview engine. Calculate safe/year-specific/skipped/conflict/override counts, but keep rendering simple.

## Later Stages

Stage 4A Batch 4 — render preview results.
Stage 4A Batch 5 — polish and approval.
Stage 4B — Apply Rollover.
Stage 4.5 — Hybrid Mode: manual or automatic, with safety checks.
Stage 5 — QA and Planning row clear button.
Future only: message scheduler, push notifications, optional auto-send backend.

## Files Involved

- js/dashboard-notes.js
- js/fixed-preview.js
- js/fixed-manager-ux.js
- js/planning-conflicts.js
- js/rollover-preview.js
- sw.js
- js/a11y.js
- TEMP_FIXED_ARRANGEMENTS_HANDOFF.md

## Final Cleanup

When the Fixed Arrangements feature is complete and live-approved, delete this file:

TEMP_FIXED_ARRANGEMENTS_HANDOFF.md
