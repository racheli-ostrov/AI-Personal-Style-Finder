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
