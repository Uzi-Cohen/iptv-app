import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { VideoPlayer } from '../components';
import { useXtream } from '../context/XtreamContext';
import type { XtreamLiveStream } from '../services/xtreamApi';
import './ChannelsPage.css';

const MAX_DISPLAY = 100;

export function ChannelsPage() {
  const location = useLocation();
  const { liveStreams, liveCategories, loadLiveData, loadLiveByCategory, getLiveUrl, isConnected } = useXtream();
  const [selectedStream, setSelectedStream] = useState<XtreamLiveStream | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadLiveData();
    }
  }, [isConnected, loadLiveData]);

  // Handle navigation from search
  useEffect(() => {
    const state = location.state as { selectedStream?: XtreamLiveStream } | null;
    if (state?.selectedStream) {
      setSelectedStream(state.selectedStream);
      setIsPlaying(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Set initial category when categories load
  useEffect(() => {
    if (liveCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(liveCategories[0].category_id);
    }
  }, [liveCategories, selectedCategory]);

  useEffect(() => {
    if (liveStreams.length > 0 && !selectedStream) {
      setSelectedStream(liveStreams[0]);
    }
  }, [liveStreams, selectedStream]);

  const handleCategoryChange = useCallback(async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoadingCategory(true);
    setSelectedStream(null);
    await loadLiveByCategory(categoryId);
    setIsLoadingCategory(false);
  }, [loadLiveByCategory]);

  const handleSelectStream = (stream: XtreamLiveStream) => {
    setSelectedStream(stream);
  };

  const handlePlayStream = () => {
    if (selectedStream) {
      setIsPlaying(true);
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = liveCategories.find(c => c.category_id === catId);
    return cat?.category_name || 'Unknown';
  };

  // Limit displayed streams
  const displayedStreams = liveStreams.slice(0, MAX_DISPLAY);

  if (!isConnected) {
    return (
      <div className="channels-page">
        <div className="not-connected">
          <h2>Not Connected</h2>
          <p>Please connect to your IPTV service first.</p>
        </div>
      </div>
    );
  }

  if (liveCategories.length === 0) {
    return (
      <div className="channels-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="channels-page">
      <div className="channels-layout">
        <div className="channel-preview-section">
          {selectedStream && (
            <div className="channel-preview">
              <div className="preview-video">
                {selectedStream.stream_icon ? (
                  <img src={selectedStream.stream_icon} alt={selectedStream.name} className="preview-placeholder" />
                ) : (
                  <div className="preview-placeholder no-image">
                    <span>{selectedStream.name.charAt(0)}</span>
                  </div>
                )}
                <div className="preview-overlay">
                  <button className="preview-play-btn" onClick={handlePlayStream}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="preview-info">
                <div className="preview-channel-badge">
                  <span className="channel-num">{selectedStream.num}</span>
                  <span className="channel-name">{selectedStream.name}</span>
                </div>
                <h2 className="preview-program">{selectedStream.name}</h2>
                <div className="preview-meta">
                  <span className="live-badge">LIVE</span>
                  <span className="category-badge">{getCategoryName(selectedStream.category_id)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="channel-list-section">
          <div className="channel-list">
            <div className="channel-categories">
              {liveCategories.map(cat => (
                <button
                  key={cat.category_id}
                  className={`category-btn ${selectedCategory === cat.category_id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.category_id)}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>

            <div className="channels-container">
              {isLoadingCategory ? (
                <div className="loading-category">
                  <div className="spinner-small"></div>
                  <span>Loading...</span>
                </div>
              ) : displayedStreams.length === 0 ? (
                <div className="no-channels">
                  <p>No channels in this category</p>
                </div>
              ) : (
                displayedStreams.map(stream => (
                  <div
                    key={stream.stream_id}
                    className={`channel-item ${selectedStream?.stream_id === stream.stream_id ? 'selected' : ''}`}
                    onClick={() => handleSelectStream(stream)}
                  >
                    <div className="channel-number">{stream.num}</div>
                    <div className="channel-logo">
                      {stream.stream_icon ? (
                        <img src={stream.stream_icon} alt={stream.name} loading="lazy" />
                      ) : (
                        <div className="channel-logo-placeholder">{stream.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="channel-info">
                      <h4 className="channel-name">{stream.name}</h4>
                    </div>
                  </div>
                ))
              )}
              {liveStreams.length > MAX_DISPLAY && (
                <div className="load-more-info">
                  Showing {MAX_DISPLAY} of {liveStreams.length} channels
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPlaying && selectedStream && (
        <VideoPlayer
          streamUrl={getLiveUrl(selectedStream.stream_id)}
          title={selectedStream.name}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
