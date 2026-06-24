/**
 * Mobile toolbar polish.
 * Keeps language/theme/settings visible and collapses heavier tools into one panel.
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
      '.toolbar-tools-toggle{display:flex;align-items:center;justify-content:center;gap:6px;grid-column:1/-1;width:100%;}',
      '.toolbar-tools-wrap{display:none;grid-column:1/-1;border:1px solid var(--line,var(--border));border-radius:var(--radius);padding:8px;background:var(--panel-2,var(--panel));gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));}',
      '.toolbar-tools-wrap.open{display:grid;}',
      '.toolbar-tools-wrap button{width:100%;justify-content:center;}',
      '.toolbar-tools-wrap #settingsBtn{display:flex;}',
      '}',
      '@media(max-width:420px){.toolbar-tools-wrap{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function label(){ return t('Tools','Herramientas'); }
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
    toggle.innerHTML = '&#9776; <span></span>';
    toggle.querySelector('span').textContent = label();

    var wrap = document.createElement('div');
    wrap.id = 'toolbarToolsWrap';
    wrap.className = 'toolbar-tools-wrap';

    toolbar.insertBefore(toggle, firstHeavy);
    toolbar.insertBefore(wrap, firstHeavy);
    ['exportBtn','importBtn','resetBtn','settingsCloudSaveBtn'].forEach(function(){});
    ['exportBtn','importBtn','resetBtn'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) wrap.appendChild(el);
    });
    var cloudSave = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Cloud Save|Guardar en nube/i.test(btn.textContent || ''); });
    var cloudRestore = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Cloud Restore|Restaurar de nube/i.test(btn.textContent || ''); });
    var signIn = Array.from(toolbar.querySelectorAll('button')).find(function(btn){ return /Sign in|Iniciar sesión/i.test(btn.textContent || ''); });
    [signIn, cloudSave, cloudRestore].forEach(function(el){ if(el && el.parentElement === toolbar) wrap.appendChild(el); });

    toggle.addEventListener('click', function(){
      var open = !wrap.classList.contains('open');
      wrap.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  function refresh(){
    var toggle = document.getElementById('toolbarToolsToggle');
    if(toggle && toggle.querySelector('span')) toggle.querySelector('span').textContent = label();
  }

  document.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('[data-lang]')) setTimeout(refresh, 150);
  });
  var tries = 0;
  (function wait(){ tries += 1; install(); refresh(); if(tries < 120) setTimeout(wait, 500); })();
})();
