import { useState, useRef } from 'react';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import './Overlay.css';

export default function Overlay({
    overlay,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    containerBounds
}) {
    const nodeRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e, data) => {
        onUpdate(overlay.id, {
            position: {
                x: data.x,
                y: data.y
            }
        });
    };

    const handleResize = (e, { size }) => {
        onUpdate(overlay.id, {
            size: {
                width: size.width,
                height: size.height
            }
        });
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(overlay.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(overlay.id);
    };

    const overlayStyle = {
        fontSize: `${overlay.style?.fontSize || 24}px`,
        color: overlay.style?.fontColor || '#ffffff',
        backgroundColor: overlay.style?.backgroundColor || 'transparent',
        fontFamily: overlay.style?.fontFamily || 'Arial',
        fontWeight: overlay.style?.fontWeight || 'normal',
        opacity: overlay.style?.opacity || 1
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            position={{ x: overlay.position?.x || 0, y: overlay.position?.y || 0 }}
            onStart={() => setIsDragging(true)}
            onStop={(e, data) => {
                setIsDragging(false);
                handleDrag(e, data);
            }}
            bounds="parent"
            handle=".overlay-handle"
        >
            <div ref={nodeRef} style={{ position: 'absolute', zIndex: overlay.zIndex || 1 }}>
                <Resizable
                    width={overlay.size?.width || 200}
                    height={overlay.size?.height || 100}
                    onResize={handleResize}
                    minConstraints={[50, 30]}
                    maxConstraints={[800, 600]}
                    resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw'] : []}
                >
                    <div
                        className={`overlay ${overlay.type} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
                        style={{
                            width: overlay.size?.width || 200,
                            height: overlay.size?.height || 100
                        }}
                        onClick={handleClick}
                    >
                        {/* Drag Handle */}
                        <div className="overlay-handle">
                            {isSelected && (
                                <div className="overlay-toolbar">
                                    <span className="overlay-type-badge">{overlay.type}</span>
                                    <button className="overlay-delete-btn" onClick={handleDelete}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Overlay Content */}
                        <div className="overlay-content" style={overlayStyle}>
                            {overlay.type === 'text' ? (
                                <div className="text-content">
                                    {overlay.content || 'Text Overlay'}
                                </div>
                            ) : (
                                <img
                                    src={overlay.content}
                                    alt="Overlay"
                                    className="image-content"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>

                        {/* Resize Indicator */}
                        {isSelected && (
                            <div className="resize-indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </Resizable>
            </div>
        </Draggable>
    );
}
