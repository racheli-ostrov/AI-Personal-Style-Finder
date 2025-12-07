"""
Test configuration for pytest
"""
import os
import sys
import pytest

# Add backend-python to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Set test environment
os.environ['NODE_ENV'] = 'test'
os.environ['GEMINI_API_KEY'] = 'test-key'

@pytest.fixture
def app():
    """Create application for testing"""
    from app import create_app
    app = create_app()
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()
