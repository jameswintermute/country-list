// UK Nations addon
// England, Scotland, Wales and Northern Ireland
window.ADDON_DATA = window.ADDON_DATA || {};
window.ADDON_DATA["uk-nations"] = {
  id: "uk-nations",
  color: "#2dd4bf",
  mapType: "geojson",
  featureCode: f => f.properties.code,
  regions: [
    ["England","ENG","ENG","nation"],
    ["Scotland","SCO","SCO","nation"],
    ["Wales","WAL","WAL","nation"],
    ["Northern Ireland","NIR","NIR","nation"],
  ],
  mapData: {
    type: "FeatureCollection",
    features: [
      {type:"Feature",properties:{code:"SCO"},geometry:{type:"Polygon",coordinates:[[
        [-2.0,55.8],[-2.7,55.0],[-3.6,54.7],[-5.0,54.7],
        [-5.0,55.0],[-5.1,55.5],[-4.5,55.9],[-5.0,56.5],
        [-5.5,57.0],[-6.2,57.7],[-6.0,58.0],[-5.0,58.5],
        [-3.5,58.6],[-2.0,57.7],[-1.8,57.0],[-2.5,56.5],[-2.0,55.8]
      ]]}},
      {type:"Feature",properties:{code:"WAL"},geometry:{type:"Polygon",coordinates:[[
        [-2.6,51.4],[-3.6,51.3],[-4.8,51.6],[-5.3,51.9],
        [-5.0,52.4],[-4.7,53.4],[-4.2,53.4],[-3.2,53.3],
        [-3.1,52.5],[-2.6,51.4]
      ]]}},
      {type:"Feature",properties:{code:"ENG"},geometry:{type:"Polygon",coordinates:[[
        [-5.7,50.0],[-4.2,50.4],[-3.4,50.5],[-2.3,51.0],
        [-1.8,50.7],[0.5,50.8],[1.8,51.4],[1.7,52.0],
        [0.5,52.9],[0.4,53.4],[-0.1,53.7],[-0.8,54.0],
        [-2.0,54.7],[-2.7,55.0],[-2.0,55.8],[-3.6,54.7],
        [-3.2,53.3],[-4.2,53.4],[-4.7,53.4],[-5.0,52.4],
        [-5.3,51.9],[-4.8,51.6],[-3.6,51.3],[-2.6,51.4],
        [-5.7,50.0]
      ]]}},
      {type:"Feature",properties:{code:"NIR"},geometry:{type:"Polygon",coordinates:[[
        [-5.4,54.0],[-7.0,54.2],[-8.2,54.4],[-8.0,54.8],
        [-7.5,55.2],[-6.5,55.3],[-6.0,55.3],[-5.4,54.5],[-5.4,54.0]
      ]]}},
    ]
  }
};
window.ADDON_DATA["uk-nations"].areaKm2 = {"ENG":130279,"SCO":78772,"WAL":20779,"NIR":13843};
window.ADDON_DATA["uk-nations"].totalAreaKm2 = 244000;
