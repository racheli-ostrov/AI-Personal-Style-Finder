"""
Style Analysis Routes
Define URL endpoints for AI style analysis
"""
from flask import Blueprint
from controllers.style_analysis_controller import style_analysis_controller

# Create blueprint
style_analysis_bp = Blueprint('style_analysis', __name__)

@style_analysis_bp.route('/analyze', methods=['POST'])
def analyze_image():
    """POST /api/style/analyze - Analyze clothing image"""
    return style_analysis_controller.analyze_image()

@style_analysis_bp.route('/profile', methods=['POST'])
def generate_profile():
    """POST /api/style/profile - Generate style profile"""
    return style_analysis_controller.generate_profile()

@style_analysis_bp.route('/recommendations/<int:item_id>', methods=['GET'])
def get_recommendations(item_id):
    """GET /api/style/recommendations/:id - Get recommendations for item"""
    return style_analysis_controller.get_recommendations(item_id)
