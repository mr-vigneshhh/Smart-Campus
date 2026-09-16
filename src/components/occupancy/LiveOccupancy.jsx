/**
 * CampuSphere - Live Campus Pulse & Study Space Occupancy
 * Real-time study desk density, quiet score metrics, and power outlet availability.
 */

import React, { useState } from 'react';
import { REALTIME_OCCUPANCY } from '../../data/campusData';
import {
  UsersIcon,
  WifiIcon,
  BatteryChargingIcon,
  NavigationIcon,
  CheckCircleIcon,
  ExternalLinkIcon
} from '../common/Icons';
import { findBuilding, generateGoogleMapsBuildingUrl } from '../../services/navigationService';

export function LiveOccupancy({ onNavigateToBuilding }) {
  const [occupancyData, setOccupancyData] = useState(REALTIME_OCCUPANCY);
  const [filterType, setFilterType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate live telemetry sensor ping with slight realistic variation
    setTimeout(() => {
      setOccupancyData((prev) =>
        prev.map((item) => {
          const delta = Math.floor(Math.random() * 7) - 3;
          const newOccupants = Math.max(5, Math.min(item.capacity, item.currentOccupants + delta));
          const pct = Math.round((newOccupants / item.capacity) * 100);
          let status = `Available (${pct}%)`;
          if (pct > 80) status = `Busy (${pct}%)`;
          else if (pct > 50) status = `Moderate (${pct}%)`;

          return {
            ...item,
            currentOccupants: newOccupants,
            status,
            lastUpdated: 'Just now'
          };
        })
      );
      setRefreshing(false);
    }, 400);
  };

  const getOccupancyColor = (current, capacity) => {
    const ratio = current / capacity;
    if (ratio >= 0.8) return { bar: 'var(--accent-rose)', pill: 'pill-rose' };
    if (ratio >= 0.5) return { bar: 'var(--accent-amber)', pill: 'pill-amber' };
    return { bar: 'var(--accent-emerald)', pill: 'pill-green' };
  };

  const filteredItems = occupancyData.filter((item) => {
    if (filterType === 'study') return item.quietScore >= 60;
    if (filterType === 'busy') return (item.currentOccupants / item.capacity) >= 0.7;
    if (filterType === 'quiet') return item.quietScore >= 80;
    return true;
  });

  return (
    <section className="occupancy-section" aria-labelledby="occupancy-heading">
      <div className="section-title-bar">
        <div>
          <h2 id="occupancy-heading">Live Campus Pulse & Study Spaces</h2>
          <p>Real-time desk occupancy, acoustic noise levels, and available power charging outlets across campus hubs.</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Refresh live sensor readings"
        >
          <span className={`pulse-dot ${refreshing ? 'animate-spin' : ''}`} style={{ backgroundColor: '#10b981' }} />
          <span>{refreshing ? 'Updating Sensors…' : 'Refresh Telemetry'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="occupancy-filter-pills" role="radiogroup" aria-label="Filter study spots">
        <button
          type="button"
          role="radio"
          aria-checked={filterType === 'all'}
          className={`zone-pill ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Monitored Spaces
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={filterType === 'quiet'}
          className={`zone-pill ${filterType === 'quiet' ? 'active' : ''}`}
          onClick={() => setFilterType('quiet')}
        >
          Silent Study Sanctum (Strict Silence)
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={filterType === 'study'}
          className={`zone-pill ${filterType === 'study' ? 'active' : ''}`}
          onClick={() => setFilterType('study')}
        >
          Productive Study Spots
        </button>
      </div>

      {/* Occupancy Gauges Grid */}
      <div className="grid-2">
        {filteredItems.map((item) => {
          const pct = Math.round((item.currentOccupants / item.capacity) * 100);
          const colorTheme = getOccupancyColor(item.currentOccupants, item.capacity);
          const bldg = findBuilding(item.buildingId);
          const mapsUrl = generateGoogleMapsBuildingUrl(bldg);

          return (
            <article key={item.facilityId} className="occupancy-card card" aria-labelledby={`facility-title-${item.facilityId}`}>
              <div className="occupancy-card-top">
                <div>
                  <span className={`pill ${colorTheme.pill}`}>{item.status}</span>
                  <h3 id={`facility-title-${item.facilityId}`} className="facility-name">
                    {item.name}
                  </h3>
                  <span className="facility-floor-text">{item.floor} • Updated {item.lastUpdated}</span>
                </div>

                <div className="occupancy-circle-badge">
                  <span className="occupancy-pct">{pct}%</span>
                  <span className="occupancy-label">Full</span>
                </div>
              </div>

              {/* Progress Gauge Bar */}
              <div
                className="occupancy-progress-track"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Occupancy at ${pct}%`}
              >
                <div
                  className="occupancy-progress-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: colorTheme.bar,
                  }}
                />
              </div>

              {/* Facility Metrics Matrix */}
              <div className="occupancy-metrics-matrix">
                <div className="metric-box">
                  <span className="metric-label">Headcount</span>
                  <strong className="metric-val">{item.currentOccupants} / {item.capacity}</strong>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Acoustic Noise</span>
                  <strong className="metric-val">{item.noiseLevel}</strong>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Power Outlets</span>
                  <strong className="metric-val text-emerald">
                    <BatteryChargingIcon size={14} className="inline-icon" /> {item.powerOutletsAvailable} Open
                  </strong>
                </div>
              </div>

              {/* Overflow Recommendation if >75% */}
              {pct >= 75 && item.bestAlternative !== 'Self' && (
                <div className="alternative-alert-box">
                  <span className="pill pill-amber">High Demand Warning</span>
                  <p>Recommended alternative: <strong>{item.bestAlternative}</strong></p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="occupancy-card-footer">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  aria-label={`Directions to ${item.name} on Google Maps`}
                >
                  <NavigationIcon size={14} className="text-blue" />
                  <span>Google Maps</span>
                  <ExternalLinkIcon size={12} />
                </a>

                {bldg && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigateToBuilding(bldg)}
                  >
                    <span>View Building Info</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
