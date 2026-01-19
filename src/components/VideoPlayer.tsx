import { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  onClose: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({ streamUrl, title, onClose, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setError(null);

    // Simply set the source and let the browser handle it
    video.src = streamUrl;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      if (autoPlay) {
        video.play().catch((err) => {
          console.error('Autoplay failed:', err);
        });
      }
    };

    const handleError = () => {
      console.error('Video error for URL:', streamUrl);
      setError('Failed to load stream. The stream may be offline or unavailable.');
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.src = '';
    };
  }, [streamUrl, autoPlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const openExternal = () => {
    window.open(streamUrl, '_blank');
  };

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <div className="video-player-header">
          <h2 className="video-title">{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="video-wrapper">
          {isLoading && !error && (
            <div className="video-loading">
              <div className="spinner"></div>
              <p>Loading stream...</p>
            </div>
          )}

          {error && (
            <div className="video-error">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>{error}</p>
              <div className="error-actions">
                <button className="retry-btn" onClick={handleRetry}>
                  Retry
                </button>
                <button className="external-btn" onClick={openExternal}>
                  Open in External Player
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="video-element"
            controls
            playsInline
            autoPlay={autoPlay}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-info">
          <p className="stream-url">{streamUrl}</p>
          <button className="copy-url-btn" onClick={() => navigator.clipboard.writeText(streamUrl)}>
            Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}
