import type { Movie, Series } from '../types';
import './HeroBanner.css';

interface HeroBannerProps {
  item: Movie | Series;
  onPlay: () => void;
  onInfo: () => void;
}

export function HeroBanner({ item, onPlay, onInfo }: HeroBannerProps) {
  const isSeries = 'seasons' in item;

  return (
    <div className="hero-banner">
      <div className="hero-backdrop">
        <img src={item.backdrop} alt={item.title} />
        <div className="hero-gradient"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{item.title}</h1>
        <div className="hero-meta">
          <span className="hero-rating">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffd700">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {item.rating}
          </span>
          <span className="hero-year">{item.year}</span>
          {isSeries ? (
            <span className="hero-seasons">{(item as Series).seasons} Seasons</span>
          ) : (
            <span className="hero-duration">{(item as Movie).duration}</span>
          )}
        </div>
        <p className="hero-description">{item.description}</p>
        <div className="hero-genres">
          {item.genre.map(g => (
            <span key={g} className="hero-genre-tag">{g}</span>
          ))}
        </div>
        <div className="hero-actions">
          <button className="btn-play" onClick={onPlay}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          <button className="btn-info" onClick={onInfo}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
