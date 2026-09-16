/**
 * CampuSphere - Smart Campus Assistant Root Application Component
 * Manages global active view state, dark/light theme, student profile identity,
 * personalized courses timetable, and accessible modals.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { CampusExplorer } from './components/explorer/CampusExplorer';
import { ScheduleManager } from './components/schedule/ScheduleManager';
import { LiveOccupancy } from './components/occupancy/LiveOccupancy';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { GeminiConcierge } from './components/assistant/GeminiConcierge';
import { ServiceDirectory } from './components/directory/ServiceDirectory';
import { ProfileModal } from './components/profile/ProfileModal';
import { CAMPUS_METADATA } from './data/campusData';
import { CAMPUS_NOTICES } from './data/noticesData';
import { STUDENT_PROFILE, COURSE_SCHEDULE, PRESET_SCHEDULES, PRESET_STUDENTS } from './data/scheduleData';

export function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Student Profile state - persisted in localStorage
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('campussphere_student_profile');
      return saved ? JSON.parse(saved) : STUDENT_PROFILE;
    } catch {
      return STUDENT_PROFILE;
    }
  });

  // Student Courses timetable state - persisted in localStorage
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('campussphere_student_courses');
      return saved ? JSON.parse(saved) : COURSE_SCHEDULE;
    } catch {
      return COURSE_SCHEDULE;
    }
  });

  // Theme state - persisted in localStorage
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('campussphere_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('campussphere_theme', theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [theme]);

  // Persist student profile changes
  const handleSaveProfile = (newProfile) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem('campussphere_student_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  // Persist course additions
  const handleAddCourse = (newCourse) => {
    setCourses((prev) => {
      const updated = [...prev, newCourse];
      try {
        localStorage.setItem('campussphere_student_courses', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Persist course deletions
  const handleDeleteCourse = (courseId) => {
    setCourses((prev) => {
      const updated = prev.filter((c) => c.id !== courseId);
      try {
        localStorage.setItem('campussphere_student_courses', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Switch to Department Preset (Engineering, Pre-Med, Business, Custom)
  const handleSelectPreset = (presetId) => {
    const preset = PRESET_STUDENTS.find((p) => p.id === presetId);
    if (preset) {
      handleSaveProfile(preset);
      const newSchedule = PRESET_SCHEDULES[presetId] || COURSE_SCHEDULE;
      setCourses(newSchedule);
      try {
        localStorage.setItem('campussphere_student_courses', JSON.stringify(newSchedule));
      } catch (e) {}
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const unreadNoticesCount = CAMPUS_NOTICES.filter((n) => !n.read).length;

  return (
    <div className="app-layout">
      {/* WCAG Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Campus Identity Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenGemini={() => setActiveTab('assistant')}
        studentProfile={studentProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <div className="app-container">
        {/* Main Accessible Navigation */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadNoticesCount={unreadNoticesCount}
        />

        {/* Main Content Region with Tab Panels */}
        <main id="main-content" tabIndex={-1} className="main-content-region">
          {activeTab === 'explorer' && <CampusExplorer />}
          {activeTab === 'schedule' && (
            <ScheduleManager
              courses={courses}
              onAddCourse={handleAddCourse}
              onDeleteCourse={handleDeleteCourse}
              studentProfile={studentProfile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onNavigateToRoom={() => {
                setActiveTab('explorer');
              }}
            />
          )}
          {activeTab === 'occupancy' && (
            <LiveOccupancy
              onNavigateToBuilding={() => {
                setActiveTab('explorer');
              }}
            />
          )}
          {activeTab === 'notices' && (
            <NoticeBoard
              onNavigateTab={setActiveTab}
              onNavigateToBuildingCode={() => {
                setActiveTab('explorer');
              }}
            />
          )}
          {activeTab === 'assistant' && <GeminiConcierge />}
          {activeTab === 'directory' && <ServiceDirectory />}
        </main>

        {/* Standard Campus Footer */}
        <footer className="campus-footer" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-left">
              <strong>CampuSphere</strong> • Official Student Experience Platform
              <p className="footer-institution">
                {CAMPUS_METADATA.name} • {CAMPUS_METADATA.address}
              </p>
            </div>
            <div className="footer-tech-stack">
              <span>Powered by Google Gemini AI & Google Maps Platform</span>
              <span className="footer-pipe">•</span>
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Student Profile & College Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        studentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}

export default App;
