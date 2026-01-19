import { useEffect } from 'react';
import type { Movie, Series } from '../types';
import './ContentModal.css';

interface ContentModalProps {
  item: Movie | Series;
  onClose: () => void;
  onPlay: () => void;
}

export function ContentModal({ item, onClose, onPlay }: ContentModalProps) {
  const isSeries = 'seasons' in item;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="content-modal-overlay" onClick={onClose}>
      <div className="content-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="modal-backdrop">
          <img src={item.backdrop} alt={item.title} />
          <div className="modal-backdrop-gradient"></div>
        </div>

        <div className="modal-content">
          <h2 className="modal-title">{item.title}</h2>

          <div className="modal-meta">
            <span className="modal-rating">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffd700">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              {item.rating}
            </span>
            <span className="modal-year">{item.year}</span>
            {isSeries ? (
              <span className="modal-seasons">{(item as Series).seasons} Seasons</span>
            ) : (
              <span className="modal-duration">{(item as Movie).duration}</span>
            )}
          </div>

          <div className="modal-actions">
            <button className="modal-play-btn" onClick={onPlay}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
            <button className="modal-add-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <button className="modal-like-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
            </button>
          </div>

          <p className="modal-description">{item.description}</p>

          <div className="modal-genres">
            <span className="genre-label">Genres:</span>
            {item.genre.map((g, i) => (
              <span key={g}>
                {g}{i < item.genre.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>

          {isSeries && (item as Series).episodes.length > 0 && (
            <div className="modal-episodes">
              <h3 className="episodes-title">Episodes</h3>
              <div className="episodes-list">
                {(item as Series).episodes.map(episode => (
                  <div key={episode.id} className="episode-item" onClick={onPlay}>
                    <div className="episode-thumbnail">
                      <img src={episode.thumbnail} alt={episode.title} />
                      <div className="episode-play-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="episode-info">
                      <div className="episode-header">
                        <span className="episode-number">S{episode.seasonNumber} E{episode.episodeNumber}</span>
                        <span className="episode-duration">{episode.duration}</span>
                      </div>
                      <h4 className="episode-name">{episode.title}</h4>
                      <p className="episode-description">{episode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
