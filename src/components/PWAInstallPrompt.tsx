import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If standalone already, don't show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt && !isIOS) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        background: '#2D5A46',
        color: '#FFFFFF',
        borderRadius: '14px',
        padding: '10px 14px',
        zIndex: 40,
        boxShadow: '0 8px 24px rgba(45, 90, 70, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Smartphone size={20} color="#D4A359" />
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Install Wanderlore on Mobile</div>
          <div style={{ fontSize: '0.67rem', color: '#B3D4C4' }}>
            {isIOS ? 'Tap Share 📤 and "Add to Home Screen"' : 'Play full-screen offline adventure'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              background: '#D4A359',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Install App
          </button>
        )}
        <button
          onClick={() => setShowPrompt(false)}
          style={{ background: 'none', border: 'none', color: '#B3D4C4', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
