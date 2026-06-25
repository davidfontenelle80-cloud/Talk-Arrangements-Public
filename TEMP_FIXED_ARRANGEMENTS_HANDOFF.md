---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-25
owner: David
feature: fixed-arrangement-rules-and-planning-ux
current_stage: stage-9-reminders-blocked-requires-changes
next_stage: stage-9-reminders-repair
cache_version: talk-arrangements-v86-stage-9-reminders
remove_when: feature-complete-qa-complete-mobile-desktop-light-dark-english-spanish-export-import-cloud-live-approved
---

# Temporary Fixed Arrangements Handoff

## Current Status

Stage 8C was live-approved at v85. Stage 9 reminders were then implemented at v86, but live testing found blockers.

## Stage 9 Live Testing Findings

### Blocking Issue 1 — UI text mojibake / encoding corruption
- Live app displays corrupted strings such as `pÃ...` in Spanish headings, tabs, button labels, and descriptions.
- Repo inspection confirms mojibake in `js/app.js` translation strings.
- Emergency helper patch added in `js/i18n.js` to define corrected visible strings after app load.
- Commit: 4fa3a76f
- This is a temporary mitigation. A proper follow-up should repair `js/app.js` source encoding directly.

### Blocking Issue 2 — `sanitizeInlineArg` missing
- Live error: `ReferenceError: Can't find variable: sanitizeInlineArg` at app.js:1267:43.
- Cause: `renderReminders()` calls `sanitizeInlineArg(rem.id)` but no global function existed.
- Emergency helper patch added global `window.sanitizeInlineArg` in `js/i18n.js`, which loads before `js/app.js`.
- Commit: 4fa3a76f

### Blocking Issue 3 — reminders do not notify when app is closed
- Current Stage 9 implementation uses in-page `setTimeout()` and `new Notification()` from `js/app.js`.
- This can only work while the app/page is open and active.
- It cannot guarantee notifications while the installed PWA/Safari is closed or suspended.
- This does not satisfy David's Version 1.0 requirement: notification must fire on the selected date/time even with the app closed.
- Required: redesign using real Web Push/service-worker push architecture or clearly document platform limits before approval.

### Cache / deployment note
- Current `sw.js` still reports `talk-arrangements-v86-stage-9-reminders`.
- Cache bump to v87 was attempted but blocked by tooling. Worker should bump cache in next repair.

## Stage 8C Bugs Found & Fixed (Live Verification 2026-06-25)

### Bug 1 — Double-comma SyntaxError (CRITICAL)
- **Symptom**: App crashed on load with `Uncaught SyntaxError: Unexpected token ','  at app.js:16:7`
- **Root cause**: Stage 8C appended Spanish event translation keys as top-level properties of the T translations object with a leading comma.
- **Fix**: Moved orphaned ES keys into the `es:{}` block before its closing `}`
- **Commit**: 22ab9768

### Bug 2 — Stale Event Manager CSS injected after </html> (HIGH)
- **Symptom**: Raw CSS text rendered visibly in page body below the error modal
- **Root cause**: Stage 8C cleanup moved Event Manager CSS into `css/components.css` but forgot to remove the original CSS block from `index.html`
- **Fix**: Stripped everything after `</html>` in index.html
- **Commit**: 3e11133e

### Bug 3 — Event modal HTML placed after script tag (HIGH)
- **Symptom**: `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` at app.js:1172:46 on every page load.
- **Root cause**: Stage 8C added the #eventModal div AFTER the `<script src="js/app.js">` tag. The app has no DOMContentLoaded wrapper; wiring runs at parse time.
- **Fix**: Moved the #eventModal block to before the script tag.
- **Commit**: 1c63a7b1

### Bug 4 — stage8c_applyBadges() not called after saveEvent/deleteEvent (HIGH)
- **Symptom**: After adding a BLOCKING or ADVISORY event, badges did NOT appear on Planning rows until page refresh.
- **Root cause**: saveEvent and deleteEvent both called renderEvents() but did NOT call stage8c_applyBadges().
- **Fix**: Added stage8c_applyBadges() after renderEvents() in both saveEvent and deleteEvent.
- **Commit**: 360575fb

## Version 1.0 Reminder / Push Notification Requirement

David confirmed reminders and push notifications are part of the Version 1.0 release scope, not a post-release enhancement.

Required reminder design:
- User can set the exact reminder date.
- User can set the exact reminder time.
- Notification fires on that selected date and time.
- Reminder can attach to an arrangement, event, or note/task where appropriate.
- Reminder title and optional note should be user-editable.
- Editing a reminder must update the scheduled notification.
- Deleting a reminder must cancel the scheduled notification.
- Notification permission flow must be handled clearly.
- iOS/PWA behavior must be tested on the installed app.
- Android/PWA behavior should be tested where applicable.
- Time-zone safe scheduling is required.

## Completed Stages / Batches

- Stage 4C / Fixed Arrangement Conflict Workflow: COMPLETE
- Stage 5A / Planning and Mobile UX: COMPLETE
- Stage 5B / Notes Foundation: CODE IMPLEMENTED
- Stage 6 / UX Polish: COMPLETE
- Stage 8A / Calendar Event Foundation: COMPLETE
- Stage 8B / Calendar Rendering & Dashboard Integration: COMPLETE
- Stage 8C / Calendar Intelligence: LIVE APPROVED
- Stage 9 / Date-Time Reminders: REQUIRES CHANGES / BLOCKED

## Cache History

- v77: Stage 8A calendar event foundation
- v78: Stage 8B calendar rendering & dashboard integration
- v79: Stage 8C calendar intelligence
- v80-v85: Stage 8C bugfix/live approval series
- v86: Stage 9 reminders implementation with blockers

## Required Next Repair

1. Properly repair `js/app.js` encoding/translation strings, not only patch after load.
2. Fix or remove reliance on `sanitizeInlineArg` in app.js, or keep a well-documented global helper.
3. Decide notification architecture:
   - If true closed-app notifications are required, implement real Web Push/service-worker push with backend/scheduled trigger support.
   - If no backend is being added, clearly document that reminders only fire while the app is open/active and do not approve as meeting Version 1.0 push requirement.
4. Bump service worker cache after repair.
5. Re-test mobile, desktop, EN/ES, calendar, reminders, cloud backup, export/import.

## Stop Conditions

Stop before Release Candidate if:
- App still shows mojibake.
- Reminder tab throws JS errors.
- Calendar/Event button actions do not respond.
- Notifications do not meet the agreed Version 1.0 requirement.
- Any cloud/export/import regression appears.
