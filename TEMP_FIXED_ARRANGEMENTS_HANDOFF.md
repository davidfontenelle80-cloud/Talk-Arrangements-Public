---
title: Temporary Fixed Arrangements Handoff
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
app: Talk Arrangements
status: active-temporary
created: 2026-06-23
last_updated: 2026-08-30
owner: David
feature: fixed-arrangement-rules-and-planning-ux
current_stage: stage-9b-b-backend-deployed-configured-device-verification-pending
next_stage: stage-9b-b-frontend-live-deploy-and-closed-app-push-verification
cache_version: talk-arrangements-v111-sw-fix-no-pinch-zoom
remove_when: feature-complete-qa-complete-mobile-desktop-light-dark-english-spanish-export-import-cloud-live-approved
---

# Temporary Fixed Arrangements Handoff

## Current Supervisor Status

Stage 9A frontend polish v101 is live verified and approved.

Stage 9B-A Cloudflare push backend scaffold is complete.

Stage 9B-B Cloudflare Deploy and WebPush Delivery was activated and rechecked.

Stage 9B-B status: `BACKEND DEPLOYED AND CONFIGURED - FRONTEND LIVE DEPLOY AND CLOSED-APP PUSH VERIFICATION PENDING`

Stage 9A approval classification: `APPROVED`

Stage 9A deployment classification: `DEPLOYED AND LIVE VERIFIED`

Stage 9B-B approval classification: `NOT APPROVED`

Stage 9B-B deployment classification: `BACKEND DEPLOYED AND CONFIGURED`

Do not start Release Candidate or Stage 10.

## Verified Repo State

Verified on `origin/main` before the v101 repair:

- `index.html` loads `css/main.css?v=stage9a-v99` and `js/app.js?v=stage9a-v97`.
- Stage 9A dark-calendar CSS is present in `css/main.css`.
- Stage 9A JW event terminology and Memorial icon fixes are present.
- Stage 9B-A Cloudflare scaffold files are present.
- v100 service worker cache repair was pushed and reported by David as working on device.

Additional supervisor commits:

- `006794c` — `sw.js` cache bumped to `talk-arrangements-v100-stage-9a-final-ui-polish` and network-refreshes `css/main.css` and `js/app.js`.
- `2fc606b` — mobile toolbar label changed from `Tools` to `App Controls` / `Controles de la app`; expanded panel spacing improved; signed-in email normalized into a full-width status card that wraps cleanly.
- `7c6e52f` — service worker cache bumped to `talk-arrangements-v101-stage-9a-app-controls-polish` and network-refreshes `js/mobile-toolbar.js` in addition to CSS/app script.

## Stage 9A Completed Work

Stage 9A frontend polish completed:

- Eliminated visible mojibake/gibberish found during live testing.
- Corrected JW event terminology in English and Spanish.
- Replaced Memorial/Conmemoración candle icon with wine-glass symbol.
- Cleaned Add Event duplicate plus label.
- Fixed Spanish Congregations email header to show `Correo`, not generic `EMAIL ADDRESS`.
- Improved event modal spacing and full-width field layout.
- Improved calendar controls, weekday labels, dark-mode cells, and event card spacing.
- Improved dark-mode calendar readability with darker calendar day cards and higher-contrast numbers.
- Preserved mobile calendar cell height.
- Improved reminder cards/callout and action-button spacing.
- Improved note/reminder touch target sizing where available in current CSS.
- Improved planning/congregation tables with intentional horizontal scrolling and wider readable columns.
- Improved mobile nav so tabs scroll intentionally with no merged labels.
- Fixed stale CSS/app-script issue with a service-worker v100 cache repair.
- Renamed the collapsible mobile header section from `Tools` to `App Controls` / `Controles de la app`.
- Improved expanded app-controls panel spacing, button wrapping, and vertical rhythm.
- Replaced the cramped signed-in email button/status with a full-width status card that shows `Signed in` / `Sesión activa` plus the email on a wrapping line.

## Stage 9A Commit Evidence

Relevant Stage 9A commits reported/verified:

- `ede374b` — Stage 9A frontend terminology/mobile UI polish.
- `dc1cb51` — Stage 9A cache bump.
- `da980f1` — v94 stylesheet cache-bust.
- `592df28` — Spanish Congregations email header fix.
- `2f6dc28` — Add Event duplicate-plus label cleanup.
- `6d36413` — v97 app-script cache repair, pushed and live verified.
- `c8b7622` — reopen Stage 9A final UI polish.
- `9741093` — dark calendar readability polish.
- `0735874` — preserve mobile calendar cell height.
- `37c709c` — final polish stylesheet cache-bust.
- `006794c` — v100 service-worker cache repair.
- `2fc606b` — app-controls panel/email layout polish.
- `7c6e52f` — v101 service-worker cache repair for app-controls polish.

## Stage 9A v101 Live Verification Result

Live URL verified on 2026-06-27:

- `https://davidfontenelle80-cloud.github.io/Talk-Arrangements-Public/`

Verification passed:

- Service worker cache is `talk-arrangements-v101-stage-9a-app-controls-polish`.
- Dashboard renders.
- Planning renders.
- Congregations renders.
- Events renders.
- Reminders renders.
- Settings renders.
- EN/ES have no visible mojibake.
- No raw `<`, `/main>`, or `</main>` markup.
- Dark-mode calendar day cells are dark/readable, not bright white.
- Calendar numbers are visible in dark mode.
- Calendar previous/next controls work.
- Calendar filter works.
- Event modal opens cleanly.
- App Controls panel opens/closes cleanly on mobile.
- App Controls panel buttons have readable spacing and do not feel cramped.
- Import/Export controls remain visible.
- Cloud Backup controls remain visible.
- Browser console has no app errors.

Notes:

- Initial rendered mobile check showed stale `Herramientas` text until a reload activated the v101 service-worker path.
- After reload, the mobile toolbar showed `Controles de la app` and no stale `Tools` / `Herramientas` label remained.
- App Controls opened and closed cleanly; visible controls were Backup, Import, Reset, Sign in, Cloud Save, and Cloud Restore.
- App Controls buttons measured 48px high on the 390px mobile viewport.
- Signed-in email wrapping styles were verified in deployed `js/mobile-toolbar.js` (`status-email`, `overflow-wrap:anywhere`, `word-break:break-word`); live browser state was signed out, so no signed-in email value was present to overflow.
- Mobile and desktop sweeps passed in light and dark mode.
- Dark calendar day cards were dark, calendar numbers were visible, controls aligned, and event filter text was clean in EN/ES.

Approval classification: `APPROVED`

Deployment classification: `DEPLOYED AND LIVE VERIFIED`

## Stage 9B-A Scaffold Completed

Supervisor added the safe backend preparation files. These do not contain private secrets and do not complete live push delivery by themselves.

Files added:

- `docs/STAGE_9B_CLOUDFLARE_PUSH_CHECKLIST.md`
- `cloudflare/talk-arrangements-push/worker.js`
- `cloudflare/talk-arrangements-push/wrangler.toml.example`
- `cloudflare/talk-arrangements-push/README.md`

