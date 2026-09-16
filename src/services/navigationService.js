/**
 * CampuSphere - Campus Navigation & Google Maps Wayfinding Service
 * Mathematical distance calculations, walking transit estimations, and Google Maps deep link builders.
 */

import { BUILDINGS, CAMPUS_METADATA } from '../data/campusData';

/**
 * Calculates distance between two latitude/longitude coordinates in meters using the Haversine formula.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in meters
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's mean radius in meters
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimates walking transit time in minutes given distance in meters.
 * Average brisk student campus walking speed: ~4.5 km/h ≈ 75 meters/minute.
 * Added 2-minute buffer for building ingress/egress and stairwell/elevator transit.
 * @param {number} distanceMeters
 * @returns {number} Estimated transit time in minutes (minimum 1)
 */
export function estimateWalkingMinutes(distanceMeters) {
  if (distanceMeters <= 0) return 1;
  const baseMinutes = distanceMeters / 75;
  return Math.max(1, Math.round(baseMinutes + 2));
}

/**
 * Find building by its ID or code
 * @param {string} buildingIdOrCode
 * @returns {Object|null}
 */
export function findBuilding(buildingIdOrCode) {
  if (!buildingIdOrCode) return null;
  const query = buildingIdOrCode.toLowerCase().trim();
  return (
    BUILDINGS.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.code.toLowerCase() === query ||
        b.name.toLowerCase().includes(query)
    ) || null
  );
}

/**
 * Locates a room across all campus buildings
 * @param {string} roomCode - e.g. "TH-101", "LC-205", "LIB-301"
 * @returns {{ building: Object, floor: Object, room: Object } | null}
 */
export function findRoomLocation(roomCode) {
  if (!roomCode) return null;
  const normalized = roomCode.toUpperCase().replace(/\s+/g, '-');

  for (const building of BUILDINGS) {
    for (const floor of building.floors) {
      const room = floor.rooms.find(
        (r) => r.id.toUpperCase() === normalized || r.id.replace('-', '').toUpperCase() === normalized.replace('-', '')
      );
      if (room) {
        return { building, floor, room };
      }
    }
  }
  return null;
}

/**
 * Builds an official Google Maps deep link for walking directions between two campus locations.
 * @param {Object} origin - { lat, lng, name }
 * @param {Object} destination - { lat, lng, name }
 * @returns {string} Google Maps route URL
 */
export function generateGoogleMapsRouteUrl(origin, destination) {
  if (!destination || typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CAMPUS_METADATA.name)}`;
  }

  const destCoords = `${destination.lat},${destination.lng}`;

  if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
    // If origin is not provided, direct student to destination with walking mode preset
    return `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=walking`;
  }

  const originCoords = `${origin.lat},${origin.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destCoords}&travelmode=walking`;
}

/**
 * Generates a Google Maps pinpoint link for a single building or room
 * @param {Object} building
 * @returns {string} Google Maps URL
 */
export function generateGoogleMapsBuildingUrl(building) {
  if (!building || !building.coords) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CAMPUS_METADATA.name)}`;
  }
  const query = encodeURIComponent(`${building.name}, ${CAMPUS_METADATA.shortName}`);
  return `https://www.google.com/maps/search/?api=1&query=${building.coords.lat},${building.coords.lng}+(${query})`;
}

/**
 * Analyzes transition feasibility between two consecutive classes.
 * @param {Object} classA - Previous class
 * @param {Object} classB - Next class
 * @returns {{ distanceMeters: number, estimatedMinutes: number, windowMinutes: number, isTight: boolean, status: 'safe'|'tight'|'critical' }}
 */
export function evaluateClassTransition(classA, classB) {
  if (!classA || !classB) {
    return { distanceMeters: 0, estimatedMinutes: 0, windowMinutes: 0, isTight: false, status: 'safe' };
  }

  const bldgA = findBuilding(classA.buildingId);
  const bldgB = findBuilding(classB.buildingId);

  let distanceMeters = 50; // default intra-building walking
  if (bldgA && bldgB && bldgA.id !== bldgB.id) {
    distanceMeters = calculateHaversineDistance(
      bldgA.coords.lat,
      bldgA.coords.lng,
      bldgB.coords.lat,
      bldgB.coords.lng
    );
  }

  const estimatedMinutes = estimateWalkingMinutes(distanceMeters);

  // Parse time window between classA end and classB start
  const [endH, endM] = (classA.endTime || '00:00').split(':').map(Number);
  const [startH, startM] = (classB.startTime || '00:00').split(':').map(Number);
  const windowMinutes = (startH * 60 + startM) - (endH * 60 + endM);

  const bufferRemaining = windowMinutes - estimatedMinutes;
  let status = 'safe';
  if (bufferRemaining < 3) status = 'critical';
  else if (bufferRemaining < 8) status = 'tight';

  return {
    distanceMeters,
    estimatedMinutes,
    windowMinutes,
    bufferRemaining,
    isTight: bufferRemaining < 8,
    status
  };
}
