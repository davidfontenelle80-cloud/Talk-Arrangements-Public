(function(root){
  'use strict';
  var STATUSES={'not-contacted':1,'message-sent':1,confirmed:1,'needs-follow-up':1};
  function object(v){return !!v&&typeof v==='object'&&!Array.isArray(v);}
  function safeTree(v){
    if(!v||typeof v!=='object')return true;
    if(Object.prototype.hasOwnProperty.call(v,'__proto__')||Object.prototype.hasOwnProperty.call(v,'constructor')||Object.prototype.hasOwnProperty.call(v,'prototype'))return false;
    return Object.keys(v).every(function(k){return safeTree(v[k]);});
  }
  function validYear(v){return Number.isInteger(+v)&&+v>=2000&&+v<=2200;}
  function validRow(r){return object(r)&&Number.isInteger(+r.month)&&+r.month>=0&&+r.month<=11&&typeof r.congregation==='string'&&(!r.status||STATUSES[r.status]);}
  function validate(state){
    var errors=[];
    if(!object(state))return {ok:false,errors:['Backup must be an object.']};
    if(!safeTree(state))errors.push('Backup contains unsafe property names.');
    if(!Array.isArray(state.schedule)||!state.schedule.every(validRow))errors.push('Schedule rows are invalid.');
    if(!Array.isArray(state.congregations)||!state.congregations.every(function(c){return object(c)&&typeof c.name==='string';}))errors.push('Congregation records are invalid.');
    if(state.currentYear!==undefined&&!validYear(state.currentYear))errors.push('Current year is invalid.');
    if(state.planning!==undefined&&(!Array.isArray(state.planning)||!state.planning.every(function(p){return object(p)&&validYear(p.year)&&Array.isArray(p.rows)&&p.rows.every(validRow);}))){errors.push('Planning records are invalid.');}
    if(state.taEvents!==undefined&&(!Array.isArray(state.taEvents)||!state.taEvents.every(object)))errors.push('Event records are invalid.');
    if(state.taReminders!==undefined&&(!Array.isArray(state.taReminders)||!state.taReminders.every(object)))errors.push('Reminder records are invalid.');
    if(state.profile!==undefined&&!object(state.profile))errors.push('Profile is invalid.');
    return {ok:errors.length===0,errors:errors};
  }
  root.TalkStateValidation={validate:validate};
})(typeof window!=='undefined'?window:globalThis);
