# Talk Arrangements Push Worker

Stage: **9B-A scaffold**

This folder contains a safe starter Cloudflare Worker for Talk Arrangements closed-app reminders.

No private secrets are committed.

## Current status

Implemented scaffold:

- `GET /api/health`
- `OPTIONS *` CORS preflight
- `POST /api/subscribe`
- `POST /api/reminders`
- `DELETE /api/reminders/:sourceType/:sourceId`
- `POST /api/test-push` route shape
- scheduled cron handler shape
- KV-based subscription/reminder storage shape

Not complete yet:

- Actual Web Push VAPID signing/encryption/delivery inside `sendWebPush()`.
- Cloudflare Worker deployment.
- KV namespace creation.
- VAPID key generation.
- Secret/env var setup.
- iPhone closed-app notification test.

## Required Cloudflare setup

1. Create a Worker named `talk-arrangements-push`.
2. Create KV namespace `PUSH_STORE`.
3. Bind KV namespace to Worker as `PUSH_STORE`.
4. Generate VAPID key pair.
5. Configure variables:
   - `ALLOWED_ORIGIN=https://davidfontenelle80-cloud.github.io`
   - `VAPID_PUBLIC_KEY=<public key>`
   - `VAPID_SUBJECT=mailto:<contact email>`
6. Configure secrets:
   - `VAPID_PRIVATE_KEY=<private key>`
7. Add scheduled trigger/cron.
8. Deploy Worker.
9. Add Worker URL and VAPID public key to the frontend config.
10. Test subscribe, test push, scheduled reminder, app-closed delivery, and notification click.

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

The main unfinished code area is `sendWebPush()` in `worker.js`.

Codex should either:

- implement RFC8291/RFC8292 Web Push signing/encryption using Cloudflare-compatible Web Crypto, or
- add a Worker-compatible Web Push helper library after verifying it runs in Cloudflare Workers.

Do not mark Stage 9B approved until a real closed-app notification fires on David's device at the selected reminder date/time.
