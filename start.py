#!/usr/bin/env python3
"""
Country List — local launcher
Copyright (C) 2026 James Wintermute <jameswintermute@protonmail.ch>
GNU General Public License v3.0 or later

Usage:
    python3 start.py            # default port 8420
    python3 start.py 9000       # custom port
"""

import http.server
import json
import os
import re
import sys
import threading
import webbrowser
from pathlib import Path

PORT      = int(sys.argv[1]) if len(sys.argv) > 1 else 8420
ROOT      = Path(__file__).parent
DATA_USERS = ROOT / "data" / "users"
ADDONS_DIR = ROOT / "addons"

# ── Helpers ───────────────────────────────────────────────────────────────────

def scan_user_data():
    if not DATA_USERS.exists():
        DATA_USERS.mkdir(parents=True, exist_ok=True)
        return []
    return sorted(f for f in DATA_USERS.iterdir()
                  if f.suffix.lower() in (".csv", ".json") and f.is_file())

def scan_addons():
    """Return list of addon metadata dicts for every valid addon folder."""
    if not ADDONS_DIR.exists():
        return []
    addons = []
    for folder in sorted(ADDONS_DIR.iterdir()):
        meta = folder / "addon.json"
        data = folder / "data.js"
        if folder.is_dir() and meta.exists() and data.exists():
            try:
                info = json.loads(meta.read_text(encoding="utf-8"))
                info["_folder"] = folder.name
                addons.append(info)
            except Exception:
                pass
    return addons

def announce_startup(files, addons):
    if files:
        print("\n  Data files found in data/users/:")
        for f in files:
            print(f"    {f.name}")
        print("  These will be offered for import when the app opens.")
    if addons:
        print(f"\n  Addons available: {', '.join(a['name'] for a in addons)}")

# ── HTTP server ───────────────────────────────────────────────────────────────

_FAVICON = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000a49444154789c6260000000000200019db40bcd0000000049454e44ae426082"
)

class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        try:
            if int(args[0]) >= 400:
                super().log_message(fmt, *args)
        except (ValueError, IndexError):
            pass

    def do_GET(self):
        # Favicon
        if self.path == "/favicon.ico":
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(_FAVICON)))
            self.send_header("Cache-Control", "max-age=86400")
            self.end_headers()
            self.wfile.write(_FAVICON)
            return

        # Root → app
        if self.path in ("/", ""):
            self.path = "/src/index.html"
            super().do_GET()
            return

        # API: list data/users/ files
        if self.path == "/api/data-files":
            payload = json.dumps([f.name for f in scan_user_data()]).encode()
            self._json(200, payload)
            return

        # API: list available addons (metadata only, no map data)
        if self.path == "/api/addons":
            payload = json.dumps(scan_addons()).encode()
            self._json(200, payload)
            return

        # API: serve addon data.js
        # /api/addon-data/<folder-name>
        m = re.match(r'^/api/addon-data/([\w\-]+)$', self.path)
        if m:
            folder = m.group(1)
            # Sanitise — only allow known addon folders
            data_file = ADDONS_DIR / folder / "data.js"
            if data_file.exists():
                content = data_file.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "application/javascript")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
            return

        super().do_GET()

    def do_POST(self):
        # API: write a user CSV to data/users/
        if self.path == "/api/save-user":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                payload = json.loads(body)
                fname = payload.get("filename", "").strip()
                csv   = payload.get("csv", "")
                if not fname or not re.match(r'^[\w\- ]+\.csv$', fname):
                    raise ValueError(f"Invalid filename: {fname!r}")
                DATA_USERS.mkdir(parents=True, exist_ok=True)
                (DATA_USERS / fname).write_text(csv, encoding="utf-8")
                self._json(200, json.dumps({"ok": True, "file": fname}).encode())
            except Exception as exc:
                self._json(400, json.dumps({"ok": False, "error": str(exc)}).encode())
            return

        self.send_response(404)
        self.end_headers()

    def _json(self, code, payload):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def open_browser(port, delay=0.8):
    import time; time.sleep(delay)
    webbrowser.open(f"http://localhost:{port}")
    print(f"  Opening http://localhost:{port}")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.chdir(ROOT)
    print(f"\n  Country List")
    print(f"  ─────────────────────────────")

    files  = scan_user_data()
    addons = scan_addons()
    announce_startup(files, addons)

    import socket
    def port_free(p):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try: s.bind(("", p)); return True
            except OSError: return False

    if not port_free(PORT):
        alt = PORT + 1
        while not port_free(alt) and alt < PORT + 20:
            alt += 1
        print(f"\n  Port {PORT} in use — starting on {alt} instead.")
        print(f"  To stop old instance: kill $(lsof -t -i:{PORT})\n")
        PORT = alt

    print(f"\n  Server : http://localhost:{PORT}")
    print(f"  Root   : {ROOT}")

    httpd = http.server.HTTPServer(("", PORT), Handler)
    threading.Thread(target=open_browser, args=(PORT,), daemon=True).start()
    print("  Press Ctrl-C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
