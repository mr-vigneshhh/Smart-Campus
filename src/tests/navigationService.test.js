import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  estimateWalkingMinutes,
  findBuilding,
  findRoomLocation,
  generateGoogleMapsRouteUrl,
  generateGoogleMapsBuildingUrl,
  evaluateClassTransition
} from '../services/navigationService';

describe('navigationService', () => {
  describe('calculateHaversineDistance', () => {
    it('calculates 0 meters for identical coordinates', () => {
      const dist = calculateHaversineDistance(37.4275, -122.1697, 37.4275, -122.1697);
      expect(dist).toBe(0);
    });

    it('calculates accurate campus walking distance between Turing Hall and Ada Lovelace', () => {
      // Turing Hall: 37.4282, -122.1712
      // Ada Lovelace: 37.4279, -122.1685
      const dist = calculateHaversineDistance(37.4282, -122.1712, 37.4279, -122.1685);
      // Distance is approximately 240-250 meters
      expect(dist).toBeGreaterThan(200);
      expect(dist).toBeLessThan(300);
    });
  });

  describe('estimateWalkingMinutes', () => {
    it('provides minimum 1 minute for zero or negative distance', () => {
      expect(estimateWalkingMinutes(0)).toBe(1);
      expect(estimateWalkingMinutes(-10)).toBe(1);
    });

    it('estimates walking time based on 75m/min plus 2-min egress buffer', () => {
      // 300 meters / 75 = 4 mins + 2 mins = 6 mins
      expect(estimateWalkingMinutes(300)).toBe(6);
    });
  });

  describe('findBuilding', () => {
    it('finds building by exact id', () => {
      const bldg = findBuilding('turing-hall');
      expect(bldg).not.toBeNull();
      expect(bldg.code).toBe('TH');
    });

    it('finds building by building code (case-insensitive)', () => {
      const bldg = findBuilding('lib');
      expect(bldg).not.toBeNull();
      expect(bldg.id).toBe('alexandria-library');
    });

    it('returns null for nonexistent building', () => {
      expect(findBuilding('nonexistent-hall-xyz')).toBeNull();
      expect(findBuilding('')).toBeNull();
    });
  });

  describe('findRoomLocation', () => {
    it('pinpoints TH-101 inside Turing Hall on Floor 1', () => {
      const match = findRoomLocation('TH-101');
      expect(match).not.toBeNull();
      expect(match.building.code).toBe('TH');
      expect(match.floor.floorNumber).toBe(1);
      expect(match.room.name).toBe('Main Turing Auditorium');
    });

    it('pinpoints room without dash (e.g. "LC100")', () => {
      const match = findRoomLocation('LC100');
      expect(match).not.toBeNull();
      expect(match.room.id).toBe('LC-100');
    });

    it('returns null for nonexistent room', () => {
      expect(findRoomLocation('XYZ-999')).toBeNull();
    });
  });

  describe('generateGoogleMapsRouteUrl', () => {
    it('generates walking direction deep link with destination coordinates', () => {
      const dest = { lat: 37.4282, lng: -122.1712, name: 'Turing Hall' };
      const url = generateGoogleMapsRouteUrl(null, dest);
      expect(url).toContain('https://www.google.com/maps/dir/?api=1');
      expect(url).toContain('destination=37.4282,-122.1712');
      expect(url).toContain('travelmode=walking');
    });

    it('includes origin coordinates when origin is provided', () => {
      const origin = { lat: 37.4269, lng: -122.1704 };
      const dest = { lat: 37.4282, lng: -122.1712 };
      const url = generateGoogleMapsRouteUrl(origin, dest);
      expect(url).toContain('origin=37.4269,-122.1704');
      expect(url).toContain('destination=37.4282,-122.1712');
    });
  });

  describe('evaluateClassTransition', () => {
    it('correctly evaluates transfer window between CS 301 and MATH 240', () => {
      const classA = {
        buildingId: 'turing-hall',
        endTime: '10:15'
      };
      const classB = {
        buildingId: 'ada-lovelace-center',
        startTime: '10:30'
      };

      const result = evaluateClassTransition(classA, classB);
      expect(result.windowMinutes).toBe(15);
      expect(result.distanceMeters).toBeGreaterThan(200);
      expect(result.estimatedMinutes).toBeGreaterThanOrEqual(4);
      expect(result.bufferRemaining).toBeLessThan(15);
    });
  });
});
