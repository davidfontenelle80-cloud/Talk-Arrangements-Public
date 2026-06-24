/**
 * fixed-manager-ux.js — Stage 4C fix.
 * Keeps fixed-rule entry safer and shows duplicate fixed-month warnings inside the editor.
 */
(function(){
  'use strict';

  function isEs(){return typeof state!=='undefined'&&state&&state.language==='es';}
  function txt(en,es){return isEs()?es:en;}
  function monthsList(){return typeof months==='function'?months():['January','February','March','April','May','June','July','August','September','October','November','December'];}
  function currentRuleId(){var editor=document.getElementById('fixedRuleEditor');return editor?editor.dataset.ruleId||'':'';}
  function selectedMode(){return (document.querySelector('#fixedRuleEditor input[name="fixedRuleMode"]:checked')||{}).value||'continuous';}
  function selectedMonths(){return Array.from(document.querySelectorAll('#fixedRuleEditor [data-fixed-month]:checked')).map(function(i){return +i.dataset.fixedMonth;});}
  function selectedYears(){return Array.from(document.querySelectorAll('#fixedRuleEditor [data-fixed-year]:checked')).map(function(i){return +i.dataset.fixedYear;});}
  function selectedCongregation(){var el=document.getElementById('fixedRuleCong');return el?el.value:'';}
  function rules(){return state&&Array.isArray(state.fixedArrangements)?state.fixedArrangements:[];}

  function ensureStyles(){
    if(document.getElementById('fixedManagerUxStyles'))return;
    var css=''+
      '.confirm-bg{z-index:10000!important;}'+
      '.confirm-msg{white-space:pre-line;}'+
      '.fixed-years-disabled{opacity:.45;pointer-events:none;}'+
      '.fixed-helper{font-size:12px;line-height:1.35;color:var(--muted);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px;background:var(--panel);}'+
      '.fixed-conflict-panel{border:1px solid var(--warn);background:color-mix(in srgb,var(--warn),var(--panel) 88%);border-radius:var(--radius-sm);padding:10px;margin:10px 0;display:grid;gap:8px;color:var(--text);}'+
      '.fixed-conflict-panel strong{font-weight:800;}'+
      '.fixed-conflict-panel ul{margin:0 0 0 18px;padding:0;}'+
      '.fixed-conflict-panel li{margin:3px 0;}'+
      '.fixed-conflict-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;}'+
      '.fixed-conflict-actions button{padding:8px 10px;}'+
      '@media(max-width:620px){.fixed-conflict-actions button{width:100%;}}';
    var style=document.createElement('style');
    style.id='fixedManagerUxStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }

  function editorEl(){return document.getElementById('fixedRuleEditor');}
  function clearConflictPanel(){
    var old=document.getElementById('fixedInlineConflictPanel');
    if(old)old.remove();
  }

  function updateYearModeUI(){
    var editor=editorEl();
    if(!editor||editor.hidden)return;
    var mode=selectedMode();
    var yearsHost=document.getElementById('fixedYearChoices');
    var addYear=document.querySelector('#fixedCustomYear')&&document.querySelector('#fixedCustomYear').closest('.fixed-year-add');
    if(!yearsHost)return;
    var disabled=mode!=='years';
    yearsHost.classList.toggle('fixed-years-disabled',disabled);
    yearsHost.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
      cb.disabled=disabled;
      if(disabled)cb.checked=false;
    });
    if(addYear){
      addYear.classList.toggle('fixed-years-disabled',disabled);
      addYear.querySelectorAll('input,button').forEach(function(el){el.disabled=disabled;});
    }
  }

  function addHelperText(){
    var editor=editorEl();
    if(!editor||editor.hidden||editor.querySelector('.fixed-helper'))return;
    var helper=document.createElement('div');
    helper.className='fixed-helper';
    helper.textContent=txt('If the month changes between years, create separate rules. Example: 2027 = October, 2029 = November should be two rules.','Si el mes cambia entre años, cree reglas separadas. Ejemplo: 2027 = octubre, 2029 = noviembre deben ser dos reglas.');
    var note=document.getElementById('fixedRuleNote');
    if(note&&note.parentElement)editor.insertBefore(helper,note.parentElement);
    else editor.appendChild(helper);
  }

  function setupModeListeners(){
    var editor=editorEl();
    if(!editor||editor.dataset.uxReady==='1')return;
    editor.dataset.uxReady='1';
    editor.addEventListener('change',function(e){
      clearConflictPanel();
      if(e.target&&e.target.name==='fixedRuleMode')updateYearModeUI();
    });
    editor.addEventListener('input',clearConflictPanel);
    updateYearModeUI();
    addHelperText();
  }

  function conflictCandidates(){
    var id=currentRuleId();
    var cong=selectedCongregation();
    var mode=selectedMode();
    var months=selectedMonths();
    var years=mode==='years'?selectedYears():[];
    var conflicts=[];
    rules().forEach(function(rule){
      if(rule.id&&id&&rule.id===id)return;
      (rule.months||[]).forEach(function(m){
        if(months.indexOf(+m)===-1)return;
        var overlaps=false;
        if(mode==='continuous'||rule.mode==='continuous')overlaps=true;
        else overlaps=(rule.years||[]).some(function(y){return years.indexOf(+y)!==-1;});
        if(overlaps){
          conflicts.push({month:+m,existing:rule.congregation||txt('Unknown','Desconocido'),incoming:cong});
        }
      });
    });
    return conflicts;
  }

  function showInlineConflictWarning(conflicts,btn){
    var editor=editorEl();
    if(!editor)return;
    clearConflictPanel();
    var names=monthsList();
    var panel=document.createElement('div');
    panel.id='fixedInlineConflictPanel';
    panel.className='fixed-conflict-panel';
    var items=conflicts.slice(0,8).map(function(c){
      return '<li><strong>'+names[c.month]+':</strong> '+c.existing+'</li>';
    }).join('');
    panel.innerHTML=''+
      '<strong>'+txt('Possible fixed-arrangement conflict','Posible conflicto de arreglo fijo')+'</strong>'+
      '<div>'+txt('These months already belong to another active fixed rule.','Estos meses ya pertenecen a otra regla fija activa.')+'</div>'+
      '<ul>'+items+'</ul>'+
      '<div>'+txt('You can cancel and adjust the month/year, or save anyway if this is intentional.','Puede cancelar y ajustar el mes/año, o guardar de todos modos si esto es intencional.')+'</div>'+
      '<div class="fixed-conflict-actions">'+
        '<button type="button" id="fixedConflictCancel">'+txt('Cancel','Cancelar')+'</button>'+
        '<button type="button" id="fixedConflictProceed">'+txt('Save anyway','Guardar de todos modos')+'</button>'+
      '</div>';
    var saveRow=btn.closest('.row')||btn.parentElement;
    if(saveRow&&saveRow.parentElement)saveRow.parentElement.insertBefore(panel,saveRow);
    else editor.appendChild(panel);
    panel.querySelector('#fixedConflictCancel').addEventListener('click',function(){clearConflictPanel();});
    panel.querySelector('#fixedConflictProceed').addEventListener('click',function(){
      clearConflictPanel();
      btn.dataset.allowConflictSave='1';
      btn.click();
    });
    try{panel.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){panel.scrollIntoView();}
  }

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('#fixedSaveRule'):null;
    if(!btn)return;
    if(btn.dataset.allowConflictSave==='1'){
      btn.dataset.allowConflictSave='0';
      return;
    }
    if(selectedMode()==='continuous'){
      document.querySelectorAll('#fixedRuleEditor [data-fixed-year]').forEach(function(cb){cb.checked=false;});
    }
    var conflicts=conflictCandidates();
    if(conflicts.length){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showInlineConflictWarning(conflicts,btn);
    }
  },true);

  var tries=0;
  (function monitor(){
    tries++;
    ensureStyles();
    setupModeListeners();
    if(tries<240)setTimeout(monitor,500);
  })();
})();
