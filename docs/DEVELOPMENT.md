# Development notes

## Architecture

Country List is intentionally a **single-file application** — the entire app
lives in `src/index.html`. There is no build step, no bundler, no framework,
and no npm dependencies to install.

This mirrors the approach used in the companion project
[vCard Studio](https://github.com/jameswintermute/vcard), which uses the same
offline-first, single-HTML-file model.

## Launcher: start.py

The app must be served over HTTP rather than opened as a `file://` URL because
browsers block `fetch()` calls to external CDNs (CDN requests for D3 and the
world-atlas TopoJSON fail silently under `file://`).

`start.py` uses Python's built-in `http.server` — no packages to install:

```bash
python3 start.py         # opens http://localhost:8420
python3 start.py 9000    # custom port
```

The launcher also:

- Scans `data/users/` for CSV/JSON files and prints any it finds to the terminal
- Exposes a `/api/data-files` endpoint that the app polls on startup to show
  the import banner

## External dependencies (CDN, loaded at runtime)

| Library        | URL                                                              | Version |
|----------------|------------------------------------------------------------------|---------|
| D3.js          | https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js                | 7.x     |
| TopoJSON       | https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js | 3.x |
| world-atlas    | https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json  | 2.x     |

All three are loaded from `cdn.jsdelivr.net`. A working internet connection is
required on first use. After that the browser caches both scripts and the
TopoJSON file.

## Data storage

| Store                      | What                                  | Persists across |
|----------------------------|---------------------------------------|-----------------|
| `localStorage["cl_u"]`     | Full users array (JSON)               | Browser sessions|
| `localStorage["cl_csv_ID"]`| Rolling CSV backup per user           | Browser sessions|

There is no server-side storage. Data lives entirely in the user's browser.

## Source structure inside index.html

```
<!-- GNU licence header -->
<html>
  <head>
    <style>          CSS variables, layout, component styles
    </style>
  </head>
  <body>
    <!-- HTML: header, setup screen, modals, app shell -->

    <script src="d3" />
    <script src="topojson" />
    <script>
      // ISO numeric → ISO2 map       (N2A)
      // Places array                 (P)
      // Continent bounding boxes     (CB)
      // ISO2 → continent lookup      (I2C)
      // Version constant             (VERSION)
      // State variables
      // Persist: save / load / exportJSON / importJSON / importCSV
      // User management
      // Continent tabs
      // Sidebar list
      // Select + detail panel
      // Stats
      // Auto-save / exportCSV
      // About modal
      // Map: initMap / drawMap / refreshColors / zoomTo
      // Typeahead
    </script>
  </body>
</html>
```

## Versioning

Version is set in two places — both must be updated on release:

1. `const VERSION="x.y.z"` in the `<script>` block
2. The `<title>` tag: `Country List vx.y.z`
3. The HTML comment block at the top of the file
4. `CHANGELOG.md` — add a new `## [x.y.z]` section
5. Git tag: `git tag -a vx.y.z -m "Release x.y.z"`

## Adding a country or territory

Each entry in the `P` array follows this format:

```js
["Display Name", "ISO2", "Continent", "flag emoji", "country|territory"],
```

The ISO2 code must match one of the numeric IDs in the `N2A` map for the
country to be coloured on the map. If it does not appear in Natural Earth's
110m dataset (e.g. very small territories), it will still appear in the
sidebar list but will not be highlighted on the map.

## Continent bounding boxes

The `CB` object controls the viewport each continent tab zooms to:

```js
const CB = {
  Europe: [-25, 34, 45, 72],   // [lon_west, lat_south, lon_east, lat_north]
  ...
};
```

Adjust these if the zoom on a particular continent feels off.
