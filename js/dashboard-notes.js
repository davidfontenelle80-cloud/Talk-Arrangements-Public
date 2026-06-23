/**
 * dashboard-notes.js — compact dashboard notes with full editor modal.
 * Loaded after app.js and patches renderDashboard without changing app data shape.
 */
(function(){
  if(typeof renderDashboard!=="function")return;

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
    var newTrigger=document.querySelector('#dashboardRows tr[data-id="'+CSS.escape(row.id)+'"] .note-trigger');
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
