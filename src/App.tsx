import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Step1Genre } from './components/Step1Genre.js';
import { Step2StoryType } from './components/Step2StoryType.js';
import { Step3StorySelect } from './components/Step3StorySelect.js';
import { Step4RoutePlan } from './components/Step4RoutePlan.js';
import { Step5QuestGame } from './components/Step5QuestGame.js';
import { AnamAvatarGuide } from './components/AnamAvatarGuide.js';
import { ARViewer3D } from './components/ARViewer3D.js';
import { PhotoCaptureModal } from './components/PhotoCaptureModal.js';
import { InventoryModal } from './components/InventoryModal.js';
import { AuthModal } from './components/AuthModal.js';
import { StorybookModal } from './components/StorybookModal.js';
import { PWAInstallPrompt } from './components/PWAInstallPrompt.js';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal.js';
import { TermsModal } from './components/TermsModal.js';
import { CookieConsentBanner } from './components/CookieConsentBanner.js';
import { AIArchitectureModal } from './components/AIArchitectureModal.js';
import { InfoModal } from './components/InfoModal.js';

import {
  Genre,
  StoryType,
  Difficulty,
  TravelMode,
  Story,
  Quest,
  UserProgress,
  UserProfile,
  CollectibleArtifact,
  PhotoMemory,
} from '../shared/types.js';
import { fetchStories, fetchQuest } from './services/api.js';
import {
  getUserProfile,
  saveQuestProgress,
  loadQuestProgress,
  getAllPhotos,
} from './services/db.js';
import { PLAYABLE_KOZHIKODE_QUEST, KOZHIKODE_STORIES, getQuestForGenre } from '../server/services/kozhikodeStories.js';

import { SupportedLanguage } from './services/translations.js';
import { Info, Shield, FileText, Sparkles, X } from 'lucide-react';

