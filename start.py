#!/usr/bin/env python3
"""
Country List — local launcher
Copyright (C) 2026 James Wintermute <jameswintermute@protonmail.ch>
GNU General Public License v3.0 or later

Usage:
    python3 start.py            # default port 8420
    python3 start.py 9000       # custom port
"""

from __future__ import annotations

import http.server
import json
import os
import re
import socket
import sys
import tempfile
import threading
import webbrowser
from pathlib import Path
from urllib.parse import unquote, urlsplit

HOST = "127.0.0.1"
DEFAULT_PORT = 8420
MAX_BODY_BYTES = 5 * 1024 * 1024
ROOT = Path(__file__).resolve().parent
SRC_DIR = ROOT / "src"
DATA_USERS = ROOT / "data" / "users"
ADDONS_DIR = ROOT / "addons"
_FILENAME_RE = re.compile(r"^[\w-]+\.csv$", re.UNICODE)
_DATA_FILENAME_RE = re.compile(r"^[\w-]+\.(?:csv|json)$", re.IGNORECASE | re.UNICODE)
_ADDON_FOLDER_RE = re.compile(r"^[\w-]+$", re.UNICODE)
_ALLOWED_HOSTS = {"localhost", "127.0.0.1"}


def parse_port(argv: list[str]) -> int:
    if len(argv) <= 1:
        return DEFAULT_PORT
    try:
        port = int(argv[1])
    except ValueError as exc:
        raise SystemExit(f"Invalid port: {argv[1]!r}") from exc
    if not 1 <= port <= 65535:
        raise SystemExit("Port must be between 1 and 65535")
    return port


PORT = DEFAULT_PORT


# ── Helpers ───────────────────────────────────────────────────────────────────

def scan_user_data() -> list[Path]:
    DATA_USERS.mkdir(parents=True, exist_ok=True)
    return sorted(
        f
        for f in DATA_USERS.iterdir()
        if f.is_file() and f.suffix.lower() in (".csv", ".json")
    )


