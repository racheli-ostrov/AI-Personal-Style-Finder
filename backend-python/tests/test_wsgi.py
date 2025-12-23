def test_wsgi_import():
    import app.wsgi
def test_wsgi_import():
    import importlib
    wsgi = importlib.import_module("app.wsgi")
    assert hasattr(wsgi, "app")
