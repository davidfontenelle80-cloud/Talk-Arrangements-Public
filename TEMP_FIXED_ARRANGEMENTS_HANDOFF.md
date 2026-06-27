---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-06-26
owner: David
feature: fixed-arrangement-rules-and-planning-ux
current_stage: stage-9a-final-frontend-polish-code-implemented-pending-live-review
next_stage: stage-9a-live-verification-then-stage-9b-push-backend
cache_version: talk-arrangements-v95-stage-9a-live-verification
remove_when: feature-complete-qa-complete-mobile-desktop-light-dark-english-spanish-export-import-cloud-live-approved
---

# Temporary Fixed Arrangements Handoff

## Current Status

Stage 8C was live-approved at v85. Stage 9 reminders were then implemented at v86, but live testing found blockers. Codex completed a Stage 9 regression repair in commit `c61357b`, but Stage 9 is still not approved because true closed-app reminders require backend/Web Push scheduling that is not present in this repo.

Update after David live test on 2026-06-26:
- Live app still shows old Stage 9 failures: `escHtml` error, visible `</main>`, mojibake in Events, and imperfect mobile tabs.
- Local `main` is ahead of the local `origin/main` tracking ref by `c61357b` and `f9dd9cc`; these commits were not confirmed pushed when this note was added.
- Before new feature work, push local commits to `origin/main` and verify GitHub Pages/service-worker cache activation.
- After deployment gap is resolved, complete the requested Stage 9 UI polish sweep and inspect/adapt the NoClip push notification architecture.
- Do not start Release Candidate or Stage 10.

Approval classification: `BLOCKED`

Deployment classification: code implemented, not live approved

Cache before repair: `talk-arrangements-v87-stage-9-repair`

Cache after repair: `talk-arrangements-v88-stage-9-regression-repair`

## Stage 9 Final Repair / Live Gap Update (2026-06-26)

David's live iPhone test still shows visible Stage 9 blockers after the local v88 repair:
- Raw broken markup is still visible on the live site.
- Live Reminder tab can still hit `ReferenceError: Can't find variable: escHtml`.
- Live Events/Planning/Message text still shows source mojibake/gibberish.
- Five-tab mobile navigation still needs a polished, intentional horizontal scroll treatment.
- Planning, Congregations, message/contact actions, Events, and Reminders need an iPhone polish sweep.
- True closed-app push reminders still need a NoClip-style Web Push architecture or a documented backend credential blocker.

Remote/live source comparison:
- Local `main` contains commits `c61357b`, `f9dd9cc`, and `70eec14`.
- Direct `git push origin main` failed because GitHub rejected the local credentials.
- GitHub remote `sw.js` reports `talk-arrangements-v90-remote-emergency-repair`.
- Remote `index.html`, `js/app.js`, `js/i18n.js`, and `TEMP_FIXED_ARRANGEMENTS_HANDOFF.md` are still behind the intended source-level repair and retain emergency/runtime mitigation patterns.

Required repair target:
- Apply final source-level repairs locally.
- Bump cache to `talk-arrangements-v91-stage-9-final-repair`.
- Add safe push-notification frontend/service-worker architecture copied from the NoClip pattern, without committing private secrets.
- If Talk Arrangements Cloudflare Worker URL, VAPID public key, or Worker secrets are missing, document the exact Cloudflare configuration required and keep closed-app reminders blocked.
- Deploy using GitHub API updates if direct git push remains unavailable.
- Do not start Release Candidate or Stage 10.

## Stage 9 Final Repair / Polish / Push Architecture (2026-06-26)

Implementation commit: `6a84f0b`

Merge/deployment commit: `7a7bb57`

Files changed:
- `index.html`
- `js/app.js`
- `js/push.js`
- `css/main.css`
- `sw.js`
- `TEMP_FIXED_ARRANGEMENTS_HANDOFF.md`

Cache before final repair:
- Remote/live emergency cache: `talk-arrangements-v90-remote-emergency-repair`
- Previous local repair cache: `talk-arrangements-v88-stage-9-regression-repair`

Cache after final repair:
- `talk-arrangements-v91-stage-9-final-repair`

