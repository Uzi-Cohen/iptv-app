import { useState } from 'react';
import './ExtractorPage.css';

interface ExtractedUrls {
  server: string;
  username: string;
  password: string;
  liveUrl: string;
  vodUrl: string;
  seriesUrl: string;
  m3uUrl: string;
  apiUrl: string;
}

export function ExtractorPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [extracted, setExtracted] = useState<ExtractedUrls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const extractUrls = () => {
    setError(null);
    setExtracted(null);

    if (!inputUrl.trim()) {
      setError('Please enter an Xtream Codes URL');
      return;
    }

    try {
      // Parse the URL to extract server, username, and password
      // Supported formats:
      // http://server:port/get.php?username=X&password=Y&type=m3u_plus
      // http://server:port/player_api.php?username=X&password=Y
      // Or just: server:port username password

      let server = '';
      let username = '';
      let password = '';

      const input = inputUrl.trim();

      // Check if it's a URL format
      if (input.includes('http://') || input.includes('https://')) {
        const url = new URL(input);
        server = `${url.protocol}//${url.host}`;
        username = url.searchParams.get('username') || '';
        password = url.searchParams.get('password') || '';
      } else {
        // Try parsing as "server username password" format
        const parts = input.split(/\s+/);
        if (parts.length >= 3) {
          server = parts[0].startsWith('http') ? parts[0] : `http://${parts[0]}`;
          username = parts[1];
          password = parts[2];
        } else if (parts.length === 1) {
          // Maybe just server URL, check if it has credentials in path
          // Format: http://server:port/username/password
          const match = input.match(/^(https?:\/\/[^\/]+)\/([^\/]+)\/([^\/]+)/);
          if (match) {
            server = match[1];
            username = match[2];
            password = match[3];
          } else {
            throw new Error('Invalid format');
          }
        } else {
          throw new Error('Invalid format');
        }
      }

      if (!server || !username || !password) {
        throw new Error('Could not extract credentials from the URL');
      }

      // Remove trailing slash from server
      server = server.replace(/\/$/, '');

      const encodedUsername = encodeURIComponent(username);
      const encodedPassword = encodeURIComponent(password);

      setExtracted({
        server,
        username,
        password,
        liveUrl: `${server}/live/${encodedUsername}/${encodedPassword}/`,
        vodUrl: `${server}/movie/${encodedUsername}/${encodedPassword}/`,
        seriesUrl: `${server}/series/${encodedUsername}/${encodedPassword}/`,
        m3uUrl: `${server}/get.php?username=${encodedUsername}&password=${encodedPassword}&type=m3u_plus`,
        apiUrl: `${server}/player_api.php?username=${encodedUsername}&password=${encodedPassword}`,
      });
    } catch {
      setError('Could not parse the URL. Please check the format and try again.');
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAll = async () => {
    if (!extracted) return;
    const allText = `Server: ${extracted.server}
Username: ${extracted.username}
Password: ${extracted.password}

M3U Playlist URL:
${extracted.m3uUrl}

API URL:
${extracted.apiUrl}

Live Streams Base URL:
${extracted.liveUrl}

VOD/Movies Base URL:
${extracted.vodUrl}

Series Base URL:
${extracted.seriesUrl}`;

    await copyToClipboard(allText, 'all');
  };

  return (
    <div className="extractor-page">
      <div className="extractor-container">
        <div className="extractor-header">
          <h1>Xtream Codes URL Extractor</h1>
          <p>Paste your Xtream Codes URL to extract all the stream URLs</p>
        </div>

        <div className="extractor-input-section">
          <textarea
            className="extractor-input"
            placeholder="Paste your Xtream Codes URL here...

Supported formats:
• http://server:port/get.php?username=X&password=Y&type=m3u_plus
• http://server:port/player_api.php?username=X&password=Y
• server:port username password"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button className="extract-btn" onClick={extractUrls}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Extract URLs
          </button>
        </div>

        {error && (
          <div className="extractor-error">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        {extracted && (
          <div className="extractor-results">
            <div className="results-header">
              <h2>Extracted URLs</h2>
              <button className="copy-all-btn" onClick={copyAll}>
                {copiedField === 'all' ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="credentials-section">
              <div className="credential-item">
                <label>Server</label>
                <div className="credential-value">
                  <span>{extracted.server}</span>
                  <button onClick={() => copyToClipboard(extracted.server, 'server')}>
                    {copiedField === 'server' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="credential-item">
                <label>Username</label>
                <div className="credential-value">
                  <span>{extracted.username}</span>
                  <button onClick={() => copyToClipboard(extracted.username, 'username')}>
                    {copiedField === 'username' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="credential-item">
                <label>Password</label>
                <div className="credential-value">
                  <span>{extracted.password}</span>
                  <button onClick={() => copyToClipboard(extracted.password, 'password')}>
                    {copiedField === 'password' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="url-section">
              <div className="url-item">
                <div className="url-header">
                  <h3>M3U Playlist URL</h3>
                  <button onClick={() => copyToClipboard(extracted.m3uUrl, 'm3u')}>
                    {copiedField === 'm3u' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>{extracted.m3uUrl}</code>
              </div>

              <div className="url-item">
                <div className="url-header">
                  <h3>API URL</h3>
                  <button onClick={() => copyToClipboard(extracted.apiUrl, 'api')}>
                    {copiedField === 'api' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>{extracted.apiUrl}</code>
              </div>

              <div className="url-item">
                <div className="url-header">
                  <h3>Live Streams Base URL</h3>
                  <button onClick={() => copyToClipboard(extracted.liveUrl, 'live')}>
                    {copiedField === 'live' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>{extracted.liveUrl}</code>
                <span className="url-hint">Append stream_id.ts (e.g., 123.ts)</span>
              </div>

              <div className="url-item">
                <div className="url-header">
                  <h3>VOD/Movies Base URL</h3>
                  <button onClick={() => copyToClipboard(extracted.vodUrl, 'vod')}>
                    {copiedField === 'vod' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>{extracted.vodUrl}</code>
                <span className="url-hint">Append stream_id.extension (e.g., 456.mp4)</span>
              </div>

              <div className="url-item">
                <div className="url-header">
                  <h3>Series Base URL</h3>
                  <button onClick={() => copyToClipboard(extracted.seriesUrl, 'series')}>
                    {copiedField === 'series' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>{extracted.seriesUrl}</code>
                <span className="url-hint">Append episode_id.extension (e.g., 789.mkv)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
