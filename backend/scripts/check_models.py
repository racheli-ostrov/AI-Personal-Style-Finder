"""
Check available Gemini models
"""
import os
import requests
from dotenv import load_dotenv
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')

# List all available models
url = f'https://generativelanguage.googleapis.com/v1beta/models?key={api_key}'

try:
    response = requests.get(url, verify=False, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        models = data.get('models', [])
        
        print(f"\n{'='*80}")
        print(f"Found {len(models)} available models:")
        print(f"{'='*80}\n")
        
        # Filter models that support generateContent
        generate_content_models = []
        
        for model in models:
            name = model.get('name', '')
            display_name = model.get('displayName', '')
            supported_methods = model.get('supportedGenerationMethods', [])
            
            if 'generateContent' in supported_methods:
                generate_content_models.append({
                    'name': name,
                    'display_name': display_name,
                    'methods': supported_methods
                })
        
        print(f"\nModels that support 'generateContent' (for image analysis):\n")
        print(f"{'-'*80}")
        
        for model in generate_content_models:
            model_name = model['name'].replace('models/', '')
            print(f"\nModel: {model_name}")
            print(f"Display Name: {model['display_name']}")
            print(f"Supported Methods: {', '.join(model['methods'])}")
            print(f"{'-'*80}")
        
        print(f"\n✅ Use one of these model names in your code!")
        print(f"\nRecommended: gemini-1.5-flash or gemini-1.5-pro\n")
        
    else:
        print(f"Error: API returned status {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"Error checking models: {str(e)}")
