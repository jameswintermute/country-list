// Australian States & Territories addon
// Accurate simplified boundaries
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
      {type:"Feature",properties:{code:"NSW"},geometry:{type:"Polygon",coordinates:[[[141.0,-34.0],[141.0,-29.0],[150.5,-28.2],[153.6,-28.6],[153.6,-37.5],[150.7,-38.5],[148.3,-37.8],[144.8,-38.0],[141.0,-34.0]]]}},
      {type:"Feature",properties:{code:"VIC"},geometry:{type:"Polygon",coordinates:[[[141.0,-34.0],[144.8,-38.0],[148.3,-37.8],[150.7,-38.5],[149.9,-37.5],[141.0,-37.5],[141.0,-34.0]]]}},
      {type:"Feature",properties:{code:"QLD"},geometry:{type:"Polygon",coordinates:[[[138.0,-26.0],[138.0,-29.0],[141.0,-29.0],[141.0,-22.0],[138.0,-17.0],[136.0,-14.5],[138.8,-14.8],[141.6,-12.7],[145.4,-14.9],[148.8,-20.3],[153.6,-28.6],[150.5,-28.2],[141.0,-29.0],[138.0,-26.0]]]}},
      {type:"Feature",properties:{code:"WA"},geometry:{type:"Polygon",coordinates:[[[129.0,-13.5],[129.0,-35.0],[126.0,-34.0],[114.0,-22.0],[114.0,-35.0],[129.0,-35.0],[129.0,-26.0],[138.0,-26.0],[138.0,-17.0],[129.0,-13.5]]]}},
      {type:"Feature",properties:{code:"SA"},geometry:{type:"Polygon",coordinates:[[[129.0,-26.0],[129.0,-35.0],[141.0,-35.0],[141.0,-34.0],[141.0,-29.0],[138.0,-29.0],[138.0,-26.0],[129.0,-26.0]]]}},
      {type:"Feature",properties:{code:"TAS"},geometry:{type:"Polygon",coordinates:[[[144.5,-40.6],[145.3,-42.2],[148.3,-43.6],[148.5,-41.4],[147.8,-40.0],[144.5,-40.6]]]}},
      {type:"Feature",properties:{code:"ACT"},geometry:{type:"Polygon",coordinates:[[[148.7,-35.1],[148.7,-35.9],[149.4,-35.9],[149.4,-35.1],[148.7,-35.1]]]}},
      {type:"Feature",properties:{code:"NT"},geometry:{type:"Polygon",coordinates:[[[129.0,-13.5],[138.0,-17.0],[138.0,-26.0],[129.0,-26.0],[129.0,-13.5]]]}},
    ]
  }
};
