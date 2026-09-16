/**
 * CampuSphere - Google Calendar & iCal Integration Service
 * Generates standards-compliant Google Calendar direct import URLs and downloadable .ics files.
 */

/**
 * Format date and time into Google Calendar / iCal compact UTC format: YYYYMMDDTHHmmSSZ
 * @param {Date} date - Javascript Date object
 * @returns {string} - Formatted ISO-like UTC string without dashes or colons
 */
export function formatCalendarTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Calculates next occurrence of a given weekday and time string.
 * @param {'mon'|'tue'|'wed'|'thu'|'fri'} dayCode - Three letter day
 * @param {string} timeStr - "HH:mm" (24-hour format)
 * @param {Date} [referenceDate] - Base reference date (defaults to now)
 * @returns {Date} - Date object for next session
 */
export function getNextSessionDate(dayCode, timeStr, referenceDate = new Date()) {
  const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  const targetDay = dayMap[dayCode.toLowerCase()] ?? 1;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(referenceDate);

  const currentDay = result.getDay();
  let dayOffset = targetDay - currentDay;

  // If same day but time has already passed, schedule for next week
  if (dayOffset < 0 || (dayOffset === 0 && (result.getHours() > hours || (result.getHours() === hours && result.getMinutes() >= minutes)))) {
    dayOffset += 7;
  }

  result.setDate(result.getDate() + dayOffset);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Generates a valid Google Calendar direct event URL.
 * Specification: https://calendar.google.com/calendar/render?action=TEMPLATE
 *
 * @param {Object} event - Event object
 * @param {string} event.courseCode - e.g. "CS 301"
 * @param {string} event.courseName - e.g. "Distributed Systems"
 * @param {string} event.buildingName - e.g. "Alan Turing Hall"
 * @param {string} event.room - e.g. "TH-101"
 * @param {string} event.day - "mon"
 * @param {string} event.startTime - "09:00"
 * @param {string} event.endTime - "10:15"
 * @param {string} [event.instructor] - Instructor name
 * @param {string} [event.description] - Course synopsis
 * @returns {string} - Google Calendar direct template URL
 */
export function generateGoogleCalendarUrl(event) {
  if (!event || !event.startTime || !event.endTime) {
    throw new Error('Invalid event payload for Google Calendar generation');
  }

  const startTarget = getNextSessionDate(event.day || 'mon', event.startTime);
  const [endHours, endMinutes] = event.endTime.split(':').map(Number);
  const endTarget = new Date(startTarget);
  endTarget.setHours(endHours, endMinutes, 0, 0);

  const datesParam = `${formatCalendarTimestamp(startTarget)}/${formatCalendarTimestamp(endTarget)}`;
  const title = encodeURIComponent(`[${event.courseCode}] ${event.courseName}`);
  const location = encodeURIComponent(`${event.room}, ${event.buildingName}, Horizon University`);
  const details = encodeURIComponent(
    `Class: ${event.courseCode} - ${event.courseName}\n` +
    `Instructor: ${event.instructor || 'TBD'}\n` +
    `Room: ${event.room} (${event.buildingName})\n` +
    `Overview: ${event.description || 'Academic class session'}\n\n` +
    `Synced via CampuSphere Smart Campus Assistant`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}&sprop=name:CampuSphere`;
}

/**
 * Generates an RFC 5545 compliant iCalendar string for universal calendar export.
 * @param {Object} event - Event object
 * @returns {string} - iCalendar file content
 */
export function generateICalContent(event) {
  const startTarget = getNextSessionDate(event.day || 'mon', event.startTime);
  const [endHours, endMinutes] = event.endTime.split(':').map(Number);
  const endTarget = new Date(startTarget);
  endTarget.setHours(endHours, endMinutes, 0, 0);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampuSphere//Smart Campus Assistant//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id || 'event'}-${Date.now()}@campussphere.horizon.edu`,
    `DTSTAMP:${formatCalendarTimestamp(new Date())}`,
    `DTSTART:${formatCalendarTimestamp(startTarget)}`,
    `DTEND:${formatCalendarTimestamp(endTarget)}`,
    `SUMMARY:[${event.courseCode}] ${event.courseName}`,
    `LOCATION:${event.room}, ${event.buildingName}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
