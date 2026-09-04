const assert=require('assert');
global.window=global;
require('../js/state-validation.js');

const good={currentYear:2026,schedule:[{month:0,congregation:'Example',status:'confirmed'}],congregations:[{name:'Example'}],planning:[{year:2030,rows:[{month:1,congregation:'Future'}]}],taEvents:[],taReminders:[]};
assert.strictEqual(TalkStateValidation.validate(good).ok,true);
assert.strictEqual(TalkStateValidation.validate({schedule:'bad',congregations:[]}).ok,false);
assert.strictEqual(TalkStateValidation.validate({schedule:[{month:14,congregation:'Bad'}],congregations:[]}).ok,false);
const unsafe=JSON.parse('{"schedule":[],"congregations":[],"__proto__":{"polluted":true}}');
assert.strictEqual(TalkStateValidation.validate(unsafe).ok,false);
console.log('state validation tests: passed');
