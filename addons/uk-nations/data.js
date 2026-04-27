// UK Nations addon
// Unicode subdivision flag emojis exist for ENG, SCO, WAL but not NIR
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
      {type:"Feature",properties:{code:"ENG"},geometry:{type:"Polygon",coordinates:[[
        [-5.7,50.0],[-1.8,50.7],[1.8,51.4],[1.6,52.9],[0.1,53.5],
        [-0.1,53.8],[-2.0,54.0],[-3.0,54.5],[-3.6,54.6],
        [-2.0,55.8],[-1.8,55.7],[-0.5,54.5],[0.0,53.5],
        [-2.0,53.0],[-3.2,53.3],[-4.7,53.4],[-5.2,51.9],
        [-3.6,51.3],[-2.6,51.4],[-5.7,50.0]
      ]]}},
      {type:"Feature",properties:{code:"SCO"},geometry:{type:"Polygon",coordinates:[[
        [-2.0,55.8],[-3.6,54.6],[-5.0,54.7],[-5.2,55.4],
        [-6.2,56.3],[-6.0,57.5],[-5.0,58.5],[-3.0,58.7],
        [-2.0,57.7],[-1.8,57.1],[-2.0,55.8]
      ]]}},
      {type:"Feature",properties:{code:"WAL"},geometry:{type:"Polygon",coordinates:[[
        [-2.6,51.4],[-3.6,51.3],[-5.2,51.9],[-4.7,53.4],
        [-3.2,53.3],[-3.6,54.6],[-3.0,54.5],[-2.0,54.0],
        [-2.0,53.0],[-2.6,51.4]
      ]]}},
      {type:"Feature",properties:{code:"NIR"},geometry:{type:"Polygon",coordinates:[[
        [-6.0,54.0],[-8.2,54.3],[-7.5,55.2],[-6.0,55.3],[-5.4,54.5],[-6.0,54.0]
      ]]}},
    ]
  }
};

window.ADDON_DATA["uk-nations"].areaKm2 = {"ENG":130279,"SCO":78772,"WAL":20779,"NIR":13843};
window.ADDON_DATA["uk-nations"].totalAreaKm2 = 244000;
