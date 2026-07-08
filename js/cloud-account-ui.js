/**
 * cloud-account-ui.js — adds a persistent Cloud Account (Sign in / Sign out)
 * control to the Settings > Backup & restore panel. Self-diagnosing: if cloud
 * sign-in is not available on this device it says so instead of hiding.
 */
(function () {
  'use strict';

  function fbReady() {
    return !!(window.KHub && KHub.Firebase && KHub.Firebase.auth && KHub.CloudAuth);
  }
  function currentUser() {
    return (window.KHub && KHub.CloudAuth && KHub.CloudAuth.currentUser) ? KHub.CloudAuth.currentUser() : null;
  }
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
    toast._t = setTimeout(function () { el.classList.remove('show'); }, 2800);
  }

  function ensureButton() {
    var save = document.getElementById('settingsCloudSaveBtn');
    if (!save || !save.parentNode) { return null; }
    var btn = document.getElementById('settingsCloudAccountBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'settingsCloudAccountBtn';
      btn.type = 'button';
      save.parentNode.insertBefore(btn, save); // account control first in the row
      btn.addEventListener('click', onClick);
    }
    return btn;
  }

  function updateLabel() {
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

  function onClick() {
    if (!fbReady()) { return; }
    var u = currentUser();
    if (u) {
      var doSignOut = function () {
        KHub.CloudAuth.signOut().then(function () { toast('Signed out of cloud backup'); updateLabel(); });
      };
      if (typeof window.showConfirm === 'function') { window.showConfirm('Sign out of cloud backup?', doSignOut); }
      else if (window.confirm('Sign out of cloud backup?')) { doSignOut(); }
      return;
    }
    KHub.CloudAuth.openDialog().then(function (result) {
      if (result === 'reset-sent') { toast('Password reset email sent'); }
      else if (result) { toast('Signed in to cloud backup'); }
      updateLabel();
    }).catch(function () {});
  }

  var tries = 0;
  (function monitor() {
    tries++;
    if (ensureButton()) {
      updateLabel();
      if (fbReady() && KHub.CloudAuth.onChange && !window.__cloudAccountUiBound) {
        window.__cloudAccountUiBound = true;
        KHub.CloudAuth.onChange(updateLabel);
      }
    }
    if (tries < 240) { setTimeout(monitor, 500); }
  })();
})();
