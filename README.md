# Country List

[![GPL-3.0 License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)](LICENSE)
[![Local First](https://img.shields.io/badge/local--first-green)](src/index.html)
[![Version](https://img.shields.io/badge/version-1.8.1-brightgreen)](CHANGELOG.md)

**Track every country and territory you have visited over your lifetime.**

Country List is a local-first web app for recording travel history for one or
more people. Your visit data is stored in your browser and, when launched with
`start.py`, mirrored to per-user CSV files under `data/users/`. There is no
account and no remote application backend.

The map libraries and atlas files are currently loaded from **pinned jsDelivr
versions**, so an internet connection is required for map assets. Your travel
history itself is not sent to jsDelivr.

## Features

- **World map** — Natural Earth / world-atlas rendered with D3.js
- **Countries and territories** — 235 tracked places in the current data set
- **Optional year tracking** — one or many visit years per place
- **Multi-person** — independent profiles plus family comparison views
- **Sub-national add-ons** — US states, Canadian provinces and territories,
  Australian states and territories, and UK nations
- **Local persistence** — browser localStorage plus rolling CSV files
- **Backup JSON** — exports all users, including add-on visit history
- **CSV import/export** — merges visits rather than replacing existing history
- **No build step** — plain HTML/JavaScript and Python's standard library

## Getting started

```bash
git clone https://github.com/jameswintermute/country-list.git
cd country-list
python3 start.py
```

The launcher opens `http://localhost:8420`. It binds only to `127.0.0.1`, so the
application is not exposed to other devices on your LAN. If port 8420 is busy,
the launcher chooses the next available local port.

> **No Python packages are required.** `start.py` uses the standard library.

Do not open `src/index.html` directly with `file://`; the app uses local API
endpoints for add-on discovery and rolling disk backups.

## Project layout

```text
country-list/
├── addons/                  # optional sub-national trackers
├── data/
│   └── users/               # rolling per-user CSV backups (gitignored)
├── docs/
│   └── DEVELOPMENT.md
├── src/
│   └── index.html           # application UI and client logic
├── tests/
│   ├── test_app_logic.js
│   └── test_server.py
├── start.py                 # localhost launcher/API
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Data and privacy

The browser's `cl_u` localStorage record is the authoritative local application
state. Each user record contains both country visits and add-on visits:

```json
{
  "id": "1787137200000-123456",
  "first": "James",
  "last": "Wintermute",
  "country": "GB",
  "visits": {
    "GB": [],
    "FR": [2019, 2023]
  },
  "addons": {
    "uk-nations": {
      "ENG": [],
      "SCO": [2022]
    }
  }
}
```

Older installations that stored add-on visits in `cl_addon_<addon>_<user>`
localStorage keys are migrated automatically on first load.

`data/users/` is intentionally outside the web server's static document root.
The launcher exposes only the application under `src/` and explicit localhost
API routes. Removing a profile also requests deletion of its rolling CSV file.

### CSV format

Current exports contain these columns:

| Column | Purpose |
|---|---|
| Name | Country, territory or add-on region name |
| ISO2 | Country ISO2 or add-on region code |
| Continent | Continent or add-on display name |
| Type | `country`, `territory`, or add-on subtype |
| Years Visited | Semicolon-separated visit years |
| Addon ID | Stable add-on identifier; blank for country rows |
| User First | Profile first name |
| User Last | Profile last name |
| Home ISO2 | Profile home country |

The additional metadata lets a CSV round-trip without relying solely on its
filename. Older five-column exports remain importable.

### JSON backup

**Backup JSON** exports the complete `users` array, including add-on visits.
Imports validate names, home-country ISO codes, place codes and visit years,
and merge valid data into matching profiles.

## Tests

Run the standard-library server tests and JavaScript regression tests with:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/test_app_logic.js
```

GitHub Actions runs the same checks for pushes and pull requests.

## Third-party credits

| Dependency | Version | Licence | Use |
|---|---:|---|---|
| D3.js | 7.9.0 | ISC | Map projection and rendering |
| TopoJSON Client | 3.1.0 | ISC | Topology decoding |
| world-atlas | 2.0.2 | ISC | Natural Earth country shapes |
| us-atlas | 3.0.1 | ISC | US state shapes |
| Natural Earth | — | Public domain | Underlying geographic data |

## Licence

Country List — Copyright (C) 2026 James Wintermute

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

See [LICENSE](LICENSE).

---

*Your journeys are yours. Own them.*
