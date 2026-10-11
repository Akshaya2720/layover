import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Clock,
  BarChart3,
  Lock,
  Unlock,
  CheckCircle2,
  Lightbulb,
  Search,
  Camera,
  Box,
  Bot,
  Sparkles,
  Trophy,
  Navigation,
  Check,
  AlertCircle,
  HelpCircle,
  Download,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Award,
  Ticket,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quest, UserProgress, CollectibleArtifact, PhotoMemory } from '../../shared/types.js';
import { calculateDistanceKm } from '../../server/services/geoService.js';
import { RealWorldMap } from './RealWorldMap.js';
import { TravelRewardsModal } from './TravelRewardsModal.js';
import { getUnlockedVouchers } from '../services/travelRewards.js';

interface Step5QuestGameProps {
  quest: Quest;
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenAvatarGuide: () => void;
  onOpenARViewer: (artifact: CollectibleArtifact) => void;
  onOpenPhotoCapture: (checkpointId: string, checkpointName: string) => void;
  onOpenStorybook: () => void;
}

export const Step5QuestGame: React.FC<Step5QuestGameProps> = ({
  quest,
  progress,
  onUpdateProgress,
  onOpenAvatarGuide,
  onOpenARViewer,
  onOpenPhotoCapture,
  onOpenStorybook,
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(progress.currentChapterIndex || 0);
  const [riddleInput, setRiddleInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [isVerifyingGps, setIsVerifyingGps] = useState<boolean>(false);
  const [finalMysteryInput, setFinalMysteryInput] = useState<string>('');
  const [finalMysteryFeedback, setFinalMysteryFeedback] = useState<string | null>(null);
  const [showLiveMap, setShowLiveMap] = useState<boolean>(true);
  const [showTravelRewardsModal, setShowTravelRewardsModal] = useState<boolean>(false);
  const [onSiteAnswerInput, setOnSiteAnswerInput] = useState<string>('');
  const [onSiteFeedback, setOnSiteFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const currentChapter = quest.chapters[selectedChapterIndex];
  const checkpoint = currentChapter.checkpoint;
  const isCurrentChapterSolved = progress.completedChapters.includes(currentChapter.number);
  const isCheckpointVerified =
    progress.verifiedCheckpoints.includes(checkpoint.id) ||
    progress.simulatedArrivals.includes(checkpoint.id);
  const isFactDiscovered = progress.discoveredFacts?.includes(checkpoint.id);

  // Photos taken for this specific checkpoint
  const currentCheckpointPhotos = progress.photos.filter((p) => p.checkpointId === checkpoint.id);
  const hasUploadedPhotoAtCheckpoint = currentCheckpointPhotos.length > 0;

  // Calculate Rank Title from Score
  const getRankTitle = (score: number) => {
    if (score >= 600) return '👑 Master Chronicler of Calicut';
    if (score >= 350) return '📜 Apprentice Historian';
    return '🧭 Novice Explorer';
  };

  // Progress Percentage
  const completionPercentage = Math.round((progress.completedChapters.length / quest.chapters.length) * 100);

  // On-Site Physical Observation Solver
  const handleOnSiteScavengerSubmit = () => {
    if (!onSiteAnswerInput.trim()) return;

    if (isCurrentChapterSolved) {
      setOnSiteFeedback({
        message: 'This on-site task has already been completed!',
        isSuccess: true,
      });
      return;
    }

    const task = checkpoint.onSiteScavengerTask;
    if (!task) return;

    const normalized = onSiteAnswerInput.trim().toLowerCase();
    const isCorrect =
      task.acceptedAnswers.some((ans) => normalized.includes(ans.toLowerCase())) ||
      normalized === task.expectedPhysicalObservation.toLowerCase();

    if (isCorrect) {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#2D5A46', '#D4A359', '#34D399', '#FFF'],
      });

      const newCompleted = Array.from(new Set([...progress.completedChapters, currentChapter.number]));
      const newSolved = Array.from(new Set([...progress.solvedRiddles, checkpoint.riddle.answer]));
      const hasArtifact = progress.collectedArtifacts.some((a) => a.id === checkpoint.collectibleArtifact.id);
      const newArtifacts = hasArtifact
        ? progress.collectedArtifacts
        : [
            ...progress.collectedArtifacts,
            {
              id: checkpoint.collectibleArtifact.id,
              name: checkpoint.collectibleArtifact.name,
              description: checkpoint.collectibleArtifact.description,
              modelType: checkpoint.collectibleArtifact.modelType,
              checkpointName: checkpoint.name,
              collectedAt: new Date().toISOString(),
            },
          ];

      const nextChapterIdx = Math.min(quest.chapters.length - 1, selectedChapterIndex + 1);

      onUpdateProgress({
        ...progress,
        completedChapters: newCompleted,
        solvedRiddles: newSolved,
        collectedArtifacts: newArtifacts,
        currentChapterIndex: nextChapterIdx,
        score: progress.score + 200,
      });

      setOnSiteFeedback({
        message: `🎉 Correct on-site observation! You located "${task.expectedPhysicalObservation}". Destination "${task.unlocksDestination}" is now unlocked on your map! (+200 XP)`,
        isSuccess: true,
      });
      setOnSiteAnswerInput('');
    } else {
      setOnSiteFeedback({
        message: `❌ Not quite! Look around your immediate physical surroundings or check the signs right beside you.`,
        isSuccess: false,
      });
    }
  };

  // Browser Geolocation Verification
  const verifyRealGPS = () => {
    setIsVerifyingGps(true);
    setGpsStatusMessage('Acquiring high-accuracy GPS coordinates from device...');

    if (!navigator.geolocation) {
      setGpsStatusMessage('Geolocation is not supported by your browser.');
      setIsVerifyingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsVerifyingGps(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const distKm = calculateDistanceKm(userLat, userLng, checkpoint.lat, checkpoint.lng);
        const distMeters = Math.round(distKm * 1000);

        if (distMeters <= 200) {
          setGpsStatusMessage(`✅ GPS Verified! You are within ${distMeters}m of ${checkpoint.name}.`);
          if (!progress.verifiedCheckpoints.includes(checkpoint.id)) {
            onUpdateProgress({
              ...progress,
              verifiedCheckpoints: [...progress.verifiedCheckpoints, checkpoint.id],
            });
          }
        } else {
          setGpsStatusMessage(
            `📍 Current GPS: ${distMeters} meters away from ${checkpoint.name}. Approach closer or use Demo Mode for testing.`
          );
        }
      },
      (err) => {
        setIsVerifyingGps(false);
        setGpsStatusMessage(`Location permission denied or unavailable: ${err.message}. You can use Demo Mode below.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Clearly Labeled Demo Mode Arrival
  const simulateArrivalDemo = () => {
    setGpsStatusMessage(`🧪 [Demo Mode] Arrival simulated at ${checkpoint.name}.`);
    if (!progress.simulatedArrivals.includes(checkpoint.id)) {
      onUpdateProgress({
        ...progress,
        simulatedArrivals: [...progress.simulatedArrivals, checkpoint.id],
      });
    }
  };

  // Progressive Hint
  const handleGetHint = () => {
    const hints = checkpoint.riddle.hints;
    const nextIdx = Math.min(hints.length - 1, currentHintIndex + 1);
    setCurrentHintIndex(nextIdx);

    const hintText = hints[currentHintIndex] || hints[0];
    setFeedback({
      message: `💡 ${hintText}`,
      isSuccess: true,
    });
  };

  // Claim Cultural Fact (+50 XP) - Anti-duplicate points logic
  const handleClaimCulturalFact = () => {
    if (isFactDiscovered) return;

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#D4A359', '#2D5A46'],
    });

    const updatedFacts = [...(progress.discoveredFacts || []), checkpoint.id];
    onUpdateProgress({
      ...progress,
      discoveredFacts: updatedFacts,
      score: progress.score + 50,
    });
  };

  // Validate Riddle Answer - Anti-duplicate points logic
  const handleRiddleSubmit = () => {
    if (!riddleInput.trim()) return;

    // Prevent duplicate points if already solved
    if (isCurrentChapterSolved) {
      setFeedback({
        message: 'This chapter has already been solved! Points were previously awarded.',
        isSuccess: true,
      });
      return;
    }

    const normalized = riddleInput.trim().toLowerCase();
    const isCorrect =
      checkpoint.riddle.acceptedAnswers.some((ans) => normalized.includes(ans.toLowerCase())) ||
      normalized === checkpoint.riddle.answer.toLowerCase();

    if (isCorrect) {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#2D5A46', '#D4A359', '#34D399', '#FFF'],
      });

      const newCompleted = Array.from(new Set([...progress.completedChapters, currentChapter.number]));
      const newSolved = Array.from(new Set([...progress.solvedRiddles, checkpoint.riddle.answer]));
      const hasArtifact = progress.collectedArtifacts.some((a) => a.id === checkpoint.collectibleArtifact.id);
      const newArtifacts = hasArtifact
        ? progress.collectedArtifacts
        : [
            ...progress.collectedArtifacts,
            {
              id: checkpoint.collectibleArtifact.id,
              name: checkpoint.collectibleArtifact.name,
              description: checkpoint.collectibleArtifact.description,
              modelType: checkpoint.collectibleArtifact.modelType,
              checkpointName: checkpoint.name,
              collectedAt: new Date().toISOString(),
            },
          ];

      const nextChapterIdx = Math.min(quest.chapters.length - 1, selectedChapterIndex + 1);

      onUpdateProgress({
        ...progress,
        completedChapters: newCompleted,
        solvedRiddles: newSolved,
        collectedArtifacts: newArtifacts,
        currentChapterIndex: nextChapterIdx,
        score: progress.score + 200, // Exactly 200 points awarded once
      });

      setFeedback({
        message: `🎉 Correct! Chapter solved! Earned "${checkpoint.collectibleArtifact.name}" (+200 XP)!`,
        isSuccess: true,
      });
      setRiddleInput('');
    } else {
      setFeedback({
        message: `❌ Not quite! Consider the historical setting of Kozhikode or ask your AI Game Master for a hint.`,
        isSuccess: false,
      });
    }
  };

  // Solve Final Mystery
  const handleFinalMysterySubmit = () => {
    if (progress.finalMysterySolved) return; // Prevent duplicate points

    const normalized = finalMysteryInput.trim().toLowerCase();
    const isCorrect = quest.finalMystery.acceptedAnswers.some((ans) => normalized.includes(ans.toLowerCase()));

    if (isCorrect) {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D4A359', '#2D5A46', '#FFD700'],
      });

      onUpdateProgress({
        ...progress,
        isCompleted: true,
        finalMysterySolved: true,
        completedAt: new Date().toISOString(),
        score: progress.score + 350,
      });
      setFinalMysteryFeedback('🌟 Incredible! You have unlocked the Zamorin Vault and solved the entire mystery! (+350 XP)');
    } else {
      setFinalMysteryFeedback('❌ Incorrect spice cipher! Hint: The dried pungent berry known as "Black Gold".');
    }
  };

  const isAllChaptersCompleted = progress.completedChapters.length >= quest.chapters.length;

  return (
    <div className="content-scrollable">
      {/* Top Quest Hero Header */}
      <div className="quest-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <div className="quest-genre-badge">{quest.genre.toUpperCase()} QUEST</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4A359' }}>
            {getRankTitle(progress.score)}
          </div>
        </div>

        <h1 className="quest-hero-title">{quest.title}</h1>

        {/* Live Progress Bar */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, color: '#6A7B72', marginBottom: '3px' }}>
            <span>Quest Progression</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#E6EFEA', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${completionPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2D5A46 0%, #D4A359 100%)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        <div className="quest-badges-row">
          <div className="quest-pill-badge">
            <MapPin size={12} color="#2D5A46" />
            <span>{quest.destination}</span>
          </div>
          <div className="quest-pill-badge">
            <BarChart3 size={12} color="#D4A359" />
            <span style={{ textTransform: 'capitalize' }}>{quest.genre}</span>
          </div>
          <div className="quest-pill-badge">
            <Clock size={12} color="#2D5A46" />
            <span>{quest.estimatedDurationMins} mins</span>
          </div>
          <div className="quest-pill-badge" style={{ background: '#E8F3ED', color: '#1F5E3D', fontWeight: 800 }}>
            <Trophy size={12} />
            <span>{progress.score} XP</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTravelRewardsModal(true)}
            style={{
              background: 'linear-gradient(135deg, #1B3026 0%, #2D5A46 100%)',
              color: '#FFD700',
              border: '1px solid #D4A359',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Ticket size={12} color="#FFD700" />
            <span>🎟️ Free Travel Pass Wallet</span>
          </button>
        </div>

        <p className="quest-intro-snippet">{quest.introNarrative}</p>

        {/* Chapters Navigation Tabs */}
        <div className="chapters-nav-row">
          {quest.chapters.map((chap, idx) => {
            const isSolved = progress.completedChapters.includes(chap.number);
            const isUnlocked = idx === 0 || progress.completedChapters.includes(idx);
            const isSelected = selectedChapterIndex === idx;

            return (
              <button
                key={chap.id}
                className={`chapter-nav-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  if (isUnlocked) setSelectedChapterIndex(idx);
                }}
                disabled={!isUnlocked}
                style={{ opacity: isUnlocked ? 1 : 0.5 }}
              >
                <div className="chap-nav-title">
                  {isSolved ? (
                    <CheckCircle2 size={13} color="#2D5A46" />
                  ) : isUnlocked ? (
                    <MapPin size={13} />
                  ) : (
                    <Lock size={13} />
                  )}
                  <span>Chap {chap.number}</span>
                </div>
                <div className="chap-nav-sub">
                  {isSolved ? 'Completed' : isUnlocked ? 'Active' : 'Locked'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Interactive Leaflet Route Map Card */}
      <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '12px', border: '1.5px solid var(--color-border-card)', boxShadow: 'var(--shadow-card)', marginBottom: '14px' }}>
        <div
          onClick={() => setShowLiveMap(!showLiveMap)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '2px 4px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#1B3026' }}>
            <MapIcon size={16} color="#2D5A46" />
            <span>Interactive Live Quest Map</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#88988E' }}>
            <span>{showLiveMap ? 'Hide Map' : 'Show Map'}</span>
            {showLiveMap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {showLiveMap && (
          <div style={{ marginTop: '10px' }}>
            <RealWorldMap
              checkpoints={quest.chapters.map((c) => c.checkpoint)}
              activeCheckpointIndex={selectedChapterIndex}
              completedCheckpointIds={progress.completedChapters.map((num) => quest.chapters[num - 1]?.checkpoint.id).filter(Boolean) as string[]}
              onSelectCheckpoint={(idx) => setSelectedChapterIndex(idx)}
              routeWaypoints={quest.routeWaypoints}
              height="200px"
              showTurnByTurn={true}
            />
          </div>
        )}
      </div>

      {/* Checkpoint Detail Card with Timeline Node */}
      <div className="checkpoint-timeline-wrapper">
        <div className="timeline-line" />
        <div className="timeline-node-circle">{checkpoint.number}</div>

        <div className="checkpoint-card">
          <div className="cp-header-top">
            <div>
              <h2 className="cp-name">{checkpoint.name}</h2>
              {checkpoint.localName && <div className="cp-local-name">{checkpoint.localName}</div>}
            </div>
            <span
              className={`cp-status-pill ${isCheckpointVerified ? 'verified' : 'unvisited'}`}
            >
              {isCheckpointVerified ? 'Verified Arrived' : 'Not Visited'}
            </span>
          </div>

          <div className="cp-meta-row">
            <span>📍 {checkpoint.distanceFromStartKm} km from start</span>
            <span>⏱️ {checkpoint.estimatedMins} mins</span>
          </div>

          {/* GPS Location Verification Box */}
          <div className="gps-verification-box">
            <div className="gps-status-text">
              <Navigation size={14} color="#2D5A46" />
              <span>
                {gpsStatusMessage || 'Check in at this location using device GPS or Demo Mode.'}
              </span>
            </div>
            <div className="gps-buttons-row">
              <button className="btn-gps-check" onClick={verifyRealGPS} disabled={isVerifyingGps}>
                <span>{isVerifyingGps ? 'Locating...' : 'Verify Real GPS'}</span>
              </button>
              <button className="btn-demo-simulate" onClick={simulateArrivalDemo}>
                <span>Simulate Arrival (Demo Mode)</span>
              </button>
            </div>
          </div>

          {/* On-Site Physical Observation Scavenger Task */}
          {checkpoint.onSiteScavengerTask && (
            <div
              style={{
                margin: '12px 0',
                background: 'linear-gradient(180deg, #FDFBF7 0%, #FAF5EB 100%)',
                border: '1.5px solid #2D5A46',
                borderRadius: '14px',
                padding: '14px',
                boxShadow: '0 4px 14px rgba(45, 90, 70, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: 800, color: '#1B3026', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} color="#2D5A46" />
                  <span>On-Site Physical Observation Challenge</span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8A5200', background: '#F8E9D0', padding: '2px 8px', borderRadius: '999px' }}>
                  Unlocks {checkpoint.onSiteScavengerTask.unlocksDestination}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#3A4841', lineHeight: 1.45, marginBottom: '8px' }}>
                {checkpoint.onSiteScavengerTask.prompt}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#6A7B72', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Camera size={13} color="#2D5A46" />
                <span>Verification Task: {checkpoint.onSiteScavengerTask.photoVerificationPrompt}</span>
                {hasUploadedPhotoAtCheckpoint && (
                  <span style={{ color: '#2D5A46', fontWeight: 800 }}>[✓ Photo Attached]</span>
                )}
              </div>

              {isCurrentChapterSolved ? (
                <div style={{ background: '#E3EFE8', color: '#1F5E3D', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                  ✅ Verified On-Site Observation! Destination "{checkpoint.onSiteScavengerTask.unlocksDestination}" is now unlocked on your map.
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Name the landmark, shop, or bakery right near you..."
                      value={onSiteAnswerInput}
                      onChange={(e) => setOnSiteAnswerInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleOnSiteScavengerSubmit()}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CFD9D2', fontSize: '0.78rem' }}
                    />
                    <button
                      onClick={handleOnSiteScavengerSubmit}
                      style={{ background: '#2D5A46', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Verify & Unlock
                    </button>
                  </div>
                  {onSiteFeedback && (
                    <div style={{ marginTop: '8px', fontSize: '0.74rem', fontWeight: 600, color: onSiteFeedback.isSuccess ? '#2D5A46' : '#C0392B' }}>
                      {onSiteFeedback.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Location Photo Banner */}
          <div className="cp-photo-banner">
            <img src={checkpoint.photoUrl} alt={checkpoint.name} />
          </div>

          <p className="cp-description">{checkpoint.description}</p>

          {/* Solve the Riddle Section */}
          <div className="riddle-section">
            <div className="riddle-header-row">
              <div className="riddle-label">
                <span>🍃</span> Solve the Riddle
              </div>
              {!isCurrentChapterSolved && (
                <button className="btn-hint-pill" onClick={handleGetHint}>
                  <Lightbulb size={13} />
                  <span>Get a Hint ({currentHintIndex + 1}/3)</span>
                </button>
              )}
            </div>

            <div className="riddle-quote-box">"{checkpoint.riddle.question}"</div>

            {isCurrentChapterSolved ? (
              <div className="riddle-feedback-banner success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  ✅ <strong>Riddle Solved!</strong> Answer: "{checkpoint.riddle.answer.toUpperCase()}"
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#D9EDE2', padding: '2px 6px', borderRadius: '4px' }}>
                  +200 XP Claimed
                </span>
              </div>
            ) : (
              <>
                <div className="riddle-input-row">
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={riddleInput}
                    onChange={(e) => setRiddleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRiddleSubmit()}
                  />
                  <button className="btn-riddle-submit" onClick={handleRiddleSubmit}>
                    Submit
                  </button>
                </div>

                {feedback && (
                  <div className={`riddle-feedback-banner ${feedback.isSuccess ? 'success' : 'error'}`}>
                    {feedback.message}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Checkpoint Saved Photo Thumbnails if taken */}
          {currentCheckpointPhotos.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2D5A46', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Camera size={13} />
                <span>Your Photos at this Checkpoint ({currentCheckpointPhotos.length})</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {currentCheckpointPhotos.map((photo) => (
                  <div key={photo.id} style={{ width: '70px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D5DDD7', flexShrink: 0 }}>
                    <img src={photo.dataUrl} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Tiles Grid: Camera & 3D AR */}
          <div className="cp-actions-grid">
            <button
              className="btn-action-tile"
              onClick={() => onOpenPhotoCapture(checkpoint.id, checkpoint.name)}
            >
              <div className="action-tile-icon">
                <Camera size={16} />
              </div>
              <div className="action-tile-text">
                <span className="action-tile-title">Capture Moment</span>
                <span className="action-tile-sub">Add photo memory</span>
              </div>
            </button>

            <button
              className="btn-action-tile"
              onClick={() => onOpenARViewer(checkpoint.collectibleArtifact)}
            >
              <div className="action-tile-icon" style={{ color: '#D4A359' }}>
                <Box size={16} />
              </div>
              <div className="action-tile-text">
                <span className="action-tile-title">Explore 3D / AR</span>
                <span className="action-tile-sub">{checkpoint.collectibleArtifact.name}</span>
              </div>
            </button>
          </div>

          {/* Sourced Cultural Discovery Box */}
          <div style={{ marginTop: '14px', background: '#F8F4EC', padding: '12px', borderRadius: '12px', border: '1px solid #E8DFD3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: 700, color: '#A0722C', fontSize: '0.78rem' }}>
                📜 Sourced Cultural Fact ({checkpoint.culturalFact.category})
              </div>
              {!isFactDiscovered ? (
                <button
                  onClick={handleClaimCulturalFact}
                  style={{
                    background: '#D4A359',
                    color: '#FFF',
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <Award size={12} /> Claim +50 XP
                </button>
              ) : (
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#2D5A46', background: '#E2EFE7', padding: '2px 6px', borderRadius: '4px' }}>
                  ✓ Discovered (+50 XP)
                </span>
              )}
            </div>

            <div style={{ color: '#4A5851', lineHeight: 1.42, fontSize: '0.74rem' }}>
              {checkpoint.culturalFact.fact}
            </div>
            <div style={{ fontSize: '0.67rem', color: '#88988E', marginTop: '4px' }}>
              Source: {checkpoint.culturalFact.source}
            </div>
          </div>
        </div>
      </div>

      {/* Grand Final Mystery Section (Unlocked after all 3 chapters are solved) */}
      {isAllChaptersCompleted && (
        <div style={{ background: '#FAF6EE', border: '2px solid #D4A359', borderRadius: '18px', padding: '18px', marginBottom: '18px', boxShadow: '0 8px 30px rgba(212, 163, 89, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0722C', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={18} /> Final Mystery Challenge
          </div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#1B3026', marginBottom: '6px' }}>
            {quest.finalMystery.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#4A5851', marginBottom: '12px' }}>
            {quest.finalMystery.riddle}
          </p>

          <div className="riddle-quote-box" style={{ borderColor: '#D4A359' }}>
            "{quest.finalMystery.question}"
          </div>

          {progress.finalMysterySolved ? (
            <div style={{ background: '#E7F4ED', border: '1px solid #73BD95', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F5E3D', marginBottom: '4px' }}>
                🏆 Quest Mastered! True Treasure of Calicut Recovered!
              </div>
              <p style={{ fontSize: '0.78rem', color: '#3A634E', marginBottom: '12px' }}>
                {quest.finalMystery.resolutionLore}
              </p>
              <button
                className="btn-primary-action"
                onClick={onOpenStorybook}
                style={{ margin: '0 auto' }}
              >
                <Download size={18} />
                <span>Download Personalized Storybook PDF</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="What spice is the true treasure?..."
                value={finalMysteryInput}
                onChange={(e) => setFinalMysteryInput(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #CFD9D2', fontSize: '0.84rem' }}
              />
              <button
                onClick={handleFinalMysterySubmit}
                style={{ background: '#D4A359', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Unlock
              </button>
            </div>
          )}

          {finalMysteryFeedback && (
            <div style={{ marginTop: '10px', fontSize: '0.78rem', fontWeight: 600, color: '#2D5A46' }}>
              {finalMysteryFeedback}
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed-bottom-bar">
        {selectedChapterIndex < quest.chapters.length - 1 ? (
          <button
            className="btn-primary-action"
            onClick={() => setSelectedChapterIndex(selectedChapterIndex + 1)}
          >
            <span>Next Checkpoint</span>
            <span>→</span>
          </button>
        ) : (
          <button className="btn-primary-action" onClick={onOpenStorybook}>
            <span>View Journey Storybook</span>
            <span>📖</span>
          </button>
        )}
      </div>

      {/* Travel Rewards & Free Pass Wallet Modal */}
      {showTravelRewardsModal && (
        <TravelRewardsModal
          score={progress.score}
          onClose={() => setShowTravelRewardsModal(false)}
        />
      )}
    </div>
  );
};
