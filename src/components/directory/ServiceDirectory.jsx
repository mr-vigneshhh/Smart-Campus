/**
 * CampuSphere - Campus Services Directory & Emergency Support
 * Directory of student health, safety, IT help desk, shuttle lines, and academic offices.
 */

import React, { useState } from 'react';
import { CAMPUS_SERVICES, SERVICE_CATEGORIES } from '../../data/servicesData';
import { CAMPUS_METADATA } from '../../data/campusData';
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  NavigationIcon
} from '../common/Icons';

export function ServiceDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = CAMPUS_SERVICES.filter((svc) => {
    if (selectedCategory === 'all') return true;
    return svc.category === selectedCategory;
  });

  return (
    <section className="directory-section" aria-labelledby="directory-heading">
      <div className="section-title-bar">
        <div>
          <h2 id="directory-heading">Campus Services & Safety Hub</h2>
          <p>Verified university support offices, 24/7 security dispatch, student health, and shuttle routes.</p>
        </div>
      </div>

      {/* Emergency Immediate Action Banner */}
      <div className="emergency-hero-banner card" role="alert" aria-label="Campus Emergency Contacts">
        <div className="emergency-hero-left">
          <div className="emergency-shield-icon">
            <ShieldCheckIcon size={28} />
          </div>
          <div>
            <span className="pill pill-rose">Immediate Assistance 24/7</span>
            <h3 className="emergency-hero-title">Campus Police & Emergency Dispatch</h3>
            <p className="emergency-hero-desc">
              For on-campus medical emergencies, crime reporting, blue-light pole monitoring, or urgent night safety escorts:
            </p>
          </div>
        </div>

        <div className="emergency-hero-right">
          <a
            href={`tel:${CAMPUS_METADATA.emergencyPhone.replace(/-/g, '')}`}
            className="btn btn-danger btn-emergency"
            aria-label={`Call Campus Emergency Dispatch at ${CAMPUS_METADATA.emergencyPhone}`}
          >
            <PhoneIcon size={18} />
            <span>Call {CAMPUS_METADATA.emergencyPhone}</span>
          </a>
          <span className="emergency-subtext">Non-emergency line: 650-723-2222</span>
        </div>
      </div>

      {/* Service Category Filter Pills */}
      <div className="directory-filter-pills" role="radiogroup" aria-label="Filter campus services">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="radio"
            aria-checked={selectedCategory === cat.id}
            className={`zone-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid-2">
        {filteredServices.map((svc) => (
          <article key={svc.id} className="service-card card" aria-labelledby={`service-title-${svc.id}`}>
            <div className="service-card-top">
              <div>
                <span className={`pill ${svc.isUrgent ? 'pill-rose' : 'pill-blue'}`}>
                  {svc.badge}
                </span>
                <h3 id={`service-title-${svc.id}`} className="service-name">
                  {svc.name}
                </h3>
              </div>
            </div>

            <p className="service-desc">{svc.description}</p>

            {/* Shuttle Routes Subcard if Transportation */}
            {svc.routes && (
              <div className="shuttle-routes-box">
                <span className="shuttle-box-title">Active Shuttle Lines:</span>
                <div className="shuttle-lines-list">
                  {svc.routes.map((route, rIdx) => (
                    <div key={rIdx} className="shuttle-line-item">
                      <span className="route-name">{route.name}</span>
                      <div className="route-meta">
                        <span className="pill pill-green">{route.frequency}</span>
                        <span className="route-status">{route.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Contact Metadata */}
            <div className="service-meta-list">
              <div className="service-meta-item">
                <PhoneIcon size={15} className="text-muted" />
                <a href={`tel:${svc.phone.replace(/-/g, '')}`} className="service-phone-link">
                  {svc.phone}
                </a>
              </div>

              <div className="service-meta-item">
                <MapPinIcon size={15} className="text-muted" />
                <span>{svc.location}</span>
              </div>

              <div className="service-meta-item">
                <ClockIcon size={15} className="text-muted" />
                <span>{svc.hours}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="service-card-footer">
              <a
                href={svc.actionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                aria-label={`${svc.quickAction} (opens external portal)`}
              >
                <span>{svc.quickAction}</span>
                <ExternalLinkIcon size={13} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
