import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Send,
  X,
  Sparkles,
  Wifi,
  MoreVertical,
  MessageSquare,
  Key,
  PhoneOff,
  PhoneCall,
  Code2,
  Volume2,
  VolumeX,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@anam-ai/js-sdk';
import { fetchAnamSessionToken, sendChatMessage } from '../services/api.js';
import { Quest, Chapter } from '../../shared/types.js';

interface AnamAvatarGuideProps {
  quest: Quest;
  currentChapter: Chapter;
  score: number;
  collectedArtifacts: string[];
  solvedRiddles: string[];
  hintsRemaining: number;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  onClose?: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export const AnamAvatarGuide: React.FC<AnamAvatarGuideProps> = ({
  quest,
  currentChapter,
  score,
  collectedArtifacts,
  solvedRiddles,
  hintsRemaining,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onClose,
}) => {
  // Controlled or internal expand state
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsExpanded = (open: boolean) => {
    setInternalIsOpen(open);
    if (onToggleOpen) onToggleOpen(open);
    if (!open && onClose) onClose();
  };

  // Streaming & Anam status
  const [isLiveAnam, setIsLiveAnam] = useState<boolean>(false);
  const [anamStatus, setAnamStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready to connect Anam Avatar');
  const [streamError, setStreamError] = useState<string>('');

  // UI tabs & dialogs
  const [showChatDrawer, setShowChatDrawer] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  // Call controls
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [ccActive, setCcActive] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentCaption, setCurrentCaption] = useState<string>(
    `Welcome to ${currentChapter.checkpoint.name}. I am Cara, your Anam AI guide for Kozhikode.`
  );

  // Chat conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Namaskaram explorer! I am Cara, your Anam AI Guide for "${quest.title}". You are at ${currentChapter.checkpoint.name}. Ask me about clues, riddles, or local Kozhikode history!`,
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // User configured keys - Defaulting to user's provided credentials
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_ANAM_API_KEY ||
      localStorage.getItem('wanderlore_anam_api_key') ||
      'MjBmMzM4OTQtZjUwYy00YTg0LTkyNDctMmY0ZDcyYzJiMTRmOklSUFZqRUJhNFgxZGtpc1JkVmxBTXJ3UWRGeHErdW5oT1hzTXBTY1FJWWs9'
    ).trim();
  });
  const [customPersonaId, setCustomPersonaId] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_ANAM_PERSONA_ID ||
      localStorage.getItem('wanderlore_anam_persona_id') ||
      '07be6ea2-d1ed-4032-927a-56b18fa1ab75'
    ).trim();
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const personaVideoRef = useRef<HTMLVideoElement>(null);
  const anamClientRef = useRef<any>(null);
  const isConnectingRef = useRef<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Direct Anam Stream Initializer using the user's exact JS code:
  // import { createClient } from "@anam-ai/js-sdk";
  // const client = createClient(sessionToken);
  // await client.streamToVideoElement("video");
  const startAnamStream = async () => {
    if (isConnectingRef.current || anamStatus === 'connected') return;
    isConnectingRef.current = true;
    setAnamStatus('connecting');
    setStreamError('');
    setStatusMessage('Requesting Anam session token...');

    try {
      let sessionToken = '';
      const apiKeyToUse =
        customApiKey ||
        (import.meta as any).env?.VITE_ANAM_API_KEY ||
        'MjBmMzM4OTQtZjUwYy00YTg0LTkyNDctMmY0ZDcyYzJiMTRmOklSUFZqRUJhNFgxZGtpc1JkVmxBTXJ3UWRGeHErdW5oT1hzTXBTY1FJWWs9';

      // 1. Try backend endpoint first (returns confirmed ephemeral token)
      try {
        const backendData = await fetchAnamSessionToken();
        if (backendData && backendData.isLive && backendData.sessionToken) {
          sessionToken = backendData.sessionToken;
        }
      } catch (beErr) {
        console.warn('[Anam] Backend session token fetch error:', beErr);
      }

      // 2. Direct Anam API call fallback if backend didn't return a token
      if (!sessionToken && apiKeyToUse) {
        const bodyPayload = {
          personaConfig: {
            personaId: customPersonaId || '07be6ea2-d1ed-4032-927a-56b18fa1ab75',
          },
        };

        const resp = await fetch('https://api.anam.ai/v1/auth/session-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKeyToUse}`,
          },
          body: JSON.stringify(bodyPayload),
        });

        if (resp.ok) {
          const resData = await resp.json();
          sessionToken = resData.sessionToken;
        } else {
          const errText = await resp.text();
          throw new Error(`Anam Auth failed (${resp.status}): ${errText}`);
        }
      }

      if (!sessionToken) {
        setAnamStatus('idle');
        setStatusMessage('Click Start Call to connect Anam Avatar');
        return;
      }

      // 3. User integration code:
      // const client = createClient(sessionToken);
      // await client.streamToVideoElement("video");
      setStatusMessage('Connecting WebRTC stream to <video id="video">...');
      console.log('[Anam SDK] Creating client with ephemeral session token...');
      const client = createClient(sessionToken);
      anamClientRef.current = client;

      // Stream to video element with id="video"
      await client.streamToVideoElement('video');

      // Unmute video on user gesture if needed
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(() => {});
      }

      setIsLiveAnam(true);
      setAnamStatus('connected');
      setStatusMessage('Live Anam WebRTC Stream Active');
      setCurrentCaption(`Namaskaram! I am Cara, your Anam AI guide for Kozhikode.`);
    } catch (err: any) {
      console.warn('[Anam SDK] WebRTC connection error:', err);
      setAnamStatus('error');
      setStreamError(err.message || 'Connection failed');
      setStatusMessage('Anam Stream Ready • Click to Retry');
    } finally {
      isConnectingRef.current = false;
    }
  };

  // Auto-connect on mount if key is available
  useEffect(() => {
    const hasKey = customApiKey && customApiKey !== 'YOUR_ANAM_API_KEY_HERE';
    if (hasKey) {
      startAnamStream();
    }

    return () => {
      if (anamClientRef.current) {
        try {
          anamClientRef.current.stopStreaming?.();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [customApiKey, customPersonaId]);

  // Handle Speech Output using Web Speech API (backup and companion speech)
  const speakText = (text: string) => {
    setCurrentCaption(text);
    if (isMuted) return;

    // If live Anam is active, send talk command directly to persona
    if (anamClientRef.current && isLiveAnam) {
      try {
        anamClientRef.current.talk?.(text);
        return;
      } catch (e) {
        console.warn('Failed to send talk to Anam client:', e);
      }
    }

    // Web Speech API fallback
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
        voices.find((v) => v.lang.includes('en'));
      if (englishVoice) utterance.voice = englishVoice;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Toggle Microphone / Speech Recognition
  const handleToggleMic = () => {
    if (micActive) {
      setMicActive(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message in the chat.');
      setShowChatDrawer(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setMicActive(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setMicActive(false);
      };

      recognition.onend = () => {
        setMicActive(false);
      };

      recognition.start();
    } catch {
      setMicActive(false);
      setShowChatDrawer(true);
    }
  };

  // Send Message / Query
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // If live Anam is active, send user message to live session
    if (anamClientRef.current && isLiveAnam) {
      try {
        anamClientRef.current.sendUserMessage?.(textToSend);
      } catch (e) {
        console.warn('sendUserMessage on Anam failed:', e);
      }
    }

    try {
      const reply = await sendChatMessage(
        [{ role: 'user', content: textToSend }],
        {
          questTitle: quest?.title,
          genre: quest?.genre,
          currentChapter: currentChapter?.title,
          checkpointName: currentChapter?.checkpoint?.name,
          riddleQuestion: currentChapter?.checkpoint?.riddle?.question,
          collectedArtifacts,
          solvedRiddles,
          hintsRemaining,
        }
      );

      const replyText =
        reply ||
        `At ${currentChapter?.checkpoint?.name || 'this location'}, pay close attention to your immediate physical surroundings!`;

      setMessages((prev) => [...prev, { role: 'assistant', text: replyText }]);
      speakText(replyText);
    } catch {
      const fallbackReply = `Look closely at ${currentChapter.checkpoint.name}. Look around the nearest historic landmarks!`;
      setMessages((prev) => [...prev, { role: 'assistant', text: fallbackReply }]);
      speakText(fallbackReply);
    } finally {
      setIsThinking(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSaveCustomKeys = () => {
    localStorage.setItem('wanderlore_anam_api_key', customApiKey.trim());
    localStorage.setItem('wanderlore_anam_persona_id', customPersonaId.trim());
    setShowApiKeyModal(false);
    startAnamStream();
  };

  const quickPrompts = [
    { label: '💡 Riddle Hint', query: 'Can you give me a progressive hint for the riddle at this location?' },
    { label: '🥖 Nearby Bakery', query: 'What is the famous heritage bakery or halwa store near where I am standing?' },
    { label: '🏛️ Local History', query: 'What is the real historical background of this exact checkpoint in Kozhikode?' },
    { label: '🧭 Next Direction', query: 'Which street or landmark should I walk towards for the next checkpoint?' },
  ];

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. FLOATING BUBBLE PILL (Visible when minimized)              */}
      {/* ------------------------------------------------------------- */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9998,
            background: 'rgba(11, 15, 23, 0.92)',
            border: '1.5px solid #2D5A46',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
          title="Call Anam Avatar Guide"
        >
          <PhoneCall size={22} color="#22C55E" />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isLiveAnam ? '#22C55E' : '#EAB308',
              boxShadow: isLiveAnam ? '0 0 8px #22C55E' : '0 0 8px #EAB308',
              border: '2px solid rgba(11, 15, 23, 0.92)'
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. THE PERSISTENT AVATAR CONTAINER (Morphs from bubble to call)*/}
      {/* ------------------------------------------------------------- */}
      <div
        className="anam-assistant-container"
        style={{
          position: 'fixed',
          bottom: isExpanded ? '20px' : '22px',
          right: isExpanded ? '20px' : '22px',
          width: isExpanded ? '375px' : '72px',
          maxWidth: isExpanded ? 'calc(100vw - 32px)' : '72px',
          height: isExpanded ? '590px' : '72px',
          maxHeight: isExpanded ? '88vh' : '72px',
          borderRadius: isExpanded ? '24px' : '50%',
          overflow: 'hidden',
          background: '#070A0F',
          boxShadow: isExpanded
            ? '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.12)'
            : '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 2.5px #22C55E',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          cursor: isExpanded ? 'default' : 'pointer',
        }}
        onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
      >
        {/* Main Video Layer: Permanently mounted in DOM so WebRTC never disconnects */}
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* Real Live WebRTC Video Element (Target for client.streamToVideoElement("video")) */}
          <video
            id="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'block',
              background: '#0B0F17',
            }}
          />

          {/* Secondary Persona Video Alias for backward compatibility */}
          <video
            id="persona-video"
            ref={personaVideoRef}
            autoPlay
            playsInline
            muted={isMuted}
            style={{ display: 'none' }}
          />

          {/* Fallback / Connecting Poster Animation when not live yet */}
          {!isLiveAnam && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #1E293B 0%, #0A0F18 100%)',
                color: '#FFF',
                padding: isExpanded ? '20px' : '4px',
              }}
            >
              {isExpanded ? (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      border: '2px solid #22C55E',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(30, 41, 59, 0.8)',
                    }}
                  >
                    <Sparkles size={36} color="#22C55E" />
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9' }}>
                    {anamStatus === 'connecting' ? 'Connecting Cara...' : 'Cara • Anam AI Guide'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px', maxWidth: '240px' }}>
                    {statusMessage}
                  </div>
                  {anamStatus !== 'connecting' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startAnamStream();
                      }}
                      style={{
                        marginTop: '16px',
                        background: '#22C55E',
                        color: '#0B111A',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Start Video Call</span>
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Sparkles size={20} color="#D4A359" />
                  <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                    ANAM
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Online green indicator in collapsed bubble */}
          {!isExpanded && (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#22C55E',
                border: '2px solid #0B111A',
                boxShadow: '0 0 6px #22C55E',
                zIndex: 10,
              }}
            />
          )}

          {/* --------------------------------------------------------- */}
          {/* EXPANDED VIDEO CALL OVERLAYS (Matching Reference Screenshot) */}
          {/* --------------------------------------------------------- */}
          {isExpanded && (
            <>
              {/* Top Header Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                  zIndex: 25,
                }}
              >
                {/* Back / Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                  title="Minimize Call"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Name Badge with Live Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.76rem',
                    color: '#FFF',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isLiveAnam ? '#22C55E' : '#EAB308',
                      boxShadow: isLiveAnam ? '0 0 8px #22C55E' : '0 0 8px #EAB308',
                    }}
                  />
                  <span style={{ fontWeight: 700 }}>Cara • Anam AI</span>
                  <Mic size={11} color="#A0AEC0" />
                  <Wifi size={11} color="#A0AEC0" />
                </div>

                {/* Top Action Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      color: '#38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="View Integration Code"
                  >
                    <Code2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowApiKeyModal(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Configure API Key"
                  >
                    <Key size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Self-view PiP in Top Left (Matching media_1791667338483.png) */}
              <div
                style={{
                  position: 'absolute',
                  top: '54px',
                  left: '14px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0284C7',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Y
                </div>
                <span style={{ fontSize: '0.55rem', color: '#CBD5E1', marginTop: '2px' }}>You</span>
              </div>

              {/* Closed Captions CC Banner */}
              {ccActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: showChatDrawer ? '250px' : '124px',
                    left: '14px',
                    right: '14px',
                    background: 'rgba(10, 15, 24, 0.82)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    color: '#F1F5F9',
                    backdropFilter: 'blur(8px)',
                    zIndex: 20,
                  }}
                >
                  <span style={{ color: '#38BDF8', fontWeight: 700, marginRight: '4px' }}>Cara:</span>
                  <span>{currentCaption}</span>
                </div>
              )}

              {/* Bottom Notification Banner with [Chat] button (Matching Screenshot) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: showChatDrawer ? '200px' : '68px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  zIndex: 22,
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#E2E8F0' }}>
                  Microphone ready. Speak or Chat with Cara.
                </span>
                <button
                  type="button"
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Chat
                </button>
              </div>

              {/* Slide-out Text Conversation Drawer */}
              {showChatDrawer && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '64px',
                    left: 0,
                    right: 0,
                    height: '240px',
                    background: 'rgba(11, 15, 23, 0.96)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 24,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8' }}>Chat with Cara</span>
                    <button
                      type="button"
                      onClick={() => setShowChatDrawer(false)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Quick Prompts */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '6px 10px', background: 'rgba(0,0,0,0.3)' }}>
                    {quickPrompts.map((qp, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(qp.query)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '999px',
                          padding: '3px 8px',
                          fontSize: '0.65rem',
                          color: '#E2E8F0',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>

                  {/* Messages Scroll Area */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          background: m.role === 'user' ? '#0284C7' : 'rgba(30, 41, 59, 0.85)',
                          color: '#FFF',
                        }}
                      >
                        {m.text}
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input Box */}
                  <div style={{ padding: '6px 10px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <input
                      type="text"
                      placeholder="Ask Cara about clues, bakeries, history..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: '#161B22',
                        color: '#FFF',
                        fontSize: '0.74rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isThinking}
                      style={{
                        background: '#0284C7',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: '#FFF',
                        cursor: 'pointer',
                      }}
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Call Action Toolbar (Matching media_1791667338483.png) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: 0,
                  right: 0,
                  padding: '6px 14px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                  zIndex: 23,
                }}
              >
                {/* Camera Toggle */}
                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: cameraActive ? 'rgba(255, 255, 255, 0.15)' : '#DC2626',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title={cameraActive ? 'Camera Active' : 'Camera Muted'}
                >
                  {cameraActive ? <VideoIcon size={16} /> : <VideoOff size={16} />}
                </button>

                {/* Microphone Toggle */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: micActive ? '#22C55E' : '#DC2626',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title={micActive ? 'Mic Active' : 'Muted - Click to speak'}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>

                {/* Closed Captions CC */}
                <button
                  type="button"
                  onClick={() => setCcActive(!ccActive)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: ccActive ? '#0284C7' : 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Toggle Captions"
                >
                  CC
                </button>

                {/* End Call / Minimize Button (Red round button with phone off icon) */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#DC2626',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
                  }}
                  title="End Call / Minimize"
                >
                  <PhoneOff size={16} />
                </button>

                {/* More Options / Chat Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Toggle Chat"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Bottom Sub-footer */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: '0.58rem',
                  color: '#64748B',
                  zIndex: 23,
                }}
              >
                AI can make mistakes. Check important info. • ⚡ Powered by <strong>Anam AI</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Code Integration Inspector                             */}
      {/* ------------------------------------------------------------- */}
      {showCodeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#0D1117',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '20px',
              color: '#FFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#38BDF8' }}>
                ⚡ Anam AI Integration Code
              </span>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '14px' }}>
              The exact code executed for live video streaming with persona <code>07be6ea2-d1ed-4032-927a-56b18fa1ab75</code>:
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: '#CBD5E1', fontWeight: 700, marginBottom: '6px' }}>
                JavaScript Client SDK:
              </div>
              <pre
                style={{
                  background: '#070A0F',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  color: '#34D399',
                  overflowX: 'auto',
                  border: '1px solid #1E293B',
                }}
              >
{`import { createClient } from "@anam-ai/js-sdk";

const client = createClient(sessionToken);
await client.streamToVideoElement("video");`}
              </pre>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: '#CBD5E1', fontWeight: 700, marginBottom: '6px' }}>
                Python Backend SDK:
              </div>
              <pre
                style={{
                  background: '#070A0F',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  color: '#60A5FA',
                  overflowX: 'auto',
                  border: '1px solid #1E293B',
                }}
              >
{`from anam import AnamClient

client = AnamClient(
    api_key="your-api-key",
    persona_id="07be6ea2-d1ed-4032-927a-56b18fa1ab75",
)
async with client.connect() as session:
    async for frame in session.video_frames():
        img = frame.to_ndarray(format="rgb24")`}
              </pre>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                style={{
                  background: '#0284C7',
                  color: '#FFF',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: API Key & Persona Configuration                        */}
      {/* ------------------------------------------------------------- */}
      {showApiKeyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#0D1117',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '20px',
              color: '#FFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#F1F5F9' }}>
                🔑 Configure Anam AI Credentials
              </span>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginBottom: '4px' }}>
                Anam API Key:
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#070A0F',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginBottom: '4px' }}>
                Persona ID:
              </label>
              <input
                type="text"
                value={customPersonaId}
                onChange={(e) => setCustomPersonaId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#070A0F',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'transparent',
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomKeys}
                style={{
                  background: '#22C55E',
                  color: '#0B111A',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
