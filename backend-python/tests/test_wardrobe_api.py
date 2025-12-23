import pytest
from app.app import app

def test_get_all_items_missing_userid():
    client = app.test_client()
    resp = client.get('/api/wardrobe/')
    assert resp.status_code == 401
    assert not resp.json['success']

def test_add_item_missing_userid():
    client = app.test_client()
    resp = client.post('/api/wardrobe/', json={})
    assert resp.status_code == 401
    assert not resp.json['success']

def test_clear_wardrobe_missing_userid():
    client = app.test_client()
    resp = client.delete('/api/wardrobe/')
    assert resp.status_code == 200
    assert resp.json['success']

def test_delete_item_and_not_found():
    client = app.test_client()
    resp = client.delete('/api/wardrobe/999999?userId=notfound')
    assert resp.status_code == 200
    assert resp.json['success']

def test_toggle_favorite_not_found():
    client = app.test_client()
    resp = client.patch('/api/wardrobe/999999/favorite?userId=notfound')
    assert resp.status_code == 404
    assert not resp.json['success']
import pytest
from app.app import app as flask_app

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

def test_get_all_items_missing_userid(client):
    resp = client.get("/api/wardrobe/")
    assert resp.status_code == 401
    assert resp.get_json()["success"] is False

def test_add_item_missing_userid(client):
    resp = client.post("/api/wardrobe/", json={"imageInfo": {}, "analysis": {}})
    assert resp.status_code == 401
    assert resp.get_json()["success"] is False

def test_clear_wardrobe(client):
    user_id = "api_test_user"
    # הוספת פריט
    client.post("/api/wardrobe/", json={"userId": user_id, "imageInfo": {"filename": "a.jpg"}, "analysis": {"type": "shirt"}})
    # ניקוי
    resp = client.delete(f"/api/wardrobe/?userId={user_id}")
    assert resp.status_code == 200
    assert resp.get_json()["success"] is True

def test_delete_item_and_not_found(client):
    user_id = "api_test_user2"
    # הוספת פריט
    add = client.post("/api/wardrobe/", json={"userId": user_id, "imageInfo": {"filename": "b.jpg"}, "analysis": {"type": "pants"}})
    item_id = add.get_json()["data"]["id"]
    # מחיקה
    resp = client.delete(f"/api/wardrobe/{item_id}?userId={user_id}")
    assert resp.status_code == 200
    # מחיקת פריט לא קיים
    resp2 = client.delete(f"/api/wardrobe/99999?userId={user_id}")
    assert resp2.status_code == 200

def test_toggle_favorite_not_found(client):
    user_id = "api_test_user3"
    resp = client.patch(f"/api/wardrobe/99999/favorite?userId={user_id}")
    assert resp.status_code == 404
    assert resp.get_json()["success"] is False