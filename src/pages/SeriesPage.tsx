import { useState } from 'react';
import { HeroBanner, ContentRow, ContentModal, VideoPlayer } from '../components';
import { series, seriesCategories } from '../data';
import type { Movie, Series } from '../types';
import './SeriesPage.css';

export function SeriesPage() {
  const [selectedItem, setSelectedItem] = useState<Movie | Series | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const featuredSeries = series[0];

  const handleItemClick = (item: Movie | Series) => {
    setSelectedItem(item);
  };

  const handlePlay = () => {
    if (selectedItem) {
      setIsPlaying(true);
    } else {
      setSelectedItem(featuredSeries);
      setIsPlaying(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };

  return (
    <div className="series-page">
      <HeroBanner
        item={featuredSeries}
        onPlay={handlePlay}
        onInfo={() => setSelectedItem(featuredSeries)}
      />

      <div className="series-content">
        {seriesCategories.map(category => (
          <ContentRow
            key={category.id}
            title={category.name}
            items={category.items}
            onItemClick={handleItemClick}
          />
        ))}
      </div>

      {selectedItem && !isPlaying && (
        <ContentModal
          item={selectedItem}
          onClose={handleCloseModal}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      {isPlaying && selectedItem && (
        <VideoPlayer
          streamUrl={(selectedItem as Series).episodes[0]?.streamUrl || ''}
          title={`${selectedItem.title} - S1E1`}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