def scan_addons() -> list[dict]:
    """Return metadata for each well-formed addon folder."""
    if not ADDONS_DIR.exists():
        return []
    addons: list[dict] = []
    for folder in sorted(ADDONS_DIR.iterdir()):
        meta = folder / "addon.json"
        data = folder / "data.js"
        if not (folder.is_dir() and meta.is_file() and data.is_file()):
            continue
        try:
            info = json.loads(meta.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if not isinstance(info, dict):
            continue
        addon_id = info.get("id")
        name = info.get("name")
        if (
            not _ADDON_FOLDER_RE.fullmatch(folder.name)
            or addon_id != folder.name
            or not isinstance(name, str)
            or not name.strip()
        ):
            continue
        info["_folder"] = folder.name
        addons.append(info)
    return addons


def announce_startup(files: list[Path], addons: list[dict]) -> None:
    if files:
        print("\n  Data files found in data/users/:")
        for file in files:
            print(f"    {file.name}")
        print("  These will be offered for import when the app opens.")
    if addons:
        names = [str(a.get("name", a.get("_folder", "unknown"))) for a in addons]
        print(f"\n  Addons available: {', '.join(names)}")


def port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.bind((HOST, port))
            return True
        except OSError:
            return False


def choose_port(preferred: int, attempts: int = 20) -> int:
    for port in range(preferred, min(preferred + attempts, 65535) + 1):
        if port_free(port):
            return port
    raise SystemExit(
        f"No free localhost port found between {preferred} and "
        f"{min(preferred + attempts, 65535)}"
    )


# ── HTTP server ───────────────────────────────────────────────────────────────

_FAVICON = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000a49444154789c6260000000000200019db40bcd0000000049454e44ae426082"
)


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serve only the web UI plus a small, explicit localhost API."""

    def __init__(self, *args, **kwargs):
        # Deliberately do not expose the repository root. In particular,
        # data/users/ and .git/ must never be reachable over HTTP.
        super().__init__(*args, directory=str(SRC_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "connect-src 'self' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; object-src 'none'; base-uri 'none'; "
            "frame-ancestors 'none'",
        )
        super().end_headers()

    def log_message(self, fmt, *args) -> None:
        try:
            if int(args[0]) >= 400:
                super().log_message(fmt, *args)
        except (ValueError, IndexError, TypeError):
            pass

    def _allow_request(self, *, require_json: bool = False) -> bool:
        host = self.headers.get("Host", "").strip()
        try:
            host_name = urlsplit(f"//{host}").hostname
        except ValueError:
            host_name = None
        if host_name not in _ALLOWED_HOSTS:
            self.send_error(403, "Localhost Host header required")
            return False

        origin = self.headers.get("Origin")
        if origin:
            try:
                parsed_origin = urlsplit(origin)
            except ValueError:
                parsed_origin = None
            if (
                parsed_origin is None
                or parsed_origin.scheme != "http"
                or parsed_origin.hostname not in _ALLOWED_HOSTS
                or parsed_origin.netloc.lower() != host.lower()
            ):
                self.send_error(403, "Cross-site request rejected")
                return False

        if require_json:
            content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
            if content_type != "application/json":
                self.send_error(415, "application/json required")
                return False
        return True

    def do_GET(self) -> None:
        if not self._allow_request():
            return
        request_path = urlsplit(self.path).path
        if request_path == "/favicon.ico":
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(_FAVICON)))
            self.send_header("Cache-Control", "max-age=86400")
            self.end_headers()
            self.wfile.write(_FAVICON)
            return

        if request_path in ("/", ""):
            self.path = "/index.html"
            super().do_GET()
            return

        if request_path == "/api/data-files":
            payload = json.dumps([f.name for f in scan_user_data()]).encode()
            self._json(200, payload)
            return

        data_match = re.fullmatch(r"/api/data-file/([^/]+)", request_path)
        if data_match:
            try:
                filename = self._validate_data_filename(unquote(data_match.group(1)))
                target = DATA_USERS / filename
                content = target.read_bytes()
            except (ValueError, OSError):
                self.send_error(404)
                return
            content_type = "application/json" if target.suffix.lower() == ".json" else "text/csv"
            self.send_response(200)
            self.send_header("Content-Type", f"{content_type}; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        if request_path == "/api/addons":
            payload = json.dumps(scan_addons()).encode()
            self._json(200, payload)
            return

        match = re.fullmatch(r"/api/addon-data/([\w-]+)", request_path)
        if match and _ADDON_FOLDER_RE.fullmatch(match.group(1)):
            folder = match.group(1)
            known_folders = {a.get("_folder") for a in scan_addons()}
            if folder not in known_folders:
                self.send_error(404)
                return
            data_file = ADDONS_DIR / folder / "data.js"
            try:
                content = data_file.read_bytes()
            except OSError:
                self.send_error(404)
                return
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        # Any other request is resolved relative to SRC_DIR only.
        super().do_GET()

    def do_POST(self) -> None:
        if not self._allow_request(require_json=True):
            return
        if urlsplit(self.path).path != "/api/save-user":
            self.send_error(404)
            return

        temp_path: Path | None = None
        try:
            payload = self._read_json_body()
            filename = self._validate_filename(payload.get("filename"))
            csv_text = payload.get("csv", "")
            if not isinstance(csv_text, str):
                raise ValueError("csv must be a string")

            DATA_USERS.mkdir(parents=True, exist_ok=True)
            target = DATA_USERS / filename
            fd, temp_name = tempfile.mkstemp(
                prefix=f".{filename}.", suffix=".tmp", dir=DATA_USERS
            )
            temp_path = Path(temp_name)
            with os.fdopen(fd, "w", encoding="utf-8", newline="") as handle:
                handle.write(csv_text)
            os.replace(temp_path, target)
            temp_path = None
            response = {"ok": True, "file": filename}
            self._json(200, json.dumps(response).encode())
        except (ValueError, OSError, json.JSONDecodeError) as exc:
            self._json(400, json.dumps({"ok": False, "error": str(exc)}).encode())
        finally:
            if temp_path is not None:
                try:
                    temp_path.unlink()
                except FileNotFoundError:
                    pass

    def do_DELETE(self) -> None:
        if not self._allow_request(require_json=True):
            return
        if urlsplit(self.path).path != "/api/delete-user":
            self.send_error(404)
            return

        try:
            payload = self._read_json_body()
            filename = self._validate_filename(payload.get("filename"))
            target = DATA_USERS / filename
            try:
                target.unlink()
                deleted = True
            except FileNotFoundError:
                deleted = False
            self._json(
                200,
                json.dumps({"ok": True, "file": filename, "deleted": deleted}).encode(),
            )
        except (ValueError, OSError, json.JSONDecodeError) as exc:
            self._json(400, json.dumps({"ok": False, "error": str(exc)}).encode())

    def _read_json_body(self) -> dict:
        raw_length = self.headers.get("Content-Length", "0")
        try:
            length = int(raw_length)
        except ValueError as exc:
            raise ValueError("Invalid Content-Length") from exc
        if length < 0 or length > MAX_BODY_BYTES:
            raise ValueError(f"Request body exceeds {MAX_BODY_BYTES} bytes")
        body = self.rfile.read(length)
        payload = json.loads(body or b"{}")
        if not isinstance(payload, dict):
            raise ValueError("JSON body must be an object")
        return payload

    @staticmethod
    def _validate_data_filename(value) -> str:
        if not isinstance(value, str):
            raise ValueError("filename must be a string")
        filename = value.strip()
        if not _DATA_FILENAME_RE.fullmatch(filename):
            raise ValueError(f"Invalid data filename: {filename!r}")
        return filename

    @staticmethod
    def _validate_filename(value) -> str:
        if not isinstance(value, str):
            raise ValueError("filename must be a string")
        filename = value.strip()
        if not _FILENAME_RE.fullmatch(filename):
            raise ValueError(f"Invalid filename: {filename!r}")
        return filename

    def _json(self, code: int, payload: bytes) -> None:
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def open_browser(port: int, delay: float = 0.8) -> None:
    import time

    time.sleep(delay)
    url = f"http://localhost:{port}"
    webbrowser.open(url)
    print(f"  Opening {url}")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n  Country List")
    print("  ─────────────────────────────")

    files = scan_user_data()
    addons = scan_addons()
    announce_startup(files, addons)

    preferred_port = parse_port(sys.argv)
    selected_port = choose_port(preferred_port)
    if selected_port != preferred_port:
        print(f"\n  Port {preferred_port} in use — starting on {selected_port} instead.")
        print(f"  To stop old instance: kill $(lsof -t -i:{preferred_port})\n")

    print(f"\n  Server : http://localhost:{selected_port}")
    print("  Access : localhost only")
    print(f"  Root   : {SRC_DIR}")

    httpd = http.server.ThreadingHTTPServer((HOST, selected_port), Handler)
    threading.Thread(
        target=open_browser, args=(selected_port,), daemon=True
    ).start()
    print("  Press Ctrl-C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
    finally:
        httpd.server_close()
