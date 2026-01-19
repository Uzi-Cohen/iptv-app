import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useXtream } from '../context/XtreamContext';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { connect, isLoading, error } = useXtream();

  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!server.trim() || !username.trim() || !password.trim()) {
      setLocalError('Please fill in Host, Username, and Password');
      return;
    }

    const success = await connect({
      server: server.trim(),
      username: username.trim(),
      password: password.trim(),
    }, name.trim() || undefined);

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
        <div className="login-modal">
          <div className="modal-header">
            <button className="modal-close-btn" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <h1 className="modal-title">Add Xtream-Codes API Playlist</h1>
            <button
              type="submit"
              form="login-form"
              className="modal-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-small"></span>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
          </div>

          <form id="login-form" className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type="text"
                placeholder="Any name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-field">
              <input
                type="text"
                placeholder="Host: e.g. http://server.com:8000"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-field">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError && (
              <div className="error-message">
                {displayError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
