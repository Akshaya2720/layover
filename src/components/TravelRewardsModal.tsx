import React, { useState } from 'react';
import { Ticket, X, Award, CheckCircle2, Copy, Check, Bus, Car, ArrowRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { FreeTravelVoucher } from '../../shared/types.js';
import { ALL_FREE_TRAVEL_VOUCHERS, getUnlockedVouchers, getNextMilestone } from '../services/travelRewards.js';

interface TravelRewardsModalProps {
  score: number;
  onClose: () => void;
}

export const TravelRewardsModal: React.FC<TravelRewardsModalProps> = ({ score, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wanderlore_redeemed_vouchers') || '[]');
    } catch {
      return [];
    }
  });

  const unlocked = getUnlockedVouchers(score);
  const { nextVoucher, pointsNeeded } = getNextMilestone(score);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggleRedeem = (id: string) => {
    const updated = redeemedVouchers.includes(id)
      ? redeemedVouchers.filter((v) => v !== id)
      : [...redeemedVouchers, id];
    setRedeemedVouchers(updated);
    localStorage.setItem('wanderlore_redeemed_vouchers', JSON.stringify(updated));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '90vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Ticket size={20} color="#2D5A46" />
            <span>Travel Pass Wallet & Free Ride Rewards</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Score Overview */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1B3026 0%, #2D5A46 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(27, 48, 38, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D4A359', fontWeight: 700 }}>
                EXPEDITION MILES & REWARDS
              </span>
              <span style={{ background: 'rgba(212, 163, 89, 0.25)', border: '1px solid #D4A359', padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', color: '#FDFBF7' }}>
                {unlocked.length} of {ALL_FREE_TRAVEL_VOUCHERS.length} Passes Unlocked
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 800 }}>
                {score}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#D5DDD7' }}>XP Exploration Score</span>
            </div>

            {nextVoucher ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#DCE3DF', marginBottom: '4px' }}>
                  <span>Next: {nextVoucher.title}</span>
                  <strong>{pointsNeeded} XP needed</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, (score / nextVoucher.unlockedAtScore) * 100)}%`,
                      height: '100%',
                      background: '#D4A359',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#D4A359' }}>
                <Sparkles size={16} />
                <span>Supreme Explorer! All Kozhikode Travel Passes Unlocked.</span>
              </div>
            )}
          </div>

          {/* Real-World Travel Utility Note */}
          <div
            style={{
              background: '#F8F4EC',
              border: '1px solid #E6DEC9',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              fontSize: '0.76rem',
              color: '#4A5851',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldCheck size={18} color="#2D5A46" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#1B3026' }}>Real-World Exploration Incentive:</strong> By walking, solving riddles, and exploring historic spots in Kozhikode, your points convert into transit vouchers for free travel between checkpoints (Beach Road, SM Street, and Mananchira). Show the QR code or voucher code to participating transit providers!
            </div>
          </div>

          {/* Vouchers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ALL_FREE_TRAVEL_VOUCHERS.map((voucher) => {
              const isUnlocked = score >= voucher.unlockedAtScore;
              const isRedeemed = redeemedVouchers.includes(voucher.id);

              return (
                <div
                  key={voucher.id}
                  style={{
                    background: isUnlocked ? '#FFFFFF' : '#FAF8F3',
                    border: isUnlocked ? '1.5px solid #2D5A46' : '1px dashed #D5DDD7',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: isUnlocked ? '0 4px 16px rgba(45, 90, 70, 0.08)' : 'none',
                    opacity: isUnlocked ? 1 : 0.65,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isUnlocked ? 'rgba(45, 90, 70, 0.12)' : '#EDE7DA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2D5A46',
                        }}
                      >
                        {voucher.type === 'bus_pass' ? <Bus size={20} /> : <Car size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1B3026' }}>
                          {voucher.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6A7B72', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{voucher.fromLocation}</span>
                          <ArrowRight size={12} />
                          <span>{voucher.toLocation}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: isUnlocked ? (isRedeemed ? '#E0E7E2' : '#F7E7CD') : '#EDE7DA',
                        color: isUnlocked ? (isRedeemed ? '#556B2F' : '#8A5200') : '#889890',
                      }}
                    >
                      {isUnlocked ? (isRedeemed ? '✓ Redeemed' : voucher.discountAmount) : `Unlocks at ${voucher.unlockedAtScore} XP`}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #ECE7DC', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        {/* Coupon Code Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#6A7B72' }}>Voucher Code:</span>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.86rem',
                              background: '#F4EFE6',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #D5DDD7',
                              letterSpacing: '0.06em',
                              color: '#1B3026',
                            }}
                          >
                            {voucher.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(voucher.code)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#2D5A46',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '0.72rem',
                            }}
                          >
                            {copiedCode === voucher.code ? <Check size={14} color="#2D5A46" /> : <Copy size={14} />}
                            <span>{copiedCode === voucher.code ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {/* Mark Redeemed Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleRedeem(voucher.id)}
                          style={{
                            background: isRedeemed ? '#FFFFFF' : '#2D5A46',
                            color: isRedeemed ? '#2D5A46' : '#FFFFFF',
                            border: '1.5px solid #2D5A46',
                            borderRadius: '8px',
                            padding: '5px 12px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isRedeemed ? 'Reset Voucher' : 'Mark as Used'}
                        </button>
                      </div>

                      {/* Scannable Barcode & Verification Stub */}
                      <div
                        style={{
                          marginTop: '10px',
                          background: '#FAF8F3',
                          border: '1px dashed #D5DDD7',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ fontSize: '0.68rem', color: '#6A7B72', lineHeight: 1.35 }}>
                          <div><strong>Kozhikode Smart Transit Network</strong></div>
                          <div>Valid on Beach ⇄ SM Street ⇄ Mananchira route</div>
                        </div>

                        {/* Stylized QR Code Visual */}
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            background: '#FFFFFF',
                            border: '1px solid #1B3026',
                            borderRadius: '4px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gridTemplateRows: 'repeat(5, 1fr)',
                            padding: '3px',
                            gap: '1px',
                          }}
                          title="Transit QR Verification Code"
                        >
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                          <div />
                          <div style={{ background: '#1B3026' }} />
                          <div style={{ background: '#1B3026' }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.72rem', color: '#889890', marginTop: '8px' }}>
                      🔒 Earn {voucher.unlockedAtScore - score} more XP by solving on-site riddles to claim this free travel pass!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid #E6DEC9', padding: '12px 18px', textAlign: 'center' }}>
          <button className="btn-primary-action" onClick={onClose} style={{ width: '100%' }}>
            <span>Continue Journey & Earn More Points</span>
          </button>
        </div>
      </div>
    </div>
  );
};
