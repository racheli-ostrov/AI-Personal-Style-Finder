"""
Tests for Wardrobe Service
"""
import pytest
from services.wardrobe_service import WardrobeService

@pytest.fixture
def wardrobe_service():
    """Create fresh wardrobe service for each test"""
    service = WardrobeService()
    yield service
    service.clear_wardrobe()

def test_get_all_items_empty(wardrobe_service):
    """Test getting items from empty wardrobe"""
    items = wardrobe_service.get_all_items()
    assert items == []

def test_add_item(wardrobe_service):
    """Test adding item to wardrobe"""
    image_info = {'filename': 'test.jpg', 'size': 1000, 'mimetype': 'image/jpeg'}
    analysis = {'type': 'shirt', 'colors': ['blue'], 'style': 'casual'}
    
    item = wardrobe_service.add_item(image_info, analysis)
    
    assert item['id'] == 1
    assert item['imageInfo'] == image_info
    assert item['analysis'] == analysis
    assert item['favorite'] is False
    assert 'addedAt' in item

def test_add_multiple_items(wardrobe_service):
    """Test adding multiple items"""
    for i in range(3):
        wardrobe_service.add_item(
            {'filename': f'test{i}.jpg'},
            {'type': 'shirt'}
        )
    
    items = wardrobe_service.get_all_items()
    assert len(items) == 3
    assert items[0]['id'] == 1
    assert items[1]['id'] == 2
    assert items[2]['id'] == 3

def test_get_item_by_id(wardrobe_service):
    """Test getting specific item by ID"""
    item = wardrobe_service.add_item({'filename': 'test.jpg'}, {'type': 'shirt'})
    
    found = wardrobe_service.get_item_by_id(item['id'])
    assert found['id'] == item['id']

def test_get_item_by_id_not_found(wardrobe_service):
    """Test getting non-existent item"""
    found = wardrobe_service.get_item_by_id(999)
    assert found is None

def test_delete_item(wardrobe_service):
    """Test deleting item"""
    item = wardrobe_service.add_item({'filename': 'test.jpg'}, {'type': 'shirt'})
    
    success = wardrobe_service.delete_item(item['id'])
    assert success is True
    
    items = wardrobe_service.get_all_items()
    assert len(items) == 0

def test_delete_item_not_found(wardrobe_service):
    """Test deleting non-existent item"""
    success = wardrobe_service.delete_item(999)
    assert success is False

def test_toggle_favorite(wardrobe_service):
    """Test toggling favorite status"""
    item = wardrobe_service.add_item({'filename': 'test.jpg'}, {'type': 'shirt'})
    
    # Toggle to True
    updated = wardrobe_service.toggle_favorite(item['id'])
    assert updated['favorite'] is True
    
    # Toggle back to False
    updated = wardrobe_service.toggle_favorite(item['id'])
    assert updated['favorite'] is False

def test_clear_wardrobe(wardrobe_service):
    """Test clearing all items"""
    for i in range(3):
        wardrobe_service.add_item({'filename': f'test{i}.jpg'}, {'type': 'shirt'})
    
    wardrobe_service.clear_wardrobe()
    
    items = wardrobe_service.get_all_items()
    assert len(items) == 0

def test_get_statistics(wardrobe_service):
    """Test getting wardrobe statistics"""
    wardrobe_service.add_item(
        {'filename': 'test1.jpg'},
        {'type': 'shirt', 'colors': ['blue', 'white']}
    )
    item2 = wardrobe_service.add_item(
        {'filename': 'test2.jpg'},
        {'type': 'pants', 'colors': ['black']}
    )
    wardrobe_service.toggle_favorite(item2['id'])
    
    stats = wardrobe_service.get_statistics()
    
    assert stats['totalItems'] == 2
    assert stats['favoriteItems'] == 1
    assert stats['itemTypes'] == {'shirt': 1, 'pants': 1}
    assert 'blue' in stats['dominantColors']
    assert 'black' in stats['dominantColors']