Bugs fixed in source:
- Kept malformed Events/Reminders/main markup repaired in `index.html`.
- Added `js/push.js` before `js/app.js` in load order.
- Kept common `escHtml()` and `sanitizeInlineArg()` helpers in `js/app.js`.
- Removed Reminder tab inline action string injection for list/add/permission actions; list actions now use delegated `data-reminder-action` handlers.
- Replaced tiny event edit/delete icon buttons with readable text buttons.
- Replaced calendar month arrow source characters with HTML entities and added aria labels.
- Spanish weekday labels now render as `DOM`, `LUN`, `MAR`, `MIÉ`, `JUE`, `VIE`, `SÁB`.
- Escaped calendar detail text.
- Styled Reminder cards, Reminder callouts, Event cards, calendar cells, contact/template areas, tables, and mobile tabs.
- Bumped service worker cache and added `push` plus improved `notificationclick` handling.

Push architecture result:
- `js/push.js` implements the safe NoClip-style frontend pattern: `subscribe`, `diagnose`, `sendTestPush`, `syncReminder`, and `clearReminder`.
- `sw.js` implements `push` event handling with `self.registration.showNotification()` and notification click handling that opens/focuses the app.
- Reminder save/delete now call `TalkPush.syncReminder()` and `TalkPush.clearReminder()` when push is configured.
- No private Worker secret, VAPID private key, or shared auth secret was committed.
- Closed-app push is still blocked until David provides and deploys the Talk Arrangements Cloudflare Worker setup.

Cloudflare configuration required for true closed-app reminders:
- Deploy a Talk Arrangements Worker URL, for example `https://talk-arrangements-push.<account>.workers.dev`.
- Generate a Talk Arrangements VAPID key pair.
- Put the VAPID public key in safe frontend config as `window.TALK_ARRANGEMENTS_PUSH_CONFIG.vapidPublicKey`.
- Put the VAPID private key only in Cloudflare Worker environment variables.
- Configure Worker environment variables for VAPID subject/contact email and any server-side auth/shared secret if the Worker design requires one.
- Configure durable storage for subscriptions and scheduled reminders, such as KV, D1, or Durable Objects.
- Add a scheduled Worker trigger/cron to find due reminders and send Web Push at the selected date/time.
- Implement/verify Worker endpoints: `POST /api/subscribe`, `POST /api/reminders`, `DELETE /api/reminders/:sourceType/:sourceId`, and optional `POST /api/test-push`.
- Add CORS allowlist for the GitHub Pages origin.

Tests run:
- Source scan found no UTF-8 mojibake markers, replacement-character markers, visible `/main>`, or old Reminder inline-handler markers in the edited source set.
- Verified Events/Reminders/main source structure: `<section id="events">`, `<section id="reminders">`, and proper `</main>`.
- JavaScript syntax parsed successfully for `js/app.js`, `js/push.js`, and `sw.js` using Node VM parser in the local runtime.
- Verified `sw.js` cache string is `talk-arrangements-v91-stage-9-final-repair` and precaches `./js/push.js`.
- Merged remote emergency commits `ac99e2d`, `39ef6fa`, and `ed768f2` into local history without keeping the emergency runtime patch in `js/i18n.js`.
- Pushed `main` to remote commit `7a7bb57`.
- Live GitHub Pages `sw.js` verified at `talk-arrangements-v91-stage-9-final-repair` with `push` handler and `./js/push.js`.
- Live `index.html` verified with no standalone malformed `<` or `/main>` lines, and with `js/push.js` loaded before `js/app.js`.
- Live `js/app.js` verified with `escHtml()`, `sanitizeInlineArg()`, and `TalkPush` hooks.
- Live `js/i18n.js` verified without `stage9Emergency`, `window.escHtml`, `sanitizeInlineArg`, or `removeBrokenRawMainTextNodes` emergency patches.
- Live `js/push.js` verified with `window.TalkPush`, no `PUSH_SECRET`, no pasted GitHub token, and missing public Worker/VAPID config clearly detectable.

Testing not completed:
- In-app Browser blocked `127.0.0.1`, `localhost`, and `file://` app loads in this session, so interactive local UI testing, screenshots, export/import flows, and calendar/reminder CRUD were not browser-verified after this final polish pass.
- Direct `git push origin main` hung on credentials. A direct HTTPS push using David-provided temporary credentials succeeded, and live source checks now show v91.
- Cloud backup was not live-authenticated or written to Firebase.
- Push test and closed-app notification delivery were not verified because Talk Arrangements Worker URL and VAPID public key are not configured.

Approval classification: `BLOCKED`

Deployment classification: code implemented and pushed to `origin/main`, not live approved

Recommended next stage:
- Live-test v91 on David's devices, then configure and test the Talk Arrangements Cloudflare Worker push backend. Do not start Release Candidate or Stage 10.

## Stage 9 Final Polish + Push Backend Intake (2026-06-26)

