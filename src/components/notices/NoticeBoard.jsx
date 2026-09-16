/**
 * CampuSphere - Official Campus Notices & Emergency Bulletins
 * Urgent university announcements, facility maintenance advisories, and department notices.
 */

import React, { useState, useMemo } from 'react';
import { CAMPUS_NOTICES, NOTICE_CATEGORIES } from '../../data/noticesData';
import {
  BellIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from '../common/Icons';

export function NoticeBoard({ onNavigateTab, onNavigateToBuildingCode }) {
  const [notices, setNotices] = useState(CAMPUS_NOTICES);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleToggleRead = (id) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'urgent') return n.priority === 'urgent';
      return n.category === selectedCategory;
    });
  }, [notices, selectedCategory]);

  const unreadCount = notices.filter((n) => !n.read).length;

  const handleActionClick = (notice) => {
    // Mark as read when student acts on it
    setNotices((prev) =>
      prev.map((n) => (n.id === notice.id ? { ...n, read: true } : n))
    );

    if (notice.actionTarget === 'turing-hall') {
      onNavigateToBuildingCode('turing-hall');
    } else if (notice.actionTarget === 'schedule') {
      onNavigateTab('schedule');
    } else if (notice.actionTarget === 'services') {
      onNavigateTab('directory');
    } else if (notice.actionTarget === 'occupancy') {
      onNavigateTab('occupancy');
    }
  };

  return (
    <section className="notices-section" aria-labelledby="notices-heading">
      <div className="section-title-bar">
        <div>
          <h2 id="notices-heading">Campus Notices & Emergency Bulletins</h2>
          <p>Official alerts, registrar deadlines, facility maintenance, and transit detours.</p>
        </div>

        <div className="notices-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllRead}
              aria-label="Mark all notices as read"
            >
              <CheckCircleIcon size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="notices-categories-wrapper" role="radiogroup" aria-label="Filter notices by category">
        {NOTICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = notices.filter((n) => {
            if (cat.id === 'all') return true;
            if (cat.id === 'urgent') return n.priority === 'urgent';
            return n.category === cat.id;
          }).length;

          return (
            <button
              key={cat.id}
              role="radio"
              aria-checked={isSelected}
              className={`zone-pill ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="cat-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Notices List */}
      <div className="notices-list">
        {filteredNotices.length === 0 ? (
          <div className="empty-state card text-center">
            <CheckCircleIcon size={36} className="text-emerald mb-2" />
            <h3>No bulletins in this category</h3>
            <p>You're all caught up with campus announcements!</p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isUrgent = notice.priority === 'urgent';

            return (
              <article
                key={notice.id}
                className={`notice-card card ${!notice.read ? 'notice-unread' : ''} ${isUrgent ? 'notice-urgent-border' : ''}`}
                aria-labelledby={`notice-title-${notice.id}`}
              >
                <div className="notice-card-top">
                  <div className="notice-badge-group">
                    {isUrgent ? (
                      <span className="pill pill-rose">
                        <AlertTriangleIcon size={12} />
                        URGENT
                      </span>
                    ) : notice.priority === 'important' ? (
                      <span className="pill pill-amber">IMPORTANT</span>
                    ) : (
                      <span className="pill pill-blue">ANNOUNCEMENT</span>
                    )}

                    <span className="notice-dept-tag">{notice.department}</span>
                  </div>

                  <div className="notice-meta-right">
                    <span className="notice-timestamp">{notice.postedDate}</span>
                    <button
                      type="button"
                      className={`read-toggle-btn ${notice.read ? 'is-read' : 'is-unread'}`}
                      onClick={() => handleToggleRead(notice.id)}
                      title={notice.read ? 'Mark as unread' : 'Mark as read'}
                      aria-label={notice.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <span className="read-dot" />
                      <span>{notice.read ? 'Read' : 'New'}</span>
                    </button>
                  </div>
                </div>

                <h3 id={`notice-title-${notice.id}`} className="notice-title">
                  {notice.title}
                </h3>

                <p className="notice-summary">{notice.summary}</p>

                {notice.actionText && (
                  <div className="notice-footer-action">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleActionClick(notice)}
                      aria-label={`${notice.actionText} for ${notice.title}`}
                    >
                      <span>{notice.actionText}</span>
                      <ChevronRightIcon size={14} />
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
