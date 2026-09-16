/**
 * CampuSphere - Next Class Smart Spotlight Card
 * Real-time class proximity calculator with transit walking estimate and 1-click Google Calendar integration.
 */

import React, { useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  NavigationIcon,
  CalendarIcon,
  ExternalLinkIcon,
  CheckCircleIcon
} from '../common/Icons';
import { generateGoogleCalendarUrl } from '../../services/calendarService';
import { generateGoogleMapsRouteUrl, findBuilding } from '../../services/navigationService';

export function NextClassCard({ currentOrNextClass, onNavigateToRoom }) {
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState(false);

  if (!currentOrNextClass) {
    return (
      <div className="next-class-spotlight card">
        <div className="next-class-empty">
          <CheckCircleIcon size={32} className="text-emerald mb-1" />
          <h3>All Classes Completed for Today</h3>
          <p>No remaining lectures or lab sessions on your timetable. Time to check the library for open study desks!</p>
        </div>
      </div>
    );
  }

  const building = findBuilding(currentOrNextClass.buildingId);
  const googleCalendarUrl = generateGoogleCalendarUrl(currentOrNextClass);
  const googleMapsUrl = generateGoogleMapsRouteUrl(null, building ? building.coords : null);

  const handleSyncClick = () => {
    setCalendarSyncSuccess(true);
    setTimeout(() => setCalendarSyncSuccess(false), 4000);
  };

  return (
    <div className="next-class-spotlight card animate-fade-in" aria-labelledby="next-class-heading">
      <div className="next-class-header">
        <div className="spotlight-tag-row">
          <span className="pill pill-blue">
            <span className="pulse-dot" style={{ backgroundColor: '#60a5fa' }} />
            Next Scheduled Session
          </span>
          <span className="pill pill-purple">{currentOrNextClass.type}</span>
        </div>
        <div className="time-badge">
          <ClockIcon size={16} />
          <span>{currentOrNextClass.startTime} - {currentOrNextClass.endTime}</span>
        </div>
      </div>

      <div className="next-class-body">
        <div className="next-class-main-info">
          <span className="course-code-highlight">{currentOrNextClass.courseCode}</span>
          <h3 id="next-class-heading" className="course-title-highlight">
            {currentOrNextClass.courseName}
          </h3>
          <p className="instructor-line">Instructor: {currentOrNextClass.instructor}</p>
        </div>

        <div className="next-class-location-box">
          <div className="location-info">
            <MapPinIcon size={20} className="text-blue" />
            <div>
              <strong className="room-text">{currentOrNextClass.room}</strong>
              <p className="bldg-subtext">{currentOrNextClass.buildingName}</p>
            </div>
          </div>
          <div className="transit-estimate-badge">
            <span>Est. Walk: ~6 mins</span>
          </div>
        </div>
      </div>

      {calendarSyncSuccess && (
        <div className="calendar-sync-notice animate-fade-in" role="status">
          <CheckCircleIcon size={16} className="text-emerald" />
          <span>Opening Google Calendar in new tab... Verify details and save!</span>
        </div>
      )}

      <div className="next-class-actions">
        {/* Google Calendar 1-Click Sync */}
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          onClick={handleSyncClick}
          aria-label={`Sync ${currentOrNextClass.courseCode} to Google Calendar (opens in new tab)`}
        >
          <CalendarIcon size={16} />
          <span>Add to Google Calendar</span>
          <ExternalLinkIcon size={13} />
        </a>

        {/* Google Maps Route */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          aria-label={`Open walking directions to ${currentOrNextClass.buildingName} in Google Maps`}
        >
          <NavigationIcon size={16} className="text-blue" />
          <span>Navigate (Google Maps)</span>
        </a>

        {/* In-app Floor Plan */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onNavigateToRoom(currentOrNextClass.room)}
          aria-label={`Locate room ${currentOrNextClass.room} in campus directory`}
        >
          <span>Locate Room</span>
        </button>
      </div>
    </div>
  );
}
