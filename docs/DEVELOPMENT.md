# Development notes

## Architecture

Country List deliberately has no framework, package manager, bundler or build
step. The UI/client logic lives in `src/index.html`; `start.py` provides a very
small localhost-only HTTP server and persistence API; optional sub-national
trackers live under `addons/`.

The application is **local-first**, rather than fully offline: D3, TopoJSON and
atlas data are fetched from pinned jsDelivr versions at runtime. Travel data is
not sent to those services.

## Launcher: `start.py`

```bash
python3 start.py         # opens http://localhost:8420
python3 start.py 9000    # custom port
```

Security boundaries are intentional:

- binds only to `127.0.0.1`
- serves static files only from `src/`
- does not expose `data/users/`, `.git/`, README files, or the repository root
- validates add-on folder requests against discovered add-ons
- restricts CSV filenames to a safe basename
- caps JSON request bodies at 5 MiB
- writes CSV files atomically with `os.replace`
- sends browser hardening headers
- requires the `Host` header to be localhost on the actual listening port and rejects cross-site `Origin` headers
- requires `application/json` for write/delete API requests

API routes:

| Route | Method | Purpose |
|---|---|---|
| `/api/data-files` | GET | list local CSV/JSON backups with change stamps |
| `/api/data-file/<filename>` | GET | read one validated local backup for the import banner |
| `/api/addons` | GET | list discovered add-on metadata |
| `/api/addon-data/<folder>` | GET | serve a validated add-on `data.js` |
| `/api/save-user` | POST | atomically write a rolling user CSV |
| `/api/delete-user` | DELETE | delete a rolling user CSV |

## Runtime dependencies

These are pinned rather than floating major-version URLs:

| Library | URL | Version |
|---|---|---:|
| D3.js | `https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js` | 7.9.0 |
| TopoJSON Client | `https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js` | 3.1.0 |
| world-atlas | `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json` | 2.0.2 |
| us-atlas | `https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json` | 3.0.1 |

Vendoring these four files under `src/` would be the next step if fully offline
operation becomes a requirement.

## Data model

`localStorage["cl_u"]` contains the authoritative users array. A user is
self-contained:

```js
{
  id: "...",
  first: "James",
  last: "Wintermute",
  country: "GB",
  visits: {
    GB: [],
    FR: [2019, 2023],
  },
  addons: {
    "uk-nations": {
      ENG: [],
      SCO: [2022],
    },
  },
}
```

The old `cl_addon_<addonId>_<userId>` storage format is migrated into
`user.addons` on load and the legacy keys are removed. Keeping add-on data in
the user object is important: JSON backup, CSV generation, profile deletion and
multi-user isolation all operate on the same state.

The earlier `localStorage["cl_csv_<userId>"]` CSV mirrors are redundant with
`cl_u` and consume the same browser storage quota, so v1.8.3 removes them during
load. When running through `start.py`, rolling CSV protection is kept under
`data/users/`. Disk filenames include the stable user ID
(`First-Last--<user-id>.csv`) so profiles with identical names cannot overwrite
one another. Name-only v1.8.1 rolling files are removed after a successful
ID-based save when that migration is unambiguous.

## Import validation

JSON imports are normalised before any merge occurs. Stable profile IDs are
preserved and used as the primary merge key, which keeps same-name profiles
separate. Current CSV exports also carry User ID; legacy CSVs fall back to an
unambiguous name/home-country match and are rejected if multiple profiles match.

CSV and JSON imports reject unknown home-country codes, discard unknown
country/territory visit keys, clamp visit years to `1900..current year`, and
deduplicate years. Current CSV files are one profile per file and are rejected
if identity metadata changes between rows. Add-on CSV rows must match an actual
region code in the installed add-on definition rather than merely matching a
syntactic identifier pattern.

CSV output doubles embedded quotes and prefixes cells beginning with `=`, `+`,
`-` or `@` to prevent spreadsheet formula execution.

## Map identifiers

`N2A` is the ISO-3166 numeric-to-alpha-2 mapping used to match world-atlas
features to the `P` place list. It is intentionally complete rather than a
hand-maintained subset. Kosovo is a special case: world-atlas 2.0.2 names the
feature but supplies no numeric identifier, so `featureISO()` maps that name to
`XK`. Some very small territories may still be absent from the 110m Natural
Earth geometry and therefore appear only in the sidebar. The Canary Islands
(`IC`) are one such list-only destination because the atlas does not separate
them from Spain.

## Add-ons

Each add-on folder contains:

```text
addons/<id>/
├── addon.json
└── data.js
```

`addon.json` is metadata. `data.js` is executable JavaScript and is therefore
trusted local code; only install add-ons you trust. The add-on `id` should match
its folder name.

All local add-on data definitions are loaded during application initialisation,
even when the UI toggle is disabled. This is intentional: backups must remain
complete regardless of which add-ons are currently visible.

## Tests

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/check_inline_js.js
node tests/test_app_logic.js
```

The server tests start an ephemeral localhost server and verify static-root
isolation, backup save/delete behaviour, path validation, add-on routing,
security headers, JSON content-type enforcement, listening-port Host checks,
cross-site request guards, import-file change stamps and favicon caching. The
JavaScript tests execute the persistence/import core in a Node VM and cover
multi-user add-on isolation, legacy migration, mixed-profile CSV rejection,
installed add-on region validation, year validation, CSV formula protection,
stable profile identity, collision-proof rolling filenames and atlas feature
resolution including Kosovo. `check_inline_js.js` compiles the complete inline
application script without executing it.

`.github/workflows/ci.yml` runs these tests and syntax checks on pushes to
`main`, pull requests and manual dispatches.

## Versioning

For a release, update:

1. the HTML header comment (`Country List vx.y.z`)
2. `<title>Country List vx.y.z</title>`
3. `const VERSION="x.y.z"`
4. the README version badge/examples when applicable
5. `CHANGELOG.md`
6. the Git tag

## Adding a country or territory

Each `P` entry is:

```js
["Display Name", "ISO2", "Continent", "flag emoji", "country|territory"]
```

Use a real ISO2 code where one exists. A place can still appear in the sidebar
without a corresponding 110m map polygon.
