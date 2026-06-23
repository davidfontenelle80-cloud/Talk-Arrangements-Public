/**
 * a11y.js — KHub Boilerplate
 * Accessibility utilities: live region, focus management,
 * dynamic text sizing, keyboard shortcuts.
 *
 * Load this AFTER config.js and BEFORE app.js.
 */
(function () {
  'use strict';

  let _politeRegion, _assertiveRegion;

  function _ensureRegions() {
    if (_politeRegion) return;
    _politeRegion = document.createElement('div');
    _politeRegion.setAttribute('aria-live', 'polite');
    _politeRegion.setAttribute('aria-atomic', 'true');
    _politeRegion.className = 'sr-only';
    document.body.appendChild(_politeRegion);

    _assertiveRegion = document.createElement('div');
    _assertiveRegion.setAttribute('aria-live', 'assertive');
    _assertiveRegion.setAttribute('aria-atomic', 'true');
    _assertiveRegion.className = 'sr-only';
    document.body.appendChild(_assertiveRegion);
  }

  function announce(message, priority = 'polite') {
    _ensureRegions();
    const region = priority === 'assertive' ? _assertiveRegion : _politeRegion;
    region.textContent = '';
    requestAnimationFrame(() => { region.textContent = message; });
  }

  function focusMain() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: false });
  }

  function focusEl(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: false });
  }

  const FONT_KEY = 'khub_font_scale';
  const FONT_STEPS = [0.85, 1, 1.15, 1.3];
  let _fontStep = parseInt(localStorage.getItem(FONT_KEY) ?? '1', 10);

  function applyFontScale(step) {
    _fontStep = Math.max(0, Math.min(FONT_STEPS.length - 1, step));
    document.documentElement.style.fontSize = `${FONT_STEPS[_fontStep] * 16}px`;
    localStorage.setItem(FONT_KEY, String(_fontStep));
  }

  function increaseFontSize() { applyFontScale(_fontStep + 1); }
  function decreaseFontSize() { applyFontScale(_fontStep - 1); }
  function resetFontSize() { applyFontScale(1); }

  const _shortcuts = {};

  function addShortcut(combo, fn) {
    _shortcuts[combo.toLowerCase()] = fn;
  }

  function _comboFromEvent(e) {
    const parts = [];
    if (e.altKey) parts.push('alt');
    if (e.ctrlKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const fn = _shortcuts[_comboFromEvent(e)];
    if (fn) { e.preventDefault(); fn(e); }
  });

  function loadScriptOnce(src) {
    if (document.querySelector('script[src="' + src + '"]')) return Promise.resolve();
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyFontScale(_fontStep);

    addShortcut('alt+d', () => window.KHub?.Theme?.toggle());
    addShortcut('alt+l', () => window.KHub?.I18n?.toggle());
    addShortcut('alt+h', () => focusMain());

    if (document.getElementById('dashboardRows')) {
      loadScriptOnce('js/dashboard-notes.js')
        .then(() => loadScriptOnce('js/fixed-preview.js'))
        .then(() => loadScriptOnce('js/fixed-manager-ux.js'))
        .then(() => loadScriptOnce('js/planning-conflicts.js'))
        .then(() => loadScriptOnce('js/rollover-preview.js'));
    }
  });

  window.KHub = window.KHub || {};
  window.KHub.A11y = {
    announce,
    focusMain,
    focusEl,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    addShortcut,
  };
})();
