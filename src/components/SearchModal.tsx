import { useState, useCallback, useEffect } from 'react';
import { useXtream } from '../context/XtreamContext';
import type { XtreamLiveStream, XtreamVodStream, XtreamSeries } from '../services/xtreamApi';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel: (stream: XtreamLiveStream) => void;
  onSelectMovie: (movie: XtreamVodStream) => void;
  onSelectSeries: (series: XtreamSeries) => void;
}

export function SearchModal({ isOpen, onClose, onSelectChannel, onSelectMovie, onSelectSeries }: SearchModalProps) {
  const { searchContent } = useXtream();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    channels: XtreamLiveStream[];
    movies: XtreamVodStream[];
    series: XtreamSeries[];
  }>({ channels: [], movies: [], series: [] });

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const searchResults = searchContent(value);
      setResults(searchResults);
    } else {
      setResults({ channels: [], movies: [], series: [] });
    }
  }, [searchContent]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ channels: [], movies: [], series: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults = results.channels.length > 0 || results.movies.length > 0 || results.series.length > 0;
  const totalResults = results.channels.length + results.movies.length + results.series.length;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search channels, movies, series..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={() => handleSearch('')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
          <button className="search-close-btn" onClick={onClose}>Cancel</button>
        </div>

        <div className="search-results">
          {query.trim().length < 2 ? (
            <div className="search-placeholder">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <p>Type at least 2 characters to search</p>
            </div>
          ) : !hasResults ? (
            <div className="search-no-results">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              </svg>
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <>
              <div className="search-results-count">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </div>

              {results.channels.length > 0 && (
                <div className="search-section">
                  <h3 className="search-section-title">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
                    </svg>
                    Channels ({results.channels.length})
                  </h3>
                  <div className="search-items-list">
                    {results.channels.map(channel => (
                      <div
                        key={channel.stream_id}
                        className="search-item"
                        onClick={() => { onSelectChannel(channel); onClose(); }}
                      >
                        <div className="search-item-thumb">
                          {channel.stream_icon ? (
                            <img src={channel.stream_icon} alt={channel.name} />
                          ) : (
                            <div className="search-item-placeholder">{channel.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="search-item-info">
                          <span className="search-item-name">{channel.name}</span>
                          <span className="search-item-type">Live TV</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.movies.length > 0 && (
                <div className="search-section">
                  <h3 className="search-section-title">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                    Movies ({results.movies.length})
                  </h3>
                  <div className="search-items-list">
                    {results.movies.map(movie => (
                      <div
                        key={movie.stream_id}
                        className="search-item"
                        onClick={() => { onSelectMovie(movie); onClose(); }}
                      >
                        <div className="search-item-thumb poster">
                          {movie.stream_icon ? (
                            <img src={movie.stream_icon} alt={movie.name} />
                          ) : (
                            <div className="search-item-placeholder">{movie.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="search-item-info">
                          <span className="search-item-name">{movie.name}</span>
                          <span className="search-item-type">Movie{movie.rating ? ` • ${movie.rating}` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.series.length > 0 && (
                <div className="search-section">
                  <h3 className="search-section-title">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    Series ({results.series.length})
                  </h3>
                  <div className="search-items-list">
                    {results.series.map(series => (
                      <div
                        key={series.series_id}
                        className="search-item"
                        onClick={() => { onSelectSeries(series); onClose(); }}
                      >
                        <div className="search-item-thumb poster">
                          {series.cover ? (
                            <img src={series.cover} alt={series.name} />
                          ) : (
                            <div className="search-item-placeholder">{series.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="search-item-info">
                          <span className="search-item-name">{series.name}</span>
                          <span className="search-item-type">Series{series.rating ? ` • ${series.rating}` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
