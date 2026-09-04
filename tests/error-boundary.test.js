const assert=require('assert');
global.window=global;
global.addEventListener=function(){};
global.document={getElementById:function(){return null;}};
require('../js/error-boundary.js');
assert.strictEqual(KHub.ErrorBoundary.isTransientCloudTransaction('Attempt to get records from database without an in-progress transaction'),true);
assert.strictEqual(KHub.ErrorBoundary.isTransientCloudTransaction('Permission denied'),false);
console.log('error boundary tests: passed');
