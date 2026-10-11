export type Genre = 'history' | 'mystery' | 'romance' | 'adventure' | 'horror' | 'fantasy';
export type StoryType = 'real' | 'fictional';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TravelMode = 'walking' | 'driving';

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  genre: Genre;
  storyType: StoryType;
  difficulty: Difficulty;
  estimatedDuration: string;
  compatibleDestination: string;
  locationTag: string;
  image: string;
  isPreview: boolean;
  previewChapters?: Array<{
    number: number;
    title: string;
    synopsis: string;
  }>;
  // Metadata for real local stories
  source?: string;
  sourceUrl?: string;
  attribution?: string;
  consentStatus?: 'verified_archive' | 'community_contributed' | 'public_domain';
  verificationStatus?: 'documented_fact' | 'verified_oral_history' | 'local_folklore';
  categoryLabel?: 'Historical Fact' | 'Living Folklore' | 'Community Memoir';
}

export interface CollectibleArtifact {
  id: string;
  name: string;
  description: string;
  modelType: 'coin' | 'compass' | 'uru_ship' | 'astrolabe' | 'palm_leaf_manuscript' | 'spice_box';
  historicSignificance: string;
  iconName?: string;
}

export interface CulturalFact {
  fact: string;
  source: string;
  sourceUrl?: string;
  category: 'History' | 'Architecture' | 'Culinary Lore' | 'Maritime Trade';
}

export interface Checkpoint {
  id: string;
  number: number;
  name: string;
  localName?: string;
  subtitle: string;
  lat: number;
  lng: number;
  distanceFromStartKm: number;
  estimatedMins: number;
  description: string;
  photoUrl: string;
  riddle: {
    question: string;
    answer: string;
    acceptedAnswers: string[];
    hints: string[];
  };
  collectibleArtifact: CollectibleArtifact;
  culturalFact: CulturalFact;
  arHint?: string;
  ar3dPrompt?: string;
  onSiteScavengerTask?: {
    prompt: string;
    expectedPhysicalObservation: string;
    acceptedAnswers: string[];
    photoVerificationPrompt: string;
    unlocksDestination: string;
    landmarkContext: string;
  };
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: 'locked' | 'active' | 'completed';
  narrativeText: string;
  unlockCondition: string;
  checkpoint: Checkpoint;
}

export interface Quest {
  id: string;
  title: string;
  genre: Genre;
  storyType: StoryType;
  storyId: string;
  destination: string;
  startLocation: string;
  introNarrative: string;
  chapters: Chapter[];
  finalMystery: {
    title: string;
    riddle: string;
    question: string;
    answer: string;
    acceptedAnswers: string[];
    hints: string[];
    resolutionLore: string;
  };
  completionRewards: {
    badge: string;
    badgeIcon: string;
    xp: number;
    title: string;
    certificateSnippet: string;
  };
  routeWaypoints: [number, number][]; // [lat, lng]
  routeDistanceKm: number;
  estimatedDurationMins: number;
}

export interface PhotoMemory {
  id: string;
  checkpointId: string;
  checkpointName: string;
  dataUrl: string; // base64 or blob url
  caption: string;
  timestamp: string;
  includeInStorybook: boolean;
}

export interface FreeTravelVoucher {
  id: string;
  code: string;
  title: string;
  fromLocation: string;
  toLocation: string;
  discountAmount: string;
  type: 'bus_pass' | 'auto_voucher' | 'full_corridor_pass';
  qrCodeData: string;
  unlockedAtScore: number;
  isRedeemed?: boolean;
}

export interface SouvenirCard {
  id: string;
  checkpointId: string;
  type: 'culinary' | 'architecture' | 'folklore' | 'stamp';
  title: string;
  content: string;
  rating?: number;
  badgeTag?: string;
}

export interface UserProgress {
  questId: string;
  currentChapterIndex: number;
  completedChapters: number[];
  solvedRiddles: string[];
  hintsUsed: Record<string, number>;
  verifiedCheckpoints: string[];
  simulatedArrivals: string[];
  collectedArtifacts: Array<{
    id: string;
    name: string;
    description: string;
    modelType: string;
    checkpointName: string;
    collectedAt: string;
  }>;
  score: number;
  photos: PhotoMemory[];
  discoveredFacts?: string[];
  isCompleted: boolean;
  finalMysterySolved?: boolean;
  completedAt?: string;
  freeTravelVouchers?: FreeTravelVoucher[];
  customDiaryNotes?: Record<string, string>;
  customSouvenirCards?: SouvenirCard[];
  selectedStickers?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  isGuest: boolean;
  avatarIcon: string;
  totalScore: number;
  badges: Array<{ id: string; name: string; earnedAt: string; icon: string }>;
  savedQuests: string[];
}

export interface AnamSessionResponse {
  sessionToken: string;
  personaId: string;
  isLive: boolean;
  fallbackAvailable: boolean;
}

export interface RoutePlanRequest {
  startLocation: string;
  destination: string;
  availableTime: '30 mins' | '1 hour' | '2 hours';
  travelMode: TravelMode;
  difficulty: Difficulty;
  checkpointCount: number;
}