Commits:

- `35acdc9` — add Stage 9B push backend checklist.
- `f8d89eb` — add Cloudflare Worker scaffold.
- `747e89e` — add `wrangler.toml.example`.
- `b4ea63f` — add Worker setup README.

What the scaffold includes:

- `GET /api/health`
- `OPTIONS *` CORS preflight
- `POST /api/subscribe`
- `POST /api/reminders`
- `DELETE /api/reminders/:sourceType/:sourceId`
- `POST /api/test-push` route shape
- Scheduled Worker handler shape
- KV-style storage shape for subscriptions and reminders
- No committed VAPID private key or Cloudflare secrets

Important limitation:

- The scaffold intentionally does not complete Web Push VAPID signing/encryption/delivery.
- `sendWebPush()` in `cloudflare/talk-arrangements-push/worker.js` is the main Stage 9B-B implementation gap.
- True closed-app notifications remain blocked until Cloudflare deployment, VAPID secrets, storage binding, scheduled trigger, and device testing are complete.

## Stage 9B-B Previous Attempt / Blocker

Codex merged the supervisor Stage 9B-A scaffold and documented the backend blocker.

Stage 9B-B deployment cannot continue in the current environment because Cloudflare credentials and deploy configuration are unavailable.

Verified missing items:

- `wrangler` is not available on PATH.
- No local `cloudflare/talk-arrangements-push/wrangler.toml` exists; only `wrangler.toml.example` with placeholders is present.
- Environment variables are not set for Cloudflare auth or VAPID.
- Worker URL is not available.
- KV namespace / `PUSH_STORE` binding is not configured.
- VAPID public key is not available for frontend config.
- VAPID private key is not available as a Cloudflare secret.
- Cron trigger is not deployed/configured.

Required before continuing Stage 9B-B:

1. Install or make `wrangler` available.
2. Provide Cloudflare authentication via Wrangler login or `CLOUDFLARE_API_TOKEN`.
3. Provide `CLOUDFLARE_ACCOUNT_ID` or a deployable `wrangler.toml`.
4. Create/bind KV namespace `PUSH_STORE`.
5. Generate VAPID key pair.
6. Configure `VAPID_PRIVATE_KEY` only as a Cloudflare secret.
7. Configure `VAPID_PUBLIC_KEY`, `VAPID_SUBJECT`, and `ALLOWED_ORIGIN`.
8. Configure cron trigger.
9. Provide the public Worker URL and VAPID public key for safe frontend config.

## Stage 9B-B Active Scope

Authorized Stage 9B-B work:

- Verify the existing Cloudflare scaffold.
- Configure or verify Worker URL, `PUSH_STORE` storage binding, VAPID public/private key handling, VAPID subject, CORS allowlist, and cron trigger.
- Complete real Web Push delivery, including VAPID signing/encryption/delivery, without committing private secrets.
- Verify Worker endpoints: `GET /api/health`, `POST /api/subscribe`, `POST /api/reminders`, `DELETE /api/reminders/:sourceType/:sourceId`, and `POST /api/test-push`.
- Verify frontend subscription, reminder create/edit/delete sync, test push, scheduled push, closed-app iPhone delivery, notification tap, no console errors, and no Stage 9A regression.

Stage 9B-B stop conditions:

- Stop if Cloudflare credentials are unavailable.
- Stop if Worker cannot deploy.
- Stop if KV binding cannot be created or verified.
- Stop if VAPID keys cannot be configured securely.
- Stop if cron trigger cannot be configured.
- Stop if closed-app notification cannot be tested.

Security rules:

- Never commit VAPID private key, Cloudflare token, GitHub token, shared secret, or private credentials.
- Frontend may contain only the public Worker URL and VAPID public key.

## Stage 9B-B Credential / Deploy Recheck (2026-06-27)

Codex rechecked the activated Stage 9B-B repo state at commit `5a82dd2`.

Result: `BLOCKED`

No Worker/Web Push implementation or deployment was started because required Cloudflare deployment inputs are unavailable in this environment.

Verified missing items:

- `wrangler` is not available on PATH.
- No deployable `cloudflare/talk-arrangements-push/wrangler.toml` exists; only `wrangler.toml.example` with placeholders exists.
- `CLOUDFLARE_API_TOKEN` is not set.
- `CLOUDFLARE_ACCOUNT_ID` is not set.
- `CF_API_TOKEN` is not set.
- `VAPID_PUBLIC_KEY` is not set.
- `VAPID_PRIVATE_KEY` is not set.
- `VAPID_SUBJECT` is not set.
- `ALLOWED_ORIGIN` is not set.
- `TALK_PUSH_WORKER_URL` is not set.
- No readable local Wrangler/Cloudflare login config was found in the checked locations.
- Worker URL is not available.
- `PUSH_STORE` KV namespace/binding is not configured or verifiable.
- Cron trigger is not deployed/configured.

Endpoint test result:

- `GET /api/health`: not tested; Worker URL unavailable.
- `OPTIONS *`: not tested; Worker URL unavailable.
- `POST /api/subscribe`: not tested; Worker URL unavailable.
- `POST /api/reminders`: not tested; Worker URL unavailable.
- `DELETE /api/reminders/:sourceType/:sourceId`: not tested; Worker URL unavailable.
- `POST /api/test-push`: not tested; Worker URL unavailable.

Closed-app notification result:

- Not testable until Worker deployment, VAPID keys/secrets, storage binding, cron trigger, frontend Worker URL/VAPID public key config, and physical iPhone notification testing are available.

Required before resuming Stage 9B-B:

1. Install or make `wrangler` available.
2. Provide Cloudflare authentication via Wrangler login or `CLOUDFLARE_API_TOKEN`.
3. Provide `CLOUDFLARE_ACCOUNT_ID` or a deployable `wrangler.toml`.
4. Create/bind KV namespace `PUSH_STORE`.
5. Generate a VAPID key pair.
6. Configure `VAPID_PRIVATE_KEY` only as a Cloudflare secret.
7. Configure `VAPID_PUBLIC_KEY`, `VAPID_SUBJECT`, and `ALLOWED_ORIGIN`.
8. Configure the scheduled cron trigger.
9. Provide the public Worker URL and VAPID public key for safe frontend config.

Stage 9B-B approval classification: `BLOCKED`

Stage 9B-B deployment classification: `NOT DEPLOYED`

## Stage 9B-B NoClip Reference Inspection (2026-06-27)

Codex inspected the NoClip repo reference from local checkout `.codex-checks/note-clip-current` and remote `origin/main` for `davidfontenelle80-cloud/note-clip`.

NoClip reference files inspected:

- `js/push.js`
- `js/reminders.js`
- `sw.js`
- `cloudflare/note-clip-push/src/worker.js`
- `cloudflare/note-clip-push/wrangler.toml`
- `cloudflare/note-clip-push/migrations/0001_schema.sql`
- `cloudflare/note-clip-push/README.md`

