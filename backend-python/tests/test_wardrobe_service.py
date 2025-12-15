# """
# Tests for Wardrobe Service
# """
# import pytest
# from services.wardrobe_service import WardrobeService

# @pytest.fixture
# def wardrobe_service():
#     """Create fresh wardrobe service for each test"""
#     service = WardrobeService()
#     user_id = "test_user"
#     yield service, user_id
#     service.clear_wardrobe(user_id)

# def test_get_all_items_empty(wardrobe_service):
#     """Test getting items from empty wardrobe"""
#     service, user_id = wardrobe_service
#     items = service.get_all_items(user_id)
#     assert items == []

# def test_add_item(wardrobe_service):
#     """Test adding item to wardrobe"""
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
#     """Test adding multiple items"""
#     service, user_id = wardrobe_service
#     for i in range(3):
#         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
#     items = service.get_all_items(user_id)
#     assert len(items) == 3
#     assert items[0]['id'] == 1
#     assert items[1]['id'] == 2
#     assert items[2]['id'] == 3

# def test_get_item_by_id(wardrobe_service):
#     """Test getting specific item by ID"""
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     found = service.get_item_by_id(user_id, item['id'])
#     assert found['id'] == item['id']

# def test_get_item_by_id_not_found(wardrobe_service):
#     """Test getting non-existent item"""
#     service, user_id = wardrobe_service
#     found = service.get_item_by_id(user_id, 999)
#     assert found is None

# def test_delete_item(wardrobe_service):
#     """Test deleting item"""
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     success = service.delete_item(user_id, item['id'])
#     assert success is True
#     items = service.get_all_items(user_id)
#     assert len(items) == 0

# def test_delete_item_not_found(wardrobe_service):
#     """Test deleting non-existent item"""
#     service, user_id = wardrobe_service
#     success = service.delete_item(user_id, 999)
#     assert success is False

# def test_toggle_favorite(wardrobe_service):
#     """Test toggling favorite status"""
#     service, user_id = wardrobe_service
#     item = service.add_item(user_id, {'filename': 'test.jpg'}, {'type': 'shirt'})
#     # Toggle to True
#     updated = service.toggle_favorite(user_id, item['id'])
#     assert updated['favorite'] is True
#     # Toggle back to False
#     updated = service.toggle_favorite(user_id, item['id'])
#     assert updated['favorite'] is False

# def test_clear_wardrobe(wardrobe_service):
#     """Test clearing all items"""
#     service, user_id = wardrobe_service
#     for i in range(3):
#         service.add_item(user_id, {'filename': f'test{i}.jpg'}, {'type': 'shirt'})
#     service.clear_wardrobe(user_id)
#     items = service.get_all_items(user_id)
#     assert len(items) == 0

# def test_get_statistics(wardrobe_service):
#     """Test getting wardrobe statistics"""
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
from services.wardrobe_service import WardrobeService

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
    assert item['id'] == 1
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
    assert items[0]['id'] == 1
    assert items[1]['id'] == 2
    assert items[2]['id'] == 3

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
    # Toggle to True
    updated = service.toggle_favorite(user_id, item['id'])
    assert updated['favorite'] is True
    # Toggle back to False
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
    # The following asserts may need to be updated if get_statistics returns a different structure
    assert stats['totalItems'] == 2
    # Optionally add more asserts if get_statistics returns more info