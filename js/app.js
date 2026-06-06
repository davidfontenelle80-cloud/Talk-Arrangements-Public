/**
 * app.js — Talk Arrangements
 * Public talk schedule manager for Spanish-speaking JW congregation.
 */

var APP_KEY="jw-talk-arrangements-v1";
    var MEs=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    var MEn=["January","February","March","April","May","June","July","August","September","October","November","December"];
    var thisYear=new Date().getFullYear();
    var currentMonth=new Date().getMonth();
    var today=new Date(); today.setHours(0,0,0,0);
    var STATUS=["not-contacted","message-sent","confirmed","needs-follow-up"];

    var T={
      en:{appTitle:"Talk Arrangements",subtitle:"Congregation public talk arrangements",dashboard:"Dashboard",planning:"Planning",congregations:"Congregations",backup:"Backup",import:"Import",reset:"Reset",dashHint:"Current year at a glance — current month highlighted.",addMonth:"Add Month",yearSchedule:"Year schedule",month:"Month",congregation:"Congregation",statusCol:"Status",fixedCol:"Fixed",notContacted:"Not contacted",messageSentStatus:"Message sent",confirmedStatus:"Confirmed",needsFollowUp:"Needs follow-up",followUpDate:"Follow up by",note:"Note",actions:"Actions",speakerContact:"Speaker contact",planningTitle:"Planning for the next 3 years",planningHint:"Use this for future arrangements and fixed recurring notes.",addYear:"Add Year",congTitle:"Congregation list",congHint:"Edit contact information here; dashboard lookups update immediately.",search:"Search congregations or contacts",addCong:"Add",coordinator:"Coordinator",phone:"Phone",email:"Email",currentMonth:"Current month",copied:"Copied",noContact:"Select a congregation row (◎) to see contact options.",call:"Call",text:"Text",mail:"Email",copy:"Copy",total:"Total",sent:"Sent",confirmedCount:"Confirmed",conWho:"With whom",contact:"Contact",deleteConfirm:"Are you sure you want to delete this?",restored:"Starter data restored.",imported:"Backup imported.",saved:"Saved.",exported:"Backup downloaded.",invalidBackup:"This backup file could not be read.",print:"Print",createNextYear:"Next Year",confirmCreateYear:"Archive {year} and create template for {next}?",yearCreated:"{year} schedule created + {prev} archived",templates:"Message template",openSms:"Send SMS",openEmail:"Send Email",copyMsg:"Copy message",whatsapp:"WhatsApp",shareList:"WhatsApp",emailList:"Print list",shareContact:"Share contact",privateData:"Contacts loaded",publicData:"Public version — no contacts",conflictWarnings:"{n} issue(s)",duplicateCong:"{c} scheduled twice within 6 months ({m1} & {m2})",missingFixed:"Fixed congregation not scheduled: {c}",dupMonth:"Month {m} appears more than once",nothingToCopy:"Nothing to copy",settingsTitle:"Settings & Profile",profileName:"Your name",profileCong:"Your congregation",profilePhone:"Your phone (for messages)",privacyNote:"Your data is saved on this device and can sync through cloud backup when enabled.",save:"Save",cancel:"Cancel",goodMorning:"Good morning",goodAfternoon:"Good afternoon",goodEvening:"Good evening",yearChangePrompt:"It is now {year}. Roll over the schedule?",archiveNote:"Previous schedule archived to Planning.",emailSubject:"Congregation list",listCopied:"List copied — paste into your email"},
      es:{appTitle:"Arreglos de Discursos",subtitle:"Arreglos de discursos publicos de la congregacion",dashboard:"Tablero",planning:"Planificacion",congregations:"Congregaciones",backup:"Respaldo",import:"Importar",reset:"Restaurar",dashHint:"El ano actual con el mes presente resaltado.",addMonth:"Anadir mes",yearSchedule:"Programa del ano",month:"Mes",congregation:"Congregacion",statusCol:"Estado",fixedCol:"Fijo",notContacted:"Sin contactar",messageSentStatus:"Mensaje enviado",confirmedStatus:"Confirmado",needsFollowUp:"Necesita seguimiento",followUpDate:"Seguimiento antes de",note:"Nota",actions:"Acciones",speakerContact:"Contacto del discursante",planningTitle:"Planificacion de los proximos 3 anos",planningHint:"Use esta seccion para arreglos futuros y notas fijas.",addYear:"Anadir ano",congTitle:"Lista de congregaciones",congHint:"Edite los contactos aqui; el tablero se actualiza al instante.",search:"Buscar congregaciones o contactos",addCong:"Anadir",coordinator:"Coordinador",phone:"Telefono",email:"Correo",currentMonth:"Mes actual",copied:"Copiado",noContact:"Seleccione una fila (◎) para ver opciones de contacto.",call:"Llamar",text:"Texto",mail:"Correo",copy:"Copiar",total:"Total",sent:"Enviados",confirmedCount:"Confirmados",conWho:"Con quien",contact:"Contacto",deleteConfirm:"¿Desea eliminar esta fila?",restored:"Datos iniciales restaurados.",imported:"Respaldo importado.",saved:"Guardado.",exported:"Respaldo descargado.",invalidBackup:"No se pudo leer este respaldo.",print:"Imprimir",createNextYear:"Proximo Ano",confirmCreateYear:"Archivar {year} y crear plantilla para {next}?",yearCreated:"Programa {year} creado + {prev} archivado",templates:"Plantilla de mensaje",openSms:"Enviar SMS",openEmail:"Enviar correo",copyMsg:"Copiar mensaje",whatsapp:"WhatsApp",shareList:"WhatsApp",emailList:"Imprimir lista",shareContact:"Compartir",privateData:"Contactos cargados",publicData:"Version publica — sin contactos",conflictWarnings:"{n} problema(s)",duplicateCong:"{c} programada dos veces en 6 meses ({m1} y {m2})",missingFixed:"Congregacion fija sin programar: {c}",dupMonth:"El mes {m} aparece mas de una vez",nothingToCopy:"Sin datos para copiar",settingsTitle:"Configuracion y Perfil",profileName:"Tu nombre",profileCong:"Tu congregacion",profilePhone:"Tu telefono (para mensajes)",privacyNote:"Tus datos se guardan en este dispositivo y pueden sincronizarse por respaldo en la nube cuando esta activo.",save:"Guardar",cancel:"Cancelar",goodMorning:"Buenos dias",goodAfternoon:"Buenas tardes",goodEvening:"Buenas noches",yearChangePrompt:"Ya es {year}. Cambiar el programa al nuevo ano?",archiveNote:"Programa anterior archivado en Planificacion.",emailSubject:"Lista de congregaciones",listCopied:"Lista copiada — pégala en tu correo"}
    };

    var starter={
      version:1,language:"es",theme:"dark",selectedMonth:currentMonth,currentYear:thisYear,
      profile:{name:"",congregation:"",phone:""},
      schedule:[[0,"Cedar Spanish Branford",""],[1,"West Danbury Spanish",""],[2,"Woodin Hill Spanish - Hamden CT",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"Lakewood Spanish Waterbury",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Shelton",""],[7,"New London Spanish","Arreglo fijo"],[8,"South Spanish New Britain",""],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Bristol Spanish",""],[11,"Bridgeport West Spanish",""]].map(function(r){return{id:crypto.randomUUID(),month:r[0],congregation:r[1],status:"not-contacted",followUpDate:"",note:r[2]};}),
      planning:[
        {year:2027,rows:[[0,"Highland Spanish Waterbury",""],[1,"Parker Spanish - Massachusetts",""],[2,"Shelton",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"East Danbury Spanish",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Cedar Spanish Branford",""],[7,"New London Spanish","Arreglo fijo"],[8,"North Spanish New Britain","Arreglo fijo"],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Lakewood Spanish Waterbury",""],[11,"Bristol Spanish",""]]},
        {year:2028,rows:[[0,"Highland Spanish Waterbury",""],[1,"West Danbury Spanish",""],[2,"Cedar Spanish Branford",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"East Danbury Spanish",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Bridgeport West Spanish",""],[7,"New London Spanish","Arreglo fijo"],[8,"North Spanish New Britain","Arreglo fijo"],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Feeding Hills",""],[11,"South Spanish Hartford",""]]},
        {year:2029,rows:Array.from({length:12},function(_,i){return[i,"",""];})}
      ].map(function(y){return{year:y.year,rows:y.rows.map(function(r){return{id:crypto.randomUUID(),month:r[0],congregation:r[1],contact:"",confirmed:false,note:r[2]};})}}),
      congregations:["Bridgeport West Spanish","Bristol Spanish","Cedar Spanish Branford","Central Spanish New Haven","East Danbury Spanish","East Hartford","East Spanish Bridgeport","East Spanish Hartford","East Spanish Norwalk","Feeding Hills","Hartford Norte","Highland Spanish Waterbury","Lakewood Spanish Waterbury","Leominster MA","Meriden Spanish","New London Spanish","North Spanish Hartford","North Spanish New Britain","Parker Spanish - Massachusetts","Shelton","South Spanish Danbury","South Spanish Hartford","South Spanish Holyoke","South Spanish New Britain","South Springfield Spanish","Stamford","Torringford Spanish","West Danbury Spanish","Woodin Hill Spanish - Hamden CT","Local"].map(function(n){return{id:crypto.randomUUID(),name:n,coordinator:"",phone:"",email:"",note:"",isFixed:false};})
    };

    // Preset fixed congregations in starter
    var FIXED_NAMES=["South Springfield Spanish","Torringford Spanish","Meriden Spanish","New London Spanish","North Spanish New Britain"];
    starter.congregations.forEach(function(c){if(FIXED_NAMES.indexOf(c.name)!==-1)c.isFixed=true;});

    function migrateRow(row){
      if(!row.status){if(row.confirmed)row.status="confirmed";else if(row.messageSent)row.status="message-sent";else row.status="not-contacted";}
      if(row.followUpDate===undefined)row.followUpDate="";
      return row;
    }
    function migrateCong(c){if(c.isFixed===undefined)c.isFixed=false;return c;}

    function cloneStarter(){return JSON.parse(JSON.stringify(starter));}
    function loadState(){
      var saved=localStorage.getItem(APP_KEY);
      if(!saved){var s=cloneStarter();s.schedule=s.schedule.map(migrateRow);return s;}
      try{
        var parsed=JSON.parse(saved);
        var merged=Object.assign(cloneStarter(),parsed);
        if(!merged.profile)merged.profile={name:"",congregation:"",phone:""};
        merged.schedule=merged.schedule.map(migrateRow);
        merged.congregations=merged.congregations.map(migrateCong);
        if(Array.isArray(merged.planning))merged.planning.forEach(function(y){if(Array.isArray(y.rows))y.rows.forEach(function(r){if(r.contact===undefined)r.contact="";if(r.confirmed===undefined)r.confirmed=false;});});
        return merged;
      }catch(e){var s2=cloneStarter();s2.schedule=s2.schedule.map(migrateRow);return s2;}
    }
    function saveState(){state.updatedAt=new Date().toISOString();localStorage.setItem(APP_KEY,JSON.stringify(state));}
    var state=loadState();

    // ── i18n ────────────────────────────────────────────────────────────────────
    function tt(k){return(T[state.language]||T.en)[k]||T.en[k]||k;}
    function tf(k,v){var s=tt(k);if(v)Object.keys(v).forEach(function(i){s=s.replace("{"+i+"}",v[i]);});return s;}
    function months(){return state.language==="es"?MEs:MEn;}
    function statusLabel(s){return tt({"not-contacted":"notContacted","message-sent":"messageSentStatus","confirmed":"confirmedStatus","needs-follow-up":"needsFollowUp"}[s]||"notContacted");}`r`n    function resolvePaintTheme(){`r`n      var mode=state.theme||"dark";`r`n      if(mode==="system"){`r`n        try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}catch(e){return "dark";}`r`n      }`r`n      return mode==="light"?"light":"dark";`r`n    }

    // ── Utilities ────────────────────────────────────────────────────────────────
    function norm(v){return String(v||"").toLowerCase().replace(/\s+/g," ").trim();}
    function findCong(name){var k=norm(name).replace("newlondon","new london");return state.congregations.find(function(c){return norm(c.name).replace("newlondon","new london")===k;});}
    function fixedCongs(){return state.congregations.filter(function(c){return c.isFixed;});}
    function congOpts(sel){
      sel=sel||"";
      var names=Array.from(new Set(state.congregations.map(function(c){return c.name;}).filter(Boolean))).sort(function(a,b){return a.localeCompare(b);});
      if(sel&&names.indexOf(sel)===-1)names.unshift(sel);
      return '<option value=""></option>'+names.map(function(n){return'<option'+(n===sel?' selected':'')+'>'+esc(n)+'</option>';}).join("");
    }
    function esc(v){v=String(v==null?"":v);return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
    function telH(p){var c=String(p||"").replace(/[^\d+]/g,"");return c&&c.toUpperCase()!=="N/A"?"tel:"+c:"";}
    function smsH(p){var c=String(p||"").replace(/[^\d+]/g,"");return c&&c.toUpperCase()!=="N/A"?"sms:"+c:"";}
    function waH(p,txt){var c=String(p||"").replace(/[^\d+]/g,"");return(c?"https://wa.me/"+c:"https://wa.me/")+"?text="+encodeURIComponent(txt);}
    function mailH(email,cong,body){
      if(!email||String(email).toUpperCase()==="N/A")return"";
      var subj=encodeURIComponent(state.language==="es"?"Arreglo de discurso publico":"Public talk arrangement");
      var b=encodeURIComponent(body||(state.language==="es"?"Saludos,\n\nQueria comunicarme sobre el arreglo con "+(cong||"su congregacion")+".":" Hello,\n\nI wanted to reach out about the arrangement with "+(cong||"your congregation")+"."));
      return"https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(email)+"&su="+subj+"&body="+b;
    }
    function fuClass(d){if(!d)return"";var diff=(new Date(d+"T00:00:00")-today)/86400000;return diff<0?"fu-overdue":diff<=7?"fu-soon":"";}
    function fuCell(d){var c=fuClass(d);return c==="fu-overdue"?"followup-overdue":c==="fu-soon"?"followup-soon":"";}

    // ── Message template ─────────────────────────────────────────────────────────
    function buildTmpl(row,congName){
      var m=months()[row.month]||"";
      var p=state.profile||{};
      if(state.language==="es"){
        var from=p.name?"Le escribe "+p.name+(p.congregation?" de la Congregacion "+p.congregation:"")+"." :"";
        return "Saludos hermano/a, "+from+" Le contactamos para confirmar el arreglo del discurso publico del mes de "+m+" con la congregacion "+congName+". Por favor confirme su disponibilidad. Gracias."+(p.name?"\n\n"+p.name:"");
      }
      var from2=p.name?"I am "+p.name+(p.congregation?" from the "+p.congregation+" Congregation":"")+".":" ";
      return "Hello, "+from2+" I am reaching out to confirm the public talk arrangement for "+m+" with the "+congName+" congregation. Please confirm your availability. Thank you."+(p.name?"\n\n"+p.name:"");
    }

    // ── Greeting ──────────────────────────────────────────────────────────────────
    function renderGreeting(){
      var el=document.getElementById("greeting");
      var p=state.profile||{};
      if(!p.name){el.textContent="";return;}
      var h=new Date().getHours();
      var greet=h<12?tt("goodMorning"):h<18?tt("goodAfternoon"):tt("goodEvening");
      el.textContent=greet+", "+p.name+" \uD83D\uDC4B";
    }

    // ── Warnings ──────────────────────────────────────────────────────────────────
    var bannerDismissed=false;
    function computeWarnings(){
      var w=[];
      var sched=state.schedule.slice().sort(function(a,b){return+a.month-+b.month;});
      // Duplicate congregation within 6 months
      for(var i=0;i<sched.length;i++){
        if(!sched[i].congregation)continue;
        for(var j=i+1;j<sched.length;j++){
          if(!sched[j].congregation)continue;
          if(norm(sched[i].congregation)===norm(sched[j].congregation)&&Math.abs(+sched[j].month-+sched[i].month)<=6)
            w.push(tf("duplicateCong",{c:sched[i].congregation,m1:months()[sched[i].month],m2:months()[sched[j].month]}));
        }
      }
      // Duplicate months
      var mCounts={};
      sched.forEach(function(r){var m=+r.month;mCounts[m]=(mCounts[m]||0)+1;});
      Object.keys(mCounts).forEach(function(m){if(mCounts[m]>1)w.push(tf("dupMonth",{m:months()[+m]}));});
      // Missing fixed congregations
      fixedCongs().forEach(function(fc){
        if(!state.schedule.some(function(r){return norm(r.congregation)===norm(fc.name);}))
          w.push(tf("missingFixed",{c:fc.name}));
      });
      return w;
    }
    function renderConflicts(){
      var w=computeWarnings();
      var banner=document.getElementById("conflictBanner");
      var body=document.getElementById("conflictBody");
      var lbl=document.getElementById("conflictLabel");
      if(!w.length||bannerDismissed){banner.style.display="none";return;}
      banner.style.display="";
      lbl.textContent="\u26A0\uFE0F "+tf("conflictWarnings",{n:w.length});
      body.innerHTML=w.map(function(x){return'<div class="conflict-item">&bull; '+esc(x)+'</div>';}).join("");
    }

    // ── Data badge ────────────────────────────────────────────────────────────────
    function renderDataBadge(){
      var badge=document.getElementById("dataBadge");
      var n=state.congregations.filter(function(c){return(c.phone&&c.phone.trim())||(c.email&&c.email.trim());}).length;
      badge.className="data-badge "+(n>5?"badge-private":"badge-public");
      badge.textContent=(n>5?"\uD83D\uDCCB ":"\u26A0 ")+tt(n>5?"privateData":"publicData");
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────────
    function renderDashboard(){
      var sorted=state.schedule.slice().sort(function(a,b){return+a.month-+b.month;});
      var tbody=document.getElementById("dashboardRows");
      tbody.innerHTML=sorted.map(function(row){
        var fu=fuClass(row.followUpDate),futd=fuCell(row.followUpDate);
        var fc=findCong(row.congregation);
        var isFixed=fc&&fc.isFixed;
        var fixedBadge=isFixed?'<span class="fixed-badge">FIJO</span>':"";
        var mOpts=months().map(function(m,i){return'<option value="'+i+'"'+(+row.month===i?' selected':'')+'>'+m+'</option>';}).join("");
        var sOpts=STATUS.map(function(s){return'<option value="'+s+'"'+(row.status===s?' selected':'')+'>'+statusLabel(s)+'</option>';}).join("");
        return'<tr class="'+(+row.month===currentMonth?'current':'')+'" data-id="'+row.id+'">'+
          '<td><select data-field="month">'+mOpts+'</select></td>'+
          '<td><div style="display:flex;align-items:center;gap:4px;"><select data-field="congregation" style="flex:1">'+congOpts(row.congregation)+'</select>'+fixedBadge+'</div></td>'+
          '<td><select data-field="status" class="status-select s-'+(row.status||"not-contacted")+'">'+sOpts+'</select></td>'+
          '<td class="'+futd+'"><input type="date" data-field="followUpDate" value="'+esc(row.followUpDate||"")+'" class="'+fu+'" style="min-width:130px;"></td>'+
          '<td><textarea data-field="note" rows="1">'+esc(row.note||"")+'</textarea></td>'+
          '<td class="no-print" style="white-space:nowrap"><button class="icon-btn" data-action="select" title="'+tt("speakerContact")+'">&#9678;</button> <button class="icon-btn danger" data-action="delete">&#215;</button></td>'+
        '</tr>';
      }).join("");
      var sel=state.schedule.find(function(r){return+r.month===+state.selectedMonth;})||state.schedule.find(function(r){return+r.month===currentMonth;})||state.schedule[0];
      renderContact(sel);renderKpis();renderConflicts();renderDataBadge();
    }

    // ── Contact card ──────────────────────────────────────────────────────────────
    function renderContact(row){
      var card=document.getElementById("contactCard");
      document.getElementById("selectedMonthLabel").textContent=row?months()[row.month]:"";
      if(!row||!row.congregation){card.innerHTML='<div class="empty">'+tt("noContact")+'</div>';return;}
      var c=findCong(row.congregation);
      if(!c){card.innerHTML='<div class="empty">'+tt("noContact")+'</div>';return;}
      var call=telH(c.phone),sms=smsH(c.phone),msg=buildTmpl(row,c.name);
      var mailBase=mailH(c.email,c.name,""),mailFull=mailH(c.email,c.name,msg);
      var smsBody=sms?sms+"&body="+encodeURIComponent(msg):"";
      var info=[c.name,c.coordinator?"Coord: "+c.coordinator:"",c.phone||"",c.email||""].filter(Boolean).join("\n");
      function lbtn(lbl,href,off){return off||!href?'<button disabled>'+lbl+'</button>':'<a href="'+esc(href)+'" class="link-btn" target="_blank" rel="noopener">'+lbl+'</a>';}
      function wbtn(lbl,href){return'<button data-wa-href="'+esc(href)+'">'+lbl+'</button>';}
      var fixedTag=c.isFixed?'<span class="fixed-badge">FIJO</span>':"";
      card.innerHTML=
        '<div><div class="contact-name">'+esc(c.name)+fixedTag+'</div><div class="muted">'+esc(c.coordinator||"")+'</div></div>'+
        '<div class="contact-meta"><div>'+tt("phone")+': <strong>'+esc(c.phone||"—")+'</strong></div><div>'+tt("email")+': <strong>'+esc(c.email||"—")+'</strong></div>'+(c.note?'<div>'+tt("note")+': '+esc(c.note)+'</div>':'')+'</div>'+
        '<div class="action-row no-print">'+lbtn("&#9742; "+tt("call"),call,!call)+lbtn("&#128172; "+tt("text"),sms,!sms)+lbtn("&#9993; "+tt("mail"),mailBase,!mailBase)+'<button data-copy="'+esc(c.phone||"")+'">&#10697; '+tt("phone")+'</button><button data-copy="'+esc(c.email||"")+'">&#10697; '+tt("email")+'</button>'+'<button class="share-contact-btn" data-share-info="'+esc(info)+'">&#129302; '+tt("shareContact")+'</button>'+'</div>'+
        '<div class="no-print"><div class="template-label">'+tt("templates")+'</div><div class="template-box">'+esc(msg)+'</div>'+
        '<div class="action-row" style="margin-top:8px">'+(smsBody?lbtn("&#128241; "+tt("openSms"),smsBody,false):"")+
        (mailFull?lbtn("&#9993; "+tt("openEmail"),mailFull,false):"")+
        '<button data-copy="'+esc(msg)+'">&#10697; '+tt("copyMsg")+'</button>'+wbtn("&#129302; "+tt("whatsapp"),waH(c.phone,msg))+'</div></div>';
    }

    function renderKpis(){
      var tot=state.schedule.length,sent=state.schedule.filter(function(r){return r.status==="message-sent";}).length,conf=state.schedule.filter(function(r){return r.status==="confirmed";}).length;
      document.getElementById("kpiBox").innerHTML=[[tot,tt("total")],[sent,tt("sent")],[conf,tt("confirmedCount")]].map(function(x){return'<div class="kpi"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join("");
    }

    // ── Planning ──────────────────────────────────────────────────────────────────
    function renderPlanning(){
      var host=document.getElementById("planningTables");
      host.innerHTML=state.planning.map(function(year){
        var rows=year.rows.map(function(row){
          var mOpts=months().map(function(m,i){return'<option value="'+i+'"'+(+row.month===i?' selected':'')+'>'+m+'</option>';}).join("");
          return'<tr data-id="'+row.id+'">'+
            '<td><select data-field="month">'+mOpts+'</select></td>'+
            '<td><select data-field="congregation">'+congOpts(row.congregation)+'</select></td>'+
            '<td><input data-field="contact" value="'+esc(row.contact||lookupCoord(row.congregation))+'"></td>'+
            '<td><input data-field="confirmed" type="checkbox"'+(row.confirmed?' checked':'')+"></td>"+
            '<td><input data-field="note" value="'+esc(row.note||"")+'"></td>'+
          '</tr>';
        }).join("");
        return'<div class="panel planning-year" data-year="'+year.year+'">'+
          '<div class="panel-title"><strong>'+(state.language==="es"?"Arreglos para":"Arrangements for")+' '+year.year+'</strong><button class="icon-btn danger" data-action="delete-year">&#215;</button></div>'+
          '<div class="table-wrap"><table>'+
            '<thead><tr><th>'+tt("month")+'</th><th>'+tt("conWho")+'</th><th>'+tt("contact")+'</th><th>'+tt("confirmedStatus")+'</th><th>'+tt("note")+'</th></tr></thead>'+
            '<tbody>'+rows+'</tbody></table></div></div>';
      }).join("");
    }
    function lookupCoord(name){var c=findCong(name);return c?c.coordinator:"";}

    // ── Congregations ─────────────────────────────────────────────────────────────
    function renderCongregations(){
      var filter=norm(document.getElementById("searchBox").value);
      var rows=state.congregations.filter(function(c){return!filter||[c.name,c.coordinator,c.phone,c.email,c.note].some(function(v){return norm(v).includes(filter);});}).sort(function(a,b){return a.name.localeCompare(b.name);});
      document.getElementById("congregationRows").innerHTML=rows.map(function(c){
        function fc(field,val){return'<td><div class="field-cell"><input data-field="'+field+'" value="'+esc(val)+'"><button class="copy-field-btn" data-copy="'+esc(val)+'" title="'+tt("copy")+'">&#10697;</button></div></td>';}
        return'<tr data-id="'+c.id+'">'+
          fc("name",c.name)+
          '<td style="text-align:center"><input data-field="isFixed" type="checkbox"'+(c.isFixed?' checked':'')+' title="'+tt("fixedCol")+'" style="width:auto;transform:scale(1.3);cursor:pointer;"></td>'+
          fc("coordinator",c.coordinator)+fc("phone",c.phone)+fc("email",c.email)+
          '<td><input data-field="note" value="'+esc(c.note)+'"></td>'+
          '<td style="white-space:nowrap"><button class="icon-btn danger" data-action="delete">&#215;</button></td>'+
        '</tr>';
      }).join("")||'<tr><td colspan="7"><div class="empty">'+tt("noContact")+'</div></td></tr>';
    }

    // ── Toast ──────────────────────────────────────────────────────────────────────
    function toast(msg){var el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(function(){el.classList.remove("show");},2600);}

    // ── renderAll ──────────────────────────────────────────────────────────────────
    function renderAll(){
      document.documentElement.dataset.theme=resolvePaintTheme();`r`n      document.body.dataset.theme=resolvePaintTheme();
      document.documentElement.lang=state.language;
      document.querySelectorAll("[data-i18n]").forEach(function(el){el.textContent=tt(el.dataset.i18n);});
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el){el.placeholder=tt(el.dataset.i18nPlaceholder);});
      document.getElementById("subtitle").textContent=tt("subtitle");
      document.getElementById("dashboardTitle").textContent=(state.language==="es"?"Arreglos de discursos ":"Talk arrangements ")+state.currentYear;
      document.getElementById("currentMonthPill").textContent=tt("currentMonth")+": "+months()[currentMonth];
      document.getElementById("printHeading").textContent=(state.language==="es"?"Arreglos de discursos ":"Talk arrangements ")+state.currentYear;
      document.getElementById("printDate").textContent=new Date().toLocaleDateString();
      document.querySelectorAll("[data-lang]").forEach(function(b){b.classList.toggle("active",b.dataset.lang===state.language);});
      document.querySelectorAll("[data-theme-pick]").forEach(function(b){b.classList.toggle("active",b.dataset.themePick===state.theme);});
      renderGreeting();renderDashboard();renderPlanning();renderCongregations();
    }

    // ── Rollover ──────────────────────────────────────────────────────────────────
    function rolloverYear(){
      var next=state.currentYear+1;
      var prev=state.currentYear;
      showConfirm(tf("confirmCreateYear",{year:prev,next:next}),function(){
      // Archive current schedule to planning
      if(!state.planning.some(function(y){return+y.year===+prev;})){
        state.planning.unshift({year:prev,rows:state.schedule.slice().sort(function(a,b){return+a.month-+b.month;}).map(function(row){return{id:crypto.randomUUID(),month:row.month,congregation:row.congregation,contact:lookupCoord(row.congregation),confirmed:row.status==="confirmed",note:row.note};})});
      }
      // Build new schedule from isFixed congregations
      var fm={};
      state.schedule.forEach(function(row){
        var fc2=findCong(row.congregation);
        if(fc2&&fc2.isFixed)fm[+row.month]=row.congregation;
      });
      state.schedule=Array.from({length:12},function(_,i){return{id:crypto.randomUUID(),month:i,congregation:fm[i]||"",status:"not-contacted",followUpDate:"",note:fm[i]?(state.language==="es"?"Arreglo fijo":"Fixed arrangement"):""};});
      state.currentYear=next;state.selectedMonth=currentMonth;
      bannerDismissed=false;
      saveState();renderAll();
      toast(tf("yearCreated",{year:next,prev:prev})+" \u2713");
      });
    }

    // ── Export ────────────────────────────────────────────────────────────────────
    function downloadBackup(){
      var blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
      var url=URL.createObjectURL(blob);
      var a=document.createElement("a");a.href=url;
      a.download="talk-arrangements-backup-"+new Date().toISOString().slice(0,10)+".json";
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(function(){URL.revokeObjectURL(url);},2000);
      toast(tt("exported"));
    }

    // ── Share congregation list ────────────────────────────────────────────────────
    function buildCongList(sep){
      return state.congregations.filter(function(c){return c.name;}).sort(function(a,b){return a.name.localeCompare(b.name);}).map(function(c){
        var l=(c.isFixed?"[FIJO] ":"")+c.name;
        if(c.coordinator)l+=sep+tt("coordinator")+": "+c.coordinator;
        if(c.phone)l+=sep+tt("phone")+": "+c.phone;
        if(c.email)l+=sep+tt("email")+": "+c.email;
        return l;
      }).join("\n\n");
    }

    // ── Settings modal ─────────────────────────────────────────────────────────────
    function openSettings(){
      var p=state.profile||{};
      document.getElementById("profileNameInput").value=p.name||"";
      document.getElementById("profileCongInput").value=p.congregation||"";
      document.getElementById("profilePhoneInput").value=p.phone||"";
      document.getElementById("settingsModal").classList.add("open");
    }
    function closeSettings(){document.getElementById("settingsModal").classList.remove("open");}
    function saveSettings(){
      if(!state.profile)state.profile={};
      state.profile.name=document.getElementById("profileNameInput").value.trim();
      state.profile.congregation=document.getElementById("profileCongInput").value.trim();
      state.profile.phone=document.getElementById("profilePhoneInput").value.trim();
      saveState();closeSettings();renderGreeting();toast(tt("saved"));
    }

    // ── Custom confirm dialog ─────────────────────────────────────────────
    function showConfirm(msg, onOk, onCancel) {
      document.getElementById("confirmMsg").textContent = msg;
      document.getElementById("confirmOkBtn").textContent = state.language==="es"?"Confirmar":"Confirm";
      document.getElementById("confirmCancelBtn").textContent = tt("cancel");
      var modal = document.getElementById("confirmModal");
      modal.classList.add("open");
      document.getElementById("confirmOkBtn").onclick = function(){
        modal.classList.remove("open");
        if(onOk) onOk();
      };
      document.getElementById("confirmCancelBtn").onclick = function(){
        modal.classList.remove("open");
        if(onCancel) onCancel();
      };
    }

    // ── Wire events ────────────────────────────────────────────────────────────────
    function wireEvents(){
      // Tabs
      document.querySelectorAll("[data-tab]").forEach(function(btn){btn.addEventListener("click",function(){document.querySelectorAll("[data-tab]").forEach(function(b){b.classList.remove("active");});btn.classList.add("active");document.querySelectorAll("main > section").forEach(function(s){s.hidden=s.id!==btn.dataset.tab;});});});
      // Lang / Theme
      document.querySelectorAll("[data-lang]").forEach(function(btn){btn.addEventListener("click",function(){state.language=btn.dataset.lang;saveState();renderAll();});});
      document.querySelectorAll("[data-theme-pick]").forEach(function(btn){btn.addEventListener("click",function(){state.theme=btn.dataset.themePick;saveState();renderAll();});});
      // Settings
      document.getElementById("settingsBtn").addEventListener("click",openSettings);
      document.getElementById("saveSettingsBtn").addEventListener("click",saveSettings);
      document.getElementById("closeSettingsBtn").addEventListener("click",closeSettings);
      document.getElementById("settingsModal").addEventListener("click",function(e){if(e.target===this)closeSettings();});
      // Dashboard input
      document.getElementById("dashboardRows").addEventListener("input",function(e){
        var tr=e.target.closest("tr");if(!tr)return;
        var row=state.schedule.find(function(r){return r.id===tr.dataset.id;});if(!row)return;
        var field=e.target.dataset.field;
        var val=e.target.type==="checkbox"?e.target.checked:field==="month"?+e.target.value:e.target.value;
        row[field]=val;saveState();
        if(field==="note")return;
        if(field==="followUpDate"){e.target.className=fuClass(val);e.target.closest("td").className=fuCell(val);return;}
        if(field==="status"){e.target.className="status-select s-"+val;renderKpis();return;}
        if(field==="congregation"){state.selectedMonth=row.month;renderContact(state.schedule.find(function(r){return+r.month===+state.selectedMonth;}));renderKpis();renderConflicts();return;}
        if(field==="month"){state.selectedMonth=val;renderDashboard();return;}
        renderDashboard();
      });
      // Dashboard click
      document.getElementById("dashboardRows").addEventListener("click",function(e){
        var tr=e.target.closest("tr");if(!tr)return;
        var row=state.schedule.find(function(r){return r.id===tr.dataset.id;});
        if(e.target.dataset.action==="select"&&row){state.selectedMonth=row.month;saveState();renderContact(row);document.querySelectorAll("#dashboardRows tr").forEach(function(r){r.style.outline="";});tr.style.outline="2px solid var(--accent)";}
        if(e.target.dataset.action==="delete"){var _id=tr.dataset.id;showConfirm(tt("deleteConfirm"),function(){state.schedule=state.schedule.filter(function(r){return r.id!==_id;});saveState();bannerDismissed=false;renderDashboard();});}
      });
      // Planning input
      document.getElementById("planningTables").addEventListener("input",function(e){
        var panel=e.target.closest("[data-year]"),tr=e.target.closest("tr");if(!panel||!tr)return;
        var year=state.planning.find(function(y){return String(y.year)===panel.dataset.year;});
        var row=year&&year.rows.find(function(r){return r.id===tr.dataset.id;});if(!row)return;
        var field=e.target.dataset.field;
        row[field]=e.target.type==="checkbox"?e.target.checked:field==="month"?+e.target.value:e.target.value;
        if(field==="congregation"&&!row.contact)row.contact=lookupCoord(row.congregation);
        saveState();
      });
      document.getElementById("planningTables").addEventListener("click",function(e){
        var panel=e.target.closest("[data-year]");
        if(e.target.dataset.action==="delete-year"&&panel){var _yr=panel.dataset.year;showConfirm(tt("deleteConfirm"),function(){state.planning=state.planning.filter(function(y){return String(y.year)!==_yr;});saveState();renderPlanning();});}
      });
      // Congregations input
      document.getElementById("congregationRows").addEventListener("input",function(e){
        var tr=e.target.closest("tr"),c=state.congregations.find(function(i){return i.id===(tr&&tr.dataset.id);});if(!c)return;
        var field=e.target.dataset.field;
        if(e.target.type==="checkbox"){c[field]=e.target.checked;}else{c[field]=e.target.value;}
        saveState();renderDataBadge();
        if(field==="isFixed"){renderConflicts();return;}
        var cb=e.target.nextElementSibling;if(cb&&cb.dataset.copy!==undefined)cb.dataset.copy=e.target.value;
      });
      document.getElementById("congregationRows").addEventListener("click",function(e){
        var tr=e.target.closest("tr");
        if(e.target.dataset.action==="delete"&&tr){var _cid=tr.dataset.id;showConfirm(tt("deleteConfirm"),function(){state.congregations=state.congregations.filter(function(c){return c.id!==_cid;});saveState();renderCongregations();renderDashboard();});}
      });
      // Delegated link / WA / copy
      document.body.addEventListener("click",function(e){
        if(e.target.dataset.href){location.href=e.target.dataset.href;return;}
        if(e.target.dataset.waHref){window.open(e.target.dataset.waHref,"_blank");return;}
        if(e.target.dataset.shareInfo){if(navigator.share){navigator.share({title:e.target.closest("[class*=contact]")?e.target.closest("[class*=contact]")&&document.getElementById("selectedMonthLabel").textContent:"Contact",text:e.target.dataset.shareInfo}).catch(function(){});}else{navigator.clipboard&&navigator.clipboard.writeText(e.target.dataset.shareInfo).then(function(){toast(tt("copied"));});}return;}
        var txt=e.target.dataset.copy;
        if(txt===undefined)return;
        if(txt===""){toast(tt("nothingToCopy"));return;}
        navigator.clipboard.writeText(txt).then(function(){toast(tt("copied")+": "+txt.slice(0,60));});
      });
      // Search
      document.getElementById("searchBox").addEventListener("input",renderCongregations);
      // Export / Import / Reset
      document.getElementById("exportBtn").addEventListener("click",downloadBackup);
      document.getElementById("importBtn").addEventListener("click",function(){document.getElementById("importFile").click();});
      document.getElementById("importFile").addEventListener("change",function(e){
        var file=e.target.files[0];if(!file)return;
        var reader=new FileReader();
        reader.onload=function(){
          try{
            var imp=JSON.parse(reader.result);
            if(!Array.isArray(imp.congregations)||!Array.isArray(imp.schedule))throw new Error("Invalid");
            state=Object.assign(cloneStarter(),imp);
            if(!state.profile)state.profile={name:"",congregation:"",phone:""};
            state.schedule=state.schedule.map(migrateRow);
            state.congregations=state.congregations.map(migrateCong);
            if(Array.isArray(state.planning))state.planning.forEach(function(y){if(Array.isArray(y.rows))y.rows.forEach(function(r){if(r.contact===undefined)r.contact="";if(r.confirmed===undefined)r.confirmed=false;});});
            saveState();renderAll();toast(tt("imported"));
          }catch(err){toast(tt("invalidBackup"));}
          e.target.value="";
        };
        reader.readAsText(file);
      });
      document.getElementById("resetBtn").addEventListener("click",function(){showConfirm(tt("deleteConfirm"),function(){state=cloneStarter();state.schedule=state.schedule.map(migrateRow);saveState();renderAll();toast(tt("restored"));});});

      // ── Cloud backup ────────────────────────────────────────────────────
      (function(){
        var APP_ID="talk-arrangements";
        var KEYS=["jw-talk-arrangements-v1"];
        // Add cloud backup buttons next to export/import in header
        var importBtn=document.getElementById("importBtn");
        if(importBtn&&window.KHub&&KHub.Firebase&&KHub.Firebase.db){
          var cloudSaveBtn=document.createElement("button");
          cloudSaveBtn.id="cloudSaveBtn";
          cloudSaveBtn.title="Save to Cloud";
          cloudSaveBtn.innerHTML='&#9729; <span data-i18n="backup">Cloud Save</span>';
          cloudSaveBtn.addEventListener("click",function(){
            cloudSaveBtn.disabled=true;
            KHub.CloudBackup.save(APP_ID,KEYS)
              .then(function(){toast("Saved to cloud ☁");})
              .catch(function(e){toast("Cloud save failed");console.error(e);})
              .finally(function(){cloudSaveBtn.disabled=false;});
          });
          importBtn.parentNode.insertBefore(cloudSaveBtn,importBtn.nextSibling);

          var cloudRestoreBtn=document.createElement("button");
          cloudRestoreBtn.id="cloudRestoreBtn";
          cloudRestoreBtn.title="Restore from Cloud";
          cloudRestoreBtn.innerHTML='&#9729; <span>Cloud Restore</span>';
          cloudRestoreBtn.addEventListener("click",function(){
            showConfirm(tt("deleteConfirm"),function(){
              cloudRestoreBtn.disabled=true;
              KHub.CloudBackup.restore(APP_ID,KEYS,null,function(){
                toast("Restored from cloud ☁");setTimeout(function(){location.reload();},800);
              }).catch(function(e){
                var msg=e.message==="no-backup"?"No cloud backup found":"Cloud restore failed";
                toast(msg);cloudRestoreBtn.disabled=false;console.error(e);
              });
            });
          });
          importBtn.parentNode.insertBefore(cloudRestoreBtn,cloudSaveBtn.nextSibling);
        }
      })();
      // ────────────────────────────────────────────────────────────────────

      // Add month
      document.getElementById("addCurrentYear").addEventListener("click",function(){state.schedule.push({id:crypto.randomUUID(),month:currentMonth,congregation:"",status:"not-contacted",followUpDate:"",note:""});saveState();renderDashboard();});
      // Add planning year
      document.getElementById("addPlanningYear").addEventListener("click",function(){
        var next=Math.max.apply(null,state.planning.map(function(y){return+y.year;}).concat([state.currentYear]))+1;
        saveState();renderPlanning();
        toast(next+" "+(state.language==="es"?"anadido \u2713":"added \u2713"));
        setTimeout(function(){var el=document.querySelector('[data-year="'+next+'"]');if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},80);
      });
      // Add congregation
      document.getElementById("addCongregation").addEventListener("click",function(){
        var nid=crypto.randomUUID();state.congregations.push({id:nid,name:"",coordinator:"",phone:"",email:"",note:"",isFixed:false});
        saveState();renderCongregations();
        setTimeout(function(){var r=document.querySelector('#congregationRows tr[data-id="'+nid+'"]');if(r){r.scrollIntoView({behavior:"smooth",block:"nearest"});var inp=r.querySelector("input");if(inp)inp.focus();}},80);
      });
      // Rollover / Print
      document.getElementById("rolloverBtn").addEventListener("click",rolloverYear);
      document.getElementById("printBtn").addEventListener("click",function(){document.getElementById("printTitle").style.display="";window.print();setTimeout(function(){document.getElementById("printTitle").style.display="none";},500);});
      // Share congregation list
      document.getElementById("shareWaBtn").addEventListener("click",function(){window.open("https://wa.me/?text="+encodeURIComponent(buildCongList("\n")),"_blank");});
      document.getElementById("shareEmailBtn").addEventListener("click",function(){window.print();});
      // Conflict banner
      document.getElementById("conflictToggle").addEventListener("click",function(){document.getElementById("conflictBody").classList.toggle("open");});
      document.getElementById("conflictDismiss").addEventListener("click",function(){bannerDismissed=true;document.getElementById("conflictBanner").style.display="none";});
      document.getElementById("conflictLabel").addEventListener("click",function(){document.getElementById("conflictBody").classList.toggle("open");});
    }

    wireEvents();
    renderAll();

    // ── Auto-detect new year on load ───────────────────────────────────────────────
    if(thisYear>state.currentYear){
      setTimeout(function(){
        showConfirm(tf("yearChangePrompt",{year:thisYear}),function(){rolloverYear();});
      },600);
    }

    // Restore the newest cloud state first, then keep saving on close / hide.
    if (window.KHub && KHub.CloudBackup) {
      KHub.CloudBackup.restoreLatestIfNewer('talk-arrangements', ['jw-talk-arrangements-v1'], null, function(){
        location.reload();
      }).finally(function(){
        KHub.CloudBackup.autoSave('talk-arrangements', ['jw-talk-arrangements-v1']);
      });
    }
