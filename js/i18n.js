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

  // Stage 9 emergency helpers. Must exist before app.js reminder renderers run.
  window.escHtml = window.escHtml || function escHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  window.sanitizeInlineArg = window.sanitizeInlineArg || function sanitizeInlineArg(value) {
    return String(value == null ? '' : value)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '')
      .replace(/\n/g, '\\n');
  };

  const talkStrings = {
    en: {
      appTitle:'Talk Arrangements', subtitle:'Congregation public talk arrangements', dashboard:'Dashboard', planning:'Planning', congregations:'Congregations', eventsTitle:'Events', 'reminders.tab':'Reminders',
      dashHint:'Current year at a glance — current month highlighted.', addMonth:'Add Month', createNextYear:'Next Year', yearSchedule:'Year schedule', month:'Month', congregation:'Congregation', speakerContact:'Speaker contact',
      planningTitle:'Planning for the next 3 years', planningHint:'Use this section for future arrangements and fixed notes.', addYear:'Add Year', congTitle:'Congregation list', congHint:'Edit contact information here; dashboard lookups update immediately.', addCong:'Add',
      eventsHint:'Manage congregation events', addEvent:'+ Add Event', noEvents:'No events yet. Tap + Add Event to create one.', currentMonth:'Current month', phone:'Phone', email:'Email', templates:'Message template',
      openSms:'Send SMS', openEmail:'Send Email', copyMsg:'Copy message', whatsapp:'WhatsApp', call:'Call', text:'Text', mail:'Email', shareContact:'Share contact', privateData:'Contacts loaded', publicData:'Public version — no contacts',
      'reminders.addReminder':'Add Reminder', 'reminders.editReminder':'Edit Reminder', 'reminders.title':'Title', 'reminders.note':'Note', 'reminders.date':'Date', 'reminders.time':'Time', 'reminders.noReminders':'No reminders yet', 'reminders.inAppOnly':'In-app reminders only (app must be open)'
    },
    es: {
      appTitle:'Arreglos de Discursos', subtitle:'Arreglos de discursos públicos de la congregación', dashboard:'Tablero', planning:'Planificación', congregations:'Congregaciones', eventsTitle:'Eventos', 'reminders.tab':'Recordatorios',
      dashHint:'El año actual con el mes presente resaltado.', addMonth:'Añadir mes', createNextYear:'Próximo Año', yearSchedule:'Programa del año', month:'Mes', congregation:'Congregación', speakerContact:'Contacto del discursante',
      planningTitle:'Planificación de los próximos 3 años', planningHint:'Use esta sección para arreglos futuros y notas fijas.', addYear:'Añadir año', congTitle:'Lista de congregaciones', congHint:'Edite los contactos aquí; el tablero se actualiza al instante.', addCong:'Añadir',
      eventsHint:'Administra eventos de la congregación', addEvent:'+ Agregar evento', noEvents:'Sin eventos aún. Toca + Agregar evento para crear uno.', currentMonth:'Mes actual', phone:'Teléfono', email:'Correo', templates:'Plantilla de mensaje',
      openSms:'Enviar SMS', openEmail:'Enviar correo', copyMsg:'Copiar mensaje', whatsapp:'WhatsApp', call:'Llamar', text:'Texto', mail:'Correo', shareContact:'Compartir', privateData:'Contactos cargados', publicData:'Versión pública — sin contactos',
      'reminders.addReminder':'Agregar Recordatorio', 'reminders.editReminder':'Editar Recordatorio', 'reminders.title':'Título', 'reminders.note':'Nota', 'reminders.date':'Fecha', 'reminders.time':'Hora', 'reminders.noReminders':'Sin recordatorios aún', 'reminders.inAppOnly':'Solo recordatorios en la app (la app debe estar abierta)'
    }
  };

  function patchTalkGlobals() {
    if (window.T && window.T.en && window.T.es) {
      Object.assign(window.T.en, talkStrings.en);
      Object.assign(window.T.es, talkStrings.es);
    }
    // Override the visibly corrupted Spanish confirmation message builder if available.
    if (typeof window.buildContactMessage === 'function' && !window.__stage9CleanBuildContactMessage) {
      const original = window.buildContactMessage;
      window.buildContactMessage = function(row, congName) {
        try {
          const p = window.state?.profile || {};
          const ms = (typeof window.months === 'function') ? window.months() : [];
          const m = ms[+row.month] || '';
          const cname = congName || row.congregation || '';
          if (window.state?.language === 'es') {
            const contactName = row.contact || '';
            const greeting = contactName ? ('Saludos hermano ' + contactName.split(/\s+/)[0]) : 'Saludos hermano';
            const from = p.name ? ('Le escribe ' + p.name + (p.congregation ? ' de la Congregación ' + p.congregation : '') + '.') : '';
            return greeting + '. ' + from + ' Le contactamos para confirmar el arreglo del discurso público del mes de ' + m + ' con la congregación ' + cname + '. Por favor confirme su disponibilidad cuando tenga oportunidad. Gracias.' + (p.name ? '\n\n' + p.name : '');
          }
          return original(row, congName);
        } catch (e) { return original(row, congName); }
      };
      window.__stage9CleanBuildContactMessage = true;
    }
  }

  function removeBrokenRawMainTextNodes() {
    if (!document.body) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const toRemove = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = (node.nodeValue || '').trim();
      if (text === '<' || text === '/main>' || text === '</main>' || /^[ÃÂ¢¯¼＋\s]+$/.test(text)) toRemove.push(node);
    }
    toRemove.forEach(node => node.parentNode && node.parentNode.removeChild(node));
  }

  function cleanMojibakeTextNodes() {
    if (!document.body) return;
    const replacements = [
      [/Congregaci(?:Ã|Â|\uFFFD|.)*?n/g, 'Congregación'],
      [/Planificaci(?:Ã|Â|\uFFFD|.)*?n/g, 'Planificación'],
      [/A(?:Ã|Â|\uFFFD|.)*?adir/g, 'Añadir'],
      [/Pr(?:Ã|Â|\uFFFD|.)*?ximo A(?:Ã|Â|\uFFFD|.)*?o/g, 'Próximo Año']
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let s = node.nodeValue || '';
      if (!/[ÃÂ]/.test(s)) return;
      replacements.forEach(([re, val]) => { s = s.replace(re, val); });
      // If a leftover text node is mostly mojibake decoration inside a button, remove it.
      if (/^[\sÃÂ¢¯¼＋\-—<>/]+$/.test(s) && node.parentElement && /BUTTON|SPAN/.test(node.parentElement.tagName)) s = '';
      node.nodeValue = s;
    });
  }

  function installStage9EmergencyLayoutStyle() {
    if (document.getElementById('stage9-emergency-layout-style')) return;
    const style = document.createElement('style');
    style.id = 'stage9-emergency-layout-style';
    style.textContent = `
      nav.no-print{display:flex;gap:18px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;white-space:nowrap;padding:8px 0 10px;scroll-snap-type:x proximity;max-width:100%;}
      nav.no-print button{flex:0 0 auto;min-width:max-content;padding-left:8px;padding-right:8px;scroll-snap-align:start;}
      @media(max-width:720px){nav.no-print{gap:20px;}nav.no-print button{font-size:.92rem;}}
    `;
    document.head.appendChild(style);
  }

  function stage9EmergencyDomPass() {
    patchTalkGlobals();
    removeBrokenRawMainTextNodes();
    cleanMojibakeTextNodes();
    installStage9EmergencyLayoutStyle();
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(current);
    document.getElementById('lang-toggle')?.addEventListener('click', toggle);
    stage9EmergencyDomPass();
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      stage9EmergencyDomPass();
      if (tries >= 40) clearInterval(timer);
    }, 250);
  });
})();
