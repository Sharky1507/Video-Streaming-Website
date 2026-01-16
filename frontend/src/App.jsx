import { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayContainer from './components/OverlayContainer';
import Sidebar from './components/Sidebar';
import { overlayService, healthCheck } from './services/api';
import './App.css';

export default function App() {
    const [overlays, setOverlays] = useState([]);
    const [selectedOverlayId, setSelectedOverlayId] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check API connection
    useEffect(() => {
        const checkConnection = async () => {
            const result = await healthCheck();
            setIsConnected(result.success);
        };
        checkConnection();
        const interval = setInterval(checkConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch overlays on mount
    useEffect(() => {
        fetchOverlays();
    }, []);

    const fetchOverlays = async () => {
        setIsLoading(true);
        try {
            const response = await overlayService.getAll();
            if (response.success) {
                setOverlays(response.data);
            }
            setError(null);
        } catch (err) {
            console.error('Failed to fetch overlays:', err);
            setError('Failed to load overlays. Using local state.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOverlay = async (overlayData) => {
        try {
            const response = await overlayService.create(overlayData);
            if (response.success) {
                setOverlays(prev => [...prev, response.data]);
                setSelectedOverlayId(response.data.id);
            }
        } catch (err) {
            console.error('Failed to create overlay:', err);
            // Add to local state even if API fails
            const localOverlay = {
                ...overlayData,
                id: `local-${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            setOverlays(prev => [...prev, localOverlay]);
            setSelectedOverlayId(localOverlay.id);
        }
    };

    const handleUpdateOverlay = useCallback(async (id, updates) => {
        // Optimistic update
        setOverlays(prev =>
            prev.map(o => o.id === id ? { ...o, ...updates, style: { ...o.style, ...updates.style } } : o)
        );

        // Sync with API
        try {
            await overlayService.update(id, updates);
        } catch (err) {
            console.error('Failed to update overlay:', err);
        }
    }, []);

    const handleDeleteOverlay = async (id) => {
        // Optimistic delete
        setOverlays(prev => prev.filter(o => o.id !== id));
        if (selectedOverlayId === id) {
            setSelectedOverlayId(null);
        }

        // Sync with API
        try {
            await overlayService.delete(id);
        } catch (err) {
            console.error('Failed to delete overlay:', err);
        }
    };

    const handleSelectOverlay = (id) => {
        setSelectedOverlayId(id);
    };

    const handleStreamChange = (url) => {
        setStreamUrl(url);
    };

    const selectedOverlay = overlays.find(o => o.id === selectedOverlayId) || null;

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <h1>RTSP <span className="gradient-text">Overlay</span></h1>
                            <span className="tagline">Livestream Overlay Editor</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn btn-ghost"
                            onClick={fetchOverlays}
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isLoading ? 'spin' : ''}>
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
                {/* Video Section */}
                <section className="video-section">
                    <div className="video-container">
                        <VideoPlayer
                            streamUrl={streamUrl}
                            onStreamChange={handleStreamChange}
                        />

                        {/* Overlays Layer */}
                        <OverlayContainer
                            overlays={overlays}
                            selectedId={selectedOverlayId}
                            onSelect={handleSelectOverlay}
                            onUpdate={handleUpdateOverlay}
                            onDelete={handleDeleteOverlay}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-banner fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}
                </section>

                {/* Sidebar */}
                <Sidebar
                    overlays={overlays}
                    selectedOverlay={selectedOverlay}
                    onSelectOverlay={handleSelectOverlay}
                    onAddOverlay={handleAddOverlay}
                    onUpdateOverlay={handleUpdateOverlay}
                    onDeleteOverlay={handleDeleteOverlay}
                    isConnected={isConnected}
                />
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <p>RTSP Livestream Overlay Application • Built with React + Flask + MongoDB</p>
            </footer>
        </div>
    );
}
