def test_generate_profile_missing_userid():
    from app import app
    client = app.test_client()
    resp = client.post('/api/style/profile', json={})
    assert resp.status_code == 401
    assert not resp.json['success']

def test_generate_profile_error(monkeypatch):
    from app import app
    client = app.test_client()
    # Patch service to raise error
    import app.services.style_analysis_service as sas
    monkeypatch.setattr(sas.style_analysis_service, 'generate_style_profile', lambda user_id: (_ for _ in ()).throw(Exception('fail')))
    resp = client.post('/api/style/profile', json={'userId': 'u'})
    assert resp.status_code == 400
    assert not resp.json['success']
# בדיקה ל-generate_profile עם פחות מ-3 פריטים (אמור להחזיר שגיאה)
import app.services.wardrobe_service as ws
def test_generate_profile_too_few_items(monkeypatch, client):
    # מחזיר פחות מ-3 פריטים
    monkeypatch.setattr(ws.wardrobe_service, "get_all_items", lambda user_id: [{"id": 1}])
    resp = client.post("/api/style/profile", json={"userId": "user_test"})
    assert resp.status_code == 400 or resp.status_code == 500
    data = resp.get_json()
    assert data["success"] is False or "error" in data
import pytest
from app.app import app as flask_app
import io

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

def test_analyze_image_missing_image(client):
    # שליחה ללא קובץ תמונה
    data = {"userId": "user_test"}
    resp = client.post("/api/style/analyze", data=data)
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False
    assert "No image provided" in resp.get_json()["error"]

def test_analyze_image_missing_userid(client):
    # שליחה עם תמונה אך ללא userId
    img = (io.BytesIO(b"fakeimage"), "test.jpg")
    data = {}
    resp = client.post("/api/style/analyze", data={"image": img}, content_type="multipart/form-data")
    assert resp.status_code == 401
    assert resp.get_json()["success"] is False
    assert "User ID required" in resp.get_json()["error"]

# בדיקה תקינה (עם userId ותמונה) - נשתמש ב-mock ל-gemini_service כדי לא להפעיל AI אמיתי
import app.services.style_analysis_service as sas
import app.services.gemini_service as gs
import app.services.wardrobe_service as ws

def test_analyze_image_success(monkeypatch, client):
    # מוקים
    monkeypatch.setattr(gs.gemini_service, "analyze_clothing_image", lambda data, mime: {"type": "shirt", "colors": ["blue"]})
    monkeypatch.setattr(ws.wardrobe_service, "add_item", lambda user_id, image_info, analysis: {"id": 1, "imageInfo": image_info, "analysis": analysis, "favorite": False, "addedAt": "now"})
    img = (io.BytesIO(b"fakeimage"), "test.jpg")
    data = {"userId": "user_test"}
    resp = client.post("/api/style/analyze", data={"userId": "user_test", "image": img}, content_type="multipart/form-data")
    assert resp.status_code == 200
    out = resp.get_json()
    assert out["success"] is True
    assert "analysis" in out["data"]
    assert "wardrobeItem" in out["data"]