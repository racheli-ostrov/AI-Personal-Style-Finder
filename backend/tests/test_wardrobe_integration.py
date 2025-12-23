import pytest
from app.app import app as flask_app
import json

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

def test_add_and_get_item(client):
    # הוספת פריט לארון
    user_id = "integration_user1"
    image_info = {"filename": "int1.jpg", "size": 100, "mimetype": "image/jpeg"}
    analysis = {"type": "shirt", "colors": ["red"], "style": "sport"}
    # ה-API הנכון: /api/wardrobe/ (POST), userId בפרמטר
    resp = client.post("/api/wardrobe/", json={"userId": user_id, "imageInfo": image_info, "analysis": analysis})
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["success"] is True
    item = data["data"]
    assert item["imageInfo"] == image_info
    assert item["analysis"] == analysis
    # שליפת כל הפריטים
    resp2 = client.get(f"/api/wardrobe/?userId={user_id}")
    assert resp2.status_code == 200
    data2 = resp2.get_json()
    assert data2["success"] is True
    items = data2["data"]
    assert any(i["id"] == item["id"] for i in items)

def test_delete_item_flow(client):
    user_id = "integration_user2"
    image_info = {"filename": "int2.jpg"}
    analysis = {"type": "pants"}
    # הוספה
    resp = client.post("/api/wardrobe/", json={"userId": user_id, "imageInfo": image_info, "analysis": analysis})
    item = resp.get_json()["data"]
    # מחיקה
    resp2 = client.delete(f"/api/wardrobe/{item['id']}?userId={user_id}")
    assert resp2.status_code == 200
    # בדיקה שהפריט לא קיים
    resp3 = client.get(f"/api/wardrobe/?userId={user_id}")
    items = resp3.get_json()["data"]
    assert all(i["id"] != item["id"] for i in items)

def test_toggle_favorite_flow(client):
    user_id = "integration_user3"
    image_info = {"filename": "int3.jpg"}
    analysis = {"type": "dress"}
    resp = client.post("/api/wardrobe/", json={"userId": user_id, "imageInfo": image_info, "analysis": analysis})
    item = resp.get_json()["data"]
    # הפיכת מועדף
    resp2 = client.patch(f"/api/wardrobe/{item['id']}/favorite?userId={user_id}")
    assert resp2.status_code == 200
    toggled = resp2.get_json()["data"]
    assert toggled["favorite"] is True