# Stage 9B — Cloudflare Push Backend Checklist

Status: **Stage 9B-B Worker deployed; Cloudflare binding/variables/secret/cron and live push verification are still pending.**

Repo: `davidfontenelle80-cloud/Talk-Arrangements-Public`

Live frontend baseline: Stage 9A v97 live-approved.

## Purpose

Implement true closed-app reminder notifications for Talk Arrangements using a NoClip-style Cloudflare Worker + Web Push backend.

This file is the working checklist Codex should update as each item is completed.

---

## Stage 9B-A — Supervisor prep work

- [x] Confirm MD says Stage 9A is live-approved.
- [x] Confirm next authorized stage is Stage 9B Cloudflare Push Backend.
- [x] Add this Stage 9B checklist to the repo.
- [x] Add Cloudflare Worker scaffold path.
- [x] Add safe Worker endpoint structure with no committed secrets.
- [x] Add `wrangler.toml.example` with placeholder bindings/secrets only.
- [x] Add Worker README with Cloudflare setup steps.
- [x] Update MD with Stage 9B-A status.

## Stage 9B-B — Codex/worker remaining tasks

### Cloudflare project setup

- [x] Create/confirm Cloudflare Worker name: `talk-arrangements-push`.
- [x] Create/confirm Worker URL: `https://talk-arrangements-push.davidfontenelle80.workers.dev`.
- [x] Deploy Worker.
- [x] Confirm active Worker version: `7793b011`.
- [x] Create storage namespace: KV `talk-arrangements-push-store` (`5cd8802b64b348e6ba2983ecfa273da5`).
- [x] Bind KV namespace to Worker as `PUSH_STORE`.
- [x] Configure scheduled trigger/cron: `* * * * *`.
- [x] Generate VAPID key pair.
- [x] Store VAPID public key in frontend-safe config.
- [x] Store VAPID private key as Cloudflare secret/env var only.
- [x] Store VAPID subject/contact email as Cloudflare env var.
- [x] Configure CORS allowlist for `https://davidfontenelle80-cloud.github.io`.

### Backend endpoint implementation

Required endpoints:

- [x] `OPTIONS *` CORS preflight.
- [x] `GET /api/health` returns config/storage status.
- [x] `POST /api/subscribe` stores/updates subscription.
- [x] `POST /api/reminders` creates/updates scheduled reminder.
- [x] `DELETE /api/reminders/:sourceType/:sourceId` removes scheduled reminder for the saved subscription.
- [x] `POST /api/test-push` sends immediate test notification.

Scheduled behavior:

- [x] Cron finds due reminders.
- [x] Cron sends Web Push for each due reminder.
- [x] Successful sends mark reminders as sent.
- [x] Failed sends are recorded and retried on the next cron pass.
- [x] Expired/invalid subscriptions are cleaned up on 404/410 from push service.

### Frontend integration

Existing files to inspect:

- `js/push.js`
- `sw.js`
- `js/app.js`

Required frontend updates only if needed:

- [x] Add public-only `js/push-config.js` for `window.TALK_ARRANGEMENTS_PUSH_CONFIG.workerUrl`.
- [x] Add public-only `js/push-config.js` for `window.TALK_ARRANGEMENTS_PUSH_CONFIG.vapidPublicKey`.
- [x] Fill `js/push-config.js` with deployed Worker URL and VAPID public key.
- [ ] Verify `TalkPush.subscribe()` calls Worker successfully.
- [ ] Verify reminder save calls `TalkPush.syncReminder()`.
- [ ] Verify reminder delete calls `TalkPush.clearReminder()`.
- [ ] Verify app still works when push is not configured.

### Testing requirements

- [x] Worker health endpoint works.
- [ ] CORS preflight works from GitHub Pages origin.
- [x] Subscribe stores a push subscription.
- [ ] Test push is received while app is open.
- [ ] Test push is received with app closed/phone locked.
- [x] Reminder create syncs to backend.
- [ ] Reminder edit updates backend.
- [x] Reminder delete cancels backend reminder.
- [ ] Scheduled due reminder fires at selected date/time.
- [ ] Notification tap opens/focuses Talk Arrangements app.
- [x] No private secrets appear in repo.
- [ ] Existing in-app reminder fallback still works.
- [ ] Cloud backup/export/import unaffected.

---

## Security guardrails

Never commit:

- Cloudflare API token
- GitHub token
- VAPID private key
- shared secret
- raw production credentials

Allowed in frontend/source:

- public Worker URL
- VAPID public key
- non-secret app identifiers

---

## Current blocker

True closed-app notifications cannot be live-approved until the deployed Cloudflare Worker has the KV binding, variables, VAPID private-key secret, cron trigger, endpoint verification, and successful device testing.

Current verified Cloudflare state:

- KV namespace created:
  - Name: `talk-arrangements-push-store`
  - ID: `5cd8802b64b348e6ba2983ecfa273da5`
- Worker created and deployed:
  - Name: `talk-arrangements-push`
  - URL: `https://talk-arrangements-push.davidfontenelle80.workers.dev`
  - Active version: `7793b011`
- Public frontend config updated:
  - Worker URL configured.
  - VAPID public key configured.

Remaining Cloudflare dashboard configuration:

- Bind KV namespace as `PUSH_STORE`.
- Configure Worker variable `ALLOWED_ORIGIN=https://davidfontenelle80-cloud.github.io`.
- Configure Worker variable `VAPID_PUBLIC_KEY` with the public key from `js/push-config.js`.
- Configure Worker variable `VAPID_SUBJECT=mailto:davidfontenelle80@gmail.com`.
- Configure Worker secret `VAPID_PRIVATE_KEY`.
- Configure cron trigger `* * * * *`.
- Redeploy Worker if Cloudflare requires a deploy after configuration changes.

