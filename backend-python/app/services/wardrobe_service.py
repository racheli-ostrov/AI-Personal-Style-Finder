import sqlite3
import os
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "db", "wardrobe.sqlite3")
)

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    # Ensure schema exists (safe to call every time)
    try:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS wardrobe (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            image_info TEXT,
            analysis TEXT,
            favorite INTEGER DEFAULT 0,
            added_at TEXT
        );
        """)
        conn.commit()
    except Exception:
        # If schema creation fails, propagate later; but don't crash here
        pass
    return conn


class WardrobeService:
    def _parse_row(self, row):
        if not row:
            return None
        data = dict(row)
        # Parse JSON fields if stored as strings
        for key in ("image_info", "analysis"):
            if key in data and data[key] is not None:
                try:
                    data[key] = json.loads(data[key]) if isinstance(data[key], str) else data[key]
                except Exception:
                    # Fallback: keep original string
                    data[key] = data[key]
        # Expose convenient top-level image fields and camelCase keys for tests/frontend
        img = data.get("image_info") or {}
        if isinstance(img, dict):
            data["imageData"] = img.get("data")
            data["imageUrl"] = img.get("url")
            # Provide `imageInfo` key (camelCase) expected by tests
            data["imageInfo"] = img

        # Normalize favorite to boolean
        if "favorite" in data:
            try:
                data["favorite"] = bool(int(data["favorite"]))
            except Exception:
                data["favorite"] = bool(data["favorite"])

        # Provide camelCase `addedAt` and normalize `analysis` key name
        if "added_at" in data and "addedAt" not in data:
            data["addedAt"] = data.get("added_at")

        # Ensure 'analysis' is present as a dict (parsed above)
        if "analysis" in data and data["analysis"] is None:
            data["analysis"] = {}

        return data

    def get_all_items(self, user_id):
        conn = get_db()
        rows = conn.execute(
            "SELECT * FROM wardrobe WHERE user_id=?",
            (user_id,)
        ).fetchall()
        conn.close()
        return [self._parse_row(row) for row in rows]

    def add_item(self, user_id, image_info, analysis):
        conn = get_db()
        # Store JSON strings for structured data
        image_json = json.dumps(image_info)
        analysis_json = json.dumps(analysis)
        cursor = conn.execute(
            """INSERT INTO wardrobe
               (user_id, image_info, analysis, added_at)
               VALUES (?, ?, ?, ?)""",
            (user_id, image_json, analysis_json, datetime.now().isoformat())
        )
        conn.commit()
        last_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM wardrobe WHERE id=?", (last_id,)).fetchone()
        conn.close()
        return self._parse_row(row)

    def get_item_by_id(self, user_id, item_id):
        conn = get_db()
        row = conn.execute("SELECT * FROM wardrobe WHERE id=? AND user_id=?", (item_id, user_id)).fetchone()
        conn.close()
        return self._parse_row(row)

    def toggle_favorite(self, user_id, item_id):
        conn = get_db()
        row = conn.execute(
            "SELECT favorite FROM wardrobe WHERE id=? AND user_id=?",
            (item_id, user_id)
        ).fetchone()

        if not row:
            conn.close()
            return None

        new_value = 0 if row["favorite"] else 1
        conn.execute(
            "UPDATE wardrobe SET favorite=? WHERE id=? AND user_id=?",
            (new_value, item_id, user_id)
        )
        conn.commit()
        # Return the full, parsed item so frontend can replace the item in state
        updated_row = conn.execute("SELECT * FROM wardrobe WHERE id=? AND user_id=?", (item_id, user_id)).fetchone()
        conn.close()
        return self._parse_row(updated_row)

    def clear_wardrobe(self, user_id):
        conn = get_db()
        conn.execute("DELETE FROM wardrobe WHERE user_id=?", (user_id,))
        conn.commit()
        conn.close()

    def delete_item(self, user_id, item_id):
        conn = get_db()
        cursor = conn.execute("DELETE FROM wardrobe WHERE id=? AND user_id=?", (item_id, user_id))
        conn.commit()
        deleted = cursor.rowcount if hasattr(cursor, 'rowcount') else None
        conn.close()
        return bool(deleted)

    def get_statistics(self, user_id):
        conn = get_db()
        total = conn.execute("SELECT COUNT(*) as cnt FROM wardrobe WHERE user_id=?", (user_id,)).fetchone()["cnt"]
        favorites = conn.execute("SELECT COUNT(*) as cnt FROM wardrobe WHERE user_id=? AND favorite=1", (user_id,)).fetchone()["cnt"]
        rows = conn.execute("SELECT analysis FROM wardrobe WHERE user_id=?", (user_id,)).fetchall()
        conn.close()

        type_counts = {}
        for r in rows:
            try:
                analysis = json.loads(r["analysis"]) if isinstance(r["analysis"], str) else r["analysis"]
                t = analysis.get("type") or analysis.get("clothing_type") or "unknown"
            except Exception:
                t = "unknown"
            type_counts[t] = type_counts.get(t, 0) + 1

        return {
            "totalItems": total,
            "favoriteCount": favorites,
            "byType": type_counts
        }


wardrobe_service = WardrobeService()
