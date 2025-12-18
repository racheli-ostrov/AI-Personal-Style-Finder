import pytest
from backend_python.services.style_analysis_service import analyze_style

def test_analyze_style_basic():
    result = analyze_style("jeans, t-shirt")
    assert "casual" in result

# ניתן להוסיף כאן בדיקות נוספות לפונקציות אחרות בשירותים השונים
