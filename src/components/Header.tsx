import React from 'react';
import { ChevronLeft, MapPin, Globe, Info, User, BookOpen, Check, PhoneCall } from 'lucide-react';
import { SupportedLanguage } from '../services/translations.js';

interface HeaderProps {
  currentStep: number; // 1 to 5
  onBack: () => void;
  onOpenStorybook: () => void;
  onOpenProfile: () => void;
  onOpenAvatarGuide?: () => void;
  isAvatarGuideOpen?: boolean;
  currentLanguage?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  onOpenInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onBack,
  onOpenStorybook,
  onOpenProfile,
  onOpenAvatarGuide,
  isAvatarGuideOpen = false,
  currentLanguage = 'en',
  onSelectLanguage,
  onOpenInfo,
}) => {
  const steps = [
    { num: 1, label: 'Genre' },
    { num: 2, label: 'Story Type' },
    { num: 3, label: 'Story' },
    { num: 4, label: 'Destination' },
    { num: 5, label: 'Map & Quest' },
  ];

  return (
    <header className="header-wrapper">
      {/* Top Bar */}
      <div className="header-top">
        <button
          className="header-btn"
          onClick={onBack}
          disabled={currentStep === 1}
          style={{ opacity: currentStep === 1 ? 0.4 : 1, cursor: currentStep === 1 ? 'default' : 'pointer' }}
          aria-label="Go Back"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="brand-center">
          <div className="brand-title-row">
            <MapPin size={22} className="brand-logo-pin" fill="#2D5A46" color="#2D5A46" />
            <span className="brand-name">Wanderlore🍃</span>
          </div>
          <span className="brand-tagline">Kozhikode UNESCO City of Literature</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Quick Language Switcher */}
          {onSelectLanguage && (
            <div
              style={{
                display: 'flex',
                background: '#EAE6DF',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid #D5DDD7',
              }}
              title="Change Language"
            >
              {(['en', 'ml', 'hi'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLanguage(l)}
                  style={{
                    background: currentLanguage === l ? '#2D5A46' : 'transparent',
                    color: currentLanguage === l ? '#FFF' : '#4A5851',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {l === 'en' ? 'EN' : l === 'ml' ? 'മല' : 'हिं'}
                </button>
              ))}
            </div>
          )}

          {/* Small Call Symbol for Anam Avatar Assistant at the Top */}
          {onOpenAvatarGuide && (
            <button
              className={`header-btn ${isAvatarGuideOpen ? 'active' : ''}`}
              onClick={onOpenAvatarGuide}
              title="Call Anam AI Avatar Guide (Cara)"
              aria-label="Call Assistant"
              style={{
                background: isAvatarGuideOpen ? '#15803D' : '#F0FDF4',
                borderColor: '#22C55E',
                color: isAvatarGuideOpen ? '#FFFFFF' : '#166534',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 10px',
                width: 'auto',
                fontWeight: 700,
                fontSize: '0.72rem',
                boxShadow: isAvatarGuideOpen ? '0 0 12px rgba(34, 197, 94, 0.5)' : 'none',
              }}
            >
              <PhoneCall size={15} color={isAvatarGuideOpen ? '#FFFFFF' : '#16A34A'} />
              <span>Call Guide</span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 6px #22C55E',
                  border: '1px solid #FFFFFF',
                }}
              />
            </button>
          )}

          {onOpenInfo && (
            <button
              className="header-btn"
              onClick={onOpenInfo}
              title="About & Terms"
              aria-label="Info & Compliance"
            >
              <Info size={16} />
            </button>
          )}

          <button
            className="header-btn"
            onClick={onOpenProfile}
            title="Traveler Profile & Account"
            aria-label="Profile"
          >
            <User size={18} />
          </button>
          <button
            className="header-btn"
            onClick={onOpenStorybook}
            title="Digital Storybook & Saved Journeys"
            aria-label="Storybook"
          >
            <BookOpen size={18} />
          </button>
        </div>
      </div>

      {/* 5-Step Progress Stepper */}
      <div className="stepper-container">
        {steps.map((step, idx) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;

          return (
            <React.Fragment key={step.num}>
              <div className="stepper-item">
                <div className={`stepper-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? <Check size={14} color="#FFF" /> : step.num}
                </div>
                <span className={`stepper-label ${isActive ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    background: step.num < currentStep ? '#2D5A46' : '#DFE5E1',
                    margin: '0 2px 18px',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
};
