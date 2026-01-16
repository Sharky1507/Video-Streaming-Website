from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
from routes.overlays import overlays_bp, init_db as init_overlays_db
from routes.settings import settings_bp, init_db as init_settings_db

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize MongoDB connection
    try:
        client = MongoClient(Config.MONGODB_URI)
        # Try to get database from URI, fallback to 'livestream_overlay'
        try:
            db = client.get_database()
        except Exception:
            db = client['livestream_overlay']
        print(f"✅ Connected to MongoDB: {db.name}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise e
    
    # Initialize route databases
    init_overlays_db(db)
    init_settings_db(db)
    
    # Register blueprints
    app.register_blueprint(overlays_bp, url_prefix='/api')
    app.register_blueprint(settings_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'RTSP Overlay API is running',
            'database': 'connected'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'name': 'RTSP Livestream Overlay API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'overlays': '/api/overlays',
                'settings': '/api/settings'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting RTSP Overlay API Server...")
    print("📍 Server running at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=Config.DEBUG)
