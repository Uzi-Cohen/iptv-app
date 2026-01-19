import { useState, useEffect, useMemo } from 'react';
import { VideoPlayer } from '../components';
import { useXtream } from '../context/XtreamContext';
import { xtreamApi, type XtreamSeries, type XtreamSeriesInfo } from '../services/xtreamApi';
import './SeriesPage.css';

export function SeriesPage() {
  const { seriesList, seriesCategories, loadSeriesData, getSeriesUrl, isConnected } = useXtream();
  const [selectedSeries, setSelectedSeries] = useState<XtreamSeries | null>(null);
  const [seriesInfo, setSeriesInfo] = useState<XtreamSeriesInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<{ id: string; ext: string; title: string } | null>(null);

  useEffect(() => {
    if (isConnected) {
      loadSeriesData();
    }
  }, [isConnected, loadSeriesData]);

  const featuredSeries = seriesList[0];

  const seriesByCategory = useMemo(() => {
    const categoryMap: Record<string, XtreamSeries[]> = {};
    seriesList.forEach(s => {
      const catId = s.category_id || 'uncategorized';
      if (!categoryMap[catId]) {
        categoryMap[catId] = [];
      }
      categoryMap[catId].push(s);
    });
    return categoryMap;
  }, [seriesList]);

  const getCategoryName = (catId: string) => {
    const cat = seriesCategories.find(c => c.category_id === catId);
    return cat?.category_name || 'Other';
  };

  const handleSeriesClick = async (series: XtreamSeries) => {
    setSelectedSeries(series);
    setShowModal(true);
    setSeriesInfo(null);

    try {
      const info = await xtreamApi.getSeriesInfo(series.series_id);
      setSeriesInfo(info);
    } catch (err) {
      console.error('Failed to load series info:', err);
    }
  };

  const handlePlayEpisode = (episodeId: string, extension: string, title: string) => {
    setPlayingEpisode({ id: episodeId, ext: extension, title });
    setIsPlaying(true);
    setShowModal(false);
  };

  const handlePlayFirstEpisode = async () => {
    if (seriesInfo?.episodes) {
      const seasons = Object.keys(seriesInfo.episodes).sort();
      if (seasons.length > 0) {
        const firstSeason = seasons[0];
        const episodes = seriesInfo.episodes[firstSeason];
        if (episodes && episodes.length > 0) {
          const ep = episodes[0];
          handlePlayEpisode(ep.id, ep.container_extension, `${selectedSeries?.name} - S${ep.season}E${ep.episode_num}`);
        }
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="series-page">
        <div className="not-connected">
          <h2>Not Connected</h2>
          <p>Please connect to your IPTV service first.</p>
        </div>
      </div>
    );
  }

  if (seriesList.length === 0) {
    return (
      <div className="series-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="series-page">
      {/* Hero Banner */}
      {featuredSeries && (
        <div className="hero-banner">
          <div className="hero-backdrop">
            {featuredSeries.cover && (
              <img src={featuredSeries.cover} alt={featuredSeries.name} />
            )}
            <div className="hero-gradient"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{featuredSeries.name}</h1>
            <div className="hero-meta">
              {featuredSeries.rating && (
                <span className="hero-rating">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffd700">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  {featuredSeries.rating}
                </span>
              )}
              {featuredSeries.genre && (
                <span className="hero-genre">{featuredSeries.genre}</span>
              )}
            </div>
            {featuredSeries.plot && (
              <p className="hero-description">{featuredSeries.plot}</p>
            )}
            <div className="hero-actions">
              <button className="btn-info" onClick={() => handleSeriesClick(featuredSeries)}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                View Episodes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="series-content">
        {Object.entries(seriesByCategory).slice(0, 10).map(([catId, seriesItems]) => (
          <div key={catId} className="content-row">
            <h2 className="row-title">{getCategoryName(catId)}</h2>
            <div className="row-container">
              <div className="row-content">
                {seriesItems.slice(0, 20).map(s => (
                  <div key={s.series_id} className="content-card" onClick={() => handleSeriesClick(s)}>
                    <div className="card-poster">
                      {s.cover ? (
                        <img src={s.cover} alt={s.name} loading="lazy" />
                      ) : (
                        <div className="card-poster-placeholder">{s.name.charAt(0)}</div>
                      )}
                      <div className="card-overlay">
                        <button className="play-btn">
                          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>
                      {s.rating && (
                        <div className="card-rating">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="#ffd700">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          <span>{s.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <h3 className="card-title">{s.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedSeries && (
        <div className="content-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="content-modal series-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            <div className="modal-backdrop">
              {selectedSeries.cover ? (
                <img src={selectedSeries.cover} alt={selectedSeries.name} />
              ) : (
                <div className="modal-backdrop-placeholder"></div>
              )}
              <div className="modal-backdrop-gradient"></div>
            </div>

            <div className="modal-content">
              <h2 className="modal-title">{selectedSeries.name}</h2>

              <div className="modal-meta">
                {selectedSeries.rating && (
                  <span className="modal-rating">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffd700">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {selectedSeries.rating}
                  </span>
                )}
                {selectedSeries.releaseDate && (
                  <span className="modal-year">{selectedSeries.releaseDate}</span>
                )}
                {selectedSeries.genre && (
                  <span className="modal-genre">{selectedSeries.genre}</span>
                )}
              </div>

              {selectedSeries.plot && (
                <p className="modal-description">{selectedSeries.plot}</p>
              )}

              <div className="modal-actions">
                <button className="modal-play-btn" onClick={handlePlayFirstEpisode} disabled={!seriesInfo}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play First Episode
                </button>
              </div>

              {/* Episodes */}
              {seriesInfo?.episodes ? (
                <div className="modal-episodes">
                  <h3 className="episodes-title">Episodes</h3>
                  {Object.entries(seriesInfo.episodes).sort(([a], [b]) => Number(a) - Number(b)).map(([season, episodes]) => (
                    <div key={season} className="season-group">
                      <h4 className="season-title">Season {season}</h4>
                      <div className="episodes-list">
                        {episodes.map(ep => (
                          <div
                            key={ep.id}
                            className="episode-item"
                            onClick={() => handlePlayEpisode(ep.id, ep.container_extension, `${selectedSeries.name} - S${ep.season}E${ep.episode_num}`)}
                          >
                            <div className="episode-thumbnail">
                              {ep.info?.movie_image ? (
                                <img src={ep.info.movie_image} alt={ep.title} />
                              ) : (
                                <div className="episode-thumbnail-placeholder">
                                  <span>E{ep.episode_num}</span>
                                </div>
                              )}
                              <div className="episode-play-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="episode-info">
                              <div className="episode-header">
                                <span className="episode-number">E{ep.episode_num}</span>
                                {ep.info?.duration && <span className="episode-duration">{ep.info.duration}</span>}
                              </div>
                              <h4 className="episode-name">{ep.title || `Episode ${ep.episode_num}`}</h4>
                              {ep.info?.plot && (
                                <p className="episode-description">{ep.info.plot}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="loading-episodes">
                  <div className="spinner-small"></div>
                  <span>Loading episodes...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      {isPlaying && playingEpisode && (
        <VideoPlayer
          streamUrl={getSeriesUrl(playingEpisode.id, playingEpisode.ext)}
          title={playingEpisode.title}
          onClose={() => {
            setIsPlaying(false);
            setPlayingEpisode(null);
          }}
        />
      )}
    </div>
  );
}
