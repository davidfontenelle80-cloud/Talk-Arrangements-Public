/**
 * Stage 5B — Unified Note Modal.
 * Gives Dashboard, Planning, and Congregation note fields the same large editor.
 * Data shape is unchanged: each record still owns its existing note field.
 */
(function(){
  'use strict';

  var activeContext = null;

  function isEs(){ return window.state && state.language === 'es'; }
  function t(en, es){ return isEs() ? es : en; }
  function monthList(){
    return typeof months === 'function' ? months() : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }
  function ensureStyles(){
    if(document.getElementById('unifiedNoteModalStyles')) return;
    var style = document.createElement('style');
    style.id = 'unifiedNoteModalStyles';
    style.textContent = [
      '.unified-note-bg{display:none;position:fixed;inset:0;z-index:920;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}',
      '.unified-note-bg.open{display:flex;}',
      '.unified-note-modal{width:min(680px,100%);max-height:90vh;display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line,var(--border));border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}',
      '.unified-note-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}',
      '.unified-note-head h3{margin:0;font-size:20px;}',
      '.unified-note-meta{color:var(--muted);font-size:13px;line-height:1.35;}',
      '.unified-note-modal textarea{width:100%;min-height:240px;max-height:50vh;resize:vertical;padding:12px;line-height:1.45;font-size:16px;background:var(--panel-2,var(--panel));}',
      '.unified-note-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}',
      '.unified-note-count{font-size:12px;color:var(--muted);}',
      'textarea[data-field="note"],input[data-field="note"]{cursor:pointer;}',
      '@media(max-width:620px){.unified-note-modal{max-height:92vh;padding:14px}.unified-note-modal textarea{min-height:300px}.unified-note-actions button{flex:1 1 auto;}}'
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
  function contextFromField(field){
    var tr = field && field.closest ? field.closest('tr') : null;
    if(!tr || !tr.dataset.id) return null;
    if(field.closest('#dashboardRows')){
      var srow = findScheduleRow(tr.dataset.id);
      if(!srow) return null;
      return { type:'dashboard', row:srow, field:field, label:t('Dashboard note','Nota del tablero'), meta:(monthList()[Number(srow.month)] || '') + (srow.congregation ? ' — ' + srow.congregation : '') };
    }
    var planningPanel = field.closest('#planningTables .planning-year');
    if(planningPanel){
      var prow = findPlanningRow(planningPanel.dataset.year, tr.dataset.id);
      if(!prow) return null;
      return { type:'planning', row:prow, field:field, label:t('Planning note','Nota de planificación'), meta:(monthList()[Number(prow.month)] || '') + ' ' + planningPanel.dataset.year + (prow.congregation ? ' — ' + prow.congregation : '') };
    }
    if(field.closest('#congregationRows')){
      var cong = findCongregation(tr.dataset.id);
      if(!cong) return null;
      return { type:'congregation', row:cong, field:field, label:t('Congregation note','Nota de congregación'), meta:cong.name || '' };
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
      '<textarea id="unifiedNoteText"></textarea>'+ 
      '<div class="unified-note-count" id="unifiedNoteCount"></div>'+ 
      '<div class="unified-note-actions"><button type="button" id="unifiedNoteCancel"></button><button type="button" class="primary" id="unifiedNoteSave"></button></div>'+ 
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    document.getElementById('unifiedNoteClose').addEventListener('click', closeModal);
    document.getElementById('unifiedNoteCancel').addEventListener('click', closeModal);
    document.getElementById('unifiedNoteSave').addEventListener('click', saveNote);
    document.getElementById('unifiedNoteText').addEventListener('input', updateCount);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    return modal;
  }
  function updateCount(){
    var text = document.getElementById('unifiedNoteText');
    var count = document.getElementById('unifiedNoteCount');
    if(text && count) count.textContent = String(text.value.length) + ' ' + t('characters','caracteres');
  }
  function renderModalText(){
    document.getElementById('unifiedNoteTitle').textContent = t('Edit Note','Editar nota');
    document.getElementById('unifiedNoteCancel').textContent = t('Cancel','Cancelar');
    document.getElementById('unifiedNoteSave').textContent = t('Save','Guardar');
  }
  function openModal(ctx){
    activeContext = ctx;
    var modal = ensureModal();
    renderModalText();
    document.getElementById('unifiedNoteMeta').textContent = (ctx.label || '') + (ctx.meta ? ' • ' + ctx.meta : '');
    var text = document.getElementById('unifiedNoteText');
    text.value = String(ctx.row.note || '');
    modal.classList.add('open');
    updateCount();
    setTimeout(function(){ text.focus(); text.selectionStart = text.selectionEnd = text.value.length; }, 30);
  }
  function closeModal(){
    var modal = document.getElementById('unifiedNoteModal');
    if(modal) modal.classList.remove('open');
    activeContext = null;
  }
  function saveNote(){
    if(!activeContext || !activeContext.row) return;
    var text = document.getElementById('unifiedNoteText');
    activeContext.row.note = text ? text.value : '';
    if(activeContext.field) activeContext.field.value = activeContext.row.note;
    if(typeof saveState === 'function') saveState();
    if(typeof toast === 'function') toast(t('Note saved.','Nota guardada.'));
    closeModal();
  }

  function handleNoteOpen(event){
    var field = event.target && event.target.closest ? event.target.closest('textarea[data-field="note"],input[data-field="note"]') : null;
    if(!field) return;
    var ctx = contextFromField(field);
    if(!ctx) return;
    event.preventDefault();
    event.stopPropagation();
    openModal(ctx);
  }

  document.addEventListener('focusin', handleNoteOpen, true);
  document.addEventListener('click', handleNoteOpen, true);
  document.addEventListener('click', function(event){
    if(event.target && event.target.closest && event.target.closest('[data-lang]')){
      setTimeout(function(){ if(document.getElementById('unifiedNoteModal') && document.getElementById('unifiedNoteModal').classList.contains('open')) renderModalText(); }, 120);
    }
  });
  ensureStyles();
})();
