import React, { useState } from 'react';
import { User, Key, Check, LogOut, X, Compass } from 'lucide-react';
import { UserProfile } from '../../shared/types.js';
import { saveUserProfile } from '../services/db.js';

interface AuthModalProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResumeQuest?: () => void;
  hasActiveQuest?: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  userProfile,
  onUpdateProfile,
  onResumeQuest,
  hasActiveQuest,
  onClose,
}) => {
  const [usernameInput, setUsernameInput] = useState<string>(userProfile.username);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const handleSaveProfile = () => {
    if (!usernameInput.trim()) return;
    const updated: UserProfile = {
      ...userProfile,
      username: usernameInput.trim(),
      isGuest: false,
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  const handleGuestQuickStart = () => {
    const guest: UserProfile = {
      ...userProfile,
      username: 'Guest Explorer',
      isGuest: true,
    };
    saveUserProfile(guest);
    onUpdateProfile(guest);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={18} color="#2D5A46" />
            <span>Traveler Passport & Account</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Active Status Badge */}
          <div style={{ background: '#F4EFE7', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #E6DDCF' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2D5A46', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              {userProfile.avatarIcon || '🧭'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1B3026' }}>{userProfile.username}</div>
              <div style={{ fontSize: '0.72rem', color: userProfile.isGuest ? '#A0722C' : '#2D5A46', fontWeight: 600 }}>
                {userProfile.isGuest ? '⚡ Guest Pass Active (No registration needed)' : '✅ Registered Explorer'}
              </div>
            </div>
          </div>

          {/* Resume unfinished quest option */}
          {hasActiveQuest && onResumeQuest && (
            <div style={{ background: '#EAF3EE', border: '1.5px solid #99D1B2', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E5338', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Compass size={16} /> Unfinished Quest Found!
              </div>
              <p style={{ fontSize: '0.75rem', color: '#3A634E', marginBottom: '8px' }}>
                You have an active Kozhikode adventure saved locally. Would you like to resume your progress?
              </p>
              <button
                onClick={() => {
                  onResumeQuest();
                  onClose();
                }}
                style={{
                  background: '#2D5A46',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Resume Active Quest →
              </button>
            </div>
          )}

          {/* Account Form */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1B3026', display: 'block', marginBottom: '4px' }}>
              Traveler Nickname / Name for Storybook Certificate
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #CFD9D2',
                fontSize: '0.85rem',
                outline: 'none',
                marginBottom: '10px',
              }}
            />

            {isLoginMode && (
              <>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1B3026', display: 'block', marginBottom: '4px' }}>
                  Passkey / Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CFD9D2',
                    fontSize: '0.85rem',
                    outline: 'none',
                    marginBottom: '10px',
                  }}
                />
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleSaveProfile}
              className="btn-primary-action"
              style={{ width: '100%', padding: '10px' }}
            >
              <Check size={16} /> Save Traveler Profile
            </button>

            <button
              onClick={handleGuestQuickStart}
              style={{
                background: '#F0ECE4',
                color: '#2D5A46',
                border: 'none',
                padding: '10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Continue as Guest (Instant Access)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
