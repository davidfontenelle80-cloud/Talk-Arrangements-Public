# Talk Arrangements Push Worker

Stage: **9B-B backend deployed/configured, device verification pending**

This folder contains the Cloudflare Worker for Talk Arrangements closed-app reminders.

No private secrets are committed.

## Current status

Implemented:

- `GET /api/health`
- `OPTIONS *` CORS preflight
- `POST /api/subscribe`
- `POST /api/reminders`
- `DELETE /api/reminders/:sourceType/:sourceId`
- `POST /api/test-push` sends VAPID Web Push
- scheduled cron handler sends due reminders
- KV-based subscription/reminder storage shape
- expired push subscription cleanup on 404/410
- Worker-side VAPID JWT signing and `aes128gcm` payload encryption

Not complete yet:

- Frontend live deploy after repo commit/push.
- Real browser `PushSubscription` test.
- `POST /api/test-push` with a real subscription.
- Scheduled reminder delivery test.
- iPhone installed-PWA closed-app notification test.

## Verified Cloudflare resources

- Worker name: `talk-arrangements-push`
- Worker URL: `https://talk-arrangements-push.davidfontenelle80.workers.dev`
- Active Worker version: `dc6f63c4-22d7-4fa1-a1af-edc3ab9423a5`
- KV namespace name: `talk-arrangements-push-store`
- KV namespace ID: `5cd8802b64b348e6ba2983ecfa273da5`
- KV binding name: `PUSH_STORE`
- Cron trigger: `* * * * *`
- Frontend Worker URL: configured in `js/push-config.js`
- Frontend VAPID public key: configured in `js/push-config.js`

The VAPID private key must stay only in Cloudflare as the `VAPID_PRIVATE_KEY` secret.

## Verification

- `GET /api/health`: passes and confirms store/public key/private key/subject are visible to the Worker runtime.
- `POST /api/subscribe`: passes with a non-real verification subscription.
- `POST /api/reminders`: passes with a non-real verification subscription.
- `DELETE /api/reminders/:sourceType/:sourceId`: passes with a non-real verification subscription.
- `POST /api/test-push`: requires a real browser `PushSubscription`; dummy subscriptions do not prove delivery.

## Required Cloudflare setup

1. Keep the existing Worker `talk-arrangements-push`.
2. Keep the existing KV namespace `talk-arrangements-push-store`.
3. Deploy with `wrangler deploy` from this folder when Worker code/config changes.
4. Store the private VAPID key only with `wrangler secret put VAPID_PRIVATE_KEY` or the Cloudflare dashboard secret UI.
5. Test subscribe, test push, scheduled reminder, app-closed delivery, and notification click.

## Security rules

Allowed in repo/frontend:

- Worker public URL
- VAPID public key
- non-secret app identifiers

Never commit:

- VAPID private key
- Cloudflare API token
- GitHub token
- shared secret
- production credential dumps

## Codex continuation note

`sendWebPush()` now implements RFC8291/RFC8292-style VAPID signing and `aes128gcm` encryption with Worker-compatible Web Crypto.

Do not mark Stage 9B approved until the Worker has the `PUSH_STORE` binding, Worker variables, `VAPID_PRIVATE_KEY` secret, cron trigger, verified endpoints, and a real closed-app notification fires on David's device at the selected reminder date/time.