Starting repo/MD comparison:
- Local repo is at merge/deployment commit `7a7bb57` plus an uncommitted handoff update documenting the v91 live-source verification.
- Live/source cache is still `talk-arrangements-v91-stage-9-final-repair`.
- Source still needs JW-correct event terminology cleanup in `js/app.js` and `index.html`.
- Source still uses the candle icon for Memorial/Conmemoración and must change to `🍷` if it renders safely.
- Push frontend/service-worker architecture exists, but the Talk Arrangements Cloudflare Worker URL and VAPID public key are not configured in frontend source.
- No Cloudflare Worker files/config are currently present in the repo.
- True closed-app reminder notifications remain blocked until the Worker, VAPID keys, subscription/reminder storage, scheduled trigger, and CORS are configured and verified.

Required final polish target:
- Bump cache to `talk-arrangements-v92-stage-9-final-polish-push` unless v92 already exists.
- Replace event labels with JW-correct EN/ES terminology.
- Replace Memorial/Conmemoración icon with `🍷` everywhere the event type is rendered from source.
- Continue mobile polish for planning/congregation table readability, message/contact card spacing, larger edit/delete targets, event dropdown spacing, clean calendar controls/weekdays, and no mojibake.
- Finish or document the Cloudflare push backend exactly. Do not commit private secrets.
- If Cloudflare credentials/secrets are missing, stop and list exactly what David must configure.
- Do not start Release Candidate or Stage 10.

## Stage 9A Final Frontend Polish Intake (2026-06-27)

Scope update:
- Stage 9A is frontend/UI polish only.
- Cloudflare Workers, VAPID, Push API backend, KV, D1, cron jobs, subscription storage, and closed-app notification backend work are moved to a separate future Stage 9B.
- Missing Cloudflare backend credentials are no longer a stop condition for Stage 9A.
- Do not start Release Candidate or Stage 10.

Stage 9A required fixes:
- Eliminate remaining source/visible mojibake and encoding issues across the app.
- Use JW-correct event terminology everywhere in EN/ES.
- Replace the Memorial/Conmemoración candle icon with a cleaner memorial icon.
- Improve mobile planning/congregation table readability with intentional horizontal scrolling and wider columns.
- Improve action button tap targets, spacing, alignment, and clarity.
- Polish Add/Edit Event modal spacing, layout, typography, and controls.
- Polish calendar headers, navigation, filters, dark mode, empty state, and event indicators.
- Polish Reminder cards, spacing, typography, badges, and actions.
- Review Dashboard, Planning, Congregations, Events, Reminders, and Settings at mobile/tablet/landscape widths.
- Audit translations for mixed language, capitalization, and untranslated labels.
- Improve touch targets, contrast, focus states, and labels where safe.

Stage 9A cache target:
- `talk-arrangements-v94-stage-9a-final-polish`

Stage 9A source fixes completed:
- Corrected event terminology in `js/app.js`, `index.html`, and `js/unified-note-modal.js`.
- Event types now use `Circuit Overseer Visit`, `Circuit Assembly`, `Regional Convention`, `Special Talk`, and `Memorial`.
- Spanish event types now use `Visita del Superintendente de Circuito`, `Asamblea de Circuito`, `Asamblea Regional`, `Discurso Especial`, and `Conmemoración`.
- Replaced the Memorial/Conmemoración candle icon source with an encoding-safe wine-glass symbol escape.
- Event type dropdown options are rebuilt from the canonical `EVENT_TYPES` list so EN/ES language switches update the Add/Edit Event modal.
- Increased planning and congregation table minimum widths and column widths so names remain readable with intentional horizontal scrolling.
- Improved table row height, input height, contact card spacing, message template padding, event modal fields, color swatches, modal footer layout, and focus-visible states.
- Bumped service worker cache to `talk-arrangements-v94-stage-9a-final-polish`.

Stage 9A tests run so far:
- Source scan found no active app-source UTF-8 mojibake markers or replacement-character markers.
- JavaScript syntax parsed successfully for `js/app.js`, `js/unified-note-modal.js`, `js/push.js`, `js/i18n.js`, and `sw.js`.

Stage 9A tests still required after deployment:
- Mobile/tablet/desktop visual review.
- Screenshot review.
- Live EN/ES review.
- Live calendar, event, reminder, cloud backup, export/import, and light/dark regression checks.

