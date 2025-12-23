import importlib
import sys
import types

def test_app_main_block(monkeypatch):
    # מונע הרצה אמיתית של app.run
    monkeypatch.setattr("app.app.app.run", lambda *a, **kw: None)
    monkeypatch.setattr("builtins.print", lambda *a, **k: None)
    sys.modules["__main__"] = types.SimpleNamespace(__file__="app/app.py")
    importlib.reload(importlib.import_module("app.app"))

def test_wsgi_main_block():
    import app.wsgi
    assert hasattr(app.wsgi, "app")
