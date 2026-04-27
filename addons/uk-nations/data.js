// UK Nations addon
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
      {type:"Feature",properties:{code:"ENG"},geometry:{type:"Polygon",coordinates:[[[-2.6,51.4],[-1.8,50.7],[-0.1,50.8],[1.8,51.4],[0.5,53.8],[-2.0,55.8],[-3.6,54.5],[-3.2,53.3],[-5.7,50.1],[-2.6,51.4]]]}},
      {type:"Feature",properties:{code:"SCO"},geometry:{type:"Polygon",coordinates:[[[-2.0,55.8],[-5.0,54.6],[-5.2,55.4],[-6.2,56.3],[-5.8,57.5],[-2.5,57.7],[-1.8,57.1],[-2.0,55.8]]]}},
      {type:"Feature",properties:{code:"WAL"},geometry:{type:"Polygon",coordinates:[[[-2.6,51.4],[-3.6,51.3],[-5.3,51.9],[-4.7,53.4],[-3.2,53.3],[-3.6,54.5],[-2.0,55.8],[-2.0,53.8],[-2.6,51.4]]]}},
      {type:"Feature",properties:{code:"NIR"},geometry:{type:"Polygon",coordinates:[[[-6.0,54.0],[-8.2,54.3],[-8.0,55.4],[-6.0,55.3],[-5.4,54.5],[-6.0,54.0]]]}},
    ]
  }
};
