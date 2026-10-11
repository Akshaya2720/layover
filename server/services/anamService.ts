import dotenv from 'dotenv';
dotenv.config();

export interface AnamSessionResult {
  success: boolean;
  sessionToken?: string;
  personaId?: string;
  isLive: boolean;
  fallbackAvailable: boolean;
  message: string;
}

/**
 * Creates a short-lived session token with the Anam API.
 * Keeps permanent ANAM_API_KEY securely on the server.
 */
export async function createAnamSessionToken(): Promise<AnamSessionResult> {
  dotenv.config();
  const apiKey = (process.env.ANAM_API_KEY || process.env.VITE_ANAM_API_KEY || '').trim();
  const personaId = (process.env.ANAM_PERSONA_ID || process.env.VITE_ANAM_PERSONA_ID || '').trim();

  if (!apiKey || apiKey === 'YOUR_ANAM_API_KEY_HERE') {
    return {
      success: false,
      isLive: false,
      fallbackAvailable: true,
      personaId: personaId || 'cara-4',
      message: 'Anam API key is not configured in .env. Fallback AI Game Master guide is active and ready with full voice and text interaction.'
    };
  }

  try {
    const targetAvatarId = personaId && personaId !== 'YOUR_ANAM_PERSONA_ID_HERE'
      ? personaId
      : '07be6ea2-d1ed-4032-927a-56b18fa1ab75';

    const requestBody = {
      personaConfig: {
        personaId: targetAvatarId,
      },
    };

    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Anam API] Session token request failed (${response.status}):`, errorText);
      return {
        success: false,
        isLive: false,
        fallbackAvailable: true,
        personaId: personaId,
        message: `Anam API responded with status ${response.status}. Using smart fallback guide.`
      };
    }

    const data = (await response.json()) as { sessionToken?: string };
    if (!data.sessionToken) {
      return {
        success: false,
        isLive: false,
        fallbackAvailable: true,
        personaId: personaId,
        message: 'No session token returned by Anam API. Fallback guide active.'
      };
    }

    return {
      success: true,
      sessionToken: data.sessionToken,
      personaId: personaId,
      isLive: true,
      fallbackAvailable: true,
      message: 'Anam session token created successfully.'
    };
  } catch (error: any) {
    console.error('[Anam API] Connection error:', error.message || error);
    return {
      success: false,
      isLive: false,
      fallbackAvailable: true,
      personaId: personaId,
      message: `Failed to connect to Anam service: ${error.message || 'Network error'}. Fallback guide ready.`
    };
  }
}
