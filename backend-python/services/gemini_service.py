"""
Gemini AI Service
Handles all interactions with Google's Gemini API
"""
import os
import base64
import json
from typing import Dict, List, Any
import requests
import urllib3

# Disable SSL warnings for development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class GeminiService:
    """Service for interacting with Gemini AI API"""
    
    def __init__(self):
        """Initialize Gemini service"""
        # Allow tests to run without API key
        if not os.getenv('GEMINI_API_KEY') and os.getenv('NODE_ENV') != 'test':
            raise ValueError('GEMINI_API_KEY is not configured')
        
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    
    def analyze_clothing_image(self, image_data: bytes, mime_type: str) -> Dict[str, Any]:
        """
        Analyze clothing item from image
        
        Args:
            image_data: Image binary data
            mime_type: Image MIME type
            
        Returns:
            Dict containing analysis results
        """
        try:
            # Prepare the prompt
            prompt = """Analyze this clothing item and provide a JSON response with the following structure:
{
  "type": "shirt/pants/dress/shoes/accessory/jacket/skirt/etc",
  "colors": ["primary color", "secondary color"],
  "pattern": "solid/striped/floral/checkered/etc",
  "style": "casual/formal/sporty/elegant/etc",
  "fabric": "cotton/denim/leather/silk/etc",
  "season": "summer/winter/spring/fall/all-season",
  "occasion": "daily/work/party/sport/etc"
}

Provide accurate and specific information based on what you see in the image."""

            # Convert image to base64
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            # Prepare request payload
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": image_base64
                            }
                        }
                    ]
                }]
            }
            
            # Make API request
            response = requests.post(
                f'{self.api_url}?key={self.api_key}',
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code != 200:
                raise ValueError(f'API request failed with status {response.status_code}: {response.text}')
            
            # Parse response
            result_data = response.json()
            result_text = result_data['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Remove markdown code blocks if present
            if result_text.startswith('```json'):
                result_text = result_text[7:]
            if result_text.startswith('```'):
                result_text = result_text[3:]
            if result_text.endswith('```'):
                result_text = result_text[:-3]
            
            result = json.loads(result_text.strip())
            return result
            
        except json.JSONDecodeError as e:
            raise ValueError(f'Failed to parse Gemini response as JSON: {str(e)}')
        except Exception as e:
            print(f'Error analyzing image with Gemini: {str(e)}')
            raise ValueError(f'Image analysis failed: {str(e)}')
    
    def generate_style_profile(self, wardrobe_items: List[Dict]) -> Dict[str, Any]:
        """
        Generate a style profile based on wardrobe items
        
        Args:
            wardrobe_items: List of wardrobe items with their analysis
            
        Returns:
            Dict containing style profile
        """
        try:
            # Create a summary of the wardrobe
            wardrobe_summary = []
            for item in wardrobe_items:
                analysis = item.get('analysis', {})
                wardrobe_summary.append({
                    'type': analysis.get('type', 'unknown'),
                    'colors': analysis.get('colors', []),
                    'style': analysis.get('style', 'unknown'),
                    'pattern': analysis.get('pattern', 'unknown')
                })
            
            prompt = f"""Based on this wardrobe collection, create a comprehensive style profile.

Wardrobe items: {json.dumps(wardrobe_summary, indent=2)}

Provide a JSON response with this structure:
{{
  "dominantStyle": "casual/formal/sporty/elegant/etc",
  "colorPalette": ["color1", "color2", "color3"],
  "stylePersonality": "A 2-3 sentence description of their style",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ],
  "missingPieces": ["item type 1", "item type 2"]
}}

Be specific and personalized based on the actual wardrobe items."""

            # Prepare request payload
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            # Make API request
            response = requests.post(
                f'{self.api_url}?key={self.api_key}',
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code != 200:
                raise ValueError(f'API request failed with status {response.status_code}: {response.text}')
            
            # Parse response
            result_data = response.json()
            result_text = result_data['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Remove markdown code blocks if present
            if result_text.startswith('```json'):
                result_text = result_text[7:]
            if result_text.startswith('```'):
                result_text = result_text[3:]
            if result_text.endswith('```'):
                result_text = result_text[:-3]
            
            result = json.loads(result_text.strip())
            return result
            
        except json.JSONDecodeError as e:
            raise ValueError(f'Failed to parse Gemini response as JSON: {str(e)}')
        except Exception as e:
            print(f'Error generating style profile: {str(e)}')
            raise ValueError(f'Profile generation failed: {str(e)}')
    
    def find_similar_items(self, item: Dict, wardrobe_items: List[Dict]) -> List[Dict]:
        """
        Find items similar to the given item
        
        Args:
            item: The reference item
            wardrobe_items: List of wardrobe items to compare against
            
        Returns:
            List of recommendations
        """
        try:
            item_analysis = item.get('analysis', {})
            
            wardrobe_summary = []
            for wardrobe_item in wardrobe_items:
                if wardrobe_item['id'] != item['id']:
                    analysis = wardrobe_item.get('analysis', {})
                    wardrobe_summary.append({
                        'id': wardrobe_item['id'],
                        'type': analysis.get('type', 'unknown'),
                        'colors': analysis.get('colors', []),
                        'style': analysis.get('style', 'unknown')
                    })
            
            prompt = f"""Based on this clothing item, suggest matching items from the wardrobe.

Reference item:
{json.dumps(item_analysis, indent=2)}

Available wardrobe items:
{json.dumps(wardrobe_summary, indent=2)}

Provide a JSON response with this structure:
{{
  "recommendations": [
    {{
      "itemId": "id from wardrobe",
      "matchScore": 0-100,
      "reason": "Why this item matches well"
    }}
  ]
}}

Suggest 3-5 best matching items."""

            # Prepare request payload
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            # Make API request
            response = requests.post(
                f'{self.api_url}?key={self.api_key}',
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code != 200:
                raise ValueError(f'API request failed with status {response.status_code}: {response.text}')
            
            # Parse response
            result_data = response.json()
            result_text = result_data['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Remove markdown code blocks if present
            if result_text.startswith('```json'):
                result_text = result_text[7:]
            if result_text.startswith('```'):
                result_text = result_text[3:]
            if result_text.endswith('```'):
                result_text = result_text[:-3]
            
            result = json.loads(result_text.strip())
            return result.get('recommendations', [])
            
        except json.JSONDecodeError as e:
            raise ValueError(f'Failed to parse Gemini response as JSON: {str(e)}')
        except Exception as e:
            print(f'Error finding similar items: {str(e)}')
            raise ValueError(f'Recommendation generation failed: {str(e)}')

# Create singleton instance
gemini_service = GeminiService()
