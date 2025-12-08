"""
Wardrobe Controller
Handles HTTP requests for wardrobe management
"""
from flask import request, jsonify
from services.wardrobe_service import wardrobe_service

class WardrobeController:
    """Controller for wardrobe endpoints"""
    
    def get_all_items(self):
        """
        GET /api/wardrobe
        Get all wardrobe items
        """
        try:
            items = wardrobe_service.get_all_items()
            return jsonify({
                'success': True,
                'data': items
            }), 200
        except Exception as e:
            print(f'Error in getAllItems controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to fetch items'
            }), 500
    
    def add_item(self):
        """
        POST /api/wardrobe
        Add item to wardrobe (typically done via analyze endpoint)
        """
        try:
            data = request.get_json()
            
            # Support both formats: from analyze endpoint and from frontend
            if not data or 'analysis' not in data:
                return jsonify({
                    'success': False,
                    'error': 'Missing required fields'
                }), 400
            
            # Get imageInfo - either from data or create from imageData
            image_info = data.get('imageInfo')
            if not image_info and 'imageData' in data:
                # Create basic imageInfo from imageData
                image_info = {
                    'filename': 'uploaded_image.jpg',
                    'mimetype': 'image/jpeg',
                    'data': data['imageData']
                }
            
            if not image_info:
                return jsonify({
                    'success': False,
                    'error': 'Missing image information'
                }), 400
            
            item = wardrobe_service.add_item(image_info, data['analysis'])
            
            return jsonify({
                'success': True,
                'data': item
            }), 201
            
        except Exception as e:
            print(f'Error in addItem controller: {str(e)}')
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': 'Failed to add item'
            }), 500
    
    def delete_item(self, item_id: int):
        """
        DELETE /api/wardrobe/:id
        Delete item from wardrobe
        """
        try:
            success = wardrobe_service.delete_item(item_id)
            
            if not success:
                return jsonify({
                    'success': False,
                    'error': 'Item not found'
                }), 404
            
            return jsonify({
                'success': True,
                'message': 'Item deleted successfully'
            }), 200
            
        except Exception as e:
            print(f'Error in deleteItem controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to delete item'
            }), 500
    
    def toggle_favorite(self, item_id: int):
        """
        PATCH /api/wardrobe/:id/favorite
        Toggle favorite status
        """
        try:
            item = wardrobe_service.toggle_favorite(item_id)
            
            if not item:
                return jsonify({
                    'success': False,
                    'error': 'Item not found'
                }), 404
            
            return jsonify({
                'success': True,
                'data': item
            }), 200
            
        except Exception as e:
            print(f'Error in toggleFavorite controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to update favorite status'
            }), 500
    
    def clear_wardrobe(self):
        """
        DELETE /api/wardrobe
        Clear all items from wardrobe
        """
        try:
            wardrobe_service.clear_wardrobe()
            
            return jsonify({
                'success': True,
                'message': 'Wardrobe cleared successfully'
            }), 200
            
        except Exception as e:
            print(f'Error in clearWardrobe controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to clear wardrobe'
            }), 500
    
    def get_statistics(self):
        """
        GET /api/wardrobe/statistics
        Get wardrobe statistics
        """
        try:
            stats = wardrobe_service.get_statistics()
            
            return jsonify({
                'success': True,
                'data': stats
            }), 200
            
        except Exception as e:
            print(f'Error in getStatistics controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to fetch statistics'
            }), 500

# Create singleton instance
wardrobe_controller = WardrobeController()
