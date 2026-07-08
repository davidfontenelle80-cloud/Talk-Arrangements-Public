(function () {
  'use strict';

  window.TALK_ARRANGEMENTS_PUSH_CONFIG = Object.assign({
    // Public values only. Do not put VAPID private keys or Cloudflare tokens here.
    workerUrl: 'https://talk-arrangements-push.davidfontenelle80.workers.dev',
    vapidPublicKey: 'BIe93k4JqNNiEgVpwSf2sXwhIqDdoXxdSECJdKVgCt_2R7EKADVFZqlUHxJ-lzpenLyrv49V8ckxyWW8p5ErXw0',
    appName: 'Talk Arrangements'
  }, window.TALK_ARRANGEMENTS_PUSH_CONFIG || {});
})();

// Load the Cloud Account (Sign in / Sign out) settings control without editing index.html.
(function () {
  'use strict';
  function load() {
    if (document.getElementById('cloud-account-ui-js')) return;
    var s = document.createElement('script');
    s.id = 'cloud-account-ui-js';
    s.src = 'js/cloud-account-ui.js';
    s.defer = true;
    (document.body || document.head || document.documentElement).appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
