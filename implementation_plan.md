# Smart Campus Assistant: "CampuSphere"

CampuSphere is a high-performance, accessible, and intelligent campus assistant platform designed to eliminate campus navigation friction, streamline daily student schedules, provide live facility occupancy alerts, and unify urgent academic notices into an intuitive, responsive student dashboard.

## User Review Required

> [!IMPORTANT]
> - **Tech Stack**: React 18 + Vite with Modern Vanilla CSS design system.
> - **Google Services Integrated**:
>   1. **Google Gemini AI Campus Concierge**: Instant natural language queries for campus policies, room navigation, and deadlines with robust fallback mode.
>   2. **Google Maps Campus Wayfinding**: Deep links with real campus coordinates + interactive vector campus blueprint.
>   3. **Google Calendar 1-Click Sync**: Direct calendar integration for lectures, labs, and campus events.
> - **Evaluation Criteria Addressed**:
>   1. *Code Quality*: Clean modular architecture, separated data/logic/UI, custom hooks, zero dead code.
>   2. *Security*: Zero hardcoded secrets, safe input sanitization, `.env.example`, safe external links.
>   3. *Efficiency*: Lightweight footprint, sub-second renders, memoized filtering.
>   4. *Testing*: Automated Vitest unit and integration test suite.
>   5. *Accessibility*: WCAG 2.1 AA compliant, semantic HTML, keyboard accessible, ARIA live regions.
>   6. *Google Services*: Tri-service integration (Gemini, Maps, Calendar).

## Proposed Architecture & Structure

```
c:/TESTING/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── StatBadge.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── StatusPill.jsx
│   │   │   └── Modal.jsx
│   │   ├── explorer/
│   │   │   ├── CampusExplorer.jsx
│   │   │   ├── BuildingCard.jsx
│   │   │   └── FloorPlanModal.jsx
│   │   ├── schedule/
│   │   │   ├── ScheduleManager.jsx
│   │   │   ├── NextClassCard.jsx
│   │   │   └── TransitAlert.jsx
│   │   ├── occupancy/
│   │   │   ├── LiveOccupancy.jsx
│   │   │   └── OccupancyGauge.jsx
│   │   ├── notices/
│   │   │   ├── NoticeBoard.jsx
│   │   │   └── NoticeCard.jsx
│   │   ├── assistant/
│   │   │   ├── GeminiConcierge.jsx
│   │   │   └── QuickPromptPill.jsx
│   │   └── directory/
│   │       ├── ServiceDirectory.jsx
│   │       └── EmergencyBar.jsx
│   ├── data/
│   │   ├── campusData.js
│   │   ├── scheduleData.js
│   │   ├── noticesData.js
│   │   └── servicesData.js
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── calendarService.js
│   │   └── navigationService.js
│   ├── hooks/
│   │   ├── useCampusSearch.js
│   │   └── useSchedule.js
│   └── tests/
│       ├── calendarService.test.js
│       ├── navigationService.test.js
│       └── campusSearch.test.js
```

## Core User Journey

1. **Morning Glance**: Student opens CampuSphere and immediately sees the "Next-Class Countdown" with exact building & room, walking transit estimate, and a 1-click **"Add to Google Calendar"** button.
2. **Wayfinding**: If the student doesn't know where "Turing Hall 302" is, 1 click on "Navigate" opens the interactive campus explorer with walking route details and a direct **Google Maps** deep link with GPS coordinates.
3. **Study Spot Discovery**: Need a quiet desk between classes? Check the **Live Occupancy** monitor showing real-time quiet levels, open desks, and power outlet availability at the Main Library & Student Union.
4. **Instant Assistance**: Ask the **Google Gemini Campus Concierge**: *"Where can I print a document before 10 AM?"* or *"What are the computer lab hours today?"* to receive immediate verified guidance.
5. **Urgent Notices**: Review time-sensitive alerts (e.g., shuttle delays, room rescheduling) categorized by department.

## Proposed Changes

### Configuration & Setup
- [NEW] [package.json](file:///c:/TESTING/package.json): React 18, Vite, Vitest, testing-library.
- [NEW] [vite.config.js](file:///c:/TESTING/vite.config.js): Vite config with test environment.
- [NEW] [.env.example](file:///c:/TESTING/.env.example): Clean environment template for Gemini & Maps API keys.
- [NEW] [.gitignore](file:///c:/TESTING/.gitignore): Security-first ignore list.

### Styling & Design System
- [NEW] [index.css](file:///c:/TESTING/src/index.css): Modern CSS design tokens, dark/light theme variables, focus rings, responsive typography, WCAG AA contrast colors.

### Services & Logic
- [NEW] [geminiService.js](file:///c:/TESTING/src/services/geminiService.js): Google Gemini API client with prompt engineering for campus domain and mock fallback mode.
- [NEW] [calendarService.js](file:///c:/TESTING/src/services/calendarService.js): RFC 5545 Google Calendar URL generator for 1-click timetable sync.
- [NEW] [navigationService.js](file:///c:/TESTING/src/services/navigationService.js): Transit calculator, walking distances, Google Maps URL formatting.

### Data Layer
- [NEW] [campusData.js](file:///c:/TESTING/src/data/campusData.js): Buildings, rooms, coordinates, accessibility features (ramps, elevators).
- [NEW] [scheduleData.js](file:///c:/TESTING/src/data/scheduleData.js): Class timetables, course codes, professors, venues.
- [NEW] [noticesData.js](file:///c:/TESTING/src/data/noticesData.js): Urgent bulletins, department updates, timestamps.
- [NEW] [servicesData.js](file:///c:/TESTING/src/data/servicesData.js): Campus security, health center, shuttle schedule, help desk.

### UI Components
- [NEW] Header, Navigation, CampusExplorer, ScheduleManager, LiveOccupancy, NoticeBoard, GeminiConcierge, ServiceDirectory.

### Testing Suite
- [NEW] Vitest automated tests covering services, search algorithm, and navigation calculations.

## Verification Plan

### Automated Tests
- Run `npm test` using Vitest to verify all units pass.
- Run `npm run build` to verify production bundle generation with zero warnings/errors.

### Manual & Accessibility Verification
- Test all navigation tabs (Explorer, Schedule, Occupancy, Notices, Services, AI Concierge).
- Verify keyboard tab order, modal dismiss with ESC, focus visibility.
- Verify Google Calendar URL generation with valid date/time/location parameters.
- Verify Google Gemini response generation and fallback mode when API key is not present.
- Test responsive viewports on mobile (375px), tablet (768px), and desktop (1280px).
