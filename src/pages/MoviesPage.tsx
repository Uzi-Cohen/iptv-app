import { useState } from 'react';
import { HeroBanner, ContentRow, ContentModal, VideoPlayer } from '../components';
import { movies, movieCategories } from '../data';
import type { Movie, Series } from '../types';
import './MoviesPage.css';

export function MoviesPage() {
  const [selectedItem, setSelectedItem] = useState<Movie | Series | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const featuredMovie = movies[0];

  const handleItemClick = (item: Movie | Series) => {
    setSelectedItem(item);
  };

  const handlePlay = () => {
    if (selectedItem) {
      setIsPlaying(true);
    } else {
      setSelectedItem(featuredMovie);
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
    <div className="movies-page">
      <HeroBanner
        item={featuredMovie}
        onPlay={handlePlay}
        onInfo={() => setSelectedItem(featuredMovie)}
      />

      <div className="movies-content">
        {movieCategories.map(category => (
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
          streamUrl={(selectedItem as Movie).streamUrl}
          title={selectedItem.title}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
