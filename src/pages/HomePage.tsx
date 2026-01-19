import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useXtream } from '../context/XtreamContext';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const { isConnected, isLoading, userInfo, vodStreams, seriesList, liveStreams, loadVodData, loadSeriesData, loadLiveData } = useXtream();

  useEffect(() => {
    if (isConnected) {
      loadVodData();
      loadSeriesData();
      loadLiveData();
    }
  }, [isConnected, loadVodData, loadSeriesData, loadLiveData]);

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="home-page welcome-page">
        <div className="welcome-background">
          <div className="welcome-gradient"></div>
        </div>
        <div className="welcome-content">
          <div className="welcome-logo">
            <span className="logo-icon-large">TV</span>
            <span className="logo-text-large">IPTV</span>
          </div>
          <h1>Welcome to IPTV</h1>
          <p>Stream live TV, movies, and series from your Xtream Codes provider</p>
          <button className="connect-btn" onClick={() => navigate('/login')}>
            Connect to Your Service
          </button>
          <div className="features-grid">
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
              </svg>
              <h3>Live TV</h3>
              <p>Watch live channels</p>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              <h3>Movies</h3>
              <p>Thousands of films</p>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <h3>Series</h3>
              <p>Binge your favorites</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Connected - show dashboard
  return (
    <div className="home-page dashboard">
      <div className="dashboard-header">
        <h1>Welcome Back</h1>
        {userInfo && (
          <p className="user-status">
            Connected as <strong>{userInfo.user_info.username}</strong>
            {userInfo.user_info.exp_date && (
              <span> - Expires: {new Date(Number(userInfo.user_info.exp_date) * 1000).toLocaleDateString()}</span>
            )}
          </p>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => navigate('/channels')}>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{liveStreams.length}</span>
            <span className="stat-label">Live Channels</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/movies')}>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{vodStreams.length}</span>
            <span className="stat-label">Movies</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/series')}>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{seriesList.length}</span>
            <span className="stat-label">Series</span>
          </div>
        </div>
      </div>

      <div className="quick-access">
        <h2>Quick Access</h2>
        <div className="quick-links">
          <button className="quick-link" onClick={() => navigate('/channels')}>
            <span className="live-dot"></span>
            Watch Live TV
          </button>
          <button className="quick-link" onClick={() => navigate('/movies')}>
            Browse Movies
          </button>
          <button className="quick-link" onClick={() => navigate('/series')}>
            Browse Series
          </button>
        </div>
      </div>
    </div>
  );
}
