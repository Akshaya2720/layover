import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Settings,
  Navigation,
  MapPin,
  Eye,
  Info,
  Check,
  Sparkles,
  ExternalLink,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Crosshair,
  Compass,
} from 'lucide-react';
import { Checkpoint } from '../../shared/types.js';

interface RealWorldMapProps {
  checkpoints: Checkpoint[];
  activeCheckpointIndex?: number;
  completedCheckpointIds?: string[];
  startCoords?: [number, number];
  startName?: string;
  destinationCoords?: [number, number];
  destinationName?: string;
  routeWaypoints?: [number, number][];
  travelMode?: 'walking' | 'driving';
  height?: string;
  onSelectCheckpoint?: (index: number) => void;
  showTurnByTurn?: boolean;
}

type MapLayerType = 'osm' | 'parchment' | 'satellite' | 'terrain';

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  heading?: number | null;
}

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const RealWorldMap: React.FC<RealWorldMapProps> = ({
  checkpoints,
  activeCheckpointIndex = 0,
  completedCheckpointIds = [],
  startCoords = [11.2588, 75.7686],
  startName = 'Kozhikode Beach',
  destinationCoords = [11.2514, 75.7808],
  destinationName = 'Mananchira Square',
  routeWaypoints,
  travelMode = 'walking',
  height = '240px',
  onSelectCheckpoint,
  showTurnByTurn = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('osm');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [selectedPinInfo, setSelectedPinInfo] = useState<Checkpoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  // Distance from user to active checkpoint
  const activeCheckpoint = checkpoints[activeCheckpointIndex];
  const distanceToActiveCheckpoint =
    userLocation && activeCheckpoint
      ? calculateDistanceMeters(userLocation.lat, userLocation.lng, activeCheckpoint.lat, activeCheckpoint.lng)
      : null;

  // Real-time GPS WatchPosition
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      console.warn('[RealWorldMap] Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading } = pos.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          heading,
        });
        setGpsActive(true);
      },
      (err) => {
        console.warn('[RealWorldMap] GPS Watch error:', err.message);
        setGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 4000,
        timeout: 12000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Tile Layer URLs
  const getTileConfig = (layer: MapLayerType) => {
    switch (layer) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri World Imagery',
          maxZoom: 19,
        };
      case 'terrain':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data &copy; OpenStreetMap, SRTM | OpenTopoMap',
          maxZoom: 17,
        };
      case 'parchment':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; OpenStreetMap, &copy; CARTO',
          maxZoom: 19,
        };
      case 'osm':
      default:
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        };
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerLat = checkpoints[activeCheckpointIndex]?.lat || startCoords[0];
    const centerLng = checkpoints[activeCheckpointIndex]?.lng || startCoords[1];

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      center: [centerLat, centerLng],
      zoom: 14,
    });
    mapInstanceRef.current = map;

    // Add Tiles
    const tileConfig = getTileConfig(activeLayer);
    const tileLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      attribution: tileConfig.attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    tileLayer.on('tileerror', () => {
      console.warn('[RealWorldMap] Tile loading issue on', activeLayer, 'falling back to OSM');
      if (activeLayer !== 'osm') {
        tileLayer.setUrl('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
      }
    });

    // Custom Marker Generator
    const createMarkerIcon = (label: string, color: string, isActive: boolean, isDone: boolean) => {
      const glow = isActive
        ? 'box-shadow: 0 0 14px #2D5A46, 0 3px 8px rgba(0,0,0,0.4); border: 2.5px solid #FFD700;'
        : 'box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid #FFFFFF;';
      const iconContent = isDone ? '✓' : label;

      return L.divIcon({
        className: 'custom-realworld-marker',
        html: `<div style="
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${isDone ? '#2D5A46' : color};
          color: #FFF;
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          ${glow}
          transition: transform 0.2s ease;
          cursor: pointer;
        ">${iconContent}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // 1. Add Start Pin
    L.marker(startCoords, { icon: createMarkerIcon('S', '#D4A359', false, false) })
      .addTo(map)
      .bindPopup(`<div style="font-family: sans-serif; font-size: 12px;"><b>Start:</b> ${startName}</div>`);

    // 2. Add Checkpoint Spot Pins
    checkpoints.forEach((cp, idx) => {
      const isDone = completedCheckpointIds.includes(cp.id);
      const isActive = idx === activeCheckpointIndex;
      const color = isActive ? '#2D5A46' : '#6A7B72';

      const marker = L.marker([cp.lat, cp.lng], {
        icon: createMarkerIcon(String(cp.number), color, isActive, isDone),
      }).addTo(map);

      marker.on('click', () => {
        setSelectedPinInfo(cp);
        if (onSelectCheckpoint) onSelectCheckpoint(idx);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; max-width: 180px;">
          <div style="font-weight: 800; color: #1B3026; margin-bottom: 2px;">${cp.number}. ${cp.name}</div>
          <div style="color: #6A7B72; font-size: 10px; margin-bottom: 4px;">${cp.subtitle}</div>
          <div style="font-size: 11px; color: #2D5A46; font-weight: 700;">${
            isDone ? '✓ Verified Completed' : isActive ? '🟢 Current Active Task' : '🔒 Next Location'
          }</div>
        </div>
      `);
    });

    // 3. Draw Route Polyline
    const polylinePoints: [number, number][] =
      routeWaypoints && routeWaypoints.length > 0
        ? routeWaypoints
        : [
            startCoords,
            ...checkpoints.map((c) => [c.lat, c.lng] as [number, number]),
            destinationCoords,
          ];

    L.polyline(polylinePoints, {
      color: '#2D5A46',
      weight: 4,
      dashArray: travelMode === 'walking' ? '6, 6' : undefined,
      opacity: 0.85,
    }).addTo(map);

    // Initial resize trigger
    const invalidateTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapContainerRef.current);

    return () => {
      clearTimeout(invalidateTimer);
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [
    checkpoints,
    activeCheckpointIndex,
    completedCheckpointIds,
    activeLayer,
    startCoords,
    destinationCoords,
    routeWaypoints,
    travelMode,
  ]);

  // Update Live User GPS Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const userLatLng: [number, number] = [userLocation.lat, userLocation.lng];

    const userBeaconIcon = L.divIcon({
      className: 'user-live-beacon',
      html: `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="
            position: absolute;
            top: -7px;
            left: -7px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(33, 150, 243, 0.35);
            animation: user-radar-pulse 2s infinite ease-out;
          "></div>
          <div style="
            position: relative;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #1976D2;
            border: 3px solid #FFFFFF;
            box-shadow: 0 0 10px rgba(25, 118, 210, 0.8);
          "></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLatLng);
    } else {
      userMarkerRef.current = L.marker(userLatLng, { icon: userBeaconIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<div style="font-size: 11px; font-weight: 700;">📍 You are here (Live GPS)</div>');
    }

    if (userLocation.accuracy && userLocation.accuracy < 100) {
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.setLatLng(userLatLng);
        userAccuracyCircleRef.current.setRadius(userLocation.accuracy);
      } else {
        userAccuracyCircleRef.current = L.circle(userLatLng, {
          radius: userLocation.accuracy,
          color: '#1976D2',
          fillColor: '#2196F3',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);
      }
    }
  }, [userLocation]);

  // Handle Fullscreen & Window Resizing
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [isFullscreen]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterOnUser = () => {
    if (!mapInstanceRef.current) return;
    if (userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true });
    } else if (activeCheckpoint) {
      mapInstanceRef.current.flyTo([activeCheckpoint.lat, activeCheckpoint.lng], 15, { animate: true });
    }
  };

  const handleSwitchLayer = (layer: MapLayerType) => {
    setActiveLayer(layer);
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : undefined,
        zIndex: isFullscreen ? 1200 : undefined,
        marginBottom: isFullscreen ? 0 : '10px',
        background: '#EAE6DF',
      }}
    >
      <style>{`
        @keyframes user-radar-pulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      {/* Real-World Leaflet Map Viewport */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: isFullscreen ? '100vh' : height,
          borderRadius: isFullscreen ? '0px' : '14px',
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '1.5px solid #2D5A46',
          boxShadow: isFullscreen ? 'none' : '0 4px 16px rgba(45, 90, 70, 0.12)',
          background: '#EAE6DF',
        }}
      />

      {/* Live Distance & GPS Status Badge (Top Left) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #D5DDD7',
            borderRadius: '20px',
            padding: '3px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#1B3026',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: gpsActive ? '#2E7D32' : '#F57C00',
              boxShadow: gpsActive ? '0 0 6px #2E7D32' : 'none',
            }}
          />
          <span>{gpsActive ? 'GPS Live Tracking' : 'GPS Standby'}</span>
          {distanceToActiveCheckpoint !== null && (
            <span style={{ color: '#2D5A46', borderLeft: '1px solid #CCC', paddingLeft: '6px' }}>
              🎯{' '}
              {distanceToActiveCheckpoint < 1000
                ? `${Math.round(distanceToActiveCheckpoint)}m away`
                : `${(distanceToActiveCheckpoint / 1000).toFixed(1)}km away`}
            </span>
          )}
        </div>
      </div>

      {/* Floating Controls Bar (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Layer Switcher */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D5DDD7',
            borderRadius: '999px',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <button
            type="button"
            onClick={() => handleSwitchLayer('osm')}
            style={{
              background: activeLayer === 'osm' ? '#2D5A46' : 'transparent',
              color: activeLayer === 'osm' ? '#FFF' : '#4A5851',
              border: 'none',
              borderRadius: '999px',
              padding: '3px 8px',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Street
          </button>
          <button
            type="button"
            onClick={() => handleSwitchLayer('parchment')}
            style={{
              background: activeLayer === 'parchment' ? '#2D5A46' : 'transparent',
              color: activeLayer === 'parchment' ? '#FFF' : '#4A5851',
              border: 'none',
              borderRadius: '999px',
              padding: '3px 8px',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Parchment
          </button>
          <button
            type="button"
            onClick={() => handleSwitchLayer('satellite')}
            style={{
              background: activeLayer === 'satellite' ? '#2D5A46' : 'transparent',
              color: activeLayer === 'satellite' ? '#FFF' : '#4A5851',
              border: 'none',
              borderRadius: '999px',
              padding: '3px 8px',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Satellite
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D5DDD7',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2D5A46',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        {/* API Settings */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D5DDD7',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2D5A46',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
          title="Map Engine & API Settings"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Floating Zoom & Center Controls (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: isFullscreen ? '40px' : '15px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={handleCenterOnUser}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D5DDD7',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1976D2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
          title="Center on My Location"
        >
          <Crosshair size={16} />
        </button>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D5DDD7',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #EAE6DF',
              width: '32px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D5A46',
              cursor: 'pointer',
            }}
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            style={{
              background: 'transparent',
              border: 'none',
              width: '32px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D5A46',
              cursor: 'pointer',
            }}
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Turn-by-Turn Navigation & Spot Markers Bar */}
      {showTurnByTurn && !isFullscreen && (
        <div
          style={{
            marginTop: '8px',
            background: '#F8F4EC',
            border: '1px solid #E6DEC9',
            borderRadius: '12px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#1B3026',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Navigation size={13} color="#2D5A46" />
              <span>Route Directions & Landmark Spots</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#6A7B72' }}>
              Mode: {travelMode === 'walking' ? '🚶 Pedestrian Trail' : '🚗 Vehicle Route'}
            </span>
          </div>

          {/* Spots Timeline Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {checkpoints.map((cp, idx) => {
              const isDone = completedCheckpointIds.includes(cp.id);
              const isActive = idx === activeCheckpointIndex;

              return (
                <div
                  key={cp.id}
                  onClick={() => onSelectCheckpoint && onSelectCheckpoint(idx)}
                  style={{
                    background: isActive ? '#FFFFFF' : isDone ? '#E6EFEA' : '#EDE8DC',
                    border: isActive ? '1.5px solid #2D5A46' : '1px solid #D5DDD7',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.68rem',
                    color: '#1B3026',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: isDone ? '#2D5A46' : isActive ? '#D4A359' : '#889890',
                      color: '#FFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isDone ? '✓' : cp.number}
                  </span>
                  <span>{cp.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Engine & API Guidance Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', maxHeight: '85vh' }}
          >
            <div className="modal-header">
              <div className="modal-title">
                <Layers size={20} color="#2D5A46" />
                <span>Real-World Map Engine & API Integration</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowSettingsModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ fontSize: '0.8rem', color: '#3A4841', lineHeight: 1.5 }}>
              <div
                style={{
                  background: '#E9F2ED',
                  border: '1px solid #2D5A46',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1B3026',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} color="#2D5A46" />
                  <span>Active Engine: OpenStreetMap + Leaflet (100% Free & Live)</span>
                </div>
                <div>
                  Wanderlore uses real-world OpenStreetMap cartography with turn-by-turn routing via OSRM, reverse geocoding via Nominatim, and browser GPS positioning. It requires <strong>no proprietary API keys</strong> and works seamlessly worldwide.
                </div>
              </div>

              <h4 style={{ fontWeight: 800, color: '#1B3026', marginBottom: '6px' }}>
                GPS Real-Time Tracking:
              </h4>
              <p style={{ marginBottom: '8px' }}>
                Your live position is monitored using the device's GPS radio. As you physically approach within 50 meters of a landmark, the on-site observation riddle automatically unlocks!
              </p>

              <div
                style={{
                  background: '#FAF8F3',
                  border: '1px solid #E6DEC9',
                  borderRadius: '10px',
                  padding: '10px 12px',
                }}
              >
                <strong style={{ color: '#1B3026' }}>Controlled Real-World Waypoints:</strong>
                <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                  <li>
                    <strong>Kozhikode Sea Pier:</strong> 11.2588° N, 75.7686° E
                  </li>
                  <li>
                    <strong>SM Street (Mittayi Theruvu):</strong> 11.2541° N, 75.7765° E
                  </li>
                  <li>
                    <strong>Mananchira Square:</strong> 11.2514° N, 75.7808° E
                  </li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '12px 18px' }}>
              <button
                className="btn-primary-action"
                onClick={() => setShowSettingsModal(false)}
                style={{ width: '100%' }}
              >
                <span>Back to Map Exploration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
