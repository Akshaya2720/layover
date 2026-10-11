import { Story, Quest, AnamSessionResponse, RoutePlanRequest } from '../../shared/types.js';

export async function fetchHealthStatus() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check failed:', err);
    return { status: 'offline', services: { anamAi: { configured: false } } };
  }
}

export async function fetchStories(genre?: string, storyType?: string, difficulty?: string): Promise<Story[]> {
  const params = new URLSearchParams();
  if (genre) params.append('genre', genre);
  if (storyType) params.append('storyType', storyType);
  if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);

  try {
    const res = await fetch(`/api/stories?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.stories || [];
  } catch (err) {
    console.warn('[API] Failed to fetch stories from backend, using fallback:', err);
    return [];
  }
}

export async function fetchRoutePlan(params: RoutePlanRequest) {
  try {
    const res = await fetch('/api/routes/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`Route plan HTTP error ${res.status}`);
    const data = await res.json();
    return data.route;
  } catch (err) {
    console.warn('[API] Failed to plan route:', err);
    throw err;
  }
}

export async function fetchQuest(payload: {
  genre: string;
  storyType: string;
  storyId?: string;
  startLocation: string;
  destination: string;
  availableTime: string;
  difficulty: string;
  checkpointCount: number;
  budget?: string;
}): Promise<Quest> {
  try {
    const res = await fetch('/api/ai/quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Quest generation error ${res.status}`);
    const data = await res.json();
    return data.quest;
  } catch (err) {
    console.warn('[API] Quest request error:', err);
    throw err;
  }
}

export async function fetchAnamSessionToken(): Promise<AnamSessionResponse> {
  try {
    const res = await fetch('/api/anam/session-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Anam token error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Anam session token fetch failed:', err);
    return {
      sessionToken: '',
      personaId: 'default-guide',
      isLive: false,
      fallbackAvailable: true,
    };
  }
}

export async function sendChatMessage(messages: Array<{ role: string; content: string }>, context: any): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });
    if (!res.ok) throw new Error(`Chat error ${res.status}`);
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('[API] Game master chat request error:', err);
    return 'The coastal wind whispers of forgotten spice vaults in Kozhikode. Continue your search at the checkpoint!';
  }
}
