"""
Style Analysis Controller
Handles HTTP requests for AI style analysis
"""
from flask import request, jsonify
from services.style_analysis_service import style_analysis_service
from services.wardrobe_service import wardrobe_service
import asyncio

class StyleAnalysisController:
    """Controller for style analysis endpoints"""
    
    def analyze_image(self):
        """
        POST /api/style/analyze
        Analyze uploaded clothing image
        """
        try:
            # Validate file upload
            if 'image' not in request.files:
                return jsonify({
                    'success': False,
                    'error': 'No image file provided'
                }), 400
            
            file = request.files['image']
            
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'error': 'No file selected'
                }), 400
            
            # Read image data
            image_data = file.read()
            mime_type = file.content_type
            
            # Convert image to base64 for storage
            import base64
            image_base64 = f"data:{mime_type};base64," + base64.b64encode(image_data).decode('utf-8')
            
            # Get userId from request
            user_id = request.form.get('userId')
            if not user_id:
                return jsonify({
                    'success': False,
                    'error': 'User ID is required'
                }), 401
            
            # Prepare image info
            image_info = {
                'filename': file.filename,
                'size': len(image_data),
                'mimetype': mime_type,
                'data': image_base64  # Add the base64 image data
            }
            
            # Analyze image
            result = style_analysis_service.analyze_image(
                image_data, 
                mime_type, 
                image_info
            )
            
            # Add to wardrobe with userId
            wardrobe_item = wardrobe_service.add_item(
                user_id,
                image_info,
                result['analysis']
            )
            
            return jsonify({
                'success': True,
                'data': {
                    'analysis': result['analysis'],
                    'wardrobeItem': wardrobe_item
                }
            }), 200
            
        except ValueError as e:
            print(f'ValueError in analyzeImage: {str(e)}')
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400
        except Exception as e:
            print(f'Error in analyzeImage controller: {str(e)}')
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': 'Failed to analyze image'
            }), 500
    
    def generate_profile(self):
        """
        POST /api/style/profile
        Generate style profile from wardrobe
        """
        try:
            result = style_analysis_service.generate_style_profile()
            
            return jsonify({
                'success': True,
                'data': result
            }), 200
            
        except ValueError as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400
        except Exception as e:
            print(f'Error in generateProfile controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to generate profile'
            }), 500
    
    def get_recommendations(self, item_id: int):
        """
        GET /api/style/recommendations/:id
        Get recommendations for specific item
        """
        try:
            result = style_analysis_service.get_recommendations(item_id)
            
            return jsonify({
                'success': True,
                'data': result
            }), 200
            
        except ValueError as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 404
        except Exception as e:
            print(f'Error in getRecommendations controller: {str(e)}')
            return jsonify({
                'success': False,
                'error': 'Failed to get recommendations'
            }), 500

# Create singleton instance
style_analysis_controller = StyleAnalysisController()
