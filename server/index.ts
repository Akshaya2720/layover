import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { KOZHIKODE_STORIES, PLAYABLE_KOZHIKODE_QUEST } from './services/kozhikodeStories.js';
import { createAnamSessionToken } from './services/anamService.js';
import { generateQuest, chatWithGameMaster } from './services/aiService.js';
import { geocodeLocation, planRoute } from './services/geoService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Security Headers & Force HTTPS Middleware
app.use((req, res, next) => {
  // Force HTTPS in production environments behind reverse proxies
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (process.env.NODE_ENV === 'production' && !isHttps && req.headers.host) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (isHttps) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Root route redirect to frontend client
app.get('/', (_req: Request, res: Response) => {
  res.redirect('http://localhost:5173');
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const anamConfigured = Boolean(
    process.env.ANAM_API_KEY &&
    process.env.ANAM_API_KEY !== 'YOUR_ANAM_API_KEY_HERE' &&
    process.env.ANAM_PERSONA_ID
  );
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
  );

  res.json({
    status: 'ok',
    app: 'Wanderlore Adventure API',
    locationFocus: 'Kozhikode (Calicut), Kerala, India',
    services: {
      anamAi: {
        configured: anamConfigured,
        personaId: process.env.ANAM_PERSONA_ID || 'default-guide',
        fallbackModeActive: !anamConfigured,
      },
      geminiAi: {
        configured: geminiConfigured,
        fallbackModeActive: !geminiConfigured,
      },
      pythonAi: {
        active: true,
        engine: 'Python 3.14 + Google GenAI 2.29 + Kozhikode Heritage Archive',
      },
      routing: 'OSRM + Kozhikode Waypoint Engine',
      geocoding: 'Nominatim + Kerala Landmark Cache',
    },
    totalStories: KOZHIKODE_STORIES.length,
  });
});

// Get all stories with optional filtering
app.get('/api/stories', (req: Request, res: Response) => {
  const { genre, storyType, difficulty } = req.query;
  let stories = [...KOZHIKODE_STORIES];

  if (genre && typeof genre === 'string') {
    stories = stories.filter((s) => s.genre === genre.toLowerCase());
  }
  if (storyType && typeof storyType === 'string') {
    stories = stories.filter((s) => s.storyType === storyType.toLowerCase());
  }
  if (difficulty && typeof difficulty === 'string' && difficulty !== 'all') {
    stories = stories.filter((s) => s.difficulty === difficulty.toLowerCase());
  }

  res.json({
    success: true,
    count: stories.length,
    stories,
  });
});

// Get single story
app.get('/api/stories/:id', (req: Request, res: Response) => {
  const story = KOZHIKODE_STORIES.find((s) => s.id === req.params.id);
  if (!story) {
    res.status(404).json({ success: false, message: 'Story not found' });
    return;
  }
  res.json({ success: true, story });
});

// Secure Anam Session Token generation
app.post('/api/anam/session-token', async (_req: Request, res: Response) => {
  try {
    const result = await createAnamSessionToken();
    res.json(result);
  } catch (error: any) {
    console.error('Anam session token endpoint error:', error);
    res.status(500).json({
      success: false,
      isLive: false,
      fallbackAvailable: true,
      message: 'Failed to create Anam session token. Using fallback guide.',
    });
  }
});

// AI Quest Generation
app.post('/api/ai/quest', async (req: Request, res: Response) => {
  try {
    const { genre, storyType, storyId, startLocation, destination, availableTime, difficulty, checkpointCount } = req.body;
    const quest = await generateQuest({
      genre: genre || 'mystery',
      storyType: storyType || 'real',
      storyId,
      startLocation,
      destination,
      availableTime: availableTime || '1 hour',
      difficulty: difficulty || 'medium',
      checkpointCount: checkpointCount || 3,
    });

    res.json({
      success: true,
      quest,
    });
  } catch (error: any) {
    console.error('Quest generation error:', error);
    // Guarantee playable fallback
    res.json({
      success: true,
      quest: PLAYABLE_KOZHIKODE_QUEST,
      fallback: true,
    });
  }
});

// Game Master Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, message: 'Messages array is required' });
      return;
    }

    const reply = await chatWithGameMaster(messages, context || {
      questTitle: 'The Lost Zamorin Spice Ledger',
      genre: 'mystery',
      chapterNumber: 1,
      chapterTitle: 'The First Clue at the Broken Pier',
      checkpointName: 'Kozhikode Beach Sea Pier',
      score: 100,
      collectedArtifacts: [],
      solvedRiddles: [],
      hintsRemaining: 3,
    });

    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Game master chat error:', error);
    res.json({
      success: true,
      reply: 'Listen to the sea wind, traveler! Look closely at the clues carved into the historic stone. The answer is tied to Kozhikode’s ancient maritime history.',
    });
  }
});

// Geocoding endpoint
app.get('/api/geocode', async (req: Request, res: Response) => {
  const query = req.query.q;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    return;
  }
  const result = await geocodeLocation(query);
  res.json({ success: true, location: result });
});

// Route planning endpoint
app.post('/api/routes/plan', async (req: Request, res: Response) => {
  try {
    const { startLocation, destination, availableTime, travelMode, difficulty, checkpointCount } = req.body;
    const route = await planRoute({
      startLocation: startLocation || 'Kozhikode Beach, Kozhikode',
      destination: destination || 'Mananchira Square, Kozhikode',
      availableTime: availableTime || '1 hour',
      travelMode: travelMode || 'walking',
      difficulty: difficulty || 'medium',
      checkpointCount: checkpointCount || 3,
    });

    res.json({
      success: true,
      route,
    });
  } catch (error: any) {
    console.error('Route planning error:', error);
    res.status(500).json({ success: false, message: 'Failed to plan route' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Wanderlore Backend API running at http://localhost:${PORT}`);
  console.log(`📍 Kozhikode Heritage & AI Game Master endpoints active`);
});
