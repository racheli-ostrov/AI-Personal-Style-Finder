"""
AI Style Finder - Flask Backend
Main application entry point
"""
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Check if .env is loaded
api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    print(f"✅ .env loaded successfully. API Key starts with: {api_key[:8]}...")
else:
    print("❌ WARNING: GEMINI_API_KEY not found in environment!")

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')])
    
    # Configure app
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
    
    # Register blueprints
    from routes.style_analysis import style_analysis_bp
    from routes.wardrobe import wardrobe_bp
    from routes.shopping import shopping_bp
    
    app.register_blueprint(style_analysis_bp, url_prefix='/api/style')
    app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
    app.register_blueprint(shopping_bp, url_prefix='/api/shopping')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Server is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('NODE_ENV', 'development') == 'development'
    
    print(f'🚀 Server is running on port {port}')
    print(f'📊 Environment: {os.getenv("NODE_ENV", "development")}')
    
    app.run(host='0.0.0.0', port=port, debug=debug)
