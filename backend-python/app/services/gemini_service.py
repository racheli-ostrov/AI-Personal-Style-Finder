
import os

# 🚫 FORCE DISABLE PROXY — ALWAYS
os.environ.pop("HTTP_PROXY", None)
os.environ.pop("HTTPS_PROXY", None)
os.environ.pop("http_proxy", None)
os.environ.pop("https_proxy", None)

"""
Gemini AI Service
Handles all interactions with Google's Gemini API
"""
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
        """Initialize Gemini service with multiple API keys for rotation"""
        # Load all available API keys
        self.api_keys = []
        
        key1 = os.getenv('GEMINI_API_KEY')
        key2 = os.getenv('GEMINI_API_KEY_2')
        key3 = os.getenv('GEMINI_API_KEY_3')
        
        if key1:
            self.api_keys.append(key1)
        if key2:
            self.api_keys.append(key2)
        if key3:
            self.api_keys.append(key3)
        
        if not self.api_keys and os.getenv('NODE_ENV') != 'test':
            raise ValueError('No GEMINI_API_KEY configured')
        
        self.current_key_index = 0
        
        # Debug: Print number of keys loaded
        print(f"🔑 Loaded {len(self.api_keys)} API key(s)")
        for i, key in enumerate(self.api_keys, 1):
            masked_key = f"{key[:8]}...{key[-4:]}"
            print(f"   Key {i}: {masked_key}")  # Consider replacing with logger.debug in production
        
        self.api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
    
    def _get_next_api_key(self) -> str:
        """Get the next API key in rotation"""
        if not self.api_keys:
            raise ValueError('No API keys available')
        
        key = self.api_keys[self.current_key_index]
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        return key
    
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
            prompt = """
Analyze this clothing item and provide a JSON response with the following structure:
{
    "type": "shirt/pants/dress/shoes/accessory/jacket/skirt/etc (REQUIRED, one word only)",
    "colors": ["primary color", "secondary color"],
    "pattern": "solid/striped/floral/checkered/etc",
    "style": "casual/formal/sporty/elegant/etc",
    "fabric": "cotton/denim/leather/silk/etc",
    "season": "summer/winter/spring/fall/all-season",
    "occasion": "daily/work/party/sport/etc"
}

IMPORTANT: The "type" field is REQUIRED and must be a single word describing the clothing item (e.g., "shirt", "pants", "skirt", "dress", etc). Do NOT leave it empty. If you are unsure, make your best guess.

Provide accurate and specific information based on what you see in the image.
"""


            # Log image size only, do not print image data
            print(f"[DEBUG] image size: {len(image_data)} chars")
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
            
            # Make API request with longer timeout for image processing
            # Try each API key until one works
            last_error = None
            
            for attempt in range(len(self.api_keys)):
                try:
                    current_key = self._get_next_api_key()
                    print(f"🔄 Trying API key {self.current_key_index}/{len(self.api_keys)}")
                    
                    response = requests.post(
                        f'{self.api_url}?key={current_key}',
                        json=payload,
                        headers={'Content-Type': 'application/json'},
                        timeout=60,
                        verify=False,
                        proxies={}  # 🚫 NO PROXY EVER
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Success with key {self.current_key_index}")
                        break
                    elif response.status_code == 429:
                        print(f"⚠️ Key {self.current_key_index} quota exceeded, trying next key...")
                        last_error = f'API request failed with status {response.status_code}: {response.text}'
                        continue
                    else:
                        raise ValueError(f'API request failed with status {response.status_code}: {response.text}')
                        
                except requests.exceptions.RequestException as e:
                    last_error = str(e)
                    print(f"❌ Request failed with key {self.current_key_index}: {e}")
                    continue
            else:
                # All keys failed
                raise ValueError(f'All API keys exhausted. Last error: {last_error}')
            
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
            # Ensure 'type' is present and mapped to 'clothing_type' for consistency
            if 'type' in result:
                result['clothing_type'] = result['type']
            elif 'clothing_type' not in result:
                raise ValueError('Gemini response missing required "type" field')
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
                # If analysis was stored as a JSON string, try to parse it
                if isinstance(analysis, str):
                    try:
                        analysis = json.loads(analysis)
                    except Exception:
                        analysis = {"type": analysis}

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
            
            # Make API request with key rotation
            last_error = None
            
            for attempt in range(len(self.api_keys)):
                try:
                    current_key = self._get_next_api_key()
                    
                    response = requests.post(
                        f'{self.api_url}?key={current_key}',
                        json=payload,
                        headers={'Content-Type': 'application/json'},
                        timeout=60,
                        verify=False
                    )
                    
                    if response.status_code == 200:
                        break
                    elif response.status_code == 429:
                        last_error = f'API request failed with status {response.status_code}: {response.text}'
                        continue
                    else:
                        raise ValueError(f'API request failed with status {response.status_code}: {response.text}')
                        
                except requests.exceptions.RequestException as e:
                    last_error = str(e)
                    continue
            else:
                raise ValueError(f'All API keys exhausted. Last error: {last_error}')
            
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
            if isinstance(item_analysis, str):
                try:
                    item_analysis = json.loads(item_analysis)
                except Exception:
                    item_analysis = {"type": item_analysis}
            
            wardrobe_summary = []
            for wardrobe_item in wardrobe_items:
                if wardrobe_item['id'] != item['id']:
                    analysis = wardrobe_item.get('analysis', {})
                    if isinstance(analysis, str):
                        try:
                            analysis = json.loads(analysis)
                        except Exception:
                            analysis = {"type": analysis}

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
                timeout=60,
                verify=False,
                proxies={}  # 🚫 NO PROXY EVER
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
