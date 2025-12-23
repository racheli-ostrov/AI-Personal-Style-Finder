def test_shopping_recommendations_missing_analysis():
    from app import app
    client = app.test_client()
    resp = client.post('/api/shopping/recommendations', json={})
    assert resp.status_code == 400
    assert not resp.json['success']
import pytest
from app.app import app as flask_app

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

def test_shopping_recommendations_success(client):
    # בדיקה עם analysis תקין
    analysis = {"type": "shirt", "colors": ["blue"], "style": "casual"}
    resp = client.post("/api/shopping/recommendations", json={"analysis": analysis})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["success"] is True
    assert "search_query" in data
    assert "recommendations" in data

def test_shopping_recommendations_missing_analysis(client):
    # בדיקה עם חוסר analysis
    resp = client.post("/api/shopping/recommendations", json={})
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["success"] is False
    assert "error" in data