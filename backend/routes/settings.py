from flask import Blueprint, request, jsonify
from models.settings import SettingsModel

settings_bp = Blueprint('settings', __name__)

# MongoDB collection will be injected
db = None

def init_db(mongo_db):
    """Initialize the database connection"""
    global db
    db = mongo_db

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    """Get stream settings"""
    try:
        settings = db.settings.find_one()
        
        if not settings:
            # Create default settings if none exist
            settings = SettingsModel.create_settings()
            db.settings.insert_one(settings)
        
        return jsonify({
            'success': True,
            'data': SettingsModel.serialize(settings)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@settings_bp.route('/settings', methods=['PUT'])
def update_settings():
    """Update stream settings"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        existing = db.settings.find_one()
        
        if not existing:
            # Create new settings
            settings = SettingsModel.create_settings(data)
            db.settings.insert_one(settings)
        else:
            # Update existing settings
            settings = SettingsModel.update_settings(existing, data)
            db.settings.replace_one({'_id': existing['_id']}, settings)
        
        return jsonify({
            'success': True,
            'data': SettingsModel.serialize(settings),
            'message': 'Settings updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