Stage 9A v94 live verification issue found:
- Live GitHub Pages served `talk-arrangements-v94-stage-9a-final-polish` and `css/main.css?v=stage9a-v94`.
- Mobile live DOM checks found no mojibake, no visible malformed main markup, no console errors, correct event terminology, correct Memorial/Conmemoración icon, and intentional horizontal table scrolling.
- Spanish Congregations table still rendered the email column as `EMAIL ADDRESS` because the static header used the generic `data-i18n="email"` key, which is overwritten by the shared i18n layer.
- Required source-only fix before Stage 9A live approval: change that header to the app-specific email label key so Spanish renders `Correo`.

Stage 9A v95 live-verification fix:
- Changed the Congregations email table header from `data-i18n="email"` to the app-owned `data-i18n="mail"` key so EN remains `Email` and ES renders `Correo`.
- Bumped service worker cache from `talk-arrangements-v94-stage-9a-final-polish` to `talk-arrangements-v95-stage-9a-live-verification`.

## Stage 9 Regression Repair (2026-06-26)

Repair commit: `c61357b`

Files changed:
- `index.html`
- `js/app.js`
- `js/i18n.js`
- `css/main.css`
- `css/components.css`
- `sw.js`

Bugs fixed:
- Repaired malformed Events/Reminders/main markup in `index.html`; no stray `<` or visible `/main>`.
- Added common `escHtml()` and `sanitizeInlineArg()` helpers in `js/app.js` before renderers use them.
- Repaired source mojibake in `index.html`, `js/app.js`, and `css/components.css`.
- Moved the mobile 5-tab nav fix into `css/main.css`.
- Removed emergency helper, DOM cleanup, and injected nav CSS patches from `js/i18n.js`.
- Fixed calendar refresh after event save/delete by re-rendering the calendar and upcoming-events widget.
- Fixed reminder edit date/time behavior to use local date values instead of UTC `toISOString()` date extraction.
- Bumped service worker cache to `talk-arrangements-v88-stage-9-regression-repair`.

Tests run locally against `127.0.0.1` static test origin:
- App booted with no console errors.
- No visible raw `<`, `/main>`, or `</main>` text.
- No mojibake detected in visible ES or EN text.
- Dashboard, Planning, Congregations, Events, and Reminders tabs rendered.
- Events calendar rendered; previous month and next month buttons worked.
- Event type filter worked.
- Add Event opened modal.
- Save Event added event to list, calendar cell, and upcoming widget.
- Event persisted after reload.
- Event day details opened from the calendar.
- Delete Event removed event from list and calendar.
- Reminder tab rendered without `escHtml` or `sanitizeInlineArg` errors.
- Add Reminder opened modal.
- Reminder title, note, date, and time fields worked.
- Reminder saved and appeared in the list.
- Reminder persisted after reload.
- Reminder edit worked without shifting a late-night date to the next day.
- Reminder delete worked.
- Permission UI did not crash; local browser showed notifications denied.
- Mobile iPhone-width EN/ES nav had `overflow-x:auto`, no tab-label overlap, and no mojibake.
- Settings/cloud backup controls rendered with no console errors.

Not fully verified locally:
- Export JSON download event timed out in the browser harness for the Blob URL, though source wiring for toolbar and settings export remains present.
- Import JSON file-picker flow was not completed in the browser harness.
- Cloud backup was not live-authenticated or written to Firebase; only controls/no-error rendering was verified.
- Live GitHub Pages deployment was not verified.

Notification architecture result:
- Current reminders are in-app reminders only. They use in-page timers and `Notification` while the app/page is active.
- True closed-app notification delivery is not implementable with this static-only repo alone. It requires a service worker push architecture plus push subscription, VAPID/public key setup, backend or scheduled cloud trigger, notification click handling, and iOS PWA testing.
- Because David's Version 1.0 requirement is exact date/time reminders that fire even when the app is closed, Stage 9 remains `BLOCKED`.

Remaining risks:
- Export/import and cloud backup need live browser/account verification before approval.
- Closed-app reminders need an architecture decision and backend/cloud scheduling plan.
- David still needs to live-test and approve before any Release Candidate work.

Recommended next stage:
- Stage 9 notification architecture decision and live verification. Do not start Release Candidate or Stage 10.

## Supervisor Emergency Repair Pass

Commit: `8212e551`

File changed:
- `js/i18n.js`

What was repaired safely:
- Added global `window.escHtml` fallback to stop the live `ReferenceError: Can't find variable: escHtml` from crashing the Reminder tab.
- Kept/verified global `window.sanitizeInlineArg` fallback for reminder inline actions.
- Added a DOM cleanup pass to remove visible raw text nodes caused by malformed `index.html`, including `<`, `/main>`, and `</main>`.
- Added emergency mobile nav layout CSS injection so the 5-tab row scrolls horizontally instead of overlapping on iPhone.

