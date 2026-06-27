/*
 * Talk Arrangements Push Worker — Stage 9B scaffold
 *
 * This scaffold intentionally commits no secrets.
 * Codex must finish Web Push signing/delivery after Cloudflare env vars and storage are configured.
 *
 * Required env bindings:
 * - PUSH_STORE: KV namespace binding or compatible storage adapter
 * - VAPID_PUBLIC_KEY: frontend-safe VAPID public key
 * - VAPID_PRIVATE_KEY: secret only, never committed
 * - VAPID_SUBJECT: mailto/contact subject for Web Push
 * - ALLOWED_ORIGIN: https://davidfontenelle80-cloud.github.io
 */

const APP_ID = 'talk-arrangements-public';
const DEFAULT_ALLOWED_ORIGIN = 'https://davidfontenelle80-cloud.github.io';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

function corsHeaders(request, env) {
  const requestOrigin = request.headers.get('origin') || '';
  const allowed = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  const origin = requestOrigin === allowed ? requestOrigin : allowed;
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-max-age': '86400',
  };
}

function requireStore(env) {
  if (!env.PUSH_STORE) throw new Error('Missing PUSH_STORE binding. Configure KV/D1/Durable Object storage.');
  return env.PUSH_STORE;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (_) {
    throw new Error('Invalid JSON body.');
  }
}

function assertApp(data) {
  if (data && data.app && data.app !== APP_ID) throw new Error('Unsupported app.');
}

function makeSubscriptionId(subscription) {
  const endpoint = subscription && subscription.endpoint ? String(subscription.endpoint) : '';
  if (!endpoint) throw new Error('Subscription endpoint is required.');
  return 'sub_' + btoa(endpoint).replace(/[^a-zA-Z0-9]/g, '').slice(-32);
}

function reminderKey(subscriptionId, sourceType, sourceId) {
  return `reminder:${subscriptionId}:${sourceType}:${sourceId}`;
}

async function listDueReminderKeys(store, nowIso) {
  // KV list is eventually consistent. For v1 this is acceptable for reminders.
  // Codex may replace with D1 indexing if precision/scale requires it.
  const due = [];
  let cursor;
  do {
    const page = await store.list({ prefix: 'reminder:', cursor });
    cursor = page.cursor;
    for (const key of page.keys || []) {
      const item = await store.get(key.name, 'json');
      if (item && item.fireAt && item.fireAt <= nowIso && !item.sentAt) due.push({ key: key.name, item });
    }
  } while (cursor);
  return due;
}

async function handleHealth(request, env) {
  return json({
    ok: true,
    app: APP_ID,
    hasStore: !!env.PUSH_STORE,
    hasVapidPublicKey: !!env.VAPID_PUBLIC_KEY,
    hasVapidPrivateKey: !!env.VAPID_PRIVATE_KEY,
    hasVapidSubject: !!env.VAPID_SUBJECT,
    webPushDeliveryImplemented: false,
    note: 'Stage 9B scaffold. Codex must finish Web Push signing/delivery after env setup.',
  }, 200, corsHeaders(request, env));
}

