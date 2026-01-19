import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { VideoPlayer } from '../components';
import { useXtream } from '../context/XtreamContext';
import type { XtreamVodStream } from '../services/xtreamApi';
import './MoviesPage.css';

const MAX_DISPLAY = 50;

export function MoviesPage() {
  const location = useLocation();
  const { vodStreams, vodCategories, loadVodData, loadVodByCategory, getVodUrl, isConnected } = useXtream();
  const [selectedMovie, setSelectedMovie] = useState<XtreamVodStream | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadVodData();
    }
  }, [isConnected, loadVodData]);

  // Set initial category when categories load
  useEffect(() => {
    if (vodCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(vodCategories[0].category_id);
    }
  }, [vodCategories, selectedCategory]);

  // Handle navigation from search
  useEffect(() => {
    const state = location.state as { selectedMovie?: XtreamVodStream } | null;
    if (state?.selectedMovie) {
      setSelectedMovie(state.selectedMovie);
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCategoryChange = useCallback(async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoadingCategory(true);
    await loadVodByCategory(categoryId);
    setIsLoadingCategory(false);
  }, [loadVodByCategory]);

  const featuredMovie = vodStreams[0];

  const getCategoryName = (catId: string) => {
    const cat = vodCategories.find(c => c.category_id === catId);
    return cat?.category_name || 'Other';
  };

  const handleMovieClick = (movie: XtreamVodStream) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handlePlay = () => {
    if (selectedMovie) {
      setIsPlaying(true);
      setShowModal(false);
    } else if (featuredMovie) {
      setSelectedMovie(featuredMovie);
      setIsPlaying(true);
    }
  };

  // Limit displayed streams
  const displayedMovies = vodStreams.slice(0, MAX_DISPLAY);

  if (!isConnected) {
    return (
      <div className="movies-page">
        <div className="not-connected">
          <h2>Not Connected</h2>
          <p>Please connect to your IPTV service first.</p>
        </div>
      </div>
    );
  }

  if (vodCategories.length === 0) {
    return (
      <div className="movies-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Hero Banner */}
      {featuredMovie && (
        <div className="hero-banner">
          <div className="hero-backdrop">
            {featuredMovie.stream_icon && (
              <img src={featuredMovie.stream_icon} alt={featuredMovie.name} />
            )}
            <div className="hero-gradient"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.name}</h1>
            <div className="hero-meta">
              {featuredMovie.rating && (
                <span className="hero-rating">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffd700">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  {featuredMovie.rating}
                </span>
              )}
            </div>
            <div className="hero-actions">
              <button className="btn-play" onClick={() => { setSelectedMovie(featuredMovie); handlePlay(); }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play
              </button>
              <button className="btn-info" onClick={() => handleMovieClick(featuredMovie)}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs and Grid */}
      <div className="movies-content">
        <div className="category-tabs">
          {vodCategories.map(cat => (
            <button
              key={cat.category_id}
              className={`category-tab ${selectedCategory === cat.category_id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.category_id)}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className="movies-grid-section">
          <h2 className="section-title">{getCategoryName(selectedCategory)}</h2>

          {isLoadingCategory ? (
            <div className="loading-category">
              <div className="spinner-small"></div>
              <span>Loading...</span>
            </div>
          ) : displayedMovies.length === 0 ? (
            <div className="no-content">
              <p>No movies in this category</p>
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {displayedMovies.map(movie => (
                  <div key={movie.stream_id} className="content-card" onClick={() => handleMovieClick(movie)}>
                    <div className="card-poster">
                      {movie.stream_icon ? (
                        <img src={movie.stream_icon} alt={movie.name} loading="lazy" />
                      ) : (
                        <div className="card-poster-placeholder">{movie.name.charAt(0)}</div>
                      )}
                      <div className="card-overlay">
                        <button className="play-btn">
                          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>
                      {movie.rating && (
                        <div className="card-rating">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="#ffd700">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          <span>{movie.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <h3 className="card-title">{movie.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
              {vodStreams.length > MAX_DISPLAY && (
                <div className="load-more-info">
                  Showing {MAX_DISPLAY} of {vodStreams.length} movies
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMovie && (
        <div className="content-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="content-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            <div className="modal-backdrop">
              {selectedMovie.stream_icon ? (
                <img src={selectedMovie.stream_icon} alt={selectedMovie.name} />
              ) : (
                <div className="modal-backdrop-placeholder"></div>
              )}
              <div className="modal-backdrop-gradient"></div>
            </div>

            <div className="modal-content">
              <h2 className="modal-title">{selectedMovie.name}</h2>

              <div className="modal-meta">
                {selectedMovie.rating && (
                  <span className="modal-rating">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffd700">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {selectedMovie.rating}
                  </span>
                )}
                <span className="modal-year">{selectedMovie.container_extension?.toUpperCase()}</span>
              </div>

              <div className="modal-actions">
                <button className="modal-play-btn" onClick={handlePlay}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      {isPlaying && selectedMovie && (
        <VideoPlayer
          streamUrl={getVodUrl(selectedMovie.stream_id, selectedMovie.container_extension || 'mp4')}
          title={selectedMovie.name}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
