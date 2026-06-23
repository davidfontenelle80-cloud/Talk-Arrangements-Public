/**
 * a11y.js — KHub Boilerplate
 * Accessibility utilities: live region, focus management,
 * dynamic text sizing, keyboard shortcuts.
 *
 * Load this AFTER config.js and BEFORE app.js.
 */
(function () {
  'use strict';

  // ── Live region announcer ─────────────────────────────────
  // Screen readers announce messages pushed here.
  // Usage: KHub.A11y.announce('File saved.') — polite (non-interrupting)
  //        KHub.A11y.announce('Error!', 'assertive') — interrupting
  let _politeRegion, _assertiveRegion;

  function _ensureRegions() {
    if (_politeRegion) return;
    _politeRegion = document.createElement('div');
    _politeRegion.setAttribute('aria-live', 'polite');
    _politeRegion.setAttribute('aria-atomic', 'true');
    _politeRegion.className = 'sr-only';
    document.body.appendChild(_politeRegion);

    _assertiveRegion = document.createElement('div');
    _assertiveRegion.setAttribute('aria-live', 'assertive');
    _assertiveRegion.setAttribute('aria-atomic', 'true');
    _assertiveRegion.className = 'sr-only';
    document.body.appendChild(_assertiveRegion);
  }

  function announce(message, priority = 'polite') {
    _ensureRegions();
    const region = priority === 'assertive' ? _assertiveRegion : _politeRegion;
    // Clear then set — ensures re-announcement of same message
    region.textContent = '';
    requestAnimationFrame(() => { region.textContent = message; });
  }

  // ── Focus management ──────────────────────────────────────
  // Move focus to a heading or landmark after a view change.
  // Usage: KHub.A11y.focusMain()  /  KHub.A11y.focusEl('#some-id')
  function focusMain() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: false });
  }

  function focusEl(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: false });
  }

  // ── Dynamic text sizing ───────────────────────────────────
  // Respects browser font size preferences via rem.
  // Users can override via a font-size control (e.g., A- / A+).
  // Multiplier stored in localStorage; applied to <html> font-size.
  const FONT_KEY     = 'khub_font_scale';
  const FONT_STEPS   = [0.85, 1, 1.15, 1.3];  // 85% / 100% / 115% / 130%
  let   _fontStep    = parseInt(localStorage.getItem(FONT_KEY) ?? '1', 10);

  function applyFontScale(step) {
    _fontStep = Math.max(0, Math.min(FONT_STEPS.length - 1, step));
    document.documentElement.style.fontSize = `${FONT_STEPS[_fontStep] * 16}px`;
    localStorage.setItem(FONT_KEY, String(_fontStep));
  }

  function increaseFontSize() { applyFontScale(_fontStep + 1); }
  function decreaseFontSize() { applyFontScale(_fontStep - 1); }
  function resetFontSize()    { applyFontScale(1); }

  // ── Keyboard shortcut registry ────────────────────────────
  // Usage: KHub.A11y.addShortcut('alt+d', () => KHub.Theme.toggle())
  const _shortcuts = {};

  function addShortcut(combo, fn) {
    _shortcuts[combo.toLowerCase()] = fn;
  }

  function _comboFromEvent(e) {
    const parts = [];
    if (e.altKey)   parts.push('alt');
    if (e.ctrlKey)  parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  document.addEventListener('keydown', e => {
    // Skip if inside an input/textarea (don't steal text editing shortcuts)
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const fn = _shortcuts[_comboFromEvent(e)];
    if (fn) { e.preventDefault(); fn(e); }
  });

  // ── Default shortcuts ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    applyFontScale(_fontStep);

    // Alt+D — toggle dark mode
    addShortcut('alt+d', () => window.KHub?.Theme?.toggle());
    // Alt+L — toggle language
    addShortcut('alt+l', () => window.KHub?.I18n?.toggle());
    // Alt+H — jump to main content (keyboard shortcut complement to skip link)
    addShortcut('alt+h', () => focusMain());
  });

  window.KHub = window.KHub || {};
  window.KHub.A11y = {
    announce,
    focusMain,
    focusEl,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    addShortcut,
  };
})();

