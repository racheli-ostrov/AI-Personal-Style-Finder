def test_generate_shopping_links_empty_analysis():
    from app.services.shopping_service import ShoppingService
    service = ShoppingService()
    links = service.generate_shopping_links({})
    assert links == []
# Additional tests for coverage
import pytest
from app.services.shopping_service import ShoppingService

def test_ensure_analysis_invalid_json():
    service = ShoppingService()
    # Pass a string that is not valid JSON
    result = service._ensure_analysis('{not: valid}')
    assert isinstance(result, dict)
    assert 'type' in result

def test_generate_search_query_missing_fields():
    service = ShoppingService()
    # Pass analysis with no expected fields
    query = service.generate_search_query({})
    assert query == ""
import pytest
from app.services.shopping_service import ShoppingService

@pytest.fixture
def service():
    return ShoppingService()

def test_generate_search_query(service):
    analysis = {"type": "shirt", "colors": ["blue"], "style": "casual"}
    query = service.generate_search_query(analysis)
    assert isinstance(query, str)
    assert "shirt" in query or "casual" in query

def test_generate_shopping_links(service):
    analysis = {"type": "shirt", "colors": ["blue"], "style": "casual"}
    links = service.generate_shopping_links(analysis)
    assert isinstance(links, list)
    assert all("url" in l for l in links)

def test_generate_shopping_links_empty(service):
    links = service.generate_shopping_links({})
    assert isinstance(links, list)
