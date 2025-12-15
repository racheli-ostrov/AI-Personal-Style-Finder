"""
Style Analysis Service
Business logic for AI-powered style analysis
"""
from typing import Dict, List, Any
from services.gemini_service import gemini_service
from services.wardrobe_service import wardrobe_service
from datetime import datetime

class StyleAnalysisService:
    """Service for style analysis operations"""
    
    def analyze_image(self, image_data: bytes, mime_type: str, image_info: Dict) -> Dict[str, Any]:
        """
        Analyze a clothing image and return enhanced results
        
        Args:
            image_data: Image binary data
            mime_type: Image MIME type
            image_info: Image metadata (filename, size, mimetype)
            
        Returns:
            Dict containing analysis results with enhancements
        """
        try:
            # Get AI analysis from Gemini
            analysis = gemini_service.analyze_clothing_image(image_data, mime_type)
            
            # Add metadata
            result = {
                'analysis': analysis,
                'imageInfo': image_info,
                'analyzedAt': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            raise ValueError(f'Failed to analyze image: {str(e)}')
    
    def generate_style_profile(self, user_id: str) -> Dict[str, Any]:
        print(f'[DEBUG] style_analysis_service.generate_style_profile called for user_id={user_id}')
        """
        Generate a comprehensive style profile based on wardrobe
        
        Returns:
            Dict containing style profile and statistics
        """
        try:
            # Get all wardrobe items for user
            wardrobe_items = wardrobe_service.get_all_items(user_id)
            print(f'[DEBUG] wardrobe_items (user_id={user_id}): {wardrobe_items}')

            # Require minimum items for profile
            if len(wardrobe_items) < 3:
                raise ValueError('Need at least 3 items in wardrobe to generate profile')

            # Generate profile using AI
            profile = gemini_service.generate_style_profile(wardrobe_items)
            print(f'[DEBUG] AI profile: {profile}')

            # Add statistics
            stats = wardrobe_service.get_statistics(user_id)

            result = {
                'profile': profile,
                'statistics': stats,
                'itemCount': len(wardrobe_items),
                'generatedAt': datetime.now().isoformat()
            }

            return result
            
        except Exception as e:
            raise ValueError(f'Failed to generate profile: {str(e)}')
    
    def get_recommendations(self, item_id: int) -> Dict[str, Any]:
        """
        Get style recommendations based on a specific item
        
        Args:
            item_id: ID of the reference item
            
        Returns:
            Dict containing recommendations
        """
        try:
            # Get the item
            item = wardrobe_service.get_item_by_id(item_id)
            if not item:
                raise ValueError(f'Item {item_id} not found')
            
            # Get all wardrobe items
            wardrobe_items = wardrobe_service.get_all_items()
            
            if len(wardrobe_items) < 2:
                raise ValueError('Need at least 2 items in wardrobe for recommendations')
            
            # Get recommendations from AI
            recommendations = gemini_service.find_similar_items(item, wardrobe_items)
            
            result = {
                'referenceItem': item,
                'recommendations': recommendations,
                'generatedAt': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            raise ValueError(f'Failed to get recommendations: {str(e)}')

# Create singleton instance
style_analysis_service = StyleAnalysisService()
