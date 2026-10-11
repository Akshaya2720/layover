import { FreeTravelVoucher } from '../../shared/types.js';

export const ALL_FREE_TRAVEL_VOUCHERS: FreeTravelVoucher[] = [
  {
    id: 'voucher-auto-calicut-50',
    code: 'AUTO-CALICUT-50',
    title: '₹50 Calicut Auto-Rickshaw Ride Pass',
    fromLocation: 'Kozhikode Beach Promenade',
    toLocation: 'SM Street (Mittayi Theruvu)',
    discountAmount: '₹50 Flat Discount',
    type: 'auto_voucher',
    qrCodeData: 'WANDERLORE:AUTO:50:KOZHIKODE:BEACH-SMSTREET',
    unlockedAtScore: 200,
  },
  {
    id: 'voucher-ksrtc-heritage-bus',
    code: 'KSRTC-HERITAGE-PASS',
    title: 'Free KSRTC Heritage Local Bus Pass',
    fromLocation: 'Kozhikode Beach / South Pier',
    toLocation: 'Mananchira Square & Royal Tank',
    discountAmount: '100% Free Transit Pass',
    type: 'bus_pass',
    qrCodeData: 'WANDERLORE:BUS:FREE:KOZHIKODE:BEACH-MANANCHIRA:KSRTC',
    unlockedAtScore: 450,
  },
  {
    id: 'voucher-full-heritage-corridor',
    code: 'WANDER-CORRIDOR-PASS-2025',
    title: 'Full Kozhikode Heritage Corridor Free Travel Pass',
    fromLocation: 'Kozhikode Beach / Sea Pier',
    toLocation: 'Beypore Uru Boatyards & Marina',
    discountAmount: 'Complete Corridor Free Ride',
    type: 'full_corridor_pass',
    qrCodeData: 'WANDERLORE:VIP:CORRIDOR:KOZHIKODE:UNESCO-LITERATURE-PASS',
    unlockedAtScore: 700,
  },
  {
    id: 'voucher-grand-1000-pass',
    code: 'CALICUT-1000-FREE-ALL',
    title: '🏆 1,000 XP Grand Prize: All-Corridor Free Kozhikode Pass',
    fromLocation: 'Any City Checkpoint / Metro / Bus Terminal',
    toLocation: 'All Heritage Corridors (Beach • S.M. Street • Mananchira • Beypore)',
    discountAmount: '100% Free Complete Transit Pass',
    type: 'full_corridor_pass',
    qrCodeData: 'WANDERLORE:GRAND-PRIZE:1000-XP:FREE-CALICUT-ALL-TRANSIT:VALIDATED',
    unlockedAtScore: 1000,
  },
];

export function getUnlockedVouchers(score: number): FreeTravelVoucher[] {
  return ALL_FREE_TRAVEL_VOUCHERS.filter((v) => score >= v.unlockedAtScore);
}

export function getNextMilestone(score: number): { nextVoucher: FreeTravelVoucher | null; pointsNeeded: number } {
  const next = ALL_FREE_TRAVEL_VOUCHERS.find((v) => score < v.unlockedAtScore);
  if (!next) return { nextVoucher: null, pointsNeeded: 0 };
  return { nextVoucher: next, pointsNeeded: next.unlockedAtScore - score };
}
