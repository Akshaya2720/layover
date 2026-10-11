import React from 'react';
import { FileText, X, AlertTriangle, Compass, Award } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} color="#2D5A46" />
            <span>Terms & Conditions — Wanderlore</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#3A4841' }}>
          <div style={{ background: '#F4EFE7', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #E6DDCF' }}>
            <strong>Agreement:</strong> By engaging with Wanderlore adventures in Kozhikode or online, you agree to these standard terms.
          </div>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            1. Outdoor Travel Safety
          </h3>
          <p style={{ marginBottom: '10px' }}>
            Wanderlore encourages real-world exploration of public landmarks (such as Kozhikode Beach, SM Street, and Mananchira Square). Users remain entirely responsible for their own personal safety, local traffic awareness, pedestrian regulations, and compliance with heritage site entry guidelines.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            2. Cultural Heritage Reverence
          </h3>
          <p style={{ marginBottom: '10px' }}>
            All historical checkpoints represent living culture and sacred spaces. Players must not deface monuments, disturb local communities, or trespass onto private properties.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            3. AI Game Master Output
          </h3>
          <p style={{ marginBottom: '10px' }}>
            The AI Game Master generates creative clues, progressive hints, and historical dialogue. Sourced facts are cross-referenced with regional archives, while fictional questlines are explicitly distinguished from verified history.
          </p>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026', marginTop: '12px', marginBottom: '6px' }}>
            4. Digital Storybook Ownership
          </h3>
          <p style={{ marginBottom: '10px' }}>
            The personalized PDF storybook generated upon completion is for your personal non-commercial keepsake and educational demonstration.
          </p>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button className="btn-primary-action" onClick={onClose} style={{ maxWidth: '200px', margin: '0 auto' }}>
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