export const App: React.FC = () => {
  // Step Navigation State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Configuration Selections
  const [selectedGenre, setSelectedGenre] = useState<Genre>('mystery');
  const [selectedStoryType, setSelectedStoryType] = useState<StoryType>('real');
  const [selectedStory, setSelectedStory] = useState<Story>(KOZHIKODE_STORIES[0]);
  const [storiesList, setStoriesList] = useState<Story[]>(KOZHIKODE_STORIES);

  // Route Planning Parameters
  const [startLocation, setStartLocation] = useState<string>('Kozhikode Beach, Beach Road, Kozhikode');
  const [destination, setDestination] = useState<string>('Mananchira Square, Kozhikode');
  const [availableTime, setAvailableTime] = useState<'30 mins' | '1 hour' | '2 hours'>('1 hour');
  const [travelMode, setTravelMode] = useState<TravelMode>('walking');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [checkpointCount, setCheckpointCount] = useState<number>(3);
  const [budget, setBudget] = useState<'free' | 'auto' | 'premium'>('free');
  const [isGeneratingQuest, setIsGeneratingQuest] = useState<boolean>(false);

  // Active Playable Quest
  const [activeQuest, setActiveQuest] = useState<Quest>(PLAYABLE_KOZHIKODE_QUEST);

  // User Progress & Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questId: PLAYABLE_KOZHIKODE_QUEST.id,
    currentChapterIndex: 0,
    completedChapters: [],
    solvedRiddles: [],
    hintsUsed: {},
    verifiedCheckpoints: [],
    simulatedArrivals: [],
    collectedArtifacts: [],
    score: 100,
    photos: [],
    isCompleted: false,
  });

  // Modals Visibility
  const [showAvatarGuide, setShowAvatarGuide] = useState<boolean>(false);
  const [showARViewer, setShowARViewer] = useState<boolean>(false);
  const [inspectingArtifact, setInspectingArtifact] = useState<CollectibleArtifact | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState<boolean>(false);
  const [photoCaptureParams, setPhotoCaptureParams] = useState<{ id: string; name: string } | null>(null);
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showStorybookModal, setShowStorybookModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showAIArchitectureModal, setShowAIArchitectureModal] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Load Saved Progress on App Mount
  useEffect(() => {
    async function initSavedState() {
      // 1. Fetch available stories from backend
      try {
        const fetched = await fetchStories();
        if (fetched && fetched.length > 0) {
          setStoriesList(fetched);
        }
      } catch {
        // Fallback to local array
      }

      // 2. Check for active quest in storage
      const savedQuestId = localStorage.getItem('wanderlore_active_quest_id');
      if (savedQuestId) {
        const savedProg = await loadQuestProgress(savedQuestId);
        if (savedProg) {
          setUserProgress(savedProg);
          const allSavedPhotos = await getAllPhotos();
          if (allSavedPhotos.length > 0) {
            setUserProgress((prev) => ({ ...prev, photos: allSavedPhotos }));
          }
        }
      }
    }

    initSavedState();
  }, []);

  // Update progress helper and persist to storage
  const handleUpdateProgress = async (newProgress: UserProgress) => {
    setUserProgress(newProgress);
    await saveQuestProgress(newProgress);
  };

  // Step 4 -> 5: Generate Quest
  const handleGenerateRouteAndStartQuest = async () => {
    setIsGeneratingQuest(true);
    try {
      const generated = await fetchQuest({
        genre: selectedGenre,
        storyType: selectedStoryType,
        storyId: selectedStory.id,
        startLocation,
        destination,
        availableTime,
        difficulty,
        checkpointCount,
        budget,
      });

      if (generated) {
        setActiveQuest(generated);
        const initialProgress: UserProgress = {
          questId: generated.id,
          currentChapterIndex: 0,
          completedChapters: [],
          solvedRiddles: [],
          hintsUsed: {},
          verifiedCheckpoints: [],
          simulatedArrivals: [],
          collectedArtifacts: [],
          score: 100,
          photos: userProgress.photos || [],
          isCompleted: false,
        };
        setUserProgress(initialProgress);
        await saveQuestProgress(initialProgress);
      }
    } catch (err) {
      console.warn('[App] Using curated Kozhikode quest for genre:', err);
      const curated = getQuestForGenre(selectedGenre, selectedStory.id);
      setActiveQuest(curated);
    } finally {
      setIsGeneratingQuest(false);
      setCurrentStep(5);
    }
  };

  // Open 3D AR viewer with specific artifact
  const handleOpenARViewer = (artifact: CollectibleArtifact) => {
    setInspectingArtifact(artifact);
    setShowARViewer(true);
  };

  // Open Photo capture modal
  const handleOpenPhotoCapture = (checkpointId: string, checkpointName: string) => {
    setPhotoCaptureParams({ id: checkpointId, name: checkpointName });
    setShowPhotoCapture(true);
  };

  // Photo saved callback
  const handlePhotoSaved = (photo: PhotoMemory) => {
    const updatedPhotos = [...userProgress.photos, photo];
    handleUpdateProgress({
      ...userProgress,
      photos: updatedPhotos,
      score: userProgress.score + 50, // Reward photo capture
    });
  };

  // AR snapshot memory callback
  const handleARMemoryCaptured = (dataUrl: string) => {
    const arPhoto: PhotoMemory = {
      id: `ar_photo_${Date.now()}`,
      checkpointId: activeQuest.chapters[userProgress.currentChapterIndex]?.checkpoint.id || 'cp-1',
      checkpointName: `AR Exploration: ${inspectingArtifact?.name || 'Artifact'}`,
      dataUrl,
      caption: `3D Augmented Reality projection of ${inspectingArtifact?.name}`,
      timestamp: new Date().toISOString(),
      includeInStorybook: true,
    };
    handlePhotoSaved(arPhoto);
    setShowARViewer(false);
  };

  return (
    <div className="app-container">
      {/* Background Ambience */}
      <div className="app-bg-sketch" />

      {/* PWA Mobile Installation Banner */}
      <PWAInstallPrompt />

      {/* Top Header & 5-Step Stepper */}
      <Header
        currentStep={currentStep}
        onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
        onOpenStorybook={() => setShowStorybookModal(true)}
        onOpenProfile={() => setShowAuthModal(true)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenInfo={() => setShowInfoModal(true)}
        onOpenAvatarGuide={() => setShowAvatarGuide(!showAvatarGuide)}
        isAvatarGuideOpen={showAvatarGuide}
      />

      {/* Main Steps Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentStep === 1 && (
          <Step1Genre
            selectedGenre={selectedGenre}
            onSelectGenre={(g) => {
              setSelectedGenre(g);
              const matching = storiesList.filter((s) => s.genre === g);
              if (matching.length > 0) {
                const firstStory = matching[0];
                setSelectedStory(firstStory);
                const questForG = getQuestForGenre(g, firstStory.id);
                setStartLocation(questForG.startLocation);
                setDestination(questForG.destination);
              }
            }}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2StoryType
            selectedStoryType={selectedStoryType}
            onSelectStoryType={(t) => setSelectedStoryType(t)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3StorySelect
            stories={storiesList.filter((s) => s.genre === selectedGenre)}
            selectedStoryId={selectedStory.id}
            onSelectStory={(s) => {
              setSelectedStory(s);
              const questForS = getQuestForGenre(selectedGenre, s.id);
              setStartLocation(questForS.startLocation);
              setDestination(questForS.destination);
            }}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4RoutePlan
            selectedGenre={selectedGenre}
            selectedStoryId={selectedStory.id}
            startLocation={startLocation}
            destination={destination}
            availableTime={availableTime}
            travelMode={travelMode}
            difficulty={difficulty}
            checkpointCount={checkpointCount}
            budget={budget}
            onUpdateBudget={setBudget}
            onUpdateStartLocation={setStartLocation}
            onUpdateDestination={setDestination}
            onUpdateAvailableTime={setAvailableTime}
            onUpdateTravelMode={setTravelMode}
            onUpdateDifficulty={setDifficulty}
            onUpdateCheckpointCount={setCheckpointCount}
            onGenerateRoute={handleGenerateRouteAndStartQuest}
            isGenerating={isGeneratingQuest}
          />
        )}

        {currentStep === 5 && (
          <Step5QuestGame
            quest={activeQuest}
            progress={userProgress}
            onUpdateProgress={handleUpdateProgress}
            onOpenAvatarGuide={() => setShowAvatarGuide(true)}
            onOpenARViewer={handleOpenARViewer}
            onOpenPhotoCapture={handleOpenPhotoCapture}
            onOpenStorybook={() => setShowStorybookModal(true)}
          />
        )}
      </main>



      {/* Cookie Consent Banner */}
      <CookieConsentBanner onOpenPrivacy={() => setShowPrivacyModal(true)} />

      {/* Decorative Botanical Corner Leaves */}
      <svg className="botanical-leaf-br" viewBox="0 0 100 100" fill="none">
        <path d="M100 100C70 100 45 75 45 45C75 45 100 70 100 100Z" fill="#2D5A46" fillOpacity="0.18" />
        <path d="M100 80C80 80 65 65 65 45C85 45 100 60 100 80Z" fill="#D4A359" fillOpacity="0.15" />
      </svg>
      <svg className="botanical-leaf-bl" viewBox="0 0 100 100" fill="none">
        <path d="M0 100C30 100 55 75 55 45C25 45 0 70 0 100Z" fill="#2D5A46" fillOpacity="0.14" />
      </svg>

      {/* Anam AI Avatar Guide Widget (Persistent in bottom-right corner as shown in reference) */}
      <AnamAvatarGuide
        quest={activeQuest}
        currentChapter={activeQuest.chapters[userProgress.currentChapterIndex] || activeQuest.chapters[0]}
        score={userProgress.score}
        collectedArtifacts={userProgress.collectedArtifacts.map((a) => a.name)}
        solvedRiddles={userProgress.solvedRiddles}
        hintsRemaining={3}
        isOpen={showAvatarGuide}
        onToggleOpen={(open) => setShowAvatarGuide(open)}
        onClose={() => setShowAvatarGuide(false)}
      />

      {showARViewer && inspectingArtifact && (
        <ARViewer3D
          artifact={inspectingArtifact}
          onClose={() => setShowARViewer(false)}
          onCaptureARMemory={handleARMemoryCaptured}
        />
      )}

      {showPhotoCapture && photoCaptureParams && (
        <PhotoCaptureModal
          checkpointId={photoCaptureParams.id}
          checkpointName={photoCaptureParams.name}
          onClose={() => setShowPhotoCapture(false)}
          onPhotoSaved={handlePhotoSaved}
        />
      )}

      {showInventory && (
        <InventoryModal
          progress={userProgress}
          onClose={() => setShowInventory(false)}
          onInspectArtifact={handleOpenARViewer}
        />
      )}

      {showAuthModal && (
        <AuthModal
          userProfile={userProfile}
          onUpdateProfile={(p) => setUserProfile(p)}
          hasActiveQuest={userProgress.completedChapters.length > 0}
          onResumeQuest={() => setCurrentStep(5)}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showStorybookModal && (
        <StorybookModal
          quest={activeQuest}
          progress={userProgress}
          profile={userProfile}
          onClose={() => setShowStorybookModal(false)}
          onInspectArtifact={handleOpenARViewer}
          onUpdateProgress={handleUpdateProgress}
        />
      )}

      {showPrivacyModal && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />
      )}

      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}

      {showAIArchitectureModal && (
        <AIArchitectureModal onClose={() => setShowAIArchitectureModal(false)} />
      )}

      {showInfoModal && (
        <InfoModal
          onClose={() => setShowInfoModal(false)}
          onOpenPrivacy={() => setShowPrivacyModal(true)}
          onOpenTerms={() => setShowTermsModal(true)}
          onOpenAIArchitecture={() => setShowAIArchitectureModal(true)}
        />
      )}
    </div>
  );
};
export default App;