async function handleSubscribe(request, env) {
  const headers = corsHeaders(request, env);
  const store = requireStore(env);
  const data = await readJson(request);
  assertApp(data);

  if (!data.subscription || !data.subscription.endpoint || !data.subscription.keys) {
    return json({ ok: false, error: 'subscription.endpoint and subscription.keys are required.' }, 400, headers);
  }

  const id = makeSubscriptionId(data.subscription);
  const record = {
    id,
    app: APP_ID,
    subscription: data.subscription,
    userAgent: data.userAgent || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await store.put(`subscription:${id}`, JSON.stringify(record));
  return json({ ok: true, id, subscriptionId: id }, 200, headers);
}

async function handleUpsertReminder(request, env) {
  const headers = corsHeaders(request, env);
  const store = requireStore(env);
  const data = await readJson(request);
  assertApp(data);

  const subscriptionId = String(data.subscriptionId || '').trim();
  const sourceType = String(data.sourceType || 'talk-reminder').trim();
  const sourceId = String(data.sourceId || '').trim();
  const fireAt = String(data.fireAt || '').trim();

  if (!subscriptionId || !sourceType || !sourceId || !fireAt) {
    return json({ ok: false, error: 'subscriptionId, sourceType, sourceId, and fireAt are required.' }, 400, headers);
  }

  const subscription = await store.get(`subscription:${subscriptionId}`, 'json');
  if (!subscription) return json({ ok: false, error: 'Unknown subscriptionId.' }, 404, headers);

  const record = {
    app: APP_ID,
    subscriptionId,
    sourceType,
    sourceId,
    title: String(data.title || 'Talk Arrangements Reminder'),
    body: String(data.body || ''),
    fireAt,
    url: data.url || '/Talk-Arrangements-Public/',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await store.put(reminderKey(subscriptionId, sourceType, sourceId), JSON.stringify(record));
  return json({ ok: true, reminder: record }, 200, headers);
}

async function handleDeleteReminder(request, env, pathname) {
  const headers = corsHeaders(request, env);
  const store = requireStore(env);
  const parts = pathname.split('/').filter(Boolean);
  // /api/reminders/:sourceType/:sourceId
  const sourceType = decodeURIComponent(parts[2] || '');
  const sourceId = decodeURIComponent(parts[3] || '');
  const url = new URL(request.url);
  const subscriptionId = url.searchParams.get('subscriptionId') || '';

  if (!sourceType || !sourceId) return json({ ok: false, error: 'sourceType and sourceId are required.' }, 400, headers);

  if (subscriptionId) {
    await store.delete(reminderKey(subscriptionId, sourceType, sourceId));
    return json({ ok: true, deleted: 1 }, 200, headers);
  }

  // Fallback cleanup across subscriptions. Codex may optimize with an index.
  let deleted = 0;
  let cursor;
  do {
    const page = await store.list({ prefix: 'reminder:', cursor });
    cursor = page.cursor;
    for (const key of page.keys || []) {
      const item = await store.get(key.name, 'json');
      if (item && item.sourceType === sourceType && item.sourceId === sourceId) {
        await store.delete(key.name);
        deleted += 1;
      }
    }
  } while (cursor);

  return json({ ok: true, deleted }, 200, headers);
}

async function sendWebPush(subscription, payload, env) {
  // STOP POINT FOR CODEX:
  // Implement RFC8291/RFC8292 Web Push encryption/signing here, or import a Worker-compatible
  // Web Push helper library after validating it works in Cloudflare Workers.
  // Required env values: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
  // Do not commit private keys.
  throw new Error('Web Push delivery is not implemented in scaffold. Complete this in Stage 9B-B.');
}

async function handleTestPush(request, env) {
  const headers = corsHeaders(request, env);
  const store = requireStore(env);
  const data = await readJson(request);
  assertApp(data);

  const subscriptionId = String(data.subscriptionId || '').trim();
  if (!subscriptionId) return json({ ok: false, error: 'subscriptionId is required.' }, 400, headers);

  const subRecord = await store.get(`subscription:${subscriptionId}`, 'json');
  if (!subRecord) return json({ ok: false, error: 'Unknown subscriptionId.' }, 404, headers);

  const payload = {
    title: data.title || 'Talk Arrangements',
    body: data.body || 'Test reminder notification',
    sourceType: 'test-push',
    sourceId: crypto.randomUUID(),
    url: '/Talk-Arrangements-Public/',
  };

  await sendWebPush(subRecord.subscription, payload, env);
  return json({ ok: true }, 200, headers);
}

async function processDueReminders(env) {
  const store = requireStore(env);
  const nowIso = new Date().toISOString();
  const due = await listDueReminderKeys(store, nowIso);
  const results = [];

  for (const entry of due) {
    const reminder = entry.item;
    try {
      const subRecord = await store.get(`subscription:${reminder.subscriptionId}`, 'json');
      if (!subRecord) throw new Error('Missing subscription record.');
      await sendWebPush(subRecord.subscription, {
        title: reminder.title,
        body: reminder.body,
        sourceType: reminder.sourceType,
        sourceId: reminder.sourceId,
        url: reminder.url || '/Talk-Arrangements-Public/',
      }, env);
      reminder.sentAt = new Date().toISOString();
      await store.put(entry.key, JSON.stringify(reminder));
      results.push({ key: entry.key, ok: true });
    } catch (error) {
      reminder.lastError = error.message;
      reminder.lastAttemptAt = new Date().toISOString();
      await store.put(entry.key, JSON.stringify(reminder));
      results.push({ key: entry.key, ok: false, error: error.message });
    }
  }

  return results;
}

async function route(request, env) {
  const url = new URL(request.url);
  const headers = corsHeaders(request, env);

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') return handleHealth(request, env);
    if (request.method === 'POST' && url.pathname === '/api/subscribe') return handleSubscribe(request, env);
    if (request.method === 'POST' && url.pathname === '/api/reminders') return handleUpsertReminder(request, env);
    if (request.method === 'DELETE' && url.pathname.startsWith('/api/reminders/')) return handleDeleteReminder(request, env, url.pathname);
    if (request.method === 'POST' && url.pathname === '/api/test-push') return handleTestPush(request, env);

    return json({ ok: false, error: 'Not found.' }, 404, headers);
  } catch (error) {
    return json({ ok: false, error: error.message || 'Worker error.' }, 500, headers);
  }
}

export default {
  fetch: route,
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(processDueReminders(env));
  },
};
