import { useState } from 'react';
import { ChannelList, VideoPlayer } from '../components';
import { channels, channelCategories } from '../data';
import type { Channel } from '../types';
import './ChannelsPage.css';

export function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(channels[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handlePlayChannel = () => {
    if (selectedChannel) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="channels-page">
      <div className="channels-layout">
        <div className="channel-preview-section">
          {selectedChannel && (
            <div className="channel-preview">
              <div className="preview-video">
                <img src={selectedChannel.logo} alt={selectedChannel.name} className="preview-placeholder" />
                <div className="preview-overlay">
                  <button className="preview-play-btn" onClick={handlePlayChannel}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="preview-info">
                <div className="preview-channel-badge">
                  <span className="channel-num">{selectedChannel.number}</span>
                  <span className="channel-name">{selectedChannel.name}</span>
                </div>
                <h2 className="preview-program">{selectedChannel.currentProgram}</h2>
                <div className="preview-meta">
                  <span className="live-badge">LIVE</span>
                  <span className="category-badge">{selectedChannel.category}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="channel-list-section">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={handleSelectChannel}
            categories={channelCategories}
          />
        </div>
      </div>

      {isPlaying && selectedChannel && (
        <VideoPlayer
          streamUrl={selectedChannel.streamUrl}
          title={`${selectedChannel.name} - ${selectedChannel.currentProgram}`}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
