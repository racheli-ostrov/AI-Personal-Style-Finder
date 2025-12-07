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
    
    app.register_blueprint(style_analysis_bp, url_prefix='/api/style')
    app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
    
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
