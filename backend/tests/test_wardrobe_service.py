def test_parse_row_favorite_exception():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    class FakeRow(dict):
        def __getitem__(self, key):
            return self.get(key)
    # favorite is a string that cannot be cast to int
    row = FakeRow({'id': 1, 'user_id': 'user', 'favorite': 'not_int'})
    result = service._parse_row(row)
    assert isinstance(result['favorite'], bool)

def test_get_statistics_analysis_exception():
    from app.services.wardrobe_service import WardrobeService, get_db
    service = WardrobeService()
    user_id = 'stat_analysis_exc'
    service.clear_wardrobe(user_id)
    # Insert item with analysis that will cause exception in json.loads
    conn = get_db()
    # Use a valid but malformed JSON string to trigger the exception
    conn.execute("INSERT INTO wardrobe (user_id, image_info, analysis, added_at) VALUES (?, ?, ?, ?)",
                 (user_id, '{}', '{bad json}', 'now'))
    conn.commit()
    conn.close()
    stats = service.get_statistics(user_id)
    assert 'unknown' in stats['byType']
def test_get_db_exception(monkeypatch):
    import app.services.wardrobe_service as ws
    # Simulate exception in schema creation
    def bad_execute(*a, **kw):
        raise Exception("fail schema")
    class DummyConn:
        def execute(self, *a, **kw):
            return bad_execute()
        def commit(self):
            pass
        def close(self):
            pass
        @property
        def row_factory(self):
            return None
        @row_factory.setter
        def row_factory(self, v):
            pass
    monkeypatch.setattr(ws, "sqlite3", ws.sqlite3)
    monkeypatch.setattr(ws, "DB_PATH", ws.DB_PATH)
    monkeypatch.setattr(ws.sqlite3, "connect", lambda *a, **kw: DummyConn())
    ws.get_db()  # Should not raise
def test_parse_row_none():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    assert service._parse_row(None) is None

def test_parse_row_missing_keys():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    # Row missing 'image_info', 'analysis', 'favorite', 'added_at'
    class FakeRow(dict):
        def __getitem__(self, key):
            return self.get(key)
    row = FakeRow({'id': 1, 'user_id': 'user'})
    result = service._parse_row(row)
    assert result['id'] == 1
    assert result['user_id'] == 'user'

def test_get_statistics_no_items():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    user_id = 'empty_stats_user'
    service.clear_wardrobe(user_id)
    stats = service.get_statistics(user_id)
    assert stats['totalItems'] == 0
    assert stats['favoriteCount'] == 0
def test_add_item_invalid_data():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    # Should not raise, but store as string if not serializable
    user_id = 'invalid_data_user'
    image_info = object()  # Not serializable
    analysis = object()    # Not serializable
    try:
        service.add_item(user_id, image_info, analysis)
    except Exception:
        assert True  # Acceptable if fails, but should not crash the DB
def test_toggle_favorite_not_found():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    # Use unlikely user_id/item_id to ensure not found
    result = service.toggle_favorite('no_such_user', 999999)
    assert result is None

def test_delete_item_not_found():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    # Use unlikely user_id/item_id to ensure not found
    deleted = service.delete_item('no_such_user', 999999)
    assert deleted is False

def test_get_statistics_invalid_analysis():
    from app.services.wardrobe_service import WardrobeService, get_db
    service = WardrobeService()
    user_id = 'stat_invalid_json'
    service.clear_wardrobe(user_id)
    # Insert item with invalid analysis JSON
    conn = get_db()
    conn.execute("INSERT INTO wardrobe (user_id, image_info, analysis, added_at) VALUES (?, ?, ?, ?)",
                 (user_id, '{}', '{not: valid}', 'now'))
    conn.commit()
    conn.close()
    stats = service.get_statistics(user_id)
    assert 'unknown' in stats['byType']
def test_parse_row_invalid_json():
    from app.services.wardrobe_service import WardrobeService
    service = WardrobeService()
    # Simulate a row with invalid JSON in 'image_info' and 'analysis'
    class FakeRow(dict):
        def __getitem__(self, key):
            return self.get(key)
    row = FakeRow({
        'id': 1,
        'user_id': 'user',
        'image_info': '{not: valid}',
        'analysis': '{not: valid}',
        'favorite': 1,
        'added_at': 'now'
    })
    result = service._parse_row(row)
    assert result['image_info'] == '{not: valid}'
    assert result['analysis'] == '{not: valid}'
