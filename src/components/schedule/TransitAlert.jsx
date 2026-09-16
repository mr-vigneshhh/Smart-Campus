/**
 * CampuSphere - Transit Alert & Route Buffer Banner
 * Evaluates transit windows between consecutive classes to flag tight walking transfers.
 */

import React from 'react';
import { AlertTriangleIcon, NavigationIcon, ExternalLinkIcon } from '../common/Icons';
import { evaluateClassTransition, generateGoogleMapsRouteUrl, findBuilding } from '../../services/navigationService';

export function TransitAlert({ classesForDay }) {
  if (!classesForDay || classesForDay.length < 2) return null;

  // Find consecutive classes with tight transit
  const alerts = [];
  for (let i = 0; i < classesForDay.length - 1; i++) {
    const classA = classesForDay[i];
    const classB = classesForDay[i + 1];
    const evalResult = evaluateClassTransition(classA, classB);

    if (evalResult.isTight) {
      const bldgA = findBuilding(classA.buildingId);
      const bldgB = findBuilding(classB.buildingId);
      const mapsRouteUrl = generateGoogleMapsRouteUrl(
        bldgA ? bldgA.coords : null,
        bldgB ? bldgB.coords : null
      );

      alerts.push({
        classA,
        classB,
        evalResult,
        mapsRouteUrl,
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="transit-alerts-container" role="region" aria-label="Campus Transit Advisories">
      {alerts.map(({ classA, classB, evalResult, mapsRouteUrl }, idx) => (
        <div key={idx} className="transit-alert-card card animate-fade-in">
          <div className="transit-alert-icon-col">
            <AlertTriangleIcon size={24} className="text-amber" />
          </div>
          <div className="transit-alert-content">
            <div className="transit-alert-header">
              <span className="pill pill-amber">Tight Transit Window</span>
              <span className="transit-window-text">
                {evalResult.windowMinutes} mins available between {classA.endTime} and {classB.startTime}
              </span>
            </div>
            <p className="transit-alert-desc">
              Transfer between <strong>{classA.courseCode} ({classA.room})</strong> in {classA.buildingName} and{' '}
              <strong>{classB.courseCode} ({classB.room})</strong> in {classB.buildingName} requires an estimated{' '}
              <strong>~{evalResult.estimatedMinutes} mins</strong> walking transit ({evalResult.distanceMeters}m). Buffer remaining: ~{evalResult.bufferRemaining} mins.
            </p>
          </div>
          <div className="transit-alert-actions">
            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              aria-label={`View transfer walking route between ${classA.buildingName} and ${classB.buildingName} on Google Maps`}
            >
              <NavigationIcon size={14} className="text-blue" />
              <span>Route on Google Maps</span>
              <ExternalLinkIcon size={12} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
