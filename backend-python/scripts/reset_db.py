import os
import sqlite3
from pathlib import Path

HERE = Path(__file__).resolve().parents[1] / 'app' / 'db'
DB_PATH = HERE / 'wardrobe.sqlite3'

SCHEMA_SQL = '''
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    imageData TEXT,
    imageUrl TEXT,
    imageInfo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
'''


def recreate_db():
    HERE.mkdir(parents=True, exist_ok=True)
    if DB_PATH.exists():
        print(f"Removing existing DB: {DB_PATH}")
        DB_PATH.unlink()
    else:
        print(f"No existing DB found at {DB_PATH}; creating new one")
    conn = sqlite3.connect(DB_PATH)
    try:
        c = conn.cursor()
        c.executescript(SCHEMA_SQL)
        conn.commit()
        print(f"Created database and schema at: {DB_PATH}")
    finally:
        conn.close()


if __name__ == '__main__':
    recreate_db()
