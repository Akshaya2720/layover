import React from 'react';
import { Shield, X, Lock, Eye, Database, Smartphone } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Shield size={20} color="#2D5A46" />
            <span>Privacy Policy — Wanderlore</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#3A4841' }}>
          <div style={{ background: '#F4EFE7', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #E6DDCF' }}>
            <strong>Effective Date:</strong> October 2026 · Built for ethical, privacy-first exploration in Kozhikode, Kerala.
          </div>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            1. Location Data & Geolocation
          </h3>
          <p style={{ marginBottom: '10px' }}>
            Wanderlore uses your browser's Geolocation API strictly on-device to verify arrival within checkpoint proximity thresholds (e.g., 100–200 meters of historical landmarks). We do not record or transmit your continuous background location to external advertising brokers.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            2. Camera & Photo Memories
          </h3>
          <p style={{ marginBottom: '10px' }}>
            Camera permissions are requested only upon explicit user interaction when snapping checkpoint memories or launching Augmented Reality (AR) mode. Photographs are stored locally on your device in IndexedDB or synced to your private Supabase database instance. No images are uploaded without your direct action.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            3. AI & Data Processing
          </h3>
          <p style={{ marginBottom: '10px' }}>
            Conversations with the AI Game Master (powered by Google Gemini and Anam AI) process game context such as the active quest, current checkpoint, and riddle hints. No personal identity data is shared with third-party model training pipelines.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            4. Local Storage & Cookies
          </h3>
          <p style={{ marginBottom: '10px' }}>
            Wanderlore stores your quest progress, solved riddles, earned XP, and traveler badge locally on your device to ensure reliable offline gameplay. You can clear this data anytime by clearing your browser cache.
          </p>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button className="btn-primary-action" onClick={onClose} style={{ maxWidth: '200px', margin: '0 auto' }}>
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
