"""
Wanderlore Anam AI Client Integration
Connects to Anam via official anam Python SDK & LiveKit Anam plugin.
"""
import os
import asyncio
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

ANAM_API_KEY = os.getenv("ANAM_API_KEY", "").strip()
DEFAULT_PERSONA_ID = os.getenv("ANAM_PERSONA_ID", "07be6ea2-d1ed-4032-927a-56b18fa1ab75").strip()

try:
    from anam import AnamClient
    HAS_ANAM_SDK = True
except ImportError:
    HAS_ANAM_SDK = False

try:
    from livekit.plugins import anam as livekit_anam
    HAS_LIVEKIT_ANAM = True
except ImportError:
    HAS_LIVEKIT_ANAM = False

class AnamAvatarManager:
    def __init__(self, api_key: Optional[str] = None, persona_id: Optional[str] = None):
        self.api_key = api_key or ANAM_API_KEY
        self.persona_id = persona_id or DEFAULT_PERSONA_ID

    def get_info(self):
        return {
            "hasAnamSdk": HAS_ANAM_SDK,
            "hasLivekitAnam": HAS_LIVEKIT_ANAM,
            "personaId": self.persona_id,
            "isConfigured": bool(self.api_key and self.api_key != "YOUR_ANAM_API_KEY_HERE"),
        }

    async def stream_frames(self):
        """Streams raw video frames using anam Python SDK as specified."""
        if not HAS_ANAM_SDK or not self.api_key or self.api_key == "YOUR_ANAM_API_KEY_HERE":
            return {"status": "unconfigured", "persona_id": self.persona_id}

        client = AnamClient(
            api_key=self.api_key,
            persona_id=self.persona_id,
        )
        async with client.connect() as session:
            async for frame in session.video_frames():
                img = frame.to_ndarray(format="rgb24")
                return {"status": "streaming", "frame_shape": img.shape}

    async def start_livekit_session(self, session, room_ctx):
        """Initializes LiveKit Anam AvatarSession plugin."""
        if not HAS_LIVEKIT_ANAM:
            return None
        avatar = livekit_anam.AvatarSession(
            persona_config=livekit_anam.PersonaConfig(
                avatarId=self.persona_id,
            ),
            api_key=self.api_key,
        )
        await avatar.start(session, room=room_ctx.room)
        return avatar

avatar_manager = AnamAvatarManager()
