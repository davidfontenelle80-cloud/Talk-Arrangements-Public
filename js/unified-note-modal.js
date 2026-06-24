/**
 * Stage 5B — Scoped Notes Foundation + Note Launcher Polish.
 * One editor shows Global, Congregation, and Month notes.
 * Table note cells use clean launchers instead of cramped inline editing.
 * Existing row.note and congregation.note storage remains intact.
 */
(function(){
  'use strict';

  var activeContext = null;
  var observerStarted = false;

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }
  function monthList(){
    return typeof months === 'function' ? months() : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }
  function hasText(value){ return String(value || '').trim().length > 0; }
  function ensureNotesState(){
    if(!window.state) return { global: { title:'', details:'' } };
    if(!state.notes || typeof state.notes !== 'object') state.notes = {};
    if(!state.notes.global || typeof state.notes.global !== 'object') state.notes.global = { title:'', details:'' };
    if(state.notes.global.title === undefined) state.notes.global.title = '';
    if(state.notes.global.details === undefined) state.notes.global.details = '';
    return state.notes;
  }
  function ensureStyles(){
    if(document.getElementById('unifiedNoteModalStyles')) return;
    var style = document.createElement('style');
    style.id = 'unifiedNoteModalStyles';
    style.textContent = [
      '.unified-note-bg{display:none;position:fixed;inset:0;z-index:920;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}',
      '.unified-note-bg.open{display:flex;}',
      '.unified-note-modal{width:min(760px,100%);max-height:90vh;display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line,var(--border));border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}',
      '.unified-note-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}',
      '.unified-note-head h3{margin:0;font-size:20px;}',
      '.unified-note-meta{color:var(--muted);font-size:13px;line-height:1.35;}',
      '.unified-note-scroll{overflow:auto;display:grid;gap:12px;padding-right:2px;scroll-behavior:auto;}',
      '.unified-note-scope{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);background:var(--panel-2,var(--panel));padding:12px;display:grid;gap:8px;}',
      '.unified-note-scope h4{margin:0;font-size:15px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;}',
      '.unified-note-scope small{display:inline-flex;border:1px solid var(--line,var(--border));border-radius:999px;padding:3px 8px;color:var(--text);background:rgba(255,255,255,.04);font-weight:700;font-size:12px;line-height:1.2;}',
      '.note-scope-desc{margin:0;color:var(--text);font-size:13px;line-height:1.35;opacity:.9;}',
      '.unified-note-scope input,.unified-note-scope textarea{width:100%;padding:10px;line-height:1.45;font-size:16px;background:var(--panel);}',
      '.unified-note-scope textarea{min-height:92px;max-height:26vh;resize:vertical;}',
      '.unified-note-scope[data-note-scope="global"]{border-left:4px solid #69a7ff;}',
      '.unified-note-scope[data-note-scope="congregation"]{border-left:4px solid var(--accent);}',
      '.unified-note-scope[data-note-scope="month"]{border-left:4px solid var(--warn);}',
      '.unified-note-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}',
      '.unified-note-count{font-size:12px;color:var(--muted);}',
      'textarea[data-field="note"],input[data-field="note"]{display:none!important;}',
      '.note-launcher{width:100%;min-width:128px;justify-content:flex-start;border-color:var(--line,var(--border));background:var(--panel);color:var(--muted);white-space:nowrap;}',
      '.note-launcher.has-notes{border-color:var(--warn);background:color-mix(in srgb,var(--warn),var(--panel) 88%);color:var(--warn);font-weight:800;}',
      '.note-launcher .note-dot{display:inline-flex;align-items:center;justify-content:center;min-width:18px;}',
      '.note-launcher .note-label{overflow:hidden;text-overflow:ellipsis;}',
      '@media(max-width:620px){.unified-note-bg{align-items:flex-start;padding:10px;padding-top:calc(10px + env(safe-area-inset-top));}.unified-note-modal{max-height:92vh;padding:14px}.unified-note-scope{padding:10px}.unified-note-scope h4{display:grid;gap:6px}.unified-note-scope small{width:max-content}.unified-note-scope textarea{min-height:96px;max-height:22vh}.unified-note-actions button{flex:1 1 auto;}.note-launcher{min-width:150px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function findScheduleRow(rowId){
    return Array.isArray(window.state && state.schedule) ? state.schedule.find(function(r){ return String(r.id) === String(rowId); }) || null : null;
  }
  function findPlanningRow(yearValue, rowId){
    var plan = Array.isArray(window.state && state.planning) ? state.planning.find(function(y){ return String(y.year) === String(yearValue); }) : null;
    if(!plan || !Array.isArray(plan.rows)) return null;
    return plan.rows.find(function(r){ return String(r.id) === String(rowId); }) || null;
  }
  function findCongregation(rowId){
    return Array.isArray(window.state && state.congregations) ? state.congregations.find(function(c){ return String(c.id) === String(rowId); }) || null : null;
  }
  function findCongByName(name){
    var n = String(name || '').trim().toLowerCase();
    if(!n || !Array.isArray(window.state && state.congregations)) return null;
    return state.congregations.find(function(c){ return String(c.name || '').trim().toLowerCase() === n; }) || null;
  }
  function contextFromField(field){
    var tr = field && field.closest ? field.closest('tr') : null;
    if(!tr || !tr.dataset.id) return null;
    if(field.closest('#dashboardRows')){
      var srow = findScheduleRow(tr.dataset.id);
      if(!srow) return null;
      return { type:'dashboard', row:srow, congregation:findCongByName(srow.congregation), field:field, label:t('Dashboard notes','Notas del tablero'), meta:(monthList()[Number(srow.month)] || '') + (srow.congregation ? ' — ' + srow.congregation : '') };
    }
    var planningPanel = field.closest('#planningTables .planning-year');
    if(planningPanel){
      var prow = findPlanningRow(planningPanel.dataset.year, tr.dataset.id);
      if(!prow) return null;
      return { type:'planning', row:prow, congregation:findCongByName(prow.congregation), field:field, label:t('Planning notes','Notas de planificación'), meta:(monthList()[Number(prow.month)] || '') + ' ' + planningPanel.dataset.year + (prow.congregation ? ' — ' + prow.congregation : '') };
    }
    if(field.closest('#congregationRows')){
      var cong = findCongregation(tr.dataset.id);
      if(!cong) return null;
      return { type:'congregation', row:null, congregation:cong, field:field, label:t('Congregation notes','Notas de congregación'), meta:cong.name || '' };
    }
    return null;
  }

  function ensureModal(){
    ensureStyles();
    var modal = document.getElementById('unifiedNoteModal');
    if(modal) return modal;
    modal = document.createElement('div');
    modal.id = 'unifiedNoteModal';
    modal.className = 'unified-note-bg no-print';
    modal.innerHTML = '<div class="unified-note-modal" role="dialog" aria-modal="true" aria-labelledby="unifiedNoteTitle">'+
      '<div class="unified-note-head"><div><h3 id="unifiedNoteTitle"></h3><div class="unified-note-meta" id="unifiedNoteMeta"></div></div><button type="button" class="icon-btn" id="unifiedNoteClose">&#215;</button></div>'+ 
      '<div class="unified-note-scroll" id="unifiedNoteScopes">'+
        '<section class="unified-note-scope" data-note-scope="global"><h4><span id="globalNoteLabel"></span><small id="globalNoteHint"></small></h4><p class="note-scope-desc" id="globalNoteDesc"></p><input id="globalNoteTitle" autocomplete="off"><textarea id="globalNoteDetails"></textarea></section>'+ 
        '<section class="unified-note-scope" data-note-scope="congregation"><h4><span id="congNoteLabel"></span><small id="congNoteHint"></small></h4><p class="note-scope-desc" id="congNoteDesc"></p><input id="congNoteTitle" autocomplete="off"><textarea id="congNoteDetails"></textarea></section>'+ 
        '<section class="unified-note-scope" data-note-scope="month"><h4><span id="monthNoteLabel"></span><small id="monthNoteHint"></small></h4><p class="note-scope-desc" id="monthNoteDesc"></p><input id="monthNoteTitle" autocomplete="off"><textarea id="monthNoteDetails"></textarea></section>'+ 
      '</div>'+ 
      '<div class="unified-note-count" id="unifiedNoteCount"></div>'+ 
      '<div class="unified-note-actions"><button type="button" id="unifiedNoteCancel"></button><button type="button" class="primary" id="unifiedNoteSave"></button></div>'+ 
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    document.getElementById('unifiedNoteClose').addEventListener('click', closeModal);
    document.getElementById('unifiedNoteCancel').addEventListener('click', closeModal);
    document.getElementById('unifiedNoteSave').addEventListener('click', saveNote);
    ['globalNoteTitle','globalNoteDetails','congNoteTitle','congNoteDetails','monthNoteTitle','monthNoteDetails'].forEach(function(id){
      document.getElementById(id).addEventListener('input', updateCount);
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    return modal;
  }
  function updateCount(){
    var ids = ['globalNoteTitle','globalNoteDetails','congNoteTitle','congNoteDetails','monthNoteTitle','monthNoteDetails'];
    var total = ids.reduce(function(sum,id){ var el=document.getElementById(id); return sum + (el ? el.value.length : 0); },0);
    var count = document.getElementById('unifiedNoteCount');
    if(count) count.textContent = String(total) + ' ' + t('characters','caracteres');
  }
  function renderModalText(){
    document.getElementById('unifiedNoteTitle').textContent = t('Notes','Notas');
    document.getElementById('unifiedNoteCancel').textContent = t('Cancel','Cancelar');
    document.getElementById('unifiedNoteSave').textContent = t('Save','Guardar');
    document.getElementById('globalNoteLabel').textContent = t('🌎 Global note','🌎 Nota global');
    document.getElementById('globalNoteHint').textContent = t('Visible everywhere','Visible en todas partes');
    document.getElementById('globalNoteDesc').textContent = t('Shows in Dashboard, Planning, Congregations, and future Calendar. Use this for important information that should always be visible.','Se muestra en Tablero, Planificación, Congregaciones y el futuro Calendario. Úsela para información importante que siempre debe verse.');
    document.getElementById('congNoteLabel').textContent = t('🏛️ Congregation note','🏛️ Nota de congregación');
    document.getElementById('congNoteHint').textContent = t('Follows this congregation','Sigue a esta congregación');
    document.getElementById('congNoteDesc').textContent = t('Appears whenever this congregation is used. Best for preferences, restrictions, contacts, or permanent instructions.','Aparece cada vez que esta congregación se usa. Ideal para preferencias, restricciones, contactos o instrucciones permanentes.');
    document.getElementById('monthNoteLabel').textContent = t('📅 Month note','📅 Nota del mes');
    document.getElementById('monthNoteHint').textContent = t('Only this month/year','Solo este mes/año');
    document.getElementById('monthNoteDesc').textContent = t('Only applies to this specific month and year. Best for assemblies, visits, special events, or temporary changes.','Solo aplica a este mes y año específico. Ideal para asambleas, visitas, eventos especiales o cambios temporales.');
    document.getElementById('globalNoteTitle').placeholder = t('Global note title','Título de nota global');
    document.getElementById('globalNoteDetails').placeholder = t('Details visible everywhere','Detalles visibles en todas partes');
    document.getElementById('congNoteTitle').placeholder = t('Congregation note title','Título de nota de congregación');
    document.getElementById('congNoteDetails').placeholder = t('Details for this congregation','Detalles para esta congregación');
    document.getElementById('monthNoteTitle').placeholder = t('Month note title','Título de nota del mes');
    document.getElementById('monthNoteDetails').placeholder = t('Details for this month/year only','Detalles solo para este mes/año');
  }
  function openModal(ctx){
    activeContext = ctx;
    var modal = ensureModal();
    renderModalText();
    var notes = ensureNotesState();
    document.getElementById('unifiedNoteMeta').textContent = (ctx.label || '') + (ctx.meta ? ' • ' + ctx.meta : '');
    document.getElementById('globalNoteTitle').value = String(notes.global.title || '');
    document.getElementById('globalNoteDetails').value = String(notes.global.details || '');
    var scrollBox = document.getElementById('unifiedNoteScopes');
    var congSection = modal.querySelector('[data-note-scope="congregation"]');
    var monthSection = modal.querySelector('[data-note-scope="month"]');
    if(ctx.congregation){
      congSection.style.display = '';
      document.getElementById('congNoteTitle').value = String(ctx.congregation.noteTitle || '');
      document.getElementById('congNoteDetails').value = String(ctx.congregation.note || '');
    }else{
      congSection.style.display = 'none';
      document.getElementById('congNoteTitle').value = '';
      document.getElementById('congNoteDetails').value = '';
    }
    if(ctx.row){
      monthSection.style.display = '';
      document.getElementById('monthNoteTitle').value = String(ctx.row.noteTitle || '');
      document.getElementById('monthNoteDetails').value = String(ctx.row.note || '');
    }else{
      monthSection.style.display = 'none';
      document.getElementById('monthNoteTitle').value = '';
      document.getElementById('monthNoteDetails').value = '';
    }
    modal.classList.add('open');
    if(scrollBox) scrollBox.scrollTop = 0;
    updateCount();
  }
  function closeModal(){
    var modal = document.getElementById('unifiedNoteModal');
    if(modal) modal.classList.remove('open');
    activeContext = null;
  }
  function updateLauncherForField(field){
    var launcher = field && field.parentNode ? field.parentNode.querySelector('.note-launcher') : null;
    if(!launcher) return;
    var ctx = contextFromField(field);
    if(!ctx) return;
    var notes = ensureNotesState();
    var count = 0;
    if(hasText(notes.global.title) || hasText(notes.global.details)) count++;
    if(ctx.congregation && (hasText(ctx.congregation.noteTitle) || hasText(ctx.congregation.note))) count++;
    if(ctx.row && (hasText(ctx.row.noteTitle) || hasText(ctx.row.note))) count++;
    launcher.classList.toggle('has-notes', count > 0);
    var label = count > 1 ? t(count + ' notes', count + ' notas') : (count === 1 ? t('Note', 'Nota') : t('Add note', 'Agregar nota'));
    launcher.innerHTML = '<span class="note-dot">📝</span><span class="note-label">' + label + '</span>';
    launcher.setAttribute('aria-label', label);
    launcher.title = label;
  }
  function refreshVisibleField(){
    if(!activeContext || !activeContext.field) return;
    if(activeContext.type === 'congregation' && activeContext.congregation) activeContext.field.value = activeContext.congregation.note || '';
    else if(activeContext.row) activeContext.field.value = activeContext.row.note || '';
    updateLauncherForField(activeContext.field);
  }
  function saveNote(){
    if(!activeContext) return;
    var notes = ensureNotesState();
    notes.global.title = document.getElementById('globalNoteTitle').value;
    notes.global.details = document.getElementById('globalNoteDetails').value;
    if(activeContext.congregation){
      activeContext.congregation.noteTitle = document.getElementById('congNoteTitle').value;
      activeContext.congregation.note = document.getElementById('congNoteDetails').value;
    }
    if(activeContext.row){
      activeContext.row.noteTitle = document.getElementById('monthNoteTitle').value;
      activeContext.row.note = document.getElementById('monthNoteDetails').value;
    }
    refreshVisibleField();
    if(typeof saveState === 'function') saveState();
    if(typeof toast === 'function') toast(t('Notes saved.','Notas guardadas.'));
    decorateNoteFields();
    closeModal();
  }

  function createLauncher(field){
    if(!field || !field.parentNode || field.parentNode.querySelector('.note-launcher')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'note-launcher';
    btn.dataset.noteLauncher = '1';
    field.parentNode.insertBefore(btn, field.nextSibling);
    updateLauncherForField(field);
  }
  function decorateNoteFields(){
    document.querySelectorAll('textarea[data-field="note"],input[data-field="note"]').forEach(createLauncher);
  }
  function handleNoteOpen(event){
    var launcher = event.target && event.target.closest ? event.target.closest('.note-launcher') : null;
    var field = null;
    if(launcher){
      field = launcher.parentNode ? launcher.parentNode.querySelector('textarea[data-field="note"],input[data-field="note"]') : null;
    }else{
      field = event.target && event.target.closest ? event.target.closest('textarea[data-field="note"],input[data-field="note"]') : null;
    }
    if(!field) return;
    var ctx = contextFromField(field);
    if(!ctx) return;
    event.preventDefault();
    event.stopPropagation();
    openModal(ctx);
  }
  function startObserver(){
    if(observerStarted) return;
    observerStarted = true;
    var mo = new MutationObserver(function(){ decorateNoteFields(); });
    mo.observe(document.body, { childList:true, subtree:true });
    setInterval(decorateNoteFields, 1000);
  }

  document.addEventListener('focusin', handleNoteOpen, true);
  document.addEventListener('click', handleNoteOpen, true);
  document.addEventListener('click', function(event){
    if(event.target && event.target.closest && event.target.closest('[data-lang]')){
      setTimeout(function(){
        if(document.getElementById('unifiedNoteModal') && document.getElementById('unifiedNoteModal').classList.contains('open')) renderModalText();
        decorateNoteFields();
      }, 120);
    }
  });
  ensureStyles();
  ensureNotesState();
  decorateNoteFields();
  startObserver();
})();
