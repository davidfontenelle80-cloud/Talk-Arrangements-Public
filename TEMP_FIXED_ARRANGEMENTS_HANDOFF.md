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
