/**
 * fixed-preview.js — Stage 3 Fixed Arrangement Preview & Conflict Engine.
 * Simulates fixed rules against the next year without changing saved schedule data.
 */
(function(){
  'use strict';

  function isEs(){return typeof state!=='undefined'&&state&&state.language==='es';}
  function txt(en,es){return isEs()?es:en;}
  function ms(){return typeof months==='function'?months():['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];}
  function escLocal(v){
    if(typeof esc==='function')return esc(v);
    v=String(v==null?'':v);
    return v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function rules(){
    if(typeof state==='undefined'||!state)return [];
    return Array.isArray(state.fixedArrangements)?state.fixedArrangements:[];
  }
  function ensureStyles(){
    if(document.getElementById('fixedPreviewStyles'))return;
    var css=''+
      '.fixed-preview-btn{width:100%;}'+
      '.fixed-preview-bg{display:none;position:fixed;inset:0;z-index:380;align-items:center;justify-content:center;padding:16px;background:var(--color-overlay);}'+
      '.fixed-preview-bg.open{display:flex;}'+
      '.fixed-preview{width:min(820px,100%);max-height:min(90vh,780px);display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-md,var(--shadow));padding:18px;}'+
      '.fixed-preview-head{display:flex;justify-content:space-between;gap:10px;align-items:start;}'+
      '.fixed-preview-body{overflow:auto;display:grid;gap:12px;padding-right:2px;}'+
      '.fixed-preview-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}'+
      '.fixed-preview-controls input{max-width:120px;padding:8px 10px;}'+
      '.fixed-preview-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;}'+
      '.fixed-preview-stat{border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--panel-2);padding:9px;}'+
      '.fixed-preview-stat b{display:block;font-size:22px;}'+
      '.fixed-preview-list{display:grid;gap:8px;}'+
      '.fixed-preview-item{border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px;background:var(--panel-2);display:grid;gap:5px;}'+
      '.fixed-preview-safe{border-color:var(--ok);background:color-mix(in srgb,var(--ok),var(--panel) 88%);}'+
      '.fixed-preview-warning{border-color:var(--warn);background:color-mix(in srgb,var(--warn),var(--panel) 88%);}'+
      '.fixed-preview-conflict{border-color:var(--danger);background:color-mix(in srgb,var(--danger),var(--panel) 88%);box-shadow:inset 5px 0 0 var(--danger);}'+
      '.fixed-preview-skipped{opacity:.82;}'+
      '.fixed-preview-label{font-weight:800;}'+
      '.fixed-preview-small{font-size:13px;color:var(--muted);line-height:1.35;}'+
      '.fixed-preview-section-title{margin:4px 0 0;font-size:14px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);}'+
      '@media(max-width:620px){.fixed-preview{max-height:92vh;padding:14px}.fixed-preview-controls button{flex:1 1 auto}}';
    var style=document.createElement('style');
    style.id='fixedPreviewStyles';
    style.textContent=css;
    document.head.appendChild(style);
  }
  function targetDefault(){return +((typeof state!=='undefined'&&state.currentYear)||new Date().getFullYear())+1;}
  function planningFor(year){
    if(typeof state==='undefined'||!Array.isArray(state.planning))return null;
    return state.planning.find(function(y){return +y.year===+year;})||null;
  }
  function plannedFor(year,month){
    var plan=planningFor(year);
    if(!plan||!Array.isArray(plan.rows))return null;
    return plan.rows.find(function(r){return +r.month===+month&&String(r.congregation||'').trim();})||null;
  }
  function applies(rule,year){
    if(rule.mode==='years')return Array.isArray(rule.years)&&rule.years.indexOf(+year)!==-1;
    return true;
  }
  function previewYear(year){
    var result={safe:[],warnings:[],conflicts:[],skipped:[]};
    rules().forEach(function(rule){
      var months=Array.isArray(rule.months)?rule.months:[];
      if(!rule.congregation||!months.length){
        result.warnings.push({rule:rule,month:null,kind:'warning',reason:txt('Rule is incomplete.','La regla está incompleta.')});
        return;
      }
      if(!applies(rule,year)){
        result.skipped.push({rule:rule,month:null,kind:'skipped',reason:txt('Rule does not apply to this year.','La regla no aplica a este año.')});
        return;
      }
      months.forEach(function(m){
        var existing=plannedFor(year,m);
        if(existing&&String(existing.congregation||'').trim()&&existing.congregation!==rule.congregation){
          result.conflicts.push({rule:rule,month:+m,existing:existing,kind:'conflict',reason:txt('Planning already has a different congregation.','Planificación ya tiene una congregación diferente.')});
        }else if(existing&&existing.congregation===rule.congregation){
          result.warnings.push({rule:rule,month:+m,existing:existing,kind:'warning',reason:txt('Already planned with the same congregation.','Ya está planificado con la misma congregación.')});
        }else{
          result.safe.push({rule:rule,month:+m,kind:'safe',reason:txt('Blank month; fixed rule can fill it later.','Mes en blanco; la regla fija puede llenarlo después.')});
        }
      });
    });
    return result;
  }
  function itemHtml(item,cls,icon){
    var month=item.month===null||item.month===undefined?'':(ms()[+item.month]||item.month);
    var existing=item.existing&&item.existing.congregation?'<div class="fixed-preview-small"><strong>'+escLocal(txt('Existing','Existente'))+':</strong> '+escLocal(item.existing.congregation)+'</div>':'';
    var incoming=item.rule&&item.rule.congregation?'<div class="fixed-preview-small"><strong>'+escLocal(txt('Incoming','Entrante'))+':</strong> '+escLocal(item.rule.congregation)+'</div>':'';
    var years=item.rule&&item.rule.mode==='years'?'<div class="fixed-preview-small"><strong>'+escLocal(txt('Years','Años'))+':</strong> '+escLocal((item.rule.years||[]).join(', '))+'</div>':'';
    return '<div class="fixed-preview-item '+cls+'"><div class="fixed-preview-label">'+icon+' '+escLocal(month||txt('Rule','Regla'))+'</div>'+incoming+existing+years+'<div class="fixed-preview-small">'+escLocal(item.reason||'')+'</div></div>';
  }
  function ensureModal(){
    var modal=document.getElementById('fixedPreviewModal');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='fixedPreviewModal';
    modal.className='fixed-preview-bg no-print';
    modal.innerHTML='<div class="fixed-preview" role="dialog" aria-modal="true" aria-labelledby="fixedPreviewTitle"><div class="fixed-preview-head"><div><h3 id="fixedPreviewTitle"></h3><p class="muted" id="fixedPreviewHint"></p></div><button type="button" class="icon-btn" id="fixedPreviewClose">&#215;</button></div><div class="fixed-preview-controls"><label>'+txt('Target year','Año destino')+': <input type="number" id="fixedPreviewYear" min="2000" max="2100"></label><button type="button" class="primary" id="fixedPreviewRun"></button></div><div class="fixed-preview-body" id="fixedPreviewBody"></div><div class="fixed-manager-actions"><button type="button" id="fixedPreviewDone"></button></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal)closePreview();});
    document.getElementById('fixedPreviewClose').addEventListener('click',closePreview);
    document.getElementById('fixedPreviewDone').addEventListener('click',closePreview);
    document.getElementById('fixedPreviewRun').addEventListener('click',function(){renderPreview(+document.getElementById('fixedPreviewYear').value);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))closePreview();});
    return modal;
  }
  function openPreview(){
    ensureStyles();
    var modal=ensureModal();
    document.getElementById('fixedPreviewTitle').textContent=txt('Preview Fixed Arrangements','Vista previa de arreglos fijos');
    document.getElementById('fixedPreviewHint').textContent=txt('Preview only. Nothing is changed.','Solo vista previa. No se cambia nada.');
    document.getElementById('fixedPreviewRun').textContent=txt('Preview','Vista previa');
    document.getElementById('fixedPreviewDone').textContent=txt('Close','Cerrar');
    document.getElementById('fixedPreviewYear').value=targetDefault();
    renderPreview(targetDefault());
    modal.classList.add('open');
  }
  function closePreview(){var modal=document.getElementById('fixedPreviewModal');if(modal)modal.classList.remove('open');}
  function renderPreview(year){
    var body=document.getElementById('fixedPreviewBody');
    if(!body)return;
    var res=previewYear(year);
    var total=res.safe.length+res.warnings.length+res.conflicts.length+res.skipped.length;
    var html='<div class="fixed-preview-summary">'+
      '<div class="fixed-preview-stat fixed-preview-safe"><b>'+res.safe.length+'</b><span>'+escLocal(txt('Safe','Seguros'))+'</span></div>'+ 
      '<div class="fixed-preview-stat fixed-preview-warning"><b>'+res.warnings.length+'</b><span>'+escLocal(txt('Warnings','Avisos'))+'</span></div>'+ 
      '<div class="fixed-preview-stat fixed-preview-conflict"><b>'+res.conflicts.length+'</b><span>'+escLocal(txt('Conflicts','Conflictos'))+'</span></div>'+ 
      '<div class="fixed-preview-stat fixed-preview-skipped"><b>'+res.skipped.length+'</b><span>'+escLocal(txt('Skipped','Omitidos'))+'</span></div>'+ 
      '</div>';
    if(!rules().length)html+='<div class="fixed-empty">'+escLocal(txt('No fixed rules to preview.','No hay reglas fijas para revisar.'))+'</div>';
    if(total&&!res.conflicts.length)html+='<div class="fixed-preview-item fixed-preview-safe"><strong>✓ '+escLocal(txt('No blocking conflicts found.','No se encontraron conflictos bloqueantes.'))+'</strong></div>';
    if(res.conflicts.length)html+='<div class="fixed-preview-item fixed-preview-conflict"><strong>⚠ '+escLocal(txt('Conflicts found. Rollover should stop for review.','Hay conflictos. El cambio de año debe detenerse para revisión.'))+'</strong></div>';
    function section(title,items,cls,icon){if(!items.length)return '';return '<h4 class="fixed-preview-section-title">'+escLocal(title)+'</h4><div class="fixed-preview-list">'+items.map(function(i){return itemHtml(i,cls,icon);}).join('')+'</div>';}
    html+=section(txt('Conflicts','Conflictos'),res.conflicts,'fixed-preview-conflict','⚠');
    html+=section(txt('Warnings','Avisos'),res.warnings,'fixed-preview-warning','⚑');
    html+=section(txt('Safe assignments','Asignaciones seguras'),res.safe,'fixed-preview-safe','✓');
    html+=section(txt('Skipped / expired','Omitidos / vencidos'),res.skipped,'fixed-preview-skipped','○');
    body.innerHTML=html;
  }
  function injectButton(){
    var modal=document.getElementById('fixedManagerModal');
    if(!modal||document.getElementById('fixedPreviewBtn'))return;
    var add=document.getElementById('fixedAddRuleBtn');
    if(!add)return;
    var btn=document.createElement('button');
    btn.id='fixedPreviewBtn';
    btn.type='button';
    btn.className='fixed-preview-btn';
    btn.innerHTML='&#9888; '+txt('Preview Next Year','Vista previa del próximo año');
    btn.addEventListener('click',openPreview);
    add.parentNode.insertBefore(btn,add.nextSibling);
  }
  var tries=0;
  (function wait(){
    tries++;
    ensureStyles();
    injectButton();
    if(tries<120)setTimeout(wait,500);
  })();
})();
