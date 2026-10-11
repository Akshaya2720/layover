import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Genre } from '../../shared/types.js';

interface Step1GenreProps {
  selectedGenre: Genre;
  onSelectGenre: (genre: Genre) => void;
  onNext: () => void;
}

export const Step1Genre: React.FC<Step1GenreProps> = ({
  selectedGenre,
  onSelectGenre,
  onNext,
}) => {
  const genres: Array<{
    id: Genre;
    title: string;
    description: string;
    image: string;
    altText: string;
  }> = [
    {
      id: 'history',
      title: 'History',
      description: 'Walk through royal Zamorin palaces, ancient stone courtyards, and centuries of maritime legacy.',
      image: '/genres/history.jpg',
      altText: 'Intricately carved Kerala heritage temple courtyard with ancient stone pillars and royal woodwork',
    },
    {
      id: 'mystery',
      title: 'Mystery',
      description: 'Decipher cryptic parchment maps, astrolabes, lost ledgers, and secret trade guild ciphers.',
      image: '/genres/mystery.jpg',
      altText: 'Atmospheric detective desk with antique parchment map, brass astrolabe, and wax-sealed letter',
    },
    {
      id: 'romance',
      title: 'Romance',
      description: 'Lyrical seaside walks along lantern-lit piers, coastal twilight breezes, and timeless love folklore.',
      image: '/genres/romance.jpg',
      altText: 'Lantern-lit wooden coastal pier over ocean waves under a breathtaking golden hour twilight sky',
    },
    {
      id: 'adventure',
      title: 'Adventure',
      description: 'Trek misty rainforest canopies, suspension bridges, hidden waterfalls, and rugged mountain paths.',
      image: '/genres/adventure.jpg',
      altText: 'Expedition hikers crossing a suspension bridge across a misty mountain rainforest canyon',
    },
    {
      id: 'horror',
      title: 'Horror',
      description: 'Uncover crumbling sea piers, nocturnal seaside fogs, and forgotten colonial cemetery epitaphs.',
      image: '/genres/horror.jpg',
      altText: 'Eerie gothic coastal ruins and weathered sea pier under moonlit mist with glowing green lanterns',
    },
    {
      id: 'fantasy',
      title: 'Fantasy',
      description: 'Step into enchanted banyan groves glowing with bioluminescent moss and ancient spirit gates.',
      image: '/genres/fantasy.jpg',
      altText: 'Mystical ancient banyan tree roots framing a stone spirit portal glowing with bioluminescent light',
    },
  ];

  return (
    <div className="content-scrollable">
      <h1 className="page-title">
        Choose Your Genre 🍃
      </h1>
      <p className="page-subtitle">
        What kind of story are you in the mood for? Select a genre and let the adventure begin.
      </p>

      {/* 2-Column Genre Cards Grid */}
      <div className="genre-grid">
        {genres.map((g) => {
          const isSelected = selectedGenre === g.id;

          return (
            <div
              key={g.id}
              className={`genre-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectGenre(g.id)}
            >
              {isSelected && (
                <div className="genre-check-badge">
                  <Check size={14} color="#FFF" />
                </div>
              )}

              <div className="genre-image-container">
                <img src={g.image} alt={g.altText} className="genre-image" loading="lazy" />
              </div>

              <h2 className="genre-title">{g.title}</h2>
              <p className="genre-desc">{g.description}</p>

              <div className="genre-footer-row">
                <div className="genre-arrow-btn">
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed-bottom-bar">
        <button className="btn-primary-action" onClick={onNext}>
          <span>Next</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
