/**
 * Mobile toolbar polish.
 * Keeps language/theme/settings visible and collapses heavier app controls into one panel.
 */
(function(){
  'use strict';

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }

  function ensureStyles(){
    if(document.getElementById('mobileToolbarStyles')) return;
    var style = document.createElement('style');
    style.id = 'mobileToolbarStyles';
    style.textContent = [
      '.toolbar-tools-wrap{display:contents;}',
      '.toolbar-tools-toggle{display:none;}',
      '@media(max-width:720px){',
      'header .toolbar{display:grid;grid-template-columns:auto auto auto;gap:8px;align-items:start;}',
      'header .toolbar>.segmented,header .toolbar>#settingsBtn{width:100%;}',
      '.toolbar-tools-toggle{display:flex;align-items:center;justify-content:center;gap:8px;grid-column:1/-1;width:100%;}',
      '.toolbar-tools-toggle .toolbar-tools-chevron{margin-left:4px;transition:transform .18s ease;}',
      '.toolbar-tools-toggle[aria-expanded="true"] .toolbar-tools-chevron{transform:rotate(180deg);}',
      '.toolbar-tools-wrap{display:none;grid-column:1/-1;border:1px solid var(--line,var(--border));border-radius:var(--radius);padding:12px;background:var(--panel-2,var(--panel));gap:10px 12px;grid-template-columns:repeat(2,minmax(0,1fr));margin:8px 0 10px;box-shadow:var(--shadow,0 10px 30px rgba(0,0,0,.25));}',
      '.toolbar-tools-wrap.open{display:grid;}',
      '.toolbar-tools-wrap button{width:100%;justify-content:center;min-height:48px;white-space:normal;text-align:center;line-height:1.2;}',
      '.toolbar-tools-wrap #settingsBtn{display:flex;}',
      '.toolbar-tools-status{grid-column:1/-1;display:flex;align-items:flex-start;gap:8px;border:1px solid color-mix(in srgb,var(--accent) 35%,var(--line));border-radius:var(--radius-sm);background:color-mix(in srgb,var(--accent) 10%,var(--panel));padding:10px 12px;color:var(--text);line-height:1.3;}',
      '.toolbar-tools-status .status-icon{flex:0 0 auto;}',
      '.toolbar-tools-status .status-text{min-width:0;overflow-wrap:anywhere;word-break:break-word;}',
      '.toolbar-tools-status .status-label{display:block;font-weight:800;color:var(--accent);font-size:13px;}',
      '.toolbar-tools-status .status-email{display:block;font-size:13px;color:var(--muted);}',
      '} ',
      '@media(max-width:420px){.toolbar-tools-wrap{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function label(){ return t('App Controls','Controles de la app'); }
  function signedInLabel(){ return t('Signed in','Sesión activa'); }

  function findCloudStatus(toolbar){
    var buttons = Array.from(toolbar.querySelectorAll('button'));
    return buttons.find(function(btn){
      var txt = (btn.textContent || '').trim();
      return /@/.test(txt) || /Signed in|Sesión activa|Sesion activa/i.test(txt);
    });
  }

  function normalizeCloudStatus(wrap, toolbar){
    var existing = document.getElementById('toolbarCloudStatus');
    var statusButton = findCloudStatus(toolbar) || findCloudStatus(wrap);

    if(!statusButton){
      if(existing) existing.remove();
      return;
    }

    var text = (statusButton.textContent || '').replace(/\s+/g,' ').trim();
    var emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    var email = emailMatch ? emailMatch[0] : '';

    if(!existing){
      existing = document.createElement('div');
      existing.id = 'toolbarCloudStatus';
      existing.className = 'toolbar-tools-status';
      existing.setAttribute('role','status');
      wrap.appendChild(existing);
    }

    existing.innerHTML = '<span class="status-icon">✅</span><span class="status-text"><span class="status-label"></span><span class="status-email"></span></span>';
    existing.querySelector('.status-label').textContent = signedInLabel();
    existing.querySelector('.status-email').textContent = email || text.replace(/^✅\s*/,'');

    if(statusButton.parentElement) statusButton.remove();
  }

  function install(){
    ensureStyles();
    var toolbar = document.querySelector('header .toolbar');
    if(!toolbar || document.getElementById('toolbarToolsToggle')) return;
    var firstHeavy = document.getElementById('exportBtn');
    if(!firstHeavy) return;

    var toggle = document.createElement('button');
    toggle.id = 'toolbarToolsToggle';
    toggle.type = 'button';
    toggle.className = 'toolbar-tools-toggle';
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '&#9776; <span class="toolbar-tools-label"></span><span class="toolbar-tools-chevron">⌄</span>';
    toggle.querySelector('.toolbar-tools-label').textContent = label();

    var wrap = document.createElement('div');
    wrap.id = 'toolbarToolsWrap';
    wrap.className = 'toolbar-tools-wrap';

    toolbar.insertBefore(toggle, firstHeavy);
    toolbar.insertBefore(wrap, firstHeavy);
    ['exportBtn','importBtn','resetBtn'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) wrap.appendChild(el);
    });
    var cloudSave = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Cloud Save|Guardar en nube/i.test(btn.textContent || ''); });
    var cloudRestore = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Cloud Restore|Restaurar de nube/i.test(btn.textContent || ''); });
    var signIn = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Sign in|Iniciar sesión|Iniciar sesion/i.test(btn.textContent || ''); });
    [signIn, cloudSave, cloudRestore].forEach(function(el){ if(el && el.parentElement === toolbar) wrap.appendChild(el); });
    normalizeCloudStatus(wrap, toolbar);

    toggle.addEventListener('click', function(){
      var open = !wrap.classList.contains('open');
      wrap.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      normalizeCloudStatus(wrap, toolbar);
    });
  }

  function refresh(){
    var toggle = document.getElementById('toolbarToolsToggle');
    if(toggle && toggle.querySelector('.toolbar-tools-label')) toggle.querySelector('.toolbar-tools-label').textContent = label();
    var wrap = document.getElementById('toolbarToolsWrap');
    var toolbar = document.querySelector('header .toolbar');
    if(wrap && toolbar) normalizeCloudStatus(wrap, toolbar);
  }

  document.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('[data-lang]')) setTimeout(refresh, 150);
  });
  var tries = 0;
  (function wait(){ tries += 1; install(); refresh(); if(tries < 120) setTimeout(wait, 500); })();
})();
