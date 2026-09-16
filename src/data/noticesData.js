/**
 * CampuSphere - Official Campus Notices & Bulletins Dataset
 * Verifiable student announcements categorized by department, priority, and timestamp.
 */

export const NOTICE_CATEGORIES = [
  { id: "all", label: "All Notices" },
  { id: "urgent", label: "Urgent & Safety" },
  { id: "academic", label: "Academic & Exams" },
  { id: "facilities", label: "Facilities & Maintenance" },
  { id: "transit", label: "Campus Transit" },
  { id: "events", label: "Campus Events" },
];

export const CAMPUS_NOTICES = [
  {
    id: "notice-01",
    title: "Turing Hall North Elevator Temporary Maintenance",
    category: "facilities",
    priority: "urgent",
    postedDate: "Today, 08:15 AM",
    department: "Campus Facilities & Infrastructure",
    summary: "Elevator A (North wing) is offline for scheduled hydraulic inspection. Please utilize Elevator B (South Atrium) or the ADA central ramp.",
    actionText: "View Accessible Route",
    actionTarget: "turing-hall",
    read: false,
  },
  {
    id: "notice-02",
    title: "Midterm Examination Room Assignments Published",
    category: "academic",
    priority: "important",
    postedDate: "Today, 07:30 AM",
    department: "University Registrar",
    summary: "Fall midterm seating allocations are finalized. CS 301 will be proctored in Turing Hall Auditorium (TH-101) split by last name.",
    actionText: "Check Schedule",
    actionTarget: "schedule",
    read: false,
  },
  {
    id: "notice-03",
    title: "Campus Blue Shuttle Express - Route Detour on Campus Drive",
    category: "transit",
    priority: "urgent",
    postedDate: "Yesterday, 4:20 PM",
    department: "Parking & Transportation",
    summary: "Due to utility road resurfacing along Campus Drive West, Blue Shuttle Stop #4 (Olympus Rec) is temporarily moved to Stadium Plaza Gate 2.",
    actionText: "View Shuttle Directory",
    actionTarget: "services",
    read: true,
  },
  {
    id: "notice-04",
    title: "Alexandria Central Library: 24/7 Study Hours Commencing",
    category: "facilities",
    priority: "info",
    postedDate: "Yesterday, 11:00 AM",
    department: "University Libraries",
    summary: "Starting this evening through the end of midterm cycles, Floors 1 through 3 will remain open 24 hours with active security badge check-in after 11 PM.",
    actionText: "Check Desk Occupancy",
    actionTarget: "occupancy",
    read: true,
  },
  {
    id: "notice-05",
    title: "Annual University Tech & Startup Career Fair",
    category: "events",
    priority: "info",
    postedDate: "Sep 14, 2:00 PM",
    department: "Career Development Center",
    summary: "Over 75 hiring partners attending at Horizon Student Union Multi-Purpose Pavilion this Thursday from 10:00 AM to 4:00 PM. Professional attire recommended.",
    actionText: "Add to Calendar",
    actionTarget: "calendar-event",
    read: true,
  }
];
