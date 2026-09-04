(function(root){
  'use strict';

  var MONTHS={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11,
    january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};

  function text(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/[\u200e\u200f\u202a-\u202e]/g,'').replace(/\s+/g,' ').trim();}
  function key(v){return text(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/new\s*london/g,'new london').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();}
  function month(v){return MONTHS[key(v)];}
  function yearFrom(v){var m=text(v).match(/(?:arreglos(?:\s+de\s+discursos)?(?:\s+para)?|arrangements?(?:\s+for)?)\D*(20\d{2})/i);return m?+m[1]:null;}
  function esc(v){return text(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function uid(){return root.crypto&&root.crypto.randomUUID?root.crypto.randomUUID():'excel-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
  function fixed(note){return /arreglo\s+fijo|fixed/i.test(text(note));}
  var SNAPSHOT_KEY='jw-talk-arrangements-pre-excel-import';

  function rowsFromSheet(sheet,xlsx){return xlsx.utils.sheet_to_json(sheet,{header:1,defval:'',raw:false,blankrows:true});}

  function parseWorkbook(workbook,xlsx,currentYear){
    if(!workbook||!workbook.SheetNames||!workbook.SheetNames.length)throw new Error('The workbook has no sheets.');
    var sheetName=workbook.SheetNames[0], rows=rowsFromSheet(workbook.Sheets[sheetName],xlsx);
    var detectedCurrent=yearFrom((rows[0]||[])[0])||+currentYear||new Date().getFullYear();
    var blocks=[], headerRows=[];
    for(var i=0;i<rows.length;i++){
      var a=text((rows[i]||[])[0]);
      var y=yearFrom(a);
      if(y)headerRows.push({row:i,year:y});
    }
    var firstHeader=rows.findIndex(function(r){return month(r&&r[0])!==undefined&&key(r&&r[1]).indexOf('congreg')===0;});
    if(firstHeader<0)firstHeader=1;
    blocks.push({year:detectedCurrent,header:firstHeader,end:headerRows.length?headerRows[0].row:rows.length});
    headerRows.forEach(function(h,idx){blocks.push({year:h.year,header:h.row+1,end:idx+1<headerRows.length?headerRows[idx+1].row:rows.length});});

    var years=[];
    blocks.forEach(function(b){
      var out=[];
      for(var r=b.header+1;r<b.end;r++){
        var mi=month((rows[r]||[])[0]);
        if(mi===undefined)continue;
        var congregation=text((rows[r]||[])[1]);
        if(!congregation)continue;
        out.push({month:mi,congregation:congregation,note:text((rows[r]||[])[4]),sourceRow:r+1});
      }
      if(out.length)years.push({year:b.year,rows:out});
    });

    var contacts=[], contactHeader=-1;
    for(var j=0;j<rows.length;j++){
      if(key((rows[j]||[])[6]).indexOf('congregacion')===0&&/coordinador|coordinator/i.test(text((rows[j]||[])[7])))contactHeader=j;
    }
    if(contactHeader>=0){
      for(var c=contactHeader+1;c<rows.length;c++){
        var name=text((rows[c]||[])[6]);
        if(!name)continue;
        contacts.push({name:name,coordinator:text((rows[c]||[])[7]),phone:text((rows[c]||[])[8]),email:text((rows[c]||[])[9]),sourceRow:c+1});
      }
    }
    var duplicateYears=[], seenYears={};
    years.forEach(function(y){if(seenYears[y.year])duplicateYears.push(y.year);seenYears[y.year]=true;});
    var duplicateContacts=[], seenContacts={};
    contacts.forEach(function(c){var k=key(c.name);if(seenContacts[k])duplicateContacts.push(c.name);seenContacts[k]=true;});
    var blockingErrors=duplicateYears.map(function(y){return 'Year '+y+' appears more than once.';}).concat(duplicateContacts.map(function(n){return 'Duplicate contact: '+n;}));
    return {sheetName:sheetName,years:years,contacts:contacts,warnings:[],blockingErrors:blockingErrors};
  }

  function stateYearRows(state,year){
    if(+year===+state.currentYear)return state.schedule||[];
    var p=(state.planning||[]).find(function(x){return+x.year===+year;});return p&&p.rows||[];
  }
  function displayRow(r){return text(r.congregation)+(text(r.note)?' · '+text(r.note):'');}
  function reconcile(state,parsed){
    var actions=[], importedYears={};
    parsed.years.forEach(function(y){
      importedYears[y.year]=true;
      var local=stateYearRows(state,y.year), byMonth={};local.forEach(function(r){byMonth[+r.month]=r;});
      var incomingMonths={};
      y.rows.forEach(function(row){
        incomingMonths[row.month]=true;var old=byMonth[row.month];
        if(!old)actions.push({id:uid(),kind:'add-arrangement',year:y.year,month:row.month,incoming:row,required:true,label:'Add '+y.year+' · '+displayRow(row)});
        else if(key(old.congregation)!==key(row.congregation)||text(old.note)!==text(row.note))actions.push({id:uid(),kind:'change-arrangement',year:y.year,month:row.month,existing:old,incoming:row,label:'Change '+y.year+' month '+(row.month+1),detail:displayRow(old)+' → '+displayRow(row)});
      });
      local.forEach(function(old){if(!incomingMonths[+old.month]&&text(old.congregation))actions.push({id:uid(),kind:'delete-arrangement',year:y.year,month:+old.month,existing:old,label:'Remove '+y.year+' · '+displayRow(old)});});
    });
    var localContacts=state.congregations||[], byName={};localContacts.forEach(function(c){byName[key(c.name)]=c;});
    var incomingNames={};
    parsed.contacts.forEach(function(c){
      var k=key(c.name),old=byName[k];incomingNames[k]=true;
      if(!old)actions.push({id:uid(),kind:'add-contact',incoming:c,required:true,label:'Add contact · '+c.name});
      else if(text(old.name)!==text(c.name)||text(old.coordinator)!==c.coordinator||text(old.phone)!==c.phone||text(old.email)!==c.email)
        actions.push({id:uid(),kind:'change-contact',existing:old,incoming:c,label:'Update contact · '+c.name,detail:[old.coordinator,old.phone,old.email].filter(Boolean).join(' · ')+' → '+[c.coordinator,c.phone,c.email].filter(Boolean).join(' · ')});
    });
    localContacts.forEach(function(c){if(!incomingNames[key(c.name)]&&text(c.name))actions.push({id:uid(),kind:'delete-contact',existing:c,label:'Remove contact · '+c.name});});
    return {parsed:parsed,actions:actions,newCount:actions.filter(function(a){return a.required;}).length,reviewCount:actions.filter(function(a){return !a.required&&a.kind.indexOf('delete')!==0;}).length,deleteCount:actions.filter(function(a){return a.kind.indexOf('delete')===0;}).length};
  }

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function setYearRows(next,year,rows){
    if(+year===+next.currentYear){next.schedule=rows;return;}
    next.planning=next.planning||[];var p=next.planning.find(function(x){return+x.year===+year;});
    if(p)p.rows=rows;else next.planning.push({year:+year,rows:rows});
    next.planning.sort(function(a,b){return+a.year-+b.year;});
  }
  function applyReconciliation(state,report,selected){
    var next=clone(state), unresolved=[];
    localStorage.setItem(SNAPSHOT_KEY,JSON.stringify({savedAt:new Date().toISOString(),state:clone(state)}));
    report.actions.forEach(function(a){
      var apply=a.required||selected[a.id];
      if(!apply){if(a.kind.indexOf('change')===0||a.kind.indexOf('delete')===0)unresolved.push({kind:a.kind,label:actionLabel(a,state.language==='es'),detail:a.detail||''});return;}
      if(a.kind.indexOf('arrangement')!==-1){
        var rows=stateYearRows(next,a.year).slice(), idx=rows.findIndex(function(r){return+r.month===+a.month;});
        if(a.kind==='delete-arrangement'){if(idx>=0)rows.splice(idx,1);}
        else if(idx>=0){var old=rows[idx];rows[idx]=Object.assign({},old,{congregation:a.incoming.congregation,note:a.incoming.note});}
        else rows.push({id:uid(),month:a.month,congregation:a.incoming.congregation,status:'not-contacted',followUpDate:'',contact:'',confirmed:false,note:a.incoming.note});
        rows.sort(function(x,y){return+x.month-+y.month;});setYearRows(next,a.year,rows);
      }else{
        next.congregations=next.congregations||[];var ci=next.congregations.findIndex(function(c){return key(c.name)===key((a.existing||a.incoming).name);});
        if(a.kind==='delete-contact'){if(ci>=0)next.congregations.splice(ci,1);}
        else if(ci>=0)next.congregations[ci]=Object.assign({},next.congregations[ci],{name:a.incoming.name,coordinator:a.incoming.coordinator,phone:a.incoming.phone,email:a.incoming.email});
        else next.congregations.push({id:uid(),name:a.incoming.name,coordinator:a.incoming.coordinator,phone:a.incoming.phone,email:a.incoming.email,note:'',isFixed:false});
      }
    });
    var fixedNames={}, spreadsheetNames={};
    report.parsed.contacts.forEach(function(c){spreadsheetNames[key(c.name)]=true;});
    report.parsed.years.forEach(function(y){y.rows.forEach(function(r){var k=key(r.congregation);spreadsheetNames[k]=true;if(fixed(r.note))fixedNames[k]=true;});});
    (next.congregations||[]).forEach(function(c){var k=key(c.name);if(spreadsheetNames[k])c.isFixed=!!fixedNames[k];});
    next.spreadsheetSync={file:report.fileName||'',importedAt:new Date().toISOString(),years:report.parsed.years.map(function(y){return y.year;}),unresolved:unresolved};
    return next;
  }

  function actionLabel(a,es){
    if(a.kind==='add-arrangement')return (es?'Añadir ':'Add ')+a.year+' · '+displayRow(a.incoming);
    if(a.kind==='change-arrangement')return (es?'Cambiar ':'Change ')+a.year+' · '+(es?'mes ':'month ')+(a.month+1);
    if(a.kind==='delete-arrangement')return (es?'Eliminar ':'Remove ')+a.year+' · '+displayRow(a.existing);
    if(a.kind==='add-contact')return (es?'Añadir contacto · ':'Add contact · ')+a.incoming.name;
    if(a.kind==='change-contact')return (es?'Actualizar contacto · ':'Update contact · ')+a.incoming.name;
    return (es?'Eliminar contacto · ':'Remove contact · ')+(a.existing&&a.existing.name||'');
  }
  function issueLabel(value,es){var s=text(value);if(!es)return s;var y=s.match(/^Year (\d+) appears more than once\.$/);if(y)return 'El año '+y[1]+' aparece más de una vez.';var c=s.match(/^Duplicate contact: (.+)$/);if(c)return 'Contacto duplicado: '+c[1];return s;}
  function rowHtml(a,t,es){var checked=a.required?' checked disabled':'';var note=a.required?t.automatic:t.approve;return '<label class="excel-sync-row"><input type="checkbox" data-action="'+a.id+'"'+checked+'><span>'+esc(actionLabel(a,es))+(a.detail?'<small>'+esc(a.detail)+'</small>':'')+'<small>'+note+'</small></span></label>';}
  function group(title,items,t,es){return items.length?'<section class="excel-sync-group"><h4>'+esc(title)+'</h4>'+items.map(function(a){return rowHtml(a,t,es);}).join('')+'</section>':'';}
  function showPreview(report,fileName,bridge){
    report.fileName=fileName;var old=document.getElementById('excelSyncPreview');if(old)old.remove();
    var es=bridge.getState().language==='es',t=es?{title:'Vista previa de actualización',years:'Años',notice:'Los cambios y eliminaciones existentes solo se aplican con su aprobación. Las diferencias omitidas quedan como recordatorios.',newInfo:'Información nueva',review:'Cambios que requieren aprobación',removals:'Eliminaciones que requieren aprobación',newCount:'Nuevos',reviewCount:'Revisar',removeCount:'Posibles eliminaciones',cancel:'Cancelar',apply:'Aplicar seleccionados',blocked:'Corrija primero los errores de la hoja',automatic:'Se añade automáticamente',approve:'Seleccione para aprobar',saved:'Hoja de cálculo actualizada.',differences:' diferencia(s) guardada(s) para revisar.',matches:' Todo coincide.',failed:'La actualización no se aplicó porque no se pudo guardar una copia de recuperación.'}:{title:'Spreadsheet update preview',years:'Years',notice:'Existing changes and deletions are not applied unless you approve them. Unapproved differences remain as reminders that the spreadsheet may need updating.',newInfo:'New information',review:'Changes requiring approval',removals:'Deletions requiring approval',newCount:'New',reviewCount:'Need review',removeCount:'Possible removals',cancel:'Cancel',apply:'Apply selected updates',blocked:'Fix spreadsheet errors first',automatic:'Added automatically',approve:'Select to approve',saved:'Spreadsheet updated.',differences:' difference(s) saved for review.',matches:' Everything matches.',failed:'The update was not applied because a recovery copy could not be saved.'};
    var adds=report.actions.filter(function(a){return a.required;}), changes=report.actions.filter(function(a){return !a.required&&a.kind.indexOf('delete')!==0;}), deletes=report.actions.filter(function(a){return a.kind.indexOf('delete')===0;});
    var overlay=document.createElement('div');overlay.id='excelSyncPreview';overlay.className='excel-sync-backdrop';
    overlay.innerHTML='<div class="excel-sync-dialog" role="dialog" aria-modal="true" aria-labelledby="excelSyncTitle"><div class="excel-sync-head"><h3 id="excelSyncTitle">'+t.title+'</h3><small>'+esc(fileName)+' · '+t.years+' '+report.parsed.years.map(function(y){return y.year;}).join(', ')+'</small></div><div class="excel-sync-body">'+
      (report.parsed.blockingErrors||[]).map(function(w){return '<div class="excel-sync-error">'+esc(issueLabel(w,es))+'</div>';}).join('')+
      (report.parsed.warnings||[]).map(function(w){return '<div class="excel-sync-warning">'+esc(issueLabel(w,es))+'</div>';}).join('')+
      '<div class="excel-sync-warning">'+t.notice+'</div>'+
      '<div class="excel-sync-summary"><div class="excel-sync-stat"><strong>'+adds.length+'</strong>'+t.newCount+'</div><div class="excel-sync-stat"><strong>'+changes.length+'</strong>'+t.reviewCount+'</div><div class="excel-sync-stat"><strong>'+deletes.length+'</strong>'+t.removeCount+'</div></div>'+
      group(t.newInfo,adds,t,es)+group(t.review,changes,t,es)+group(t.removals,deletes,t,es)+'</div><div class="excel-sync-foot"><button type="button" data-cancel>'+t.cancel+'</button><button type="button" class="primary" data-apply>'+t.apply+'</button></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('[data-cancel]').onclick=function(){overlay.remove();};
    var applyButton=overlay.querySelector('[data-apply]');
    if((report.parsed.blockingErrors||[]).length){applyButton.disabled=true;applyButton.textContent=t.blocked;}
    applyButton.onclick=function(){try{var selected={};overlay.querySelectorAll('[data-action]').forEach(function(cb){if(cb.checked)selected[cb.dataset.action]=true;});var next=applyReconciliation(bridge.getState(),report,selected);bridge.applyState(next);overlay.remove();refreshStatus(bridge);var n=next.spreadsheetSync.unresolved.length;bridge.notify(t.saved+(n?' '+n+t.differences:t.matches));}catch(e){console.error(e);bridge.notify(t.failed);}};
  }

  function readSnapshot(){
    try{var value=JSON.parse(localStorage.getItem(SNAPSHOT_KEY)||'null');if(!value||!value.state||!Array.isArray(value.state.schedule)||!Array.isArray(value.state.congregations))return null;var check=root.TalkStateValidation&&root.TalkStateValidation.validate(value.state);return check&&!check.ok?null:value;}catch(e){return null;}
  }
  function lang(bridge){return bridge.getState().language==='es'?'es':'en';}
  function refreshStatus(bridge){
    var state=bridge.getState(),n=state.spreadsheetSync&&Array.isArray(state.spreadsheetSync.unresolved)?state.spreadsheetSync.unresolved.length:0;
    ['excelSyncStatusBtn','settingsSpreadsheetSyncBtn'].forEach(function(id){var b=document.getElementById(id);if(!b)return;b.dataset.count=n;b.classList.toggle('has-sync-items',n>0);var label=b.querySelector('span');if(label)label.textContent=(lang(bridge)==='es'?'Estado de Excel':'Excel status')+(n?' ('+n+')':'');});
  }
  function showSyncCenter(bridge){
    var state=bridge.getState(),sync=state.spreadsheetSync||{},items=Array.isArray(sync.unresolved)?sync.unresolved:[],snapshot=readSnapshot(),es=lang(bridge)==='es';
    var old=document.getElementById('excelSyncCenter');if(old)old.remove();
    var overlay=document.createElement('div');overlay.id='excelSyncCenter';overlay.className='excel-sync-backdrop';
    var itemHtml=items.length?items.map(function(i){return '<div class="excel-sync-reminder"><strong>'+esc(i.label)+'</strong>'+(i.detail?'<small>'+esc(i.detail)+'</small>':'')+'</div>';}).join(''):'<div class="excel-sync-empty">'+(es?'La app y la hoja de cálculo coinciden.':'The app and spreadsheet match.')+'</div>';
    overlay.innerHTML='<div class="excel-sync-dialog" role="dialog" aria-modal="true"><div class="excel-sync-head"><h3>'+(es?'Centro de sincronización de Excel':'Excel reconciliation center')+'</h3><small>'+(sync.file?esc(sync.file)+' · ':'')+(sync.importedAt?new Date(sync.importedAt).toLocaleString():(es?'Sin importaciones todavía':'No imports yet'))+'</small></div><div class="excel-sync-body"><h4>'+(es?'Diferencias pendientes':'Pending differences')+'</h4>'+itemHtml+(snapshot?'<div class="excel-sync-recovery">'+(es?'Hay una copia de recuperación anterior a la última importación.':'A recovery copy from before the last import is available.')+'</div>':'')+'</div><div class="excel-sync-foot"><button data-close>'+(es?'Cerrar':'Close')+'</button>'+(items.length?'<button data-clear>'+(es?'Marcar revisado':'Mark reviewed')+'</button>':'')+(snapshot?'<button class="danger" data-restore>'+(es?'Deshacer última importación':'Undo last import')+'</button>':'')+'</div></div>';
    document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=function(){overlay.remove();};
    var clear=overlay.querySelector('[data-clear]');if(clear)clear.onclick=function(){bridge.confirm(es?'¿Marcar todas las diferencias como revisadas?':'Mark all differences as reviewed?',function(){var next=bridge.getState();next.spreadsheetSync=next.spreadsheetSync||{};next.spreadsheetSync.unresolved=[];bridge.applyState(next);overlay.remove();refreshStatus(bridge);});};
    var restore=overlay.querySelector('[data-restore]');if(restore)restore.onclick=function(){bridge.confirm(es?'Esto restaurará los datos guardados antes de la última importación. ¿Continuar?':'This restores the data saved before the last spreadsheet import. Continue?',function(){var snap=readSnapshot();if(!snap){bridge.notify(es?'La copia de recuperación ya no está disponible.':'The recovery copy is no longer available.');return;}bridge.applyState(clone(snap.state));localStorage.removeItem(SNAPSHOT_KEY);overlay.remove();refreshStatus(bridge);bridge.notify(es?'Se deshizo la última importación.':'The last spreadsheet import was undone.');});};
  }

  function wire(){
    var bridge=root.TalkArrangementsDataBridge,input=document.getElementById('excelImportFile');if(!bridge||!input)return;
    function choose(){if(!root.XLSX){bridge.notify(lang(bridge)==='es'?'No se pudo cargar el lector de Excel. Cierre y vuelva a abrir la app.':'Excel reader did not load. Close and reopen the app.');return;}input.click();}
    var top=document.getElementById('excelImportBtn'),settings=document.getElementById('settingsExcelImportBtn');if(top)top.onclick=choose;if(settings)settings.onclick=choose;
    ['excelSyncStatusBtn','settingsSpreadsheetSyncBtn'].forEach(function(id){var b=document.getElementById(id);if(b)b.onclick=function(){showSyncCenter(bridge);};});root.addEventListener('talk:language-changed',function(){refreshStatus(bridge);});refreshStatus(bridge);
    input.onchange=function(){var file=input.files&&input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){try{var state=bridge.getState(),parsed=parseWorkbook(root.XLSX.read(new Uint8Array(reader.result),{type:'array',cellDates:true}),root.XLSX,state.currentYear);showPreview(reconcile(state,parsed),file.name,bridge);}catch(e){console.error(e);bridge.notify((lang(bridge)==='es'?'No se pudo leer esta hoja de cálculo: ':'Could not read this spreadsheet: ')+e.message);}input.value='';};reader.readAsArrayBuffer(file);};
  }

  root.TalkExcelImport={parseWorkbook:parseWorkbook,reconcile:reconcile,applyReconciliation:applyReconciliation,key:key,readSnapshot:readSnapshot};
  if(root.document){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();}
})(typeof window!=='undefined'?window:globalThis);
