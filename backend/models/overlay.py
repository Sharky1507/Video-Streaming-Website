from datetime import datetime
from bson import ObjectId

class OverlayModel:
    """Overlay document model for MongoDB"""
    
    OVERLAY_TYPES = ['text', 'image']
    
    @staticmethod
    def create_overlay(data: dict) -> dict:
        """Create a new overlay document structure"""
        overlay_type = data.get('type', 'text')
        
        if overlay_type not in OverlayModel.OVERLAY_TYPES:
            raise ValueError(f"Invalid overlay type. Must be one of: {OverlayModel.OVERLAY_TYPES}")
        
        overlay = {
            'type': overlay_type,
            'content': data.get('content', ''),
            'position': {
                'x': data.get('position', {}).get('x', 50),
                'y': data.get('position', {}).get('y', 50)
            },
            'size': {
                'width': data.get('size', {}).get('width', 200),
                'height': data.get('size', {}).get('height', 100)
            },
            'style': {
                'fontSize': data.get('style', {}).get('fontSize', 24),
                'fontColor': data.get('style', {}).get('fontColor', '#ffffff'),
                'backgroundColor': data.get('style', {}).get('backgroundColor', 'transparent'),
                'fontFamily': data.get('style', {}).get('fontFamily', 'Arial'),
                'fontWeight': data.get('style', {}).get('fontWeight', 'normal'),
                'opacity': data.get('style', {}).get('opacity', 1)
            },
            'visible': data.get('visible', True),
            'zIndex': data.get('zIndex', 1),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        return overlay
    
    @staticmethod
    def update_overlay(existing: dict, data: dict) -> dict:
        """Update an existing overlay document"""
        if 'type' in data and data['type'] not in OverlayModel.OVERLAY_TYPES:
            raise ValueError(f"Invalid overlay type. Must be one of: {OverlayModel.OVERLAY_TYPES}")
        
        # Update fields if provided
        if 'type' in data:
            existing['type'] = data['type']
        if 'content' in data:
            existing['content'] = data['content']
        if 'position' in data:
            if 'x' in data['position']:
                existing['position']['x'] = data['position']['x']
            if 'y' in data['position']:
                existing['position']['y'] = data['position']['y']
        if 'size' in data:
            if 'width' in data['size']:
                existing['size']['width'] = data['size']['width']
            if 'height' in data['size']:
                existing['size']['height'] = data['size']['height']
        if 'style' in data:
            for key in ['fontSize', 'fontColor', 'backgroundColor', 'fontFamily', 'fontWeight', 'opacity']:
                if key in data['style']:
                    existing['style'][key] = data['style'][key]
        if 'visible' in data:
            existing['visible'] = data['visible']
        if 'zIndex' in data:
            existing['zIndex'] = data['zIndex']
        
        existing['updatedAt'] = datetime.utcnow()
        
        return existing
    
    @staticmethod
    def serialize(overlay: dict) -> dict:
        """Convert MongoDB document to JSON-serializable dict"""
        if overlay is None:
            return None
        
        result = {
            'id': str(overlay['_id']),
            'type': overlay['type'],
            'content': overlay['content'],
            'position': overlay['position'],
            'size': overlay['size'],
            'style': overlay['style'],
            'visible': overlay['visible'],
            'zIndex': overlay['zIndex'],
            'createdAt': overlay['createdAt'].isoformat() if overlay.get('createdAt') else None,
            'updatedAt': overlay['updatedAt'].isoformat() if overlay.get('updatedAt') else None
        }
        
        return result
