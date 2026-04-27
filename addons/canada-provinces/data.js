// Canada Provinces & Territories addon
// Regions use official 2-letter codes as abbreviations
window.ADDON_DATA = window.ADDON_DATA || {};
window.ADDON_DATA["canada-provinces"] = {
  id: "canada-provinces",
  color: "#2dd4bf",
  mapType: "geojson",
  featureCode: f => f.properties.code,
  regions: [
    ["Alberta","AB","AB","province"],
    ["British Columbia","BC","BC","province"],
    ["Manitoba","MB","MB","province"],
    ["New Brunswick","NB","NB","province"],
    ["Newfoundland & Labrador","NL","NL","province"],
    ["Nova Scotia","NS","NS","province"],
    ["Ontario","ON","ON","province"],
    ["Prince Edward Island","PE","PE","province"],
    ["Quebec","QC","QC","province"],
    ["Saskatchewan","SK","SK","province"],
    ["Northwest Territories","NT","NT","territory"],
    ["Nunavut","NU","NU","territory"],
    ["Yukon","YT","YT","territory"],
  ],
  mapData: {
    type: "FeatureCollection",
    features: [
      {type:"Feature",properties:{code:"BC"},geometry:{type:"Polygon",coordinates:[[
        [-139.1,60.0],[-136.5,59.5],[-133.0,54.7],[-130.0,54.2],[-128.0,52.0],
        [-126.0,50.5],[-124.0,49.5],[-123.3,49.0],[-120.0,49.0],
        [-120.0,60.0],[-139.1,60.0]
      ]]}},
      {type:"Feature",properties:{code:"AB"},geometry:{type:"Polygon",coordinates:[[
        [-110.0,49.0],[-110.0,60.0],[-120.0,60.0],[-120.0,49.0],[-110.0,49.0]
      ]]}},
      {type:"Feature",properties:{code:"SK"},geometry:{type:"Polygon",coordinates:[[
        [-101.4,49.0],[-101.4,60.0],[-110.0,60.0],[-110.0,49.0],[-101.4,49.0]
      ]]}},
      {type:"Feature",properties:{code:"MB"},geometry:{type:"Polygon",coordinates:[[
        [-95.2,49.0],[-89.0,49.0],[-89.0,53.0],[-93.0,56.0],[-96.0,58.0],
        [-101.4,60.0],[-101.4,49.0],[-95.2,49.0]
      ]]}},
      {type:"Feature",properties:{code:"ON"},geometry:{type:"Polygon",coordinates:[[
        [-95.2,49.0],[-84.5,46.0],[-83.0,42.0],[-82.0,43.0],
        [-79.5,43.5],[-76.5,44.0],[-74.5,45.5],[-76.0,48.0],
        [-80.0,51.0],[-89.0,53.0],[-89.0,49.0],[-95.2,49.0]
      ]]}},
      {type:"Feature",properties:{code:"QC"},geometry:{type:"Polygon",coordinates:[[
        [-74.5,45.5],[-71.5,45.0],[-64.5,44.0],[-63.5,44.5],
        [-65.5,47.5],[-64.5,48.0],[-66.0,49.0],[-69.0,47.5],
        [-72.0,45.5],[-74.5,45.5]
      ]]}},
      {type:"Feature",properties:{code:"NB"},geometry:{type:"Polygon",coordinates:[[
        [-67.5,45.0],[-67.0,47.8],[-65.0,48.0],[-64.0,47.0],
        [-64.5,44.0],[-63.5,44.5],[-66.0,44.0],[-67.5,45.0]
      ]]}},
      {type:"Feature",properties:{code:"NS"},geometry:{type:"Polygon",coordinates:[[
        [-64.0,47.0],[-61.5,46.0],[-60.0,43.8],[-66.3,43.6],
        [-66.4,45.0],[-64.5,44.0],[-64.0,47.0]
      ]]}},
      {type:"Feature",properties:{code:"PE"},geometry:{type:"Polygon",coordinates:[[
        [-63.0,46.0],[-62.0,46.2],[-62.0,47.0],[-64.0,47.0],[-63.0,46.0]
      ]]}},
      {type:"Feature",properties:{code:"NL"},geometry:{type:"MultiPolygon",coordinates:[
        [[[-53.0,47.5],[-54.0,46.8],[-56.0,47.0],[-59.5,47.5],[-57.0,51.5],[-53.0,47.5]]],
        [[[-56.0,51.5],[-60.0,51.0],[-64.5,52.0],[-64.0,60.0],[-59.5,60.0],[-56.0,51.5]]]
      ]}},
      {type:"Feature",properties:{code:"YT"},geometry:{type:"Polygon",coordinates:[[
        [-141.0,60.0],[-141.0,70.0],[-137.0,69.0],[-136.0,68.5],
        [-138.0,62.0],[-136.5,59.5],[-139.1,60.0],[-141.0,60.0]
      ]]}},
      {type:"Feature",properties:{code:"NT"},geometry:{type:"Polygon",coordinates:[[
        [-120.0,60.0],[-120.0,70.0],[-141.0,70.0],[-141.0,60.0],
        [-139.1,60.0],[-136.5,59.5],[-133.0,54.7],[-130.0,54.2],
        [-128.0,52.0],[-126.0,50.5],[-124.0,49.5],[-123.3,49.0],
        [-120.0,49.0],[-120.0,60.0]
      ]]}},
      {type:"Feature",properties:{code:"NU"},geometry:{type:"Polygon",coordinates:[[
        [-89.0,60.0],[-89.0,73.0],[-101.4,73.0],[-101.4,60.0],[-89.0,60.0]
      ]]}},
    ]
  }
};
window.ADDON_DATA["canada-provinces"].areaKm2 = {"AB":661848,"BC":944735,"MB":647797,"NB":72908,"NL":405212,"NS":55284,"ON":1076395,"PE":5660,"QC":1542056,"SK":651036,"NT":1346106,"NU":2093190,"YT":482443};
window.ADDON_DATA["canada-provinces"].totalAreaKm2 = 9985000;
