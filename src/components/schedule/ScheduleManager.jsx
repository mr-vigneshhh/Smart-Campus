/**
 * CampuSphere - Schedule & Routine Management View
 * Day-by-day timetable planner with Google Calendar one-click sync, .ics download,
 * next-class proximity spotlight, and custom class addition/deletion.
 */

import React, { useState, useMemo } from 'react';
import { COURSE_SCHEDULE, WEEKDAY_OPTIONS } from '../../data/scheduleData';
import { NextClassCard } from './NextClassCard';
import { TransitAlert } from './TransitAlert';
import { AddClassModal } from './AddClassModal';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  NavigationIcon,
  XIcon
} from '../common/Icons';
import { generateGoogleCalendarUrl, generateICalContent } from '../../services/calendarService';
import { generateGoogleMapsRouteUrl, findBuilding } from '../../services/navigationService';

export function ScheduleManager({
  courses = COURSE_SCHEDULE,
  onAddCourse,
  onDeleteCourse,
  onNavigateToRoom,
  onOpenProfile,
  studentProfile
}) {
  const [selectedDay, setSelectedDay] = useState('mon');
  const [downloadedClassId, setDownloadedClassId] = useState(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // Filter classes for selected day
  const classesForDay = useMemo(() => {
    return (courses || []).filter((c) => c.day === selectedDay).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [courses, selectedDay]);

  // First upcoming class on selected day (or first class in schedule)
  const spotlightClass = useMemo(() => {
    return classesForDay[0] || (courses && courses[0]) || null;
  }, [classesForDay, courses]);

  const handleDownloadICal = (course) => {
    const icalData = generateICalContent(course);
    const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${course.courseCode.replace(/\s+/g, '_')}_schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedClassId(course.id);
    setTimeout(() => setDownloadedClassId(null), 3000);
  };

  return (
    <section className="schedule-section" aria-labelledby="schedule-heading">
      <div className="section-title-bar">
        <div>
          <h2 id="schedule-heading">My Timetable & Calendar Sync</h2>
          <p>
            Personal schedule for <strong>{studentProfile?.name || 'Student'}</strong> (
            {studentProfile?.program || 'Undergraduate'} • {studentProfile?.college || 'University'}
            )
          </p>
        </div>

        <div className="schedule-header-cta-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenProfile}
            aria-label="Edit student profile and college"
          >
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddClassOpen(true)}
            aria-label="Add new class to schedule"
          >
            <CalendarIcon size={14} />
            <span>+ Add My Class</span>
          </button>
        </div>
      </div>

      {/* Spotlight Next Class */}
      <NextClassCard
        currentOrNextClass={spotlightClass}
        onNavigateToRoom={onNavigateToRoom}
      />

      {/* Day Selector Navigation Pills */}
      <div className="day-selector-wrapper">
        <div className="day-selector-pills" role="tablist" aria-label="Select day of week">
          {WEEKDAY_OPTIONS.map((day) => {
            const isSelected = selectedDay === day.id;
            const count = (courses || []).filter((c) => c.day === day.id).length;

            return (
              <button
                key={day.id}
                role="tab"
                aria-selected={isSelected}
                className={`day-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.id)}
              >
                <span className="day-name">{day.label}</span>
                <span className="day-count-badge">{count} classes</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Consecutive Transfer Alerts for the Selected Day */}
      <TransitAlert classesForDay={classesForDay} />

      {/* Day Timetable List */}
      <div className="classes-timeline-container">
        <div className="classes-header-row">
          <h3 className="day-title">
            {WEEKDAY_OPTIONS.find((d) => d.id === selectedDay)?.label} Timetable
          </h3>
          <div className="classes-count-actions">
            <span className="pill pill-blue">{classesForDay.length} Scheduled Sessions</span>
          </div>
        </div>

        {classesForDay.length === 0 ? (
          <div className="empty-state card text-center">
            <CheckCircleIcon size={36} className="text-emerald mb-2" />
            <h3>No Scheduled Classes for {WEEKDAY_OPTIONS.find((d) => d.id === selectedDay)?.label}</h3>
            <p>You have no classes entered for this day. Click "+ Add My Class" above to add your lecture or lab!</p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-2"
              onClick={() => setIsAddClassOpen(true)}
            >
              <CalendarIcon size={14} />
              <span>+ Add Class for {WEEKDAY_OPTIONS.find((d) => d.id === selectedDay)?.label}</span>
            </button>
          </div>
        ) : (
          <div className="classes-list">
            {classesForDay.map((course, idx) => {
              const googleCalUrl = generateGoogleCalendarUrl(course);
              const bldg = findBuilding(course.buildingId);
              const mapsUrl = generateGoogleMapsRouteUrl(null, bldg ? bldg.coords : null);

              return (
                <article key={course.id} className="class-card card" aria-labelledby={`class-title-${course.id}`}>
                  <div className="class-timeline-bullet">
                    <span className="bullet-number">{idx + 1}</span>
                  </div>

                  <div className="class-card-main">
                    <div className="class-top-row">
                      <div className="class-identity">
                        <span className="pill pill-blue">{course.courseCode}</span>
                        <span className="pill pill-purple">{course.type}</span>
                        <h4 id={`class-title-${course.id}`} className="class-name">
                          {course.courseName}
                        </h4>
                      </div>

                      <div className="class-right-slot">
                        <div className="class-time-slot">
                          <ClockIcon size={15} />
                          <strong>{course.startTime} - {course.endTime}</strong>
                        </div>

                        {onDeleteCourse && (
                          <button
                            type="button"
                            className="btn-icon-delete"
                            onClick={() => onDeleteCourse(course.id)}
                            title={`Remove ${course.courseCode} from timetable`}
                            aria-label={`Remove ${course.courseCode} from timetable`}
                          >
                            <XIcon size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="class-instructor">
                      Instructor: <strong>{course.instructor}</strong>
                    </p>

                    <p className="class-desc">{course.description}</p>

                    <div className="class-location-footer">
                      <div className="location-pill">
                        <MapPinIcon size={16} className="text-blue" />
                        <span><strong>{course.room}</strong> • {course.buildingName}</span>
                      </div>

                      <div className="class-action-buttons">
                        {/* 1-Click Google Calendar Import */}
                        <a
                          href={googleCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          aria-label={`Add ${course.courseCode} to Google Calendar (opens in new tab)`}
                        >
                          <CalendarIcon size={14} />
                          <span>Google Calendar</span>
                          <ExternalLinkIcon size={12} />
                        </a>

                        {/* Download .ics */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDownloadICal(course)}
                          aria-label={`Download .ics calendar file for ${course.courseCode}`}
                        >
                          {downloadedClassId === course.id ? (
                            <>
                              <CheckCircleIcon size={14} className="text-emerald" />
                              <span>Downloaded!</span>
                            </>
                          ) : (
                            <span>Export .ics</span>
                          )}
                        </button>

                        {/* Google Maps Directions */}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          aria-label={`Get directions to ${course.buildingName} on Google Maps`}
                        >
                          <NavigationIcon size={14} />
                          <span>Maps Route</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal to Add Custom Class */}
      <AddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onAddCourse={onAddCourse}
        initialDay={selectedDay}
      />
    </section>
  );
}
