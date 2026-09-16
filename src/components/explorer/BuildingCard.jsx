/**
 * CampuSphere - Building Card Component
 * Detailed building showcase with amenity tags, accessibility status, and direct Google Maps deep links.
 */

import React from 'react';
import {
  MapPinIcon,
  NavigationIcon,
  LayersIcon,
  ClockIcon,
  ExternalLinkIcon,
  CheckCircleIcon
} from '../common/Icons';
import { generateGoogleMapsBuildingUrl } from '../../services/navigationService';

export function BuildingCard({ building, onSelectBuilding, isSelected }) {
  const googleMapsUrl = generateGoogleMapsBuildingUrl(building);

  // Compute total rooms in building
  const totalRooms = building.floors.reduce((acc, f) => acc + f.rooms.length, 0);

  return (
    <article
      className={`building-card card ${isSelected ? 'building-card-selected' : ''}`}
      aria-labelledby={`bldg-title-${building.id}`}
    >
      <div className="bldg-card-header">
        <div>
          <div className="bldg-code-row">
            <span className="pill pill-blue bldg-code-pill">{building.code}</span>
            <span className="pill pill-purple">{building.category}</span>
          </div>
          <h3 id={`bldg-title-${building.id}`} className="bldg-card-title">
            {building.name}
          </h3>
        </div>
      </div>

      <p className="bldg-card-desc">{building.description}</p>

      {/* Building stats */}
      <div className="bldg-meta-grid">
        <div className="bldg-meta-item">
          <ClockIcon size={15} className="text-muted" />
          <span>{building.openHours}</span>
        </div>
        <div className="bldg-meta-item">
          <LayersIcon size={15} className="text-muted" />
          <span>{building.floors.length} Floors • {totalRooms} Listed Rooms</span>
        </div>
      </div>

      {/* Accessibility badging */}
      <div className="bldg-access-chips" aria-label="Accessibility Features">
        {building.accessibility.wheelchairAccessible && (
          <span className="pill pill-green access-pill" title="Wheelchair Accessible">
            <CheckCircleIcon size={12} /> Step-free ADA
          </span>
        )}
        {building.accessibility.elevator && (
          <span className="pill pill-blue access-pill" title="Elevator Equipped">
            Elevator
          </span>
        )}
        {building.accessibility.brailleSignage && (
          <span className="pill pill-purple access-pill" title="Braille Signage">
            Braille
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bldg-actions-row">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onSelectBuilding(building)}
          aria-label={`Explore floors and rooms in ${building.name}`}
        >
          <LayersIcon size={15} />
          <span>Floor Directory</span>
        </button>

        {/* Google Maps Deep Link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          aria-label={`Navigate to ${building.name} on Google Maps (opens in new tab)`}
        >
          <NavigationIcon size={15} className="text-blue" />
          <span>Google Maps</span>
          <ExternalLinkIcon size={13} className="text-muted" />
        </a>
      </div>
    </article>
  );
}