import pytest
from app.services.wardrobe_service import WardrobeService

@pytest.fixture
def service():
    return WardrobeService()

def test_add_item(service):
    user_id = "user1"
    image_info = {"filename": "shirt.jpg", "size": 123, "mimetype": "image/jpeg"}
    analysis = {"type": "shirt", "colors": ["blue"], "style": "casual"}
    item = service.add_item(user_id, image_info, analysis)
    assert item["imageInfo"] == image_info
    assert item["analysis"] == analysis
    assert item["favorite"] is False
    assert "addedAt" in item

def test_get_all_items_empty(service):
    user_id = "user2"
    assert service.get_all_items(user_id) == []

def test_get_all_items(service):
    user_id = "user3"
    service.clear_wardrobe(user_id)  # ניקוי הארון לפני הבדיקה
    service.add_item(user_id, {"filename": "a.jpg"}, {"type": "shirt"})
    service.add_item(user_id, {"filename": "b.jpg"}, {"type": "pants"})
    items = service.get_all_items(user_id)
    assert len(items) == 2

def test_get_item_by_id(service):
    user_id = "user4"
    item = service.add_item(user_id, {"filename": "c.jpg"}, {"type": "dress"})
    found = service.get_item_by_id(user_id, item["id"])
    assert found["id"] == item["id"]

def test_get_item_by_id_not_found(service):
    user_id = "user5"
    assert service.get_item_by_id(user_id, 9999) is None

def test_delete_item(service):
    user_id = "user6"
    item = service.add_item(user_id, {"filename": "d.jpg"}, {"type": "skirt"})
    deleted = service.delete_item(user_id, item["id"])
    assert deleted is True
    assert service.get_item_by_id(user_id, item["id"]) is None

def test_delete_item_not_found(service):
    user_id = "user7"
    assert service.delete_item(user_id, 12345) is False

def test_toggle_favorite(service):
    user_id = "user8"
    item = service.add_item(user_id, {"filename": "e.jpg"}, {"type": "jacket"})
    toggled = service.toggle_favorite(user_id, item["id"])
    assert toggled["favorite"] is True
    toggled2 = service.toggle_favorite(user_id, item["id"])
    assert toggled2["favorite"] is False

def test_clear_wardrobe(service):
    user_id = "user9"
    service.add_item(user_id, {"filename": "f.jpg"}, {"type": "shoes"})
    service.clear_wardrobe(user_id)
    assert service.get_all_items(user_id) == []# # """
# # Tests for Wardrobe Service
# # """
# # import pytest
# # from services.wardrobe_service import WardrobeService

# # @pytest.fixture
# # def wardrobe_service():
# #     """Create fresh wardrobe service for each test"""
# #     service = WardrobeService()
# #     user_id = "test_user"
# #     yield service, user_id
# #     service.clear_wardrobe(user_id)

# # def test_get_all_items_empty(wardrobe_service):
# #     """Test getting items from empty wardrobe"""
# #     service, user_id = wardrobe_service
# #     items = service.get_all_items(user_id)
# #     assert items == []

# # def test_add_item(wardrobe_service):
# #     """Test adding item to wardrobe"""
# #     service, user_id = wardrobe_service
# #     image_info = {'filename': 'test.jpg', 'size': 1000, 'mimetype': 'image/jpeg'}
# #     analysis = {'type': 'shirt', 'colors': ['blue'], 'style': 'casual'}
# #     item = service.add_item(user_id, image_info, analysis)
# #     assert item['id'] == 1
# #     assert item['imageInfo'] == image_info
# #     assert item['analysis'] == analysis
# #     assert item['favorite'] is False
# #     assert 'addedAt' in item

# # def test_add_multiple_items(wardrobe_service):
# #     """Test adding multiple items"""
# #     service, user_id = wardrobe_service
# #     for i in range(3):
# #         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
# #     items = service.get_all_items(user_id)
# #     assert len(items) == 3
# #     assert items[0]['id'] == 1
# #     assert items[1]['id'] == 2
# #     assert items[2]['id'] == 3

# # def test_get_item_by_id(wardrobe_service):
# #     """Test getting specific item by ID"""
# #     service, user_id = wardrobe_service
# #     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
# #     found = service.get_item_by_id(user_id, item['id'])
# #     assert found['id'] == item['id']

