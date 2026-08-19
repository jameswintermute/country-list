'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('src/index.html', 'utf8');
const n2a = html.match(/const N2A=\{.*?\};/s)?.[0];
const places = html.match(/const P=\[.*?\n\];/s)?.[0];
const core = html.match(/\/\/ ── VERSION .*?\/\/ ── BOOT/s)?.[0].replace(/\/\/ ── BOOT[\s\S]*$/, '');
assert(n2a && places && core, 'could not extract app core from index.html');

class Storage {
  constructor(){ this.map = new Map(); }
  get length(){ return this.map.size; }
  key(i){ return [...this.map.keys()][i] ?? null; }
  getItem(k){ return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k,v){ this.map.set(String(k), String(v)); }
  removeItem(k){ this.map.delete(k); }
  clear(){ this.map.clear(); }
}

const context = {
  console,
  localStorage: new Storage(),
  window: {ADDON_DATA:{}},
  addonMeta: [],
  document: {createElement:()=>({click(){}}), getElementById:()=>null},
  URL: {createObjectURL:()=> 'blob:test', revokeObjectURL:()=>{}},
  Blob: function(){},
  alert: ()=>{},
  prompt: ()=> 'GB',
  showApp: ()=>{},
  fetch: ()=> Promise.resolve({ok:true}),
  setTimeout: (fn)=>{ if (typeof fn === 'function') fn(); },
};
vm.createContext(context);
vm.runInContext(`${n2a}\n${places}\n${core}`, context);

function run(code){ return vm.runInContext(code, context); }

// Complete numeric mapping fixes the previously absent sovereign mappings.
for (const [numeric, iso] of [[48,'BH'],[112,'BY'],[84,'BZ'],[72,'BW'],[96,'BN'],[233,'EE'],[498,'MD'],[512,'OM'],[158,'TW']]) {
  assert.strictEqual(run(`N2A[${numeric}]`), iso, `${iso} numeric mapping`);
}

// Year handling is consistent and rejects out-of-range values.
const currentYear = new Date().getFullYear();
assert.deepStrictEqual(Array.from(run(`normaliseYears([2020, "2020", 1899, ${currentYear + 1}, 2021])`)), [2020, 2021]);

// User-supplied HTML is escaped before interpolation into summary/tab HTML.
assert.strictEqual(run(`htmlEscape('<img src=x onerror=1>')`), '&lt;img src=x onerror=1&gt;');

// Spreadsheet formula injection is neutralised in CSV exports.
assert.strictEqual(run(`csvCell('=HYPERLINK("https://example.invalid")')`).startsWith('"\'='), true);

// Cross-user add-on regression: Bob's export must not contain Alice's states.
context.window.ADDON_DATA['us-states'] = {
  regions: [
    ['California','CA','CA','state'],
    ['Texas','TX','TX','state'],
  ]
};
context.addonMeta = [{id:'us-states', name:'US States'}];
run(`
users=[
 {id:'alice',first:'Alice',last:'A',country:'GB',visits:{GB:[]},addons:{'us-states':{CA:[2020]}}},
 {id:'bob',first:'Bob',last:'B',country:'GB',visits:{GB:[]},addons:{'us-states':{TX:[2021]}}}
]; activeUser='alice';
`);
const bobCsv = run(`csvContent(users[1])`);
assert(bobCsv.includes('"Texas","TX"'), bobCsv);
assert(!bobCsv.includes('"California","CA"'), bobCsv);

// Legacy localStorage add-on keys migrate into the matching user and are removed.
context.localStorage.clear();
run(`users=[{id:'legacy-user',first:'Legacy',last:'User',country:'GB',visits:{},addons:{}}]; activeUser='legacy-user';`);
context.localStorage.setItem('cl_addon_us-states_legacy-user', JSON.stringify({NY:[2018]}));
run(`migrateLegacyAddonStorage()`);
assert.strictEqual(run(`users[0].addons['us-states'].NY[0]`), 2018);
assert.strictEqual(context.localStorage.getItem('cl_addon_us-states_legacy-user'), null);

// CSV add-on import regression: this used to reference `user` before declaration.
context.localStorage.clear();
context.addonMeta = [{id:'us-states', name:'US States'}];
run(`users=[{id:'james',first:'James',last:'Wintermute',country:'GB',visits:{},addons:{}}]; activeUser='james';`);
const importCsv = [
  '"Name","ISO2","Continent","Type","Years Visited","Addon ID","User First","User Last","Home ISO2"',
  '"California","CA","US States","state","2019; 2022","us-states","James","Wintermute","GB"'
].join('\n');
context.importCsv = importCsv;
run(`importCSV_data(importCsv,'2026-08-19-country-list-James-Wintermute.csv')`);
assert.deepStrictEqual(Array.from(run(`users[0].addons['us-states'].CA`)), [2019, 2022]);

// New JSON/user validation does not accept arbitrary home ISO codes.
assert.throws(() => run(`normaliseUser({id:'x',first:'Bad',last:'ISO',country:'ZZ',visits:{},addons:{}})`));

console.log('app logic tests: ok');
