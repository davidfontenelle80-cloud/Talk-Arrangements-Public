const assert=require('assert');
const fs=require('fs');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const app=fs.readFileSync(require.resolve('../js/app.js'),'utf8');
const report=fs.readFileSync(require.resolve('../js/year-report.js'),'utf8');

assert(html.includes('id="printBtn"'));
assert(html.includes('data-i18n="printReports"'));
assert(!html.includes('id="yearReportBtn"'),'duplicate year-report button should stay removed');
assert(!app.includes('getElementById("printBtn").addEventListener'),'app must not attach a competing print handler');
assert(report.includes("document.getElementById('printBtn')"),'report module owns the print button');
console.log('print wiring tests: passed');
