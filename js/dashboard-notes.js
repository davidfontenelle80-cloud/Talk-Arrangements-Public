/**
 * dashboard-notes.js — Talk app enhancements.
 * - Stage 0.5: compact dashboard notes with full editor modal.
 * - Stage 1: fixedArrangements[] data model bootstrap without UI or rollover changes.
 * - Stage 2: Fixed Arrangements manager UI without rollover changes.
 */
(function(){
  'use strict';

  function installEnhancementStyles(){
    if(document.getElementById('talkEnhancementStyles'))return;
    var css=''+
      '.note-trigger{width:100%;min-height:36px;justify-content:flex-start;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:13px;color:var(--muted);background:var(--panel);}'+
      '.note-trigger.note-has-content{color:var(--warn);border-color:color-mix(in srgb,var(--warn),var(--line) 18%);background:color-mix(in srgb,var(--warn),var(--panel) 86%);font-weight:700;}'+
      '.note-trigger:hover,.note-trigger:focus-visible{border-color:var(--warn);box-shadow:0 0 0 2px color-mix(in srgb,var(--warn),transparent 76%);}'+
      '.note-modal-bg,.fixed-manager-bg{display:none;position:fixed;inset:0;z-index:360;align-items:center;justify-content:center;padding:16px;background:var(--color-overlay);}'+
      '.note-modal-bg.open,.fixed-manager-bg.open{display:flex;}'+
      '.note-modal,.fixed-manager{width:min(760px,100%);max-height:min(88vh,760px);display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-md,var(--shadow));padding:18px;}'+
      '.note-modal{width:min(680px,100%);}'+
      '.note-modal h3,.fixed-manager h3{margin:0;font-size:20px;}'+
      '.note-modal-meta,.fixed-rule-meta{display:grid;gap:3px;color:var(--muted);font-size:13px;line-height:1.35;}'+
      '.note-modal textarea,.fixed-manager textarea{width:100%;min-height:160px;max-height:42vh;resize:vertical;padding:12px;line-height:1.45;font-size:16px;background:var(--panel-2);}'+
      '.note-modal-actions,.fixed-manager-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}'+
      '.fixed-manager-body{overflow:auto;display:grid;gap:12px;padding-right:2px;}'+
      '.fixed-rule-card{border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px;background:var(--panel-2);display:grid;gap:8px;}'+
      '.fixed-rule-card strong{font-size:15px;}'+
      '.fixed-rule-top{display:flex;justify-content:space-between;gap:10px;align-items:start;}'+
      '.fixed-rule-actions{display:flex;gap:6px;flex-wrap:wrap;}'+
      '.fixed-editor{border:1px solid color-mix(in srgb,var(--accent),var(--line) 55%);border-radius:var(--radius-sm);padding:12px;background:color-mix(in srgb,var(--accent),var(--panel) 94%);display:grid;gap:12px;}'+
      '.fixed-editor label{display:grid;gap:5px;color:var(--muted);font-size:13px;}'+
      '.fixed-editor select,.fixed-editor input[type="number"]{width:100%;padding:8px 10px;}'+
      '.fixed-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(115px,1fr));gap:6px;}'+
      '.fixed-choice{display:flex!important;grid-template-columns:none!important;align-items:center;gap:6px;padding:7px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--panel);color:var(--text);font-size:13px;}'+
      '.fixed-choice input{width:auto;}'+
      '.fixed-year-add{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}'+
      '.fixed-empty{padding:14px;border:1px dashed var(--line);border-radius:var(--radius-sm);color:var(--muted);text-align:center;}'+
      '@media(max-width:620px){.note-modal,.fixed-manager{max-height:90vh;padding:14px}.note-modal textarea{min-height:260px}.fixed-manager-actions{justify-content:stretch}.fixed-manager-actions button{flex:1 1 auto}}';
    var style=document.createElement('style');
    style.id='talkEnhancementStyles';
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

  function escLocal(v){
    if(typeof esc==='function')return esc(v);
    v=String(v==null?'':v);
    return v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function isEs(){return typeof state!=='undefined'&&state&&state.language==='es';}
  function txt(en,es){return isEs()?es:en;}
  function monthNames(){return typeof months==='function'?months():['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];}
  function ruleMonthsText(rule){
    var ms=monthNames();
    return (rule.months||[]).map(function(m){return ms[+m]||m;}).join(', ')||txt('No months selected','Sin meses seleccionados');
  }
  function ruleModeText(rule){
    if(rule.mode==='years')return txt('Selected years: ','Años seleccionados: ')+(rule.years||[]).join(', ');
    return txt('Continuous / until changed','Continuo / hasta que se cambie');
  }

  function installFixedDataBootstrap(){
    if(window.__talkFixedDataInstalled||typeof saveState!=='function')return;
    window.__talkFixedDataInstalled=true;
    ensureFixedArrangements();
    var originalSaveState=saveState;
    saveState=function(){ensureFixedArrangements();return originalSaveState.apply(this,arguments);};
    if(typeof renderAll==='function'){
      var originalRenderAll=renderAll;
      renderAll=function(){ensureFixedArrangements();var out=originalRenderAll.apply(this,arguments);installFixedManagerEntry();return out;};
    }
    originalSaveState();
  }

  function installFixedManagerEntry(){
    var host=document.querySelector('#congregations .list-tools');
    if(!host||document.getElementById('fixedRulesBtn'))return;
    var btn=document.createElement('button');
    btn.id='fixedRulesBtn';
    btn.type='button';
    btn.innerHTML='&#128197; <span></span>';
    btn.querySelector('span').textContent=txt('Fixed Arrangements','Arreglos Fijos');
    btn.addEventListener('click',openFixedManager);
    var add=document.getElementById('addCongregation');
    if(add)host.insertBefore(btn,add);else host.appendChild(btn);
  }

  function ensureFixedManagerModal(){
    var modal=document.getElementById('fixedManagerModal');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='fixedManagerModal';
    modal.className='fixed-manager-bg no-print';
    modal.innerHTML=
      '<div class="fixed-manager" role="dialog" aria-modal="true" aria-labelledby="fixedManagerTitle">'+
        '<div class="fixed-rule-top"><div><h3 id="fixedManagerTitle"></h3><p class="muted" id="fixedManagerHint"></p></div><button type="button" class="icon-btn" id="fixedManagerClose">&#215;</button></div>'+ 
        '<div class="fixed-manager-body">'+
          '<div id="fixedRuleList"></div>'+ 
          '<button type="button" class="primary" id="fixedAddRuleBtn"></button>'+ 
          '<div id="fixedRuleEditor" class="fixed-editor" hidden></div>'+ 
        '</div>'+ 
        '<div class="fixed-manager-actions"><button type="button" id="fixedManagerDone"></button></div>'+ 
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeFixedManager();});
    document.getElementById('fixedManagerClose').addEventListener('click',closeFixedManager);
    document.getElementById('fixedManagerDone').addEventListener('click',closeFixedManager);
    document.getElementById('fixedAddRuleBtn').addEventListener('click',function(){openFixedEditor(null);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))closeFixedManager();});
    return modal;
  }

  function openFixedManager(){
    ensureFixedArrangements();
    var modal=ensureFixedManagerModal();
    renderFixedManager();
    modal.classList.add('open');
  }
  function closeFixedManager(){
    var modal=document.getElementById('fixedManagerModal');
    if(modal)modal.classList.remove('open');
  }

  function renderFixedManager(){
    ensureFixedArrangements();
    document.getElementById('fixedManagerTitle').textContent=txt('Fixed Arrangements','Arreglos Fijos');
    document.getElementById('fixedManagerHint').textContent=txt('Create rules now. Rollover will use them in a later stage.','Cree reglas ahora. El cambio de año las usará en una etapa posterior.');
    document.getElementById('fixedAddRuleBtn').textContent=txt('+ Add rule','+ Añadir regla');
    document.getElementById('fixedManagerDone').textContent=typeof tt==='function'?tt('cancel'):txt('Close','Cerrar');
    var list=document.getElementById('fixedRuleList');
    var rules=(state.fixedArrangements||[]);
    if(!rules.length){
      list.innerHTML='<div class="fixed-empty">'+escLocal(txt('No fixed arrangement rules yet.','Todavía no hay reglas de arreglos fijos.'))+'</div>';
    }else{
      list.innerHTML=rules.map(function(rule){
        return '<div class="fixed-rule-card" data-rule-id="'+escLocal(rule.id)+'">'+
          '<div class="fixed-rule-top"><div><strong>'+escLocal(rule.congregation||txt('No congregation','Sin congregación'))+'</strong><div class="fixed-rule-meta"><span>'+escLocal(ruleMonthsText(rule))+'</span><span>'+escLocal(ruleModeText(rule))+'</span>'+(rule.note?'<span>'+escLocal(rule.note)+'</span>':'')+'</div></div>'+ 
          '<div class="fixed-rule-actions"><button type="button" data-fixed-action="edit">'+escLocal(txt('Edit','Editar'))+'</button><button type="button" class="danger" data-fixed-action="delete">'+escLocal(txt('Delete','Eliminar'))+'</button></div></div>'+ 
        '</div>';
      }).join('');
      list.querySelectorAll('[data-fixed-action="edit"]').forEach(function(btn){btn.addEventListener('click',function(){openFixedEditor(this.closest('[data-rule-id]').dataset.ruleId);});});
      list.querySelectorAll('[data-fixed-action="delete"]').forEach(function(btn){btn.addEventListener('click',function(){deleteFixedRule(this.closest('[data-rule-id]').dataset.ruleId);});});
    }
    document.getElementById('fixedRuleEditor').hidden=true;
  }

  function yearOptions(rule){
    var base=+((typeof state!=='undefined'&&state.currentYear)||new Date().getFullYear());
    var ys=[];
    for(var y=base;y<=base+6;y++)ys.push(y);
    (rule.years||[]).forEach(function(y){if(ys.indexOf(+y)===-1)ys.push(+y);});
    ys.sort(function(a,b){return a-b;});
    return ys;
  }

  function openFixedEditor(id){
    ensureFixedArrangements();
    var rule=id?(state.fixedArrangements||[]).find(function(r){return r.id===id;}):null;
    rule=rule?normalizeFixedRule(rule):{id:'',congregation:'',months:[],mode:'continuous',years:[],note:''};
    var editor=document.getElementById('fixedRuleEditor');
    var mNames=monthNames();
    var monthHtml=mNames.map(function(m,i){return '<label class="fixed-choice"><input type="checkbox" data-fixed-month="'+i+'" '+((rule.months||[]).indexOf(i)!==-1?'checked':'')+'> '+escLocal(m)+'</label>';}).join('');
    var yearsHtml=yearOptions(rule).map(function(y){return '<label class="fixed-choice"><input type="checkbox" data-fixed-year="'+y+'" '+((rule.years||[]).indexOf(y)!==-1?'checked':'')+'> '+y+'</label>';}).join('');
    editor.dataset.ruleId=rule.id||'';
    editor.hidden=false;
    editor.innerHTML=
      '<strong>'+escLocal(rule.id?txt('Edit fixed rule','Editar regla fija'):txt('New fixed rule','Nueva regla fija'))+'</strong>'+ 
      '<label><span>'+escLocal(txt('Congregation','Congregación'))+'</span><select id="fixedRuleCong">'+(typeof congOpts==='function'?congOpts(rule.congregation):'<option></option>')+'</select></label>'+ 
      '<label><span>'+escLocal(txt('Month or months','Mes o meses'))+'</span><div class="fixed-choice-grid">'+monthHtml+'</div></label>'+ 
      '<label><span>'+escLocal(txt('Type','Tipo'))+'</span><div class="fixed-choice-grid"><label class="fixed-choice"><input type="radio" name="fixedRuleMode" value="continuous" '+(rule.mode!=='years'?'checked':'')+'> '+escLocal(txt('Continuous','Continuo'))+'</label><label class="fixed-choice"><input type="radio" name="fixedRuleMode" value="years" '+(rule.mode==='years'?'checked':'')+'> '+escLocal(txt('Selected years','Años seleccionados'))+'</label></div></label>'+ 
      '<label><span>'+escLocal(txt('Years','Años'))+'</span><div class="fixed-choice-grid" id="fixedYearChoices">'+yearsHtml+'</div></label>'+ 
      '<div class="fixed-year-add"><input type="number" id="fixedCustomYear" min="2000" max="2100" placeholder="'+escLocal(txt('Add year','Añadir año'))+'"><button type="button" id="fixedAddYearBtn">'+escLocal(txt('Add year','Añadir año'))+'</button></div>'+ 
      '<label><span>'+escLocal(txt('Note','Nota'))+'</span><textarea id="fixedRuleNote">'+escLocal(rule.note||'')+'</textarea></label>'+ 
      '<div class="fixed-manager-actions"><button type="button" id="fixedCancelEdit">'+escLocal(typeof tt==='function'?tt('cancel'):txt('Cancel','Cancelar'))+'</button><button type="button" class="primary" id="fixedSaveRule">'+escLocal(txt('Save rule','Guardar regla'))+'</button></div>';
    document.getElementById('fixedCancelEdit').addEventListener('click',function(){editor.hidden=true;});
    document.getElementById('fixedSaveRule').addEventListener('click',saveFixedRuleFromEditor);
    document.getElementById('fixedAddYearBtn').addEventListener('click',function(){
      var y=+document.getElementById('fixedCustomYear').value;
      if(isNaN(y)||y<2000||y>2100)return;
      var host=document.getElementById('fixedYearChoices');
      if(host.querySelector('[data-fixed-year="'+y+'"]'))return;
      var labelEl=document.createElement('label');
      labelEl.className='fixed-choice';
      labelEl.innerHTML='<input type="checkbox" data-fixed-year="'+y+'" checked> '+y;
      host.appendChild(labelEl);
      document.getElementById('fixedCustomYear').value='';
    });
    var select=document.getElementById('fixedRuleCong');
    if(select)select.value=rule.congregation||'';
    setTimeout(function(){if(select)select.focus();},40);
  }

  function saveFixedRuleFromEditor(){
    var editor=document.getElementById('fixedRuleEditor');
    var id=editor.dataset.ruleId||uuid();
    var congregation=document.getElementById('fixedRuleCong').value;
    var monthsSelected=Array.from(editor.querySelectorAll('[data-fixed-month]:checked')).map(function(i){return +i.dataset.fixedMonth;});
    var mode=(editor.querySelector('input[name="fixedRuleMode"]:checked')||{}).value||'continuous';
    var yearsSelected=Array.from(editor.querySelectorAll('[data-fixed-year]:checked')).map(function(i){return +i.dataset.fixedYear;});
    var note=document.getElementById('fixedRuleNote').value;
    if(!congregation.trim()){if(typeof toast==='function')toast(txt('Choose a congregation','Seleccione una congregación'));return;}
    if(!monthsSelected.length){if(typeof toast==='function')toast(txt('Choose at least one month','Seleccione al menos un mes'));return;}
    if(mode==='years'&&!yearsSelected.length){if(typeof toast==='function')toast(txt('Choose at least one year','Seleccione al menos un año'));return;}
    var rule=normalizeFixedRule({id:id,congregation:congregation,months:monthsSelected,mode:mode,years:yearsSelected,note:note});
    var idx=(state.fixedArrangements||[]).findIndex(function(r){return r.id===id;});
    if(idx>=0)state.fixedArrangements[idx]=rule;else state.fixedArrangements.push(rule);
    saveState();
    renderFixedManager();
    if(typeof toast==='function')toast(typeof tt==='function'?tt('saved'):txt('Saved.','Guardado.'));
  }

  function deleteFixedRule(id){
    var action=function(){
      state.fixedArrangements=(state.fixedArrangements||[]).filter(function(r){return r.id!==id;});
      saveState();
      renderFixedManager();
    };
    if(typeof showConfirm==='function')showConfirm(typeof tt==='function'?tt('deleteConfirm'):txt('Delete this?','¿Eliminar?'),action);
    else action();
  }

  if(typeof renderDashboard!=="function")return;
  installEnhancementStyles();
  installFixedDataBootstrap();
  installFixedManagerEntry();

  var originalRenderDashboard=renderDashboard;
  var lastTrigger=null;

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
  function rowById(id){return state&&Array.isArray(state.schedule)?state.schedule.find(function(r){return r.id===id;}):null;}
  function notePreview(note){note=String(note||"").trim().replace(/\s+/g," ");return note.length>28?note.slice(0,28)+"…":note;}
  function decorateDashboardNotes(){
    var tbody=document.getElementById("dashboardRows");
    if(!tbody||!state||!Array.isArray(state.schedule))return;
    tbody.querySelectorAll("tr[data-id]").forEach(function(tr){
      var row=rowById(tr.dataset.id);if(!row)return;
      var cell=tr.children[4];if(!cell)return;
      var note=String(row.note||"");
      var has=!!note.trim();
      var label=has?("📝 "+noteText("hasNote")):("＋ "+noteText("addNote"));
      var aria=(has?noteText("editTitle")+": "+notePreview(note):noteText("addNote"))+" — "+(months()[+row.month]||"");
      cell.innerHTML='<button type="button" class="note-trigger '+(has?'note-has-content':'')+'" data-note-row-id="'+escLocal(row.id)+'" aria-label="'+escLocal(aria)+'" title="'+escLocal(has?note:noteText("addNote"))+'">'+escLocal(label)+'</button>';
    });
  }

  renderDashboard=function(){originalRenderDashboard.apply(this,arguments);decorateDashboardNotes();};

  function ensureModal(){
    var modal=document.getElementById("dashboardNoteModal");
    if(modal)return modal;
    modal=document.createElement("div");
    modal.id="dashboardNoteModal";
    modal.className="note-modal-bg no-print";
    modal.innerHTML='<div class="note-modal" role="dialog" aria-modal="true" aria-labelledby="dashboardNoteTitle"><h3 id="dashboardNoteTitle"></h3><div class="note-modal-meta" id="dashboardNoteMeta"></div><textarea id="dashboardNoteInput"></textarea><div class="note-modal-actions"><button type="button" id="dashboardNoteCancel"></button><button type="button" class="primary" id="dashboardNoteSave"></button></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click",function(e){if(e.target===modal)closeNoteModal(true);});
    document.getElementById("dashboardNoteCancel").addEventListener("click",function(){closeNoteModal(true);});
    document.getElementById("dashboardNoteSave").addEventListener("click",saveNoteModal);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&modal.classList.contains("open")){closeNoteModal(true);}});
    return modal;
  }

  function openNoteModal(row,trigger){
    if(!row)return;
    lastTrigger=trigger||null;
    var modal=ensureModal();
    modal.dataset.rowId=row.id;
    document.getElementById("dashboardNoteTitle").textContent=noteText("editTitle");
    document.getElementById("dashboardNoteMeta").innerHTML='<div><strong>'+escLocal(noteText("month"))+':</strong> '+escLocal((months()[+row.month]||""))+'</div><div><strong>'+escLocal(noteText("congregation"))+':</strong> '+escLocal(row.congregation||"—")+'</div>';
    var input=document.getElementById("dashboardNoteInput");
    input.placeholder=noteText("placeholder");
    input.value=row.note||"";
    document.getElementById("dashboardNoteCancel").textContent=noteText("cancel");
    document.getElementById("dashboardNoteSave").textContent=noteText("saveNote");
    modal.classList.add("open");
    setTimeout(function(){input.focus();input.selectionStart=input.selectionEnd=input.value.length;},40);
  }

  function closeNoteModal(refocus){var modal=document.getElementById("dashboardNoteModal");if(!modal)return;modal.classList.remove("open");if(refocus&&lastTrigger&&document.body.contains(lastTrigger))lastTrigger.focus();}
  function saveNoteModal(){
    var modal=document.getElementById("dashboardNoteModal");if(!modal)return;
    var row=rowById(modal.dataset.rowId);if(!row){closeNoteModal(false);return;}
    row.note=document.getElementById("dashboardNoteInput").value;
    if(typeof saveState==="function")saveState();
    closeNoteModal(false);renderDashboard();
    var selector='#dashboardRows tr[data-id="'+(window.CSS&&CSS.escape?CSS.escape(row.id):row.id)+'"] .note-trigger';
    var newTrigger=document.querySelector(selector);if(newTrigger)newTrigger.focus();
    if(typeof toast==="function")toast(typeof tt==="function"?tt("saved"):(isEs()?"Guardado.":"Saved."));
  }

  var rows=document.getElementById("dashboardRows");
  if(rows){rows.addEventListener("click",function(e){var btn=e.target.closest(".note-trigger");if(!btn)return;e.preventDefault();e.stopPropagation();openNoteModal(rowById(btn.dataset.noteRowId),btn);});}

  renderDashboard();
})();
