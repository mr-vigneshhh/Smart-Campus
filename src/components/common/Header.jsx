/**
 * CampuSphere - Header Component
 * Displays university identity, dynamic student profile context, and theme toggle.
 */

import React from 'react';
import { CAMPUS_METADATA } from '../../data/campusData';
import { STUDENT_PROFILE } from '../../data/scheduleData';
import { SparklesIcon, SunIcon, MoonIcon } from './Icons';

export function Header({
  theme,
  onToggleTheme,
  onOpenGemini,
  studentProfile = STUDENT_PROFILE,
  onOpenProfile
}) {
  const initials = (studentProfile?.name || 'Student')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="campus-header" role="banner">
      <div className="header-inner">
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            <span className="logo-letter">C</span>
            <div className="logo-dot pulse-dot" />
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-name">CampuSphere</span>
              <span className="pill pill-blue">Smart Campus OS</span>
            </div>
            <p className="brand-institution">{CAMPUS_METADATA.name}</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Quick AI Trigger */}
          <button
            type="button"
            className="btn btn-secondary btn-sm ai-quick-btn"
            onClick={onOpenGemini}
            aria-label="Ask Google Gemini Campus Concierge"
          >
            <SparklesIcon size={16} className="text-amber" />
            <span>Ask Gemini</span>
          </button>

          {/* Student Profile Pill - Clickable to configure Identity / College */}
          <button
            type="button"
            className="student-profile-badge student-profile-clickable"
            onClick={onOpenProfile}
            aria-label={`Student Profile: ${studentProfile.name}. Click to switch college or edit profile.`}
            title="Click to switch major or edit student identity"
          >
            <div className="avatar-circle">{initials}</div>
            <div className="student-info-text">
              <span className="student-name">{studentProfile.name}</span>
              <span className="student-program">
                {(studentProfile.program || 'Student').split('&')[0]}
              </span>
            </div>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-sm theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
