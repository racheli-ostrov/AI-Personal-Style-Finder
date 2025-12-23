"""
Wardrobe Service
Business logic for managing wardrobe items
"""

# --- SQLite-based implementation ---
import sqlite3
import os
from typing import Dict, List, Optional, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'db', 'wardrobe.sqlite3')

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS wardrobe (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            image_info TEXT,
            image_data TEXT,
            analysis TEXT,
            added_at TEXT,
            favorite INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class WardrobeService:
    def get_all_items(self, user_id: str) -> List[Dict]:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM wardrobe WHERE user_id=?', (user_id,))
        rows = c.fetchall()
        items = []
        for row in rows:
            items.append({
                'id': row['id'],
                'userId': row['user_id'],
                'imageInfo': eval(row['image_info']) if row['image_info'] else {},
                'imageData': row['image_data'],
                'analysis': eval(row['analysis']) if row['analysis'] else {},
                'addedAt': row['added_at'],
                'favorite': bool(row['favorite'])
            })
        conn.close()
        return items

    def add_item(self, user_id: str, image_info: Dict, analysis: Dict) -> Dict:
        conn = get_db()
        c = conn.cursor()
        image_data = image_info.get('data', '')
        c.execute('''
            INSERT INTO wardrobe (user_id, image_info, image_data, analysis, added_at, favorite)
            VALUES (?, ?, ?, ?, ?, 0)
        ''', (user_id, str(image_info), image_data, str(analysis), datetime.now().isoformat()))
        item_id = c.lastrowid
        conn.commit()
        conn.close()
        return self.get_item_by_id(user_id, item_id)

    def get_item_by_id(self, user_id: str, item_id: int) -> Optional[Dict]:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM wardrobe WHERE user_id=? AND id=?', (user_id, item_id))
        row = c.fetchone()
        conn.close()
        if not row:
            return None
        return {
            'id': row['id'],
            'userId': row['user_id'],
            'imageInfo': eval(row['image_info']) if row['image_info'] else {},
            'imageData': row['image_data'],
            'analysis': eval(row['analysis']) if row['analysis'] else {},
            'addedAt': row['added_at'],
            'favorite': bool(row['favorite'])
        }

    def delete_item(self, user_id: str, item_id: int) -> bool:
        conn = get_db()
        c = conn.cursor()
        c.execute('DELETE FROM wardrobe WHERE user_id=? AND id=?', (user_id, item_id))
        deleted = c.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def toggle_favorite(self, user_id: str, item_id: int) -> Optional[Dict]:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT favorite FROM wardrobe WHERE user_id=? AND id=?', (user_id, item_id))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        new_fav = 0 if row['favorite'] else 1
        c.execute('UPDATE wardrobe SET favorite=? WHERE user_id=? AND id=?', (new_fav, user_id, item_id))
        conn.commit()
        conn.close()
        return self.get_item_by_id(user_id, item_id)

    def clear_wardrobe(self, user_id: str) -> None:
        conn = get_db()
        c = conn.cursor()
        c.execute('DELETE FROM wardrobe WHERE user_id=?', (user_id,))
        conn.commit()
        conn.close()

    def get_statistics(self, user_id: str) -> Dict[str, Any]:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT COUNT(*) as count FROM wardrobe WHERE user_id=?', (user_id,))
        count = c.fetchone()['count']
        conn.close()
        return {'totalItems': count}

wardrobe_service = WardrobeService()
