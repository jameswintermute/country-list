# Country List

[![GPL-3.0 License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)](LICENSE)
[![Local First](https://img.shields.io/badge/local--first-green)](src/index.html)
[![Version](https://img.shields.io/badge/version-1.8.3-brightgreen)](CHANGELOG.md)
[![CI](https://github.com/jameswintermute/country-list/actions/workflows/ci.yml/badge.svg)](https://github.com/jameswintermute/country-list/actions/workflows/ci.yml)

**Track every country and territory you have visited over your lifetime.**

Country List is a simple, local-first application for recording travel history for yourself, your family, or anyone else you want to include.

It runs in your normal web browser, but your travel history is stored locally on your own computer. There is no account to create, no subscription, and no remote Country List service holding your data.

The application also creates rolling CSV backup files under `data/users/` while it is running.

> **You do not need to be a developer to use Country List.**
>
> The only prerequisite is **Python 3**. You do not need Git, Node.js, pip, a database, or any additional Python packages.

---

## Features

* **Interactive world map** — see visited countries at a glance
* **235 countries and territories** in the current data set
* **Optional year tracking** — record one or many visit years per place
* **Multiple people** — keep separate travel histories for family members
* **Family comparison views** — compare who has visited where
* **Sub-national add-ons**

  * US states
  * Canadian provinces and territories
  * Australian states and territories
  * UK nations
* **Automatic local saving**
* **Rolling CSV backups**
* **CSV import and export**
* **Complete JSON backup** including all profiles and add-ons
* **No account or cloud database**
* **No build process or software installation beyond Python**

---

# Getting started

## What you need

Country List requires:

* A Windows, macOS, or Linux computer
* A modern web browser such as Chrome, Firefox, Edge, or Safari
* **Python 3**
* An internet connection while using the map, because the current map libraries and map data are loaded from pinned versions on jsDelivr

Your actual travel history is **not** sent to jsDelivr.

You do **not** need:

* Git
* GitHub Desktop
* Node.js
* npm
* pip
* Docker
* A database
* A web-hosting account

---

# Windows 10 / Windows 11

## 1. Download Country List

Open the Country List GitHub page:

**https://github.com/jameswintermute/country-list**

Click:

**Code → Download ZIP**

Your browser will download a file similar to:

```text
country-list-main.zip
```

Open your **Downloads** folder, right-click the ZIP file and choose:

**Extract All...**

Choose somewhere convenient, such as your Documents folder.

> Do not run Country List directly from inside the ZIP file. Extract it first.

---

## 2. Check whether Python is installed

Open **Windows Terminal**, **PowerShell**, or **Command Prompt**.

An easy way on Windows 11 is:

1. Open the extracted `country-list-main` folder in File Explorer
2. Right-click an empty area inside the folder
3. Choose **Open in Terminal**

Type:

```powershell
python --version
```

If you see something similar to:

```text
Python 3.13.7
```

you already have Python and can continue to the next step.

You can also try:

```powershell
py --version
```

---

## 3. Install Python if required

If neither command works, download Python from the official Python website:

**https://www.python.org/downloads/**

Install the current Python 3 release for Windows.

After installation, close and reopen Windows Terminal or PowerShell and check again:

```powershell
python --version
```

or:

```powershell
py --version
```

You only need Python itself. There are no additional Python packages to install.

---

## 4. Start Country List

Make sure the terminal is open inside the extracted `country-list-main` folder.

Run:

```powershell
python start.py
```

If Windows does not recognise `python`, use:

```powershell
py start.py
```

You should see something similar to:

```text
Country List
Server : http://localhost:8420
```

Your normal web browser should open automatically.

If it does not, open:

```text
http://localhost:8420
```

in your browser.

---

## 5. Stop Country List

When you have finished, return to the terminal window and press:

```text
Ctrl+C
```

You can close the terminal afterwards.

Your data will still be there the next time you start Country List.

---

# Apple macOS

Country List works on both **Apple Silicon** and **Intel** Macs.

## 1. Download Country List

Open:

**https://github.com/jameswintermute/country-list**

Click:

**Code → Download ZIP**

The ZIP file will normally appear in your **Downloads** folder.

Double-click it to extract it.

You should now have a folder similar to:

```text
country-list-main
```

---

## 2. Check whether Python 3 is installed

Open **Terminal**.

You can find Terminal using Spotlight:

1. Press **Command + Space**
2. Type `Terminal`
3. Press **Return**

Then type:

```bash
python3 --version
```

If you see something similar to:

```text
Python 3.13.7
```

you already have Python 3.

---

## 3. Install Python if required

If `python3` is not available, download Python for macOS from:

**https://www.python.org/downloads/macos/**

Install the current Python 3 release.

After installation, close and reopen Terminal and check:

```bash
python3 --version
```

No additional Python packages are required.

---

## 4. Open the Country List folder in Terminal

There is an easy way to do this without typing the full folder location.

In Terminal, type:

```bash
cd 
```

Make sure there is a space after `cd`.

Now drag the `country-list-main` folder from Finder directly into the Terminal window.

Terminal will fill in the folder location for you.

Press **Return**.

For example, it may look something like:

```bash
cd /Users/james/Downloads/country-list-main
```

---

## 5. Start Country List

Run:

```bash
python3 start.py
```

Your browser should open automatically.

If it does not, open:

```text
http://localhost:8420
```

in Safari, Firefox, Chrome, or another browser.

---

## 6. Stop Country List

When you have finished, return to Terminal and press:

```text
Control+C
```

You can then close Terminal.

Your Country List data will remain available for the next time you start the application.

---

# Linux

Most Linux distributions already include Python 3.

## 1. Download Country List

Either download the ZIP from:

**https://github.com/jameswintermute/country-list**

using:

**Code → Download ZIP**

and extract it, or use Git if you prefer.

---

## 2. Check Python

Open a terminal and run:

```bash
python3 --version
```

If Python is not installed, install it using your Linux distribution's package manager.

For Ubuntu or Debian:

```bash
sudo apt install python3
```

For Fedora or RHEL-family systems:

```bash
sudo dnf install python3
```

---

## 3. Start Country List

Change into the extracted directory:

```bash
cd country-list-main
```

Then run:

```bash
python3 start.py
```

Your browser should open automatically at:

```text
http://localhost:8420
```

To stop Country List, press:

```text
Ctrl+C
```

---

# Starting Country List again later

You do **not** need to download or install everything again.

Simply return to the Country List folder and run `start.py` again.

### Windows

```powershell
python start.py
```

or:

```powershell
py start.py
```

### macOS / Linux

```bash
python3 start.py
```

Your existing profiles and travel history will be loaded automatically.

---

# Troubleshooting

## "python is not recognised" on Windows

Try:

```powershell
py --version
```

If that works, start Country List with:

```powershell
py start.py
```

If neither `python` nor `py` works, install Python from:

**https://www.python.org/downloads/**

---

## "python3: command not found" on macOS

Install the current Python 3 release from:

**https://www.python.org/downloads/macos/**

Then reopen Terminal.

---

## The browser did not open automatically

Country List normally opens your default browser automatically.

If it does not, open your browser manually and visit:

```text
http://localhost:8420
```

---

## Port 8420 is already in use

Country List will automatically try another nearby port.

Look at the terminal output for a line such as:

```text
Server : http://localhost:8421
```

Open the address shown there.

---

## The map does not appear

Country List currently downloads its map libraries and atlas data from pinned versions on jsDelivr.

Check that:

* your computer has an internet connection
* your firewall or network is not blocking jsDelivr
* JavaScript is enabled in your browser

Your saved Country List data itself remains local to your computer.

---

## Do not open `src/index.html` directly

Country List should be started using:

```text
start.py
```

Do not double-click `src/index.html` or open it using a `file://` address.

The launcher provides the local API used for:

* rolling CSV backups
* add-on discovery
* importing detected local data files
* other local application functions

---

# For Git users and developers

If you are comfortable with Git, you can clone Country List instead of downloading the ZIP.

```bash
git clone https://github.com/jameswintermute/country-list.git
cd country-list
python3 start.py
```

On Windows:

```powershell
git clone https://github.com/jameswintermute/country-list.git
cd country-list
python start.py
```

or:

```powershell
py start.py
```

There is no build step and no Python virtual environment is required.

---

# Data and privacy

Country List is designed as a **local-first** application.

The browser's `cl_u` localStorage record contains the authoritative browser copy of your Country List data.

Each profile contains its own country visits and add-on visits.

For example:

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

When Country List is running through `start.py`, it also keeps rolling per-user CSV files under:

```text
data/users/
```

These provide an additional local copy of your travel history.

The `data/users/` directory is deliberately excluded from Git and is not exposed by Country List's local web server.

The server listens only on your own computer using:

```text
127.0.0.1
```

It is not intended to be accessed from other computers on your network.

---

# Backing up your data

Country List provides two main export options.

## JSON backup

Use **Backup JSON** to create a complete backup containing:

* all profiles
* stable profile IDs
* country visits
* visit years
* add-on visits

This is the recommended format for backing up or transferring your complete Country List setup.

---

## CSV export

Each person can also be exported to CSV.

CSV files can be opened in spreadsheet applications and re-imported into Country List.

Country List validates profile information during import to prevent one person's records being accidentally merged into another person's profile.

---

# CSV format

Current CSV exports contain:

| Column        | Purpose                               |
| ------------- | ------------------------------------- |
| Name          | Country, territory, or add-on region  |
| ISO2          | Country ISO2 or add-on region code    |
| Continent     | Continent or add-on display name      |
| Type          | Country, territory, or add-on subtype |
| Years Visited | Semicolon-separated visit years       |
| Addon ID      | Stable add-on identifier              |
| User ID       | Stable profile identifier             |
| User First    | Profile first name                    |
| User Last     | Profile last name                     |
| Home ISO2     | Profile home country                  |

A CSV represents **one person**.

If Country List detects different profile details on different rows, the import is rejected rather than risking mixing two people's travel histories.

Older five-column Country List CSV files remain importable.

---

# Map coverage

Country List tracks some destinations that cannot be shown independently on the simplified world map.

**Kosovo** is explicitly matched to its Natural Earth geometry because the current world-atlas data does not provide its usual numeric ISO identifier.

**Canary Islands** is tracked as a travel destination in lists and statistics, but the current 110m Natural Earth atlas does not expose the islands as a separate country-style polygon from Spain. It therefore cannot currently be coloured separately on the world map.

---

# Project layout

```text
country-list/
├── addons/                    # optional sub-national trackers
├── data/
│   └── users/                 # local rolling CSV backups
├── docs/
│   └── DEVELOPMENT.md
├── src/
│   └── index.html             # application UI and client logic
├── .github/
│   └── workflows/
│       └── ci.yml             # automated tests
├── tests/
│   ├── check_inline_js.js
│   ├── test_app_logic.js
│   └── test_server.py
├── start.py                   # localhost launcher and API
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

# Tests

Developers can run the automated checks with:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/check_inline_js.js
node tests/test_app_logic.js
```

GitHub Actions runs the same checks for pushes and pull requests.

Node.js is needed **only to run the developer JavaScript tests**. It is **not required to use Country List**.

---

# Third-party credits

| Dependency      | Version | Licence       | Use                          |
| --------------- | ------: | ------------- | ---------------------------- |
| D3.js           |   7.9.0 | ISC           | Map projection and rendering |
| TopoJSON Client |   3.1.0 | ISC           | Topology decoding            |
| world-atlas     |   2.0.2 | ISC           | Natural Earth country shapes |
| us-atlas        |   3.0.1 | ISC           | US state shapes              |
| Natural Earth   |       — | Public domain | Underlying geographic data   |

---

# Licence

Country List — Copyright (C) 2026 James Wintermute

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [LICENSE](LICENSE).

---

*Your journeys are yours. Own them.*