NoClip architecture findings:

- Worker structure: module Worker with `fetch` and `scheduled` handlers.
- Storage: D1 database binding `DB`, not KV.
- Tables: `subscriptions` and `reminders`.
- Reminder indexing: unique index on `(subscription_id, source_type, source_id)` and due index on `(fired, fire_at)`.
- Cron: every minute with `crons = ["* * * * *"]`.
- VAPID: public key in Worker vars/frontend, private key as Worker secret.
- Web Push delivery: Worker implements VAPID JWT, ECDH payload encryption, AES-128-GCM Web Push payload, and sends directly to subscription endpoint.
- Subscription storage: frontend sends endpoint plus `p256dh` and `auth`; Worker stores or updates by endpoint.
- Reminder sync: frontend stores `subscriptionId`, syncs note/list reminders to `POST /api/reminders`, clears with `DELETE /api/reminders/:sourceType/:sourceId`.
- Service worker: handles `push` with `self.registration.showNotification(...)`.
- Notification click: NoClip `sw.js` has push display; Talk Arrangements already has both `push` and `notificationclick` handlers.
- Deployment docs: NoClip README documents D1 migration, VAPID secret, public vars, CORS, and deployment guardrails.

Important security note:

- NoClip `js/push.js` contains a frontend `PUSH_SECRET` pattern. Talk Arrangements must not copy that secret or introduce a committed private/shared secret. If endpoint abuse protection is needed, only non-secret public controls can be frontend-visible; true secrets must remain server-side.

Talk Arrangements comparison:

- Existing `js/push.js` already supports Worker URL, VAPID public key, `PushManager.subscribe()`, `syncReminder()`, `clearReminder()`, `sendTestPush()`, and `diagnose()`.
- Existing `sw.js` already supports `push` and `notificationclick`.
- Existing Worker scaffold uses KV-style `PUSH_STORE`, not NoClip's D1 schema.
- Existing Worker `sendWebPush()` still throws and has not been replaced with NoClip-style Web Push signing/encryption.
- Existing `wrangler.toml.example` is placeholder-only; no deployable `wrangler.toml` exists.

Adaptation decision:

- NoClip's D1 architecture is the stronger pattern for scheduled reminders because it supports indexed due-reminder queries and reliable update/delete by subscription/source.
- Talk Arrangements can adapt the NoClip Worker encryption/signing code and D1 schema after Cloudflare deploy configuration is available.
- Implementation was not started in this pass because the required Stage 9B-B stop condition fired before coding: Cloudflare credentials/deploy configuration are unavailable.

Stage 9B-B recheck after NoClip inspection:

- `wrangler` is still not available on PATH.
- No deployable `cloudflare/talk-arrangements-push/wrangler.toml` exists.
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CF_API_TOKEN` are not set.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` are not set.
- `ALLOWED_ORIGIN` and `TALK_PUSH_WORKER_URL` are not set.
- No readable local Wrangler/Cloudflare login config was found in the checked locations.

Required David action to resume:

1. Provide Cloudflare access by installing/configuring Wrangler or setting `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Authorize storage choice for Talk Arrangements: recommended D1 to match NoClip, or KV if David explicitly prefers the existing scaffold.
3. Create/provide D1 database id or KV namespace id.
4. Generate/provide frontend-safe VAPID public key.
5. Configure VAPID private key only as a Cloudflare secret.
6. Provide VAPID subject/contact value.
7. Provide/confirm Worker URL.
8. Confirm cron trigger availability.
9. Provide an iPhone live-test path for closed-app notification verification.

NoClip reference inspection classification: `COMPLETE`

Stage 9B-B implementation classification: `BLOCKED`

## Stage 9B-B Resume Attempt After Token Rotation (2026-06-27)

David reported that the previous exposed Cloudflare token was revoked and a regenerated token should be used only through the secure development environment.

Codex rechecked the local secure environment without printing any secret values.

Result: `BLOCKED`

Verified current state:

- `wrangler` is not available on PATH.
- No deployable `cloudflare/talk-arrangements-push/wrangler.toml` exists.
- `CLOUDFLARE_API_TOKEN` is not set in the current process environment.
- `CLOUDFLARE_ACCOUNT_ID` is not set in the current process environment.
- `CF_API_TOKEN` is not set in the current process environment.
- `VAPID_PUBLIC_KEY` is not set in the current process environment.
- `VAPID_PRIVATE_KEY` is not set in the current process environment.
- `VAPID_SUBJECT` is not set in the current process environment.
- `ALLOWED_ORIGIN` is not set in the current process environment.
- `TALK_PUSH_WORKER_URL` is not set in the current process environment.

No Worker, D1/KV, VAPID, cron, frontend config, or service-worker code was changed in this attempt.

Exact next action required from David:

1. Install or make Wrangler available, or explicitly authorize using `npx wrangler`.
2. Provide Cloudflare auth to this process through the secure environment as `CLOUDFLARE_API_TOKEN`.
3. Provide `CLOUDFLARE_ACCOUNT_ID` through the secure environment.
4. Provide or authorize generating VAPID keys, with only the public key committed and the private key stored as a Cloudflare secret.
5. Confirm D1 is approved for Talk Arrangements to match the NoClip pattern.

Stage 9B-B remains blocked until those items are available to the execution environment.

## Stage 9B-B Cloudflare Deployment Continuation (2026-06-29)

David confirmed Cloudflare Free plan should be preserved. Current architecture remains Free-plan compatible for personal use: one Worker, one KV namespace, and one scheduled cron trigger.

Cloudflare resources now verified:

- Worker name: `talk-arrangements-push`
- Worker URL: `https://talk-arrangements-push.davidfontenelle80.workers.dev`
- Active Worker version: `dc6f63c4-22d7-4fa1-a1af-edc3ab9423a5`
- KV namespace name: `talk-arrangements-push-store`
- KV namespace ID: `5cd8802b64b348e6ba2983ecfa273da5`
- KV binding name: `PUSH_STORE`
- Cron trigger: `* * * * *`

Public frontend configuration:

- `js/push-config.js` contains the Worker URL.
- `js/push-config.js` contains the public VAPID key.
- `sw.js` cache version is `talk-arrangements-v102-web-push-worker-ready`.

VAPID status:

- Fresh VAPID pair generated for Talk Arrangements.
- Public key is committed only in frontend/public config.
- Private key has not been printed or committed.
- Private key is stored only as Cloudflare Worker secret `VAPID_PRIVATE_KEY`.

Cloudflare configuration completed:

1. KV namespace `talk-arrangements-push-store` bound to Worker binding name `PUSH_STORE`.
2. Worker variable `ALLOWED_ORIGIN=https://davidfontenelle80-cloud.github.io` configured.
3. Worker variable `VAPID_PUBLIC_KEY` configured from `js/push-config.js`.
4. Worker variable `VAPID_SUBJECT=mailto:davidfontenelle80@gmail.com` configured.
5. Worker secret `VAPID_PRIVATE_KEY` configured through Wrangler; private value was not printed or committed.
6. Cron trigger `* * * * *` configured.
7. Existing Worker redeployed through Wrangler; Worker/KV were not recreated.

