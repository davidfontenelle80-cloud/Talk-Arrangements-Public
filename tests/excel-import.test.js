const assert = require('assert');

global.window = global;
global.document = null;
require('../js/excel-import.js');

const rows = [
  ['Arreglos de discursos 2026'],
  ['Mes','Congregación','Mensaje enviado','Confirmado','Nota'],
  ['Enero','Cedar Spanish','','',''],
  ['Febrero','West Spanish','','','Arreglo fijo'],
  ['Arreglos para 2030'],
  ['Mes','Con quien','Nombre','Telefono','Nota'],
  ['Enero','North Spanish','','',''],
  ['Diciembre','South Spanish','','','Arreglo fijo'],
  ['', '', '', '', '', '', 'Lista de Contacto'],
  ['', '', '', '', '', '', 'Congregación','Coordinador de Discursos','Teléfono','Coreo electrónico'],
  ['', '', '', '', '', '', 'NewLondon Spanish','Ana Pérez','860-555-0100','ana@example.com'],
];
const fakeXlsx = {utils:{sheet_to_json:sheet => sheet.rows}};
const parsed = TalkExcelImport.parseWorkbook({SheetNames:['Sheet1'],Sheets:{Sheet1:{rows}}},fakeXlsx,2026);

assert.deepStrictEqual(parsed.years.map(y => y.year),[2026,2030]);
assert.strictEqual(parsed.years[1].rows[1].month,11);
assert.strictEqual(parsed.years[1].rows[1].note,'Arreglo fijo');
assert.strictEqual(parsed.contacts[0].coordinator,'Ana Pérez');
assert.strictEqual(TalkExcelImport.key('NewLondon Spanish'),TalkExcelImport.key('New London Spanish'));

const state={currentYear:2026,schedule:[{id:'keep',month:0,congregation:'Old Cedar',status:'confirmed',followUpDate:'2026-09-01',note:'App note'}],planning:[],congregations:[],taEvents:[{id:'event'}],taReminders:[{id:'reminder'}]};
const report=TalkExcelImport.reconcile(state,parsed);
const change=report.actions.find(a => a.kind==='change-arrangement');
assert(change,'existing-month change should require review');
assert.strictEqual(change.required,undefined);

const storage={};
global.localStorage={setItem(k,v){storage[k]=v;},getItem(k){return storage[k]||null;},removeItem(k){delete storage[k];}};
const applied=TalkExcelImport.applyReconciliation(state,report,{[change.id]:true});
assert.strictEqual(applied.schedule[0].id,'keep');
assert.strictEqual(applied.schedule[0].status,'confirmed');
assert.strictEqual(applied.schedule[0].followUpDate,'2026-09-01');
assert.strictEqual(applied.schedule[0].congregation,'Cedar Spanish');
assert(applied.planning.some(y => y.year===2030),'dynamic future year should be created');
assert.strictEqual(applied.taEvents.length,1);
assert.strictEqual(applied.taReminders.length,1);
assert(storage['jw-talk-arrangements-pre-excel-import'],'a pre-import recovery snapshot should be saved');

const fixedState={currentYear:2026,schedule:[{id:'fixed-row',month:0,congregation:'Cedar Spanish',status:'not-contacted',note:'Arreglo fijo'}],planning:[],congregations:[{id:'c1',name:'Cedar Spanish',coordinator:'',phone:'',email:'',isFixed:true}]};
const noLongerFixedRows=[['Arreglos de discursos 2026'],['Mes','Congregación','','','Nota'],['Enero','Cedar Spanish','','',''],['','','','','','','Lista de Contacto'],['','','','','','','Congregación','Coordinador de Discursos','Teléfono','Coreo electrónico'],['','','','','','','Cedar Spanish','','','']];
const noLongerFixed=TalkExcelImport.parseWorkbook({SheetNames:['Sheet1'],Sheets:{Sheet1:{rows:noLongerFixedRows}}},fakeXlsx,2026);
const fixedApplied=TalkExcelImport.applyReconciliation(fixedState,TalkExcelImport.reconcile(fixedState,noLongerFixed),{});
assert.strictEqual(fixedApplied.congregations[0].isFixed,false,'fixed flag should clear when the spreadsheet removes the fixed note');

const duplicateRows=rows.concat([['','','','','','','New London Spanish','Another Person','','']]);
const duplicates=TalkExcelImport.parseWorkbook({SheetNames:['Sheet1'],Sheets:{Sheet1:{rows:duplicateRows}}},fakeXlsx,2026);
assert(duplicates.blockingErrors.length>0,'duplicate contacts should block import');

console.log('excel import tests: passed');
