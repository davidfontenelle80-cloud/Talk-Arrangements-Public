(function(root){
  'use strict';
  var MONTHS={en:['January','February','March','April','May','June','July','August','September','October','November','December'],es:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']};
  function clean(v){return String(v==null?'':v).trim();}
  function key(v){return clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/new\s*london/g,'new london').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();}
  function esc(v){return clean(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function years(state){var out=[+state.currentYear];(state.planning||[]).forEach(function(p){if(out.indexOf(+p.year)<0)out.push(+p.year);});return out.sort(function(a,b){return a-b;});}
  function rowsFor(state,year){if(+year===+state.currentYear)return state.schedule||[];var p=(state.planning||[]).find(function(x){return+x.year===+year;});return p&&p.rows||[];}
  function status(row,isCurrent,lang){
    if(!isCurrent)return row.confirmed?(lang==='es'?'Confirmado':'Confirmed'):'';
    var map={en:{'not-contacted':'Not contacted','message-sent':'Message sent','confirmed':'Confirmed','needs-follow-up':'Needs follow-up'},es:{'not-contacted':'Sin contactar','message-sent':'Mensaje enviado','confirmed':'Confirmado','needs-follow-up':'Necesita seguimiento'}};
    return (map[lang]||map.en)[row.status]||'';
  }
  function buildModel(state,year,includeContacts){
    var lang=state.language==='es'?'es':'en', contacts={};
    (state.congregations||[]).forEach(function(c){contacts[key(c.name)]=c;});
    var isCurrent=+year===+state.currentYear;
    var rows=rowsFor(state,year).slice().sort(function(a,b){return+a.month-+b.month;}).map(function(r){
      var c=contacts[key(r.congregation)]||{};
      return {month:(MONTHS[lang]||MONTHS.en)[+r.month]||'',congregation:clean(r.congregation),coordinator:includeContacts?clean(r.contact||c.coordinator):'',phone:includeContacts?clean(c.phone):'',email:includeContacts?clean(c.email):'',status:status(r,isCurrent,lang),note:clean(r.note)};
    });
    return {year:+year,lang:lang,includeContacts:!!includeContacts,rows:rows,title:lang==='es'?'Arreglos de discursos '+year:'Talk arrangements '+year,created:new Date().toLocaleDateString(lang==='es'?'es-US':'en-US')};
  }
  function labels(model){return model.lang==='es'?{month:'Mes',congregation:'Congregación',coordinator:'Coordinador',phone:'Teléfono',email:'Correo',status:'Estado',note:'Nota',prepared:'Preparado'}:{month:'Month',congregation:'Congregation',coordinator:'Coordinator',phone:'Phone',email:'Email',status:'Status',note:'Note',prepared:'Prepared'};}
  function tableHtml(model){var l=labels(model);var heads='<th>'+l.month+'</th><th>'+l.congregation+'</th>'+(model.includeContacts?'<th>'+l.coordinator+'</th><th>'+l.phone+'</th><th>'+l.email+'</th>':'')+'<th>'+l.status+'</th><th>'+l.note+'</th>';
    var body=model.rows.map(function(r){return '<tr><td>'+esc(r.month)+'</td><td>'+esc(r.congregation)+'</td>'+(model.includeContacts?'<td>'+esc(r.coordinator)+'</td><td>'+esc(r.phone)+'</td><td>'+esc(r.email)+'</td>':'')+'<td>'+esc(r.status)+'</td><td>'+esc(r.note)+'</td></tr>';}).join('');
    return '<h2>'+esc(model.title)+'</h2><p>'+l.prepared+': '+esc(model.created)+(model.includeContacts?' · '+(model.lang==='es'?'Incluye información de contacto':'Includes contact information'):'')+'</p><table><thead><tr>'+heads+'</tr></thead><tbody>'+body+'</tbody></table>';
  }
  function textReport(model){var l=labels(model), lines=[model.title,model.includeContacts?(model.lang==='es'?'Información de contacto incluida':'Contact information included'):''];model.rows.forEach(function(r){var parts=[r.month+': '+r.congregation];if(model.includeContacts){if(r.coordinator)parts.push(l.coordinator+': '+r.coordinator);if(r.phone)parts.push(l.phone+': '+r.phone);if(r.email)parts.push(l.email+': '+r.email);}if(r.status)parts.push(l.status+': '+r.status);if(r.note)parts.push(l.note+': '+r.note);lines.push(parts.join('\n'));});return lines.filter(Boolean).join('\n\n');}
  function copy(text,done){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});else fallback();function fallback(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();done();}}
  function open(){var bridge=root.TalkArrangementsDataBridge;if(!bridge)return;var state=bridge.getState(),lang=state.language==='es'?'es':'en',old=document.getElementById('yearReportModal');if(old)old.remove();var overlay=document.createElement('div');overlay.id='yearReportModal';overlay.className='year-report-backdrop';var ys=years(state);var t=lang==='es'?{title:'Informe anual',year:'Año',simple:'Solo arreglos',full:'Arreglos y contactos',print:'Imprimir / Guardar PDF',share:'Compartir',copy:'Copiar',close:'Cerrar'}:{title:'Year report',year:'Year',simple:'Arrangements only',full:'Arrangements and contacts',print:'Print / Save PDF',share:'Share',copy:'Copy',close:'Close'};
    overlay.innerHTML='<div class="year-report-dialog" role="dialog" aria-modal="true"><div class="year-report-controls"><h3>'+t.title+'</h3><label>'+t.year+'<select data-year>'+ys.map(function(y){return '<option value="'+y+'"'+(y===+state.currentYear?' selected':'')+'>'+y+'</option>';}).join('')+'</select></label><div class="year-report-options"><label><input type="radio" name="reportPrivacy" value="simple" checked> '+t.simple+'</label><label><input type="radio" name="reportPrivacy" value="full"> '+t.full+'</label></div></div><div class="year-report-preview" data-preview></div><div class="year-report-actions"><button data-close>'+t.close+'</button><button data-copy>'+t.copy+'</button><button data-share>'+t.share+'</button><button class="primary" data-print>'+t.print+'</button></div></div>';
    document.body.appendChild(overlay);var currentModel;
    function render(){var include=overlay.querySelector('[name="reportPrivacy"]:checked').value==='full';currentModel=buildModel(bridge.getState(),+overlay.querySelector('[data-year]').value,include);overlay.querySelector('[data-preview]').innerHTML=tableHtml(currentModel);}
    overlay.querySelector('[data-year]').onchange=render;overlay.querySelectorAll('[name="reportPrivacy"]').forEach(function(r){r.onchange=render;});overlay.querySelector('[data-close]').onclick=function(){overlay.remove();};
    overlay.querySelector('[data-copy]').onclick=function(){copy(textReport(currentModel),function(){bridge.notify(lang==='es'?'Informe copiado.':'Report copied.');});};
    overlay.querySelector('[data-share]').onclick=function(){var tx=textReport(currentModel);if(navigator.share)navigator.share({title:currentModel.title,text:tx}).catch(function(){});else copy(tx,function(){bridge.notify(lang==='es'?'Informe copiado para compartir.':'Report copied for sharing.');});};
    overlay.querySelector('[data-print]').onclick=function(){var rootEl=document.getElementById('yearReportPrintRoot');if(!rootEl){rootEl=document.createElement('div');rootEl.id='yearReportPrintRoot';document.body.appendChild(rootEl);}rootEl.innerHTML=tableHtml(currentModel);document.body.classList.add('year-report-printing');window.print();setTimeout(function(){document.body.classList.remove('year-report-printing');},700);};render();
  }
  function wire(){var b=document.getElementById('yearReportBtn');if(b)b.onclick=open;}
  root.TalkYearReport={buildModel:buildModel,tableHtml:tableHtml,textReport:textReport};
  if(root.document){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();}
})(typeof window!=='undefined'?window:globalThis);