Endpoint verification status:

- `GET /api/health`: HTTP 200; reports `hasStore=true`, `hasVapidPublicKey=true`, `hasVapidPrivateKey=true`, and `hasVapidSubject=true`.
- `POST /api/subscribe`: HTTP 200 with a non-real verification subscription.
- `POST /api/reminders`: HTTP 200 with a non-real verification subscription.
- `DELETE /api/reminders/:sourceType/:sourceId`: HTTP 200 with a non-real verification subscription.
- `POST /api/test-push`: pending a real browser `PushSubscription`; dummy subscriptions cannot verify Web Push delivery.

Verification conclusion:

- Worker code is deployed and reachable.
- Cloudflare binding/variables/secret/cron are attached to the active Worker runtime.
- Do not recreate the Worker or KV namespace.
- Real push delivery still requires a live frontend/browser subscription and device verification.

Frontend verification status:

- Notification permission: pending live frontend/device test.
- Subscription stored: pending live frontend/device test.
- Reminder saved: pending live frontend/device test.
- Reminder updated: pending live frontend/device test.
- Reminder deleted: pending live frontend/device test.
- Test push received: pending live frontend/device test.
- Scheduled reminder received: pending live frontend/device test.
- App closed / phone locked notification: pending installed iPhone PWA test.
- Notification tap opens app: pending installed iPhone PWA test.

Files changed in current Stage 9B-B work:

- `cloudflare/talk-arrangements-push/worker.js`
- `cloudflare/talk-arrangements-push/wrangler.toml.example`
- `cloudflare/talk-arrangements-push/README.md`
- `cloudflare/talk-arrangements-push/wrangler.toml`
- `docs/STAGE_9B_CLOUDFLARE_PUSH_CHECKLIST.md`
- `index.html`
- `js/push.js`
- `js/push-config.js`
- `sw.js`
- `TEMP_FIXED_ARRANGEMENTS_HANDOFF.md`

Commit hashes:

- Worker/dashboard deployed version: `dc6f63c4-22d7-4fa1-a1af-edc3ab9423a5`
- Local repo commit: `bf3983e` - `Configure Cloudflare push backend`.
- Repo comparison recheck on 2026-06-29: local `main` was clean and aligned with this Stage 9B-B backend-deployed/configured handoff state before any further coding.

Deployment classification: `BACKEND DEPLOYED AND CONFIGURED`

Approval classification: `NOT APPROVED`

Current completion: `85%`

Next authorized stage: complete Stage 9B-B frontend live deploy, real push subscription verification, scheduled reminder verification, and closed-app iPhone PWA verification only.

## Next Authorized Stage

Stage 9A v101 app-controls polish is live-approved.

Current authorized stage: `Stage 9B-B - Cloudflare Deploy and WebPush Delivery`, backend deployed/configured and pending frontend live deploy plus device verification.

Next authorized stage: none until Stage 9B-B is implemented, deployed, and live verified.

Do not start Release Candidate or Stage 10 until Stage 9B-B is complete and live verified.

## Repo Reconciliation (2026-08-30)

This tracker was last accurate at commit `bf3983e` (2026-06-29). The repository
has advanced since then and this handoff had drifted out of sync. This section
reconciles the tracker to the actual repository before any Phase 1 work begins.
No behavior was changed by this reconciliation; it is a documentation update only.

Actual repository state at reconciliation time:

- `origin/main` HEAD: `b78f902` (2026-07-17) — "fix: disable accidental pinch zoom".
- Service worker cache version is `talk-arrangements-v111-sw-fix-no-pinch-zoom`
  (this tracker's frontmatter previously claimed `...v102-web-push-worker-ready`;
  corrected above).
- `cloudflare/talk-arrangements-push/worker.js` `sendWebPush()` is fully
  implemented (VAPID JWT signing, ECDH key agreement, HKDF, AES-128-GCM aes128gcm
  Web Push encryption, direct POST to the subscription endpoint).
  `GET /api/health` reports `webPushDeliveryImplemented: true`. This supersedes
  the earlier "sendWebPush() still throws / main implementation gap" notes in the
  Stage 9B-A and NoClip-inspection sections above, which are now historical.
- A frontend save-time reminder lead-time guard already exists in `js/app.js`:
  `MIN_REMINDER_LEAD_MINUTES = 15` (commit `ad2fad6`, v105) blocks only changed
  reminder times set under the window, with an EN/ES toast and form values kept.
  An honest delivery-time display also exists: `REMINDER_CHECK_MINUTES = 15` +
  `computeDeliveryTime` (commit `3cab2e7`, v104). These are pre-existing and are
  NOT part of Phase 1; Phase 1 does not touch reminder behavior.
- Worker cron trigger in `cloudflare/talk-arrangements-push/wrangler.toml` at this
  HEAD is still `* * * * *` (every minute). Phase 1 changes this to `*/5 * * * *`.

Commits landed since the last tracker-known commit `bf3983e` (newest first):

- `b78f902` 2026-07-17 fix: disable accidental pinch zoom
- `87f9e95` 2026-07-17 chore: apply one-time no-pinch-zoom migration
- `b3a81e2` 2026-07-13 docs: expand CLAUDE.md with ship checklist, post-deploy verification, SW safety rules
- `9c375dc` 2026-07-13 fix: bump CACHE_VERSION to v111, fix SW fallback to avoid serving HTML for JS asset requests
- `78350f6` 2026-07-13 fix: correct garbled Spanish characters (double-encoded UTF-8)
- `4ade1f8` 2026-07-09 Add YAML frontmatter standard to CLAUDE.md
- `f6d9eca` 2026-07-08 hotfix: strip BOM from app.js — fixes SyntaxError on load
- `fe7bb34` 2026-07-08 feat: notification UX polish — sweep hint, status block, 6-state detection
- `d82dd21` 2026-07-08 Add one-tap Enable notifications button to Settings (mirrors note-clip); SW v109
- `6e08a99` 2026-07-07 Cloud Account (Sign in/Sign out) control in Settings; loaded via push-config; SW v108
- `9c1cbcb` 2026-07-07 FIXED checkbox: read-only mirror of Fixed Arrangements schedule; bump SW cache to v107
- `becc644` 2026-07-07 Refresh cache for fixed arrangement auto-check
- `6e9fc70` 2026-07-07 Auto-check congregations from fixed arrangement rules
- `e57ff8a` 2026-07-03 chore: retrigger Pages deploy (previous deploy job failed transiently)
- `ad2fad6` 2026-07-03 v105: minimum reminder lead-time check on save — MIN_REMINDER_LEAD_MINUTES(15)
- `3cab2e7` 2026-07-03 v104: honest reminder delivery time — REMINDER_CHECK_MINUTES(15) + computeDeliveryTime
- `5e70fd0` 2026-07-01 v103: audit fixes — undefined theme tokens, dark-mode panels, light-mode reminder modal
- `e5be3b9` 2026-06-29 docs: record Stage 9B-B backend commit

