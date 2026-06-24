/**
 * Stage 5D — Duplicate Congregation Guardrail.
 * Dashboard uses direct input guardrail.
 * Planning uses a state watcher so iPhone Safari select behavior cannot bypass the warning.
 */
(function(){
  'use strict';

  var pending = null;
  var bypassKeys = Object.create(null);
  var planningSnapshot = Object.create(null);
  var planningWatcherReady = false;

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }
  function monthList(){
    return typeof months === 'function' ? months() : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }
  function norm(value){ return String(value || '').trim().toLowerCase(); }
  function key(scope, year, rowId, congregation){ return [scope, year, rowId, norm(congregation)].join('|'); }
  function rowKey(yearValue, rowId){ return String(yearValue) + '|' + String(rowId); }
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
  function planningYears(){
    return Array.isArray(window.state && state.planning) ? state.planning : [];
  }
  function planningYear(yearValue){
    return planningYears().find(function(y){ return String(y.year) === String(yearValue); }) || null;
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
  function syncPlanningSnapshot(){
    var next = Object.create(null);
    planningYears().forEach(function(year){
      (year.rows || []).forEach(function(row){
        next[rowKey(year.year, row.id)] = row.congregation || '';
      });
    });
    planningSnapshot = next;
    planningWatcherReady = true;
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
      syncPlanningSnapshot();
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
    if(p.scope === 'planning'){
      syncPlanningSnapshot();
      if(typeof renderPlanning === 'function') renderPlanning();
    }
    pending = null;
  }
  function warnIfNeeded(scope, yearValue, rowId, target, oldValue, newValue){
    if(!newValue || norm(oldValue) === norm(newValue)) return false;
    var k = key(scope, yearValue, rowId, newValue);
    if(bypassKeys[k]) return false;
    var dups = duplicateRows(scope, yearValue, rowId, newValue);
    if(!dups.length) return false;
    pending = { scope: scope, year: yearValue, rowId: rowId, target: target || null, oldValue: oldValue || '', newValue: newValue };
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
  function planningStateWatcher(){
    if(pending || !window.state || !Array.isArray(state.planning)) return;
    if(!planningWatcherReady){ syncPlanningSnapshot(); return; }
    for(var yi=0; yi<state.planning.length; yi++){
      var year = state.planning[yi];
      var rows = year.rows || [];
      for(var ri=0; ri<rows.length; ri++){
        var row = rows[ri];
        var rk = rowKey(year.year, row.id);
        var oldValue = planningSnapshot[rk] || '';
        var newValue = row.congregation || '';
        if(norm(oldValue) !== norm(newValue)){
          if(warnIfNeeded('planning', year.year, row.id, null, oldValue, newValue)) return;
          planningSnapshot[rk] = newValue;
        }
      }
    }
    // Pick up added/deleted planning rows without warning on untouched existing data.
    planningYears().forEach(function(year){
      (year.rows || []).forEach(function(row){
        var rk = rowKey(year.year, row.id);
        if(planningSnapshot[rk] === undefined) planningSnapshot[rk] = row.congregation || '';
      });
    });
  }

  document.addEventListener('input', dashboardHandler, true);
  document.addEventListener('change', dashboardHandler, true);
  setTimeout(syncPlanningSnapshot, 800);
  setInterval(planningStateWatcher, 250);
})();
