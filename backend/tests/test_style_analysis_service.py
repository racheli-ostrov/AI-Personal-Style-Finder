def test_get_recommendations_not_found_item():
    from unittest.mock import patch
    from app.services.style_analysis_service import StyleAnalysisService
    service = StyleAnalysisService()
    items = [{'id': 1}, {'id': 2}]
    with patch('app.services.wardrobe_service.wardrobe_service.get_all_items', return_value=items):
        result = service.get_recommendations('user', 999)
        assert result == []
def test_get_recommendations_no_items():
    from unittest.mock import patch
    from app.services.style_analysis_service import StyleAnalysisService
    service = StyleAnalysisService()
    with patch('app.services.wardrobe_service.wardrobe_service.get_all_items', return_value=[]):
        result = service.get_recommendations('user', 1)
        assert result == []
import pytest
from unittest.mock import patch
from app.services.style_analysis_service import StyleAnalysisService

def test_generate_style_profile_too_few_items_raises():
    service = StyleAnalysisService()
    # Patch wardrobe_service.get_all_items to return <3 items
    with patch('app.services.wardrobe_service.wardrobe_service.get_all_items', return_value=[{'id': 1}]):
        with pytest.raises(ValueError):
            service.generate_style_profile('user')

def test_analyze_image_gemini_exception():
    service = StyleAnalysisService()
    # Patch gemini_service.analyze_clothing_image to raise Exception
    with patch('app.services.gemini_service.gemini_service.analyze_clothing_image', side_effect=Exception('fail')):
        with pytest.raises(Exception):
            service.analyze_image('data', 'mime', {'info': 1})
import pytest
from app.services.style_analysis_service import StyleAnalysisService

class DummyGemini:
    def analyze_clothing_image(self, image_data, mime_type):
        return {"type": "shirt", "colors": ["blue"]}
    def generate_style_profile(self, items):
        return {"summary": "profile"}
    def find_similar_items(self, target, items):
        return [target]

class DummyWardrobe:
    def __init__(self, items=None):
        self._items = items or []
    def get_all_items(self, user_id):
        return self._items
    def get_statistics(self, user_id):
        return {"count": len(self._items)}

def test_analyze_image():
    service = StyleAnalysisService()
    # החלפת שירותים ב-dummy
    service.gemini_service = DummyGemini()
    service.wardrobe_service = DummyWardrobe()
    # monkeypatch
    import app.services.style_analysis_service as sas
    sas.gemini_service = DummyGemini()
    sas.wardrobe_service = DummyWardrobe()
    out = service.analyze_image(b"img", "image/jpeg", {"filename": "a.jpg"})
    assert "analysis" in out
    assert "imageInfo" in out
    assert "analyzedAt" in out

def test_generate_style_profile_success(monkeypatch):
    service = StyleAnalysisService()
    items = [{"id": 1}, {"id": 2}, {"id": 3}]
    dummy_wardrobe = DummyWardrobe(items)
    dummy_gemini = DummyGemini()
    monkeypatch.setattr("app.services.style_analysis_service.gemini_service", dummy_gemini)
    monkeypatch.setattr("app.services.style_analysis_service.wardrobe_service", dummy_wardrobe)
    out = service.generate_style_profile("user1")
    assert "profile" in out
    assert "statistics" in out
    assert "generatedAt" in out

def test_generate_style_profile_too_few_items(monkeypatch):
    service = StyleAnalysisService()
    dummy_wardrobe = DummyWardrobe([])
    monkeypatch.setattr("app.services.style_analysis_service.wardrobe_service", dummy_wardrobe)
    with pytest.raises(ValueError):
        service.generate_style_profile("user1")

def test_get_recommendations_found(monkeypatch):
    service = StyleAnalysisService()
    items = [{"id": 1}, {"id": 2}]
    dummy_wardrobe = DummyWardrobe(items)
    dummy_gemini = DummyGemini()
    monkeypatch.setattr("app.services.style_analysis_service.wardrobe_service", dummy_wardrobe)
    monkeypatch.setattr("app.services.style_analysis_service.gemini_service", dummy_gemini)
    recs = service.get_recommendations("user1", 1)
    assert recs == [items[0]]

def test_get_recommendations_not_found(monkeypatch):
    service = StyleAnalysisService()
    items = [{"id": 1}]
    dummy_wardrobe = DummyWardrobe(items)
    dummy_gemini = DummyGemini()
    monkeypatch.setattr("app.services.style_analysis_service.wardrobe_service", dummy_wardrobe)
    monkeypatch.setattr("app.services.style_analysis_service.gemini_service", dummy_gemini)
    recs = service.get_recommendations("user1", 999)
    assert recs == []