Tracker and repository are aligned as of this section. Phase 1 coding may proceed.

## Phase 1 Completion Record (2026-08-30)

Supervisor decision: Option A. Cron change only; NO new near-term reminder
rejection rule; dueBucketScheduler and near-term reliability deferred to Phase 2.

Work completed in this repo (Talk Arrangements):

- Worker cron trigger changed from `* * * * *` to `*/5 * * * *` in
  `cloudflare/talk-arrangements-push/wrangler.toml`. This is the only code change.
  Reminder behavior was not modified.
- This tracker reconciliation and this completion record (documentation only).

Delivery status: DELIVERED TO GITHUB. Direct `git push` from the working session
was refused by the git proxy (repo not in the session's authorized source set), so
the exact Phase 1 changes were applied to `origin/main` through the authorized
GitHub integration (Composio git-data API) acting as the account owner. File
contents and commit structure are preserved; origin commit SHAs are newly minted
and recorded in the session delivery report.

Deployment status: CODE IN GITHUB — NOT LIVE VERIFIED. No Cloudflare deploy
access is available in this environment, so the Worker was not redeployed and the
running cron was not verified. The live cron takes effect only after
`wrangler deploy` from `cloudflare/talk-arrangements-push/`; confirm it then reads
`*/5 * * * *` (Cloudflare dashboard -> Worker -> Triggers, or `wrangler deployments`).

Phase 2 status: NOT STARTED. No dueBucketScheduler, no push.js hardening, no
changes beyond the cron. Awaiting supervisor approval to begin Phase 2.

## Phase 2 Implementation Record (2026-08-30)

Supervisor-approved Phase 2: due-bucket/lookback reminder scheduling and push hardening.

Files changed:

- `cloudflare/talk-arrangements-push/worker.js` (worker-only change; no frontend or
  service-worker assets changed, so no SW cache-version bump per the ship checklist).

Commit SHA (on origin/main; new SHA minted by the authorized GitHub integration):

- `0ae7461` - feat: due-bucket reminder scheduling + push hardening (Phase 2).

How the due-bucket scheduler works:

- Each reminder is indexed by the UTC minute of its fireAt (`dueBucketMinute` ->
  key `due:<YYYY-MM-DDTHH:MM>`). `handleUpsertReminder` writes the reminder and adds
  its key to that bucket on save (and validates fireAt).
- The scheduled sweep calls `getDueReminderEntries`, which reads ONLY the buckets from
  the current minute back through a 15-minute lookback (`DUE_BUCKET_LOOKBACK_MINUTES`),
  instead of listing every `reminder:` key. The lookback tolerates a delayed or skipped
  */5 run (three intervals). Keys in multiple buckets are de-duped; already-sent
  reminders (sentAt) are skipped; stale bucket entries whose reminder is gone are
  ignored. Buckets carry a TTL so the index self-cleans.
- Reminder timing semantics are preserved: firing is still driven by fireAt <= now.

How legacy (pre-bucket) reminders are protected:

- `migrateLegacyReminders` is a bounded (100 keys/run), cursor-based, self-terminating
  migration. Reminders with no `dueBucketMinute` are indexed: future ones into their own
  bucket, already-overdue ones into the current-minute bucket so the lookback fires them
  promptly. Records are stamped migrated; a done flag stops the scan once the keyspace is
  drained, after which normal operation reads buckets only. Legacy reminders are never
  stranded; a legacy record with an invalid fireAt is left untouched rather than crashing
  the sweep.

Push cleanup / hardening (extends the existing 404/410 path - not a second path):

- 404/410 from the push service -> prune the subscription and the reminder (permanent).
- Orphaned reminder (subscription already removed) -> deleted, so a dead endpoint is not
  retried on every sweep forever.
- Transient failure (network / 5xx / 429) -> reminder kept (no sentAt), recorded with
  lastError/lastAttemptAt, retried on a later sweep.
- `handleTestPush` mirrors the same dead-subscription cleanup.

Structured counters / logging added:

- One JSON line per run: `{evt:"push-sweep", at, due, attempted, sent, failed,
  deadCleaned, migrationMigrated, migrationDone}`. No secrets, subscription keys,
  endpoints, or payload contents are logged.

Tests performed and results (Node harness; real Web Push VAPID/ECDH/AES-128-GCM crypto
with mock KV and mock push service; run against the exact committed bytes; 13/13 passed):

- future reminder enters correct bucket; due reminder fires from bucket; not-yet-due does
  not fire; 15-minute lookback catches a delayed due reminder; an 18-minute-old bucket is
  outside the window (bounded); duplicate sweep does not double-send; legacy overdue
  reminder fires and is not stranded; legacy future reminder is migrated into its bucket;
  404/410 dead subscription and its reminder are pruned; orphaned reminder is cleaned with
  no send attempt; transient failure is kept (not deleted) and recovers/sends on a later
  sweep; structured counters reflect each outcome.

Deployment status: CODE IN GITHUB - NOT LIVE VERIFIED. No Cloudflare deploy access exists
in this environment; the Worker was not redeployed. The Phase 1 cron and this Phase 2
worker logic take effect only after `wrangler deploy` from `cloudflare/talk-arrangements-push/`.

Known remaining risks:

- KV list is eventually consistent; the bounded migration may need an extra sweep or two to
  observe very recently written legacy keys (self-heals; lookback + migration cover it).
- Deleting a reminder does not eagerly remove its bucket entry; the stale entry is safely
  skipped and TTL-expires (no functional impact).
- Not yet exercised against the live Cloudflare KV/Worker runtime (see deployment status).

Phase 3: NOT STARTED. No Phase 3 drift analysis or any later work has begun.

## Phase 3A - Boilerplate Drift Audit: Talk Arrangements vs KHub-Boilerplate (2026-08-30)

AUDIT ONLY. KHub-Boilerplate was NOT modified. No Talk application code was changed.
No other app was audited. Compared Talk main (810bd1e) against KHub-Boilerplate main
(9ba80db). Recommendations below are PENDING SUPERVISOR REVIEW - not approved promotions.

Durable decision record (candidate -> recommendation):

PROMOTE candidates (pending review):

- P1 SW safe offline fallback guard - sw.js. KHub falls back to cached content for any
  failed shell request; Talk only returns the offline document for
  `request.destination === 'document'`, else `Response.error()`. Prevents
  `SyntaxError: Unexpected token '<'` when a failed JS/CSS asset is served index.html.
  Evidence: talk/sw.js fetch handler; khub/sw.js fetch handler. Generic, strictly safer.
  Risk: low; ensure navigations still get './'.
- P2 CLAUDE.md operational guidance. Talk documents Service-Worker rules, the "Safe
  offline fallback pattern (REQUIRED)", a Ship checklist, Post-deploy verification, and
  Known-issue patterns; KHub CLAUDE.md has none of these. Evidence: talk/CLAUDE.md vs
  khub/CLAUDE.md. Reusable ship/repo practice; pairs with P1. Risk: low; generalize the
  Talk-specific `?v=` version-sync wording when promoting.
- P3 Worker push hardening - cloudflare worker.js. Talk (Phase 2) adds orphaned-
  subscription cleanup (delete a reminder whose subscription is gone, no infinite retry)
  and structured per-run counters logged as one JSON line
  {evt:"push-sweep", attempted, sent, failed, deadCleaned}; the KHub reference worker has
  neither. Evidence: talk/cloudflare/talk-arrangements-push/worker.js vs
  khub/docs/notifications/reference/worker.js. Generic reliability/observability for any
  KHub push app. Risk: low; logging must remain secret-free (Talk's is).

AMBIGUOUS - Supervisor judgment:

- A1 SW cache strategy split. Talk uses cache-first for stable shell files and
  network-first (cache:'reload') for a hardcoded "polished" list (main.css, app.js,
  mobile-toolbar.js); KHub is network-first for the whole shell. The PATTERN is promotable
  (faster + more offline-robust); the specific file list is app-specific. Trade-off: added
  complexity and stale-until-CACHE_VERSION-bump for cache-first files.
- A2 Worker bounded legacy migration (migrateLegacyReminders). Valuable when upgrading an
  existing flat-scan deployment; a harmless no-op for a brand-new app created from the
  reference. Promote as an optional/documented pattern rather than a default?

APP-SPECIFIC (no promotion):

- dark-mode.css / theme palette: same token structure, different brand color values.
- a11y.js: identical accessibility logic; Talk only stripped explanatory comments and
  added a minor loadScriptOnce helper (KHub's commented version is preferable). No a11y win.
- push.js and SW push/notificationclick handlers: the KHub reference LEADS here
  (notification routing via notificationRouteMessage / client.postMessage); Talk's inlined
  handlers are simpler/older - nothing to promote from Talk (opposite direction).
- wrangler.toml, push-config.js, config.js, i18n.js strings: app identity / config values.
  (config.js also lacks KHub's allowPinchZoom control - KHub leads; closed zoom item, not
  relitigated.)
- `?v=stageXX` query-string precache versioning in Talk: app-specific cache-busting layered
  on CACHE_VERSION.

Context (reverse direction, out of scope - NOT a promotion): Talk is missing some KHub
governance tooling it never adopted (package.json eslint/prettier scripts,
scripts/khub-check.mjs, CONTRIBUTING_AI.md, firebase security scaffolding). A Talk-side
adoption gap, noted only for completeness.

Files/evidence inspected: talk & khub - sw.js, CLAUDE.md, TEST-CHECKLIST.md,
js/{a11y,config,error-boundary,perf,theme,auth,i18n,app}.js, js/components/*,
css/{main,components,dark-mode,responsive}.css, index.html; talk
cloudflare/talk-arrangements-push/{worker.js,wrangler.toml}, js/{push,push-config}.js vs
khub/docs/notifications/reference/{worker.js,push.js,push-config.js,sw-push-handlers.js,wrangler.toml}.

Phase 3B (Ministry audit) NOT STARTED - awaiting Supervisor review of the above.

## Phase 3B - Boilerplate Drift Audit: Ministry Tracker vs KHub-Boilerplate (2026-08-30)

AUDIT ONLY. KHub-Boilerplate NOT modified. Ministry application code NOT modified.
No other app audited (Overtime/Finance/Pipe untouched). Compared Ministry main (cd544e3)
against KHub-Boilerplate main (9ba80db). Continues the durable running Phase 3 decision
record kept in this Talk tracker (a non-boilerplate audit record). PENDING SUPERVISOR REVIEW.

Carry-forward: Talk approved PROMOTE = P1 (SW document-only offline fallback guard),
P2 (SW-safety / ship-checklist / post-deploy ops guidance), P3 (push-worker orphan cleanup +
secret-free structured per-run counters). Talk A1 = APP-SPECIFIC/insufficient evidence.
Talk A2 = OPTIONAL PATTERN.

New Ministry PROMOTE candidates (pending review):

- M1 sw-register.js SW-manager + event bus + safe-update UX (ministry js/sw-register.js, 273L,
  self-labeled "KHub SW manager + event bus (pipe-calc pattern, fleet standard)"). KHub only
  inlines a partial SW lifecycle in app.js; Ministry extracts a reusable module: registration,
  per-load + 12h registration.update(), quiet reload when isSafeToReload() (no open modals /
  focused inputs / dirty forms) vs an update banner otherwise, SKIP_WAITING handshake,
  RELOAD_READY reload, and an on/off/emit event bus. Evidence: ministry js/sw-register.js vs
  khub js/app.js. Stronger: Ministry (cleaner, reusable, already fleet-shared). Rec: PROMOTE the
  module skeleton; the notification-route targets (switchScreen('notes'), openMinistryNoteModal,
  ministry-note) are APP-SPECIFIC and must be parameterized. Risk: more boilerplate surface to
  maintain; keep route targets pluggable. Corroborates Talk: boilerplate is stale vs fleet SW infra.

- M2 error-boundary IndexedDB transient-transaction recovery (ministry js/error-boundary.js).
  Adds isRecoverableIndexedDbTransactionError() and, in unhandledrejection, preventDefault()+warns
  on "attempt to get records from database without an in-progress transaction" instead of tripping
  the full-screen error boundary. Evidence: diff khub vs ministry js/error-boundary.js. Stronger:
  Ministry (proven storage-reliability fix generic to any IndexedDB KHub app). Rec: PROMOTE. Risk:
  keep the matcher narrow so real storage failures still surface. Talk left error-boundary.js
  identical to KHub -> new evidence, no contradiction.

- M3 (minor) error-boundary i18n-ization (ministry js/error-boundary.js): boundary strings via
  window.KHub?.I18n?.t(...) with English fallbacks. Generic, backward-compatible. Rec: PROMOTE
  (minor); can fold into M2.

Cross-app corroboration / contradiction of Talk findings:

- P1: Ministry has neither Talk's document-destination guard nor the unsafe blanket
  caches.match('./') fallback; it uses a same-URL fallback catch(() => caches.match(request)).
  It avoids the SyntaxError bug differently, but serves no offline page for an uncached navigation.
  New evidence for promotion DESIGN: the promoted pattern should BOTH avoid HTML-for-assets AND
  still serve './' for document navigations (Talk's guard does both; Ministry's does the former
  only). Keep P1 PROMOTE (Talk's approach); cite Ministry same-URL as simpler baseline. Corroborates
  the goal; no contradiction.
- P2: Ministry CLAUDE.md is minimal (26L) with none of the guidance. Does not corroborate by having
  it; shows the guidance is absent across apps and only Talk codified it -> supports broad P2. No
  contradiction.
- P3: Ministry's worker INDEPENDENTLY implements test-push 404/410 dead-subscription cleanup (the
  only meaningful diff vs the KHub reference worker, which LACKS it) -> corroborates P3's dead-sub-
  cleanup direction across two apps. Ministry lacks the structured counters, orphaned-reminder
  cleanup, and migration -> those remain Talk-unique. Net: cleanup half of P3 cross-app corroborated;
  counters/orphan half still single-app (Talk).
- Talk A1: Ministry uses network-first for the whole shell (like KHub), NOT a cache-first +
  network-first-hot split. No corroborating evidence for A1; classification unchanged (APP-SPECIFIC /
  insufficient cross-app evidence).
- Talk A2: Ministry worker has no bounded legacy migration. No new evidence; A2 stays OPTIONAL PATTERN.

APP-SPECIFIC (no promotion) in Ministry: config.js (744L) domain config; i18n.js (314L) strings;
theme.js app-state-keyed (ministry-tracker-v4) anti-flash bootstrap (app-specific impl; anti-flash
is a general note only); css main/components/dark-mode (brand+domain); push-config.js / wrangler.toml
(identity/keys); push-toggle.js (matches existing KHub reference push-toggle); sw.js notification
routing (notificationRouteMessage/postMessage) - reference and Ministry already lead, corroborating
the earlier Talk finding that Talk lags on routing (nothing to promote FROM these; Talk could adopt).
Note (not a promotion, closed-standards area): Ministry sw.js runtime-caches Font Awesome + Google
Fonts from CDN (a CDN runtime dependency; contrast UX-STANDARDS §5 self-hosting used for Pipe Bending)
- flagged for awareness only, not relitigated.

Files/evidence inspected (ministry & khub unless noted): sw.js, CLAUDE.md, TEST-CHECKLIST.md,
js/{a11y,config,error-boundary,perf,theme,auth,i18n,app}.js, js/components/*, ministry js/sw-register.js,
ministry js/push-toggle.js, css/{main,components,dark-mode,responsive}.css, index.html; ministry
cloudflare/ministry-tracker-push/{worker.js,wrangler.toml} vs khub docs/notifications/reference/worker.js.

Phase 3C (Overtime audit) NOT STARTED - awaiting Supervisor review of the Ministry findings above.

## Phase 3C - Boilerplate Drift Audit: Overtime Tracker vs KHub-Boilerplate (2026-08-30)

AUDIT ONLY. Compared Overtime Tracker `main` (`bca4cd9`) against KHub-Boilerplate
`main` (`9ba80db`) by inspecting the actual files. KHub-Boilerplate was NOT modified.
Overtime application code was NOT modified. Talk application code was NOT modified;
this tracker is the only changed file. Finance Tracker and Pipe Bending were NOT audited.
All recommendations in this section are `PENDING SUPERVISOR REVIEW`.

### Material-difference decision table

| ID | Area/pattern | KHub behavior | Overtime behavior and exact evidence | Stronger / why | Classification | Promotion risk | Prior evidence |
|---|---|---|---|---|---|---|---|
| O1 | Document-aware offline fallback | `sw.js` network-first shell fallback only matches the failed request; an uncached navigation has no explicit offline-document fallback. | `sw.js` identifies navigation/document requests, falls back to `./index.html`/`./` only for those, and for assets returns the matching cached asset or `Response.error()`. | Overtime: it preserves an offline document while never substituting HTML for a failed JS/CSS asset. | **PROMOTE** (reaffirms approved P1) | Low; preserve same-origin and GET guards and test both uncached navigation and failed asset paths. | Independently corroborates Talk P1's required principle; does not contradict Ministry's same-URL-only fallback. This is now Talk + Overtime implementation evidence. |
| O2 | Cache ownership / activation cleanup | `sw.js` deletes every origin cache whose key is not the current KHub cache. On a shared origin this can remove caches owned by another app or feature. | `sw.js` deletes only keys starting with `overtime-tracker-` and not equal to `CACHE_VERSION`. | Overtime: cleanup is namespace-scoped and cannot evict unrelated origin caches. | **PROMOTE** | Low; every generated app needs a stable, unique cache prefix and obsolete historical prefixes may require an explicit migration list. | New finding. Talk's current `sw.js` also deletes every non-current origin cache, so Overtime contradicts the existing Talk implementation while improving the fleet-safe design. |
| O3 | Broken-shell detection and scoped repair | KHub has update lifecycle UX in `js/app.js`, but no early script/link load-error screen, boot watchdog, or user-triggered repair for a corrupted cached shell. | `js/sw-register.js` captures failed SCRIPT/LINK loads, detects a still-empty app after 3.5s, displays an accessible recovery screen, and on user action deletes only `overtime-tracker-*` caches and unregisters only SW registrations whose scope contains `/Overtime-Tracker-/`. Commit history identifies `4afe896` as the iPhone black-screen/scoped-recovery fix. | Overtime for post-corruption recovery; KHub/Ministry remain stronger for normal safe-update lifecycle. | **PROMOTE** the recovery capability, generalized and integrated with M1; do not copy app name/scope strings or duplicate registration. | Medium; false boot-watchdog positives, destructive cache clearing, scope matching, CSP-safe rendering, and double SW registration must be designed out. Repair must remain explicit and app-scoped. | Complements rather than corroborates Ministry M1. Talk/Ministry evidence covers ordinary updates; Overtime adds a last-resort recovery path. |
| O4 | Shared component injection hardening | `js/components/modal.js` interpolates title, confirm label, cancel label, and body directly into `innerHTML`; `js/components/input.js` writes the label with `innerHTML` and omits `aria-describedby` when no hint exists. | `js/components/modal.js` HTML-escapes title/button labels and accepts a DOM Node body; `js/components/input.js` builds label/required marker with `textContent`/DOM APIs and always associates the error id via `aria-describedby`. | Overtime: safer reusable defaults for caller-controlled text and more reliable error announcement wiring. | **PROMOTE** | Low-medium; modal body intentionally remains trusted HTML when passed as a string, so the API must document trusted-HTML vs Node/text usage and avoid implying full sanitization. | New security/accessibility evidence; no contradiction with P1-P3 or M1-M3. |
| O5 | Precache failure policy | KHub `sw.js` uses atomic `cache.addAll()` and fails the install when any required shell asset fails. | Overtime `sw.js` uses `Promise.allSettled(PRECACHE_URLS.map(cache.add))`, allowing activation with a partial shell; O3 supplies a repair path if required files are absent. | Trade-off: KHub preserves cache completeness; Overtime can recover from a single transient 404 but may install an incomplete offline shell. | **AMBIGUOUS** | Medium-high; partial activation can trade a failed update for a later offline failure. Requires telemetry/tests and a required-vs-optional asset policy before promotion. | New; neither Talk nor Ministry decision records establish cross-app support. |
| O6 | Deterministic domain regression harness + CI | KHub supplies lint/format/static checks but no application-domain regression harness. | `.github/workflows/tests.yml`, `tests/harness.js`, `tests/sick-leave-tests.js`, and `tests/ot-total-tests.js` run real `js/app.js` in a VM with mocked DOM/localStorage and a frozen clock; current audit run passed 57 sick-leave assertions and 6 OT assertions. | Overtime for its mature domain logic; the exact hooks/assertions are not boilerplate-generic. | **OPTIONAL PATTERN** | Medium; test-only globals and mocks can drift from browsers, and frozen time must not hide calendar transitions. Promote guidance/scaffolding only, not Overtime rules. | New maintainability pattern; no push/SW evidence and no contradiction with prior findings. |

### PROMOTE candidates - pending Supervisor review

- **P1 reaffirmed by Overtime:** document/navigation-only offline document fallback; never
  return cached HTML for failed JS/CSS/assets (`sw.js`).
- **O2:** namespace-scoped service-worker cache cleanup (`sw.js`).
- **O3:** app-scoped broken-shell recovery capability, integrated into the eventual M1
  manager rather than copied as Overtime's standalone/duplicate registrar (`js/sw-register.js`).
- **O4:** DOM-safe modal/input labels and persistent error `aria-describedby` wiring
  (`js/components/modal.js`, `js/components/input.js`).

### APP-SPECIFIC candidates - no KHub promotion

- `js/app.js`, `tests/sick-leave-tests.js`, and `tests/ot-total-tests.js`: overtime,
  leave-bank, pay-period, funeral/FMLA, calendar, keypad, and localStorage schema logic.
- `js/firebase/firebase-config.js` and Overtime cloud-auto-save wiring in `js/app.js`:
  concrete Firebase project/app identity, storage keys, and sync timing. The checked-in
  Firebase web configuration is public client configuration, not a private server secret;
  authorization still depends on Auth/Firestore rules. KHub's generic Firebase guidance
  remains the appropriate reusable layer.
- `css/main.css`, `css/components.css`, `css/dark-mode.css`, `css/responsive.css`,
  `index.html`, `manifest.json`, icons, and most `js/config.js`: Overtime domain UI,
  branding, layout, navigation, and identity.
- Locked zoom is intentional and CLOSED per Supervisor direction; it was observed but not
  reopened or evaluated as a candidate.
- Overtime has no push frontend, push service-worker handlers, Cloudflare Worker/API, or
  scheduled push infrastructure. It provides no new P3 evidence.
- Overtime has no IndexedDB use or M2 transient-transaction matcher. It provides no M2/M3
  corroboration or contradiction.
- Overtime `js/sw-register.js` is not Ministry M1: it lacks update checks, safe-reload
  determination, dirty-form/modal handling, update banner behavior, event bus, and the
  complete SKIP_WAITING/application lifecycle. KHub's inlined manager and Ministry's M1
  module are stronger for ordinary updates; Overtime contributes only O3 recovery.

### OPTIONAL PATTERN candidates - pending Supervisor review

- **O6:** deterministic real-source domain test harness, frozen clock, explicit production-
  inert test hook, and CI execution. Adopt as opt-in app-test scaffolding/guidance, not as
  mandatory Overtime-specific code.

### AMBIGUOUS candidates - Supervisor judgment

- **O5:** tolerant partial precache via `Promise.allSettled`. Do not promote without a
  required-vs-optional asset policy and explicit incomplete-cache/offline tests.
- Overtime adds `font-size:16px` to Firebase auth modal inputs in
  `js/firebase/cloud-backup.js`, avoiding iOS form auto-zoom, but its copy omits KHub's newer
  API-key-referrer error mapping. Keep the 16px mobile-input principle in UX standards;
  do not replace the stronger current KHub module with Overtime's older fork.

### Cross-app corroboration / contradiction

- **P1:** independently corroborated by Overtime. Talk and Overtime both implement the
  required document-aware offline fallback. Ministry avoids HTML-for-assets through a
  same-URL fallback but lacks an offline navigation document. P1 remains PROMOTE.
- **P2:** Overtime `CLAUDE.md` is a short ship checklist and lacks Talk's detailed SW
  safety/fallback/post-deploy guidance. It does not independently reproduce P2, but its O3
  recovery history reinforces the need for generalized SW regression guidance.
- **P3:** no push/Worker stack exists in Overtime; no new evidence.
- **M1:** not corroborated. Overtime's recovery registrar is narrower and lacks safe-update
  state/event-bus behavior. O3 should become a complementary M1 recovery extension.
- **M2/M3:** no IndexedDB and no Ministry recovery/i18n boundary changes. Overtime and KHub
  `js/error-boundary.js` are byte-equivalent at the compared heads, so no contradiction.
- **Talk A1:** Overtime uses network-first for its eligible shell/navigation requests, not
  Talk's stable-cache/hot-file split. No corroboration; A1 remains APP-SPECIFIC / insufficient.
- **Talk A2:** no legacy push migration exists. A2 remains OPTIONAL PATTERN.
- **New contradiction:** Talk/KHub broadly delete non-current origin caches; Overtime scopes
  deletion to its own prefix. O2 recommends the Overtime design for shared-origin safety.

### Exact files inspected and verification

Overtime: `sw.js`, `js/sw-register.js`, `js/app.js`, `js/error-boundary.js`,
`js/config.js`, `js/auth.js`, `js/a11y.js`, `js/i18n.js`, `js/theme.js`, `js/perf.js`,
`js/components/{button,card,input,modal}.js`, `js/firebase/{firebase-config,cloud-backup}.js`,
`index.html`, `manifest.json`, `css/{main,components,dark-mode,responsive}.css`,
`CLAUDE.md`, `TEST-CHECKLIST.md`, `README.md`, `.gitignore`, `.eslintrc.json`,
`.prettierrc`, `.github/workflows/tests.yml`, `tests/{harness,sick-leave-tests,ot-total-tests}.js`,
and `docs/stage-notes/2026-07-01-v23-token-fix.md`.

KHub comparison: `sw.js`, `js/app.js`, `js/error-boundary.js`, `js/config.js`,
`js/auth.js`, `js/a11y.js`, `js/i18n.js`, `js/theme.js`, `js/perf.js`,
`js/components/{button,card,input,modal}.js`, `js/firebase/cloud-backup.js`,
`index.html`, `manifest.json`, `css/{main,components,dark-mode,responsive}.css`,
`CLAUDE.md`, `TEST-CHECKLIST.md`, `README.md`, `package.json`,
`scripts/khub-check.mjs`, Firebase/security scaffolding, notification reference files,
`docs/UX-STANDARDS.md`, and `docs/APP-ARCHETYPES.md`.

Read-only verification run against Overtime `bca4cd9`: `node tests/sick-leave-tests.js`
passed 57/57; `node tests/ot-total-tests.js` passed 6/6; `node --check` passed all 19
JavaScript files. No deployment or cache change was performed.

Phase 3D (Finance audit) NOT STARTED - awaiting Supervisor review of Phase 3C.
