"""
Wardrobe Service
Business logic for managing wardrobe items
"""
from typing import Dict, List, Optional, Any
from datetime import datetime

class WardrobeService:
    """Service for managing wardrobe items"""
    
    def __init__(self):
        """Initialize wardrobe service with in-memory storage per user"""
        # Dictionary to store wardrobes per user: {userId: {items: [], counter: int}}
        self.wardrobes: Dict[str, Dict] = {}
    
    def _get_user_wardrobe(self, user_id: str) -> Dict:
        """Get or create wardrobe for specific user"""
        if user_id not in self.wardrobes:
            self.wardrobes[user_id] = {
                'items': [],
                'counter': 1
            }
        return self.wardrobes[user_id]
    
    def get_all_items(self, user_id: str) -> List[Dict]:
        """Get all wardrobe items for specific user"""
        user_wardrobe = self._get_user_wardrobe(user_id)
        return user_wardrobe['items'].copy()
    
    def get_item_by_id(self, user_id: str, item_id: int) -> Optional[Dict]:
        """Get a specific item by ID for specific user"""
        user_wardrobe = self._get_user_wardrobe(user_id)
        for item in user_wardrobe['items']:
            if item['id'] == item_id:
                return item.copy()
        return None
    
    def add_item(self, user_id: str, image_info: Dict, analysis: Dict) -> Dict:
        """
        Add a new item to the wardrobe for specific user
        
        Args:
            user_id: User identifier
            image_info: Image metadata (filename, size, mimetype, data)
            analysis: AI analysis results
            
        Returns:
            The newly created item
        """
        user_wardrobe = self._get_user_wardrobe(user_id)
        
        # Extract imageData from image_info if it exists
        image_data = image_info.get('data', '')
        
        new_item = {
            'id': user_wardrobe['counter'],
            'imageInfo': image_info,
            'imageData': image_data,  # Store the actual image data
            'analysis': analysis,
            'addedAt': datetime.now().isoformat(),
            'favorite': False
        }
        
        user_wardrobe['counter'] += 1
        user_wardrobe['items'].append(new_item)
        
        return new_item.copy()
    
    def delete_item(self, user_id: str, item_id: int) -> bool:
        """
        Delete an item from the wardrobe for specific user
        
        Args:
            user_id: User identifier
            item_id: ID of item to delete
            
        Returns:
            True if deleted, False if not found
        """
        user_wardrobe = self._get_user_wardrobe(user_id)
        for i, item in enumerate(user_wardrobe['items']):
            if item['id'] == item_id:
                user_wardrobe['items'].pop(i)
                return True
        return False
    
    def toggle_favorite(self, user_id: str, item_id: int) -> Optional[Dict]:
        """
        Toggle favorite status of an item for specific user
        
        Args:
            user_id: User identifier
            item_id: ID of item to toggle
            
        Returns:
            Updated item or None if not found
        """
        user_wardrobe = self._get_user_wardrobe(user_id)
        for item in user_wardrobe['items']:
            if item['id'] == item_id:
                item['favorite'] = not item['favorite']
                return item.copy()
        return None
    
    def clear_wardrobe(self, user_id: str) -> None:
        """Clear all items from wardrobe for specific user"""
        user_wardrobe = self._get_user_wardrobe(user_id)
        user_wardrobe['items'].clear()
        user_wardrobe['counter'] = 1
    
    def get_statistics(self, user_id: str) -> Dict[str, Any]:
        """
        Calculate wardrobe statistics for specific user
        
        Args:
            user_id: User identifier
            
        Returns:
            Dict containing statistics
        """
        user_wardrobe = self._get_user_wardrobe(user_id)
        items = user_wardrobe['items']
        
        total_items = len(items)
        favorite_items = sum(1 for item in items if item.get('favorite', False))
        
        # Count item types
        item_types: Dict[str, int] = {}
        for item in items:
            item_type = item.get('analysis', {}).get('type', 'unknown')
            item_types[item_type] = item_types.get(item_type, 0) + 1
        
        # Count dominant colors
        color_counts: Dict[str, int] = {}
        for item in items:
            colors = item.get('analysis', {}).get('colors', [])
            for color in colors:
                color_counts[color] = color_counts.get(color, 0) + 1
        
        # Get top 5 colors
        dominant_colors = sorted(color_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        dominant_colors = [color for color, _ in dominant_colors]
        
        return {
            'totalItems': total_items,
            'favoriteItems': favorite_items,
            'itemTypes': item_types,
            'dominantColors': dominant_colors
        }

# Create singleton instance
wardrobe_service = WardrobeService()
