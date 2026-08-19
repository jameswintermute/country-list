import http.client
import json
import threading
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

import start


class ServerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = TemporaryDirectory()
        self.old_data_users = start.DATA_USERS
        start.DATA_USERS = Path(self.tmp.name) / "users"
        start.DATA_USERS.mkdir(parents=True)
        self.httpd = start.http.server.ThreadingHTTPServer((start.HOST, 0), start.Handler)
        self.port = self.httpd.server_address[1]
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        start.DATA_USERS = self.old_data_users
        self.tmp.cleanup()

    def request(self, method, path, body=None, headers=None):
        conn = http.client.HTTPConnection(start.HOST, self.port, timeout=3)
        conn.request(method, path, body=body, headers=headers or {})
        res = conn.getresponse()
        data = res.read()
        headers_out = dict(res.getheaders())
        conn.close()
        return res.status, headers_out, data

    def test_root_serves_app_but_repo_files_are_not_exposed(self):
        status, headers, body = self.request("GET", "/")
        self.assertEqual(status, 200)
        self.assertIn(b"Country List v1.8.3", body)
        self.assertEqual(headers.get("X-Frame-Options"), "DENY")
        self.assertEqual(headers.get("Cross-Origin-Opener-Policy"), "same-origin")
        self.assertEqual(headers.get("Cross-Origin-Resource-Policy"), "same-origin")
        self.assertIn("geolocation=()", headers.get("Permissions-Policy", ""))
        self.assertEqual(headers.get("X-Robots-Tag"), "noindex, nofollow")

        for path in ("/README.md", "/data/users/private.csv", "/.git/config", "/../README.md"):
            status, _, _ = self.request("GET", path)
            self.assertEqual(status, 404, path)

    def test_data_file_read_requires_explicit_validated_api_route(self):
        target = start.DATA_USERS / "2026-08-19-country-list-James-Wintermute.csv"
        target.write_text('"Name","ISO2"\n"France","FR"\n', encoding="utf-8")
        status, _, body = self.request("GET", "/api/data-file/2026-08-19-country-list-James-Wintermute.csv")
        self.assertEqual(status, 200)
        self.assertIn(b'"France","FR"', body)

        status, _, _ = self.request("GET", "/data/users/2026-08-19-country-list-James-Wintermute.csv")
        self.assertEqual(status, 404)
        status, _, _ = self.request("GET", "/api/data-file/..%2FREADME.md")
        self.assertEqual(status, 404)


    def test_data_file_manifest_stamp_changes_when_file_changes(self):
        target = start.DATA_USERS / "trip.csv"
        target.write_text("one", encoding="utf-8")
        status, _, body = self.request("GET", "/api/data-files")
        self.assertEqual(status, 200)
        first = json.loads(body)
        self.assertEqual(first[0]["name"], "trip.csv")
        first_stamp = first[0]["stamp"]

        target.write_text("two-two", encoding="utf-8")
        status, _, body = self.request("GET", "/api/data-files")
        self.assertEqual(status, 200)
        second = json.loads(body)
        self.assertNotEqual(second[0]["stamp"], first_stamp)

    def test_favicon_has_one_cache_policy(self):
        status, headers, body = self.request("GET", "/favicon.ico")
        self.assertEqual(status, 200)
        self.assertGreater(len(body), 0)
        self.assertEqual(headers.get("Cache-Control"), "public, max-age=86400")
        self.assertNotIn("Pragma", headers)

    def test_save_and_delete_user_backup(self):
        payload = json.dumps({"filename": "James-Wintermute.csv", "csv": '"Name","ISO2"\n'}).encode()
        status, _, body = self.request(
            "POST", "/api/save-user", payload, {"Content-Type": "application/json", "Content-Length": str(len(payload))}
        )
        self.assertEqual(status, 200, body)
        target = start.DATA_USERS / "James-Wintermute.csv"
        self.assertTrue(target.exists())

        delete = json.dumps({"filename": "James-Wintermute.csv"}).encode()
        status, _, body = self.request(
            "DELETE", "/api/delete-user", delete, {"Content-Type": "application/json", "Content-Length": str(len(delete))}
        )
        self.assertEqual(status, 200, body)
        self.assertFalse(target.exists())

    def test_filename_traversal_is_rejected(self):
        for filename in ("../secret.csv", "sub/secret.csv", "bad.csv.txt"):
            payload = json.dumps({"filename": filename, "csv": "x"}).encode()
            status, _, _ = self.request(
                "POST", "/api/save-user", payload,
                {"Content-Type": "application/json", "Content-Length": str(len(payload))},
            )
            self.assertEqual(status, 400, filename)


    def test_local_request_guards_block_cross_site_writes(self):
        payload = json.dumps({"filename": "James-Wintermute.csv", "csv": "x"}).encode()

        status, _, _ = self.request(
            "POST", "/api/save-user", payload,
            {
                "Content-Type": "text/plain",
                "Content-Length": str(len(payload)),
            },
        )
        self.assertEqual(status, 415)

        status, _, _ = self.request(
            "POST", "/api/save-user", payload,
            {
                "Content-Type": "application/json",
                "Content-Length": str(len(payload)),
                "Origin": "https://evil.example",
            },
        )
        self.assertEqual(status, 403)

        status, _, _ = self.request(
            "GET", "/api/data-files", headers={"Host": "evil.example"}
        )
        self.assertEqual(status, 403)

        status, _, _ = self.request(
            "GET", "/api/data-files", headers={"Host": f"{start.HOST}:1"}
        )
        self.assertEqual(status, 403)

    def test_same_origin_json_write_is_allowed(self):
        payload = json.dumps({"filename": "James-Wintermute.csv", "csv": "x"}).encode()
        host = f"{start.HOST}:{self.port}"
        status, _, body = self.request(
            "POST", "/api/save-user", payload,
            {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": str(len(payload)),
                "Origin": f"http://{host}",
                "Host": host,
            },
        )
        self.assertEqual(status, 200, body)

    def test_request_body_limit(self):
        # The server rejects based on Content-Length before reading the body.
        status, _, body = self.request(
            "POST", "/api/save-user", b"{}",
            {"Content-Type": "application/json", "Content-Length": str(start.MAX_BODY_BYTES + 1)},
        )
        self.assertEqual(status, 400, body)

    def test_addon_data_only_allows_discovered_folders(self):
        status, _, body = self.request("GET", "/api/addons")
        self.assertEqual(status, 200)
        addons = json.loads(body)
        self.assertGreaterEqual(len(addons), 4)

        status, _, body = self.request("GET", "/api/addon-data/us-states")
        self.assertEqual(status, 200)
        self.assertIn(b'window.ADDON_DATA["us-states"]', body)

        status, _, _ = self.request("GET", "/api/addon-data/not-a-real-addon")
        self.assertEqual(status, 404)


if __name__ == "__main__":
    unittest.main()
