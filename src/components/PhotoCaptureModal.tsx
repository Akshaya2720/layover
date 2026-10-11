import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, Trash2, Check, RefreshCw } from 'lucide-react';
import { PhotoMemory } from '../../shared/types.js';
import { savePhotoMemory } from '../services/db.js';

interface PhotoCaptureModalProps {
  checkpointId: string;
  checkpointName: string;
  onClose: () => void;
  onPhotoSaved: (photo: PhotoMemory) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  checkpointId,
  checkpointName,
  onClose,
  onPhotoSaved,
}) => {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [includeInStorybook, setIncludeInStorybook] = useState<boolean>(true);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start device camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('[Camera] Failed to access camera:', err);
      setCameraError('Camera access unavailable. You can upload an image from your device gallery instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Snap photo from active camera stream
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPhotoDataUrl(dataUrl);
    stopCamera();
  };

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoDataUrl(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Save photo to IndexedDB
  const handleSave = async () => {
    if (!photoDataUrl) return;
    setIsSaving(true);
    const newPhoto: PhotoMemory = {
      id: `photo_${Date.now()}`,
      checkpointId,
      checkpointName,
      dataUrl: photoDataUrl,
      caption: caption.trim() || `Exploring ${checkpointName}`,
      timestamp: new Date().toISOString(),
      includeInStorybook,
    };

    await savePhotoMemory(newPhoto);
    setIsSaving(false);
    onPhotoSaved(newPhoto);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Camera size={18} color="#2D5A46" />
            <span>Capture Moment: {checkpointName}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Visual Display / Camera Area */}
          <div
            style={{
              width: '100%',
              height: '240px',
              borderRadius: '16px',
              background: '#F0ECE4',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #D5DDD7',
              marginBottom: '14px',
            }}
          >
            {/* Live Camera View */}
            {isCameraActive && (
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Photo Preview */}
            {!isCameraActive && photoDataUrl && (
              <img
                src={photoDataUrl}
                alt="Captured Moment"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Empty State */}
            {!isCameraActive && !photoDataUrl && (
              <div style={{ textAlign: 'center', color: '#7E8E85', padding: '20px' }}>
                <Camera size={40} color="#A0B3A8" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Snap a photo with your device camera or upload from gallery</p>
              </div>
            )}
          </div>

          {cameraError && (
            <div style={{ background: '#FDECEB', border: '1px solid #ECC4C2', borderRadius: '10px', padding: '8px 12px', marginBottom: '10px', fontSize: '0.74rem', color: '#B9382F' }}>
              {cameraError}
            </div>
          )}

          {/* Buttons: Snap / Choose file */}
          {!photoDataUrl && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '9999px',
                    background: '#2D5A46',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={16} />
                  <span>Use Camera</span>
                </button>
              ) : (
                <button
                  onClick={takeSnapshot}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '9999px',
                    background: '#D4A359',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={16} />
                  <span>Capture Photo</span>
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  color: '#2D5A46',
                  border: '1.5px solid #2D5A46',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={16} />
                <span>Upload Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Photo Actions if photo is captured */}
          {photoDataUrl && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => { setPhotoDataUrl(null); startCamera(); }}
                style={{
                  background: '#F0ECE4',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#2D5A46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} /> Retake
              </button>
              <button
                onClick={() => setPhotoDataUrl(null)}
                style={{
                  background: '#FDECEB',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#B9382F',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1B3026', display: 'block', marginBottom: '4px' }}>
              Add a Caption
            </label>
            <input
              type="text"
              placeholder="E.g., Watching the sun set over the historic sea pier..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #CFD9D2',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Include in Storybook Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#2D5A46', fontWeight: 600, cursor: 'pointer', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={includeInStorybook}
              onChange={(e) => setIncludeInStorybook(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2D5A46' }}
            />
            Include this photograph in my personalized PDF Storybook
          </label>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!photoDataUrl || isSaving}
            className="btn-primary-action"
            style={{ width: '100%' }}
          >
            <Check size={18} />
            <span>{isSaving ? 'Saving to Journey...' : 'Save to Quest Memory'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
