import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { Quest, Genre, Difficulty, StoryType } from '../../shared/types.js';
import { PLAYABLE_KOZHIKODE_QUEST, getQuestForGenre } from './kozhikodeStories.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[AI Service] Failed to initialize GoogleGenAI client:', err);
  }
}

/**
 * Executes the Python AI Engine (FastAPI microservice or direct py script)
 */
export async function runPythonAiEngine(action: 'quest' | 'chat' | 'health', payload: any): Promise<any> {
  // 1. Try local Python FastAPI microservice if active on port 5005
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const endpoint = action === 'quest' ? '/generate-quest' : action === 'chat' ? '/chat-guide' : '/health';
    const resp = await fetch(`http://127.0.0.1:5005${endpoint}`, {
      method: action === 'health' ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: action === 'health' ? undefined : JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (resp.ok) {
      return await resp.json();
    }
  } catch {
    // Fall back to CLI execution
  }

  // 2. Direct Python process execution
  return new Promise((resolve, reject) => {
    const pyScript = path.resolve(process.cwd(), 'server', 'python_ai', 'ai_engine.py');
    const child = spawn('py', [pyScript, '--action', action], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      if (code === 0 && stdout.trim()) {
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse Python AI output: ${e}`));
        }
      } else {
        reject(new Error(`Python AI process exited with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

interface GenerateQuestParams {
  genre: Genre;
  storyType: StoryType;
  storyId?: string;
  startLocation: string;
  destination: string;
  availableTime: string;
  difficulty: Difficulty;
  checkpointCount?: number;
  budget?: string;
}

export async function generateQuest(params: GenerateQuestParams): Promise<Quest> {
  // 1. Try Python AI engine first for best real-time story generation
  try {
    const pythonQuest = await runPythonAiEngine('quest', {
      genre: params.genre,
      story_type: params.storyType,
      start_location: params.startLocation,
      destination: params.destination,
      available_time: params.availableTime,
      difficulty: params.difficulty,
      budget: params.budget || 'free',
    });
    if (pythonQuest && pythonQuest.chapters && pythonQuest.chapters.length > 0) {
      console.log('[AI Service] Successfully generated quest using Python AI Engine!');
      return pythonQuest as Quest;
    }
  } catch (pyErr) {
    console.warn('[AI Service] Python AI engine execution skipped/fell back:', pyErr);
  }

  // 2. If requesting the standard Kozhikode quest and parameters match, return verified quest
  if (
    (!params.storyId || params.storyId === 'kozhikode-spice-ledger') &&
    params.genre === 'mystery' &&
    (!params.startLocation || params.startLocation.toLowerCase().includes('kozhikode'))
  ) {
    return PLAYABLE_KOZHIKODE_QUEST;
  }

  // If Gemini API is available and custom quest is requested, attempt LLM generation
  if (aiClient) {
    try {
      const prompt = `You are the Game Master AI for Wanderlore, a location-based adventure treasure hunt in Kerala, India (specifically Kozhikode / Calicut region).
Generate a structured, playable 3-chapter quest with real historical landmarks.
Requirements:
Genre: ${params.genre}
Story Type: ${params.storyType} (distinguish real historical facts vs fictional mystery)
Start Location: ${params.startLocation || 'Kozhikode Beach'}
Destination: ${params.destination || 'Mananchira Square, Kozhikode'}
Available Time: ${params.availableTime}
Difficulty: ${params.difficulty}

Return ONLY a valid JSON object matching this schema:
{
  "id": "quest-generated-${Date.now()}",
  "title": "string",
  "genre": "${params.genre}",
  "storyType": "${params.storyType}",
  "storyId": "custom-${params.genre}",
  "destination": "${params.destination}",
  "startLocation": "${params.startLocation}",
  "introNarrative": "string",
  "routeDistanceKm": 3.2,
  "estimatedDurationMins": 55,
  "routeWaypoints": [[11.2588, 75.7686], [11.2541, 75.7765], [11.2514, 75.7808]],
  "chapters": [
    {
      "id": "chap-1",
      "number": 1,
      "title": "Chapter 1 title",
      "subtitle": "subtitle",
      "status": "active",
      "unlockCondition": "string",
      "narrativeText": "string",
      "checkpoint": {
        "id": "cp-1",
        "number": 1,
        "name": "Checkpoint 1 Name",
        "subtitle": "subtitle",
        "lat": 11.2588,
        "lng": 75.7686,
        "distanceFromStartKm": 0.8,
        "estimatedMins": 15,
        "description": "string",
        "photoUrl": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
        "riddle": {
          "question": "string riddle",
          "answer": "answer in lowercase",
          "acceptedAnswers": ["answer", "alt"],
          "hints": ["Hint 1", "Hint 2", "Hint 3"]
        },
        "collectibleArtifact": {
          "id": "artifact-1",
          "name": "Artifact Name",
          "description": "description",
          "modelType": "coin",
          "historicSignificance": "significance"
        },
        "culturalFact": {
          "fact": "Real verified historical fact",
          "source": "Documented archive or local history",
          "category": "History"
        },
        "arHint": "AR interaction hint"
      }
    },
    ... (total 3 chapters with chap-2 and chap-3 status="locked")
  ],
  "finalMystery": {
    "title": "string",
    "riddle": "string",
    "question": "string",
    "answer": "string",
    "acceptedAnswers": ["answer"],
    "hints": ["Hint 1", "Hint 2", "Hint 3"],
    "resolutionLore": "string"
  },
  "completionRewards": {
    "badge": "Badge Name",
    "badgeIcon": "🏆",
    "xp": 600,
    "title": "Honorary Title",
    "certificateSnippet": "snippet"
  }
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text) as Quest;
        if (parsed.chapters && parsed.chapters.length >= 3 && parsed.finalMystery) {
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn('[AI Service] LLM generation error, falling back to curated quest:', err.message || err);
    }
  }

  // Curated generator fallback tailored to the requested genre and locations
  return createCuratedQuest(params);
}

function createCuratedQuest(params: GenerateQuestParams): Quest {
  const baseQuest = getQuestForGenre(params.genre, params.storyId);
  const base = JSON.parse(JSON.stringify(baseQuest)) as Quest;
  base.id = `quest-${params.genre}-${Date.now()}`;
  base.genre = params.genre;
  base.storyType = params.storyType;
  
  const isDefaultStart = !params.startLocation || params.startLocation.toLowerCase().includes('kozhikode beach') || params.startLocation === 'Current Location';
  const isDefaultDest = !params.destination || params.destination.toLowerCase().includes('mananchira square');

  if (params.startLocation && params.startLocation.trim() && !isDefaultStart) {
    base.startLocation = params.startLocation;
  }
  if (params.destination && params.destination.trim() && !isDefaultDest) {
    base.destination = params.destination;
  }
  return base;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  questTitle: string;
  genre: string;
  chapterNumber: number;
  chapterTitle: string;
  checkpointName: string;
  score: number;
  collectedArtifacts: string[];
  solvedRiddles: string[];
  currentRiddle?: string;
  hintsRemaining: number;
  culturalFact?: string;
}

export async function chatWithGameMaster(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || '';

  // 1. Try Python AI engine first
  try {
    const pyResp = await runPythonAiEngine('chat', {
      message: lastUserMsg,
      context: `${context.questTitle} at ${context.checkpointName}. Riddle: ${context.currentRiddle || 'Observation'}`,
    });
    if (pyResp && pyResp.reply) {
      return pyResp.reply;
    }
  } catch (pyErr) {
    // Continue to Gemini/local fallback
  }

  // 2. If Gemini API is available, generate dynamic response
  if (aiClient) {
    try {
      const systemInstruction = `You are the AI Game Master & Avatar Guide for Wanderlore in Kozhikode (Calicut), Kerala.
You speak with warmth, cultural reverence, and engaging storytelling flair.
Current Game State Context:
- Quest: ${context.questTitle} (${context.genre})
- Current Chapter: Chapter ${context.chapterNumber}: ${context.chapterTitle}
- Current Landmark: ${context.checkpointName}
- Current Riddle: ${context.currentRiddle || 'None'}
- Player Score: ${context.score} points
- Collected Artifacts: ${context.collectedArtifacts.join(', ') || 'None yet'}
- Sourced Fact: ${context.culturalFact || 'Kozhikode is India’s first UNESCO City of Literature.'}

CRITICAL RULES:
1. Do NOT spoil the exact riddle answer immediately unless the player has asked for all 3 progressive hints.
2. Give encouraging, atmospheric hints and explain real Kozhikode cultural facts and history.
3. Keep responses concise (2 to 4 sentences), engaging, and lively for spoken avatar interaction.
4. Distinguish verified history from fiction respectfully.`;

      const contents = [
        { role: 'user' as const, parts: [{ text: `${systemInstruction}\n\nUser Question: ${lastUserMsg}` }] }
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn('[AI Service] Chat error, using contextual fallback engine:', err.message || err);
    }
  }

  // Intelligent Contextual Game Master Engine (Fallback)
  return getContextualFallbackResponse(lastUserMsg, context);
}

function getContextualFallbackResponse(query: string, context: ChatContext): string {
  const q = query.toLowerCase();

  if (q.includes('hint') || q.includes('help') || q.includes('stuck') || q.includes('clue') || q.includes('riddle')) {
    if (context.chapterNumber === 1) {
      return `Listen closely, traveler: The ancient spice merchants watched the ocean rise and fall with the moon. When it reaches its peak, wooden dhows float freely into Kozhikode harbor. What natural ocean rhythm begins with 'T'?`;
    }
    if (context.chapterNumber === 2) {
      return `Ah, breathe in the aromas of Mittayi Theruvu! Over 600 years of culinary mastery boiled in bronze urulis. The treat you seek is soft, ruby or jade-colored, and made with pure ghee. What is Kozhikode's most beloved sweet?`;
    }
    if (context.chapterNumber === 3) {
      return `You stand before the 14th-century royal reservoir of King Mana Vikrama. Look upon the freshwater tank that gave life to the Zamorin capital. Think of the lake’s royal name!`;
    }
    return `Observe your surroundings at ${context.checkpointName}. The riddle connects the geography of Kozhikode to centuries of merchant lore. Take another look at the clues!`;
  }

  if (q.includes('where') || q.includes('location') || q.includes('direction') || q.includes('go')) {
    return `You are currently exploring ${context.checkpointName}. Check your live map: keep an eye on the dashed route connecting the coastline to the historic heart of the city!`;
  }

  if (q.includes('history') || q.includes('culture') || q.includes('unesco') || q.includes('zamorin') || q.includes('story')) {
    if (context.culturalFact) {
      return `Here is a documented fact: ${context.culturalFact}`;
    }
    return `Kozhikode was known across the medieval world as the 'City of Truth' (Satya Nagaram). The Zamorin kings ruled with unyielding integrity, which is why merchant fleets from Venice, Alexandria, and Quanzhou traded here for centuries!`;
  }

  if (q.includes('artifact') || q.includes('inventory') || q.includes('badge') || q.includes('3d') || q.includes('ar')) {
    return `You have currently collected ${context.collectedArtifacts.length} rare artifacts, including ${context.collectedArtifacts.join(', ') || 'your first discovery'}. You can inspect any artifact in interactive 3D or launch AR mode to project it into your real room!`;
  }

  return `Greetings, explorer! I am your AI Game Master for ${context.questTitle}. You are at ${context.checkpointName}. Solve the current riddle to unlock Chapter ${context.chapterNumber + 1} and claim your next royal artifact!`;
}