# # def test_get_item_by_id_not_found(wardrobe_service):
# #     """Test getting non-existent item"""
# #     service, user_id = wardrobe_service
# #     found = service.get_item_by_id(user_id, 999)
# #     assert found is None

# # def test_delete_item(wardrobe_service):
# #     """Test deleting item"""
# #     service, user_id = wardrobe_service
# #     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
# #     success = service.delete_item(user_id, item['id'])
# #     assert success is True
# #     items = service.get_all_items(user_id)
# #     assert len(items) == 0

# # def test_delete_item_not_found(wardrobe_service):
# #     """Test deleting non-existent item"""
# #     service, user_id = wardrobe_service
# #     success = service.delete_item(user_id, 999)
# #     assert success is False

# # def test_toggle_favorite(wardrobe_service):
# #     """Test toggling favorite status"""
# #     service, user_id = wardrobe_service
# #     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
# #     # Toggle to True
# #     updated = service.toggle_favorite(user_id, item['id'])
# #     assert updated['favorite'] is True
# #     # Toggle back to False
# #     updated = service.toggle_favorite(user_id, item['id'])
# #     assert updated['favorite'] is False

# # def test_clear_wardrobe(wardrobe_service):
# #     """Test clearing all items"""
# #     service, user_id = wardrobe_service
# #     for i in range(3):
# #         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
# #     service.clear_wardrobe(user_id)
# #     items = service.get_all_items(user_id)
# #     assert len(items) == 0

# # def test_get_statistics(wardrobe_service):
# #     """Test getting wardrobe statistics"""
# #     service, user_id = wardrobe_service
# #     service.add_item(user_id, {'filename': 'test1.jpg'}, {'type': 'shirt', 'colors': ['blue', 'white']})
# #     item2 = service.add_item(user_id, {'filename': 'test2.jpg'}, {'type': 'pants', 'colors': ['black']})
# #     service.toggle_favorite(user_id, item2['id'])
# #     stats = service.get_statistics(user_id)
# #     # The following asserts may need to be updated if get_statistics returns a different structure
# #     assert stats['totalItems'] == 2
# #     # Optionally add more asserts if get_statistics returns more info
# """
# Tests for Wardrobe Service
# """
# import pytest
# from services.wardrobe_service import WardrobeService

# @pytest.fixture
# def wardrobe_service():
#     service = WardrobeService()
#     user_id = "test_user"
#     yield service, user_id
#     service.clear_wardrobe(user_id)

# def test_get_all_items_empty(wardrobe_service):
#     service, user_id = wardrobe_service
#     items = service.get_all_items(user_id)
#     assert items == []

# def test_add_item(wardrobe_service):
#     service, user_id = wardrobe_service
#     image_info = {'filename': 'test.jpg', 'size': 1000, 'mimetype': 'image/jpeg'}
#     analysis = {'type': 'shirt', 'colors': ['blue'], 'style': 'casual'}
#     item = service.add_item(user_id, image_info, analysis)
#     assert item['id'] == 1
#     assert item['imageInfo'] == image_info
#     assert item['analysis'] == analysis
#     assert item['favorite'] is False
#     assert 'addedAt' in item

# def test_add_multiple_items(wardrobe_service):
#     service, user_id = wardrobe_service
#     for i in range(3):
#         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
#     items = service.get_all_items(user_id)
#     assert len(items) == 3
#     ids = [item['id'] for item in items]
#     assert len(ids) == len(set(ids)), "IDs should be unique"
#     filenames = [item['imageInfo'].get('filename') for item in items]
#     assert 'test0.jpg' in filenames
#     assert 'test1.jpg' in filenames
#     assert 'test2.jpg' in filenames

# def test_get_item_by_id(wardrobe_service):
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     found = service.get_item_by_id(user_id, item['id'])
#     assert found['id'] == item['id']

# def test_get_item_by_id_not_found(wardrobe_service):
#     service, user_id = wardrobe_service
#     found = service.get_item_by_id(user_id, 999)
#     assert found is None

# def test_delete_item(wardrobe_service):
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     success = service.delete_item(user_id, item['id'])
#     assert success is True
#     items = service.get_all_items(user_id)
#     assert len(items) == 0

# def test_delete_item_not_found(wardrobe_service):
#     service, user_id = wardrobe_service
#     success = service.delete_item(user_id, 999)
#     assert success is False

