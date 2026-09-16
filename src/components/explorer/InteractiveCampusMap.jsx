/**
 * CampuSphere - Interactive Campus Vector Blueprint
 * Accessible SVG-based interactive campus layout with interactive buildings,
 * walking paths, and Google Maps integration triggers.
 */

import React from 'react';
import { NavigationIcon, ExternalLinkIcon } from '../common/Icons';
import { CAMPUS_METADATA } from '../../data/campusData';

export function InteractiveCampusMap({ buildings, selectedBuildingId, onSelectBuilding }) {
  // Building vector positions on the campus coordinate grid (600 x 400 SVG viewBox)
  const mapLayout = {
    'turing-hall': { x: 120, y: 80, width: 140, height: 90, label: 'Turing Hall (TH)', code: 'TH', color: '#3b82f6' },
    'ada-lovelace-center': { x: 380, y: 70, width: 150, height: 95, label: 'Ada Lovelace (LC)', code: 'LC', color: '#8b5cf6' },
    'alexandria-library': { x: 230, y: 190, width: 160, height: 100, label: 'Alexandria Library (LIB)', code: 'LIB', color: '#10b981' },
    'horizon-commons': { x: 350, y: 300, width: 170, height: 80, label: 'Student Union (SU)', code: 'SU', color: '#f59e0b' },
    'olympus-rec-center': { x: 40, y: 250, width: 130, height: 110, label: 'Olympus Rec (REC)', code: 'REC', color: '#ec4899' },
  };

  const googleMapsFullCampusUrl = `https://www.google.com/maps/search/?api=1&query=${CAMPUS_METADATA.centerCoords.lat},${CAMPUS_METADATA.centerCoords.lng}+(${encodeURIComponent(CAMPUS_METADATA.name)})`;

  return (
    <div className="campus-map-wrapper card">
      <div className="campus-map-header">
        <div>
          <h3 className="campus-map-title">Interactive Campus Blueprint</h3>
          <p className="campus-map-subtitle">Click any building to inspect floor plans, facilities, and walking routes</p>
        </div>
        <a
          href={googleMapsFullCampusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          aria-label="View full campus on Google Maps satellite (opens in new tab)"
        >
          <NavigationIcon size={14} className="text-blue" />
          <span>Live Google Satellite Map</span>
          <ExternalLinkIcon size={12} />
        </a>
      </div>

      <div className="svg-map-container" role="region" aria-label="Campus Blueprint Map">
        <svg
          viewBox="0 0 600 400"
          className="campus-svg-blueprint"
          aria-label="Interactive map of university campus buildings"
        >
          {/* Ground and Zones Background */}
          <rect width="600" height="400" rx="16" fill="var(--bg-primary)" />

          {/* Central Quad Lawn & Paths */}
          <ellipse cx="300" cy="200" rx="180" ry="120" fill="rgba(16, 185, 129, 0.06)" stroke="rgba(16, 185, 129, 0.15)" strokeDasharray="4 4" />
          
          {/* Walking Arteries / Interconnecting Pathways */}
          <path d="M 190 125 L 310 240 L 455 115" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 105 305 L 230 240 L 435 340" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 310 240 L 310 340" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" strokeLinecap="round" />

          {/* Central Quad Marker */}
          <text x="310" y="180" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600" letterSpacing="2">
            MAIN UNIVERSITY QUAD
          </text>

          {/* Render Buildings as Interactive Blocks */}
          {buildings.map((bldg) => {
            const layout = mapLayout[bldg.id];
            if (!layout) return null;
            const isSelected = selectedBuildingId === bldg.id;

            return (
              <g
                key={bldg.id}
                className={`map-bldg-group ${isSelected ? 'selected' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${bldg.name}, code ${bldg.code}. Click to inspect.`}
                onClick={() => onSelectBuilding(bldg)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectBuilding(bldg);
                  }
                }}
              >
                {/* Building Base & Shadow */}
                <rect
                  x={layout.x}
                  y={layout.y}
                  width={layout.width}
                  height={layout.height}
                  rx="10"
                  className="bldg-rect"
                  style={{
                    fill: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    stroke: isSelected ? 'var(--border-focus)' : 'var(--border-strong)',
                    strokeWidth: isSelected ? 3 : 1.5,
                  }}
                />

                {/* Accent Header Bar */}
                <rect
                  x={layout.x}
                  y={layout.y}
                  width={layout.width}
                  height="6"
                  rx="3"
                  fill={layout.color}
                />

                {/* Building Code Badge */}
                <rect
                  x={layout.x + 8}
                  y={layout.y + 12}
                  width="36"
                  height="18"
                  rx="4"
                  fill={layout.color}
                  opacity="0.2"
                />
                <text
                  x={layout.x + 26}
                  y={layout.y + 25}
                  textAnchor="middle"
                  fill={layout.color}
                  fontSize="10"
                  fontWeight="700"
                >
                  {layout.code}
                </text>

                {/* Building Name */}
                <text
                  x={layout.x + 8}
                  y={layout.y + 46}
                  fill="var(--text-primary)"
                  fontSize="12"
                  fontWeight="600"
                >
                  {bldg.name.length > 18 ? bldg.name.slice(0, 16) + '…' : bldg.name}
                </text>

                {/* Building Floor Info */}
                <text
                  x={layout.x + 8}
                  y={layout.y + 64}
                  fill="var(--text-secondary)"
                  fontSize="10"
                >
                  {bldg.floors.length} Levels • {bldg.category.split('&')[0]}
                </text>

                {/* Selection Indicator Beacon */}
                {isSelected && (
                  <circle
                    cx={layout.x + layout.width - 14}
                    cy={layout.y + 18}
                    r="5"
                    fill="var(--accent-primary)"
                    className="pulse-dot"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
