/**
 * CampuSphere - Floor Plan & Room Directory Modal
 * Displays floor-by-floor breakdown, room amenities, and direct route navigation.
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  LayersIcon,
  NavigationIcon,
  ExternalLinkIcon,
  UsersIcon,
  CheckCircleIcon
} from '../common/Icons';
import { generateGoogleMapsBuildingUrl } from '../../services/navigationService';

export function FloorPlanModal({ building, isOpen, onClose }) {
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);

  if (!building) return null;

  const currentFloor = building.floors[selectedFloorIndex] || building.floors[0];
  const mapsUrl = generateGoogleMapsBuildingUrl(building);

  const getRoomBadgeColor = (type) => {
    switch (type) {
      case 'classroom': return 'pill-blue';
      case 'lab': return 'pill-purple';
      case 'study': return 'pill-green';
      case 'dining': return 'pill-amber';
      case 'service': return 'pill-rose';
      default: return 'pill-blue';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${building.name} (${building.code}) - Floor Directory`}
      maxWidth="780px"
    >
      <div className="floorplan-container">
        {/* Quick Building Overview Header */}
        <div className="floorplan-meta-banner">
          <div>
            <p className="floorplan-bldg-subtitle">{building.category} • {building.openHours}</p>
            <p className="floorplan-access-note">
              <strong>Accessibility:</strong> Ramps: {building.accessibility.rampEntrance} | Restrooms: {building.accessibility.accessibleRestrooms}
            </p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <NavigationIcon size={14} />
            <span>Google Maps GPS</span>
            <ExternalLinkIcon size={12} />
          </a>
        </div>

        {/* Floor Level Selector Tabs */}
        <div className="floor-selector-pills" role="tablist" aria-label="Floor levels">
          {building.floors.map((floor, idx) => (
            <button
              key={floor.floorNumber}
              role="tab"
              aria-selected={selectedFloorIndex === idx}
              aria-controls={`floor-panel-${floor.floorNumber}`}
              className={`floor-btn ${selectedFloorIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedFloorIndex(idx)}
            >
              Floor {floor.floorNumber}
            </button>
          ))}
        </div>

        {/* Selected Floor Content */}
        <div
          id={`floor-panel-${currentFloor.floorNumber}`}
          role="tabpanel"
          className="floor-panel-content animate-fade-in"
        >
          <div className="floor-title-row">
            <h3 className="floor-name">{currentFloor.name}</h3>
            <span className="pill pill-blue">{currentFloor.rooms.length} Spaces on this level</span>
          </div>

          <div className="rooms-grid">
            {currentFloor.rooms.map((room) => (
              <div key={room.id} className="room-card card">
                <div className="room-card-top">
                  <span className="room-id-badge">{room.id}</span>
                  <span className={`pill ${getRoomBadgeColor(room.type)}`}>
                    {room.type.toUpperCase()}
                  </span>
                </div>

                <h4 className="room-name">{room.name}</h4>

                <div className="room-meta-info">
                  {room.capacity && (
                    <div className="room-meta-item">
                      <UsersIcon size={14} />
                      <span>Capacity: {room.capacity} seats</span>
                    </div>
                  )}

                  {room.quietLevel && (
                    <div className="room-meta-item text-green">
                      <CheckCircleIcon size={14} />
                      <span>{room.quietLevel}</span>
                    </div>
                  )}

                  {room.equipment && (
                    <div className="room-meta-item">
                      <LayersIcon size={14} />
                      <span>Gear: {room.equipment}</span>
                    </div>
                  )}

                  {room.walkInHours && (
                    <div className="room-meta-item">
                      <span>Hours: {room.walkInHours}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Amenities */}
        <div className="building-amenities-section">
          <h4 className="amenities-title">Building Amenities</h4>
          <div className="amenities-chips">
            {building.amenities.map((item, i) => (
              <span key={i} className="amenity-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
