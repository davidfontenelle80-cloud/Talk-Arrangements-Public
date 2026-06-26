(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    workerUrl: '',
    vapidPublicKey: '',
    appName: 'Talk Arrangements'
  };

  function cfg() {
    var external = window.TALK_ARRANGEMENTS_PUSH_CONFIG || {};
    return {
      workerUrl: String(external.workerUrl || DEFAULT_CONFIG.workerUrl || '').replace(/\/+$/, ''),
      vapidPublicKey: String(external.vapidPublicKey || DEFAULT_CONFIG.vapidPublicKey || ''),
      appName: String(external.appName || DEFAULT_CONFIG.appName)
    };
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.workerUrl && c.vapidPublicKey);
  }

  function requireConfigured() {
    if (!isConfigured()) {
      throw new Error('Background push is not configured. Set TALK_ARRANGEMENTS_PUSH_CONFIG.workerUrl and vapidPublicKey.');
    }
    return cfg();
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  function getSubscriptionId() {
    try { return localStorage.getItem('talkPushSubscriptionId') || ''; } catch (e) { return ''; }
  }

  function setSubscriptionId(id) {
    try {
      if (id) localStorage.setItem('talkPushSubscriptionId', id);
    } catch (e) {}
  }

  function jsonFetch(url, options) {
    options = options || {};
    options.headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    return fetch(url, options).then(function (res) {
      return res.text().then(function (txt) {
        var data = {};
        if (txt) {
          try { data = JSON.parse(txt); } catch (e) { data = { raw: txt }; }
        }
        if (!res.ok) {
          var err = new Error(data.error || data.message || ('Push request failed: ' + res.status));
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  function diagnose() {
    var c = cfg();
    return Promise.resolve({
      configured: isConfigured(),
      workerUrl: c.workerUrl,
      hasVapidPublicKey: !!c.vapidPublicKey,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasPushManager: 'PushManager' in window,
      hasNotification: 'Notification' in window,
      permission: ('Notification' in window) ? Notification.permission : 'unsupported',
      subscriptionId: getSubscriptionId()
    });
  }

  function subscribe() {
    var c = requireConfigured();
    if (!('serviceWorker' in navigator)) return Promise.reject(new Error('Service workers are not supported.'));
    if (!('PushManager' in window)) return Promise.reject(new Error('PushManager is not supported.'));
    if (!('Notification' in window)) return Promise.reject(new Error('Notifications are not supported.'));

    var permissionFlow = Notification.permission === 'granted'
      ? Promise.resolve('granted')
      : Notification.requestPermission();

    return permissionFlow.then(function (permission) {
      if (permission !== 'granted') throw new Error('Notification permission was not granted.');
      return navigator.serviceWorker.ready;
    }).then(function (reg) {
      return reg.pushManager.getSubscription().then(function (existing) {
        if (existing) return existing;
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(c.vapidPublicKey)
        });
      });
    }).then(function (sub) {
      return jsonFetch(c.workerUrl + '/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          app: 'talk-arrangements-public',
          subscription: sub,
          userAgent: navigator.userAgent
        })
      }).then(function (data) {
        setSubscriptionId(data.id || data.subscriptionId || '');
        return data;
      });
    });
  }

  function syncReminder(sourceType, sourceId, title, body, fireAt) {
    var c = requireConfigured();
    return subscribe().then(function (subData) {
      return jsonFetch(c.workerUrl + '/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          app: 'talk-arrangements-public',
          subscriptionId: subData.id || subData.subscriptionId || getSubscriptionId(),
          sourceType: sourceType,
          sourceId: sourceId,
          title: title,
          body: body || '',
          fireAt: fireAt
        })
      });
    });
  }

  function clearReminder(sourceType, sourceId) {
    var c = requireConfigured();
    var id = getSubscriptionId();
    var url = c.workerUrl + '/api/reminders/' + encodeURIComponent(sourceType) + '/' + encodeURIComponent(sourceId);
    if (id) url += '?subscriptionId=' + encodeURIComponent(id);
    return jsonFetch(url, { method: 'DELETE' });
  }

  function sendTestPush() {
    var c = requireConfigured();
    return subscribe().then(function (subData) {
      return jsonFetch(c.workerUrl + '/api/test-push', {
        method: 'POST',
        body: JSON.stringify({
          app: 'talk-arrangements-public',
          subscriptionId: subData.id || subData.subscriptionId || getSubscriptionId(),
          title: 'Talk Arrangements',
          body: 'Test reminder notification'
        })
      });
    });
  }

  window.TalkPush = {
    isConfigured: isConfigured,
    diagnose: diagnose,
    subscribe: subscribe,
    syncReminder: syncReminder,
    clearReminder: clearReminder,
    sendTestPush: sendTestPush
  };
})();
