import { describe, it, expect } from 'vitest';
import {
  formatCalendarTimestamp,
  getNextSessionDate,
  generateGoogleCalendarUrl,
  generateICalContent
} from '../services/calendarService';

describe('calendarService', () => {
  describe('formatCalendarTimestamp', () => {
    it('formats UTC dates into compact YYYYMMDDTHHmmSSZ format', () => {
      const fixedDate = new Date(Date.UTC(2026, 8, 20, 14, 30, 0));
      const formatted = formatCalendarTimestamp(fixedDate);
      expect(formatted).toBe('20260920T143000Z');
    });

    it('correctly pads single-digit months, days, and times with leading zero', () => {
      const fixedDate = new Date(Date.UTC(2026, 0, 5, 9, 5, 7));
      const formatted = formatCalendarTimestamp(fixedDate);
      expect(formatted).toBe('20260105T090507Z');
    });
  });

  describe('getNextSessionDate', () => {
    it('calculates future target day correctly', () => {
      // Base date: Wednesday Sep 16, 2026 at 08:00
      const baseWednesday = new Date(2026, 8, 16, 8, 0, 0);
      const nextMon = getNextSessionDate('mon', '09:00', baseWednesday);

      expect(nextMon.getDay()).toBe(1); // Monday is 1
      expect(nextMon.getHours()).toBe(9);
      expect(nextMon.getMinutes()).toBe(0);
      expect(nextMon.getTime()).toBeGreaterThan(baseWednesday.getTime());
    });
  });

  describe('generateGoogleCalendarUrl', () => {
    const sampleEvent = {
      id: 'cs-301',
      courseCode: 'CS 301',
      courseName: 'Distributed Systems',
      instructor: 'Dr. Elena Rostova',
      buildingName: 'Alan Turing Hall',
      room: 'TH-101',
      day: 'mon',
      startTime: '09:00',
      endTime: '10:15',
      description: 'Consensus algorithms and Raft.'
    };

    it('generates a valid Google Calendar template URL', () => {
      const url = generateGoogleCalendarUrl(sampleEvent);

      expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
      expect(url).toContain('text=%5BCS%20301%5D%20Distributed%20Systems');
      expect(url).toContain('location=TH-101%2C%20Alan%20Turing%20Hall');
      expect(url).toContain('sprop=name:CampuSphere');
    });

    it('throws descriptive error on invalid event input', () => {
      expect(() => generateGoogleCalendarUrl(null)).toThrow('Invalid event payload');
      expect(() => generateGoogleCalendarUrl({ courseCode: 'CS 101' })).toThrow('Invalid event payload');
    });
  });

  describe('generateICalContent', () => {
    const sampleEvent = {
      id: 'cs-301',
      courseCode: 'CS 301',
      courseName: 'Distributed Systems',
      instructor: 'Dr. Rostova',
      buildingName: 'Alan Turing Hall',
      room: 'TH-101',
      day: 'mon',
      startTime: '09:00',
      endTime: '10:15',
      description: 'Distributed Consensus.'
    };

    it('generates valid RFC 5545 iCalendar content', () => {
      const ical = generateICalContent(sampleEvent);

      expect(ical).toContain('BEGIN:VCALENDAR');
      expect(ical).toContain('VERSION:2.0');
      expect(ical).toContain('SUMMARY:[CS 301] Distributed Systems');
      expect(ical).toContain('LOCATION:TH-101, Alan Turing Hall');
      expect(ical).toContain('END:VEVENT');
      expect(ical).toContain('END:VCALENDAR');
    });
  });
});
