(function () {
  'use strict';

  window.TALK_ARRANGEMENTS_PUSH_CONFIG = Object.assign({
    // Public values only. Do not put VAPID private keys or Cloudflare tokens here.
    workerUrl: 'https://talk-arrangements-push.davidfontenelle80.workers.dev',
    vapidPublicKey: 'BIe93k4JqNNiEgVpwSf2sXwhIqDdoXxdSECJdKVgCt_2R7EKADVFZqlUHxJ-lzpenLyrv49V8ckxyWW8p5ErXw0',
    appName: 'Talk Arrangements'
  }, window.TALK_ARRANGEMENTS_PUSH_CONFIG || {});
})();
