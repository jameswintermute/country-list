// Canada Provinces & Territories addon
window.ADDON_DATA = window.ADDON_DATA || {};
window.ADDON_DATA["canada-provinces"] = {
  id: "canada-provinces",
  color: "#2dd4bf",
  mapType: "geojson",
  featureCode: f => f.properties.code,
  regions: [
    ["Alberta","AB","🏔️","province"],
    ["British Columbia","BC","🌲","province"],
    ["Manitoba","MB","🌾","province"],
    ["New Brunswick","NB","🌊","province"],
    ["Newfoundland & Labrador","NL","⚓","province"],
    ["Nova Scotia","NS","🦞","province"],
    ["Ontario","ON","🍁","province"],
    ["Prince Edward Island","PE","🥔","province"],
    ["Quebec","QC","⚜️","province"],
    ["Saskatchewan","SK","🌻","province"],
    ["Northwest Territories","NT","🐻‍❄️","territory"],
    ["Nunavut","NU","❄️","territory"],
    ["Yukon","YT","🏔️","territory"],
  ],
  mapData: {
    type: "FeatureCollection",
    features: [
      {type:"Feature",properties:{code:"BC"},geometry:{type:"Polygon",coordinates:[[[-138.0,60.0],[-120.0,60.0],[-120.0,49.0],[-123.3,49.0],[-124.8,49.7],[-126.7,50.4],[-130.0,54.7],[-133.0,54.7],[-136.5,59.5],[-138.0,60.0]]]}},
      {type:"Feature",properties:{code:"AB"},geometry:{type:"Polygon",coordinates:[[[-120.0,60.0],[-110.0,60.0],[-110.0,49.0],[-120.0,49.0],[-120.0,60.0]]]}},
      {type:"Feature",properties:{code:"SK"},geometry:{type:"Polygon",coordinates:[[[-110.0,60.0],[-101.4,60.0],[-101.4,49.0],[-110.0,49.0],[-110.0,60.0]]]}},
      {type:"Feature",properties:{code:"MB"},geometry:{type:"Polygon",coordinates:[[[-101.4,60.0],[-89.0,60.0],[-89.0,52.9],[-95.2,49.0],[-101.4,49.0],[-101.4,60.0]]]}},
      {type:"Feature",properties:{code:"ON"},geometry:{type:"Polygon",coordinates:[[[-95.2,49.0],[-89.0,52.9],[-80.0,51.0],[-79.5,43.5],[-76.8,44.1],[-74.7,45.0],[-75.3,45.5],[-76.2,44.4],[-77.0,43.6],[-79.0,43.0],[-82.5,41.7],[-83.1,42.0],[-84.0,46.0],[-86.5,47.6],[-89.0,47.9],[-94.9,48.5],[-95.2,49.0]]]}},
      {type:"Feature",properties:{code:"QC"},geometry:{type:"Polygon",coordinates:[[[-79.5,43.5],[-80.0,51.0],[-64.0,60.0],[-59.5,60.0],[-64.3,58.5],[-66.5,55.5],[-70.0,47.0],[-70.7,45.0],[-74.7,45.0],[-76.8,44.1],[-79.5,43.5]]]}},
      {type:"Feature",properties:{code:"NB"},geometry:{type:"Polygon",coordinates:[[[-66.9,47.9],[-64.0,48.1],[-64.0,45.0],[-67.5,45.0],[-67.5,47.1],[-66.9,47.9]]]}},
      {type:"Feature",properties:{code:"NS"},geometry:{type:"Polygon",coordinates:[[[-64.0,46.9],[-60.5,46.2],[-59.9,45.9],[-61.0,44.5],[-66.3,43.6],[-66.4,45.0],[-64.0,45.0],[-64.0,46.9]]]}},
      {type:"Feature",properties:{code:"PE"},geometry:{type:"Polygon",coordinates:[[[-63.9,46.9],[-62.0,46.0],[-64.0,45.9],[-63.9,46.9]]]}},
      {type:"Feature",properties:{code:"NL"},geometry:{type:"MultiPolygon",coordinates:[[[[-52.7,47.5],[-53.2,46.8],[-55.5,46.9],[-59.5,47.6],[-55.7,51.4],[-52.7,47.5]]],[[[-64.0,60.0],[-52.6,55.0],[-56.0,51.5],[-59.5,47.6],[-64.3,58.5],[-59.5,60.0],[-64.0,60.0]]]]}}  ,
      {type:"Feature",properties:{code:"YT"},geometry:{type:"Polygon",coordinates:[[[-138.0,60.0],[-136.5,59.5],[-133.0,54.7],[-130.0,54.7],[-131.0,56.0],[-136.0,59.8],[-138.0,60.0],[-141.0,60.0],[-141.0,70.0],[-138.0,69.0],[-138.0,60.0]]]}},
      {type:"Feature",properties:{code:"NT"},geometry:{type:"Polygon",coordinates:[[[-120.0,60.0],[-138.0,60.0],[-138.0,69.0],[-141.0,70.0],[-136.0,69.0],[-120.0,70.0],[-110.0,60.0],[-110.0,60.0],[-120.0,60.0]]]}},
      {type:"Feature",properties:{code:"NU"},geometry:{type:"Polygon",coordinates:[[[-89.0,60.0],[-80.0,51.0],[-64.0,60.0],[-89.0,60.0]]]}},
    ]
  }
};

window.ADDON_DATA["canada-provinces"].areaKm2 = {"AB": 661848, "BC": 944735, "MB": 647797, "NB": 72908, "NL": 405212, "NS": 55284, "ON": 1076395, "PE": 5660, "QC": 1542056, "SK": 651036, "NT": 1346106, "NU": 2093190, "YT": 482443};
window.ADDON_DATA["canada-provinces"].totalAreaKm2 = 9985000;
