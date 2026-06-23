/**
 * planning-conflicts.js — Stage 3.1 Planning Conflict Awareness.
 * Shows fixed arrangement conflicts directly in Planning without changing rollover behavior.
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
  function planningConflictsForYear(yearObj){
    var found=[];
    if(!yearObj||!Array.isArray(yearObj.rows))return found;
    yearObj.rows.forEach(function(row){
      var planned=String(row.congregation||'').trim();
      if(!planned)return;
      fixedFor(yearObj.year,row.month).forEach(function(rule){
        if(rule.congregation!==planned){
          found.push({row:row,month:+row.month,planned:planned,fixed:rule.congregation,rule:rule});
        }
      });
    });
    return found;
  }
  function ensureStyles(){
    if(document.getElementById('planningConflictStyles'))return;
    var css=''+
      '.planning-fixed-conflict-row{background:color-mix(in srgb,var(--danger),var(--panel) 84%)!important;box-shadow:inset 5px 0 0 var(--danger);}'+
      '.planning-fixed-warning{margin-top:10px;border:1px solid var(--danger);border-radius:var(--radius-sm);padding:10px 12px;background:color-mix(in srgb,var(--danger),var(--panel) 88%);color:var(--text);font-size:14px;line-height:1.35;}'+
      '.planning-fixed-warning strong{display:block;color:var(--danger);letter-spacing:.04em;text-transform:uppercase;margin-bottom:4px;}'+
      '.planning-fixed-warning ul{margin:6px 0 0 18px;padding:0;}'+
      '.planning-fixed-warning li{margin:4px 0;}'+
      '.planning-fixed-note{font-size:12px;color:var(--muted);margin-top:6px;}';
    var style=document.createElement('style');
    style.id='planningConflictStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }
  function bannerHtml(conflicts){
    var ms=monthNames();
    var max=conflicts.slice(0,5).map(function(c){
      return '<li><strong>'+escLocal(ms[c.month]||c.month)+'</strong>: '+escLocal(txt('Planned','Planificado'))+' — '+escLocal(c.planned)+'; '+escLocal(txt('Fixed','Fijo'))+' — '+escLocal(c.fixed)+'</li>';
    }).join('');
    var extra=conflicts.length>5?'<div class="planning-fixed-note">+'+(conflicts.length-5)+' '+escLocal(txt('more conflict(s)','conflicto(s) más'))+'</div>':'';
    return '<div class="planning-fixed-warning" role="alert"><strong>⚠ '+escLocal(txt('Fixed arrangement conflict','Conflicto de arreglo fijo'))+'</strong><div>'+escLocal(txt('Review before rollover. This does not change your fixed rule.','Revise antes del cambio de año. Esto no cambia la regla fija.'))+'</div><ul>'+max+'</ul>'+extra+'<div class="planning-fixed-note">'+escLocal(txt('If this is permanent, update the Fixed Arrangement rule.','Si esto es permanente, actualice la regla de Arreglos Fijos.'))+'</div></div>';
  }
  function decoratePlanningConflicts(){
    if(typeof state==='undefined'||!state||!Array.isArray(state.planning))return;
    ensureStyles();
    document.querySelectorAll('#planningTables .planning-fixed-warning').forEach(function(el){el.remove();});
    document.querySelectorAll('#planningTables .planning-fixed-conflict-row').forEach(function(el){el.classList.remove('planning-fixed-conflict-row');});
    state.planning.forEach(function(yearObj){
      var panel=document.querySelector('#planningTables [data-year="'+yearObj.year+'"]');
      if(!panel)return;
      var conflicts=planningConflictsForYear(yearObj);
      if(!conflicts.length)return;
      conflicts.forEach(function(c){
        var tr=panel.querySelector('tr[data-id="'+c.row.id+'"]');
        if(tr)tr.classList.add('planning-fixed-conflict-row');
      });
      var title=panel.querySelector('.planning-title')||panel.querySelector('.panel-title');
      if(title)title.insertAdjacentHTML('beforeend',bannerHtml(conflicts));
    });
  }
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
