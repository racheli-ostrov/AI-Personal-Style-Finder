"""
Tests for Flask application
"""
import pytest

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

def test_app_creation():
    app = create_app()
    assert app is not None


def test_get_wardrobe(client):
    response = client.get("/api/wardrobe/?userId=testuser")
    assert response.status_code == 200



def test_post_wardrobe(client):
    data = {"userId": "testuser", "analysis": {}, "imageInfo": {"filename": "test.jpg", "mimetype": "image/jpeg", "data": ""}}
    response = client.post("/api/wardrobe/", json=data)
    assert response.status_code in [200, 201, 400]

def test_invalid_endpoint(client):
    response = client.get("/api/wardrobe/not_exist")
    assert response.status_code == 404
"""
Tests for Flask application
"""
import pytest
from app import create_app

def test_app_creation():
    """Test that app is created successfully"""
    app = create_app()
    assert app is not None

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'

def test_404_error(client):
    """Test 404 error handling"""
    response = client.get('/api/nonexistent')
    assert response.status_code == 404
