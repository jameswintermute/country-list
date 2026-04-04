# Country List

[![GPL-3.0 License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)](LICENSE)
[![Offline First](https://img.shields.io/badge/offline-first-green)](src/index.html)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](CHANGELOG.md)

**Track every country and territory you have visited over your lifetime.**

A free, offline-first, single-file web app. Add family members and compare
your journeys side by side. No account, no server, no data ever leaves your
device.

---

## Features

- **Choropleth map** — Natural Earth map rendered with D3.js; zooms to the
  active continent automatically
- **Countries and territories** — ~250 entries including Antarctica, Aruba,
  Falkland Islands, Hong Kong, Macau, Isle of Man, Guernsey, Jersey, Reunion,
  Canary Islands, and more
- **Optional year tracking** — mark a place visited with or without recording
  the year(s); add multiple years per place
- **Multi-person** — add a spouse, children, or anyone else; each person gets
  their own tab and independent data
- **Auto-save** — every change is immediately written to browser localStorage;
  the latest CSV per person is kept as a rolling backup
- **Export CSV** — download your list at any time as
  `YYYY-MM-DD-country-list-FirstName-LastName.csv`
- **Backup JSON** — export all users in one file for transfer between devices
- **Import** — re-import a CSV or JSON backup; visits are merged, not
  overwritten, so no data is lost
- **No build step** — open `src/index.html` directly in any modern browser

---

## Getting started

```bash
git clone https://github.com/jameswintermute/country-list.git
cd country-list
python3 start.py
```

This opens `http://localhost:8420` in your default browser. The launcher is required (rather than opening `src/index.html` directly) because the map data loads from a CDN — browsers block CDN requests from `file://` URLs.

> **No dependencies to install.** Python 3's built-in `http.server` is all that is needed.

---

## Project layout

```
country-list/
├── src/
│   └── index.html          <- entire application (single file, no build step)
├── data/
│   └── users/              <- place exported CSV / JSON backups here
│                              (gitignored — your data stays private)
├── docs/
│   └── DEVELOPMENT.md      <- architecture notes and contributor guide
├── start.py                <- local HTTP launcher: python3 start.py
├── CHANGELOG.md
├── LICENSE
└── README.md
```

### data/users/ — your personal data folder

Drop exported CSV or JSON files into `data/users/` as a local backup alongside
the repo. This folder is listed in `.gitignore` so your travel history is never
accidentally committed to a public repository.

To restore: open the app, click **Import CSV** in the header, and select the
file. The app merges the imported data with anything already stored in your
browser, so importing is always safe.

---

## Data formats

### CSV (per-person export)

| Column        | Example          | Notes                              |
|---------------|------------------|------------------------------------|
| Name          | United Kingdom   | Country or territory name          |
| ISO2          | GB               | ISO 3166-1 alpha-2 code            |
| Continent     | Europe           | One of the six continent tabs      |
| Type          | country          | `country` or `territory`           |
| Years Visited | 2018; 2022       | Semicolon-separated; may be blank  |

Filename convention: `YYYY-MM-DD-country-list-FirstName-LastName.csv`

### JSON (full session backup)

```json
{
  "version": "1.0.0",
  "exported": "2026-04-02T10:00:00.000Z",
  "users": [
    {
      "id": "1743591234567",
      "first": "James",
      "last": "Wintermute",
      "country": "GB",
      "visits": {
        "GB": [],
        "FR": [2019, 2023],
        "JP": [2022]
      }
    }
  ]
}
```

Filename convention: `YYYY-MM-DD-country-list-all-users.json`

---

## Third-party credits

| Dependency    | Licence     | Use                           |
|---------------|-------------|-------------------------------|
| D3.js v7      | ISC         | Map projection and rendering  |
| TopoJSON v3   | ISC         | Topology decoding             |
| world-atlas@2 | ISC         | Natural Earth country shapes  |
| Natural Earth | Public domain | Underlying geographic data  |

---

## Licence

Country List — Copyright (C) 2026 James Wintermute

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

See LICENSE or https://www.gnu.org/licenses/gpl-3.0.txt

---

*Your journeys are yours. Own them.*
