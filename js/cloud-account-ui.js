/**
 * cloud-account-ui.js — adds two persistent controls to the Settings > Backup &
 * restore panel: a Cloud Account (Sign in / Sign out) button and a one-tap
 * Enable notifications button. Both are self-diagnosing: if a capability is not
 * available on this device they say so instead of hiding.
 */
(function () {
  'use strict';

  // Align reminder timing with the worker, which sweeps every minute. app.js still
  // ships an old 15-minute assumption (MIN_REMINDER_LEAD_MINUTES / REMINDER_CHECK_MINUTES);
  // these are global vars read at call time, so overriding them here fixes the
  // over-strict lead requirement and makes the "delivers around" hint accurate.
  try {
    window.REMINDER_CHECK_MINUTES = 1;
    window.MIN_REMINDER_LEAD_MINUTES = 2;
  } catch (e) {}

  // ---- shared helpers ----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) { return; }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }
  function anchorRow() {
    var save = document.getElementById('settingsCloudSaveBtn');
    return (save && save.parentNode) ? save : null;
  }

  // ---- Cloud account (sign in / sign out) ----
  function fbReady() {
    return !!(window.KHub && KHub.Firebase && KHub.Firebase.auth && KHub.CloudAuth);
  }
  function currentUser() {
    return (window.KHub && KHub.CloudAuth && KHub.CloudAuth.currentUser) ? KHub.CloudAuth.currentUser() : null;
  }
  function ensureAccountBtn() {
    var save = anchorRow();
    if (!save) { return null; }
    var btn = document.getElementById('settingsCloudAccountBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'settingsCloudAccountBtn';
      btn.type = 'button';
      save.parentNode.insertBefore(btn, save);
      btn.addEventListener('click', onAccountClick);
    }
    return btn;
  }
  function updateAccountLabel() {
    var btn = document.getElementById('settingsCloudAccountBtn');
    if (!btn) { return; }
    if (!fbReady()) {
      btn.disabled = true;
      btn.innerHTML = '&#128274; Cloud sign-in unavailable';
      btn.title = 'Cloud sign-in has not loaded on this device yet. Close and reopen the app, or check your connection.';
      return;
    }
    btn.disabled = false;
    var u = currentUser();
    if (u) {
      btn.innerHTML = '&#9989; Sign out (' + esc(u.email || 'account') + ')';
      btn.title = 'Signed in to cloud backup. Tap to sign out.';
    } else {
      btn.innerHTML = '&#128274; Sign in to cloud backup';
      btn.title = 'Sign in to enable cloud backup and sync across devices.';
    }
  }
  function onAccountClick() {
    if (!fbReady()) { return; }
    var u = currentUser();
    if (u) {
      var doSignOut = function () {
        KHub.CloudAuth.signOut().then(function () { toast('Signed out of cloud backup'); updateAccountLabel(); });
      };
      if (typeof window.showConfirm === 'function') { window.showConfirm('Sign out of cloud backup?', doSignOut); }
      else if (window.confirm('Sign out of cloud backup?')) { doSignOut(); }
      return;
    }
    KHub.CloudAuth.openDialog().then(function (result) {
      if (result === 'reset-sent') { toast('Password reset email sent'); }
      else if (result) { toast('Signed in to cloud backup'); }
      updateAccountLabel();
    }).catch(function () {});
  }

  // ---- Enable notifications (one tap: permission + push subscribe) ----
  function pushReady() { return !!(window.TalkPush && typeof window.TalkPush.subscribe === 'function'); }
  function notifSupported() {
    return ('Notification' in window) && ('serviceWorker' in navigator) && ('PushManager' in window);
  }
  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent || ''); }
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function ensureNotifBtn() {
    var save = anchorRow();
    if (!save) { return null; }
    var btn = document.getElementById('settingsNotifBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'settingsNotifBtn';
      btn.type = 'button';
      save.parentNode.insertBefore(btn, save); // sits between account button and Cloud Save
      btn.addEventListener('click', onNotifClick);
    }
    return btn;
  }
  function updateNotifLabel() {
    var btn = document.getElementById('settingsNotifBtn');
    if (!btn) { return; }
    if (!notifSupported() || !pushReady()) {
      btn.disabled = true;
      btn.innerHTML = '&#128276; Notifications not supported';
      btn.title = 'This device or browser does not support background notifications.';
      return;
    }
    var perm = Notification.permission;
    if (perm === 'granted') {
      btn.disabled = false;
      btn.innerHTML = '&#128276; Notifications on — send test';
      btn.title = 'Notifications are enabled on this device. Tap to send a test.';
    } else if (perm === 'denied') {
      btn.disabled = true;
      btn.innerHTML = '&#128277; Notifications blocked';
      btn.title = 'Notifications are blocked for this app. Turn them on in your device Settings, then reopen the app.';
    } else {
      btn.disabled = false;
      btn.innerHTML = '&#128276; Enable notifications';
      btn.title = 'Turn on reminder notifications on this device.';
    }
  }
  function onNotifClick() {
    if (!notifSupported() || !pushReady()) { return; }
    var perm = Notification.permission;
    if (perm === 'denied') { return; }
    if (perm === 'granted') {
      if (typeof window.TalkPush.sendTestPush === 'function') {
        toast('Sending a test notification...');
        window.TalkPush.sendTestPush()
          .then(function () { toast('Test scheduled — it should arrive shortly.'); })
          .catch(function (e) { toast('Could not send test: ' + ((e && e.message) || 'error')); });
      }
      return;
    }
    if (isIOS() && !isStandalone()) {
      toast('On iPhone/iPad: add this app to your Home Screen, open it from that icon, then tap Enable notifications.');
      return;
    }
    toast('Enabling notifications...');
    window.TalkPush.subscribe()
      .then(function () { toast('Notifications enabled on this device'); updateNotifLabel(); })
      .catch(function (e) { toast('Could not enable: ' + ((e && e.message) || 'permission not granted')); updateNotifLabel(); });
  }

  // ---- monitor: keep both controls present and current ----
  var tries = 0;
  (function monitor() {
    tries++;
    var acct = ensureAccountBtn();
    var notif = ensureNotifBtn();
    if (acct) {
      updateAccountLabel();
      if (fbReady() && KHub.CloudAuth.onChange && !window.__cloudAccountUiBound) {
        window.__cloudAccountUiBound = true;
        KHub.CloudAuth.onChange(updateAccountLabel);
      }
    }
    if (notif) { updateNotifLabel(); }
    if (tries < 240) { setTimeout(monitor, 500); }
  })();
})();