Free-plan classification:

- Uses one Worker, one KV namespace, and one cron trigger.
- Expected personal-use load is compatible with Cloudflare Free limits, assuming reminder volume remains modest.
- The every-minute cron trigger consumes about 1,440 scheduled Worker invocations per day before user/API traffic.

Stage 9B-B credential/deploy recheck on 2026-06-27 found:

- `wrangler` is not available on PATH.
- No deployable `cloudflare/talk-arrangements-push/wrangler.toml` exists; only `wrangler.toml.example` exists.
- Cloudflare auth/account env vars are not set.
- VAPID public/private/subject env vars are not set.
- Worker URL is unavailable.
- `PUSH_STORE` KV namespace/binding is not configured or verifiable.
- Cron trigger is not deployed/configured.

Stage 9B-B deployment continuation on 2026-06-29 found:

- Worker and KV creation are complete; do not recreate them.
- Cloudflare dashboard automation is blocked by browser security policy.
- Remaining Cloudflare settings require manual dashboard completion or an authorized non-browser Cloudflare control path.
- Endpoint verification is blocked until the `PUSH_STORE` binding, variables, secret, and cron trigger are configured.
- Closed-app notification verification is blocked until endpoint verification passes.

Stage 9B-B endpoint verification attempt after manual settings report on 2026-06-29:

- `GET /api/health`: reachable, HTTP 200.
- Health response still reports `hasStore=false`.
- Health response still reports `hasVapidPublicKey=false`.
- Health response still reports `hasVapidPrivateKey=false`.
- Health response still reports `hasVapidSubject=false`.
- `POST /api/subscribe`: HTTP 500 because the deployed Worker cannot see the `PUSH_STORE` binding.
- Conclusion: the Worker code is deployed, but Cloudflare binding/variables/secret are not attached to the active Worker runtime yet, or Cloudflare still requires saving/redeploying the Worker after settings changes.

Stage 9B-B Wrangler configuration/deploy on 2026-06-29:

- Wrangler installed and authenticated with `davidfontenelle80@gmail.com`.
- Existing Worker was not recreated.
- Existing KV namespace was not recreated.
- `cloudflare/talk-arrangements-push/wrangler.toml` added with public Worker config only.
- `VAPID_PRIVATE_KEY` uploaded through `wrangler secret put`; private key was not printed and was not committed.
- Worker deployed with:
  - `PUSH_STORE` bound to KV namespace `5cd8802b64b348e6ba2983ecfa273da5`.
  - `ALLOWED_ORIGIN=https://davidfontenelle80-cloud.github.io`.
  - `VAPID_PUBLIC_KEY` configured.
  - `VAPID_SUBJECT=mailto:davidfontenelle80@gmail.com`.
  - cron trigger `* * * * *`.
  - Worker Logs/observability preserved as enabled.
  - Preview URLs disabled to match the prior dashboard configuration.
- Active Wrangler-deployed Worker version: `dc6f63c4-22d7-4fa1-a1af-edc3ab9423a5`.

Stage 9B-B backend endpoint verification after Wrangler deploy:

- `GET /api/health`: HTTP 200; reports `hasStore=true`, `hasVapidPublicKey=true`, `hasVapidPrivateKey=true`, and `hasVapidSubject=true`.
- `POST /api/subscribe`: HTTP 200 with a non-real verification subscription.
- `POST /api/reminders`: HTTP 200 with a non-real verification subscription.
- `DELETE /api/reminders/:sourceType/:sourceId`: HTTP 200 with a non-real verification subscription.
- Cleanup check found no leftover `reminder:` KV keys from Codex verification.
- `POST /api/test-push`: pending a real browser `PushSubscription`; dummy subscriptions cannot verify Web Push delivery.
- Closed-app notification: pending installed iPhone PWA/device verification.

Deployment classification: **backend deployed/configured; frontend live deploy and device push verification pending**.

Approval classification: **not approved for Release Candidate or Stage 10**.

Current completion: **approximately 85%**.

Next authorized stage: **complete Stage 9B-B Cloudflare configuration, endpoint verification, and real closed-app device verification only**.

Do not implement or claim closed-app Web Push completion until those items are configured and live device testing passes.

## NoClip Reference Inspection

Inspected on 2026-06-27 from `.codex-checks/note-clip-current` remote `origin/main`:

- `js/push.js`
- `js/reminders.js`
- `sw.js`
- `cloudflare/note-clip-push/src/worker.js`
- `cloudflare/note-clip-push/wrangler.toml`
- `cloudflare/note-clip-push/migrations/0001_schema.sql`
- `cloudflare/note-clip-push/README.md`

Reference pattern:

- D1-backed Worker with `subscriptions` and `reminders` tables.
- Scheduled Worker cron every minute.
- VAPID public key as public Worker/frontend config.
- VAPID private key as Worker secret only.
- Worker-side VAPID JWT signing and Web Push payload encryption.
- Frontend `PushManager` subscription saved to backend.
- Reminder create/update/delete syncs to backend.
- Service worker receives `push` and calls `showNotification()`.

Talk Arrangements adaptation note:

- Existing Talk `js/push.js` and `sw.js` already cover frontend subscription and notification handling shape.
- Existing Talk Worker now uses KV storage plus Worker-side VAPID/encryption code.
- Recommended next implementation is Cloudflare deployment/configuration plus device verification.
- Do not copy NoClip secrets or its frontend `PUSH_SECRET` value.
