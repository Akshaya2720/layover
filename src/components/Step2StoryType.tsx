import React from 'react';
import { Check, ArrowRight, Users, CheckCircle2, Sprout, Sparkles, MapPin, Gamepad2 } from 'lucide-react';
import { StoryType } from '../../shared/types.js';

interface Step2StoryTypeProps {
  selectedStoryType: StoryType;
  onSelectStoryType: (type: StoryType) => void;
  onNext: () => void;
}

export const Step2StoryType: React.FC<Step2StoryTypeProps> = ({
  selectedStoryType,
  onSelectStoryType,
  onNext,
}) => {
  return (
    <div className="content-scrollable">
      <div className="step-eyebrow">STEP 2 OF 5</div>
      <h1 className="page-title">
        Choose Your Story Type
      </h1>
      <p className="page-subtitle">
        Do you want to explore real stories from local communities or dive into a fictional adventure created just for you?
      </p>

      <div className="storytype-container">
        {/* Option 1: Real Stories from Local Communities */}
        <div
          className={`storytype-card ${selectedStoryType === 'real' ? 'selected' : ''}`}
          onClick={() => onSelectStoryType('real')}
        >
          <div className="storytype-left">
            <img
              src="/genres/history.jpg"
              alt="Storybook pop-up of historic Kerala architecture and coastal palms"
            />
          </div>

          <div className="storytype-right">
            <div className="storytype-top-row">
              <h2 className="storytype-title">Real Stories from Local Communities</h2>
              <div className="storytype-radio">
                {selectedStoryType === 'real' && <Check size={14} color="#FFF" />}
              </div>
            </div>

            <p className="storytype-desc">
              Discover authentic stories, local history, folklore and personal experiences shared by residents.
            </p>

            <ul className="storytype-bullets">
              <li className="storytype-bullet-item">
                <Users size={14} color="#2D5A46" />
                <span>Community voices</span>
              </li>
              <li className="storytype-bullet-item">
                <CheckCircle2 size={14} color="#2D5A46" />
                <span>Verified sources & archives</span>
              </li>
              <li className="storytype-bullet-item">
                <Sprout size={14} color="#2D5A46" />
                <span>Real culture and heritage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Option 2: AI-Generated Fictional Stories */}
        <div
          className={`storytype-card ${selectedStoryType === 'fictional' ? 'selected' : ''}`}
          onClick={() => onSelectStoryType('fictional')}
        >
          <div className="storytype-left">
            <img
              src="/genres/mystery.jpg"
              alt="Treasure map and brass navigation compass"
            />
          </div>

          <div className="storytype-right">
            <div className="storytype-top-row">
              <h2 className="storytype-title">AI-Generated Fictional Stories</h2>
              <div className="storytype-radio">
                {selectedStoryType === 'fictional' && <Check size={14} color="#FFF" />}
              </div>
            </div>

            <p className="storytype-desc">
              Enjoy original adventures created using real locations, crafted by AI. Your journey, your story.
            </p>

            <ul className="storytype-bullets">
              <li className="storytype-bullet-item">
                <Sparkles size={14} color="#D4A359" />
                <span>Unique storylines</span>
              </li>
              <li className="storytype-bullet-item">
                <MapPin size={14} color="#D4A359" />
                <span>Real places as settings</span>
              </li>
              <li className="storytype-bullet-item">
                <Gamepad2 size={14} color="#D4A359" />
                <span>Interactive treasure hunts</span>
              </li>
            </ul>
          </div>
        </div>
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
