#!/usr/bin/env python3
"""
Country List — local launcher
Copyright (C) 2026 James Wintermute <jameswintermute@protonmail.ch>
GNU General Public License v3.0 or later
https://github.com/jameswintermute/country-list

Opens src/index.html via a local HTTP server so that:
  - CDN resources (D3, TopoJSON, world-atlas) load correctly
  - The data/users/ folder can be scanned for CSV/JSON backups
  - User CSV files are written automatically on every change
  - No browser security warnings from file:// protocol

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

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8420
ROOT = Path(__file__).parent
DATA_USERS = ROOT / "data" / "users"

# ── Detect backup files in data/users/ ───────────────────────────────────────

def scan_user_data():
    """Return list of Path objects for CSV/JSON files in data/users/."""
    if not DATA_USERS.exists():
        DATA_USERS.mkdir(parents=True, exist_ok=True)
        return []
    return sorted(
        f for f in DATA_USERS.iterdir()
        if f.suffix.lower() in (".csv", ".json") and f.is_file()
    )


def announce_data_files(files):
    if not files:
        return
    print("\n  Data files found in data/users/:")
    for f in files:
        print(f"    {f.name}")
    print("\n  These will be offered for import when the app opens.\n")


# ── HTTP server ───────────────────────────────────────────────────────────────

# Minimal 1×1 transparent PNG favicon — prevents noisy 404 loop
_FAVICON = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000a49444154789c6260000000000200019db40bcd0000000049454e44ae426082"
)

class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Prevent browser caching so updates are always visible
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        try:
            code = int(args[0])
            if code >= 400:
                super().log_message(fmt, *args)
        except (ValueError, IndexError):
            pass

    def do_GET(self):
        # Favicon — serve inline, cache for a day
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

        # API: list files in data/users/
        if self.path == "/api/data-files":
            files = scan_user_data()
            payload = json.dumps([f.name for f in files]).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        super().do_GET()

    def do_POST(self):
        # API: write a user CSV file to data/users/
        if self.path == "/api/save-user":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                payload = json.loads(body)
                fname = payload.get("filename", "").strip()
                csv   = payload.get("csv", "")

                # Sanitise filename — only safe characters allowed
                if not fname or not re.match(r'^[\w\- ]+\.csv$', fname):
                    raise ValueError(f"Invalid filename: {fname!r}")

                DATA_USERS.mkdir(parents=True, exist_ok=True)
                (DATA_USERS / fname).write_text(csv, encoding="utf-8")

                resp = json.dumps({"ok": True, "file": fname}).encode()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)

            except Exception as exc:
                err = json.dumps({"ok": False, "error": str(exc)}).encode()
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            return

        self.send_response(404)
        self.end_headers()


def open_browser(port, delay=0.8):
    import time
    time.sleep(delay)
    url = f"http://localhost:{port}"
    print(f"  Opening {url}")
    webbrowser.open(url)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.chdir(ROOT)

    print(f"\n  Country List")
    print(f"  ─────────────────────────────")

    files = scan_user_data()
    announce_data_files(files)

    # Try the requested port; step up if busy
    import socket
    def port_free(p):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("", p))
                return True
            except OSError:
                return False

    if not port_free(PORT):
        alt = PORT + 1
        while not port_free(alt) and alt < PORT + 20:
            alt += 1
        print(f"  Port {PORT} is in use — starting on {alt} instead.")
        print(f"  To stop the old instance: kill $(lsof -t -i:{PORT})\n")
        PORT = alt

    print(f"  Server : http://localhost:{PORT}")
    print(f"  Root   : {ROOT}")

    httpd = http.server.HTTPServer(("", PORT), Handler)

    t = threading.Thread(target=open_browser, args=(PORT,), daemon=True)
    t.start()

    print("  Press Ctrl-C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
