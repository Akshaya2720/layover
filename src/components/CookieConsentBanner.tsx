import React, { useState, useEffect } from 'react';
import { Cookie, Check, Shield } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('wanderlore_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wanderlore_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '800px',
        background: '#FFFFFF',
        border: '1.5px solid #2D5A46',
        borderRadius: '16px',
        padding: '12px 18px',
        boxShadow: '0 12px 36px rgba(45, 90, 70, 0.2)',
        zIndex: 45,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'slide-up 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EBF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Cookie size={18} color="#2D5A46" />
        </div>
        <div style={{ fontSize: '0.78rem', color: '#3A4841', lineHeight: 1.4 }}>
          <strong>Wanderlore uses local storage and cookies</strong> to save your quest progress, riddle solutions, and captured photos on this device.{' '}
          <button
            onClick={onOpenPrivacy}
            style={{ background: 'none', border: 'none', color: '#2D5A46', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 700 }}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleAccept}
          style={{
            background: '#2D5A46',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Check size={14} /> Accept & Continue
        </button>
      </div>
    </div>
  );
};
