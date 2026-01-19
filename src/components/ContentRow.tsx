import { useRef, useState } from 'react';
import type { Movie, Series } from '../types';
import { ContentCard } from './ContentCard';
import './ContentRow.css';

interface ContentRowProps {
  title: string;
  items: (Movie | Series)[];
  onItemClick: (item: Movie | Series) => void;
}

export function ContentRow({ title, items, onItemClick }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    const row = rowRef.current;
    if (!row) return;

    setShowLeftArrow(row.scrollLeft > 0);
    setShowRightArrow(row.scrollLeft < row.scrollWidth - row.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const row = rowRef.current;
    if (!row) return;

    const scrollAmount = row.clientWidth * 0.8;
    row.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        {showLeftArrow && (
          <button className="scroll-btn scroll-left" onClick={() => scroll('left')}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}
        <div className="row-content" ref={rowRef} onScroll={handleScroll}>
          {items.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>
        {showRightArrow && (
          <button className="scroll-btn scroll-right" onClick={() => scroll('right')}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
