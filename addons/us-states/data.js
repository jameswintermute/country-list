// US States addon data
// Map: us-atlas@3 states-albers-10m.json (Albers USA projection, 975×610 viewport)
// FIPS numeric codes match the us-atlas feature IDs
window.ADDON_DATA = window.ADDON_DATA || {};
window.ADDON_DATA["us-states"] = {
  id: "us-states",
  color: "#2dd4bf",
  mapType: "us-albers",
  mapUrl: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json",
  // Match feature id (FIPS) to region code
  featureCode: f => US_FIPS[+f.id] || null,
  regions: [
    // [name, code, flag, type, fips]
    ["Alabama","AL","AL","state",1],
    ["Alaska","AK","AK","state",2],
    ["Arizona","AZ","AZ","state",4],
    ["Arkansas","AR","AR","state",5],
    ["California","CA","CA","state",6],
    ["Colorado","CO","CO","state",8],
    ["Connecticut","CT","CT","state",9],
    ["Delaware","DE","DE","state",10],
    ["Washington DC","DC","DC","state",11],
    ["Florida","FL","FL","state",12],
    ["Georgia","GA","GA","state",13],
    ["Hawaii","HI","HI","state",15],
    ["Idaho","ID","ID","state",16],
    ["Illinois","IL","IL","state",17],
    ["Indiana","IN","IN","state",18],
    ["Iowa","IA","IA","state",19],
    ["Kansas","KS","KS","state",20],
    ["Kentucky","KY","KY","state",21],
    ["Louisiana","LA","LA","state",22],
    ["Maine","ME","ME","state",23],
    ["Maryland","MD","MD","state",24],
    ["Massachusetts","MA","MA","state",25],
    ["Michigan","MI","MI","state",26],
    ["Minnesota","MN","MN","state",27],
    ["Mississippi","MS","MS","state",28],
    ["Missouri","MO","MO","state",29],
    ["Montana","MT","MT","state",30],
    ["Nebraska","NE","NE","state",31],
    ["Nevada","NV","NV","state",32],
    ["New Hampshire","NH","NH","state",33],
    ["New Jersey","NJ","NJ","state",34],
    ["New Mexico","NM","NM","state",35],
    ["New York","NY","NY","state",36],
    ["North Carolina","NC","NC","state",37],
    ["North Dakota","ND","ND","state",38],
    ["Ohio","OH","OH","state",39],
    ["Oklahoma","OK","OK","state",40],
    ["Oregon","OR","OR","state",41],
    ["Pennsylvania","PA","PA","state",42],
    ["Rhode Island","RI","RI","state",44],
    ["South Carolina","SC","SC","state",45],
    ["South Dakota","SD","SD","state",46],
    ["Tennessee","TN","TN","state",47],
    ["Texas","TX","TX","state",48],
    ["Utah","UT","UT","state",49],
    ["Vermont","VT","VT","state",50],
    ["Virginia","VA","VA","state",51],
    ["Washington","WA","WA","state",53],
    ["West Virginia","WV","WV","state",54],
    ["Wisconsin","WI","WI","state",55],
    ["Wyoming","WY","WY","state",56],
  ]
};

// FIPS → state code lookup (used by featureCode)
const US_FIPS = {
  1:"AL",2:"AK",4:"AZ",5:"AR",6:"CA",8:"CO",9:"CT",10:"DE",11:"DC",
  12:"FL",13:"GA",15:"HI",16:"ID",17:"IL",18:"IN",19:"IA",20:"KS",
  21:"KY",22:"LA",23:"ME",24:"MD",25:"MA",26:"MI",27:"MN",28:"MS",
  29:"MO",30:"MT",31:"NE",32:"NV",33:"NH",34:"NJ",35:"NM",36:"NY",
  37:"NC",38:"ND",39:"OH",40:"OK",41:"OR",42:"PA",44:"RI",45:"SC",
  46:"SD",47:"TN",48:"TX",49:"UT",50:"VT",51:"VA",53:"WA",54:"WV",
  55:"WI",56:"WY"
};
