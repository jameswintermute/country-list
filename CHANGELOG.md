# Changelog

All notable changes to Country List are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-04-02

### Added
- Initial release
- **`start.py` launcher** — serves the app on `http://localhost:8420` via
  Python's built-in HTTP server (no install required); necessary because
  browsers block CDN fetches from `file://` URLs
- Natural Earth choropleth world map via D3.js v7 + world-atlas@2 TopoJSON,
  served from cdn.jsdelivr.net when launched via `start.py`
- Continent tabs with smooth animated zoom — each tab fills in only that
  continent; countries outside the active continent are dimmed
- ~250 countries and territories across Africa, Americas, Asia, Europe,
  Oceania, and Antarctica; includes Aruba, Falkland Islands, Hong Kong,
  Macau, Isle of Man, Guernsey, Jersey, Reunion, Canary Islands, and more
- Optional year-of-visit tracking — mark visited with no year, or record
  one or more specific years per place; years are individually removable
- Multi-person support — add family members; each person has independent
  visit data; home country is highlighted in blue on the map
- Auto-save to localStorage on every change (visits, years, new users)
- Rolling CSV backup per user kept in localStorage as data-loss protection
- **Data files auto-detect on startup** — `start.py` exposes `/api/data-files`;
  the app checks this at boot and shows an import banner if CSV or JSON files
  are found in `data/users/` that have not yet been imported
- Export CSV — per-person, ISO 8601 filename, optional years column
- Backup JSON — full session export (all users) for transfer between devices
- Import CSV — re-import a previously exported CSV; merges, never overwrites
- Import JSON — restore a full session backup; merges users and visits
- Filename-based user detection on CSV import
  (pattern: YYYY-MM-DD-country-list-First-Last.csv)
- About modal — version, licence, author, third-party credits
- GNU GPL v3 licence header in source file
- `data/users/` folder for personal backup files (gitignored)
- Per-continent sidebar stats (visited / total for countries and territories)
- Global stats bar (countries · territories · total)
- Map legend; free pan and scroll-zoom on the map
- Typeahead country search on setup and add-person screens
- Sidebar search filter across countries and territories

---

[1.0.0]: https://github.com/jameswintermute/country-list/releases/tag/v1.0.0

## [1.0.1] — 2026-04-02

### Fixed
- `start.py` `log_message` crash: `ValueError: invalid literal for int()` when
  `log_error` passed the message string rather than the HTTP status code in
  `args[1]`. Fixed to check `args[0]` with a `try/except` guard.

---

## [1.0.2] — 2026-04-02

### Fixed
- `start.py` favicon 404 loop: browser requests `/favicon.ico` on every page
  load; since no file existed this triggered `log_error` repeatedly, causing
  the `log_message` crash to fire on every request. Fixed by serving a minimal
  1×1 transparent PNG inline from the handler with a 24h cache header.
- Removed unused `csv` and `re` imports from `start.py`.

---

## [1.2.0] — 2026-04-02

### Added
- **Summary tab** — headline stat cards (countries visited, territories,
  countries remaining), per-continent progress bars with visited/total counts
  and percentage, and a years-active bar chart showing how many places were
  visited each year.
- **Inline year editing** — year pills in the detail panel are now editable
  input fields; click a year to change it in place. The × button still removes
  it entirely.
- **N. America / S. America split** — Americas is now two separate continent
  tabs. Mexico, Central America, the Caribbean and Canada are under N. America;
  all South American countries and their territories are under S. America.
  The map highlights both halves when either tab is active.

### Fixed
- **Iceland not appearing as visited on the map** — ISO numeric code 352
  was missing from the `N2A` lookup table, so Iceland's TopoJSON feature was
  never matched to the `IS` ISO2 code. Added `352:"IS"` to the map.


## [1.3.0] — 2026-04-03

### Added
- **"All" continent tab** — shows every country and territory in the sidebar
  list at once with a full-world map view; visited countries still highlighted
  green globally.
- **Andorra (AD)** — was missing from the places list entirely. Added to Europe.

### Fixed
- **Cyprus wrongly classified as Asia** — Cyprus (CY) was in the Asia bucket,
  causing it to appear under the Asia tab and not Europe. Moved to Europe.
  (Geographically in Asia Minor, but a EU member and universally European for
  travel counting purposes.)


## [1.3.1] — 2026-04-03

### Fixed
- **Toolbar / sidebar country count discrepancy** — toolbar showed 38 while
  sidebar showed 40 when "All" was active. Both now iterate `P` directly and
  check `u.visits[iso] !== undefined`, guaranteeing identical counts everywhere.
  The old toolbar code used `Object.keys(u.visits).includes(iso)` which could
  miss entries if any stored ISO didn't round-trip through the array filter
  in the same way.
- **start.py port-in-use handling** — instead of crashing with a traceback,
  automatically steps up to the next free port and prints a clear message.


## [1.3.2] — 2026-04-03

### Changed
- **Palestine → Palestinian Territories** — renamed to the more neutral term
  used by the UK Foreign Office and most travel references, and reclassified
  from country to territory. It retains its ISO2 code (PS) and map colouring.


## [1.3.3] — 2026-04-03

### Fixed
- **Crimea shown as Russian territory on the map** — the Natural Earth TopoJSON
  dataset (world-atlas 110m) uses a de facto policy, placing Crimea inside
  Russia's polygon because Russia physically controls it. This is legally
  incorrect: Crimea is internationally recognised as Ukrainian territory under
  UN General Assembly Resolution ES-11/4 (2022) and Resolution 68/262 (2014).
  Fixed by drawing a correctly-shaped Crimea overlay polygon on top of the map,
  attributed to Ukraine (UA). Clicking Crimea selects Ukraine. Crimea colours
  green when Ukraine is marked visited, blue when Ukraine is home.

### Notes
- The underlying Russia polygon still includes Crimea's geometry at the base
  layer (this is a limitation of the TopoJSON source data). The overlay fully
  covers it and takes precedence visually and interactively.


## [1.3.4] — 2026-04-03

### Added
- **Ukraine flag gradient fill** — when Ukraine is marked visited, its map
  shape fills with the Ukrainian flag colours: blue (#005BBB) top half,
  yellow (#FFD500) bottom half, via an SVG linearGradient. Crimea overlay
  uses the same gradient.
- **🇺🇦 flag pin on Ukraine** — a Ukrainian flag emoji is pinned permanently
  to Ukraine's geographic centroid on the map at all times, regardless of
  visited status. Clicking it selects Ukraine. Visible at all zoom levels.
- **Solidarity note in About modal** — states that Ukraine is shown with its
  internationally recognised borders including Crimea, citing UN General
  Assembly Resolutions 68/262 (2014) and ES-11/4 (2022), with "We stand
  with the Ukrainian people."
- **Ukraine entry in map legend** — shows the blue/yellow gradient swatch
  with 🇺🇦 label so the special colouring is explained.


## [1.4.0] — 2026-04-03

### Added
- **Multi-person compare mode** — when more than one person exists, the
  Summary tab automatically switches to a full comparison view:
  - **Side-by-side stat cards** — countries visited, % of world, and
    territories for each person, plus a shared count
  - **Side-by-side continent bars** — green bar for person 1, blue for
    person 2, on the same axis so differences are immediately visible
  - **Shared countries** — grid of every country both have visited
  - **Unique to each person** — two-column grid showing what each has
    visited that the other hasn't
  - **Bucket list** — countries neither person has visited, as a shared
    travel wishlist
  - **Overlaid year timeline** — green bars (person 1) and blue bars
    (person 2) side by side per year, showing whether travel patterns
    overlap or are independent

