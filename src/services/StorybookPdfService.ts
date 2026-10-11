import { jsPDF } from 'jspdf';
import { Quest, UserProgress, UserProfile } from '../../shared/types.js';

export async function generateStorybookPdf(
  quest: Quest,
  progress: UserProgress,
  profile: UserProfile
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // --- PAGE 1: COVER PAGE ---
  doc.setFillColor(251, 248, 241); // #FBF8F1 parchment
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Border
  doc.setDrawColor(45, 90, 70); // #2D5A46 forest green
  doc.setLineWidth(1.5);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - margin * 2 + 8);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);

  // App Header
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(45, 90, 70);
  doc.text('WANDERLORE', pageWidth / 2, 45, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(120, 140, 130);
  doc.text('Real Places · Imagined Stories', pageWidth / 2, 52, { align: 'center' });

  // Quest Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(27, 48, 38);
  const splitTitle = doc.splitTextToSize(quest.title.toUpperCase(), contentWidth - 20);
  doc.text(splitTitle, pageWidth / 2, 85, { align: 'center' });

  // Subtitle / Location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(160, 115, 55); // Amber gold
  doc.text(`A ${quest.genre.toUpperCase()} ADVENTURE IN KOZHIKODE, KERALA`, pageWidth / 2, 105, { align: 'center' });
  doc.text(`Story Type: ${quest.storyType === 'real' ? 'Verified Local History & Lore' : 'AI-Crafted Fiction'}`, pageWidth / 2, 112, { align: 'center' });

  // Decorative Seal
  doc.setDrawColor(212, 163, 89);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, 145, 20);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(45, 90, 70);
  doc.text('OFFICIAL CHRONICLE', pageWidth / 2, 143, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(160, 115, 55);
  doc.text('CITY OF TRUTH', pageWidth / 2, 149, { align: 'center' });

  // Traveler Details Box
  const boxY = 190;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 205, 190);
  doc.roundedRect(margin + 15, boxY, contentWidth - 30, 48, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(45, 90, 70);
  doc.text('EXPEDITION SUMMARY', pageWidth / 2, boxY + 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 70, 65);
  doc.text(`Explorer Name: ${profile.username}`, margin + 22, boxY + 20);
  doc.text(`Completion Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 22, boxY + 27);
  doc.text(`Total Score Earned: ${progress.score} XP Points`, margin + 22, boxY + 34);
  doc.text(`Honorary Title: ${quest.completionRewards.title}`, margin + 22, boxY + 41);

  // Footer Note
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(130, 145, 138);
  doc.text('UNESCO City of Literature Heritage Archive Edition', pageWidth / 2, 275, { align: 'center' });

  // --- PAGE 2: CHAPTER NARRATIVES, ON-SITE TASKS & DIARY NOTES ---
  doc.addPage();
  doc.setFillColor(251, 248, 241);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(45, 90, 70);
  doc.text('CHRONICLES OF THE JOURNEY & DIARY NOTES', margin, 24);
  doc.setDrawColor(45, 90, 70);
  doc.setLineWidth(0.8);
  doc.line(margin, 27, pageWidth - margin, 27);

  let currentY = 34;

  quest.chapters.forEach((chap) => {
    if (currentY > 215) {
      doc.addPage();
      doc.setFillColor(251, 248, 241);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = 24;
    }

    // Chapter Header
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(45, 90, 70);
    doc.text(`Chapter ${chap.number}: ${chap.title}`, margin, currentY);
    currentY += 5;

    // Checkpoint & Location
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 110, 40);
    doc.text(`Landmark: ${chap.checkpoint.name} (${chap.checkpoint.localName || ''})`, margin, currentY);
    currentY += 4.5;

    // Narrative
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 60, 55);
    const splitNarrative = doc.splitTextToSize(chap.narrativeText, contentWidth);
    doc.text(splitNarrative, margin, currentY);
    currentY += splitNarrative.length * 3.8 + 2;

    // On-site task / physical observation riddle
    if (chap.checkpoint.onSiteScavengerTask) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(45, 90, 70);
      doc.text(`On-Site Observation Task:`, margin, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 95, 88);
      const splitTask = doc.splitTextToSize(`"${chap.checkpoint.onSiteScavengerTask.prompt}"`, contentWidth);
      doc.text(splitTask, margin, currentY);
      currentY += splitTask.length * 3.5 + 2;
    }

    // Traveler's Personal Diary Reflection (If written)
    const customNote = progress.customDiaryNotes?.[chap.checkpoint.id];
    if (customNote) {
      doc.setFillColor(242, 237, 226);
      doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 75, 20);
      doc.text(`Traveler Reflection:`, margin + 3, currentY + 4);
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 50, 45);
      const splitNote = doc.splitTextToSize(`"${customNote}"`, contentWidth - 6);
      doc.text(splitNote, margin + 3, currentY + 8);
      currentY += 16;
    }

    // Verified Cultural Fact
    doc.setFillColor(245, 240, 230);
    doc.roundedRect(margin, currentY, contentWidth, 13, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 80, 25);
    doc.text(`Verified Sourced Fact (${chap.checkpoint.culturalFact.category}):`, margin + 3, currentY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(60, 70, 65);
    const splitFact = doc.splitTextToSize(`${chap.checkpoint.culturalFact.fact} [${chap.checkpoint.culturalFact.source}]`, contentWidth - 6);
    doc.text(splitFact, margin + 3, currentY + 8);
    currentY += 17;
  });

  // --- PAGE 3: CHECKPOINT MEMORIES, PHOTOS & SOUVENIR CARDS ---
  const selectedPhotos = progress.photos.filter((p) => p.includeInStorybook);
  const souvenirCards = progress.customSouvenirCards || [];

  if (selectedPhotos.length > 0 || souvenirCards.length > 0) {
    doc.addPage();
    doc.setFillColor(251, 248, 241);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(45, 90, 70);
    doc.text('PHOTOGRAPHS & SOUVENIR CARDS', margin, 24);
    doc.setDrawColor(45, 90, 70);
    doc.setLineWidth(0.8);
    doc.line(margin, 27, pageWidth - margin, 27);

    let itemY = 34;

    // Render up to 2 photos
    for (const photo of selectedPhotos.slice(0, 2)) {
      try {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(200, 190, 175);
        doc.roundedRect(margin, itemY, contentWidth, 60, 3, 3, 'FD');

        if (photo.dataUrl.startsWith('data:image')) {
          doc.addImage(photo.dataUrl, 'JPEG', margin + 3, itemY + 3, 72, 54);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(45, 90, 70);
        doc.text(photo.checkpointName, margin + 80, itemY + 12);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(80, 90, 85);
        const splitCaption = doc.splitTextToSize(photo.caption || 'Captured during the exploration of Kozhikode.', contentWidth - 85);
        doc.text(splitCaption, margin + 80, itemY + 22);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(140, 150, 145);
        doc.text(`Recorded: ${new Date(photo.timestamp).toLocaleTimeString()}`, margin + 80, itemY + 50);

        itemY += 66;
      } catch (err) {
        console.warn('[PDF] Error rendering photo:', err);
      }
    }

    // Render Souvenir Cards
    if (souvenirCards.length > 0 && itemY < 230) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(45, 90, 70);
      doc.text('TRAVELER SOUVENIR CARDS', margin, itemY + 4);
      itemY += 8;

      souvenirCards.slice(0, 3).forEach((card) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(212, 163, 89);
        doc.roundedRect(margin, itemY, contentWidth, 18, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(180, 110, 40);
        doc.text(`[${card.type.toUpperCase()}] ${card.title}`, margin + 4, itemY + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(50, 60, 55);
        const splitContent = doc.splitTextToSize(card.content, contentWidth - 8);
        doc.text(splitContent, margin + 4, itemY + 11);

        itemY += 22;
      });
    }
  }

  // --- FINAL PAGE: FREE TRAVEL PASS VOUCHER & CERTIFICATE OF ACCOMPLISHMENT ---
  doc.addPage();
  doc.setFillColor(251, 248, 241);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Certificate Frame
  doc.setDrawColor(212, 163, 89);
  doc.setLineWidth(2);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);
  doc.setLineWidth(0.5);
  doc.rect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4);

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(45, 90, 70);
  doc.text('CERTIFICATE OF ACCOMPLISHMENT', pageWidth / 2, 36, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(140, 100, 45);
  doc.text('The Board of Heritage Keepers · UNESCO City of Literature Calicut', pageWidth / 2, 43, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 70, 65);
  doc.text('This certifies that the esteemed traveler', pageWidth / 2, 56, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(27, 48, 38);
  doc.text(profile.username, pageWidth / 2, 66, { align: 'center' });

  // Final Mystery Resolution Box
  const resBoxY = 76;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(45, 90, 70);
  doc.roundedRect(margin + 8, resBoxY, contentWidth - 16, 45, 3, 3, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(45, 90, 70);
  doc.text(`THE FINAL MYSTERY REVEALED`, pageWidth / 2, resBoxY + 8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 110, 40);
  doc.text(`True Treasure of Calicut: "${quest.finalMystery.answer.toUpperCase()}"`, pageWidth / 2, resBoxY + 15, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 70, 65);
  const splitRes = doc.splitTextToSize(quest.finalMystery.resolutionLore, contentWidth - 24);
  doc.text(splitRes, margin + 12, resBoxY + 22);

  // UNLOCKED FREE TRAVEL PASS VOUCHER ON FINAL PAGE
  const voucherY = 132;
  doc.setFillColor(248, 244, 236);
  doc.setDrawColor(45, 90, 70);
  doc.roundedRect(margin + 8, voucherY, contentWidth - 16, 52, 3, 3, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(45, 90, 70);
  doc.text('🎟️ OFFICIAL KOZHIKODE FREE TRAVEL PASS', margin + 14, voucherY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 110, 40);
  doc.text('Pass: KSRTC Heritage Bus & Local Auto Voucher', margin + 14, voucherY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 70, 65);
  doc.text('Route: Kozhikode Beach Promenade ⇄ SM Street ⇄ Mananchira Square', margin + 14, voucherY + 22);
  doc.text(`Explorer Voucher Code: WANDER-CALICUT-FREEPASS-${progress.score}XP`, margin + 14, voucherY + 28);
  doc.text('Terms: Free transit pass valid across Kozhikode smart transit network.', margin + 14, voucherY + 34);

  // QR verification stamp
  doc.setDrawColor(45, 90, 70);
  doc.rect(pageWidth - margin - 32, voucherY + 8, 18, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(45, 90, 70);
  doc.text('SCAN QR', pageWidth - margin - 23, voucherY + 18, { align: 'center' });
  doc.text('VERIFIED', pageWidth - margin - 23, voucherY + 22, { align: 'center' });

  // Stamp and Signature
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 135, 128);
  doc.text('Wanderlore AI Location-Based Adventure & Travel Chronicle Engine', pageWidth / 2, 260, { align: 'center' });

  // Save the PDF
  const filename = `Wanderlore_Storybook_${quest.id}_${Date.now()}.pdf`;
  doc.save(filename);
}
