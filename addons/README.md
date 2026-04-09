# Country List — Addons

Addons extend the app with sub-national regions (states, provinces, nations)
for specific countries. They are **opt-in** and entirely secondary to the
global country tracking which remains the core purpose of the app.

## How to enable an addon

1. Run `start.py` and open the app
2. Click **Addons** at the bottom of the sidebar (collapsed by default)
3. Tick the addon you want — it loads immediately

## How addons work

Each addon lives in its own subfolder and contains two files:

| File | Purpose |
|------|---------|
| `addon.json` | Metadata: name, description, country ISO, icon, version |
| `data.js` | Region list + map data, loaded dynamically by the app |

The app never mixes addon regions with sovereign nations in the headline count.
Addon totals are always shown separately: *"40 countries · 8 territories · 32 US states"*

## Available addons

| Folder | Regions | Map source |
|--------|---------|------------|
| `us-states/` | 50 US states + DC | us-atlas@3 (US Census Bureau) |
| `canada-provinces/` | 10 provinces + 3 territories | Embedded GeoJSON |
| `australia-states/` | 6 states + 2 territories | Embedded GeoJSON |
| `uk-nations/` | England, Scotland, Wales, N. Ireland | Embedded GeoJSON |

## Adding your own addon

Copy an existing addon folder and edit `addon.json` and `data.js`.
The app will discover it automatically on next restart.

`data.js` must assign to `window.ADDON_DATA` before the script ends:

```js
window.ADDON_DATA = {
  id: "my-addon",          // must match folder name
  regions: [
    // [name, code, flag/emoji, subtype]
    ["Region Name", "CODE", "🏴", "state"],
  ],
  // For map rendering — either a CDN URL or inline GeoJSON
  mapType: "geojson",      // "geojson" | "us-albers"
  mapData: { /* GeoJSON FeatureCollection */ },
  // Function to match a feature to a region code
  featureCode: f => f.properties.code,
  color: "#2dd4bf",        // teal — distinct from sovereign green
};
```
