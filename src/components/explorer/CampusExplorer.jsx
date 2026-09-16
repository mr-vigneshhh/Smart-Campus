/**
 * CampuSphere - Campus Explorer & Wayfinding View
 * Unifies search, zone filters, SVG interactive campus map, and floorplan modals.
 */

import React, { useState, useMemo } from 'react';
import { BUILDINGS, CAMPUS_ZONES } from '../../data/campusData';
import { BuildingCard } from './BuildingCard';
import { FloorPlanModal } from './FloorPlanModal';
import { InteractiveCampusMap } from './InteractiveCampusMap';
import { SearchIcon, MapPinIcon, CheckCircleIcon } from '../common/Icons';
import { findRoomLocation } from '../../services/navigationService';

export function CampusExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [activeBuildingModal, setActiveBuildingModal] = useState(null);
  const [highlightedBuildingId, setHighlightedBuildingId] = useState(null);

  // Check if search query matches a specific room (e.g. TH-101, LC-205)
  const roomSearchResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return findRoomLocation(searchQuery.trim());
  }, [searchQuery]);

  // Filter buildings by zone and text search
  const filteredBuildings = useMemo(() => {
    return BUILDINGS.filter((b) => {
      const matchesZone = selectedZone === 'all' || b.zone === selectedZone;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesZone;

      const matchesName = b.name.toLowerCase().includes(q);
      const matchesCode = b.code.toLowerCase().includes(q);
      const matchesDesc = b.description.toLowerCase().includes(q);
      const matchesAmenities = b.amenities.some((a) => a.toLowerCase().includes(q));
      const matchesRooms = b.floors.some((f) =>
        f.rooms.some((r) => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
      );

      return matchesZone && (matchesName || matchesCode || matchesDesc || matchesAmenities || matchesRooms);
    });
  }, [selectedZone, searchQuery]);

  const handleSelectBuildingFromMap = (bldg) => {
    setHighlightedBuildingId(bldg.id);
    setActiveBuildingModal(bldg);
  };

  return (
    <section className="campus-explorer-section" aria-labelledby="explorer-heading">
      {/* Section Header */}
      <div className="section-title-bar">
        <div>
          <h2 id="explorer-heading">Campus Wayfinding & Facilities</h2>
          <p>Find lecture halls, laboratories, quiet study floors, and step-free routes across campus.</p>
        </div>
      </div>

      {/* Interactive Blueprint Map */}
      <InteractiveCampusMap
        buildings={BUILDINGS}
        selectedBuildingId={highlightedBuildingId}
        onSelectBuilding={handleSelectBuildingFromMap}
      />

      {/* Search & Zone Filtering Controls */}
      <div className="explorer-controls-card card">
        <div className="explorer-search-row">
          <div className="search-input-wrapper">
            <SearchIcon size={18} className="search-icon-adornment" />
            <input
              type="search"
              className="search-input"
              placeholder="Search classrooms (e.g. TH-101), buildings, 3D printers, quiet desks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search campus facilities, classrooms, and buildings"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="zone-filter-pills" role="radiogroup" aria-label="Filter by Campus Zone">
            {CAMPUS_ZONES.map((zone) => (
              <button
                key={zone.id}
                role="radio"
                aria-checked={selectedZone === zone.id}
                className={`zone-pill ${selectedZone === zone.id ? 'active' : ''}`}
                onClick={() => setSelectedZone(zone.id)}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Instant Room Pinpoint Banner if user typed a room code */}
        {roomSearchResult && (
          <div className="room-pinpoint-alert animate-fade-in" role="status">
            <div className="pinpoint-info">
              <span className="pill pill-green">Direct Room Match</span>
              <strong>{roomSearchResult.room.id}: {roomSearchResult.room.name}</strong>
              <span>
                Located on <em>{roomSearchResult.floor.name}</em> inside <strong>{roomSearchResult.building.name}</strong>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActiveBuildingModal(roomSearchResult.building)}
            >
              Open Floor Plan
            </button>
          </div>
        )}
      </div>

      {/* Buildings Cards Grid */}
      <div className="buildings-results-header">
        <span className="results-count" aria-live="polite">
          Showing {filteredBuildings.length} of {BUILDINGS.length} campus facilities
        </span>
      </div>

      {filteredBuildings.length === 0 ? (
        <div className="empty-state card text-center">
          <MapPinIcon size={40} className="text-muted mb-2" />
          <h3>No matching campus locations found</h3>
          <p>Try searching for "Turing", "Library", "101", "Lab", or reset your zone filter.</p>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={() => {
              setSearchQuery('');
              setSelectedZone('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredBuildings.map((bldg) => (
            <BuildingCard
              key={bldg.id}
              building={bldg}
              isSelected={highlightedBuildingId === bldg.id}
              onSelectBuilding={(b) => {
                setHighlightedBuildingId(b.id);
                setActiveBuildingModal(b);
              }}
            />
          ))}
        </div>
      )}

      {/* Floor Plan Modal */}
      <FloorPlanModal
        building={activeBuildingModal}
        isOpen={!!activeBuildingModal}
        onClose={() => setActiveBuildingModal(null)}
      />
    </section>
  );
}
