# CampuSphere — Smart Campus Assistant

> **An intelligent, accessible, high-efficiency campus assistant designed to eliminate university navigation friction, organize student academic routines, monitor study spot occupancy, and integrate Google Cloud services.**

Built for the **Smart Campus Assistant Challenge** during a 2-hour solo hackathon sprint.

---



## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# 1. Clone or navigate to the project directory
cd c:/TESTING

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables for live Gemini / Maps keys
cp .env.example .env

# 4. Start local development server
npm run dev
```

Open `http://localhost:3000/` in your browser.

### Run Automated Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## 📁 Repository Structure

```
c:/TESTING/
├── index.html                   # SEO-optimized HTML entrypoint with WCAG skip links
├── vite.config.js               # Vite & Vitest configuration
├── package.json                 # Dependency definitions
├── .env.example                 # Secure environment template
├── .gitignore                   # Security-first gitignore (strictly blocks .env)
├── README.md                    # Comprehensive documentation
├── src/
│   ├── main.jsx                 # Application bootstrapping
│   ├── App.jsx                  # Root layout & view controller
│   ├── index.css                # Fluid CSS design tokens & accessibility theme
│   ├── data/
│   │   ├── campusData.js        # Buildings, rooms, coordinates, live occupancy data
│   │   ├── scheduleData.js      # Student timetables, courses, instructors, timings
│   │   ├── noticesData.js       # Official university bulletins & urgent alerts
│   │   └── servicesData.js      # Emergency contacts, health center, shuttle lines
│   ├── services/
│   │   ├── geminiService.js     # Google Gemini API client & grounded fallback
│   │   ├── calendarService.js   # Google Calendar URL builder & RFC 5545 iCal generator
│   │   └── navigationService.js # Haversine transit calculator & Google Maps deep links
│   ├── components/
│   │   ├── common/
│   │   │   ├── Icons.jsx        # Accessible vector SVGs (zero dependency bloat)
│   │   │   ├── Header.jsx       # Branding, student status, theme switcher
│   │   │   ├── Navigation.jsx   # Accessible tablist with badge counters
│   │   │   └── Modal.jsx        # Accessible dialog with ESC close & focus lock
│   │   ├── explorer/
│   │   │   ├── CampusExplorer.jsx    # Room search & building filter
│   │   │   ├── BuildingCard.jsx      # Building showcase with accessibility tags
│   │   │   ├── InteractiveCampusMap.jsx # Interactive vector campus blueprint
│   │   │   └── FloorPlanModal.jsx    # Floor-by-floor room details
│   │   ├── schedule/
│   │   │   ├── ScheduleManager.jsx   # Weekday timetable with Google Calendar sync
│   │   │   ├── NextClassCard.jsx     # Countdown spotlight & room directions
│   │   │   └── TransitAlert.jsx      # Tight transfer detection & walking estimates
│   │   ├── occupancy/
│   │   │   └── LiveOccupancy.jsx     # Acoustic decibel & power outlet tracker
│   │   ├── notices/
│   │   │   └── NoticeBoard.jsx       # Categorized announcements with unread indicators
│   │   ├── assistant/
│   │   │   └── GeminiConcierge.jsx   # Google Gemini conversational concierge
│   │   └── directory/
│   │       └── ServiceDirectory.jsx  # 24/7 Police dispatch, health, shuttle schedules
│   └── tests/
│       ├── calendarService.test.js   # 6 unit tests (URL format, ISO timestamps, iCal)
│       ├── navigationService.test.js # 13 unit tests (Haversine math, walking estimates)
│       └── geminiService.test.js     # 7 unit tests (Sanitization, fallback reasoning)
```

---

## 🔒 Security Architecture

- **Zero Hardcoded API Keys**: All secrets are fetched strictly via `import.meta.env`.
- **Input Sanitization**: User search queries and AI prompts are stripped of dangerous HTML/script tags and capped at safe character bounds.
- **Safe External Navigation**: All outbound Google Maps and Google Calendar links explicitly enforce `rel="noopener noreferrer"`.
- **No Sensitive Data Stored**: Only non-sensitive display preferences (`campussphere_theme`) are persisted to `localStorage` with fail-safe error wrapping.

---

## ♿ Accessibility Compliance (WCAG 2.1 AA)

- **Semantic Landmark Regions**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- **Contrast Ratios**: Verified 4.5:1+ contrast for regular text across both Dark Mode and Light Mode.
- **Focus Rings**: Custom `:focus-visible` offset rings for complete keyboard navigation.
- **Keyboard Traps & Modals**: Floor plan dialogue traps focus and listens to the `Escape` key for dismissal.
- **Screen Reader Announcements**: `aria-live="polite"` applied to live sensor telemetry, search result counts, and chat logs.

---

## 🧪 Test Results Summary

```
 RUN  v2.1.9 C:/TESTING

 ✓ src/tests/calendarService.test.js (6 tests)
 ✓ src/tests/navigationService.test.js (13 tests)
 ✓ src/tests/geminiService.test.js (7 tests)

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Duration  714ms
```

---

## 📄 License
MIT License. Created for the Smart Campus Assistant Hackathon Sprint.
