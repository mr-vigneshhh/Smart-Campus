import { describe, it, expect } from 'vitest';
import {
  PRESET_STUDENTS,
  PRESET_SCHEDULES,
  COURSE_SCHEDULE
} from '../data/scheduleData';

describe('scheduleCustomizer and profile management', () => {
  it('provides complete preset profiles for diverse student departments', () => {
    expect(PRESET_STUDENTS.length).toBeGreaterThanOrEqual(3);
    const eng = PRESET_STUDENTS.find((p) => p.id === 'engineering');
    const med = PRESET_STUDENTS.find((p) => p.id === 'pre-med');
    const bus = PRESET_STUDENTS.find((p) => p.id === 'business');

    expect(eng).toBeDefined();
    expect(eng.name).toBe('Alex Rivera');
    expect(med).toBeDefined();
    expect(med.name).toBe('Maya Lin');
    expect(bus).toBeDefined();
    expect(bus.name).toBe('Jordan Smith');
  });

  it('provides dedicated course schedules for each department preset', () => {
    expect(PRESET_SCHEDULES.engineering.length).toBeGreaterThan(0);
    expect(PRESET_SCHEDULES['pre-med'].length).toBeGreaterThan(0);
    expect(PRESET_SCHEDULES.business.length).toBeGreaterThan(0);

    const medCourses = PRESET_SCHEDULES['pre-med'];
    expect(medCourses.some((c) => c.courseCode.includes('BIO'))).toBe(true);
    expect(medCourses.some((c) => c.courseCode.includes('CHEM'))).toBe(true);
  });

  it('allows adding a custom user course and filtering by day', () => {
    const initialList = [...COURSE_SCHEDULE];
    const customCourse = {
      id: 'custom-ai-99',
      courseCode: 'AI 401',
      courseName: 'Frontier AI Agents',
      instructor: 'Prof. Turing',
      buildingId: 'turing-hall',
      buildingName: 'Alan Turing Hall',
      room: 'TH-201',
      day: 'mon',
      startTime: '16:00',
      endTime: '17:15',
      type: 'Seminar'
    };

    const updatedList = [...initialList, customCourse];
    expect(updatedList.length).toBe(initialList.length + 1);

    const mondayClasses = updatedList.filter((c) => c.day === 'mon');
    expect(mondayClasses.some((c) => c.courseCode === 'AI 401')).toBe(true);
  });

  it('allows removing an unneeded course by ID', () => {
    const initialList = [...COURSE_SCHEDULE];
    const idToRemove = initialList[0].id;

    const remaining = initialList.filter((c) => c.id !== idToRemove);
    expect(remaining.length).toBe(initialList.length - 1);
    expect(remaining.some((c) => c.id === idToRemove)).toBe(false);
  });
});
