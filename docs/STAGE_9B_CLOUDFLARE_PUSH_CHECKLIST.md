# Stage 9B — Cloudflare Push Backend Checklist

Status: **Stage 9B-A scaffold completed by supervisor; Stage 9B-B is blocked by missing Cloudflare credentials/configuration.**

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

- [ ] Create/confirm Cloudflare Worker name: `talk-arrangements-push`.
- [ ] Create/confirm Worker URL, for example `https://talk-arrangements-push.<account>.workers.dev`.
- [ ] Create storage binding:
  - [ ] KV namespace, or
  - [ ] D1 database, or
  - [ ] Durable Object.
- [ ] Configure scheduled trigger/cron.
- [ ] Generate VAPID key pair.
- [ ] Store VAPID public key in frontend-safe config.
- [ ] Store VAPID private key as Cloudflare secret/env var only.
- [ ] Store VAPID subject/contact email as Cloudflare env var.
- [ ] Configure CORS allowlist for `https://davidfontenelle80-cloud.github.io`.

### Backend endpoint implementation

Required endpoints:

- [ ] `OPTIONS *` CORS preflight.
- [ ] `GET /api/health` returns config/storage status.
- [ ] `POST /api/subscribe` stores/updates subscription.
- [ ] `POST /api/reminders` creates/updates scheduled reminder.
- [ ] `DELETE /api/reminders/:sourceType/:sourceId` removes scheduled reminder.
- [ ] `POST /api/test-push` sends immediate test notification.

Scheduled behavior:

- [ ] Cron finds due reminders.
- [ ] Cron sends Web Push for each due reminder.
- [ ] Successful sends mark reminders as sent or delete them.
- [ ] Failed sends are recorded and retried safely or marked failed.
- [ ] Expired/invalid subscriptions are cleaned up on 404/410 from push service.

### Frontend integration

Existing files to inspect:

- `js/push.js`
- `sw.js`
- `js/app.js`

Required frontend updates only if needed:

- [ ] Configure `window.TALK_ARRANGEMENTS_PUSH_CONFIG.workerUrl`.
- [ ] Configure `window.TALK_ARRANGEMENTS_PUSH_CONFIG.vapidPublicKey`.
- [ ] Verify `TalkPush.subscribe()` calls Worker successfully.
- [ ] Verify reminder save calls `TalkPush.syncReminder()`.
- [ ] Verify reminder delete calls `TalkPush.clearReminder()`.
- [ ] Verify app still works when push is not configured.

### Testing requirements

- [ ] Worker health endpoint works.
- [ ] CORS preflight works from GitHub Pages origin.
- [ ] Subscribe stores a push subscription.
- [ ] Test push is received while app is open.
- [ ] Test push is received with app closed/phone locked.
- [ ] Reminder create syncs to backend.
- [ ] Reminder edit updates backend.
- [ ] Reminder delete cancels backend reminder.
- [ ] Scheduled due reminder fires at selected date/time.
- [ ] Notification tap opens/focuses Talk Arrangements app.
- [ ] No private secrets appear in repo.
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

True closed-app notifications cannot be live-approved until a Cloudflare Worker is deployed with storage, VAPID secrets, scheduled trigger, and successful device testing.

Stage 9B-B credential/deploy recheck on 2026-06-27 found:

- `wrangler` is not available on PATH.
- No deployable `cloudflare/talk-arrangements-push/wrangler.toml` exists; only `wrangler.toml.example` exists.
- Cloudflare auth/account env vars are not set.
- VAPID public/private/subject env vars are not set.
- Worker URL is unavailable.
- `PUSH_STORE` KV namespace/binding is not configured or verifiable.
- Cron trigger is not deployed/configured.

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
- Existing Talk Worker still uses KV scaffold and `sendWebPush()` throws.
- Recommended next implementation is to adapt NoClip's D1 schema and Worker-side VAPID/encryption code, but only after Cloudflare credentials/deploy config are available.
- Do not copy NoClip secrets or its frontend `PUSH_SECRET` value.
