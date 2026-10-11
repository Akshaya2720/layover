import React from 'react';
import { ArrowRight, MapPin, X, Navigation, Clock, User, Minus, Plus } from 'lucide-react';
import { TravelMode, Difficulty, Genre } from '../../shared/types.js';
import { RealWorldMap } from './RealWorldMap.js';
import { PLAYABLE_KOZHIKODE_QUEST, getQuestForGenre } from '../../server/services/kozhikodeStories.js';

interface Step4RoutePlanProps {
  selectedGenre?: Genre;
  selectedStoryId?: string;
  startLocation: string;
  destination: string;
  availableTime: '30 mins' | '1 hour' | '2 hours';
  travelMode: TravelMode;
  difficulty: Difficulty;
  checkpointCount: number;
  onUpdateStartLocation: (val: string) => void;
  onUpdateDestination: (val: string) => void;
  onUpdateAvailableTime: (val: '30 mins' | '1 hour' | '2 hours') => void;
  onUpdateTravelMode: (val: TravelMode) => void;
  onUpdateDifficulty: (val: Difficulty) => void;
  onUpdateCheckpointCount: (val: number) => void;
  budget?: 'free' | 'auto' | 'premium';
  onUpdateBudget?: (val: 'free' | 'auto' | 'premium') => void;
  onGenerateRoute: () => void;
  isGenerating?: boolean;
}

