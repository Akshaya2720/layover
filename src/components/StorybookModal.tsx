import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  X,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  Box,
  Edit3,
  Plus,
  Trash2,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Star,
} from 'lucide-react';
import { Quest, UserProgress, UserProfile, CollectibleArtifact, SouvenirCard } from '../../shared/types.js';
import { generateStorybookPdf } from '../services/StorybookPdfService.js';
import { ALL_FREE_TRAVEL_VOUCHERS, getUnlockedVouchers } from '../services/travelRewards.js';

interface StorybookModalProps {
  quest: Quest;
  progress: UserProgress;
  profile: UserProfile;
  onClose: () => void;
  onInspectArtifact?: (artifact: CollectibleArtifact) => void;
  onUpdateProgress?: (progress: UserProgress) => void;
}

export const StorybookModal: React.FC<StorybookModalProps> = ({
  quest,
  progress,
  profile,
  onClose,
  onInspectArtifact,
  onUpdateProgress,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0: Cover, 1: Ch1, 2: Ch2, 3: Ch3, 4: Pass & Certificate
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Local state for diary notes and cards to allow real-time editing
  const [diaryNotes, setDiaryNotes] = useState<Record<string, string>>(
    progress.customDiaryNotes || {
      'cp-1': 'Stood by the 1862 sea pier on Beach Road. Smelled the sea breeze and saw Bombay Hotel across the avenue!',
      'cp-2': 'Walked through Mittayi Theruvu (SM Street). The aroma of hot ghee and freshly boiled halwa was unforgettable.',
      'cp-3': 'Entered Mananchira Square through the laterite stone gateway. The royal tank still mirrors the evening sky.',
    }
  );

  const [souvenirCards, setSouvenirCards] = useState<SouvenirCard[]>(
    progress.customSouvenirCards || [
      {
        id: 'card-1',
        checkpointId: 'cp-2',
        type: 'culinary',
        title: 'Kozhikodan Halwa Tasting Card',
        content: 'Sampled classic black halwa (karuppu halwa) cooked in bronze urulis at Sankaran Bakery. Rating: 5/5 Stars.',
        rating: 5,
      },
      {
        id: 'card-2',
        checkpointId: 'cp-3',
        type: 'architecture',
        title: 'Mananchira Royal Laterite Masonry',
        content: '14th-century red laterite perimeter pillars carved under King Mana Vikrama without cement mortar.',
        rating: 5,
      },
    ]
  );

  const [newCardTitle, setNewCardTitle] = useState<string>('');
  const [newCardContent, setNewCardContent] = useState<string>('');
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);

  // Save changes to parent progress
  const saveCustomizations = (updatedNotes: Record<string, string>, updatedCards: SouvenirCard[]) => {
    if (onUpdateProgress) {
      onUpdateProgress({
        ...progress,
        customDiaryNotes: updatedNotes,
        customSouvenirCards: updatedCards,
      });
    }
  };

  const handleUpdateNote = (cpId: string, text: string) => {
    const updated = { ...diaryNotes, [cpId]: text };
    setDiaryNotes(updated);
    saveCustomizations(updated, souvenirCards);
  };

  const handleAddCard = (cpId: string) => {
    if (!newCardTitle.trim()) return;
    const newCard: SouvenirCard = {
      id: `card_${Date.now()}`,
      checkpointId: cpId,
      type: 'culinary',
      title: newCardTitle,
      content: newCardContent || 'Traveler observation recorded in Kozhikode.',
      rating: 5,
    };
    const updated = [...souvenirCards, newCard];
    setSouvenirCards(updated);
    setNewCardTitle('');
    setNewCardContent('');
    setShowAddCardModal(false);
    saveCustomizations(diaryNotes, updated);
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = souvenirCards.filter((c) => c.id !== cardId);
    setSouvenirCards(updated);
    saveCustomizations(diaryNotes, updated);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const updatedProgress: UserProgress = {
        ...progress,
        customDiaryNotes: diaryNotes,
        customSouvenirCards: souvenirCards,
        freeTravelVouchers: getUnlockedVouchers(progress.score),
      };
      await generateStorybookPdf(quest, updatedProgress, profile);
    } catch (err) {
      console.error('[Storybook] PDF Generation error:', err);
      alert('Unable to generate PDF. Your storybook progress remains safely stored in local memory.');
    } finally {
      setIsExporting(false);
    }
  };

  const unlockedPasses = getUnlockedVouchers(progress.score);
  const totalPages = 5; // Cover, 3 Checkpoints, Pass & Certificate

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', maxHeight: '92vh', padding: 0 }}>
        {/* Book Header Bar */}
        <div className="modal-header" style={{ padding: '14px 20px', background: '#F5EFE3', borderBottom: '1.5px solid #2D5A46' }}>
          <div className="modal-title">
            <BookOpen size={20} color="#2D5A46" />
            <span>Memory Book Studio: {quest.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="btn-primary-action"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <Download size={15} />
              <span>{isExporting ? 'Generating PDF...' : 'Download Book (PDF)'}</span>
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Page Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#FAF6EF',
            borderBottom: '1px solid #E6DEC9',
            overflowX: 'auto',
            padding: '4px 12px',
            gap: '6px',
          }}
        >
          {['📖 Cover', '📍 Chapter 1 (Beach)', '📍 Chapter 2 (SM Street)', '📍 Chapter 3 (Mananchira)', '🏆 Travel Pass & Mystery'].map((title, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPageIndex(idx)}
              style={{
                background: currentPageIndex === idx ? '#2D5A46' : 'transparent',
                color: currentPageIndex === idx ? '#FFFFFF' : '#4A5851',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </button>
          ))}
        </div>

        {/* Book Container (Open Book Simulation) */}
        <div
          style={{
            padding: '20px',
            background: 'radial-gradient(ellipse at center, #FDFBF7 0%, #F5EFE3 100%)',
            minHeight: '440px',
            overflowY: 'auto',
            maxHeight: '68vh',
          }}
        >
          {/* PAGE 0: COVER & EXPEDITION OVERVIEW */}
          {currentPageIndex === 0 && (
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #2D5A46',
                borderRadius: '16px',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(45, 90, 70, 0.12)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', fontWeight: 800, color: '#2D5A46', textTransform: 'uppercase', marginBottom: '6px' }}>
                OFFICIAL HERITAGE MEMORY ALBUM · KOZHIKODE
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#1B3026', marginBottom: '8px' }}>
                {quest.title}
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#8A5200', fontWeight: 700, marginBottom: '16px' }}>
                A {quest.genre.toUpperCase()} ADVENTURE · {quest.storyType === 'real' ? 'VERIFIED LOCAL HISTORY' : 'AI FICTION'}
              </div>

              {/* Decorative Seal */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  border: '2px solid #D4A359',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FDFBF7',
                }}
              >
                <Award size={26} color="#2D5A46" />
                <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#D4A359', letterSpacing: '0.05em' }}>ZAMORIN SEAL</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F8F4EC', padding: '8px 16px', borderRadius: '999px', fontSize: '0.78rem', color: '#3A4841', marginBottom: '14px' }}>
                <Calendar size={14} color="#2D5A46" />
                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>Traveler: <strong>{profile.username}</strong></span>
                <span>•</span>
                <span style={{ color: '#2D5A46', fontWeight: 800 }}>{progress.score} XP Earned</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#556B2F', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
                {quest.introNarrative}
              </p>
            </div>
          )}

          {/* PAGES 1, 2, 3: CHAPTERS MEMORIES, ON-SITE TASKS & CUSTOM DIARY */}
          {currentPageIndex >= 1 && currentPageIndex <= 3 && (() => {
            const chap = quest.chapters[currentPageIndex - 1];
            if (!chap) return null;
            const cp = chap.checkpoint;
            const currentPhotos = progress.photos.filter((p) => p.checkpointId === cp.id);
            const cpCards = souvenirCards.filter((c) => c.checkpointId === cp.id);
            const diaryText = diaryNotes[cp.id] || '';

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Left Page: Narrative, On-site Scavenger Task & Sourced Fact */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #2D5A46',
                    borderRadius: '14px',
                    padding: '18px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8A5200', textTransform: 'uppercase' }}>
                      CHAPTER {chap.number}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2D5A46', fontWeight: 700 }}>
                      📍 {cp.name}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#1B3026', marginBottom: '8px' }}>
                    {chap.title}
                  </h3>

                  <p style={{ fontSize: '0.78rem', color: '#4A5851', lineHeight: 1.5, marginBottom: '12px' }}>
                    {chap.narrativeText}
                  </p>

                  {/* On-Site Scavenger Challenge Box */}
                  {cp.onSiteScavengerTask && (
                    <div
                      style={{
                        background: '#FAF6EE',
                        border: '1px solid #E6DEC9',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        marginBottom: '12px',
                        fontSize: '0.74rem',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#1B3026', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#2D5A46" />
                        <span>On-Site Observation Task:</span>
                      </div>
                      <div style={{ color: '#4A5851', fontStyle: 'italic', marginBottom: '4px' }}>
                        "{cp.onSiteScavengerTask.prompt}"
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#2D5A46', fontWeight: 700 }}>
                        ✓ Solved Observation: {cp.onSiteScavengerTask.expectedPhysicalObservation}
                      </div>
                    </div>
                  )}

                  {/* Sourced Cultural Fact */}
                  <div
                    style={{
                      background: '#EBF3EF',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '0.72rem',
                      color: '#2D5A46',
                      lineHeight: 1.4,
                    }}
                  >
                    <strong>Verified Heritage Fact ({cp.culturalFact.category}):</strong> {cp.culturalFact.fact}
                  </div>
                </div>

                {/* Right Page: Personal Diary Reflection, Souvenir Cards & Photo */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #2D5A46',
                    borderRadius: '14px',
                    padding: '18px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Personal Diary Reflection Section */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1B3026', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={13} color="#2D5A46" />
                        <span>Personal Diary Note & Thoughts</span>
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#8A5200' }}>Editable</span>
                    </div>

                    <textarea
                      value={diaryText}
                      onChange={(e) => handleUpdateNote(cp.id, e.target.value)}
                      placeholder="Write your personal memories, impressions, or stories of visiting this place..."
                      style={{
                        width: '100%',
                        height: '75px',
                        background: '#FDFBF7',
                        border: '1px solid #D5DDD7',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '0.75rem',
                        fontFamily: 'inherit',
                        color: '#1B3026',
                        resize: 'none',
                        lineHeight: 1.4,
                      }}
                    />
                  </div>

                  {/* Checkpoint Photo Preview */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1B3026', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Camera size={13} color="#2D5A46" />
                      <span>Checkpoint Memory Photo</span>
                    </div>

                    {currentPhotos.length > 0 ? (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#F8F4EC', padding: '8px', borderRadius: '10px' }}>
                        <img
                          src={currentPhotos[0].dataUrl}
                          alt="Checkpoint photo"
                          style={{ width: '70px', height: '54px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ fontSize: '0.72rem', color: '#3A4841' }}>
                          <div style={{ fontWeight: 700 }}>{currentPhotos[0].caption || 'Exploration photo'}</div>
                          <div style={{ fontSize: '0.66rem', color: '#6A7B72' }}>Will be included on Page 3 of the final PDF book.</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: '#889890', background: '#FAF6EE', padding: '8px 12px', borderRadius: '8px' }}>
                        📷 No photo captured yet at this stop. Use "Add Memory Photo" during the quest to include it!
                      </div>
                    )}
                  </div>

                  {/* Souvenir Cards */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1B3026' }}>
                        Souvenir Cards ({cpCards.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddCardModal(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2D5A46',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <Plus size={13} />
                        <span>Add Card</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cpCards.map((card) => (
                        <div
                          key={card.id}
                          style={{
                            background: '#FAF8F3',
                            border: '1px solid #D4A359',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '0.72rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: '#8A5200' }}>{card.title}</div>
                            <div style={{ color: '#4A5851', fontSize: '0.68rem' }}>{card.content}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PAGE 4: ARTIFACTS, FREE TRAVEL PASS & FINAL RESOLUTION */}
          {currentPageIndex === 4 && (
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #2D5A46',
                borderRadius: '16px',
                padding: '22px 18px',
                boxShadow: '0 8px 32px rgba(45, 90, 70, 0.1)',
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1B3026', textAlign: 'center', marginBottom: '6px' }}>
                Expedition Rewards & Free Travel Pass
              </h2>
              <div style={{ textAlign: 'center', fontSize: '0.76rem', color: '#6A7B72', marginBottom: '18px' }}>
                Official Board of Heritage Keepers · City of Literature Calicut
              </div>

              {/* Free Travel Pass Voucher Box */}
              <div
                style={{
                  background: '#FDFBF7',
                  border: '2px dashed #2D5A46',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Ticket size={18} color="#2D5A46" />
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1B3026' }}>
                      Official Kozhikode Free Transit Pass
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#4A5851' }}>
                    Valid on: <strong>Beach Road ⇄ SM Street ⇄ Mananchira Square</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8A5200', marginTop: '2px' }}>
                    Pass Voucher Code: <code>WANDER-CALICUT-FREEPASS-{progress.score}XP</code>
                  </div>
                </div>

                <div
                  style={{
                    background: '#2D5A46',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  <div>{unlockedPasses[0]?.discountAmount || 'Free Ride Pass'}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>Scan in Final PDF</div>
                </div>
              </div>

              {/* Final Mystery Lore */}
              <div style={{ background: '#FAF6EE', border: '1px solid #E6DEC9', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: '#1B3026', marginBottom: '6px' }}>
                  The True Treasure of Kozhikode Revealed
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#4A5851', lineHeight: 1.5 }}>
                  {quest.finalMystery.resolutionLore}
                </p>
              </div>

              {/* Download Action Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="btn-primary-action"
                style={{ width: '100%', padding: '12px' }}
              >
                <Download size={18} />
                <span>{isExporting ? 'Generating Official PDF Memory Book...' : 'Download Complete Digital Memory Book (PDF)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Page Flipping Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            background: '#F5EFE3',
            borderTop: '1px solid #E6DEC9',
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D5DDD7',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#2D5A46',
              cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPageIndex === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ChevronLeft size={14} />
            <span>Previous Page</span>
          </button>

          <span style={{ fontSize: '0.74rem', color: '#6A7B72', fontWeight: 600 }}>
            Page {currentPageIndex + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === totalPages - 1}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D5DDD7',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#2D5A46',
              cursor: currentPageIndex === totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPageIndex === totalPages - 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Next Page</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Quick Add Souvenir Card Sub-Modal */}
        {showAddCardModal && (
          <div className="modal-overlay" onClick={() => setShowAddCardModal(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <div className="modal-header">
                <div className="modal-title">
                  <Plus size={18} color="#2D5A46" />
                  <span>Add Souvenir Card</span>
                </div>
                <button className="modal-close-btn" onClick={() => setShowAddCardModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1B3026' }}>Card Title:</label>
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="e.g., Sulaimani Tea Tasting Note"
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5DDD7', fontSize: '0.78rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1B3026' }}>Card Content & Thoughts:</label>
                  <textarea
                    value={newCardContent}
                    onChange={(e) => setNewCardContent(e.target.value)}
                    placeholder="Details about flavor, craftsman, architecture, or impression..."
                    style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #D5DDD7', fontSize: '0.78rem', resize: 'none' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '10px 16px' }}>
                <button
                  className="btn-primary-action"
                  onClick={() => handleAddCard(quest.chapters[currentPageIndex - 1]?.checkpoint.id || 'cp-1')}
                  style={{ width: '100%' }}
                >
                  <span>Attach to Memory Page</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