/**
 * Talk Arrangements enhancement: compact dashboard notes with full editor modal.
 * This waits for app.js, patches renderDashboard, and keeps the data model unchanged.
 */
(function(){
  'use strict';
  var attempts=0;
  var lastTrigger=null;

  function boot(){
    attempts++;
    if(typeof window.renderDashboard!=="function"||typeof window.state==="undefined"){
      if(attempts<80)setTimeout(boot,100);
      return;
    }
    installStyles();
    installNotesPatch();
  }

  function installStyles(){
    if(document.getElementById("dashboardNoteStyles"))return;
    var css=''+
      '.note-trigger{width:100%;min-height:36px;justify-content:flex-start;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:13px;color:var(--muted);background:var(--panel);}'+
      '.note-trigger.note-has-content{color:var(--warn);border-color:color-mix(in srgb,var(--warn),var(--line) 18%);background:color-mix(in srgb,var(--warn),var(--panel) 86%);font-weight:700;}'+
      '.note-trigger:hover,.note-trigger:focus-visible{border-color:var(--warn);box-shadow:0 0 0 2px color-mix(in srgb,var(--warn),transparent 76%);}'+
      '.note-modal-bg{display:none;position:fixed;inset:0;z-index:360;align-items:center;justify-content:center;padding:16px;background:var(--color-overlay);}'+
      '.note-modal-bg.open{display:flex;}'+
      '.note-modal{width:min(680px,100%);max-height:min(84vh,720px);display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-md,var(--shadow));padding:18px;}'+
      '.note-modal h3{margin:0;font-size:20px;}'+
      '.note-modal-meta{display:grid;gap:3px;color:var(--muted);font-size:13px;line-height:1.35;}'+
      '.note-modal textarea{width:100%;min-height:220px;max-height:46vh;resize:vertical;padding:12px;line-height:1.45;font-size:16px;background:var(--panel-2);}'+
      '.note-modal-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}'+
      '@media(max-width:620px){.note-modal{max-height:88vh;padding:14px}.note-modal textarea{min-height:260px}}';
    var style=document.createElement("style");
    style.id="dashboardNoteStyles";
    style.textContent=css;
    document.head.appendChild(style);
  }

  function localEsc(v){
    if(typeof window.esc==="function")return window.esc(v);
    v=String(v==null?"":v);
    return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function isEs(){return window.state&&window.state.language==="es";}
  function label(key){
    var es=isEs();
    var map={
      editTitle:es?"Editar nota":"Edit note",
      addNote:es?"Agregar nota":"Add note",
      hasNote:es?"Nota":"Note",
      saveNote:es?"Guardar nota":"Save note",
      cancel:typeof window.tt==="function"?window.tt("cancel"):(es?"Cancelar":"Cancel"),
      month:typeof window.tt==="function"?window.tt("month"):(es?"Mes":"Month"),
      congregation:typeof window.tt==="function"?window.tt("congregation"):(es?"Congregacion":"Congregation"),
      placeholder:es?"Escriba la nota completa aqui...":"Write the full note here..."
    };
    return map[key]||key;
  }
  function rowById(id){
    return window.state&&Array.isArray(window.state.schedule)?window.state.schedule.find(function(r){return r.id===id;}):null;
  }
  function monthName(i){
    return typeof window.months==="function"?(window.months()[+i]||""):"";
  }
  function preview(note){
    note=String(note||"").trim().replace(/\s+/g," ");
    return note.length>28?note.slice(0,28)+"…":note;
  }
  function decorate(){
    var tbody=document.getElementById("dashboardRows");
    if(!tbody||!window.state||!Array.isArray(window.state.schedule))return;
    tbody.querySelectorAll("tr[data-id]").forEach(function(tr){
      var row=rowById(tr.dataset.id);
      if(!row)return;
      var cell=tr.children[4];
      if(!cell)return;
      var note=String(row.note||"");
      var has=!!note.trim();
      var text=has?("📝 "+label("hasNote")):("＋ "+label("addNote"));
      var aria=(has?label("editTitle")+": "+preview(note):label("addNote"))+" — "+monthName(row.month);
      cell.innerHTML='<button type="button" class="note-trigger '+(has?'note-has-content':'')+'" data-note-row-id="'+localEsc(row.id)+'" aria-label="'+localEsc(aria)+'" title="'+localEsc(has?note:label("addNote"))+'">'+localEsc(text)+'</button>';
    });
  }

  function ensureModal(){
    var modal=document.getElementById("dashboardNoteModal");
    if(modal)return modal;
    modal=document.createElement("div");
    modal.id="dashboardNoteModal";
    modal.className="note-modal-bg no-print";
    modal.innerHTML='<div class="note-modal" role="dialog" aria-modal="true" aria-labelledby="dashboardNoteTitle"><h3 id="dashboardNoteTitle"></h3><div class="note-modal-meta" id="dashboardNoteMeta"></div><textarea id="dashboardNoteInput"></textarea><div class="note-modal-actions"><button type="button" id="dashboardNoteCancel"></button><button type="button" class="primary" id="dashboardNoteSave"></button></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click",function(e){if(e.target===modal)closeModal(true);});
    document.getElementById("dashboardNoteCancel").addEventListener("click",function(){closeModal(true);});
    document.getElementById("dashboardNoteSave").addEventListener("click",saveModal);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&modal.classList.contains("open"))closeModal(true);});
    return modal;
  }
  function openModal(row,trigger){
    if(!row)return;
    lastTrigger=trigger||null;
    var modal=ensureModal();
    modal.dataset.rowId=row.id;
    document.getElementById("dashboardNoteTitle").textContent=label("editTitle");
    document.getElementById("dashboardNoteMeta").innerHTML='<div><strong>'+localEsc(label("month"))+':</strong> '+localEsc(monthName(row.month))+'</div><div><strong>'+localEsc(label("congregation"))+':</strong> '+localEsc(row.congregation||"—")+'</div>';
    var input=document.getElementById("dashboardNoteInput");
    input.placeholder=label("placeholder");
    input.value=row.note||"";
    document.getElementById("dashboardNoteCancel").textContent=label("cancel");
    document.getElementById("dashboardNoteSave").textContent=label("saveNote");
    modal.classList.add("open");
    setTimeout(function(){input.focus();input.selectionStart=input.selectionEnd=input.value.length;},40);
  }
  function closeModal(refocus){
    var modal=document.getElementById("dashboardNoteModal");
    if(!modal)return;
    modal.classList.remove("open");
    if(refocus&&lastTrigger&&document.body.contains(lastTrigger))lastTrigger.focus();
  }
  function saveModal(){
    var modal=document.getElementById("dashboardNoteModal");
    if(!modal)return;
    var row=rowById(modal.dataset.rowId);
    if(!row){closeModal(false);return;}
    row.note=document.getElementById("dashboardNoteInput").value;
    if(typeof window.saveState==="function")window.saveState();
    closeModal(false);
    window.renderDashboard();
    var newTrigger=document.querySelector('#dashboardRows tr[data-id="'+(window.CSS&&CSS.escape?CSS.escape(row.id):row.id)+'"] .note-trigger');
    if(newTrigger)newTrigger.focus();
    if(typeof window.toast==="function")window.toast(typeof window.tt==="function"?window.tt("saved"):(isEs()?"Guardado.":"Saved."));
  }

  function installNotesPatch(){
    if(window.__dashboardNotesInstalled)return;
    window.__dashboardNotesInstalled=true;
    var original=window.renderDashboard;
    window.renderDashboard=function(){
      original.apply(this,arguments);
      decorate();
    };
    var rows=document.getElementById("dashboardRows");
    if(rows){
      rows.addEventListener("click",function(e){
        var btn=e.target.closest(".note-trigger");
        if(!btn)return;
        e.preventDefault();
        e.stopPropagation();
        openModal(rowById(btn.dataset.noteRowId),btn);
      });
    }
    window.renderDashboard();
  }

  boot();
})();
