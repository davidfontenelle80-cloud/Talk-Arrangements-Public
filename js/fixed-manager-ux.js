/**
 * fixed-manager-ux.js — Stage 2.1 Fixed Arrangements Manager cleanup.
 * Keeps rule entry safer without changing rollover behavior.
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
  function toastMsg(msg){if(typeof toast==='function')toast(msg);}

  function ensureStyles(){
    if(document.getElementById('fixedManagerUxStyles'))return;
    var css=''+
      '.fixed-years-disabled{opacity:.45;pointer-events:none;}'+
      '.fixed-helper{font-size:12px;line-height:1.35;color:var(--muted);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px;background:var(--panel);}'+
      '.fixed-conflict-warn{border-color:var(--warn);background:color-mix(in srgb,var(--warn),var(--panel) 88%);}';
    var style=document.createElement('style');
    style.id='fixedManagerUxStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }

  function updateYearModeUI(){
    var editor=document.getElementById('fixedRuleEditor');
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
    var editor=document.getElementById('fixedRuleEditor');
    if(!editor||editor.hidden||editor.querySelector('.fixed-helper'))return;
    var helper=document.createElement('div');
    helper.className='fixed-helper';
    helper.textContent=txt('If the month changes between years, create separate rules. Example: 2027 = October, 2029 = November should be two rules.','Si el mes cambia entre años, cree reglas separadas. Ejemplo: 2027 = octubre, 2029 = noviembre deben ser dos reglas.');
    var note=document.getElementById('fixedRuleNote');
    if(note&&note.parentElement)editor.insertBefore(helper,note.parentElement);
    else editor.appendChild(helper);
  }

  function setupModeListeners(){
    var editor=document.getElementById('fixedRuleEditor');
    if(!editor||editor.dataset.uxReady==='1')return;
    editor.dataset.uxReady='1';
    editor.addEventListener('change',function(e){
      if(e.target&&e.target.name==='fixedRuleMode')updateYearModeUI();
    });
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
      if(rule.id===id)return;
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

  function showConflictWarning(conflicts,onProceed){
    var names=monthsList();
    var lines=conflicts.slice(0,5).map(function(c){
      return (names[c.month]||c.month)+': '+c.existing;
    }).join('\n');
    var msg=txt('Possible fixed-arrangement conflict. These months already belong to another active rule:\n\n','Posible conflicto de arreglo fijo. Estos meses ya pertenecen a otra regla activa:\n\n')+lines+'\n\n'+txt('Save anyway?','¿Guardar de todos modos?');
    if(typeof showConfirm==='function')showConfirm(msg,onProceed);
    else if(window.confirm(msg))onProceed();
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
      showConflictWarning(conflicts,function(){
        btn.dataset.allowConflictSave='1';
        btn.click();
      });
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
