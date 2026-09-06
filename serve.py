#!/usr/bin/env python3
"""Local host for the FySim physics tool.

Serves the static front-end and the small scene API the tool GUI expects.
Scenes live in a SQLite file next to this script, so nothing outside the
standard library is needed.
"""

import argparse
import email
import json
import mimetypes
import os
import sqlite3
import sys
import threading
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web")
DB_PATH = os.path.join(BASE_DIR, "scenes.db")

# Mount points that map straight onto directories inside web/. The original
# application served the same URLs from Flask blueprint static folders, so the
# front-end sources are used unmodified.
STATIC_MOUNTS = {
    "/_static/": os.path.join(WEB_DIR, "_static"),
    "/gui_static/": os.path.join(WEB_DIR, "gui_static"),
    "/sim_static/": os.path.join(WEB_DIR, "sim_static"),
    "/local/": os.path.join(WEB_DIR, "local"),
}

MAX_SCENE_BYTES = 5_000_000

_db_lock = threading.Lock()


def db_connect():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def db_init():
    with db_connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS scenes (
                scene_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                name      TEXT NOT NULL,
                timestamp TEXT NOT NULL DEFAULT (datetime('now')),
                body      TEXT NOT NULL,
                thumb     TEXT NOT NULL DEFAULT ''
            );
            """
        )


def packet(header, success=False, data=None, form_failed=None):
    """The response envelope the front-end's Request layer unwraps."""
    return {
        "header": header,
        "notifications": [],
        "success": success,
        "data": {} if data is None else data,
        "formFailed": [] if form_failed is None else form_failed,
    }


def save_scene(fields):
    name = fields.get("name", "")
    body = fields.get("scene", "")
    thumb = fields.get("thumb", "")

    result = packet("save_scene_result", data={"name": name})

    if not name:
        result["formFailed"] = ["name"]
        return result

    if len(body.encode("utf8")) >= MAX_SCENE_BYTES:
        result["data"]["valid"] = False
        return result

    result["data"]["valid"] = True

    with _db_lock, db_connect() as connection:
        cursor = connection.execute(
            "INSERT INTO scenes (name, body, thumb) VALUES (?, ?, ?)",
            (name, body, thumb),
        )
        result["data"]["sceneid"] = cursor.lastrowid

    result["success"] = True
    return result


def my_scenes(_query):
    with db_connect() as connection:
        rows = connection.execute(
            "SELECT scene_id, name, timestamp, thumb FROM scenes ORDER BY timestamp DESC"
        ).fetchall()

    scenes = [
        {
            "sceneid": row["scene_id"],
            "name": row["name"],
            "timestamp": row["timestamp"],
            "thumb": row["thumb"],
        }
        for row in rows
    ]
    return packet("my_scenes_result", success=True, data=scenes)


def scene_body(query):
    sceneid = query.get("sceneid", [""])[0]

    with db_connect() as connection:
        row = connection.execute(
            "SELECT body FROM scenes WHERE scene_id = ?", (sceneid,)
        ).fetchone()

    data = {"body": row["body"]} if row else {}
    return packet("scene_body_result", success=bool(row), data=data)


def scene(query):
    sceneid = query.get("sceneid", [""])[0]

    with db_connect() as connection:
        row = connection.execute(
            "SELECT scene_id, name, timestamp, thumb FROM scenes WHERE scene_id = ?",
            (sceneid,),
        ).fetchone()

    data = (
        {
            "sceneid": row["scene_id"],
            "name": row["name"],
            "timestamp": row["timestamp"],
            "thumb": row["thumb"],
        }
        if row
        else {}
    )
    return packet("scene_result", success=bool(row), data=data)


def delete_scene(query):
    sceneid = query.get("sceneid", [""])[0]

    with _db_lock, db_connect() as connection:
        cursor = connection.execute("DELETE FROM scenes WHERE scene_id = ?", (sceneid,))

    return packet("delete_scene_result", success=cursor.rowcount > 0)


GET_ACTIONS = {
    "my_scenes": my_scenes,
    "scene_body": scene_body,
    "scene": scene,
    "delete_scene": delete_scene,
}

POST_ACTIONS = {
    "save_scene": save_scene,
}


def parse_multipart(content_type, body):
    """Return the form fields of a multipart/form-data body as a dict."""
    message = email.message_from_bytes(
        b"Content-Type: "
        + content_type.encode("utf8")
        + b"\r\nMIME-Version: 1.0\r\n\r\n"
        + body
    )

    fields = {}
    for part in message.walk():
        if part.is_multipart():
            continue
        name = part.get_param("name", header="content-disposition")
        if name is None:
            continue
        payload = part.get_payload(decode=True) or b""
        fields[name] = payload.decode("utf8", "replace")

    return fields


class Handler(BaseHTTPRequestHandler):
    server_version = "FySimLocal/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def send_json(self, payload, status=200):
        encoded = json.dumps(payload).encode("utf8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def send_file(self, path):
        if not os.path.isfile(path):
            self.send_error(404, "Not found")
            return

        content_type, _ = mimetypes.guess_type(path)
        with open(path, "rb") as handle:
            payload = handle.read()

        self.send_response(200)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def resolve_static(self, path):
        """Map a URL onto a file inside web/, refusing paths that escape it."""
        for prefix, directory in STATIC_MOUNTS.items():
            if not path.startswith(prefix):
                continue
            relative = urllib.parse.unquote(path[len(prefix):])
            candidate = os.path.normpath(os.path.join(directory, relative))
            if candidate == directory or candidate.startswith(directory + os.sep):
                return candidate
            return None
        return None

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path in ("/", "/index.html"):
            self.send_file(os.path.join(WEB_DIR, "index.html"))
            return

        if path == "/sim/get":
            action = GET_ACTIONS.get(query.get("action", [""])[0])
            if action is None:
                self.send_json(packet("unknown_action"), status=400)
            else:
                self.send_json(action(query))
            return

        static_path = self.resolve_static(path)
        if static_path is not None:
            self.send_file(static_path)
            return

        self.send_error(404, "Not found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)

        if parsed.path != "/sim/form":
            self.send_error(404, "Not found")
            return

        action = POST_ACTIONS.get(query.get("action", [""])[0])
        if action is None:
            self.send_json(packet("unknown_action"), status=400)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""
        content_type = self.headers.get("Content-Type", "")

        if content_type.startswith("multipart/form-data"):
            fields = parse_multipart(content_type, body)
        else:
            fields = {
                key: value[0]
                for key, value in urllib.parse.parse_qs(body.decode("utf8")).items()
            }

        self.send_json(action(fields))


def main():
    parser = argparse.ArgumentParser(description="Run the FySim physics tool locally.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    db_init()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print("FySim running on http://%s:%d/  (ctrl-c to stop)" % (args.host, args.port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
