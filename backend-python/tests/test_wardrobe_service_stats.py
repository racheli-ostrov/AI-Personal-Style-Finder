import pytest
from app.services.wardrobe_service import WardrobeService

def test_get_statistics_with_items():
    service = WardrobeService()
    user_id = "user_stats"
    service.clear_wardrobe(user_id)
    service.add_item(user_id, {"filename": "a.jpg"}, {"type": "shirt"})
    service.add_item(user_id, {"filename": "b.jpg"}, {"type": "pants"})
    stats = service.get_statistics(user_id)
    assert isinstance(stats, dict)
    # The correct key is 'totalItems' (camelCase), not 'total_items' or 'count'
    assert stats.get("totalItems", 0) >= 2
