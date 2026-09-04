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
      var c=contacts[key(r.congregation)]||{},arrangementContact=clean(r.contact),directoryContact=clean(c.coordinator),chosen=arrangementContact||directoryContact;
      var matched=!arrangementContact||!directoryContact||key(arrangementContact)===key(directoryContact);
      return {month:(MONTHS[lang]||MONTHS.en)[+r.month]||'',congregation:clean(r.congregation),coordinator:includeContacts?chosen:'',phone:includeContacts&&matched?clean(c.phone):'',email:includeContacts&&matched?clean(c.email):'',contactUnmatched:!!(includeContacts&&!matched),status:status(r,isCurrent,lang),note:clean(r.note)};
    });
    return {year:+year,lang:lang,includeContacts:!!includeContacts,rows:rows,title:lang==='es'?'Arreglos de discursos '+year:'Talk arrangements '+year,created:new Date().toLocaleDateString(lang==='es'?'es-US':'en-US')};
  }
  function labels(model){return model.lang==='es'?{month:'Mes',congregation:'Congregación',coordinator:'Contacto del arreglo',phone:'Teléfono',email:'Correo',status:'Estado',note:'Nota',prepared:'Preparado',unmatched:'Datos de contacto no vinculados; verifique el directorio.'}:{month:'Month',congregation:'Congregation',coordinator:'Arrangement contact',phone:'Phone',email:'Email',status:'Status',note:'Note',prepared:'Prepared',unmatched:'Contact details are not matched; verify the directory.'};}
  function tableHtml(model){var l=labels(model);var heads='<th>'+l.month+'</th><th>'+l.congregation+'</th>'+(model.includeContacts?'<th>'+l.coordinator+'</th><th>'+l.phone+'</th><th>'+l.email+'</th>':'')+'<th>'+l.status+'</th><th>'+l.note+'</th>';
    var body=model.rows.map(function(r){return '<tr><td>'+esc(r.month)+'</td><td>'+esc(r.congregation)+'</td>'+(model.includeContacts?'<td>'+esc(r.coordinator)+(r.contactUnmatched?'<small class="report-contact-warning">'+esc(l.unmatched)+'</small>':'')+'</td><td>'+esc(r.phone)+'</td><td>'+esc(r.email)+'</td>':'')+'<td>'+esc(r.status)+'</td><td>'+esc(r.note)+'</td></tr>';}).join('');
    return '<h2>'+esc(model.title)+'</h2><p>'+l.prepared+': '+esc(model.created)+(model.includeContacts?' · '+(model.lang==='es'?'Incluye información de contacto':'Includes contact information'):'')+'</p><table><thead><tr>'+heads+'</tr></thead><tbody>'+body+'</tbody></table>';
  }
  function textReport(model){var l=labels(model), lines=[model.title,model.includeContacts?(model.lang==='es'?'Información de contacto incluida':'Contact information included'):''];model.rows.forEach(function(r){var parts=[r.month+': '+r.congregation];if(model.includeContacts){if(r.coordinator)parts.push(l.coordinator+': '+r.coordinator);if(r.phone)parts.push(l.phone+': '+r.phone);if(r.email)parts.push(l.email+': '+r.email);if(r.contactUnmatched)parts.push(l.unmatched);}if(r.status)parts.push(l.status+': '+r.status);if(r.note)parts.push(l.note+': '+r.note);lines.push(parts.join('\n'));});return lines.filter(Boolean).join('\n\n');}
  function copy(text,done){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});else fallback();function fallback(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();done();}}
  function printableDocument(model){
    var printLabel=model.lang==='es'?'Imprimir / Guardar PDF':'Print / Save PDF';
    return '<!doctype html><html lang="'+model.lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(model.title)+'</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111;background:#fff;margin:0;padding:20px}.print-bar{position:sticky;top:0;display:flex;justify-content:flex-end;padding:10px 0;background:#fff}button{font:inherit;font-weight:700;padding:12px 16px;border:1px solid #777;border-radius:9px;background:#111;color:#fff}h2{margin:8px 0 4px}p{color:#444}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:7px;border:1px solid #888;text-align:left;vertical-align:top}th{background:#eee}.report-contact-warning{display:block;margin-top:3px;color:#9a3412;font-weight:700}@media print{.print-bar{display:none}body{padding:0}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><div class="print-bar"><button onclick="window.print()">'+printLabel+'</button></div>'+tableHtml(model)+'</body></html>';
  }
  function openPrintablePage(model,bridge){
    var w=root.open('about:blank','_blank');
    if(!w){bridge.notify(model.lang==='es'?'No se pudo abrir la página de impresión. Permita las ventanas emergentes e inténtelo de nuevo.':'The printable page could not open. Allow pop-ups and try again.');return false;}
    w.document.open();w.document.write(printableDocument(model));w.document.close();return true;
  }
  function directPrint(model){
    var rootEl=document.getElementById('yearReportPrintRoot');if(!rootEl){rootEl=document.createElement('div');rootEl.id='yearReportPrintRoot';document.body.appendChild(rootEl);}
    rootEl.innerHTML=tableHtml(model);document.body.classList.add('year-report-printing');
    var cleanup=function(){document.body.classList.remove('year-report-printing');};root.addEventListener('afterprint',cleanup,{once:true});root.print();setTimeout(cleanup,15000);
  }
  function showPrintOptions(model,bridge){
    var es=model.lang==='es',old=document.getElementById('printOptionsModal');if(old)old.remove();var overlay=document.createElement('div');overlay.id='printOptionsModal';overlay.className='print-options-backdrop';
    var t=es?{title:'Opciones de impresión',hint:'En iPhone, use “Abrir página imprimible”. En esa página, toque Imprimir / Guardar PDF.',open:'Abrir página imprimible',direct:'Probar impresión directa',share:'Compartir informe',close:'Cerrar',copied:'Informe copiado para compartir.'}:{title:'Print options',hint:'On iPhone, use “Open printable page.” On that page, tap Print / Save PDF.',open:'Open printable page',direct:'Try direct printing',share:'Share report',close:'Close',copied:'Report copied for sharing.'};
    overlay.innerHTML='<div class="print-options-dialog" role="dialog" aria-modal="true" aria-labelledby="printOptionsTitle"><h3 id="printOptionsTitle">'+t.title+'</h3><p>'+t.hint+'</p><div class="print-options-actions"><button data-close>'+t.close+'</button><button data-share>'+t.share+'</button><button data-direct>'+t.direct+'</button><button class="primary" data-open>'+t.open+'</button></div></div>';
    document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=function(){overlay.remove();};overlay.querySelector('[data-open]').onclick=function(){openPrintablePage(model,bridge);};overlay.querySelector('[data-direct]').onclick=function(){directPrint(model);};overlay.querySelector('[data-share]').onclick=function(){var tx=textReport(model);if(navigator.share)navigator.share({title:model.title,text:tx}).catch(function(){});else copy(tx,function(){bridge.notify(t.copied);});};
  }
  function open(){var bridge=root.TalkArrangementsDataBridge;if(!bridge)return;var state=bridge.getState(),lang=state.language==='es'?'es':'en',old=document.getElementById('yearReportModal');if(old)old.remove();var overlay=document.createElement('div');overlay.id='yearReportModal';overlay.className='year-report-backdrop';var ys=years(state);var t=lang==='es'?{title:'Informe anual',year:'Año',simple:'Solo arreglos',full:'Arreglos y contactos',print:'Imprimir / Guardar PDF',share:'Compartir',copy:'Copiar',close:'Cerrar'}:{title:'Year report',year:'Year',simple:'Arrangements only',full:'Arrangements and contacts',print:'Print / Save PDF',share:'Share',copy:'Copy',close:'Close'};
    overlay.innerHTML='<div class="year-report-dialog" role="dialog" aria-modal="true"><div class="year-report-controls"><h3>'+t.title+'</h3><label>'+t.year+'<select data-year>'+ys.map(function(y){return '<option value="'+y+'"'+(y===+state.currentYear?' selected':'')+'>'+y+'</option>';}).join('')+'</select></label><div class="year-report-options"><label><input type="radio" name="reportPrivacy" value="simple" checked> '+t.simple+'</label><label><input type="radio" name="reportPrivacy" value="full"> '+t.full+'</label></div></div><div class="year-report-preview" data-preview></div><div class="year-report-actions"><button data-close>'+t.close+'</button><button data-copy>'+t.copy+'</button><button data-share>'+t.share+'</button><button class="primary" data-print>'+t.print+'</button></div></div>';
    document.body.appendChild(overlay);var currentModel;
    function render(){var include=overlay.querySelector('[name="reportPrivacy"]:checked').value==='full';currentModel=buildModel(bridge.getState(),+overlay.querySelector('[data-year]').value,include);overlay.querySelector('[data-preview]').innerHTML=tableHtml(currentModel);}
    overlay.querySelector('[data-year]').onchange=render;overlay.querySelectorAll('[name="reportPrivacy"]').forEach(function(r){r.onchange=render;});overlay.querySelector('[data-close]').onclick=function(){overlay.remove();};
    overlay.querySelector('[data-copy]').onclick=function(){copy(textReport(currentModel),function(){bridge.notify(lang==='es'?'Informe copiado.':'Report copied.');});};
    overlay.querySelector('[data-share]').onclick=function(){var tx=textReport(currentModel);if(navigator.share)navigator.share({title:currentModel.title,text:tx}).catch(function(){});else copy(tx,function(){bridge.notify(lang==='es'?'Informe copiado para compartir.':'Report copied for sharing.');});};
    overlay.querySelector('[data-print]').onclick=function(){showPrintOptions(currentModel,bridge);};render();
  }
  function wire(){var b=document.getElementById('yearReportBtn');if(b)b.onclick=open;}
  root.TalkYearReport={buildModel:buildModel,tableHtml:tableHtml,textReport:textReport,printableDocument:printableDocument,open:open};
  if(root.document){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();}
})(typeof window!=='undefined'?window:globalThis);