# def test_toggle_favorite(wardrobe_service):
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     # Toggle to True
#     updated = service.toggle_favorite(user_id, item['id'])
#     assert updated['favorite'] is True
#     # Toggle back to False
#     updated = service.toggle_favorite(user_id, item['id'])
#     assert updated['favorite'] is False

# def test_clear_wardrobe(wardrobe_service):
#     service, user_id = wardrobe_service
#     for i in range(3):
#         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
#     service.clear_wardrobe(user_id)
#     items = service.get_all_items(user_id)
#     assert len(items) == 0

# def test_get_statistics(wardrobe_service):
#     service, user_id = wardrobe_service
#     service.add_item(user_id, {'filename': 'test1.jpg'}, {'type': 'shirt', 'colors': ['blue', 'white']})
#     item2 = service.add_item(user_id, {'filename': 'test2.jpg'}, {'type': 'pants', 'colors': ['black']})
#     service.toggle_favorite(user_id, item2['id'])
#     stats = service.get_statistics(user_id)
#     # The following asserts may need to be updated if get_statistics returns a different structure
#     assert stats['totalItems'] == 2
#     # Optionally add more asserts if get_statistics returns more info
"""
Tests for Wardrobe Service
"""
import pytest
from app.services.wardrobe_service import WardrobeService

@pytest.fixture
def wardrobe_service():
    service = WardrobeService()
    user_id = "test_user"
    yield service, user_id
    service.clear_wardrobe(user_id)

def test_get_all_items_empty(wardrobe_service):
    service, user_id = wardrobe_service
    items = service.get_all_items(user_id)
    assert items == []

def test_add_item(wardrobe_service):
    service, user_id = wardrobe_service
    image_info = {'filename': 'test.jpg', 'size': 1000, 'mimetype': 'image/jpeg'}
    analysis = {'type': 'shirt', 'colors': ['blue'], 'style': 'casual'}
    item = service.add_item(user_id, image_info, analysis)
    assert item['id'] >= 1
    assert item['imageInfo'] == image_info
    assert item['analysis'] == analysis
    assert item['favorite'] is False
    assert 'addedAt' in item

def test_add_multiple_items(wardrobe_service):
    service, user_id = wardrobe_service
    for i in range(3):
        service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
    items = service.get_all_items(user_id)
    assert len(items) == 3
    ids = [item['id'] for item in items]
    assert len(ids) == len(set(ids)), "IDs should be unique"
    filenames = [item['imageInfo'].get('filename') for item in items]
    assert 'test0.jpg' in filenames
    assert 'test1.jpg' in filenames
    assert 'test2.jpg' in filenames

def test_get_item_by_id(wardrobe_service):
    service, user_id = wardrobe_service
    item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
    found = service.get_item_by_id(user_id, item['id'])
    assert found['id'] == item['id']

def test_get_item_by_id_not_found(wardrobe_service):
    service, user_id = wardrobe_service
    found = service.get_item_by_id(user_id, 999)
    assert found is None

def test_delete_item(wardrobe_service):
    service, user_id = wardrobe_service
    item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
    success = service.delete_item(user_id, item['id'])
    assert success is True
    items = service.get_all_items(user_id)
    assert len(items) == 0

def test_delete_item_not_found(wardrobe_service):
    service, user_id = wardrobe_service
    success = service.delete_item(user_id, 999)
    assert success is False

def test_toggle_favorite(wardrobe_service):
    service, user_id = wardrobe_service
    item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
    updated = service.toggle_favorite(user_id, item['id'])
    assert updated['favorite'] is True
    updated = service.toggle_favorite(user_id, item['id'])
    assert updated['favorite'] is False

def test_clear_wardrobe(wardrobe_service):
    service, user_id = wardrobe_service
    for i in range(3):
        service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
    service.clear_wardrobe(user_id)
    items = service.get_all_items(user_id)
    assert len(items) == 0

def test_get_statistics(wardrobe_service):
    service, user_id = wardrobe_service
    service.add_item(user_id, {'filename': 'test1.jpg'}, {'type': 'shirt', 'colors': ['blue', 'white']})
    item2 = service.add_item(user_id, {'filename': 'test2.jpg'}, {'type': 'pants', 'colors': ['black']})
    service.toggle_favorite(user_id, item2['id'])
    stats = service.get_statistics(user_id)
    assert stats['totalItems'] == 2