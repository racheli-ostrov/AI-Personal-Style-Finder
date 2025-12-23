"""
Shopping routes
"""
from flask import Blueprint
from controllers.shopping_controller import get_shopping_recommendations

shopping_bp = Blueprint('shopping', __name__)

@shopping_bp.route('/recommendations', methods=['POST'])
def shopping_recommendations():
    """POST /api/shopping/recommendations - Get shopping recommendations"""
    return get_shopping_recommendations()
