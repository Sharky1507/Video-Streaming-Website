from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from models.overlay import OverlayModel

overlays_bp = Blueprint('overlays', __name__)

# MongoDB collection will be injected
db = None

def init_db(mongo_db):
    """Initialize the database connection"""
    global db
    db = mongo_db

@overlays_bp.route('/overlays', methods=['GET'])
def get_all_overlays():
    """Get all overlays"""
    try:
        overlays = list(db.overlays.find())
        serialized = [OverlayModel.serialize(o) for o in overlays]
        return jsonify({
            'success': True,
            'data': serialized,
            'count': len(serialized)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@overlays_bp.route('/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        overlay = OverlayModel.create_overlay(data)
        result = db.overlays.insert_one(overlay)
        overlay['_id'] = result.inserted_id
        
        return jsonify({
            'success': True,
            'data': OverlayModel.serialize(overlay),
            'message': 'Overlay created successfully'
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@overlays_bp.route('/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get a specific overlay by ID"""
    try:
        oid = ObjectId(overlay_id)
        overlay = db.overlays.find_one({'_id': oid})
        
        if not overlay:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': OverlayModel.serialize(overlay)
        }), 200
        
    except InvalidId:
        return jsonify({
            'success': False,
            'error': 'Invalid overlay ID'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@overlays_bp.route('/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an existing overlay"""
    try:
        oid = ObjectId(overlay_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        existing = db.overlays.find_one({'_id': oid})
        
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        updated = OverlayModel.update_overlay(existing, data)
        db.overlays.replace_one({'_id': oid}, updated)
        
        return jsonify({
            'success': True,
            'data': OverlayModel.serialize(updated),
            'message': 'Overlay updated successfully'
        }), 200
        
    except InvalidId:
        return jsonify({
            'success': False,
            'error': 'Invalid overlay ID'
        }), 400
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@overlays_bp.route('/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay"""
    try:
        oid = ObjectId(overlay_id)
        result = db.overlays.delete_one({'_id': oid})
        
        if result.deleted_count == 0:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Overlay deleted successfully'
        }), 200
        
    except InvalidId:
        return jsonify({
            'success': False,
            'error': 'Invalid overlay ID'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
