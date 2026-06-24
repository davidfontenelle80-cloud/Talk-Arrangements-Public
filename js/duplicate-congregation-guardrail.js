/**
 * Stage 5D — Duplicate Congregation Guardrail.
 * Warns when the same congregation is scheduled more than once in the same year.
 * Warning only; user may continue anyway. No rollover/fixed/cloud changes.
 */
(function(){
  'use strict';

  var pending = null;
  var bypassKeys = Object.create(null);

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }
  function monthList(){
    return typeof months === 'function' ? months() : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }
  function norm(value){ return String(value || '').trim().toLowerCase(); }
  function key(scope, year, rowId, congregation){ return [scope, year, rowId, norm(congregation)].join('|'); }
  function rowLabel(row){
    var m = monthList()[Number(row.month)] || '';
    var bits = [m];
    if(row.status){
      var status = row.status;
      if(typeof statusLabel === 'function') status = statusLabel(row.status);
      bits.push(status);
    }else if(row.confirmed){
      bits.push(t('confirmed','confirmado'));
    }else{
      bits.push(t('not contacted','sin contactar'));
    }
    return bits.filter(Boolean).join(' — ');
  }
  function dashboardRows(){
    return Array.isArray(window.state && state.schedule) ? state.schedule : [];
  }
  function planningYear(yearValue){
    return Array.isArray(window.state && state.planning) ? state.planning.find(function(y){ return String(y.year) === String(yearValue); }) : null;
  }
  function duplicateRows(scope, yearValue, currentRowId, congregation){
    var n = norm(congregation);
    if(!n) return [];
    var rows = scope === 'dashboard' ? dashboardRows() : ((planningYear(yearValue) || {}).rows || []);
    return rows.filter(function(row){
      return row && String(row.id) !== String(currentRowId) && norm(row.congregation) === n;
    }).sort(function(a,b){ return Number(a.month) - Number(b.month); });
  }
  function message(congregation, duplicates, yearValue){
    var lines = duplicates.map(function(row){ return '• ' + rowLabel(row) + ' ' + yearValue; }).join('\n');
    if(isEs()){
      return '⚠️ Congregación ya programada\n\n' + congregation + ' ya está programada en:\n\n' + lines + '\n\nProgramar la misma congregación más de una vez en el mismo año no es común.\n\n¿Desea continuar?';
    }
    return '⚠️ Congregation already scheduled\n\n' + congregation + ' is already scheduled in:\n\n' + lines + '\n\nScheduling the same congregation more than once in the same year is uncommon.\n\nContinue anyway?';
  }
  function findDashboardRow(rowId){ return dashboardRows().find(function(r){ return String(r.id) === String(rowId); }) || null; }
  function findPlanningRow(yearValue, rowId){
    var year = planningYear(yearValue);
    return year && Array.isArray(year.rows) ? year.rows.find(function(r){ return String(r.id) === String(rowId); }) || null : null;
  }
  function setFieldValue(target, value){
    if(target) target.value = value || '';
  }
  function applyPending(){
    if(!pending) return;
    var p = pending;
    bypassKeys[key(p.scope, p.year, p.rowId, p.newValue)] = true;
    var row = p.scope === 'dashboard' ? findDashboardRow(p.rowId) : findPlanningRow(p.year, p.rowId);
    if(row){
      row.congregation = p.newValue;
      if(p.scope === 'planning' && typeof lookupCoord === 'function') row.contact = lookupCoord(row.congregation);
    }
    setFieldValue(p.target, p.newValue);
    if(typeof saveState === 'function') saveState();
    if(p.scope === 'dashboard'){
      if(typeof renderContact === 'function'){
        try{ state.selectedMonth = row ? row.month : state.selectedMonth; renderContact(row); }catch(_){ }
      }
      if(typeof renderKpis === 'function') renderKpis();
      if(typeof renderConflicts === 'function') renderConflicts();
    }else{
      if(typeof renderPlanning === 'function') renderPlanning();
    }
    if(typeof toast === 'function') toast(t('Duplicate scheduled intentionally.','Duplicado programado intencionalmente.'));
    pending = null;
  }
  function cancelPending(){
    if(!pending) return;
    var p = pending;
    var row = p.scope === 'dashboard' ? findDashboardRow(p.rowId) : findPlanningRow(p.year, p.rowId);
    if(row){
      row.congregation = p.oldValue || '';
      if(p.scope === 'planning' && typeof lookupCoord === 'function') row.contact = lookupCoord(row.congregation);
    }
    setFieldValue(p.target, p.oldValue || '');
    if(typeof saveState === 'function') saveState();
    if(p.scope === 'planning' && typeof renderPlanning === 'function') renderPlanning();
    pending = null;
  }
  function warnIfNeeded(scope, yearValue, rowId, target, oldValue, newValue){
    if(!newValue || norm(oldValue) === norm(newValue)) return false;
    var k = key(scope, yearValue, rowId, newValue);
    if(bypassKeys[k]) return false;
    var dups = duplicateRows(scope, yearValue, rowId, newValue);
    if(!dups.length) return false;
    pending = { scope: scope, year: yearValue, rowId: rowId, target: target, oldValue: oldValue || '', newValue: newValue };
    if(scope === 'dashboard') setFieldValue(target, oldValue || '');
    if(typeof showConfirm === 'function') showConfirm(message(newValue, dups, yearValue), applyPending, cancelPending);
    else if(window.confirm(message(newValue, dups, yearValue))) applyPending(); else cancelPending();
    return true;
  }
  function dashboardHandler(event){
    var target = event.target;
    if(!target || !target.matches || !target.matches('#dashboardRows [data-field="congregation"]')) return;
    var tr = target.closest('tr');
    var row = tr && findDashboardRow(tr.dataset.id);
    if(!row) return;
    var oldValue = row.congregation || '';
    var newValue = target.value || '';
    if(warnIfNeeded('dashboard', state.currentYear, row.id, target, oldValue, newValue)){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
  function rememberPlanningValue(event){
    var target = event.target;
    if(!target || !target.matches || !target.matches('#planningTables [data-field="congregation"]')) return;
    if(target.dataset.duplicateGuardOldValue === undefined || event.type !== 'input'){
      target.dataset.duplicateGuardOldValue = target.value || '';
    }
  }
  function planningHandler(event){
    var target = event.target;
    if(!target || !target.matches || !target.matches('#planningTables [data-field="congregation"]')) return;
    var panel = target.closest('[data-year]');
    var tr = target.closest('tr');
    if(!panel || !tr) return;
    var yearValue = panel.dataset.year;
    var rowId = tr.dataset.id;
    var oldValue = target.dataset.duplicateGuardOldValue || '';
    var newValue = target.value || '';
    setTimeout(function(){
      var row = findPlanningRow(yearValue, rowId);
      if(!row) return;
      var finalValue = row.congregation || newValue;
      var didWarn = warnIfNeeded('planning', yearValue, rowId, target, oldValue, finalValue);
      if(!didWarn) target.dataset.duplicateGuardOldValue = finalValue || '';
    }, 0);
  }

  document.addEventListener('focusin', rememberPlanningValue, true);
  document.addEventListener('pointerdown', rememberPlanningValue, true);
  document.addEventListener('touchstart', rememberPlanningValue, true);
  document.addEventListener('input', dashboardHandler, true);
  document.addEventListener('change', dashboardHandler, true);
  document.addEventListener('input', planningHandler, true);
  document.addEventListener('change', planningHandler, true);
})();
