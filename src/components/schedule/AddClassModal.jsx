/**
 * CampuSphere - Add / Modify Custom Student Class Modal
 * Enables students to input their own courses, timings, and campus classrooms.
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BUILDINGS } from '../../data/campusData';
import { WEEKDAY_OPTIONS } from '../../data/scheduleData';
import { CalendarIcon, MapPinIcon, ClockIcon } from '../common/Icons';

export function AddClassModal({ isOpen, onClose, onAddCourse, initialDay = 'mon' }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    instructor: '',
    day: initialDay,
    startTime: '10:00',
    endTime: '11:15',
    buildingId: 'turing-hall',
    room: 'TH-101',
    type: 'Lecture',
    description: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleBuildingChange = (e) => {
    const bldgId = e.target.value;
    const bldg = BUILDINGS.find((b) => b.id === bldgId);
    const defaultRoom = bldg?.floors[0]?.rooms[0]?.id || 'Room 101';
    setFormData((prev) => ({
      ...prev,
      buildingId: bldgId,
      room: defaultRoom,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.courseCode.trim()) {
      setValidationError('Please enter a course code (e.g., CS 301, MATH 240).');
      return;
    }
    if (!formData.courseName.trim()) {
      setValidationError('Please enter a course title.');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setValidationError('Start time must be earlier than end time.');
      return;
    }

    const selectedBuilding = BUILDINGS.find((b) => b.id === formData.buildingId);
    const newCourse = {
      id: `custom-${Date.now()}`,
      courseCode: formData.courseCode.toUpperCase().trim(),
      courseName: formData.courseName.trim(),
      instructor: formData.instructor.trim() || 'Staff Faculty',
      buildingId: formData.buildingId,
      buildingName: selectedBuilding ? selectedBuilding.name : 'Campus Hall',
      room: formData.room.trim(),
      day: formData.day,
      dayName: WEEKDAY_OPTIONS.find((w) => w.id === formData.day)?.label || 'Monday',
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      color: '#3b82f6',
      description: formData.description.trim() || 'Enrolled student course session.',
    };

    onAddCourse(newCourse);
    onClose();

    // Reset form
    setFormData({
      courseCode: '',
      courseName: '',
      instructor: '',
      day: initialDay,
      startTime: '10:00',
      endTime: '11:15',
      buildingId: 'turing-hall',
      room: 'TH-101',
      type: 'Lecture',
      description: '',
    });
  };

  const selectedBuildingObj = BUILDINGS.find((b) => b.id === formData.buildingId);
  const availableRooms = selectedBuildingObj?.floors.flatMap((f) => f.rooms) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Class to My Routine"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="add-class-form">
        {validationError && (
          <div className="form-error-alert" role="alert">
            {validationError}
          </div>
        )}

        <div className="form-group-row">
          <div className="form-field">
            <label htmlFor="course-code-input">Course Code *</label>
            <input
              id="course-code-input"
              name="courseCode"
              type="text"
              required
              placeholder="e.g. CS 301, CHEM 101"
              value={formData.courseCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="course-type-select">Session Type</label>
            <select
              id="course-type-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Lecture">Lecture</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Quiz / Exam">Quiz / Exam</option>
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="course-title-input">Course Title *</label>
          <input
            id="course-title-input"
            name="courseName"
            type="text"
            required
            placeholder="e.g. Introduction to Neural Networks"
            value={formData.courseName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-row">
          <div className="form-field">
            <label htmlFor="course-day-select">Day of Week</label>
            <select
              id="course-day-select"
              name="day"
              value={formData.day}
              onChange={handleChange}
            >
              {WEEKDAY_OPTIONS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="course-instructor-input">Instructor / Professor</label>
            <input
              id="course-instructor-input"
              name="instructor"
              type="text"
              placeholder="e.g. Dr. Jane Doe"
              value={formData.instructor}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-field">
            <label htmlFor="start-time-input">Start Time (24h)</label>
            <input
              id="start-time-input"
              name="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="end-time-input">End Time (24h)</label>
            <input
              id="end-time-input"
              name="endTime"
              type="time"
              required
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-field">
            <label htmlFor="building-select">Campus Building</label>
            <select
              id="building-select"
              name="buildingId"
              value={formData.buildingId}
              onChange={handleBuildingChange}
            >
              {BUILDINGS.map((bldg) => (
                <option key={bldg.id} value={bldg.id}>
                  {bldg.name} ({bldg.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="room-select">Classroom / Room Number</label>
            <input
              id="room-select"
              name="room"
              type="text"
              required
              list="room-datalist"
              placeholder="e.g. TH-101 or LC-205"
              value={formData.room}
              onChange={handleChange}
            />
            <datalist id="room-datalist">
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="course-notes-input">Notes / Syllabus Outline (Optional)</label>
          <textarea
            id="course-notes-input"
            name="description"
            rows="2"
            placeholder="e.g. Weekly lab reports submitted on Canvas."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CalendarIcon size={16} />
            <span>Add to My Timetable</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
