import { RoutePlanRequest } from '../../shared/types.js';

// Predefined landmark coordinates in Kozhikode and Kerala for instant, reliable resolution
export const PREDEFINED_COORDINATES: Record<string, { lat: number; lng: number; displayName: string }> = {
  'kozhikode beach': { lat: 11.2588, lng: 75.7686, displayName: 'Kozhikode Beach, Beach Road, Kozhikode, Kerala' },
  'kozhikode beach, beach road, kozhikode': { lat: 11.2588, lng: 75.7686, displayName: 'Kozhikode Beach, Beach Road, Kozhikode, Kerala' },
  'beach': { lat: 11.2588, lng: 75.7686, displayName: 'Kozhikode Beach, Beach Road, Kozhikode, Kerala' },
  'sm street': { lat: 11.2541, lng: 75.7765, displayName: 'S.M. Street (Mittayi Theruvu), Kozhikode, Kerala' },
  'sm street (mittayi theruvu), kozhikode': { lat: 11.2541, lng: 75.7765, displayName: 'S.M. Street (Mittayi Theruvu), Kozhikode, Kerala' },
  'mittayi theruvu': { lat: 11.2541, lng: 75.7765, displayName: 'S.M. Street (Mittayi Theruvu), Kozhikode, Kerala' },
  'mananchira': { lat: 11.2514, lng: 75.7808, displayName: 'Mananchira Square, Kozhikode, Kerala' },
  'mananchira square': { lat: 11.2514, lng: 75.7808, displayName: 'Mananchira Square, Kozhikode, Kerala' },
  'mananchira square, kozhikode': { lat: 11.2514, lng: 75.7808, displayName: 'Mananchira Square, Kozhikode, Kerala' },
  'tali temple': { lat: 11.2442, lng: 75.7846, displayName: 'Tali Shiva Temple, Chalappuram, Kozhikode, Kerala' },
  'mishkal mosque': { lat: 11.2492, lng: 75.7745, displayName: 'Mishkal Mosque, Kuttichira, Kozhikode, Kerala' },
  'beypore': { lat: 11.1633, lng: 75.8078, displayName: 'Beypore Port & Boatyards, Kozhikode, Kerala' },
  'kappad beach': { lat: 11.3855, lng: 75.7176, displayName: 'Kappad Beach, Kozhikode, Kerala' },
  'fort kochi': { lat: 9.9658, lng: 76.2421, displayName: 'Fort Kochi, Kochi, Kerala' },
  'mattancherry palace': { lat: 9.9583, lng: 76.2592, displayName: 'Mattancherry Palace, Kochi, Kerala' }
};

export async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; displayName: string }> {
  const normalized = query.trim().toLowerCase();

  // 1. Check known landmark database
  for (const [key, coords] of Object.entries(PREDEFINED_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // 2. Try Nominatim Geocoding API with 3-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Kerala, India')}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Wanderlore-Adventure-App/1.0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        };
      }
    }
  } catch (err: any) {
    console.warn('[GeoService] Nominatim geocoding timed out or failed, using closest fallback:', err.message || err);
  }

  // Fallback default: Kozhikode Beach center
  return {
    lat: 11.2588,
    lng: 75.7686,
    displayName: `${query} (Resolved to Kozhikode Region)`
  };
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export async function planRoute(request: RoutePlanRequest): Promise<{
  start: { lat: number; lng: number; displayName: string };
  destination: { lat: number; lng: number; displayName: string };
  waypoints: [number, number][];
  distanceKm: number;
  durationMins: number;
  checkpoints: Array<{
    id: string;
    number: number;
    name: string;
    subtitle: string;
    lat: number;
    lng: number;
    distanceKm: number;
    estimatedMins: number;
  }>;
}> {
  const start = await geocodeLocation(request.startLocation || 'Kozhikode Beach, Kozhikode');
  const destination = await geocodeLocation(request.destination || 'Mananchira Square, Kozhikode');

  // Intermediate Kozhikode checkpoints between start and dest
  const sampleIntermediate = [
    {
      id: 'cp-1',
      number: 1,
      name: 'Kozhikode Beach Sea Pier',
      subtitle: 'Historic 19th-century trade pier & coastline',
      lat: 11.2588,
      lng: 75.7686,
      distanceKm: 0.8,
      estimatedMins: 15,
    },
    {
      id: 'cp-2',
      number: 2,
      name: 'SM Street (Mittayi Theruvu)',
      subtitle: 'Heritage sweetmeat market & cultural street',
      lat: 11.2541,
      lng: 75.7765,
      distanceKm: 1.9,
      estimatedMins: 35,
    },
    {
      id: 'cp-3',
      number: 3,
      name: 'Mananchira Square & Royal Tank',
      subtitle: '14th-century royal freshwater tank & gardens',
      lat: 11.2514,
      lng: 75.7808,
      distanceKm: 3.2,
      estimatedMins: 58,
    }
  ];

  const totalDist = calculateDistanceKm(start.lat, start.lng, destination.lat, destination.lng);
  const walkingSpeedKmH = 4.2;
  const drivingSpeedKmH = 28.0;
  const speed = request.travelMode === 'driving' ? drivingSpeedKmH : walkingSpeedKmH;
  const durationMins = Math.max(25, Math.round((Math.max(totalDist, 2.5) / speed) * 60));

  // Waypoints for smooth polyline route rendering
  const waypoints: [number, number][] = [
    [start.lat, start.lng],
    [11.2575, 75.7712],
    [11.2558, 75.7740],
    [11.2541, 75.7765],
    [11.2529, 75.7788],
    [destination.lat, destination.lng],
  ];

  return {
    start,
    destination,
    waypoints,
    distanceKm: Math.max(totalDist, 3.2),
    durationMins: durationMins,
    checkpoints: sampleIntermediate.slice(0, Math.max(1, request.checkpointCount || 3)),
  };
}
