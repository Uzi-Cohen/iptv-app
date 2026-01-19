import { useEffect, useRef } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  onClose: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({ streamUrl, title, onClose, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // For HLS streams, we'd typically use hls.js here
    // For demo purposes, we'll use native video
    if (autoPlay) {
      video.play().catch(() => {
        // Autoplay was prevented
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, autoPlay]);

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
        <video
          ref={videoRef}
          className="video-element"
          controls
          src={streamUrl}
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
