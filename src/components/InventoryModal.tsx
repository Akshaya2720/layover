import React from 'react';
import { Backpack, Sparkles, Award, Camera, X, Box } from 'lucide-react';
import { UserProgress } from '../../shared/types.js';

interface InventoryModalProps {
  progress: UserProgress;
  onClose: () => void;
  onInspectArtifact: (artifact: any) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  progress,
  onClose,
  onInspectArtifact,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Backpack size={20} color="#2D5A46" />
            <span>Explorer's Pouch & Trophies</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: '#F4EFE7', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E6DDCF' }}>
              <div style={{ fontSize: '0.68rem', color: '#7E8E85', fontWeight: 600 }}>TOTAL SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2D5A46' }}>{progress.score} XP</div>
            </div>
            <div style={{ flex: 1, background: '#F4EFE7', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E6DDCF' }}>
              <div style={{ fontSize: '0.68rem', color: '#7E8E85', fontWeight: 600 }}>ARTIFACTS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D4A359' }}>{progress.collectedArtifacts.length}</div>
            </div>
            <div style={{ flex: 1, background: '#F4EFE7', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E6DDCF' }}>
              <div style={{ fontSize: '0.68rem', color: '#7E8E85', fontWeight: 600 }}>MEMORIES</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2D5A46' }}>{progress.photos.length}</div>
            </div>
          </div>

          {/* Section: Collected 3D Artifacts */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', color: '#1B3026', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box size={16} color="#D4A359" /> Collected Artifacts (Interactive 3D / AR)
            </h4>
            {progress.collectedArtifacts.length === 0 ? (
              <div style={{ padding: '14px', background: '#FAF7F0', borderRadius: '12px', textAlign: 'center', fontSize: '0.78rem', color: '#88988E' }}>
                Solve chapter riddles to collect historical 3D artifacts from Kozhikode!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {progress.collectedArtifacts.map((art, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onInspectArtifact(art);
                      onClose();
                    }}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #DFD7CA',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1B3026' }}>{art.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#6A7A71' }}>Found at: {art.checkpointName}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D4A359', background: '#FBF5EB', padding: '4px 8px', borderRadius: '9999px', border: '1px solid #ECD9BD' }}>
                      Inspect in 3D / AR →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Photo Memories */}
          {progress.photos.length > 0 && (
            <div>
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', color: '#1B3026', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={16} color="#2D5A46" /> Checkpoint Photo Memories ({progress.photos.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {progress.photos.map((p, idx) => (
                  <div key={idx} style={{ borderRadius: '10px', overflow: 'hidden', height: '80px', position: 'relative', border: '1px solid #D5DDD7' }}>
                    <img src={p.dataUrl} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
