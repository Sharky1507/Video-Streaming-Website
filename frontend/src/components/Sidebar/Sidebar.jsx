import { useState, useEffect } from 'react';
import './Sidebar.css';

const FONT_FAMILIES = [
    'Arial',
    'Inter',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Impact'
];

const FONT_WEIGHTS = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '300', label: 'Light' },
    { value: '500', label: 'Medium' },
    { value: '700', label: 'Bold' },
    { value: '900', label: 'Black' }
];

export default function Sidebar({
    overlays,
    selectedOverlay,
    onSelectOverlay,
    onAddOverlay,
    onUpdateOverlay,
    onDeleteOverlay,
    isConnected
}) {
    const [newOverlayType, setNewOverlayType] = useState('text');
    const [newContent, setNewContent] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editStyle, setEditStyle] = useState({});

    useEffect(() => {
        if (selectedOverlay) {
            setEditContent(selectedOverlay.content || '');
            setEditStyle(selectedOverlay.style || {});
        }
    }, [selectedOverlay]);

    const handleAddOverlay = () => {
        if (!newContent.trim()) {
            alert('Please enter content for the overlay');
            return;
        }

        const overlay = {
            type: newOverlayType,
            content: newContent.trim(),
            position: { x: 50, y: 50 },
            size: {
                width: newOverlayType === 'text' ? 200 : 150,
                height: newOverlayType === 'text' ? 80 : 150
            },
            style: {
                fontSize: 24,
                fontColor: '#ffffff',
                backgroundColor: 'transparent',
                fontFamily: 'Arial',
                fontWeight: 'normal',
                opacity: 1
            },
            visible: true,
            zIndex: overlays.length + 1
        };

        onAddOverlay(overlay);
        setNewContent('');
    };

    const handleUpdateContent = () => {
        if (selectedOverlay) {
            onUpdateOverlay(selectedOverlay.id, { content: editContent });
        }
    };

    const handleStyleChange = (property, value) => {
        const newStyle = { ...editStyle, [property]: value };
        setEditStyle(newStyle);
        if (selectedOverlay) {
            onUpdateOverlay(selectedOverlay.id, { style: newStyle });
        }
    };

    const handleVisibilityToggle = (overlay) => {
        onUpdateOverlay(overlay.id, { visible: !overlay.visible });
    };

    return (
        <aside className="sidebar glass-card">
            {/* Connection Status */}
            <div className="connection-status">
                <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
                <span>{isConnected ? 'Connected to API' : 'Disconnected'}</span>
            </div>

            {/* Add New Overlay Section */}
            <section className="sidebar-section">
                <h3 className="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add Overlay
                </h3>

                <div className="overlay-type-selector">
                    <button
                        className={`type-btn ${newOverlayType === 'text' ? 'active' : ''}`}
                        onClick={() => setNewOverlayType('text')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="4 7 4 4 20 4 20 7" />
                            <line x1="9" y1="20" x2="15" y2="20" />
                            <line x1="12" y1="4" x2="12" y2="20" />
                        </svg>
                        Text
                    </button>
                    <button
                        className={`type-btn ${newOverlayType === 'image' ? 'active' : ''}`}
                        onClick={() => setNewOverlayType('image')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Image
                    </button>
                </div>

                <div className="input-group">
                    <label className="input-label">
                        {newOverlayType === 'text' ? 'Text Content' : 'Image URL'}
                    </label>
                    {newOverlayType === 'text' ? (
                        <textarea
                            className="input textarea"
                            placeholder="Enter your text..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows={3}
                        />
                    ) : (
                        <input
                            type="text"
                            className="input"
                            placeholder="https://example.com/image.png"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                    )}
                </div>

                <button
                    className="btn btn-primary add-btn"
                    onClick={handleAddOverlay}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add {newOverlayType === 'text' ? 'Text' : 'Image'} Overlay
                </button>
            </section>

            {/* Edit Selected Overlay */}
            {selectedOverlay && (
                <section className="sidebar-section slide-up">
                    <h3 className="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Overlay
                    </h3>

                    <div className="input-group">
                        <label className="input-label">Content</label>
                        {selectedOverlay.type === 'text' ? (
                            <textarea
                                className="input textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onBlur={handleUpdateContent}
                                rows={3}
                            />
                        ) : (
                            <input
                                type="text"
                                className="input"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onBlur={handleUpdateContent}
                            />
                        )}
                    </div>

                    {selectedOverlay.type === 'text' && (
                        <>
                            <div className="input-row">
                                <div className="input-group">
                                    <label className="input-label">Font Size</label>
                                    <div className="input-with-unit">
                                        <input
                                            type="number"
                                            className="input"
                                            min="10"
                                            max="120"
                                            value={editStyle.fontSize || 24}
                                            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                                        />
                                        <span className="unit">px</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Color</label>
                                    <input
                                        type="color"
                                        className="color-picker"
                                        value={editStyle.fontColor || '#ffffff'}
                                        onChange={(e) => handleStyleChange('fontColor', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Font Family</label>
                                <select
                                    className="select"
                                    value={editStyle.fontFamily || 'Arial'}
                                    onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                                >
                                    {FONT_FAMILIES.map(font => (
                                        <option key={font} value={font} style={{ fontFamily: font }}>
                                            {font}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Font Weight</label>
                                <select
                                    className="select"
                                    value={editStyle.fontWeight || 'normal'}
                                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                >
                                    {FONT_WEIGHTS.map(weight => (
                                        <option key={weight.value} value={weight.value}>
                                            {weight.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Background Color</label>
                                <div className="input-row">
                                    <input
                                        type="color"
                                        className="color-picker"
                                        value={editStyle.backgroundColor === 'transparent' ? '#000000' : editStyle.backgroundColor}
                                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    />
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => handleStyleChange('backgroundColor', 'transparent')}
                                    >
                                        Transparent
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <label className="input-label">Opacity: {Math.round((editStyle.opacity || 1) * 100)}%</label>
                        <input
                            type="range"
                            className="range-slider"
                            min="0"
                            max="1"
                            step="0.1"
                            value={editStyle.opacity || 1}
                            onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                        />
                    </div>

                    <button
                        className="btn btn-danger"
                        onClick={() => onDeleteOverlay(selectedOverlay.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete Overlay
                    </button>
                </section>
            )}

            {/* Overlay List */}
            <section className="sidebar-section">
                <h3 className="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    Overlay List ({overlays.length})
                </h3>

                <div className="overlay-list">
                    {overlays.length === 0 ? (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <p>No overlays yet</p>
                            <span>Add text or image overlays using the form above</span>
                        </div>
                    ) : (
                        overlays.map(overlay => (
                            <div
                                key={overlay.id}
                                className={`overlay-item ${selectedOverlay?.id === overlay.id ? 'selected' : ''}`}
                                onClick={() => onSelectOverlay(overlay.id)}
                            >
                                <div className="overlay-item-icon">
                                    {overlay.type === 'text' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="4 7 4 4 20 4 20 7" />
                                            <line x1="9" y1="20" x2="15" y2="20" />
                                            <line x1="12" y1="4" x2="12" y2="20" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    )}
                                </div>
                                <div className="overlay-item-content">
                                    <span className="overlay-item-type">{overlay.type}</span>
                                    <span className="overlay-item-preview">
                                        {overlay.type === 'text'
                                            ? (overlay.content?.substring(0, 20) + (overlay.content?.length > 20 ? '...' : ''))
                                            : 'Image'
                                        }
                                    </span>
                                </div>
                                <button
                                    className="visibility-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVisibilityToggle(overlay);
                                    }}
                                >
                                    {overlay.visible !== false ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </aside>
    );
}
