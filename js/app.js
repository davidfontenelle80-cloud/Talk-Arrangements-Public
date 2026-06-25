/**
 * app.js â Talk Arrangements
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
      en:{appTitle:"Talk Arrangements",subtitle:"Congregation public talk arrangements",dashboard:"Dashboard",planning:"Planning",congregations:"Congregations",backup:"Backup",import:"Import",reset:"Reset",dashHint:"Current year at a glance â current month highlighted.",addMonth:"Add Month",yearSchedule:"Year schedule",month:"Month",congregation:"Congregation",statusCol:"Status",fixedCol:"Fixed",notContacted:"Not contacted",messageSentStatus:"Message sent",confirmedStatus:"Confirmed",needsFollowUp:"Needs follow-up",followUpDate:"Follow up by",note:"Note",actions:"Actions",speakerContact:"Speaker contact",planningTitle:"Planning for the next 3 years",planningHint:"Use this for future arrangements and fixed recurring notes.",addYear:"Add Year",congTitle:"Congregation list",congHint:"Edit contact information here; dashboard lookups update immediately.",search:"Search congregations or contacts",addCong:"Add",coordinator:"Coordinator",phone:"Phone",email:"Email",currentMonth:"Current month",copied:"Copied",noContact:"Select a congregation row (â) to see contact options.",call:"Call",text:"Text",mail:"Email",copy:"Copy",total:"Total",sent:"Sent",confirmedCount:"Confirmed",conWho:"With whom",contact:"Contact",deleteConfirm:"Are you sure you want to delete this?",restored:"Starter data restored.",imported:"Backup imported.",saved:"Saved.",exported:"Backup downloaded.",invalidBackup:"This backup file could not be read.",print:"Print",createNextYear:"Next Year",confirmCreateYear:"Archive {year} and create template for {next}?",yearCreated:"{year} schedule created + {prev} archived",templates:"Message template",openSms:"Send SMS",openEmail:"Send Email",copyMsg:"Copy message",whatsapp:"WhatsApp",shareList:"WhatsApp",emailList:"Print list",shareContact:"Share contact",privateData:"Contacts loaded",publicData:"Public version â no contacts",conflictWarnings:"{n} issue(s)",duplicateCong:"{c} scheduled twice within 6 months ({m1} & {m2})",missingFixed:"Fixed congregation not scheduled: {c}",dupMonth:"Month {m} appears more than once",nothingToCopy:"Nothing to copy",settingsTitle:"Settings & Profile",profileName:"Your name",profileCong:"Your congregation",profilePhone:"Your phone (for messages)",privacyNote:"Your data is saved on this device and can sync through cloud backup when enabled.",save:"Save",cancel:"Cancel",goodMorning:"Good morning",goodAfternoon:"Good afternoon",goodEvening:"Good evening",yearChangePrompt:"It is now {year}. Roll over the schedule?",archiveNote:"Previous schedule archived to Planning.",emailSubject:"Congregation list",listCopied:"List copied â paste into your email",eventsTitle:"Events",eventsHint:"Manage congregation events",addEvent:"+ Add Event",editEvent:"Edit Event",deleteEvent:"Delete Event",eventTitle:"Title",eventType:"Event type",eventStartDate:"Start date",eventEndDate:"End date",eventAllDay:"All day",eventDescription:"Description",eventNotes:"Notes",eventColor:"Color",eventActive:"Active",noEvents:"No events yet. Tap + Add Event to create one.",confirmDeleteEvent:"Delete this event?"},
      ,eventsTitle:"Eventos",eventsHint:"Administra eventos de la congregacion",addEvent:"+ Agregar evento",editEvent:"Editar evento",deleteEvent:"Eliminar evento",eventTitle:"Titulo",eventType:"Tipo de evento",eventStartDate:"Fecha de inicio",eventEndDate:"Fecha de fin",eventAllDay:"Todo el dia",eventDescription:"Descripcion",eventNotes:"Notas",eventColor:"Color",eventActive:"Activo",noEvents:"Sin eventos aun. Toca + Agregar evento para crear uno.",confirmDeleteEvent:"Eliminar este evento?"es:{appTitle:"Arreglos de Discursos",subtitle:"Arreglos de discursos pÃºblicos de la congregaciÃ³n",dashboard:"Tablero",planning:"PlanificaciÃ³n",congregations:"Congregaciones",backup:"Respaldo",import:"Importar",reset:"Restaurar",dashHint:"El aÃ±o actual con el mes presente resaltado.",addMonth:"AÃ±adir mes",yearSchedule:"Programa del aÃ±o",month:"Mes",congregation:"CongregaciÃ³n",statusCol:"Estado",fixedCol:"Fijo",notContacted:"Sin contactar",messageSentStatus:"Mensaje enviado",confirmedStatus:"Confirmado",needsFollowUp:"Necesita seguimiento",followUpDate:"Seguimiento antes de",note:"Nota",actions:"Acciones",speakerContact:"Contacto del discursante",planningTitle:"PlanificaciÃ³n de los prÃ³ximos 3 aÃ±os",planningHint:"Use esta secciÃ³n para arreglos futuros y notas fijas.",addYear:"AÃ±adir aÃ±o",congTitle:"Lista de congregaciones",congHint:"Edite los contactos aquÃ­; el tablero se actualiza al instante.",search:"Buscar congregaciones o contactos",addCong:"AÃ±adir",coordinator:"Coordinador",phone:"TelÃ©fono",email:"Correo",currentMonth:"Mes actual",copied:"Copiado",noContact:"Seleccione una fila (â) para ver opciones de contacto.",call:"Llamar",text:"Texto",mail:"Correo",copy:"Copiar",total:"Total",sent:"Enviados",confirmedCount:"Confirmados",conWho:"Con quien",contact:"Contacto",deleteConfirm:"Â¿Desea eliminar esta fila?",restored:"Datos iniciales restaurados.",imported:"Respaldo importado.",saved:"Guardado.",exported:"Respaldo descargado.",invalidBackup:"No se pudo leer este respaldo.",print:"Imprimir",createNextYear:"PrÃ³ximo AÃ±o",confirmCreateYear:"Archivar {year} y crear plantilla para {next}?",yearCreated:"Programa {year} creado + {prev} archivado",templates:"Plantilla de mensaje",openSms:"Enviar SMS",openEmail:"Enviar correo",copyMsg:"Copiar mensaje",whatsapp:"WhatsApp",shareList:"WhatsApp",emailList:"Imprimir lista",shareContact:"Compartir",privateData:"Contactos cargados",publicData:"Version publica â sin contactos",conflictWarnings:"{n} problema(s)",duplicateCong:"{c} programada dos veces en 6 meses ({m1} y {m2})",missingFixed:"CongregaciÃ³n fija sin programar: {c}",dupMonth:"El mes {m} aparece mas de una vez",nothingToCopy:"Sin datos para copiar",settingsTitle:"Configuracion y Perfil",profileName:"Tu nombre",profileCong:"Tu congregaciÃ³n",profilePhone:"Tu telÃ©fono (para mensajes)",privacyNote:"Tus datos se guardan en este dispositivo y pueden sincronizarse por respaldo en la nube cuando esta activo.",save:"Guardar",cancel:"Cancelar",goodMorning:"Buenos dias",goodAfternoon:"Buenas tardes",goodEvening:"Buenas noches",yearChangePrompt:"Ya es {year}. Â¿Cambiar el programa al nuevo aÃ±o?",archiveNote:"Programa anterior archivado en PlanificaciÃ³n.",emailSubject:"Lista de congregaciones",listCopied:"Lista copiada â pÃ©gala en tu correo"}
    };

    var starter={
      version:1,language:"es",theme:"dark",selectedMonth:currentMonth,currentYear:thisYear,
      profile:{name:"",congregation:"",phone:""},
      contactPickerYear:null,contactPickerMonth:null,contactPickerIdx:0,treatmentMap:{},contactNameFormat:"none",
      schedule:[[0,"Cedar Spanish Branford",""],[1,"West Danbury Spanish",""],[2,"Woodin Hill Spanish - Hamden CT",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"Lakewood Spanish Waterbury",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Shelton",""],[7,"New London Spanish","Arreglo fijo"],[8,"South Spanish New Britain",""],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Bristol Spanish",""],[11,"Bridgeport West Spanish",""]].map(function(r){return{id:crypto.randomUUID(),month:r[0],congregation:r[1],status:"not-contacted",followUpDate:"",note:r[2]};}),
      planning:[
        {year:2027,rows:[[0,"Highland Spanish Waterbury",""],[1,"Parker Spanish - Massachusetts",""],[2,"Shelton",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"East Danbury Spanish",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Cedar Spanish Branford",""],[7,"New London Spanish","Arreglo fijo"],[8,"North Spanish New Britain","Arreglo fijo"],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Lakewood Spanish Waterbury",""],[11,"Bristol Spanish",""]]},
        {year:2028,rows:[[0,"Highland Spanish Waterbury",""],[1,"West Danbury Spanish",""],[2,"Cedar Spanish Branford",""],[3,"South Springfield Spanish","Arreglo fijo"],[4,"East Danbury Spanish",""],[5,"Torringford Spanish","Arreglo fijo"],[6,"Bridgeport West Spanish",""],[7,"New London Spanish","Arreglo fijo"],[8,"North Spanish New Britain","Arreglo fijo"],[9,"Meriden Spanish","Arreglo fijo, hasta 2029"],[10,"Feeding Hills",""],[11,"South Spanish Hartford",""]]},
        {year:2029,rows:Array.from({length:12},function(_,i){return[i,"",""];})}
      ].map(function(y){return{year:y.year,rows:y.rows.map(function(r){return{id:crypto.randomUUID(),month:r[0],congregation:r[1],contact:"",confirmed:false,note:r[2]};})}}),
      congregations:["Bridgeport West Spanish","Bristol Spanish","Cedar Spanish Branford","Central Spanish New Haven","East Danbury Spanish","East Hartford","East Spanish Bridgeport","East Spanish Hartford","East Spanish Norwalk","Feeding Hills","Hartford Norte","Highland Spanish Waterbury","Lakewood Spanish Waterbury","Leominster MA","Meriden Spanish","New London Spanish","North Spanish Hartford","North Spanish New Britain","Parker Spanish - Massachusetts","Shelton","South Spanish Danbury","South Spanish Hartford","South Spanish Holyoke","South Spanish New Britain","South Springfield Spanish","Stamford","Torringford Spanish","West Danbury Spanish","Woodin Hill Spanish - Hamden CT","Local"].map(function(n){return{id:crypto.randomUUID(),name:n,coordinator:"",phone:"",email:"",note:"",isFixed:false};}),
      taEvents:[]
    };

    // Preset fixed congregations in starter
    
    // ── Event Types ──────────────────────────────────────────────────────────────
    var EVENT_TYPES=[
      {id:'circuit-overseer',label:{en:'Circuit Overseer Visit',es:'Visita del Superintendente'},icon:'👔',color:'#6366f1'},
      {id:'assembly',label:{en:'Assembly',es:'Asamblea'},icon:'🏟️',color:'#10b981'},
      {id:'convention',label:{en:'Convention',es:'Convención'},icon:'🌐',color:'#3b82f6'},
      {id:'special-talk',label:{en:'Special Talk',es:'Discurso Especial'},icon:'🎤',color:'#f59e0b'},
      {id:'memorial',label:{en:'Memorial',es:'Conmemoración'},icon:'🕯️',color:'#8b5cf6'},
      {id:'holiday-blackout',label:{en:'Holiday / Blackout',es:'Feriado / Fecha Bloqueada'},icon:'🚫',color:'#ef4444'},
      {id:'local-event',label:{en:'Local Congregation Event',es:'Evento Congregacional'},icon:'🏠',color:'#14b8a6'},
      {id:'custom',label:{en:'Custom Event',es:'Evento Personalizado'},icon:'📌',color:'#f97316'}
    ];

var FIXED_NAMES=["South Springfield Spanish","Torringford Spanish","Meriden Spanish","New London Spanish","North Spanish New Britain"];
    starter.congregations.forEach(function(c){if(FIXED_NAMES.indexOf(c.name)!==-1)c.isFixed=true;});

    function migrateRow(row){
      if(!row.status){if(row.confirmed)row.status="confirmed";else if(row.messageSent)row.status="message-sent";else row.status="not-contacted";}
      if(row.followUpDate===undefined)row.followUpDate="";
      return row;
    }
    function migrateCong(c){if(c.isFixed===undefined)c.isFixed=false;return c;}
    // ââ Contact picker helpers âââââââââââââââââââââââââââââââââââââââââââââââââ
    function getAvailableYears(planningData){
      var years=[];
      (planningData||[]).forEach(function(y){if(y.rows&&y.rows.some(function(r){return String(r.congregation||"").trim();}))years.push(+y.year);});
      years.sort(function(a,b){return a-b;});
      return years;
    }
    function getAvailableMonthsForYear(planningData,year){
      var py=(planningData||[]).find(function(y){return+y.year===+year;});
      if(!py||!py.rows)return [];
      var ms=[];
      py.rows.forEach(function(r){if(String(r.congregation||"").trim()&&ms.indexOf(+r.month)===-1)ms.push(+r.month);});
      ms.sort(function(a,b){return a-b;});
      return ms;
    }
    function getArrangementsForMonth(planningData,year,month){
      var py=(planningData||[]).find(function(y){return+y.year===+year;});
      if(!py||!py.rows)return [];
      return py.rows.filter(function(r){return+r.month===+month&&String(r.congregation||"").trim();});
    }
    function getLastName(fullName){
      var parts=String(fullName||"").trim().split(/\s+/);
      return parts.length>1?parts[parts.length-1]:"";
    }
    function splitName(fullName){
      var parts=String(fullName||"").trim().split(/\s+/).filter(Boolean);
      if(!parts.length)return{first:"",last:"",full:""};
      return{first:parts[0],last:parts[parts.length-1],full:parts.join(" ")};
    }
    function buildGreeting(treatment,fullName,nameFormat){
      // treatment: "hermano" | "hermana" | "hermanos" | "neutral"
      // nameFormat: "none" | "first" | "last" | "full"
      var t=treatment||"hermano";
      var fmt=nameFormat||"none";
      if(t==="hermanos")return "Saludos hermanos";
      var n=splitName(fullName);
      var namePart="";
      if(fmt==="first"&&n.first)namePart=n.first;
      else if(fmt==="last"&&n.last)namePart=n.last;
      else if(fmt==="full"&&n.full)namePart=n.full;
      if(t==="neutral")return namePart?"Hola "+namePart:"Saludos";
      var prefix=t==="hermana"?"Saludos hermana":"Saludos hermano";
      return namePart?prefix+" "+namePart:prefix;
    }
    function getTreatmentForRow(rowId){
      return (state.treatmentMap&&state.treatmentMap[rowId])||"hermano";
    }
    function buildContactMessage(row,congName){
      var p=state.profile||{};
      var ms=months();
      var m=ms[+row.month]||"";
      var cname=congName||row.congregation||"";
      if(state.language==="es"){
        var treatment=getTreatmentForRow(row.id);
        var nameFormat=state.contactNameFormat||"none";
        var contactName=row.contact||"";
        if(!contactName){var cObj=findCong(cname);if(cObj)contactName=cObj.coordinator||"";}
        var greeting=buildGreeting(treatment,contactName,nameFormat);
        var from=p.name?"Le escribe "+p.name+(p.congregation?" de la CongregaciÃ³n "+p.congregation:"")+".":" ";
        return greeting+". "+from+" Le contactamos para confirmar el arreglo del discurso publico del mes de "+m+" con la congregaciÃ³n "+cname+". Por favor confirme su disponibilidad cuando tenga oportunidad. Gracias."+(p.name?"\n\n"+p.name:"");
      }
      var enTreatment=getTreatmentForRow(row.id);
      var enFmt=state.contactNameFormat||"none";
      var enContact=row.contact||"";
      if(!enContact){var cObj2=findCong(cname);if(cObj2)enContact=cObj2.coordinator||"";}
      var en=splitName(enContact);
      var enName="";
      if(enFmt==="first"&&en.first)enName=en.first;
      else if(enFmt==="last"&&en.last)enName=en.last;
      else if(enFmt==="full"&&en.full)enName=en.full;
      var enGreet;
      if(enTreatment==="hermanos"){enGreet="Hello Brothers";}
      else if(enTreatment==="neutral"){enGreet=enName?"Hello "+enName:"Hello";}
      else{var enPfx=enTreatment==="hermana"?"Hello Sister":"Hello Brother";enGreet=enName?enPfx+" "+enName:enPfx;}
      var from2=p.name?"I am "+p.name+(p.congregation?" from the "+p.congregation+" Congregation":"")+".":"";
      return enGreet+", "+from2+" I am reaching out to confirm the public talk arrangement for "+m+" with the "+cname+" congregation. Please confirm your availability. Thank you."+(p.name?"\n\n"+p.name:"");
    }
    // Resolve which planning row to show in the contact picker
    function resolveContactPickerRow(){
      var year=state.contactPickerYear;
      var month=state.contactPickerMonth;
      // Determine year
      if(year===null||year===undefined){
        var now=new Date();
        var ny=now.getFullYear(),nm=now.getMonth();
        var years=getAvailableYears(state.planning);
        if(years.indexOf(ny)!==-1&&getAvailableMonthsForYear(state.planning,ny).indexOf(nm)!==-1){year=ny;month=nm;}
        else if(years.length){year=years[0];month=null;}
        else return null;
      }
      // Determine month
      var availMonths=getAvailableMonthsForYear(state.planning,year);
      if(month===null||month===undefined||availMonths.indexOf(+month)===-1){
        if(!availMonths.length)return null;
        month=availMonths[0];
      }
      var arrangements=getArrangementsForMonth(state.planning,year,month);
      if(!arrangements.length)return null;
      var idx=Math.min(+(state.contactPickerIdx||0),arrangements.length-1);
      return {year:+year,month:+month,idx:idx,arrangement:arrangements[idx],arrangements:arrangements,availMonths:availMonths,availYears:getAvailableYears(state.planning)};
    }

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
        if(!merged.treatmentMap)merged.treatmentMap={};
        if(!merged.contactNameFormat)merged.contactNameFormat="none";
        // Always reset navigation state on load so the app opens on the current month,
        // not wherever the user was when they last closed it.
        merged.selectedMonth=currentMonth;
        merged.contactPickerYear=null;
        merged.contactPickerMonth=null;
        merged.contactPickerIdx=0;
        
        if(!Array.isArray(merged.taEvents))merged.taEvents=[];
        return merged;
      }catch(e){var s2=cloneStarter();s2.schedule=s2.schedule.map(migrateRow);return s2;}
    }
    function saveState(){state.updatedAt=new Date().toISOString();localStorage.setItem(APP_KEY,JSON.stringify(state));}
    var state=loadState();

    // ââ i18n ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function tt(k){return(T[state.language]||T.en)[k]||T.en[k]||k;}
    function tf(k,v){var s=tt(k);if(v)Object.keys(v).forEach(function(i){s=s.replace("{"+i+"}",v[i]);});return s;}
    function months(){return state.language==="es"?MEs:MEn;}
    function statusLabel(s){return tt({"not-contacted":"notContacted","message-sent":"messageSentStatus","confirmed":"confirmedStatus","needs-follow-up":"needsFollowUp"}[s]||"notContacted");}
    function resolvePaintTheme(){
      var mode=state.theme||"dark";
      if(mode==="system"){
        try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}catch(e){return "dark";}
      }
      return mode==="light"?"light":"dark";
    }

    // ââ Utilities ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
      var b=encodeURIComponent(body||(state.language==="es"?"Saludos,\n\nQueria comunicarme sobre el arreglo con "+(cong||"su congregaciÃ³n")+".":" Hello,\n\nI wanted to reach out about the arrangement with "+(cong||"your congregation")+"."));
      return"https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(email)+"&su="+subj+"&body="+b;
    }
    function fuClass(d){if(!d)return"";var diff=(new Date(d+"T00:00:00")-today)/86400000;return diff<0?"fu-overdue":diff<=7?"fu-soon":"";}
    function fuCell(d){var c=fuClass(d);return c==="fu-overdue"?"followup-overdue":c==="fu-soon"?"followup-soon":"";}
    function planningYearAudit(year){
      var rows=Array.isArray(year.rows)?year.rows:[];
      var present={},missingMonths=[],blankCongs=[],duplicateMonths=[];
      rows.forEach(function(row){
        var m=+row.month;
        if(!isNaN(m)&&m>=0&&m<12){
          if(present[m])duplicateMonths.push(m);
          present[m]=(present[m]||0)+1;
          if(!String(row.congregation||"").trim())blankCongs.push(m);
        }
      });
      for(var i=0;i<12;i++){if(!present[i])missingMonths.push(i);}
      return {complete:!missingMonths.length&&!blankCongs.length&&!duplicateMonths.length,missingMonths:missingMonths,blankCongs:blankCongs,duplicateMonths:Array.from(new Set(duplicateMonths))};
    }
    function monthList(list){return list.map(function(i){return months()[+i];}).join(", ");}
    function planningAuditHtml(year){
      var a=planningYearAudit(year);
      if(a.complete)return '<div class="year-check year-complete"><strong>'+(state.language==="es"?"AÃ±o completo":"Year complete")+'</strong><span>'+(state.language==="es"?"Los 12 meses tienen congregaciÃ³n.":"All 12 months have congregations.")+'</span></div>';
      var items=[];
      if(a.missingMonths.length)items.push((state.language==="es"?"Faltan meses: ":"Missing months: ")+monthList(a.missingMonths));
      if(a.blankCongs.length)items.push((state.language==="es"?"Falta congregaciÃ³n: ":"Missing congregation: ")+monthList(a.blankCongs));
      if(a.duplicateMonths.length)items.push((state.language==="es"?"Mes duplicado: ":"Duplicate month: ")+monthList(a.duplicateMonths));
      return '<div class="year-check year-incomplete"><strong>'+(state.language==="es"?"Revisar aÃ±o":"Year check")+'</strong>'+items.map(function(x){return'<span>'+esc(x)+'</span>';}).join("")+'</div>';
    }

    // ââ Message template âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    // Single source of truth: delegates to buildContactMessage so both the dashboard
    // card and the planning picker always produce identical formatted messages.
    function buildTmpl(row,congName){
      return buildContactMessage(row,congName);
    }

    // ââ Greeting ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function renderGreeting(){
      var el=document.getElementById("greeting");
      var p=state.profile||{};
      if(!p.name){el.textContent="";return;}
      var h=new Date().getHours();
      var greet=h<12?tt("goodMorning"):h<18?tt("goodAfternoon"):tt("goodEvening");
      el.textContent=greet+", "+p.name+" \uD83D\uDC4B";
    }

    // ââ Warnings ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
      // Duplicate congregation across the year boundary (adjacent Planning years)
      function crossYearDups(py,offset){
        if(!py||!Array.isArray(py.rows))return;
        sched.forEach(function(r){
          if(!r.congregation)return;
          py.rows.forEach(function(p){
            if(!p.congregation||norm(p.congregation)!==norm(r.congregation))return;
            if(Math.abs((+p.month+offset)-(+r.month))<=6)
              w.push(tf("duplicateCong",{c:r.congregation,m1:months()[r.month]+" "+state.currentYear,m2:months()[p.month]+" "+py.year}));
          });
        });
      }
      crossYearDups(state.planning.find(function(y){return+y.year===state.currentYear+1;}),12);
      crossYearDups(state.planning.find(function(y){return+y.year===state.currentYear-1;}),-12);
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

    // ââ Data badge ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function renderDataBadge(){
      var badge=document.getElementById("dataBadge");
      var n=state.congregations.filter(function(c){return(c.phone&&c.phone.trim())||(c.email&&c.email.trim());}).length;
      badge.className="data-badge "+(n>5?"badge-private":"badge-public");
      badge.textContent=(n>5?"\uD83D\uDCCB ":"\u26A0 ")+tt(n>5?"privateData":"publicData");
    }

    // ââ Dashboard âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

    // ââ Planning contact picker + card (combined, rendered into planningContactCard) ââ
    function renderContactPicker(){
      // No-op stub â renderPlanningContact now owns the picker UI inside planningContactCard.
      // Called from renderAll for compatibility; actual work done in renderPlanningContact.
      renderPlanningContact();
    }

    function renderPlanningContact(){
      var card=document.getElementById("planningContactCard");
      if(!card)return;
      var isEs=state.language==="es";

      // ââ Resolve which row to show âââââââââââââââââââââââââââââââââââââââââââââ
      var year=state.contactPickerYear;
      var month=state.contactPickerMonth;
      var availYears=getAvailableYears(state.planning);

      if(year===null||year===undefined||availYears.indexOf(+year)===-1){
        // Search for the current month in the nearest upcoming planning year so the
        // picker opens on a contextually relevant arrangement rather than January.
        var nm=new Date().getMonth();
        var found=false;
        for(var i=0;i<availYears.length;i++){
          if(getAvailableMonthsForYear(state.planning,availYears[i]).indexOf(nm)!==-1){
            year=availYears[i];month=nm;found=true;break;
          }
        }
        if(!found){
          if(availYears.length){year=availYears[0];month=null;}
          else{
            card.innerHTML='<div class="empty">'+(isEs?"No hay arreglos disponibles.":"No arrangements available.")+'</div>';
            return;
          }
        }
        state.contactPickerYear=year;
        if(month!==null&&month!==undefined)state.contactPickerMonth=month;
      }

      var availMonths=getAvailableMonthsForYear(state.planning,year);
      if(month===null||month===undefined||availMonths.indexOf(+month)===-1){
        if(!availMonths.length){
          // Build year-only picker and show empty message
          var yearOnlyOpts=availYears.map(function(y){return'<option value="'+y+'"'+(+y===+year?' selected':'')+'>'+y+'</option>';}).join("");
          card.innerHTML=
            '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:0.85em;padding-bottom:8px;border-bottom:1px solid var(--border);margin-bottom:8px;">'+
            '<label style="color:var(--muted)">'+(isEs?"AÃ±o":"Year")+': <select class="picker-sel" id="pYear">'+yearOnlyOpts+'</select></label>'+
            '</div>'+
            '<div class="empty">'+(isEs?"No hay arreglos para este aÃ±o.":"No arrangements for this year.")+'</div>';
          document.getElementById("pYear").addEventListener("change",function(){
            state.contactPickerYear=+this.value;state.contactPickerMonth=null;state.contactPickerIdx=0;
            saveState();renderPlanningContact();
          });
          return;
        }
        // Prefer the current month; fall back to first available.
        var nm2=new Date().getMonth();
        month=availMonths.indexOf(nm2)!==-1?nm2:availMonths[0];
        state.contactPickerMonth=month;
      }
      state.contactPickerMonth=month;

      var arrangements=getArrangementsForMonth(state.planning,year,month);
      if(!arrangements.length){
        card.innerHTML='<div class="empty">'+(isEs?"No hay arreglos para este mes.":"No arrangements for this month.")+'</div>';
        return;
      }
      var idx=Math.min(+(state.contactPickerIdx||0),arrangements.length-1);
      state.contactPickerIdx=idx;
      var arr=arrangements[idx];

      // ââ Build picker selectors ââââââââââââââââââââââââââââââââââââââââââââââââ
      var yearOpts=availYears.map(function(y){return'<option value="'+y+'"'+(+y===+year?' selected':'')+'>'+y+'</option>';}).join("");
      var monthOpts=availMonths.map(function(m){return'<option value="'+m+'"'+(+m===+month?' selected':'')+'>'+months()[m]+'</option>';}).join("");
      var arrOpts=arrangements.length>1?arrangements.map(function(a,i){
        var lbl=(a.congregation||"")+(a.contact?" â "+a.contact:"");
        return'<option value="'+i+'"'+(i===idx?' selected':'')+'>'+esc(lbl)+'</option>';
      }).join(""):"";
      var currentTreatment=getTreatmentForRow(arr.id);
      var treatments=[["hermano",isEs?"Hermano":"Brother"],["hermana",isEs?"Hermana":"Sister"],["hermanos",isEs?"Hermanos":"Brothers"],["neutral",isEs?"Neutral":"Neutral"]];
      var treatOpts=treatments.map(function(t){return'<option value="'+t[0]+'"'+(t[0]===currentTreatment?' selected':'')+'>'+t[1]+'</option>';}).join("");
      var currentNameFormat=state.contactNameFormat||"none";
      var nameFormats=[["none",isEs?"Sin nombre":"No name"],["first",isEs?"Nombre":"First name"],["last",isEs?"Apellido":"Last name"],["full",isEs?"Nombre completo":"Full name"]];
      var nameFmtOpts=nameFormats.map(function(f){return'<option value="'+f[0]+'"'+(f[0]===currentNameFormat?' selected':'')+'>'+f[1]+'</option>';}).join("");

      // ââ Build contact data ââââââââââââââââââââââââââââââââââââââââââââââââââââ
      var c=findCong(arr.congregation);
      var cname=arr.congregation||"";
      var cphone=c?c.phone:"";
      var cemail=c?c.email:"";
      var coord=arr.contact||(c?c.coordinator:"");
      var msg=buildContactMessage(arr,cname);
      var call=telH(cphone),sms=smsH(cphone);
      var smsBody=sms?sms+"&body="+encodeURIComponent(msg):"";
      var mailFull=cemail?mailH(cemail,cname,msg):"";
      var mailBase=cemail?mailH(cemail,cname,""):"";
      var statusKey="planning-status-"+arr.id;
      var currentStatus=(state.treatmentMap&&state.treatmentMap[statusKey])||"not-contacted";
      var statusOpts=STATUS.map(function(s){return'<option value="'+s+'"'+(s===currentStatus?' selected':'')+'>'+statusLabel(s)+'</option>';}).join("");
      var fixedTag=c&&c.isFixed?'<span class="fixed-badge">FIJO</span>':"";
      function lbtn(lbl,href,disabled){return disabled||!href?'<button disabled>'+lbl+'</button>':'<a href="'+esc(href)+'" class="link-btn" target="_blank" rel="noopener">'+lbl+'</a>';}
      function wbtn(lbl,href){return'<button data-wa-href="'+esc(href)+'">'+lbl+'</button>';}

      // ââ Render all into the card div ââââââââââââââââââââââââââââââââââââââââââ
      card.innerHTML=
        // Picker row
        '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:0.85em;padding-bottom:8px;border-bottom:1px solid var(--border);margin-bottom:10px;">'+
        '<label style="color:var(--muted)">'+(isEs?"AÃ±o":"Year")+': <select class="picker-sel" id="pYear">'+yearOpts+'</select></label>'+
        '<label style="color:var(--muted)">'+(isEs?"Mes":"Month")+': <select class="picker-sel" id="pMonth">'+monthOpts+'</select></label>'+
        (arrangements.length>1?'<label style="color:var(--muted)">'+(isEs?"Contacto":"Contact")+': <select class="picker-sel" id="pArr">'+arrOpts+'</select></label>':"")+
        '<label style="color:var(--muted)">'+(isEs?"Trato":"Greeting")+': <select class="picker-sel" id="pTreat">'+treatOpts+'</select></label>'+
        '<label style="color:var(--muted)">'+(isEs?"Nombre":"Name")+': <select class="picker-sel" id="pNameFmt">'+nameFmtOpts+'</select></label>'+
        '</div>'+
        // Contact info
        '<div><div class="contact-name">'+esc(cname)+fixedTag+'</div>'+(coord?'<div class="muted">'+esc(coord)+'</div>':'')+'</div>'+
        '<div class="contact-meta">'+
        '<div>'+tt("phone")+': <strong>'+(cphone?esc(cphone):"â")+'</strong></div>'+
        '<div>'+tt("email")+': <strong>'+(cemail?esc(cemail):"â")+'</strong></div>'+
        '</div>'+
        '<div style="margin:6px 0 4px;font-size:0.82em;color:var(--muted)">'+(isEs?"Estado":"Status")+':</div>'+
        '<select id="pStatus" class="status-select s-'+currentStatus+'" style="margin-bottom:8px;">'+statusOpts+'</select>'+
        '<div class="action-row no-print">'+lbtn("&#9742; "+tt("call"),call,!call)+lbtn("&#128172; "+tt("text"),sms,!sms)+lbtn("&#9993; "+tt("mail"),mailBase,!mailBase)+'</div>'+
        '<div class="no-print"><div class="template-label">'+tt("templates")+'</div>'+
        '<div class="template-box">'+esc(msg)+'</div>'+
        '<div class="action-row" style="margin-top:8px">'+
        (smsBody?lbtn("&#128241; "+tt("openSms"),smsBody,false):"")+
        (mailFull?lbtn("&#9993; "+tt("openEmail"),mailFull,false):"")+
        '<button data-copy="'+esc(msg)+'">&#10697; '+tt("copyMsg")+'</button>'+
        wbtn("&#129302; "+tt("whatsapp"),waH(cphone,msg))+
        '</div></div>';

      // ââ Wire picker events (fresh elements, no stacking) ââââââââââââââââââââââ
      document.getElementById("pYear").addEventListener("change",function(){
        state.contactPickerYear=+this.value;state.contactPickerMonth=null;state.contactPickerIdx=0;
        saveState();renderPlanningContact();
      });
      document.getElementById("pMonth").addEventListener("change",function(){
        state.contactPickerMonth=+this.value;state.contactPickerIdx=0;
        saveState();renderPlanningContact();
      });
      var pArr=document.getElementById("pArr");
      if(pArr)pArr.addEventListener("change",function(){
        state.contactPickerIdx=+this.value;saveState();renderPlanningContact();
      });
      document.getElementById("pTreat").addEventListener("change",function(){
        if(!state.treatmentMap)state.treatmentMap={};
        state.treatmentMap[arr.id]=this.value;
        saveState();renderPlanningContact();
      });
      document.getElementById("pNameFmt").addEventListener("change",function(){
        state.contactNameFormat=this.value;
        saveState();renderPlanningContact();
      });
      document.getElementById("pStatus").addEventListener("change",function(){
        if(!state.treatmentMap)state.treatmentMap={};
        state.treatmentMap["planning-status-"+arr.id]=this.value;
        this.className="status-select s-"+this.value;
        saveState();
      });
    }

    // ââ Contact card ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
        '<div class="contact-meta"><div>'+tt("phone")+': <strong>'+esc(c.phone||"â")+'</strong></div><div>'+tt("email")+': <strong>'+esc(c.email||"â")+'</strong></div>'+(c.note?'<div>'+tt("note")+': '+esc(c.note)+'</div>':'')+'</div>'+
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

    // ââ Planning ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function renderPlanning(){
      var host=document.getElementById("planningTables");
      host.innerHTML=state.planning.map(function(year){
        var rows=year.rows.map(function(row){
          var mOpts=months().map(function(m,i){return'<option value="'+i+'"'+(+row.month===i?' selected':'')+'>'+m+'</option>';}).join("");
          var incomplete=!String(row.congregation||"").trim();
          return'<tr class="'+(incomplete?'planning-incomplete':'')+'" data-id="'+row.id+'">'+
            '<td><select data-field="month">'+mOpts+'</select></td>'+
            '<td><select data-field="congregation">'+congOpts(row.congregation)+'</select></td>'+
            '<td><input data-field="contact" value="'+esc(row.contact||lookupCoord(row.congregation))+'"></td>'+
            '<td><input data-field="confirmed" type="checkbox"'+(row.confirmed?' checked':'')+"></td>"+
            '<td><input data-field="note" value="'+esc(row.note||"")+'"></td>'+
          '</tr>';
        }).join("");
        return'<div class="panel planning-year" data-year="'+year.year+'">'+
          '<div class="panel-title planning-title"><strong>'+(state.language==="es"?"Arreglos para":"Arrangements for")+' '+year.year+'</strong>'+planningAuditHtml(year)+'<button class="icon-btn danger" data-action="delete-year">&#215;</button></div>'+
          '<div class="table-wrap"><table>'+
            '<thead><tr><th>'+tt("month")+'</th><th>'+tt("conWho")+'</th><th>'+tt("contact")+'</th><th>'+tt("confirmedStatus")+'</th><th>'+tt("note")+'</th></tr></thead>'+
            '<tbody>'+rows+'</tbody></table></div></div>';
      }).join("");
    }
    function lookupCoord(name){var c=findCong(name);return c?c.coordinator:"";}

    // ââ Congregations âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

    // ââ Toast ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function toast(msg){var el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(function(){el.classList.remove("show");},2600);}
    function safeCopy(txt){
      function ok(){toast(tt("copied")+(txt?": "+String(txt).slice(0,60):""));}
      function fail(){toast(state.language==="es"?"No se pudo copiar":"Copy failed");}
      function legacy(){
        try{
          var ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";
          document.body.appendChild(ta);ta.select();
          var done=document.execCommand("copy");
          document.body.removeChild(ta);
          if(done)ok();else fail();
        }catch(e){fail();}
      }
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok).catch(legacy);}
      else legacy();
    }

    // ââ renderAll ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function renderAll(){
      var paintTheme=resolvePaintTheme();
      document.documentElement.dataset.theme=paintTheme;
      document.body.dataset.theme=paintTheme;
      // Keep KHub theme.js storage in sync so it cannot override the app's choice on next load
      try{localStorage.setItem("khub_theme",paintTheme);localStorage.setItem("khub_theme_override","true");}catch(e){}
      var themeMeta=document.querySelector('meta[name="theme-color"]');
      if(themeMeta)themeMeta.content=paintTheme==="light"?"#eef1f5":"#0b0d12";
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
      renderGreeting();renderDashboard();renderPlanning();renderCongregations();renderContactPicker();
    }

    // ââ Rollover ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    // Advances the schedule exactly one year. Archives the outgoing year to Planning,
    // copies the matching Planning year fully into the dashboard (congregation, note,
    // confirmed -> status), fills blank months from fixed congregations, falls back
    // to fixed-only when no Planning year exists. Consumed Planning year is removed.
    function performRollover(){
      var prev=state.currentYear;
      var next=prev+1;
      if(!state.planning.some(function(y){return+y.year===+prev;})){
        state.planning.unshift({year:prev,rows:state.schedule.slice().sort(function(a,b){return+a.month-+b.month;}).map(function(row){return{id:crypto.randomUUID(),month:row.month,congregation:row.congregation,contact:lookupCoord(row.congregation),confirmed:row.status==="confirmed",note:row.note};})});
      }
      var fm={};
      state.schedule.forEach(function(row){
        var fc2=findCong(row.congregation);
        if(fc2&&fc2.isFixed)fm[+row.month]=row.congregation;
      });
      var plan=state.planning.find(function(y){return+y.year===+next&&Array.isArray(y.rows)&&y.rows.length>0;});
      var pm={};
      if(plan)plan.rows.forEach(function(r){var m=+r.month;if(!isNaN(m)&&m>=0&&m<12&&!pm[m])pm[m]=r;});
      state.schedule=Array.from({length:12},function(_,i){
        var pr=pm[i];
        if(pr&&String(pr.congregation||"").trim()){
          return{id:crypto.randomUUID(),month:i,congregation:pr.congregation,status:pr.confirmed?"confirmed":"not-contacted",followUpDate:"",note:pr.note||""};
        }
        return{id:crypto.randomUUID(),month:i,congregation:fm[i]||"",status:"not-contacted",followUpDate:"",note:fm[i]?(state.language==="es"?"Arreglo fijo":"Fixed arrangement"):""};
      });
      if(plan)state.planning=state.planning.filter(function(y){return+y.year!==+next;});
      state.currentYear=next;state.selectedMonth=currentMonth;
      bannerDismissed=false;
      return{prev:prev,next:next};
    }
    function rolloverYear(){
      var next=state.currentYear+1;
      var prev=state.currentYear;
      showConfirm(tf("confirmCreateYear",{year:prev,next:next}),function(){
        performRollover();
        saveState();renderAll();
        toast(tf("yearCreated",{year:next,prev:prev})+" â");
      });
    }

    // ââ Export ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function downloadBackup(){
      var blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
      var url=URL.createObjectURL(blob);
      var a=document.createElement("a");a.href=url;
      a.download="talk-arrangements-backup-"+new Date().toISOString().slice(0,10)+".json";
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(function(){URL.revokeObjectURL(url);},2000);
      toast(tt("exported"));
    }

    // ââ Share congregation list ââââââââââââââââââââââââââââââââââââââââââââââââââââ
    function buildCongList(sep){
      return state.congregations.filter(function(c){return c.name;}).sort(function(a,b){return a.name.localeCompare(b.name);}).map(function(c){
        var l=(c.isFixed?"[FIJO] ":"")+c.name;
        if(c.coordinator)l+=sep+tt("coordinator")+": "+c.coordinator;
        if(c.phone)l+=sep+tt("phone")+": "+c.phone;
        if(c.email)l+=sep+tt("email")+": "+c.email;
        return l;
      }).join("\n\n");
    }

    // ââ Settings modal âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

    // ââ Custom confirm dialog âââââââââââââââââââââââââââââââââââââââââââââ
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

    // ââ Wire events ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

    // ── Events ────────────────────────────────────────────────────────────────────
    function renderEvents(){
      var list=document.getElementById('eventList');
      if(!list)return;
      var events=(state.taEvents||[]).filter(function(e){return e.active!==false;}).slice().sort(function(a,b){return(a.startDate||'').localeCompare(b.startDate||'');});
      if(!events.length){
        list.innerHTML='<div class="empty">'+tt('noEvents')+'</div>';
        return;
      }
      var isEs=state.language==='es';
      list.innerHTML=events.map(function(ev){
        var et=EVENT_TYPES.find(function(t){return t.id===ev.type;})||{icon:'📌',color:'#888',label:{en:'Event',es:'Evento'}};
        var dateStr=ev.startDate||(isEs?'Sin fecha':'No date');
        if(ev.endDate&&ev.endDate!==ev.startDate)dateStr+=' — '+ev.endDate;
        return '<div class="event-card" data-event-id="'+esc(ev.id)+'">'
          +'<div class="event-card-header">'
          +'<span class="event-type-badge" style="background:'+et.color+'22;color:'+et.color+';border:1px solid '+et.color+'44">'+et.icon+' '+esc(et.label[state.language]||et.label.en)+'</span>'
          +'<div class="event-card-actions">'
          +'<button class="icon-btn" data-event-action="edit" data-event-id="'+esc(ev.id)+'" title="'+tt('editEvent')+'">✏️</button>'
          +'<button class="icon-btn danger" data-event-action="delete" data-event-id="'+esc(ev.id)+'" title="'+tt('deleteEvent')+'">✕</button>'
          +'</div></div>'
          +'<div class="event-card-title">'+esc(ev.title||'')+'</div>'
          +'<div class="event-card-date muted">'+esc(dateStr)+'</div>'
          +(ev.description?'<div class="event-card-desc muted">'+esc(ev.description)+'</div>':'')
          +'</div>';
      }).join('');
    }

    function openEventModal(evId){
      var isEs=state.language==='es';
      var ev=evId?(state.taEvents||[]).find(function(e){return e.id===evId;}):null;
      var modal=document.getElementById('eventModal');
      if(!modal)return;
      document.getElementById('eventModalTitle').textContent=ev?tt('editEvent'):tt('addEvent');
      document.getElementById('evIdField').value=ev?ev.id:'';
      document.getElementById('evTitleField').value=ev?ev.title||'':'';
      document.getElementById('evTypeField').value=ev?ev.type||'':'';
      document.getElementById('evStartField').value=ev?ev.startDate||'':'';
      document.getElementById('evEndField').value=ev?ev.endDate||'':'';
      document.getElementById('evAllDayField').checked=ev?ev.allDay!==false:true;
      document.getElementById('evDescField').value=ev?ev.description||'':'';
      document.getElementById('evNotesField').value=ev?ev.notes||'':'';
      document.getElementById('evActiveField').checked=ev?ev.active!==false:true;
      updateEventTypeColor();
      modal.classList.add('open');
    }

    function updateEventTypeColor(){
      var typeVal=document.getElementById('evTypeField').value;
      var et=EVENT_TYPES.find(function(t){return t.id===typeVal;});
      var swatches=document.getElementById('evColorSwatches');
      if(!swatches)return;
      swatches.innerHTML=EVENT_TYPES.map(function(t){
        return '<button type="button" class="color-swatch'+(typeVal===t.id?' active':'')+'" style="background:'+t.color+'" data-color="'+t.color+'" data-type-id="'+t.id+'" title="'+t.label.en+'"></button>';
      }).join('');
      if(et){var ci=document.getElementById('evColorInput');if(ci)ci.value=et.color;}
    }

    function closeEventModal(){
      var modal=document.getElementById('eventModal');
      if(modal)modal.classList.remove('open');
    }

    function saveEvent(){
      var titleEl=document.getElementById('evTitleField');
      var title=(titleEl?titleEl.value:'').trim();
      if(!title){toast(state.language==='es'?'El título es requerido':'Title is required');return;}
      var idVal=document.getElementById('evIdField').value;
      var startDate=document.getElementById('evStartField').value;
      var endDate=document.getElementById('evEndField').value||startDate;
      var typeVal=document.getElementById('evTypeField').value;
      var et=EVENT_TYPES.find(function(t){return t.id===typeVal;})||EVENT_TYPES[EVENT_TYPES.length-1];
      var now=Date.now();
      if(idVal){
        var ev=(state.taEvents||[]).find(function(e){return e.id===idVal;});
        if(ev){
          ev.title=title;ev.type=typeVal;ev.startDate=startDate;ev.endDate=endDate;
          ev.allDay=document.getElementById('evAllDayField').checked;
          ev.description=document.getElementById('evDescField').value;
          ev.notes=document.getElementById('evNotesField').value;
          ev.color=document.getElementById('evColorInput').value||et.color;
          ev.icon=et.icon;ev.active=document.getElementById('evActiveField').checked;ev.updatedAt=now;
        }
      }else{
        if(!state.taEvents)state.taEvents=[];
        state.taEvents.push({id:'evt-'+now,title:title,type:typeVal,description:document.getElementById('evDescField').value,startDate:startDate,endDate:endDate,allDay:document.getElementById('evAllDayField').checked,recurring:false,recurrenceRule:'',congregationScope:'all',color:document.getElementById('evColorInput').value||et.color,icon:et.icon,active:document.getElementById('evActiveField').checked,notes:document.getElementById('evNotesField').value,createdAt:now,updatedAt:now});
      }
      saveState();closeEventModal();renderEvents();toast(tt('saved'));
    }

    function deleteEvent(evId){
      showConfirm(tt('confirmDeleteEvent'),function(){
        state.taEvents=(state.taEvents||[]).filter(function(e){return e.id!==evId;});
        saveState();renderEvents();toast(tt('deleteEvent'));
      });
    }

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
        if(field==="month"||field==="congregation")renderPlanning();
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
        if(e.target.dataset.shareInfo){if(navigator.share){navigator.share({title:e.target.closest("[class*=contact]")?e.target.closest("[class*=contact]")&&document.getElementById("selectedMonthLabel").textContent:"Contact",text:e.target.dataset.shareInfo}).catch(function(){});}else{safeCopy(e.target.dataset.shareInfo);}return;}
        var txt=e.target.dataset.copy;
        if(txt===undefined)return;
        if(txt===""){toast(tt("nothingToCopy"));return;}
        safeCopy(txt);
      });
      // Search
      document.getElementById("searchBox").addEventListener("input",renderCongregations);
      // Export / Import / Reset
      document.getElementById("exportBtn").addEventListener("click",downloadBackup);
      document.getElementById("importBtn").addEventListener("click",function(){document.getElementById("importFile").click();});
      var settingsExportBtn=document.getElementById("settingsExportBtn");
      var settingsImportBtn=document.getElementById("settingsImportBtn");
      if(settingsExportBtn)settingsExportBtn.addEventListener("click",downloadBackup);
      if(settingsImportBtn)settingsImportBtn.addEventListener("click",function(){document.getElementById("importFile").click();});
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
            // Reset navigation so import opens on the current month, not a stale one from the backup.
            state.selectedMonth=currentMonth;
            state.contactPickerYear=null;state.contactPickerMonth=null;state.contactPickerIdx=0;
            saveState();renderAll();toast(tt("imported"));
          }catch(err){toast(tt("invalidBackup"));}
          e.target.value="";
        };
        reader.readAsText(file);
      });
      document.getElementById("resetBtn").addEventListener("click",function(){showConfirm(tt("deleteConfirm"),function(){state=cloneStarter();state.schedule=state.schedule.map(migrateRow);saveState();renderAll();toast(tt("restored"));});});

      // ââ Cloud backup ââââââââââââââââââââââââââââââââââââââââââââââââââââ
      (function(){
        var APP_ID="talk-arrangements";
        var KEYS=["jw-talk-arrangements-v1"];
        var importBtn=document.getElementById("importBtn");
        var settingsCloudSaveBtn=document.getElementById("settingsCloudSaveBtn");
        var settingsCloudRestoreBtn=document.getElementById("settingsCloudRestoreBtn");
        if(importBtn&&window.KHub&&KHub.Firebase&&KHub.Firebase.db&&KHub.Firebase.auth&&KHub.CloudAuth){
          var accountBtn=document.createElement("button");
          accountBtn.id="cloudAccountBtn";
          accountBtn.title="Cloud Account";
          accountBtn.innerHTML='&#128274; <span>Cloud Account</span>';
          importBtn.parentNode.insertBefore(accountBtn,importBtn.nextSibling);

          var cloudSaveBtn=document.createElement("button");
          cloudSaveBtn.id="cloudSaveBtn";
          cloudSaveBtn.title="Save to Cloud";
          cloudSaveBtn.innerHTML='&#9729; <span>Cloud Save</span>';
          importBtn.parentNode.insertBefore(cloudSaveBtn,accountBtn.nextSibling);

          var cloudRestoreBtn=document.createElement("button");
          cloudRestoreBtn.id="cloudRestoreBtn";
          cloudRestoreBtn.title="Restore from Cloud";
          cloudRestoreBtn.innerHTML='&#9729; <span>Cloud Restore</span>';
          importBtn.parentNode.insertBefore(cloudRestoreBtn,cloudSaveBtn.nextSibling);

          function cloudUser(){return KHub.CloudAuth.currentUser();}
          function signedIn(){return !!cloudUser();}
          function cloudErr(e){if(e&&e.code==="auth-required")return "Sign in to your cloud account first";return e&&e.message==="no-backup"?"No cloud backup found":"Cloud backup failed";}
          function refreshCloudUi(){
            var user=cloudUser();
            accountBtn.innerHTML=user?'&#9989; <span>'+esc(user.email||'Cloud account')+'</span>':'&#128274; <span>Sign in</span>';
            cloudSaveBtn.disabled=false;
            cloudRestoreBtn.disabled=false;
            if(settingsCloudSaveBtn)settingsCloudSaveBtn.disabled=false;
            if(settingsCloudRestoreBtn)settingsCloudRestoreBtn.disabled=false;
          }
          function openCloudAccount(){
            var user=cloudUser();
            if(user){
              showConfirm("Sign out of cloud backup?",function(){KHub.CloudAuth.signOut().then(function(){toast("Signed out");refreshCloudUi();});});
              return;
            }
            KHub.CloudAuth.openDialog().then(function(result){
              if(result==="reset-sent")toast("Password reset email sent");
              else if(result)toast("Signed in");
              refreshCloudUi();
            }).catch(function(){});
          }
          accountBtn.addEventListener("click",openCloudAccount);
          function runCloudSave(btn){
            if(!signedIn()){openCloudAccount();return;}
            if(btn)btn.disabled=true;
            KHub.CloudBackup.save(APP_ID,KEYS)
              .then(function(){toast("Saved to cloud");})
              .catch(function(e){toast(cloudErr(e));console.error(e);})
              .finally(function(){refreshCloudUi();});
          }
          function runCloudRestore(btn){
            if(!signedIn()){openCloudAccount();return;}
            showConfirm("Replace your current data with your signed-in cloud backup?",function(){
              if(btn)btn.disabled=true;
              KHub.CloudBackup.restore(APP_ID,KEYS,null,function(){
                toast("Restored from cloud");setTimeout(function(){location.reload();},800);
              }).catch(function(e){
                toast(cloudErr(e));refreshCloudUi();console.error(e);
              });
            });
          }
          cloudSaveBtn.addEventListener("click",function(){runCloudSave(cloudSaveBtn);});
          cloudRestoreBtn.addEventListener("click",function(){runCloudRestore(cloudRestoreBtn);});
          if(settingsCloudSaveBtn)settingsCloudSaveBtn.addEventListener("click",function(){runCloudSave(settingsCloudSaveBtn);});
          if(settingsCloudRestoreBtn)settingsCloudRestoreBtn.addEventListener("click",function(){runCloudRestore(settingsCloudRestoreBtn);});
          refreshCloudUi();
          KHub.CloudAuth.onChange(refreshCloudUi);
        }else{
          if(settingsCloudSaveBtn)settingsCloudSaveBtn.disabled=true;
          if(settingsCloudRestoreBtn)settingsCloudRestoreBtn.disabled=true;
        }
      })();      // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ


      // Add month
      document.getElementById("addCurrentYear").addEventListener("click",function(){state.schedule.push({id:crypto.randomUUID(),month:currentMonth,congregation:"",status:"not-contacted",followUpDate:"",note:""});saveState();renderDashboard();});
      // Add planning year
      document.getElementById("addPlanningYear").addEventListener("click",function(){
        var next=Math.max.apply(null,state.planning.map(function(y){return+y.year;}).concat([state.currentYear]))+1;
        state.planning.push({year:next,rows:Array.from({length:12},function(_,i){return{id:crypto.randomUUID(),month:i,congregation:"",contact:"",confirmed:false,note:""};})});
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

      // Events tab
      document.getElementById('addEventBtn').addEventListener('click',function(){openEventModal(null);});
      document.getElementById('saveEventBtn').addEventListener('click',saveEvent);
      document.getElementById('closeEventModalBtn').addEventListener('click',closeEventModal);
      document.getElementById('eventModal').addEventListener('click',function(e){if(e.target===this)closeEventModal();});
      document.getElementById('evTypeField').addEventListener('change',updateEventTypeColor);
      document.getElementById('evStartField').addEventListener('change',function(){var ef=document.getElementById('evEndField');if(ef&&!ef.value)ef.value=this.value;});
      document.getElementById('eventList').addEventListener('click',function(e){
        var btn=e.target.closest('[data-event-action]');if(!btn)return;
        var eid=btn.dataset.eventId;
        if(btn.dataset.eventAction==='edit')openEventModal(eid);
        if(btn.dataset.eventAction==='delete')deleteEvent(eid);
      });
      document.getElementById('evColorSwatches').addEventListener('click',function(e){
        var sw=e.target.closest('.color-swatch');if(!sw)return;
        var ci=document.getElementById('evColorInput');if(ci)ci.value=sw.dataset.color;
        document.querySelectorAll('.color-swatch').forEach(function(s){s.classList.toggle('active',s===sw);});
      });
    }

    wireEvents();
    renderAll();

    // ââ Auto-detect new year on load âââââââââââââââââââââââââââââââââââââââââââââââ
    if(thisYear>state.currentYear){
      var _rolledFrom=state.currentYear;
      var _guard=0;
      while(state.currentYear<thisYear&&_guard<50){performRollover();_guard++;}
      saveState();renderAll();
      setTimeout(function(){toast(tf("yearCreated",{year:state.currentYear,prev:_rolledFrom})+" â "+tt("archiveNote"));},600);
    }

    // Cloud sync: once signed in, pull newer cloud data on open/resume and push local changes shortly after edits.
    if (window.KHub && KHub.CloudAuth && KHub.CloudBackup) {
      var TALK_CLOUD_APP = "talk-arrangements";
      var TALK_CLOUD_KEYS = ["jw-talk-arrangements-v1"];
      var talkAutoSaveStarted = false;
      var talkCloudSaveTimer = null;
      var talkCloudChecking = false;
      var talkCloudSaving = false;

      function talkCloudUser(){ return KHub.CloudAuth.currentUser(); }
      function checkTalkCloudLatest(){
        if(!talkCloudUser() || talkCloudChecking) return Promise.resolve();
        talkCloudChecking = true;
        return KHub.CloudBackup.restoreLatestIfNewer(TALK_CLOUD_APP, TALK_CLOUD_KEYS, null, function(){
          location.reload();
        }).catch(function(e){
          console.warn("[TalkCloud] restore check failed", e);
        }).finally(function(){ talkCloudChecking = false; });
      }
      function saveTalkCloudSoon(){
        if(!talkCloudUser()) return;
        clearTimeout(talkCloudSaveTimer);
        talkCloudSaveTimer = setTimeout(function(){
          if(talkCloudSaving || !talkCloudUser()) return;
          talkCloudSaving = true;
          KHub.CloudBackup.save(TALK_CLOUD_APP, TALK_CLOUD_KEYS)
            .catch(function(e){ console.warn("[TalkCloud] auto save failed", e); })
            .finally(function(){ talkCloudSaving = false; });
        }, 1800);
      }

      KHub.CloudAuth.onChange(function(user){
        if(!user)return;
        checkTalkCloudLatest().finally(function(){
          if(!talkAutoSaveStarted){
            talkAutoSaveStarted=true;
            KHub.CloudBackup.autoSave(TALK_CLOUD_APP, TALK_CLOUD_KEYS);
            document.addEventListener("visibilitychange", function(){
              if(document.visibilityState === "visible") checkTalkCloudLatest();
              else saveTalkCloudSoon();
            });
            window.addEventListener("focus", checkTalkCloudLatest);
            window.addEventListener("online", checkTalkCloudLatest);
            window.addEventListener("storage", function(e){ if(e && e.key === APP_KEY) saveTalkCloudSoon(); });
            document.addEventListener("input", saveTalkCloudSoon, true);
            document.addEventListener("change", saveTalkCloudSoon, true);
            document.addEventListener("click", function(e){
              if(e && e.target && e.target.closest("button,[data-action],input,select,textarea")) saveTalkCloudSoon();
            }, true);
          }
        });
      });
    }
