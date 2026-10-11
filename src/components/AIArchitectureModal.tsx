import React from 'react';
import { Bot, Sparkles, X, Brain, Video, ShieldCheck, Database, Layers } from 'lucide-react';

interface AIArchitectureModalProps {
  onClose: () => void;
}

export const AIArchitectureModal: React.FC<AIArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Brain size={20} color="#2D5A46" />
            <span>AI Architecture & Provenance — Wanderlore</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#3A4841' }}>
          <div style={{ background: 'linear-gradient(135deg, #EBF3EE 0%, #FAF6EE 100%)', border: '1.5px solid #2D5A46', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#2D5A46', fontSize: '0.92rem', marginBottom: '4px' }}>
              <Sparkles size={16} color="#D4A359" />
              <span>Where the AI is Made</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#4A5851' }}>
              Wanderlore combines two industry-leading AI ecosystems:
              <br />
              • <strong>Google Gemini (Google DeepMind)</strong>: The multimodal intelligence backbone powering narrative quest generation, riddle design, and reasoning.
              <br />
              • <strong>Anam AI (Anam Digital Avatar Lab)</strong>: The real-time interactive digital human avatar platform delivering low-latency WebRTC persona video streaming.
            </p>
          </div>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: '#1B3026', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={16} color="#2D5A46" /> Where All AI is Used in Wanderlore
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {/* Feature 1 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2D9CC', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontWeight: 700, color: '#2D5A46', fontSize: '0.84rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={15} color="#D4A359" /> 1. Dynamic Quest Generation
              </div>
              <p style={{ fontSize: '0.74rem', color: '#5C6B62' }}>
                Generates location-aware narrative chapters, historical riddles, and accepted answer variations tied to real Kozhikode landmarks.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2D9CC', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontWeight: 700, color: '#2D5A46', fontSize: '0.84rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={15} color="#2D5A46" /> 2. Anam Digital Avatar Guide
              </div>
              <p style={{ fontSize: '0.74rem', color: '#5C6B62' }}>
                Renders a live digital persona with facial animation, voice synthesis, and real-time WebRTC streaming from the Anam cloud.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2D9CC', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontWeight: 700, color: '#2D5A46', fontSize: '0.84rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bot size={15} color="#D4A359" /> 3. Game Master Context Engine
              </div>
              <p style={{ fontSize: '0.74rem', color: '#5C6B62' }}>
                Maintains live game state (quest, chapter, checkpoint, clues, inventory) and delivers intelligent, progressive hints without spoiling answers.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2D9CC', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontWeight: 700, color: '#2D5A46', fontSize: '0.84rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="#2D5A46" /> 4. Fact Grounding & Verification
              </div>
              <p style={{ fontSize: '0.74rem', color: '#5C6B62' }}>
                Classifies narrative elements into verified documented history, living folklore, community memoirs, and fictional mysteries.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary-action" onClick={onClose} style={{ maxWidth: '200px', margin: '0 auto' }}>
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
