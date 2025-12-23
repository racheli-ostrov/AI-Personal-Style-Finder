import pytest
from unittest.mock import patch, MagicMock
from app.services.gemini_service import GeminiService

def test_init_no_api_key(monkeypatch):
    monkeypatch.setenv('GEMINI_API_KEY', '')
    monkeypatch.setenv('GEMINI_API_KEY_2', '')
    monkeypatch.setenv('GEMINI_API_KEY_3', '')
    monkeypatch.setenv('NODE_ENV', 'production')
    with pytest.raises(ValueError):
        GeminiService()

def test_get_next_api_key_no_keys():
    service = GeminiService()
    service.api_keys = []
    with pytest.raises(ValueError):
        service._get_next_api_key()

def test_analyze_clothing_image_all_keys_exhausted(monkeypatch):
    service = GeminiService()
    service.api_keys = ['k1', 'k2']
    service.current_key_index = 0
    monkeypatch.setattr(service, '_get_next_api_key', lambda: 'badkey')
    monkeypatch.setattr('requests.post', lambda *a, **kw: MagicMock(status_code=429, text='quota'))
    with pytest.raises(ValueError):
        service.analyze_clothing_image(b'data', 'image/jpeg')

def test_analyze_clothing_image_json_decode(monkeypatch):
    service = GeminiService()
    service.api_keys = ['k1']
    monkeypatch.setattr(service, '_get_next_api_key', lambda: 'k1')
    class FakeResp:
        status_code = 200
        def json(self):
            return {'candidates': [{'content': {'parts': [{'text': 'not json'}]}}]}
    monkeypatch.setattr('requests.post', lambda *a, **kw: FakeResp())
    with pytest.raises(ValueError):
        service.analyze_clothing_image(b'data', 'image/jpeg')

def test_generate_style_profile_all_keys_exhausted(monkeypatch):
    service = GeminiService()
    service.api_keys = ['k1', 'k2']
    monkeypatch.setattr(service, '_get_next_api_key', lambda: 'badkey')
    monkeypatch.setattr('requests.post', lambda *a, **kw: MagicMock(status_code=429, text='quota'))
    with pytest.raises(ValueError):
        service.generate_style_profile([{'analysis': '{}'}])

def test_find_similar_items_json_decode(monkeypatch):
    service = GeminiService()
    service.api_key = 'k1'
    class FakeResp:
        status_code = 200
        def json(self):
            return {'candidates': [{'content': {'parts': [{'text': 'not json'}]}}]}
    monkeypatch.setattr('requests.post', lambda *a, **kw: FakeResp())
    with pytest.raises(ValueError):
        service.find_similar_items({'id': 1, 'analysis': '{}'}, [{'id': 1, 'analysis': '{}'}])
from app.services.gemini_service import gemini_service

def test_gemini_service_methods():
    # בדיקה שהשירות קיים ויש לו את כל הפונקציות (mock בלבד)
    assert hasattr(gemini_service, "analyze_clothing_image")
    assert hasattr(gemini_service, "generate_style_profile")
    assert hasattr(gemini_service, "find_similar_items")
