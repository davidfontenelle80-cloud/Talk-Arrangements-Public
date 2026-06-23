/**
 * dashboard-notes.js — Talk app enhancements.
 * - Stage 0.5: compact dashboard notes with full editor modal.
 * - Stage 1: fixedArrangements[] data model bootstrap without UI or rollover changes.
 */
(function(){
  'use strict';

  function installNoteStyles(){
    if(document.getElementById('dashboardNoteStyles'))return;
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
    var style=document.createElement('style');
    style.id='dashboardNoteStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }

  function uuid(){
    try{if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();}catch(e){}
    return 'fixed-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
  }

  function normalizeFixedRule(rule){
    rule=rule&&typeof rule==='object'?rule:{};
    var months=Array.isArray(rule.months)?rule.months:(rule.month!==undefined?[rule.month]:[]);
    months=months.map(function(m){return +m;}).filter(function(m){return !isNaN(m)&&m>=0&&m<12;});
    months=Array.from(new Set(months)).sort(function(a,b){return a-b;});
    var mode=rule.mode==='years'?'years':'continuous';
    var years=Array.isArray(rule.years)?rule.years:[];
    years=years.map(function(y){return +y;}).filter(function(y){return !isNaN(y)&&y>=2000&&y<=2100;});
    years=Array.from(new Set(years)).sort(function(a,b){return a-b;});
    return {id:rule.id||uuid(),congregation:String(rule.congregation||''),months:months,mode:mode,years:mode==='years'?years:[],note:String(rule.note||'')};
  }

  function ensureFixedArrangements(){
    if(typeof state==='undefined'||!state)return;
    if(!Array.isArray(state.fixedArrangements))state.fixedArrangements=[];
    state.fixedArrangements=state.fixedArrangements.map(normalizeFixedRule);
    if(typeof starter!=='undefined'&&starter&&!Array.isArray(starter.fixedArrangements))starter.fixedArrangements=[];
  }

  function installFixedDataBootstrap(){
    if(window.__talkFixedDataInstalled||typeof saveState!=='function')return;
    window.__talkFixedDataInstalled=true;
    ensureFixedArrangements();
    var originalSaveState=saveState;
    saveState=function(){ensureFixedArrangements();return originalSaveState.apply(this,arguments);};
    if(typeof renderAll==='function'){
      var originalRenderAll=renderAll;
      renderAll=function(){ensureFixedArrangements();return originalRenderAll.apply(this,arguments);};
    }
    originalSaveState();
  }

  if(typeof renderDashboard!=="function")return;
  installNoteStyles();
  installFixedDataBootstrap();

  var originalRenderDashboard=renderDashboard;
  var lastTrigger=null;

  function localEsc(v){
    if(typeof esc==="function")return esc(v);
    v=String(v==null?"":v);
    return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function isEs(){return state&&state.language==="es";}
  function noteText(key){
    var es=isEs();
    var labels={
      editTitle:es?"Editar nota":"Edit note",
      addNote:es?"Agregar nota":"Add note",
      hasNote:es?"Nota":"Note",
      saveNote:es?"Guardar nota":"Save note",
      cancel:typeof tt==="function"?tt("cancel"):(es?"Cancelar":"Cancel"),
      month:typeof tt==="function"?tt("month"):(es?"Mes":"Month"),
      congregation:typeof tt==="function"?tt("congregation"):(es?"Congregacion":"Congregation"),
      placeholder:es?"Escriba la nota completa aqui...":"Write the full note here..."
    };
    return labels[key]||key;
  }
  function rowById(id){
    return state&&Array.isArray(state.schedule)?state.schedule.find(function(r){return r.id===id;}):null;
  }
  function notePreview(note){
    note=String(note||"").trim().replace(/\s+/g," ");
    if(!note)return "";
    return note.length>28?note.slice(0,28)+"…":note;
  }
  function decorateDashboardNotes(){
    var tbody=document.getElementById("dashboardRows");
    if(!tbody||!state||!Array.isArray(state.schedule))return;
    tbody.querySelectorAll("tr[data-id]").forEach(function(tr){
      var row=rowById(tr.dataset.id);
      if(!row)return;
      var cell=tr.children[4];
      if(!cell)return;
      var note=String(row.note||"");
      var has=!!note.trim();
      var label=has?("📝 "+noteText("hasNote")):("＋ "+noteText("addNote"));
      var aria=(has?noteText("editTitle")+": "+notePreview(note):noteText("addNote"))+" — "+(months()[+row.month]||"");
      cell.innerHTML='<button type="button" class="note-trigger '+(has?'note-has-content':'')+'" data-note-row-id="'+localEsc(row.id)+'" aria-label="'+localEsc(aria)+'" title="'+localEsc(has?note:noteText("addNote"))+'">'+localEsc(label)+'</button>';
    });
  }

  renderDashboard=function(){
    originalRenderDashboard.apply(this,arguments);
    decorateDashboardNotes();
  };

  function ensureModal(){
    var modal=document.getElementById("dashboardNoteModal");
    if(modal)return modal;
    modal=document.createElement("div");
    modal.id="dashboardNoteModal";
    modal.className="note-modal-bg no-print";
    modal.innerHTML=
      '<div class="note-modal" role="dialog" aria-modal="true" aria-labelledby="dashboardNoteTitle">'+
        '<h3 id="dashboardNoteTitle"></h3>'+
        '<div class="note-modal-meta" id="dashboardNoteMeta"></div>'+
        '<textarea id="dashboardNoteInput"></textarea>'+
        '<div class="note-modal-actions">'+
          '<button type="button" id="dashboardNoteCancel"></button>'+
          '<button type="button" class="primary" id="dashboardNoteSave"></button>'+
        '</div>'+ 
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener("click",function(e){if(e.target===modal)closeNoteModal(true);});
    document.getElementById("dashboardNoteCancel").addEventListener("click",function(){closeNoteModal(true);});
    document.getElementById("dashboardNoteSave").addEventListener("click",saveNoteModal);
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"&&modal.classList.contains("open")){closeNoteModal(true);}
    });
    return modal;
  }

  function openNoteModal(row,trigger){
    if(!row)return;
    lastTrigger=trigger||null;
    var modal=ensureModal();
    modal.dataset.rowId=row.id;
    document.getElementById("dashboardNoteTitle").textContent=noteText("editTitle");
    document.getElementById("dashboardNoteMeta").innerHTML=
      '<div><strong>'+localEsc(noteText("month"))+':</strong> '+localEsc((months()[+row.month]||""))+'</div>'+ 
      '<div><strong>'+localEsc(noteText("congregation"))+':</strong> '+localEsc(row.congregation||"—")+'</div>';
    var input=document.getElementById("dashboardNoteInput");
    input.placeholder=noteText("placeholder");
    input.value=row.note||"";
    document.getElementById("dashboardNoteCancel").textContent=noteText("cancel");
    document.getElementById("dashboardNoteSave").textContent=noteText("saveNote");
    modal.classList.add("open");
    setTimeout(function(){input.focus();input.selectionStart=input.selectionEnd=input.value.length;},40);
  }

  function closeNoteModal(refocus){
    var modal=document.getElementById("dashboardNoteModal");
    if(!modal)return;
    modal.classList.remove("open");
    if(refocus&&lastTrigger&&document.body.contains(lastTrigger))lastTrigger.focus();
  }

  function saveNoteModal(){
    var modal=document.getElementById("dashboardNoteModal");
    if(!modal)return;
    var row=rowById(modal.dataset.rowId);
    if(!row){closeNoteModal(false);return;}
    row.note=document.getElementById("dashboardNoteInput").value;
    if(typeof saveState==="function")saveState();
    closeNoteModal(false);
    renderDashboard();
    var selector='#dashboardRows tr[data-id="'+(window.CSS&&CSS.escape?CSS.escape(row.id):row.id)+'"] .note-trigger';
    var newTrigger=document.querySelector(selector);
    if(newTrigger)newTrigger.focus();
    if(typeof toast==="function")toast(typeof tt==="function"?tt("saved"):(isEs()?"Guardado.":"Saved."));
  }

  var rows=document.getElementById("dashboardRows");
  if(rows){
    rows.addEventListener("click",function(e){
      var btn=e.target.closest(".note-trigger");
      if(!btn)return;
      e.preventDefault();
      e.stopPropagation();
      openNoteModal(rowById(btn.dataset.noteRowId),btn);
    });
  }

  renderDashboard();
})();
