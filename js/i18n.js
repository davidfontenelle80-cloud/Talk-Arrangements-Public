/**
 * i18n.js — KHub Boilerplate
 * EN/ES language toggle. Persists to localStorage.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'khub_lang';

  const strings = {
    en: {
      welcome: 'Welcome to KHub', welcomeSub: 'Your app starts here.', getStarted: 'Get Started', appName: 'KHub App',
      updateAvailable: 'Update available —', refresh: 'Refresh',
      errorTitle: 'Something went wrong', dismiss: 'Dismiss', tryAgain: 'Try again',
      signIn: 'Sign In', signOut: 'Sign Out', signInPrompt: 'Sign in to continue', email: 'Email address', password: 'Password',
      langToggleToES: 'Switch to Spanish', langToggleToEN: 'Switch to English', themeToggleDark: 'Switch to dark mode', themeToggleLight: 'Switch to light mode',
      cancel: 'Cancel', confirm: 'Confirm', save: 'Save', close: 'Close', loading: 'Loading…', noData: 'No data yet.'
    },
    es: {
      welcome: 'Bienvenido a KHub', welcomeSub: 'Tu app comienza aquí.', getStarted: 'Comenzar', appName: 'KHub App',
      updateAvailable: 'Actualización disponible —', refresh: 'Actualizar',
      errorTitle: 'Algo salió mal', dismiss: 'Cerrar', tryAgain: 'Reintentar',
      signIn: 'Iniciar sesión', signOut: 'Cerrar sesión', signInPrompt: 'Inicia sesión para continuar', email: 'Correo electrónico', password: 'Contraseña',
      langToggleToES: 'Cambiar a español', langToggleToEN: 'Cambiar a inglés', themeToggleDark: 'Cambiar a modo oscuro', themeToggleLight: 'Cambiar a modo claro',
      cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar', close: 'Cerrar', loading: 'Cargando…', noData: 'Sin datos aún.'
    }
  };

  let current = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLang(lang) {
    if (!strings[lang]) { console.warn('[KHub.I18n] Unknown lang:', lang); return; }
    current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[lang][key] !== undefined) el.textContent = strings[lang][key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (strings[lang][key] !== undefined) el.setAttribute('aria-label', strings[lang][key]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (strings[lang][key] !== undefined) el.placeholder = strings[lang][key];
    });
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = lang === 'en' ? 'ES' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? strings.en.langToggleToES : strings.es.langToggleToEN);
    }
    localStorage.setItem(STORAGE_KEY, lang);
    if (window.KHub?.emit) window.KHub.emit('lang:change', lang);
  }

  function toggle() { applyLang(current === 'en' ? 'es' : 'en'); }
  function t(key) { return strings[current]?.[key] ?? key; }

  window.KHub = window.KHub || {};
  window.KHub.I18n = { set: applyLang, toggle, t, get current() { return current; } };

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(current);
    document.getElementById('lang-toggle')?.addEventListener('click', toggle);
  });
})();
