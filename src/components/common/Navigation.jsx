/**
 * CampuSphere - Main Accessible Tab Navigation
 * Supports ARIA tablist patterns, keyboard navigation, and unread notification indicators.
 */

import React from 'react';
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  BellIcon,
  SparklesIcon,
  PhoneIcon
} from './Icons';

export function Navigation({ activeTab, onSelectTab, unreadNoticesCount = 0 }) {
  const navItems = [
    { id: 'explorer', label: 'Campus Map & Wayfinding', short: 'Explorer', icon: MapPinIcon },
    { id: 'schedule', label: 'My Timetable & Calendar', short: 'Schedule', icon: CalendarIcon },
    { id: 'occupancy', label: 'Live Study & Space Pulse', short: 'Occupancy', icon: UsersIcon },
    { id: 'notices', label: 'Notices & Bulletins', short: 'Notices', icon: BellIcon, count: unreadNoticesCount },
    { id: 'assistant', label: 'Gemini AI Concierge', short: 'Gemini AI', icon: SparklesIcon, highlight: true },
    { id: 'directory', label: 'Emergency & Directory', short: 'Directory', icon: PhoneIcon },
  ];

  return (
    <nav className="campus-nav-container" aria-label="Main Campus Navigation">
      <div className="campus-nav-inner" role="tablist" aria-orientation="horizontal">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`nav-tab-btn ${isActive ? 'active' : ''} ${item.highlight ? 'tab-highlight' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} className="nav-tab-icon" />
              <span className="nav-tab-label">{item.label}</span>
              <span className="nav-tab-label-short">{item.short}</span>

              {item.count > 0 && (
                <span className="nav-badge" aria-label={`${item.count} unread notices`}>
                  {item.count}
                </span>
              )}

              {item.highlight && (
                <span className="pill pill-purple ai-micro-badge">AI</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
