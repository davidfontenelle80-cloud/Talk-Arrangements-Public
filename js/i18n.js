/**
 * i18n.js — KHub Boilerplate
 * EN/ES language toggle. Persists to localStorage.
 *
 * Usage:
 *   data-i18n="key"           — sets element textContent
 *   data-i18n-aria="key"      — sets element aria-label
 *   data-i18n-placeholder="key" — sets input placeholder
 *   KHub.I18n.set('es')       — switch to Spanish
 *   KHub.I18n.t('key')        — get translated string
 *
 * To add a new string: add the key to BOTH en and es blocks.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'khub_lang';

  const strings = {
    en: {
      // Navigation / shell
      welcome:           'Welcome to KHub',
      welcomeSub:        'Your app starts here.',
      getStarted:        'Get Started',
      appName:           'KHub App',

      // Updates
      updateAvailable:   'Update available —',
      refresh:           'Refresh',

      // Errors
      errorTitle:        'Something went wrong',
      dismiss:           'Dismiss',
      tryAgain:          'Try again',

      // Auth
      signIn:            'Sign In',
      signOut:           'Sign Out',
      signInPrompt:      'Sign in to continue',
      email:             'Email address',
      password:          'Password',

      // Accessibility labels
      langToggleToES:    'Switch to Spanish',
      langToggleToEN:    'Switch to English',
      themeToggleDark:   'Switch to dark mode',
      themeToggleLight:  'Switch to light mode',

      // Generic UI
      cancel:            'Cancel',
      confirm:           'Confirm',
      save:              'Save',
      close:             'Close',
      loading:           'Loading…',
      noData:            'No data yet.',
    },
    es: {
      // Navigation / shell
      welcome:           'Bienvenido a KHub',
      welcomeSub:        'Tu app comienza aquí.',
      getStarted:        'Comenzar',
      appName:           'KHub App',

      // Updates
      updateAvailable:   'Actualización disponible —',
      refresh:           'Actualizar',

      // Errors
      errorTitle:        'Algo salió mal',
      dismiss:           'Cerrar',
      tryAgain:          'Reintentar',

      // Auth
      signIn:            'Iniciar sesión',
      signOut:           'Cerrar sesión',
      signInPrompt:      'Inicia sesión para continuar',
      email:             'Correo electrónico',
      password:          'Contraseña',

      // Accessibility labels
      langToggleToES:    'Cambiar a español',
      langToggleToEN:    'Cambiar a inglés',
      themeToggleDark:   'Cambiar a modo oscuro',
      themeToggleLight:  'Cambiar a modo claro',

      // Generic UI
      cancel:            'Cancelar',
      confirm:           'Confirmar',
      save:              'Guardar',
      close:             'Cerrar',
      loading:           'Cargando…',
      noData:            'Sin datos aún.',
    },
  };

  let current = localStorage.getItem(STORAGE_KEY) || 'en';

  /**
   * Apply a language to the entire page.
   * Updates textContent, aria-label, and placeholder on all marked elements.
   */
  function applyLang(lang) {
    if (!strings[lang]) { console.warn('[KHub.I18n] Unknown lang:', lang); return; }
    current = lang;

    // Set <html lang=""> for screen readers
    document.documentElement.lang = lang;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[lang][key] !== undefined) el.textContent = strings[lang][key];
    });

    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (strings[lang][key] !== undefined) el.setAttribute('aria-label', strings[lang][key]);
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (strings[lang][key] !== undefined) el.placeholder = strings[lang][key];
    });

    // Update lang toggle button
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = lang === 'en' ? 'ES' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? strings.en.langToggleToES : strings.es.langToggleToEN);
    }

    localStorage.setItem(STORAGE_KEY, lang);

    // Notify other modules
    if (window.KHub?.emit) window.KHub.emit('lang:change', lang);
  }

  function toggle() { applyLang(current === 'en' ? 'es' : 'en'); }

  /** Get a translated string. Falls back to key if missing. */
  function t(key) { return strings[current]?.[key] ?? key; }

  window.KHub = window.KHub || {};
  window.KHub.I18n = {
    set: applyLang,
    toggle,
    t,
    get current() { return current; },
  };

  // Stage 9 emergency helper: app.js calls sanitizeInlineArg() from inline onclick builders.
  // Keep this global because app.js is non-module code.
  window.sanitizeInlineArg = window.sanitizeInlineArg || function sanitizeInlineArg(value) {
    return String(value == null ? '' : value)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '')
      .replace(/\n/g, '\\n');
  };

  // Stage 9 emergency UI patch: current app.js contains mojibake in T strings.
  // This patches the visible dictionary after app.js loads and re-renders once.
  function patchTalkArrangementStrings() {
    if (!window.T || !window.T.en || !window.T.es) return false;
    Object.assign(window.T.en, {
      appTitle: 'Talk Arrangements',
      subtitle: 'Congregation public talk arrangements',
      dashboard: 'Dashboard',
      planning: 'Planning',
      congregations: 'Congregations',
      backup: 'Backup',
      import: 'Import',
      reset: 'Reset',
      dashHint: 'Current year at a glance — current month highlighted.',
      addMonth: 'Add Month',
      yearSchedule: 'Year schedule',
      month: 'Month',
      congregation: 'Congregation',
      statusCol: 'Status',
      fixedCol: 'Fixed',
      followUpDate: 'Follow up by',
      note: 'Note',
      actions: 'Actions',
      speakerContact: 'Speaker contact',
      planningTitle: 'Planning for the next 3 years',
      planningHint: 'Use this for future arrangements and fixed recurring notes.',
      addYear: 'Add Year',
      congTitle: 'Congregation list',
      congHint: 'Edit contact information here; dashboard lookups update immediately.',
      search: 'Search congregations or contacts',
      addCong: 'Add',
      coordinator: 'Coordinator',
      phone: 'Phone',
      email: 'Email',
      currentMonth: 'Current month',
      copied: 'Copied',
      print: 'Print',
      createNextYear: 'Next Year',
      eventsTitle: 'Events',
      eventsHint: 'Manage congregation events',
      addEvent: '+ Add Event',
      editEvent: 'Edit Event',
      deleteEvent: 'Delete Event',
      eventTitle: 'Title',
      eventType: 'Event type',
      eventStartDate: 'Start date',
      eventEndDate: 'End date',
      eventAllDay: 'All day',
      eventDescription: 'Description',
      eventNotes: 'Notes',
      eventColor: 'Color',
      eventActive: 'Active',
      noEvents: 'No events yet. Tap + Add Event to create one.',
      confirmDeleteEvent: 'Delete this event?',
      'reminders.tab': 'Reminders',
      'reminders.addReminder': 'Add Reminder',
      'reminders.editReminder': 'Edit Reminder',
      'reminders.title': 'Title',
      'reminders.note': 'Note',
      'reminders.date': 'Date',
      'reminders.time': 'Time',
      'reminders.noReminders': 'No reminders yet',
      'reminders.save': 'Save',
      'reminders.cancel': 'Cancel',
      'reminders.deleteReminder': 'Delete',
      'reminders.notifAllow': 'Allow Notifications',
      'reminders.notifEnabled': 'Notifications enabled',
      'reminders.notifDenied': 'Notifications denied',
      'reminders.notifUnsupported': 'Notifications not supported on this device',
      'reminders.iosBanner': 'For reminders, keep the app installed and open. Closed-app notifications need a server push setup.'
    });
    Object.assign(window.T.es, {
      appTitle: 'Arreglos de Discursos',
      subtitle: 'Arreglos de discursos públicos de la congregación',
      dashboard: 'Tablero',
      planning: 'Planificación',
      congregations: 'Congregaciones',
      backup: 'Respaldo',
      import: 'Importar',
      reset: 'Restaurar',
      dashHint: 'El año actual con el mes presente resaltado.',
      addMonth: 'Añadir mes',
      yearSchedule: 'Programa del año',
      month: 'Mes',
      congregation: 'Congregación',
      statusCol: 'Estado',
      fixedCol: 'Fijo',
      followUpDate: 'Seguimiento antes de',
      note: 'Nota',
      actions: 'Acciones',
      speakerContact: 'Contacto del discursante',
      planningTitle: 'Planificación de los próximos 3 años',
      planningHint: 'Use esta sección para arreglos futuros y notas fijas.',
      addYear: 'Añadir año',
      congTitle: 'Lista de congregaciones',
      congHint: 'Edite los contactos aquí; el tablero se actualiza al instante.',
      search: 'Buscar congregaciones o contactos',
      addCong: 'Añadir',
      coordinator: 'Coordinador',
      phone: 'Teléfono',
      email: 'Correo',
      currentMonth: 'Mes actual',
      copied: 'Copiado',
      print: 'Imprimir',
      createNextYear: 'Próximo Año',
      eventsTitle: 'Eventos',
      eventsHint: 'Administra eventos de la congregación',
      addEvent: '+ Agregar evento',
      editEvent: 'Editar evento',
      deleteEvent: 'Eliminar evento',
      eventTitle: 'Título',
      eventType: 'Tipo de evento',
      eventStartDate: 'Fecha de inicio',
      eventEndDate: 'Fecha de fin',
      eventAllDay: 'Todo el día',
      eventDescription: 'Descripción',
      eventNotes: 'Notas',
      eventColor: 'Color',
      eventActive: 'Activo',
      noEvents: 'Sin eventos aún. Toca + Agregar evento para crear uno.',
      confirmDeleteEvent: '¿Eliminar este evento?',
      'reminders.tab': 'Recordatorios',
      'reminders.addReminder': 'Agregar Recordatorio',
      'reminders.editReminder': 'Editar Recordatorio',
      'reminders.title': 'Título',
      'reminders.note': 'Nota',
      'reminders.date': 'Fecha',
      'reminders.time': 'Hora',
      'reminders.noReminders': 'Sin recordatorios aún',
      'reminders.save': 'Guardar',
      'reminders.cancel': 'Cancelar',
      'reminders.deleteReminder': 'Eliminar',
      'reminders.notifAllow': 'Permitir Notificaciones',
      'reminders.notifEnabled': 'Notificaciones activas',
      'reminders.notifDenied': 'Notificaciones denegadas',
      'reminders.notifUnsupported': 'Notificaciones no disponibles en este dispositivo',
      'reminders.iosBanner': 'Para recibir recordatorios, mantén la app instalada y abierta. Las notificaciones con la app cerrada requieren configuración de push con servidor.'
    });
    if (typeof window.renderAll === 'function') {
      try { window.renderAll(); } catch (e) { console.warn('[Stage9Hotfix] renderAll after string patch failed', e); }
    }
    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(current);
    document.getElementById('lang-toggle')?.addEventListener('click', toggle);
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (patchTalkArrangementStrings() || tries > 20) clearInterval(timer);
    }, 100);
  });
})();
