import pytest
from app.services.wardrobe_service import WardrobeService

@pytest.fixture
def service():
    return WardrobeService()

def test_get_item_by_id_not_found(service):
    assert service.get_item_by_id("user", 99999) is None

def test_delete_item_not_found(service):
    assert service.delete_item("user", 99999) is False

def test_toggle_favorite_not_found(service):
    assert service.toggle_favorite("user", 99999) is None

def test_clear_wardrobe_empty(service):
    service.clear_wardrobe("user_empty")
    assert service.get_all_items("user_empty") == []

def test_get_statistics_empty(service):
    stats = service.get_statistics("user_empty")
    assert isinstance(stats, dict)
