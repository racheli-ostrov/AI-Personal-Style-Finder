

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from services.style_analysis_service import style_analysis_service

def test_style_analysis_service_has_methods():
    assert hasattr(style_analysis_service, 'analyze_image')
    assert hasattr(style_analysis_service, 'generate_style_profile')
    assert hasattr(style_analysis_service, 'get_recommendations')


# ניתן להוסיף כאן בדיקות נוספות לפונקציות אחרות בשירותים השונים
