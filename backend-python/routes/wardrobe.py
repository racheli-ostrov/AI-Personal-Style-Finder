"""
Wardrobe Routes
Define URL endpoints for wardrobe management
"""
from flask import Blueprint
from controllers.wardrobe_controller import wardrobe_controller

# Create blueprint
wardrobe_bp = Blueprint('wardrobe', __name__)

# GET /api/wardrobe/statistics must come before /:id to avoid route conflicts
@wardrobe_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """GET /api/wardrobe/statistics - Get wardrobe statistics"""
    return wardrobe_controller.get_statistics()

@wardrobe_bp.route('/', methods=['GET'])
def get_all_items():
    """GET /api/wardrobe - Get all wardrobe items"""
    return wardrobe_controller.get_all_items()

@wardrobe_bp.route('/', methods=['POST'])
def add_item():
    """POST /api/wardrobe - Add item to wardrobe"""
    return wardrobe_controller.add_item()

@wardrobe_bp.route('/', methods=['DELETE'])
def clear_wardrobe():
    """DELETE /api/wardrobe - Clear all items"""
    return wardrobe_controller.clear_wardrobe()

@wardrobe_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """DELETE /api/wardrobe/:id - Delete specific item"""
    return wardrobe_controller.delete_item(item_id)

@wardrobe_bp.route('/<int:item_id>/favorite', methods=['PATCH'])
def toggle_favorite(item_id):
    """PATCH /api/wardrobe/:id/favorite - Toggle favorite status"""
    return wardrobe_controller.toggle_favorite(item_id)
