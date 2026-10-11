import React from 'react';
import { X, Shield, FileText, Cpu, MapPin, Award, ExternalLink } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAIArchitecture: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  onClose,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAIArchitecture,
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '92%', maxHeight: '85vh', overflowY: 'auto', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="#2D5A46" />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1B382B', fontFamily: 'serif' }}>
              About Wanderlore
            </h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#4A5851', lineHeight: 1.5, marginBottom: '20px' }}>
          <strong>Wanderlore</strong> transforms real-world exploration of <strong>Kozhikode (Calicut)</strong>,
          India's first UNESCO City of Literature, into an immersive narrative adventure. Explore Zamorin heritage,
          coastal spice routes, and historic markets through live GPS routing, on-site riddles, and AI storytelling.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div
            onClick={() => { onClose(); onOpenAIArchitecture(); }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(212, 163, 89, 0.12)',
              border: '1px solid #D4A359',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="#8A5200" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1B382B' }}>
                  AI Architecture & Provenance
                </div>
                <div style={{ fontSize: '0.75rem', color: '#685D4D' }}>
                  Gemini GenAI Python engine, Anam AI video persona, OSRM routing
                </div>
              </div>
            </div>
            <ExternalLink size={16} color="#8A5200" />
          </div>

          <div
            onClick={() => { onClose(); onOpenPrivacy(); }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#F7F6F2',
              border: '1px solid #E2DED6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="#2D5A46" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1B382B' }}>
                  Privacy Policy
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5C6E64' }}>
                  Location privacy, photo handling, and on-device storage
                </div>
              </div>
            </div>
            <ExternalLink size={16} color="#2D5A46" />
          </div>

          <div
            onClick={() => { onClose(); onOpenTerms(); }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#F7F6F2',
              border: '1px solid #E2DED6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#2D5A46" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1B382B' }}>
                  Terms & Conditions
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5C6E64' }}>
                  Pedestrian safety guidelines, fair play & reward terms
                </div>
              </div>
            </div>
            <ExternalLink size={16} color="#2D5A46" />
          </div>
        </div>

        <div style={{
          padding: '14px',
          borderRadius: '12px',
          background: 'rgba(45, 90, 70, 0.08)',
          border: '1px dashed #2D5A46',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
          <Award size={22} color="#2D5A46" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: '#2D5A46', lineHeight: 1.4 }}>
            <strong>1,000 XP Grand Prize:</strong> Complete checkpoints, solve on-site riddles, and capture photo memories to unlock the verified <em>Free Kozhikode Heritage Corridor Pass</em> valid across city transit!
          </div>
        </div>
      </div>
    </div>
  );
};