Important limitations:
- These emergency source blockers were repaired in commit `c61357b`.
- Closed-app notifications are still not solved; current reminder architecture is in-app timer based.

## Repo Comparison Before Stage 9 Regression Repair (2026-06-26)

Current repo differs from the previous handoff in these ways:
- `sw.js` cache is already `talk-arrangements-v87-stage-9-repair`, not `talk-arrangements-v86-stage-9-reminders`.
- `js/app.js` contains a local `sanitizeInlineArg()` near reminder rendering, but it is not defined once near common utilities.
- `js/app.js` still calls `escHtml()` from reminder rendering without a proper source definition.
- `index.html` still contains malformed source near Events/Reminders with a visible `/main>` text node.
- `js/i18n.js` still contains emergency fallback helpers, DOM cleanup, and injected mobile nav CSS.
- Mojibake remains in `index.html`, `js/app.js`, and `css/components.css`.
- Stage 9 remains blocked and requires regression repair; do not advance to Release Candidate.

## Stage 9 Live Testing Findings

### Blocking Issue 1 — UI text mojibake / encoding corruption
- Live app displayed corrupted Spanish strings in headings, tabs, button labels, and descriptions.
- Repo inspection confirms mojibake in `js/app.js` translation strings and some `index.html` static text.
- Emergency helper patch in `js/i18n.js` only mitigates part of the problem.
- Proper follow-up must repair `js/app.js` and `index.html` source directly.

### Blocking Issue 2 — missing helper functions
- Live errors observed:
  - `ReferenceError: Can't find variable: sanitizeInlineArg`
  - `ReferenceError: Can't find variable: escHtml`
- Emergency fallback helpers were added in `js/i18n.js` because it loads before `js/app.js`.
- Proper follow-up should define helpers in `js/app.js` near common utilities or avoid inline onclick strings.

### Blocking Issue 3 — malformed `index.html`
- Repo inspection shows malformed markup near Events/Reminders:
  - stray `<`
  - visible `/main>` instead of proper `</main>`
- Emergency DOM cleanup removes visible raw text after load, but source must be fixed.

### Blocking Issue 4 — mobile 5-tab overlap
- Stage 9 added a fifth tab, Reminders/Recordatorios.
- Mobile nav labels overlap in the live app.
- Emergency injected CSS makes nav horizontally scrollable, but source CSS should be fixed permanently.

### Blocking Issue 5 — reminders do not notify when app is closed
- Current Stage 9 implementation uses in-page `setTimeout()` and `new Notification()` from `js/app.js`.
- This can only work while the app/page is open and active.
- It cannot guarantee notifications while the installed PWA/Safari is closed or suspended.
- This does not satisfy David's Version 1.0 requirement: notification must fire on the selected date/time even with the app closed.
- Required: redesign using real Web Push/service-worker push architecture or clearly document platform limits before approval.

### Cache / deployment note
- Current `sw.js` reports `talk-arrangements-v88-stage-9-regression-repair`.
- This code has not been live-approved.

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
- Stage 9 / Date-Time Reminders: CODE REPAIRED LOCALLY / BLOCKED ON CLOSED-APP NOTIFICATIONS

## Cache History

- v77: Stage 8A calendar event foundation
- v78: Stage 8B calendar rendering & dashboard integration
- v79: Stage 8C calendar intelligence
- v80-v85: Stage 8C bugfix/live approval series
- v86: Stage 9 reminders implementation with blockers
- v87-stage-9-repair: partial Stage 9 repair in repo history, still blocked by malformed HTML, mojibake, temporary emergency patches, missing common `escHtml()`, and closed-app notification architecture gap
- v88-stage-9-regression-repair: Codex regression repair commit `c61357b`; source regressions locally repaired, Stage 9 still blocked on true closed-app notification architecture

## Required Next Repair

1. Decide and implement the real closed-app notification architecture, or formally reduce Stage 9 scope to in-app-only reminders.
2. Live-test deployed v88 on David's target device(s).
3. Verify export JSON, import JSON, and cloud backup on the live app/account.
4. Only after David live-approves Stage 9 should Release Candidate work begin.

## Stop Conditions

Stop before Release Candidate if:
- App still shows mojibake.
- Reminder tab throws JS errors.
- Calendar/Event button actions do not respond.
- Mobile tabs overlap.
- Notifications do not meet the agreed Version 1.0 requirement.
- Any cloud/export/import regression appears.
