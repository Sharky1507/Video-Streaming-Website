import Overlay from '../Overlay';
import './OverlayContainer.css';

export default function OverlayContainer({
    overlays,
    selectedId,
    onSelect,
    onUpdate,
    onDelete
}) {
    const handleContainerClick = (e) => {
        // Deselect when clicking on empty area
        if (e.target === e.currentTarget) {
            onSelect(null);
        }
    };

    return (
        <div
            className="overlay-container"
            onClick={handleContainerClick}
        >
            {overlays
                .filter(overlay => overlay.visible !== false)
                .map(overlay => (
                    <Overlay
                        key={overlay.id}
                        overlay={overlay}
                        isSelected={selectedId === overlay.id}
                        onSelect={onSelect}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))}
        </div>
    );
}
