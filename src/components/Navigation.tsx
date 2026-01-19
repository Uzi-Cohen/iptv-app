import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useXtream } from '../context/XtreamContext';
import { SearchModal } from './SearchModal';
import type { XtreamLiveStream, XtreamVodStream, XtreamSeries } from '../services/xtreamApi';
import './Navigation.css';

export function Navigation() {
  const navigate = useNavigate();
  const { isConnected, disconnect, userInfo, playlistName } = useXtream();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
    navigate('/');
  };

  const handleSelectChannel = (stream: XtreamLiveStream) => {
    navigate('/channels', { state: { selectedStream: stream } });
  };

  const handleSelectMovie = (movie: XtreamVodStream) => {
    navigate('/movies', { state: { selectedMovie: movie } });
  };

  const handleSelectSeries = (series: XtreamSeries) => {
    navigate('/series', { state: { selectedSeries: series } });
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-brand">
          <span className="brand-icon">TV</span>
          <span className="brand-text">IPTV</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/channels" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Live TV
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Movies
          </NavLink>
          <NavLink to="/series" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Series
          </NavLink>
          <NavLink to="/extractor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Extractor
          </NavLink>
        </div>
        <div className="nav-actions">
          {isConnected && (
            <button className="search-btn" onClick={() => setShowSearch(true)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          )}
          {isConnected ? (
            <div className="user-menu">
              <button
                className="user-avatar connected"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{userInfo?.user_info?.username?.charAt(0).toUpperCase() || 'U'}</span>
              </button>
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-username">{playlistName || userInfo?.user_info?.username}</span>
                    <span className="dropdown-status">Connected</span>
                  </div>
                  <button className="dropdown-item" onClick={() => { navigate('/login'); setShowDropdown(false); }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add Another Playlist
                  </button>
                  <button className="dropdown-item" onClick={handleDisconnect}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="connect-nav-btn" onClick={() => navigate('/login')}>
              Connect
            </button>
          )}
        </div>
      </nav>

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectChannel={handleSelectChannel}
        onSelectMovie={handleSelectMovie}
        onSelectSeries={handleSelectSeries}
      />
    </>
  );
}
