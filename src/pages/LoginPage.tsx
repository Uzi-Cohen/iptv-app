import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useXtream } from '../context/XtreamContext';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { connect, isLoading, error } = useXtream();

  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!server.trim() || !username.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await connect({
      server: server.trim(),
      username: username.trim(),
      password: password.trim(),
    });

    if (success) {
      navigate('/');
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-gradient"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">TV</span>
              <span className="logo-text">IPTV</span>
            </div>
            <h1>Connect to your IPTV Service</h1>
            <p>Enter your Xtream Codes credentials to access live TV, movies, and series</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="server">Server URL</label>
              <input
                type="text"
                id="server"
                placeholder="http://example.com:8080"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                disabled={isLoading}
              />
              <span className="input-hint">Include port number (e.g., http://server.com:8080)</span>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {displayError}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </form>

          <div className="login-info">
            <h3>Supported Format</h3>
            <p>This app supports Xtream Codes API. Your provider should give you:</p>
            <ul>
              <li>Server URL (with port)</li>
              <li>Username</li>
              <li>Password</li>
            </ul>
            <p className="m3u-note">
              Or an M3U URL like:<br/>
              <code>http://server:port/get.php?username=X&password=Y&type=m3u_plus</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
