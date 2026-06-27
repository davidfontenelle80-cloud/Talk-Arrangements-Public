/*
 * Stage 9 terminology polish
 * Keeps existing event IDs/data stable while correcting JW-specific labels and icons.
 */
(function () {
  'use strict';

  const labels = {
    en: {
      'circuit-overseer': 'Circuit Overseer Visit',
      assembly: 'Circuit Assembly',
      convention: 'Regional Convention',
      'special-talk': 'Special Talk',
      memorial: 'Memorial',
      'holiday-blackout': 'Holiday / Blackout',
      'local-event': 'Local Congregation Event',
      custom: 'Custom Event'
    },
    es: {
      'circuit-overseer': 'Visita del Superintendente de Circuito',
      assembly: 'Asamblea de Circuito',
      convention: 'Asamblea Regional',
      'special-talk': 'Discurso Especial',
      memorial: 'Conmemoración',
      'holiday-blackout': 'Feriado / Fecha Bloqueada',
      'local-event': 'Evento Congregacional',
      custom: 'Evento Personalizado'
    }
  };

  const icons = {
    'circuit-overseer': '👔',
    assembly: '🏟️',
    convention: '🌍',
    'special-talk': '🎤',
    memorial: '🍷',
    'holiday-blackout': '🚫',
    'local-event': '🏠',
    custom: '📌'
  };

  function currentLang() {
    try { return (window.state && window.state.language) || document.documentElement.lang || 'en'; }
    catch (_) { return 'en'; }
  }

  function patchEventTypes() {
    if (!window.EVENT_TYPES || !Array.isArray(window.EVENT_TYPES)) return false;
    window.EVENT_TYPES.forEach(function (type) {
      if (!type || !type.id) return;
      if (labels.en[type.id]) type.label = { en: labels.en[type.id], es: labels.es[type.id] };
      if (icons[type.id]) type.icon = icons[type.id];
    });
    return true;
  }

  function patchEventTypeSelect() {
    const select = document.getElementById('evTypeField');
    if (!select) return;
    const lang = currentLang() === 'es' ? 'es' : 'en';
    Array.from(select.options || []).forEach(function (opt) {
      if (!opt.value) return;
      const label = labels[lang][opt.value];
      if (label) opt.textContent = label;
    });
  }

  function cleanEventTextNodes() {
    const lang = currentLang() === 'es' ? 'es' : 'en';
    const replacements = {
      'Visita del Superintendente': labels.es['circuit-overseer'],
      'Asamblea': labels.es.assembly,
      'Convención': labels.es.convention,
      'Convention': labels.en.convention,
      'Assembly': labels.en.assembly,
      '🕯️': icons.memorial
    };
    document.querySelectorAll('.cal-det-type,.up-next-ttl,.up-item,.event-type-badge,.ta-event-type,.ta-event-card,[data-event-type-label]').forEach(function (el) {
      let text = el.textContent || '';
      Object.keys(replacements).forEach(function (from) {
        if (text.indexOf(from) !== -1) text = text.split(from).join(replacements[from]);
      });
      if (text !== el.textContent) el.textContent = text;
    });
  }

  function rerenderIfSafe() {
    try {
      if (typeof window.renderEvents === 'function') window.renderEvents();
      if (typeof window.renderCalendar === 'function') window.renderCalendar();
      if (typeof window.renderUpcomingEvents === 'function') window.renderUpcomingEvents();
    } catch (err) {
      console.warn('[Stage9 terminology polish] rerender skipped:', err);
    }
  }

  function apply() {
    const patched = patchEventTypes();
    patchEventTypeSelect();
    cleanEventTextNodes();
    if (patched && !window.__taEventTerminologyRendered) {
      window.__taEventTerminologyRendered = true;
      rerenderIfSafe();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    let tries = 0;
    const timer = setInterval(function () {
      tries += 1;
      apply();
      if (tries >= 20) clearInterval(timer);
    }, 250);
  });

  document.addEventListener('change', function (event) {
    if (event.target && (event.target.id === 'evTypeField' || event.target.matches('[data-lang]'))) {
      setTimeout(apply, 0);
    }
  });

  window.TA_EVENT_TERMINOLOGY = { labels, icons, apply };
})();
