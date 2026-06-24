/**
 * Stage 5 — Planning clear-row button.
 * Adds a safe, confirmed clear action for Planning rows.
 * Keeps month and row id; clears congregation, contact, confirmed, and note.
 */
(function(){
  'use strict';

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }
  function escLocal(value){
    if (typeof esc === 'function') return esc(value);
    value = String(value == null ? '' : value);
    return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function monthList(){
    return typeof months === 'function' ? months() : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }
  function ensureStyles(){
    if(document.getElementById('planningClearRowStyles')) return;
    var style = document.createElement('style');
    style.id = 'planningClearRowStyles';
    style.textContent = [
      '.planning-clear-cell{white-space:nowrap;text-align:center;}',
      '.planning-clear-btn{min-width:42px;color:var(--danger);border-color:color-mix(in srgb,var(--danger),var(--line) 50%);}',
      '.planning-clear-btn:hover{border-color:var(--danger);background:color-mix(in srgb,var(--danger),var(--panel) 88%);}',
      '.planning-clear-btn[disabled]{opacity:.45;cursor:not-allowed;}'
    ].join('');
    document.head.appendChild(style);
  }
  function rowHasData(row){
    return !!(row && (String(row.congregation||'').trim() || String(row.contact||'').trim() || String(row.note||'').trim() || row.confirmed));
  }
  function planningData(){
    return Array.isArray(window.state && state.planning) ? state.planning : [];
  }
  function findPlanningRow(yearValue, rowId){
    var plan = planningData().find(function(y){ return String(y.year) === String(yearValue); });
    if(!plan || !Array.isArray(plan.rows)) return null;
    return plan.rows.find(function(r){ return String(r.id) === String(rowId); }) || null;
  }
  function clearRow(row){
    row.congregation = '';
    row.contact = '';
    row.confirmed = false;
    row.note = '';
    if (Array.isArray(row.fixedOverrides)) row.fixedOverrides = [];
  }
  function addButtons(){
    ensureStyles();
    document.querySelectorAll('#planningTables .planning-year').forEach(function(panel){
      var table = panel.querySelector('table');
      if(!table) return;
      var headRow = table.querySelector('thead tr');
      if(headRow && !headRow.querySelector('[data-planning-clear-head]')){
        var th = document.createElement('th');
        th.dataset.planningClearHead = '1';
        th.textContent = t('Clear', 'Limpiar');
        headRow.appendChild(th);
      }
      table.querySelectorAll('tbody tr').forEach(function(tr){
        if(tr.querySelector('[data-planning-clear]')) return;
        var row = findPlanningRow(panel.dataset.year, tr.dataset.id);
        var td = document.createElement('td');
        td.className = 'planning-clear-cell no-print';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'planning-clear-btn';
        btn.dataset.planningClear = '1';
        btn.setAttribute('aria-label', t('Clear planning row', 'Limpiar fila de planificación'));
        btn.title = t('Clear this planning row', 'Limpiar esta fila de planificación');
        btn.innerHTML = '&#8634; <span>' + t('Clear', 'Limpiar') + '</span>';
        if(!rowHasData(row)) btn.disabled = true;
        td.appendChild(btn);
        tr.appendChild(td);
      });
    });
  }
  function refreshLabels(){
    document.querySelectorAll('[data-planning-clear-head]').forEach(function(th){ th.textContent = t('Clear', 'Limpiar'); });
    document.querySelectorAll('[data-planning-clear]').forEach(function(btn){
      btn.setAttribute('aria-label', t('Clear planning row', 'Limpiar fila de planificación'));
      btn.title = t('Clear this planning row', 'Limpiar esta fila de planificación');
      btn.innerHTML = '&#8634; <span>' + t('Clear', 'Limpiar') + '</span>';
    });
  }
  function restoreClearedRowPosition(yearValue, rowId){
    setTimeout(function(){
      addButtons();
      var panel = document.querySelector('#planningTables .planning-year[data-year="' + CSS.escape(String(yearValue)) + '"]');
      var tr = panel && panel.querySelector('tbody tr[data-id="' + CSS.escape(String(rowId)) + '"]');
      if(!tr) return;
      try{ tr.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      catch(_){ tr.scrollIntoView(); }
      var congregation = tr.querySelector('[data-field="congregation"]');
      if(congregation) setTimeout(function(){ congregation.focus(); }, 250);
    }, 80);
  }
  function confirmClear(panel, tr){
    var row = findPlanningRow(panel.dataset.year, tr.dataset.id);
    if(!row || !rowHasData(row)) return;
    var yearValue = panel.dataset.year;
    var rowId = tr.dataset.id;
    var m = monthList()[Number(row.month)] || t('this month', 'este mes');
    var message = t(
      'Clear this planning row? This will remove the congregation, contact, confirmed status, and note for ',
      '¿Limpiar esta fila de planificación? Esto quitará la congregación, contacto, estado confirmado y nota de '
    ) + m + ' ' + yearValue + '.';
    var proceed = function(){
      clearRow(row);
      if(typeof saveState === 'function') saveState();
      if(typeof renderPlanning === 'function') renderPlanning();
      restoreClearedRowPosition(yearValue, rowId);
      if(typeof toast === 'function') toast(t('Planning row cleared.', 'Fila de planificación limpiada.'));
    };
    if(typeof showConfirm === 'function') showConfirm(message, proceed);
    else if(window.confirm(message)) proceed();
  }

  document.addEventListener('click', function(event){
    var btn = event.target && event.target.closest ? event.target.closest('[data-planning-clear]') : null;
    if(!btn) return;
    event.preventDefault();
    var tr = btn.closest('tr');
    var panel = btn.closest('.planning-year');
    if(tr && panel) confirmClear(panel, tr);
  });
  document.addEventListener('input', function(event){
    if(event.target && event.target.closest && event.target.closest('#planningTables')) setTimeout(addButtons, 80);
  });
  document.addEventListener('click', function(event){
    if(event.target && event.target.closest && event.target.closest('[data-lang]')) setTimeout(function(){ addButtons(); refreshLabels(); }, 120);
  });
  var tries = 0;
  (function monitor(){
    tries += 1;
    addButtons();
    refreshLabels();
    if(tries < 240) setTimeout(monitor, 500);
  })();
})();
