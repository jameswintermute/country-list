// Australian States & Territories addon
window.ADDON_DATA = window.ADDON_DATA || {};
window.ADDON_DATA["australia-states"] = {
  id: "australia-states",
  color: "#2dd4bf",
  mapType: "geojson",
  featureCode: f => f.properties.code,
  regions: [
    ["New South Wales","NSW","NSW","state"],
    ["Victoria","VIC","VIC","state"],
    ["Queensland","QLD","QLD","state"],
    ["Western Australia","WA","WA","state"],
    ["South Australia","SA","SA","state"],
    ["Tasmania","TAS","TAS","state"],
    ["Australian Capital Territory","ACT","ACT","territory"],
    ["Northern Territory","NT","NT","territory"],
  ],
  mapData: {
    type: "FeatureCollection",
    features: [
      {type:"Feature",properties:{code:"QLD"},geometry:{type:"Polygon",coordinates:[[
        [138.0,-26.0],[138.0,-18.0],[139.5,-17.5],[141.0,-17.0],
        [142.0,-11.0],[143.0,-12.0],[145.0,-14.5],[147.0,-19.0],
        [148.5,-20.5],[150.0,-22.5],[152.5,-24.5],[153.5,-26.0],
        [153.6,-28.6],[150.0,-28.5],[141.0,-29.0],[138.0,-26.0]
      ]]}},
      {type:"Feature",properties:{code:"NSW"},geometry:{type:"Polygon",coordinates:[[
        [141.0,-29.0],[150.0,-28.5],[153.6,-28.6],[153.5,-30.0],
        [152.5,-32.5],[151.5,-33.5],[151.0,-34.5],[150.5,-36.0],
        [150.0,-37.0],[149.0,-37.5],[148.5,-37.8],[148.0,-38.0],
        [146.0,-38.5],[144.8,-38.0],[141.0,-36.0],[141.0,-29.0]
      ]]}},
      {type:"Feature",properties:{code:"VIC"},geometry:{type:"Polygon",coordinates:[[
        [141.0,-34.0],[141.0,-36.0],[144.8,-38.0],[146.0,-38.5],
        [148.0,-38.0],[148.5,-37.8],[149.0,-37.5],[150.0,-37.0],
        [149.5,-37.5],[148.5,-38.5],[146.0,-39.0],[144.0,-38.5],
        [143.0,-38.5],[141.0,-37.5],[141.0,-34.0]
      ]]}},
      {type:"Feature",properties:{code:"SA"},geometry:{type:"Polygon",coordinates:[[
        [129.0,-26.0],[129.0,-35.0],[132.0,-34.0],[135.0,-35.0],
        [136.5,-35.5],[138.0,-35.5],[141.0,-35.0],[141.0,-34.0],
        [141.0,-29.0],[138.0,-29.0],[138.0,-26.0],[129.0,-26.0]
      ]]}},
      {type:"Feature",properties:{code:"WA"},geometry:{type:"Polygon",coordinates:[[
        [129.0,-13.5],[129.0,-26.0],[126.0,-33.5],[121.5,-34.0],
        [117.5,-35.0],[115.0,-34.5],[114.5,-26.0],[114.0,-22.0],
        [116.0,-20.0],[119.0,-18.5],[122.0,-14.5],[125.0,-14.0],
        [128.0,-14.5],[129.0,-13.5]
      ]]}},
      {type:"Feature",properties:{code:"NT"},geometry:{type:"Polygon",coordinates:[[
        [129.0,-13.5],[128.0,-14.5],[125.0,-14.0],[122.0,-14.5],
        [119.0,-18.5],[116.0,-20.0],[114.0,-22.0],[114.5,-26.0],
        [129.0,-26.0],[129.0,-13.5]
      ]]}},
      {type:"Feature",properties:{code:"TAS"},geometry:{type:"Polygon",coordinates:[[
        [144.8,-40.5],[145.0,-41.0],[145.5,-42.5],[147.0,-43.5],
        [148.5,-43.5],[149.0,-42.0],[148.5,-40.5],[147.0,-40.0],
        [145.5,-39.5],[144.8,-40.5]
      ]]}},
      {type:"Feature",properties:{code:"ACT"},geometry:{type:"Polygon",coordinates:[[
        [148.7,-35.1],[149.4,-35.1],[149.4,-35.9],[148.7,-35.9],[148.7,-35.1]
      ]]}},
    ]
  }
};
window.ADDON_DATA["australia-states"].areaKm2 = {"NSW":800642,"VIC":227416,"QLD":1730648,"WA":2529875,"SA":983482,"TAS":68401,"ACT":2358,"NT":1349129};
window.ADDON_DATA["australia-states"].totalAreaKm2 = 7688000;
