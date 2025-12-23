"""
AI Style Finder - Flask Backend
Main application entry point
"""
import os
import sys
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Check if .env is loaded
def debug_print(*args, **kwargs):
    print(*args, **kwargs)
    sys.stdout.flush()

api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    debug_print(f"✅ .env loaded successfully. API Key starts with: {api_key[:8]}...")
else:
    debug_print("❌ WARNING: GEMINI_API_KEY not found in environment!")

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config['DEBUG'] = True
    # Configure CORS: allow API access from the frontend during local development
    # Use a resource pattern for only API routes and allow all origins to avoid
    # mismatched host/port issues when the frontend is served on port 80.
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    # Configure app
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
    # Register blueprints (use package-qualified imports so module
    # resolution works when running under Gunicorn/Werkzeug)
    from app.api.style_analysis import style_analysis_bp
    from app.api.wardrobe import wardrobe_bp
    from app.api.shopping import shopping_bp
    app.register_blueprint(style_analysis_bp, url_prefix='/api/style')
    app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
    app.register_blueprint(shopping_bp, url_prefix='/api/shopping')
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        debug_print("Health check called")
        return {'status': 'ok', 'message': 'Server is running'}
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('NODE_ENV', 'development') == 'development'
    debug_print(f'🚀 Server is running on port {port}')
    debug_print(f'📊 Environment: {os.getenv("NODE_ENV", "development")}')
    app.run(host='0.0.0.0', port=port, debug=debug)