export const Step4RoutePlan: React.FC<Step4RoutePlanProps> = ({
  startLocation,
  destination,
  availableTime,
  travelMode,
  difficulty,
  checkpointCount,
  budget = 'free',
  onUpdateBudget,
  onUpdateStartLocation,
  onUpdateDestination,
  onUpdateAvailableTime,
  onUpdateTravelMode,
  onUpdateDifficulty,
  onUpdateCheckpointCount,
  onGenerateRoute,
  isGenerating,
}) => {
  const previewQuest = getQuestForGenre(selectedGenre || 'mystery', selectedStoryId);
  const routeCheckpoints = previewQuest.chapters.slice(0, checkpointCount).map((c) => c.checkpoint);
  const startCoords = [routeCheckpoints[0]?.lat || 11.2588, routeCheckpoints[0]?.lng || 75.7686] as [number, number];
  const lastCp = routeCheckpoints[routeCheckpoints.length - 1] || routeCheckpoints[0];
  const destCoords = [lastCp.lat, lastCp.lng] as [number, number];
  const routeWaypoints = routeCheckpoints.map((cp) => [cp.lat, cp.lng] as [number, number]);

  return (
    <div className="content-scrollable">
      <h1 className="page-title">
        Plan Your Route 🍃
      </h1>
      <p className="page-subtitle">
        Tell us where you're starting and where you want to go. We'll create the best route for your adventure.
      </p>

      {/* Route Inputs Form Card */}
      <div className="route-form-card">
        {/* Starting Location */}
        <div className="input-field-group">
          <label className="field-label">
            <MapPin size={15} color="#2D5A46" /> Starting Location
          </label>
          <div className="input-with-clear">
            <input
              type="text"
              value={startLocation}
              onChange={(e) => onUpdateStartLocation(e.target.value)}
              placeholder="E.g. Kozhikode Beach, Beach Road"
            />
            {startLocation && (
              <button className="clear-input-btn" onClick={() => onUpdateStartLocation('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="input-field-group">
          <label className="field-label">
            <Navigation size={15} color="#2D5A46" /> Destination
          </label>
          <div className="input-with-clear">
            <input
              type="text"
              value={destination}
              onChange={(e) => onUpdateDestination(e.target.value)}
              placeholder="E.g. Mananchira Square, Kozhikode"
            />
            {destination && (
              <button className="clear-input-btn" onClick={() => onUpdateDestination('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Available Time, Budget & Travel Mode Grid */}
        <div className="options-row-grid">
          <div>
            <label className="option-group-label">
              <Clock size={13} color="#2D5A46" /> Available Time
            </label>
            <div className="pill-selector">
              {(['30 mins', '1 hour', '2 hours'] as const).map((t) => (
                <button
                  key={t}
                  className={`pill-opt-btn ${availableTime === t ? 'active' : ''}`}
                  onClick={() => onUpdateAvailableTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="option-group-label">
              <span>💰</span> Transit Budget
            </label>
            <div className="pill-selector">
              <button
                type="button"
                className={`pill-opt-btn ${budget === 'free' ? 'active' : ''}`}
                onClick={() => onUpdateBudget && onUpdateBudget('free')}
                title="Free on-foot exploration (₹0)"
              >
                🪙 Free (₹0)
              </button>
              <button
                type="button"
                className={`pill-opt-btn ${budget === 'auto' ? 'active' : ''}`}
                onClick={() => onUpdateBudget && onUpdateBudget('auto')}
                title="Kozhikode Auto Rickshaw transit (₹50-100)"
              >
                🛺 Auto (₹50)
              </button>
              <button
                type="button"
                className={`pill-opt-btn ${budget === 'premium' ? 'active' : ''}`}
                onClick={() => onUpdateBudget && onUpdateBudget('premium')}
                title="Heritage Bus / AC Cab tour (₹150+)"
              >
                🚌 Tour (₹150+)
              </button>
            </div>
          </div>
        </div>

        {/* Travel Mode & Difficulty */}
        <div className="options-row-grid" style={{ marginTop: '12px' }}>
          <div>
            <label className="option-group-label">
              <span>🚗</span> Travel Mode
            </label>
            <div className="pill-selector">
              <button
                className={`pill-opt-btn ${travelMode === 'walking' ? 'active' : ''}`}
                onClick={() => onUpdateTravelMode('walking')}
              >
                🚶 Walking
              </button>
              <button
                className={`pill-opt-btn ${travelMode === 'driving' ? 'active' : ''}`}
                onClick={() => onUpdateTravelMode('driving')}
              >
                🚗 Driving
              </button>
            </div>
          </div>

          <div>
            <label className="option-group-label">
              <span>📊</span> Difficulty
            </label>
            <div className="pill-selector">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  className={`pill-opt-btn ${difficulty === d ? 'active' : ''}`}
                  onClick={() => onUpdateDifficulty(d)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Checkpoints Count */}
        <div className="options-row-grid" style={{ marginTop: '12px' }}>
          <div>
            <label className="option-group-label">
              <MapPin size={13} color="#2D5A46" /> Checkpoints Count
            </label>
            <div className="counter-selector">
              <button
                className="counter-btn"
                onClick={() => onUpdateCheckpointCount(Math.max(1, checkpointCount - 1))}
              >
                <Minus size={14} />
              </button>
              <span className="counter-value">{checkpointCount}</span>
              <button
                className="counter-btn"
                onClick={() => onUpdateCheckpointCount(Math.min(5, checkpointCount + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Route Card */}
      <div className="map-preview-card">
        <div className="map-header-row">
          <span>📖</span>
          <span>Preview Route</span>
        </div>
        <div className="map-subtitle">
          A {availableTime} {travelMode} route through historic Kozhikode with {checkpointCount} checkpoints
        </div>

        {/* Real-World Interactive Leaflet Map with Fallbacks & Controls */}
        <RealWorldMap
          checkpoints={routeCheckpoints}
          startCoords={startCoords}
          startName={routeCheckpoints[0]?.name || 'Start'}
          destinationCoords={destCoords}
          destinationName={lastCp?.name || 'Destination'}
          routeWaypoints={routeWaypoints}
          travelMode={travelMode}
          height="220px"
          showTurnByTurn={true}
        />

        {/* Stats Footer */}
        <div className="route-stats-footer">
          <div className="stat-item">
            <span>🚶</span>
            <span>3.2 km Distance</span>
          </div>
          <div className="stat-item">
            <span>⏱️</span>
            <span>58 mins Estimated</span>
          </div>
          <div className="stat-item">
            <MapPin size={13} color="#2D5A46" />
            <span>{checkpointCount} Checkpoints</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed-bottom-bar">
        <button className="btn-primary-action" onClick={onGenerateRoute} disabled={isGenerating}>
          <span>{isGenerating ? 'Generating Quest...' : 'Generate Route'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
