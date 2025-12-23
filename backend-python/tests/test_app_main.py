def test_debug_print_and_env(monkeypatch, capsys):
    import app.app as app_module
    monkeypatch.setenv('GEMINI_API_KEY', 'testkey')
    app_module.debug_print('test123')
    captured = capsys.readouterr()
    assert 'test123' in captured.out
def test_main_block(monkeypatch):
    import sys
    import importlib
    import app.app as app_module
    monkeypatch.setattr(sys, "argv", ["app.py"])
    # Simulate __name__ == "__main__"
    monkeypatch.setattr(app_module, "__name__", "__main__")
    # Should not raise (will not actually run server in test)
    importlib.reload(app_module)
import pytest
from app.app import create_app

def test_create_app():
    app = create_app()
    assert app is not None
    assert hasattr(app, 'route')

# בדיקת health check
@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "ok"
    assert data["message"] == "Server is running"
