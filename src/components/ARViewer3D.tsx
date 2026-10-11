import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Camera, Sparkles, X, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { CollectibleArtifact } from '../../shared/types.js';

interface ARViewer3DProps {
  artifact: CollectibleArtifact;
  onClose: () => void;
  onCaptureARMemory?: (dataUrl: string) => void;
}

export const ARViewer3D: React.FC<ARViewer3DProps> = ({ artifact, onClose, onCaptureARMemory }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isARMode, setIsARMode] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [arScale, setArScale] = useState<number>(1);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffdf80, 2.5); // Warm gold key
    dirLight1.position.set(5, 6, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x80dfff, 1.0); // Cool rim
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    // Build 3D Artifact Mesh
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    buildArtifactModel(artifact.modelType, modelGroup);
    scene.add(modelGroup);

    // Mouse / Touch rotation interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onDown = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;
      modelGroupRef.current.rotation.y += deltaX * 0.012;
      modelGroupRef.current.rotation.x += deltaY * 0.012;
      prevX = clientX;
      prevY = clientY;
    };

    const onUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    const handleMouseDown = (e: MouseEvent) => onDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onUp();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onUp();

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart);
    dom.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isAutoRotating && !isDragging && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
    };
  }, [artifact, isAutoRotating]);

  // Handle AR Mode Camera Feed
  const toggleARMode = async () => {
    if (isARMode) {
      // Turn off AR mode
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsARMode(false);
      setCameraError(null);
    } else {
      // Turn on AR mode
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
        setIsARMode(true);
      } catch (err: any) {
        console.warn('[AR] Camera access failed:', err);
        setCameraError('Camera access required for AR overlay. Please allow camera permissions in your mobile browser.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture AR Snapshot
  const captureARSnapshot = () => {
    if (!rendererRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame if in AR
    if (isARMode && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#1B3026';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Overlay 3D WebGL render
    ctx.drawImage(rendererRef.current.domElement, 0, 0, canvas.width, canvas.height);

    const snapshot = canvas.toDataURL('image/jpeg', 0.85);
    if (onCaptureARMemory) {
      onCaptureARMemory(snapshot);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={18} color="#D4A359" />
            <span>3D Artifact Explorer</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main 3D / AR View Area */}
          <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden', background: isARMode ? '#000' : 'radial-gradient(circle at center, #264335 0%, #0F1E16 100%)' }}>
            {/* Live Camera Video for AR */}
            {isARMode && (
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Three.js Canvas Container */}
            <div
              ref={mountRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                cursor: 'grab',
                transform: `scale(${arScale})`,
                transition: 'transform 0.1s ease-out',
              }}
            />

            {/* AR Reticle Indicator */}
            {isARMode && (
              <div className="ar-reticle-overlay" style={{ zIndex: 1 }}>
                <span>Drag to reposition 3D artifact in real space</span>
              </div>
            )}

            {/* Floating 3D Controls */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#2D5A46',
                }}
                title="Toggle Auto Rotation"
              >
                <RotateCw size={15} />
              </button>
              <button
                onClick={() => setArScale((s) => Math.min(1.8, s + 0.15))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#2D5A46',
                }}
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setArScale((s) => Math.max(0.6, s - 0.15))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#2D5A46',
                }}
              >
                <ZoomOut size={15} />
              </button>
            </div>
          </div>

          {cameraError && (
            <div style={{ background: '#FDECEB', border: '1px solid #ECC4C2', borderRadius: '10px', padding: '8px 12px', marginTop: '10px', fontSize: '0.75rem', color: '#B9382F' }}>
              {cameraError}
            </div>
          )}

          {/* AR Toggle & Snapshot Button Bar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={toggleARMode}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '9999px',
                border: '1.5px solid #2D5A46',
                background: isARMode ? '#2D5A46' : '#FFFFFF',
                color: isARMode ? '#FFFFFF' : '#2D5A46',
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
              <span>{isARMode ? 'Exit AR Camera' : 'Launch AR Camera Mode'}</span>
            </button>

            {isARMode && onCaptureARMemory && (
              <button
                onClick={captureARSnapshot}
                style={{
                  padding: '10px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#D4A359',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={16} />
                <span>Snap AR Photo</span>
              </button>
            )}
          </div>

          {/* Historical Significance Card */}
          <div style={{ background: '#F8F4EC', borderRadius: '14px', padding: '14px', marginTop: '14px', border: '1px solid #E6DDCF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Info size={16} color="#A8772C" />
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1B3026' }}>{artifact.name}</h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#4A5851', lineHeight: 1.42, marginBottom: '8px' }}>
              {artifact.description}
            </p>
            <div style={{ fontSize: '0.72rem', color: '#8F6627', fontWeight: 600, background: '#F1E8D9', padding: '6px 10px', borderRadius: '8px' }}>
              🏺 Historical Significance: {artifact.historicSignificance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Procedural 3D Historic Artifact Geometry Generators
function buildArtifactModel(modelType: string, group: THREE.Group) {
  if (modelType === 'coin') {
    // 3D Zamorin Gold Fanam Coin
    const coinGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 32);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.25,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    group.add(coin);

    // Embossed Royal Sword & Sun motif
    const ringGeo = new THREE.TorusGeometry(0.9, 0.05, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xe6b800, metalness: 0.9, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.07;
    group.add(ring);

    const swordGeo = new THREE.BoxGeometry(0.12, 1.3, 0.05);
    const sword = new THREE.Mesh(swordGeo, ringMat);
    sword.position.z = 0.08;
    group.add(sword);
  } else if (modelType === 'astrolabe') {
    // 3D Antique Brass Navigational Astrolabe
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.8, roughness: 0.3 });
    const darkBrassMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.9, roughness: 0.35 });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 16, 40), brassMat);
    group.add(outerRing);

    const innerPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.06, 32), darkBrassMat);
    innerPlate.rotation.x = Math.PI / 2;
    group.add(innerPlate);

    const crossArm1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 0.08), brassMat);
    const crossArm2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 0.08), brassMat);
    crossArm1.position.z = 0.05;
    crossArm2.position.z = 0.05;
    group.add(crossArm1);
    group.add(crossArm2);

    const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.8, 8), brassMat);
    pointer.rotation.z = Math.PI / 4;
    pointer.position.z = 0.1;
    group.add(pointer);
  } else if (modelType === 'uru_ship') {
    // 3D Beypore Wooden Uru Vessel
    const teakMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7, metalness: 0.1 });
    const darkTeakMat = new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.8 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xfdf5e6, roughness: 0.9, side: THREE.DoubleSide });

    // Wooden Hull
    const hullGeo = new THREE.ConeGeometry(0.8, 2.6, 6);
    const hull = new THREE.Mesh(hullGeo, teakMat);
    hull.rotation.z = Math.PI / 2;
    hull.scale.set(0.6, 1.2, 0.8);
    group.add(hull);

    // Keel & Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.6), darkTeakMat);
    deck.position.y = 0.25;
    group.add(deck);

    // Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.8, 8), darkTeakMat);
    mast.position.set(0.1, 1.0, 0);
    group.add(mast);

    // Cloth Sail
    const sailGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.1, 0.4, 0,
      1.1, 1.5, 0,
      0.1, 1.7, 0,
    ]);
    sailGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    sailGeo.computeVertexNormals();
    const sail = new THREE.Mesh(sailGeo, sailMat);
    group.add(sail);
  } else {
    // Generic Heritage Relic
    const geo = new THREE.DodecahedronGeometry(1.1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xd4a359, metalness: 0.75, roughness: 0.25 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
  }
}
