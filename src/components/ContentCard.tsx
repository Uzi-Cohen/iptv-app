import type { Movie, Series } from '../types';
import './ContentCard.css';

interface ContentCardProps {
  item: Movie | Series;
  onClick: () => void;
}

export function ContentCard({ item, onClick }: ContentCardProps) {
  const isSeries = 'seasons' in item;

  return (
    <div className="content-card" onClick={onClick}>
      <div className="card-poster">
        <img src={item.poster} alt={item.title} loading="lazy" />
        <div className="card-overlay">
          <button className="play-btn">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div className="card-rating">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="#ffd700">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span>{item.rating}</span>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta">
          <span className="card-year">{item.year}</span>
          {isSeries ? (
            <span className="card-seasons">{(item as Series).seasons} Seasons</span>
          ) : (
            <span className="card-duration">{(item as Movie).duration}</span>
          )}
        </div>
        <div className="card-genres">
          {item.genre.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
