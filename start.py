#!/usr/bin/env python3
"""
Country List — local launcher
Copyright (C) 2026 James Wintermute <jameswintermute@protonmail.ch>
GNU General Public License v3.0 or later
https://github.com/jameswintermute/country-list

Opens src/index.html via a local HTTP server so that:
  - CDN resources (D3, TopoJSON, world-atlas) load correctly
  - The data/users/ folder can be scanned for CSV/JSON backups
  - No browser security warnings from file:// protocol

Usage:
    python3 start.py            # default port 8420
    python3 start.py 9000       # custom port
"""

import http.server
import json
import os
import sys
import threading
import webbrowser
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8420
ROOT = Path(__file__).parent
DATA_USERS = ROOT / "data" / "users"

# ── Detect backup files in data/users/ ───────────────────────────────────────

def scan_user_data():
    """Return list of (filename, path) for CSV/JSON files in data/users/."""
    if not DATA_USERS.exists():
        DATA_USERS.mkdir(parents=True, exist_ok=True)
        return []
    files = []
    for f in sorted(DATA_USERS.iterdir()):
        if f.suffix.lower() in (".csv", ".json") and f.is_file():
            files.append(f)
    return files


def announce_data_files(files):
    if not files:
        return
    print("\n  Data files found in data/users/:")
    for f in files:
        print(f"    {f.name}")
    print("\n  To import: open the app, click '↑ Import CSV' or '↑ Import JSON'")
    print("  and select the file from data/users/\n")


# ── HTTP server ───────────────────────────────────────────────────────────────

# Minimal 1×1 transparent PNG favicon, base64-encoded — avoids 404 noise
_FAVICON = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000a49444154789c6260000000000200019db40bcd0000000049454e44ae426082"
)

class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Prevent browser caching of app files so updates are always visible
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        # args from log_message: (format, code, message, ...)
        # args from log_error:   (format, code, message)
        # We only want to print actual HTTP error responses, not asset 404s
        try:
            code = int(args[0])
            if code >= 400:
                super().log_message(fmt, *args)
        except (ValueError, IndexError):
            pass  # swallow anything that doesn't parse cleanly

    def do_GET(self):
        # Serve favicon inline — prevents noisy 404 loop
        if self.path in ("/favicon.ico",):
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(_FAVICON)))
            self.send_header("Cache-Control", "max-age=86400")
            self.end_headers()
            self.wfile.write(_FAVICON)
            return

        # Serve / as src/index.html
        if self.path in ("/", ""):
            self.path = "/src/index.html"
            super().do_GET()
            return

        # API: return list of files in data/users/ as JSON
        if self.path == "/api/data-files":
            files = scan_user_data()
            payload = json.dumps([f.name for f in files]).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)
            return

        super().do_GET()


def open_browser(port, delay=0.8):
    """Open default browser after a short delay."""
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

    # Try the requested port; if busy, find the next free one
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
        print(f"  Port {PORT} is already in use (old instance still running?).")
        print(f"  Starting on port {alt} instead.")
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
