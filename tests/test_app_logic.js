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

const alerts = [];
const context = {
  console,
  localStorage: new Storage(),
  window: {ADDON_DATA:{}},
  addonMeta: [],
  document: {createElement:()=>({click(){}}), getElementById:()=>null},
  URL: {createObjectURL:()=> 'blob:test', revokeObjectURL:()=>{}},
  Blob: function(){},
  alert: (message)=>alerts.push(String(message)),
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

// Atlas feature resolution includes Kosovo, which world-atlas names but does not number.
assert.strictEqual(run(`featureISO({id:'826',properties:{name:'United Kingdom'}})`), 'GB');
assert.strictEqual(run(`featureISO({properties:{name:'Kosovo'}})`), 'XK');
assert.strictEqual(run(`featureISO({properties:{__iso:'UA'}})`), 'UA');
assert.strictEqual(run(`VERSION`), '1.8.6');

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


// Rolling CSV filenames include stable user IDs so same-name profiles cannot collide.
run(`users=[
 {id:'person-a',first:'Sam',last:'Smith',country:'GB',visits:{GB:[]},addons:{}},
 {id:'person-b',first:'Sam',last:'Smith',country:'GB',visits:{},addons:{}}
]; activeUser='person-a';`);
assert.strictEqual(run(`userFilename(users[0])`), 'Sam-Smith--person-a.csv');
assert.strictEqual(run(`userFilename(users[1])`), 'Sam-Smith--person-b.csv');
assert.notStrictEqual(run(`userFilename(users[0])`), run(`userFilename(users[1])`));

const rollingNames = run(`rollingBackupFilenames()`);
assert(rollingNames.has('Sam-Smith--person-a.csv'));
assert(rollingNames.has('Sam-Smith--person-b.csv'));
assert(rollingNames.has('Sam-Smith.csv')); // legacy mirror is also recognised as self-generated

// Current CSV exports carry User ID so profile identity survives a round trip.
const identityCsv = run(`csvContent(users[0])`);
assert(identityCsv.includes('"User ID"'), identityCsv);
assert(identityCsv.includes('"person-a"'), identityCsv);

// JSON restore preserves stable IDs: two people with identical names remain distinct.
run(`users=[]; activeUser=null;`);
context.sameNameBackup = JSON.stringify({version:'1.8.2',users:[
  {id:'sam-one',first:'Sam',last:'Smith',country:'GB',visits:{GB:[2020]},addons:{}},
  {id:'sam-two',first:'Sam',last:'Smith',country:'GB',visits:{FR:[2021]},addons:{}}
]});
run(`importJSON_data(sameNameBackup)`);
assert.strictEqual(run(`users.length`), 2);
assert.deepStrictEqual(Array.from(run(`users.map(u=>u.id).sort()`)), ['sam-one','sam-two']);

// Re-importing the same backup merges by stable ID instead of duplicating profiles.
run(`importJSON_data(sameNameBackup)`);
assert.strictEqual(run(`users.length`), 2);
assert.deepStrictEqual(Array.from(run(`users.find(u=>u.id==='sam-one').visits.GB`)), [2020]);


// A forged/corrupt backup cannot reuse an existing stable ID for another person.
const beforeConflict = run(`JSON.stringify(users)`);
context.conflictBackup = JSON.stringify({version:'1.8.2',users:[
  {id:'sam-one',first:'Different',last:'Person',country:'GB',visits:{US:[2022]},addons:{}}
]});
run(`importJSON_data(conflictBackup)`);
assert.strictEqual(run(`JSON.stringify(users)`), beforeConflict);
assert(alerts.some(m=>m.includes('Profile ID conflict')));

// A per-person CSV must not silently combine rows belonging to different profiles.
alerts.length=0;
context.window.ADDON_DATA['us-states'] = {regions:[['California','CA','CA','state']]};
context.addonMeta = [{id:'us-states', name:'US States'}];
run(`users=[{id:'alice',first:'Alice',last:'Smith',country:'GB',visits:{},addons:{}}]; activeUser='alice';`);
context.mixedProfileCsv = [
  '"Name","ISO2","Continent","Type","Years Visited","Addon ID","User ID","User First","User Last","Home ISO2"',
  '"France","FR","Europe","country","2020","","alice","Alice","Smith","GB"',
  '"Japan","JP","Asia","country","2022","","bob","Bob","Jones","US"'
].join('\n');
assert.strictEqual(run(`importCSV_data(mixedProfileCsv,'mixed.csv')`), false);
assert.strictEqual(run(`users[0].visits.FR`), undefined);
assert.strictEqual(run(`users[0].visits.JP`), undefined);
assert(alerts.some(m=>m.includes('multiple profiles')));

// Add-on CSV rows must match a region actually defined by the installed add-on.
alerts.length=0;
run(`users=[{id:'james',first:'James',last:'Wintermute',country:'GB',visits:{},addons:{}}]; activeUser='james';`);
context.badAddonCsv = [
  '"Name","ISO2","Continent","Type","Years Visited","Addon ID","User ID","User First","User Last","Home ISO2"',
  '"Imaginary State","ZZ","US States","state","2020","us-states","james","James","Wintermute","GB"'
].join('\n');
assert.strictEqual(run(`importCSV_data(badAddonCsv,'bad-addon.csv')`), true);
assert.strictEqual(run(`users[0].addons['us-states']`), undefined);
assert(alerts.some(m=>m.includes('ignored')));

// Redundant v1.8.1/v1.8.2 CSV localStorage mirrors are cleaned on load/migration.
context.localStorage.setItem('cl_csv_old-user', 'legacy csv mirror');
context.localStorage.setItem('unrelated', 'keep');
run(`cleanupLegacyCsvMirrors()`);
assert.strictEqual(context.localStorage.getItem('cl_csv_old-user'), null);
assert.strictEqual(context.localStorage.getItem('unrelated'), 'keep');

// Browser storage failures are surfaced rather than throwing through the UI path.
alerts.length=0;
run(`storageWarningShown=false; users=[{id:'storage-user',first:'Storage',last:'Test',country:'GB',visits:{},addons:{}}];`);
const originalSetItem = context.localStorage.setItem;
context.localStorage.setItem = ()=>{ throw new Error('quota exceeded'); };
assert.strictEqual(run(`save()`), false);
assert(alerts.some(m=>m.includes('could not save to browser storage')));
context.localStorage.setItem = originalSetItem.bind(context.localStorage);

// Summary continent calculations include territories as places. Antarctica is
// territory-only in P, so this specifically guards the regression where it vanished.
run(`users=[{
  id:'polar-user',first:'Polar',last:'Traveller',country:'GB',
  visits:{AQ:[2024],GB:[],GI:[2022]},addons:{}
}]; activeUser='polar-user';`);
const antarcticaPlaces = run(`P.filter(p=>p[2]==='Antarctica')`);
assert.strictEqual(antarcticaPlaces.length, 3);
assert.strictEqual(run(`P.filter(p=>p[2]==='Antarctica'&&p[4]==='country').length`), 0);
assert.strictEqual(run(`P.filter(p=>p[2]==='Antarctica'&&users[0].visits[p[1]]!==undefined).length`), 1);

// Family Overview must use all places, expose Antarctica and label the total clearly.
// This source-level assertion complements the data regression above while renderSummary
// remains intentionally embedded in the zero-build HTML application.
const summarySource = html.match(/function renderSummary\(\)[\s\S]*?function toggleJustMe\(\)/)?.[0] || '';
assert(summarySource.includes('const places=P.filter(p=>p[2]===c);'), 'summary continent data must include territories');
assert(summarySource.includes('P.some(p=>p[2]===c)'), 'family overview must include territory-only continents');
assert(!summarySource.includes('P.some(p=>p[2]===c&&p[4]===\"country\")'), 'family overview must not filter territory-only continents');
assert(summarySource.includes('<th>Places</th>'), 'family overview total must be labelled Places');
assert(summarySource.includes('${s.nc+s.nt}'), 'family overview total must include territories');

// Multi-person timeline columns must be wider than their complete bar group.
// The old fixed 28px .tl-col let three 16px bars overlap adjacent years, so
// hovering a visually aligned year could target the next year's element.
assert(summarySource.includes('const COL_W=Math.max(36,userList.length*BAR_W'), 'timeline width must scale with person count');
assert(summarySource.includes('style="width:${COL_W}px;min-width:${COL_W}px"'), 'each year must apply the calculated width');
assert(summarySource.includes('const BAR_H=105;'), 'timeline should use the expanded readable height');
assert(!html.includes('.tl-col{display:flex;flex-direction:column;align-items:center;gap:2px;width:28px;}'), 'timeline must not restore the overlapping fixed-width columns');
assert(html.includes('.tl-yr{font-size:10px'), 'timeline year labels should remain readable and horizontal');


// Timeline bars drill into the existing country/territory sidebar instead of
// introducing a second raw-data screen. Family bars identify the owning user.
assert(summarySource.includes("drillTimeline('${usr.id}',${y})"), 'person bars must drill into the matching user/year');
assert(summarySource.includes("drillTimeline('${defaultDrillUser.id}',${y})"), 'year columns must drill into the active/default user');
assert(html.includes('(sidebarYearFilter===null||(u.visits[p[1]]||[]).includes(sidebarYearFilter))'), 'sidebar list must support year drill-down filtering');
assert(html.includes('activeCont="All";sidebarYearFilter=y;'), 'timeline drill-down must show matching places across all continents');
assert(html.includes('id="sb-year-filter"'), 'active year drill-down must be visible and clearable');

// Add-ons are interactive in Map view. Clicking Add-ons from Summary must move
// to that view automatically instead of leaving the user in a sidebar-only dead end.
const sidebarModeSource = html.match(/function setSidebarMode\(mode\)[\s\S]*?function renderAddonSidebarOnly\(\)/)?.[0] || '';
assert(sidebarModeSource.includes('if(activeView!=="map")setView("map");'), 'Add-ons must switch Summary to Map view');
assert(sidebarModeSource.includes('sidebarYearFilter=null;updateSidebarYearFilter();'), 'Add-ons must clear timeline drill-down state');

console.log('app logic tests: ok');
