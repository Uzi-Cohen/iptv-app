import { useState } from 'react';
import { HeroBanner, ContentRow, ContentModal, VideoPlayer } from '../components';
import { movies, series, movieCategories, seriesCategories } from '../data';
import type { Movie, Series } from '../types';
import './HomePage.css';

export function HomePage() {
  const [selectedItem, setSelectedItem] = useState<Movie | Series | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Featured item - could be movie or series
  const featuredItem = movies[2]; // Interstellar as featured

  const handleItemClick = (item: Movie | Series) => {
    setSelectedItem(item);
  };

  const handlePlay = () => {
    if (selectedItem) {
      setIsPlaying(true);
    } else {
      setSelectedItem(featuredItem);
      setIsPlaying(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };

  // Mix content from movies and series
  const continueWatching = [...movies.slice(3, 6), ...series.slice(0, 3)];
  const topPicks = [...movies.slice(0, 4), ...series.slice(2, 6)];

  return (
    <div className="home-page">
      <HeroBanner
        item={featuredItem}
        onPlay={handlePlay}
        onInfo={() => setSelectedItem(featuredItem)}
      />

      <div className="home-content">
        <ContentRow
          title="Continue Watching"
          items={continueWatching}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title="Top Picks for You"
          items={topPicks}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title={movieCategories[0].name}
          items={movieCategories[0].items}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title={seriesCategories[0].name}
          items={seriesCategories[0].items}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title="New Releases"
          items={[...movies.slice(8, 14), ...series.slice(6, 10)]}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title={movieCategories[5].name}
          items={movieCategories[5].items}
          onItemClick={handleItemClick}
        />
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
          streamUrl={'seasons' in selectedItem
            ? (selectedItem as Series).episodes[0]?.streamUrl || ''
            : (selectedItem as Movie).streamUrl
          }
          title={selectedItem.title}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
