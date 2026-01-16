import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

// Sample HLS streams for testing (since RTSP requires conversion)
const SAMPLE_STREAMS = [
    {
        name: 'Big Buck Bunny',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    },
    {
        name: 'Sintel (4K)',
        url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
    },
    {
        name: 'Tears of Steel',
        url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    }
];

export default function VideoPlayer({ streamUrl, onStreamChange }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(streamUrl || SAMPLE_STREAMS[0].url);
    const [inputUrl, setInputUrl] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !currentUrl) return;

        setIsLoading(true);
        setError(null);

        // Clean up previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        // Check if the stream is HLS
        if (Hls.isSupported() && currentUrl.includes('.m3u8')) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });

            hls.loadSource(currentUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                if (isPlaying) {
                    videoRef.current.play().catch(console.error);
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setError(`Stream error: ${data.type}`);
                    setIsLoading(false);
                }
            });

            hlsRef.current = hls;
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            videoRef.current.src = currentUrl;
            setIsLoading(false);
        } else {
            // Try direct playback for other formats
            videoRef.current.src = currentUrl;
            setIsLoading(false);
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [currentUrl]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handlePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch((e) => {
                    setError('Failed to play video. Please try again.');
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (inputUrl.trim()) {
            setCurrentUrl(inputUrl.trim());
            onStreamChange?.(inputUrl.trim());
            setInputUrl('');
        }
    };

    const selectSampleStream = (url) => {
        setCurrentUrl(url);
        onStreamChange?.(url);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    return (
        <div
            className="video-player-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element */}
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    className="video-element"
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setError('Video playback error')}
                />

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="video-overlay loading-overlay">
                        <div className="loading-spinner"></div>
                        <span>Loading stream...</span>
                    </div>
                )}

                {/* Error Overlay */}
                {error && (
                    <div className="video-overlay error-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Play Button Center Overlay */}
                {!isPlaying && !isLoading && !error && (
                    <div className="video-overlay play-overlay" onClick={handlePlay}>
                        <div className="play-button-large">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className={`video-controls ${showControls ? 'visible' : ''}`}>
                    <button className="control-btn play-btn" onClick={handlePlay}>
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </button>

                    <div className="volume-control">
                        <button className="control-btn" onClick={toggleMute}>
                            {isMuted || volume === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            className="volume-slider"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                        />
                    </div>

                    <div className="stream-status">
                        <span className={`status-dot ${isPlaying ? 'live' : ''}`}></span>
                        <span>{isPlaying ? 'LIVE' : 'PAUSED'}</span>
                    </div>
                </div>
            </div>

            {/* Stream URL Input */}
            <div className="stream-url-section">
                <form onSubmit={handleUrlSubmit} className="url-form">
                    <input
                        type="text"
                        className="input url-input"
                        placeholder="Enter RTSP/HLS stream URL..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Load Stream
                    </button>
                </form>

                <div className="sample-streams">
                    <span className="sample-label">Sample Streams:</span>
                    <div className="sample-buttons">
                        {SAMPLE_STREAMS.map((stream, index) => (
                            <button
                                key={index}
                                className={`btn btn-ghost sample-btn ${currentUrl === stream.url ? 'active' : ''}`}
                                onClick={() => selectSampleStream(stream.url)}
                            >
                                {stream.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
