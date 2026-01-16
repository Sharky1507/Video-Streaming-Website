from datetime import datetime

class SettingsModel:
    """Settings document model for MongoDB"""
    
    DEFAULT_SETTINGS = {
        'streamUrl': '',
        'volume': 0.8,
        'autoPlay': False,
        'overlaysEnabled': True
    }
    
    @staticmethod
    def create_settings(data: dict = None) -> dict:
        """Create default settings document"""
        settings = SettingsModel.DEFAULT_SETTINGS.copy()
        
        if data:
            if 'streamUrl' in data:
                settings['streamUrl'] = data['streamUrl']
            if 'volume' in data:
                settings['volume'] = max(0, min(1, float(data['volume'])))
            if 'autoPlay' in data:
                settings['autoPlay'] = bool(data['autoPlay'])
            if 'overlaysEnabled' in data:
                settings['overlaysEnabled'] = bool(data['overlaysEnabled'])
        
        settings['updatedAt'] = datetime.utcnow()
        
        return settings
    
    @staticmethod
    def update_settings(existing: dict, data: dict) -> dict:
        """Update existing settings"""
        if 'streamUrl' in data:
            existing['streamUrl'] = data['streamUrl']
        if 'volume' in data:
            existing['volume'] = max(0, min(1, float(data['volume'])))
        if 'autoPlay' in data:
            existing['autoPlay'] = bool(data['autoPlay'])
        if 'overlaysEnabled' in data:
            existing['overlaysEnabled'] = bool(data['overlaysEnabled'])
        
        existing['updatedAt'] = datetime.utcnow()
        
        return existing
    
    @staticmethod
    def serialize(settings: dict) -> dict:
        """Convert MongoDB document to JSON-serializable dict"""
        if settings is None:
            return SettingsModel.DEFAULT_SETTINGS.copy()
        
        return {
            'id': str(settings['_id']) if '_id' in settings else None,
            'streamUrl': settings.get('streamUrl', ''),
            'volume': settings.get('volume', 0.8),
            'autoPlay': settings.get('autoPlay', False),
            'overlaysEnabled': settings.get('overlaysEnabled', True),
            'updatedAt': settings['updatedAt'].isoformat() if settings.get('updatedAt') else None
        }
