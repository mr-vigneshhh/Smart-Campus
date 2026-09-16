/**
 * CampuSphere - Student Profile & College Settings Modal
 * Allows any student to configure their identity, college/major, and switch department presets.
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { PRESET_STUDENTS } from '../../data/scheduleData';
import { CAMPUS_METADATA } from '../../data/campusData';
import { CheckCircleIcon, UsersIcon, ShieldCheckIcon } from '../common/Icons';

export function ProfileModal({ isOpen, onClose, studentProfile, onSaveProfile, onSelectPreset }) {
  const [formData, setFormData] = useState({
    name: studentProfile?.name || 'Alex Rivera',
    studentId: studentProfile?.studentId || studentProfile?.id || 'HMU-2024-8841',
    program: studentProfile?.program || 'B.S. Computer Science & Engineering',
    college: studentProfile?.college || 'School of Engineering & Applied Sciences',
    year: studentProfile?.year || 'Junior (3rd Year)',
    campusEmail: studentProfile?.campusEmail || 'arivera@horizon.edu',
    campusName: CAMPUS_METADATA.name,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        name: studentProfile.name || '',
        studentId: studentProfile.studentId || studentProfile.id || '',
        program: studentProfile.program || '',
        college: studentProfile.college || '',
        year: studentProfile.year || '',
        campusEmail: studentProfile.campusEmail || '',
        campusName: CAMPUS_METADATA.name,
      });
    }
  }, [studentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      name: preset.name,
      studentId: preset.studentId,
      program: preset.program,
      college: preset.college,
      year: preset.year,
      campusEmail: preset.campusEmail,
      campusName: CAMPUS_METADATA.name,
    });
    if (onSelectPreset) {
      onSelectPreset(preset.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile & College Settings"
      maxWidth="620px"
    >
      <div className="profile-modal-content">
        {/* Preset Department Quick Switcher */}
        <div className="profile-presets-section">
          <span className="profile-presets-title">Quick Department Presets:</span>
          <div className="profile-presets-grid">
            {PRESET_STUDENTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`preset-btn ${formData.name === p.name ? 'active' : ''}`}
                onClick={() => handleApplyPreset(p)}
              >
                <strong>{p.name}</strong>
                <span>{p.program.split('&')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Edit Identity Form */}
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-group-row">
            <div className="form-field">
              <label htmlFor="student-name-input">Full Name</label>
              <input
                id="student-name-input"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera or your name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="student-id-input">Student ID / Roll No.</label>
              <input
                id="student-id-input"
                name="studentId"
                type="text"
                required
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. HMU-2024-8841"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="student-program-input">Degree Program & Major</label>
            <input
              id="student-program-input"
              name="program"
              type="text"
              required
              value={formData.program}
              onChange={handleChange}
              placeholder="e.g. B.S. Computer Science & Engineering"
            />
          </div>

          <div className="form-field">
            <label htmlFor="student-college-input">Faculty / School / College</label>
            <input
              id="student-college-input"
              name="college"
              type="text"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. School of Engineering & Applied Sciences"
            />
          </div>

          <div className="form-group-row">
            <div className="form-field">
              <label htmlFor="student-year-input">Academic Year</label>
              <select
                id="student-year-input"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (4th Year)">Senior (4th Year)</option>
                <option value="Graduate Student (Masters / Ph.D.)">Graduate Student (Masters / Ph.D.)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="student-email-input">Campus Email</label>
              <input
                id="student-email-input"
                name="campusEmail"
                type="email"
                value={formData.campusEmail}
                onChange={handleChange}
                placeholder="e.g. student@horizon.edu"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="save-success-banner animate-fade-in" role="status">
              <CheckCircleIcon size={16} className="text-emerald" />
              <span>Profile updated successfully! Timetable personalized.</span>
            </div>
          )}

          <div className="modal-actions-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <ShieldCheckIcon size={16} />
              <span>Save Student Profile</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
