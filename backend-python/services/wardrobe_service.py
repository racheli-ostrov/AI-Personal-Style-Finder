"""
Wardrobe Service
Business logic for managing wardrobe items
"""
from typing import Dict, List, Optional, Any
from datetime import datetime

class WardrobeService:
    """Service for managing wardrobe items"""
    
    def __init__(self):
        """Initialize wardrobe service with in-memory storage"""
        self.wardrobe: List[Dict] = []
        self.item_id_counter = 1
    
    def get_all_items(self) -> List[Dict]:
        """Get all wardrobe items"""
        return self.wardrobe.copy()
    
    def get_item_by_id(self, item_id: int) -> Optional[Dict]:
        """Get a specific item by ID"""
        for item in self.wardrobe:
            if item['id'] == item_id:
                return item.copy()
        return None
    
    def add_item(self, image_info: Dict, analysis: Dict) -> Dict:
        """
        Add a new item to the wardrobe
        
        Args:
            image_info: Image metadata (filename, size, mimetype, data)
            analysis: AI analysis results
            
        Returns:
            The newly created item
        """
        # Extract imageData from image_info if it exists
        image_data = image_info.get('data', '')
        
        new_item = {
            'id': self.item_id_counter,
            'imageInfo': image_info,
            'imageData': image_data,  # Store the actual image data
            'analysis': analysis,
            'addedAt': datetime.now().isoformat(),
            'favorite': False
        }
        
        self.item_id_counter += 1
        self.wardrobe.append(new_item)
        
        return new_item.copy()
    
    def delete_item(self, item_id: int) -> bool:
        """
        Delete an item from the wardrobe
        
        Args:
            item_id: ID of item to delete
            
        Returns:
            True if deleted, False if not found
        """
        for i, item in enumerate(self.wardrobe):
            if item['id'] == item_id:
                self.wardrobe.pop(i)
                return True
        return False
    
    def toggle_favorite(self, item_id: int) -> Optional[Dict]:
        """
        Toggle favorite status of an item
        
        Args:
            item_id: ID of item to toggle
            
        Returns:
            Updated item or None if not found
        """
        for item in self.wardrobe:
            if item['id'] == item_id:
                item['favorite'] = not item['favorite']
                return item.copy()
        return None
    
    def clear_wardrobe(self) -> None:
        """Clear all items from wardrobe"""
        self.wardrobe.clear()
        self.item_id_counter = 1
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Calculate wardrobe statistics
        
        Returns:
            Dict containing statistics
        """
        total_items = len(self.wardrobe)
        favorite_items = sum(1 for item in self.wardrobe if item.get('favorite', False))
        
        # Count item types
        item_types: Dict[str, int] = {}
        for item in self.wardrobe:
            item_type = item.get('analysis', {}).get('type', 'unknown')
            item_types[item_type] = item_types.get(item_type, 0) + 1
        
        # Count dominant colors
        color_counts: Dict[str, int] = {}
        for item in self.wardrobe:
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
