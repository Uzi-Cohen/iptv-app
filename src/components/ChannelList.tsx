import { useState } from 'react';
import type { Channel } from '../types';
import './ChannelList.css';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  categories: string[];
}

export function ChannelList({ channels, selectedChannel, onSelectChannel, categories }: ChannelListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredChannels = selectedCategory === 'All'
    ? channels
    : channels.filter(c => c.category === selectedCategory);

  return (
    <div className="channel-list">
      <div className="channel-categories">
        <button
          className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="channels-container">
        {filteredChannels.map(channel => (
          <div
            key={channel.id}
            className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
            onClick={() => onSelectChannel(channel)}
          >
            <div className="channel-number">{channel.number}</div>
            <div className="channel-logo">
              <img src={channel.logo} alt={channel.name} />
            </div>
            <div className="channel-info">
              <h4 className="channel-name">{channel.name}</h4>
              <p className="channel-program">{channel.currentProgram}</p>
            </div>
            <div className="channel-category-badge">{channel.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
