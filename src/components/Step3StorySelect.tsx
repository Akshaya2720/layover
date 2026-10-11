import React, { useState } from 'react';
import { ArrowRight, Clock, MapPin, BarChart3, BookOpen, AlertCircle } from 'lucide-react';
import { Story, Difficulty } from '../../shared/types.js';

interface Step3StorySelectProps {
  stories: Story[];
  selectedStoryId: string;
  onSelectStory: (story: Story) => void;
  onNext: () => void;
}

export const Step3StorySelect: React.FC<Step3StorySelectProps> = ({
  stories,
  selectedStoryId,
  onSelectStory,
  onNext,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | Difficulty>('all');
  const [previewModalStory, setPreviewModalStory] = useState<Story | null>(null);

  const filteredStories = stories.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.difficulty === activeFilter;
  });

  return (
    <div className="content-scrollable">
      <h1 className="page-title">
        Select a Story 🍃
      </h1>
      <p className="page-subtitle">
        Each story is crafted to real locations, offering a unique way to explore, learn and experience.
      </p>

      {/* Filter Pills */}
      <div className="filter-pill-row">
        <button
          className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Stories
        </button>
        <button
          className={`filter-pill ${activeFilter === 'easy' ? 'active' : ''}`}
          onClick={() => setActiveFilter('easy')}
        >
          Easy
        </button>
        <button
          className={`filter-pill ${activeFilter === 'medium' ? 'active' : ''}`}
          onClick={() => setActiveFilter('medium')}
        >
          Medium
        </button>
        <button
          className={`filter-pill ${activeFilter === 'hard' ? 'active' : ''}`}
          onClick={() => setActiveFilter('hard')}
        >
          Hard
        </button>
      </div>

      {/* Story List */}
      <div className="story-list">
        {filteredStories.map((story) => {
          const isSelected = selectedStoryId === story.id;

          return (
            <div
              key={story.id}
              className={`story-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectStory(story)}
            >
              <div className="story-thumb">
                <img src={story.image} alt={story.title} />
              </div>

              <div className="story-info">
                <div className="story-header-row">
                  <span className="genre-tag">
                    {story.genre}
                  </span>
                  {story.isPreview && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#A0722C', background: '#FDF7EB', padding: '1px 6px', borderRadius: '4px' }}>
                      Preview
                    </span>
                  )}
                </div>

                <h2 className="story-title">{story.title}</h2>
                <p className="story-synopsis">{story.synopsis}</p>

                <div className="story-meta-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <BarChart3 size={12} />
                    <span style={{ textTransform: 'capitalize' }}>{story.difficulty}</span>
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} />
                    <span>{story.estimatedDuration}</span>
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={12} />
                    <span>{story.locationTag}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="genre-arrow-btn"
                  style={{
                    background: isSelected ? '#2D5A46' : '#F4EFE7',
                    color: isSelected ? '#FFFFFF' : '#2D5A46',
                  }}
                >
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
