/**
 * planning-conflicts.js — Stage 3.2 Planning Override Action.
 * Shows fixed arrangement conflicts directly in Planning and lets the user mark
 * a one-year override without changing the fixed rule or rollover behavior.
 */
(function(){
  'use strict';

  function isEs(){return typeof state!=='undefined'&&state&&state.language==='es';}
  function txt(en,es){return isEs()?es:en;}
  function monthNames(){return typeof months==='function'?months():['January','February','March','April','May','June','July','August','September','October','November','December'];}
  function escLocal(v){
    if(typeof esc==='function')return esc(v);
    v=String(v==null?'':v);
    return v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function rules(){return state&&Array.isArray(state.fixedArrangements)?state.fixedArrangements:[];}
  function applies(rule,year){
    if(rule.mode==='years')return Array.isArray(rule.years)&&rule.years.indexOf(+year)!==-1;
    return true;
  }
  function fixedFor(year,month){
    return rules().filter(function(rule){
      return rule&&rule.congregation&&Array.isArray(rule.months)&&rule.months.indexOf(+month)!==-1&&applies(rule,year);
    });
  }
  function isOverride(row,rule){
    var ovs=Array.isArray(row.fixedOverrides)?row.fixedOverrides:[];
    return ovs.some(function(o){return o&&o.ruleId===rule.id;});
  }
  function planningConflictsForYear(yearObj,includeOverrides){
    var found=[];
    if(!yearObj||!Array.isArray(yearObj.rows))return found;
    yearObj.rows.forEach(function(row){
      var planned=String(row.congregation||'').trim();
      if(!planned)return;
      fixedFor(yearObj.year,row.month).forEach(function(rule){
        if(rule.congregation!==planned){
          var overridden=isOverride(row,rule);
          if(!overridden||includeOverrides)found.push({row:row,month:+row.month,planned:planned,fixed:rule.congregation,rule:rule,overridden:overridden});
        }
      });
    });
    return found;
  }
  function ensureStyles(){
    if(document.getElementById('planningConflictStyles'))return;
    var css=''+
      '.planning-fixed-conflict-row{background:color-mix(in srgb,var(--danger),var(--panel) 84%)!important;box-shadow:inset 5px 0 0 var(--danger);}'+
      '.planning-fixed-override-row{background:color-mix(in srgb,var(--warn),var(--panel) 90%)!important;box-shadow:inset 5px 0 0 var(--warn);}'+
      '.planning-fixed-warning,.planning-fixed-override{margin-top:10px;border:1px solid var(--danger);border-radius:var(--radius-sm);padding:10px 12px;background:color-mix(in srgb,var(--danger),var(--panel) 88%);color:var(--text);font-size:14px;line-height:1.35;}'+
      '.planning-fixed-override{border-color:var(--warn);background:color-mix(in srgb,var(--warn),var(--panel) 90%);}'+
      '.planning-fixed-warning strong,.planning-fixed-override strong{display:block;color:var(--danger);letter-spacing:.04em;text-transform:uppercase;margin-bottom:4px;}'+
      '.planning-fixed-override strong{color:var(--warn);}'+
      '.planning-fixed-warning ul,.planning-fixed-override ul{margin:6px 0 0 18px;padding:0;}'+
      '.planning-fixed-warning li,.planning-fixed-override li{margin:6px 0;}'+
      '.planning-fixed-note{font-size:12px;color:var(--muted);margin-top:6px;}'+
      '.planning-fixed-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}'+
      '.planning-fixed-actions button{font-size:12px;padding:6px 8px;}';
    var style=document.createElement('style');
    style.id='planningConflictStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }
  function conflictLine(c){
    var ms=monthNames();
    return '<li data-row-id="'+escLocal(c.row.id)+'" data-rule-id="'+escLocal(c.rule.id)+'"><strong>'+escLocal(ms[c.month]||c.month)+'</strong>: '+escLocal(txt('Planned','Planificado'))+' — '+escLocal(c.planned)+'; '+escLocal(txt('Fixed','Fijo'))+' — '+escLocal(c.fixed)+'<div class="planning-fixed-actions"><button type="button" data-fixed-plan-action="use-fixed" data-row-id="'+escLocal(c.row.id)+'" data-rule-id="'+escLocal(c.rule.id)+'">'+escLocal(txt('Use fixed arrangement','Usar arreglo fijo'))+'</button><button type="button" data-fixed-plan-action="override" data-row-id="'+escLocal(c.row.id)+'" data-rule-id="'+escLocal(c.rule.id)+'">'+escLocal(txt('Override for this year','Anular solo este año'))+'</button></div></li>';
  }
  function bannerHtml(conflicts){
    var max=conflicts.slice(0,5).map(conflictLine).join('');
    var extra=conflicts.length>5?'<div class="planning-fixed-note">+'+(conflicts.length-5)+' '+escLocal(txt('more conflict(s)','conflicto(s) más'))+'</div>':'';
    return '<div class="planning-fixed-warning" role="alert"><strong>⚠ '+escLocal(txt('Fixed arrangement conflict','Conflicto de arreglo fijo'))+'</strong><div>'+escLocal(txt('Review before rollover. This does not change your fixed rule.','Revise antes del cambio de año. Esto no cambia la regla fija.'))+'</div><ul>'+max+'</ul>'+extra+'<div class="planning-fixed-note">'+escLocal(txt('If this is permanent, update the Fixed Arrangement rule.','Si esto es permanente, actualice la regla de Arreglos Fijos.'))+'</div></div>';
  }
  function overrideHtml(conflicts){
    var ms=monthNames();
    var items=conflicts.map(function(c){
      return '<li><strong>'+escLocal(ms[c.month]||c.month)+'</strong>: '+escLocal(c.planned)+' '+escLocal(txt('kept for this year only.','se mantiene solo para este año.'))+'</li>';
    }).join('');
    return '<div class="planning-fixed-override"><strong>✓ '+escLocal(txt('Override noted','Anulación registrada'))+'</strong><div>'+escLocal(txt('Fixed rule is unchanged. Update the fixed rule only if this is permanent.','La regla fija no cambió. Actualice la regla fija solo si esto es permanente.'))+'</div><ul>'+items+'</ul></div>';
  }
  function decoratePlanningConflicts(){
    if(typeof state==='undefined'||!state||!Array.isArray(state.planning))return;
    ensureStyles();
    document.querySelectorAll('#planningTables .planning-fixed-warning,#planningTables .planning-fixed-override').forEach(function(el){el.remove();});
    document.querySelectorAll('#planningTables .planning-fixed-conflict-row,#planningTables .planning-fixed-override-row').forEach(function(el){el.classList.remove('planning-fixed-conflict-row','planning-fixed-override-row');});
    state.planning.forEach(function(yearObj){
      var panel=document.querySelector('#planningTables [data-year="'+yearObj.year+'"]');
      if(!panel)return;
      var all=planningConflictsForYear(yearObj,true);
      var active=all.filter(function(c){return !c.overridden;});
      var overrides=all.filter(function(c){return c.overridden;});
      all.forEach(function(c){
        var tr=panel.querySelector('tr[data-id="'+c.row.id+'"]');
        if(tr)tr.classList.add(c.overridden?'planning-fixed-override-row':'planning-fixed-conflict-row');
      });
      var title=panel.querySelector('.planning-title')||panel.querySelector('.panel-title');
      if(title){
        if(active.length)title.insertAdjacentHTML('beforeend',bannerHtml(active));
        if(overrides.length)title.insertAdjacentHTML('beforeend',overrideHtml(overrides));
      }
    });
  }
  function findPlanningRowById(rowId){
    if(!state||!Array.isArray(state.planning))return null;
    for(var i=0;i<state.planning.length;i++){
      var y=state.planning[i];
      var r=(y.rows||[]).find(function(row){return row.id===rowId;});
      if(r)return {year:y,row:r};
    }
    return null;
  }
  function findRuleById(id){return rules().find(function(r){return r.id===id;})||null;}
  function confirmMsg(c,action){
    if(action==='use-fixed')return txt('Replace this planning row with the fixed arrangement?','¿Reemplazar esta fila con el arreglo fijo?')+'\n\n'+txt('Fixed','Fijo')+': '+c.rule.congregation+'\n'+txt('Current','Actual')+': '+c.row.congregation;
    return txt('Override the fixed arrangement for this year only?','¿Anular el arreglo fijo solo para este año?')+'\n\n'+txt('Fixed','Fijo')+': '+c.rule.congregation+'\n'+txt('Keep','Mantener')+': '+c.row.congregation+'\n\n'+txt('The fixed rule will not be changed.','La regla fija no se cambiará.');
  }
  function runAction(rowId,ruleId,action){
    var found=findPlanningRowById(rowId),rule=findRuleById(ruleId);
    if(!found||!rule)return;
    var row=found.row;
    var c={year:found.year,row:row,rule:rule};
    var proceed=function(){
      if(action==='use-fixed'){
        row.congregation=rule.congregation;
        row.contact=typeof lookupCoord==='function'?lookupCoord(rule.congregation):'';
        row.fixedOverrides=(row.fixedOverrides||[]).filter(function(o){return o.ruleId!==rule.id;});
        if(typeof toast==='function')toast(txt('Fixed arrangement restored.','Arreglo fijo restaurado.'));
      }else{
        if(!Array.isArray(row.fixedOverrides))row.fixedOverrides=[];
        if(!isOverride(row,rule))row.fixedOverrides.push({ruleId:rule.id,congregation:rule.congregation,overriddenAt:new Date().toISOString(),scope:'year'});
        if(typeof toast==='function')toast(txt('Override noted for this year.','Anulación registrada para este año.'));
      }
      if(typeof saveState==='function')saveState();
      if(typeof renderPlanning==='function')renderPlanning();else decoratePlanningConflicts();
    };
    if(typeof showConfirm==='function')showConfirm(confirmMsg(c,action),proceed);
    else if(window.confirm(confirmMsg(c,action)))proceed();
  }
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('[data-fixed-plan-action]'):null;
    if(!btn)return;
    e.preventDefault();
    runAction(btn.dataset.rowId,btn.dataset.ruleId,btn.dataset.fixedPlanAction);
  });
  function install(){
    ensureStyles();
    if(typeof renderPlanning==='function'&&!window.__planningConflictWrap){
      window.__planningConflictWrap=true;
      var original=renderPlanning;
      renderPlanning=function(){
        var out=original.apply(this,arguments);
        setTimeout(decoratePlanningConflicts,0);
        return out;
      };
    }
    decoratePlanningConflicts();
  }
  var tries=0;
  (function wait(){
    tries++;
    install();
    if(tries<240)setTimeout(wait,500);
  })();
})();
