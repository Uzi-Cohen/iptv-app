import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useXtream } from '../context/XtreamContext';
import './Navigation.css';

export function Navigation() {
  const navigate = useNavigate();
  const { isConnected, disconnect, userInfo } = useXtream();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
    navigate('/');
  };

  return (
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
      </div>
      <div className="nav-actions">
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
                  <span className="dropdown-username">{userInfo?.user_info?.username}</span>
                  <span className="dropdown-status">Connected</span>
                </div>
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
  );
}
