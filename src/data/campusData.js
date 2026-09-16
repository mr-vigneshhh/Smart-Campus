/**
 * CampuSphere - Campus Building & Facility Dataset
 * Real-world university layout data with geo-coordinates, accessibility metadata,
 * floor plans, and facility designations.
 */

export const CAMPUS_METADATA = {
  name: "Horizon Metropolitan University",
  shortName: "HMU",
  centerCoords: { lat: 37.4275, lng: -122.1697 },
  address: "450 University Quad, Silicon Campus, CA 94305",
  campusMapZoom: 17,
  emergencyPhone: "650-723-9111",
  helpDeskPhone: "650-725-4357",
};

export const CAMPUS_ZONES = [
  { id: "all", label: "All Zones" },
  { id: "engineering", label: "Engineering & STEM" },
  { id: "academic", label: "Humanities & Sciences" },
  { id: "commons", label: "Student Commons & Dining" },
  { id: "athletics", label: "Recreation & Athletics" },
];

export const FACILITY_TYPES = [
  { id: "all", label: "All Spaces" },
  { id: "classroom", label: "Classrooms & Lecture Halls" },
  { id: "study", label: "Quiet Study & Desks" },
  { id: "lab", label: "Specialized Labs" },
  { id: "dining", label: "Cafés & Food" },
  { id: "service", label: "Student Services" },
];

export const BUILDINGS = [
  {
    id: "turing-hall",
    name: "Alan Turing Engineering Hall",
    code: "TH",
    zone: "engineering",
    category: "STEM & Labs",
    description: "Hub for Computer Science, Electrical Engineering, and Robotics labs. Features 24/7 collaborative maker spaces.",
    coords: { lat: 37.4282, lng: -122.1712 },
    openHours: "24/7 for STEM Students (General: 7:00 AM - 11:00 PM)",
    accessibility: {
      wheelchairAccessible: true,
      elevator: true,
      brailleSignage: true,
      accessibleRestrooms: "Floors 1, 2, 3",
      rampEntrance: "North & South plazas",
    },
    amenities: ["Free High-speed Wi-Fi 6E", "Power Hubs at all desks", "3D Printing Hub", "Hydration Station", "Coffee Kiosk (L1)"],
    floors: [
      {
        floorNumber: 1,
        name: "Ground Floor - Innovation Atrium",
        rooms: [
          { id: "TH-101", name: "Main Turing Auditorium", type: "classroom", capacity: 280, hasProjector: true, powerOutlets: true, micAvailable: true },
          { id: "TH-105", name: "Robotics & Hardware Lab", type: "lab", capacity: 45, equipment: "Soldering, Oscilloscopes, 3D Printers" },
          { id: "TH-110", name: "Byte & Bean Coffee Bar", type: "dining", capacity: 60, veganOptions: true },
          { id: "TH-112", name: "Undergrad Advising Office", type: "service", capacity: 15, walkInHours: "10 AM - 4 PM" }
        ]
      },
      {
        floorNumber: 2,
        name: "Second Floor - Computing & Software Suites",
        rooms: [
          { id: "TH-201", name: "Advanced AI Lab", type: "lab", capacity: 40, gpuClusters: true, dualMonitors: true },
          { id: "TH-204", name: "Systems Seminar Room", type: "classroom", capacity: 65, smartBoard: true },
          { id: "TH-215", name: "Collaborative Coding Pods", type: "study", capacity: 50, quietLevel: "Moderate (Team Discussion Allowed)" }
        ]
      },
      {
        floorNumber: 3,
        name: "Third Floor - Faculty & Quiet Research",
        rooms: [
          { id: "TH-302", name: "Algorithmic Theory Lecture Hall", type: "classroom", capacity: 90, acousticPanels: true },
          { id: "TH-310", name: "Graduate Silent Research Lounge", type: "study", capacity: 35, quietLevel: "Absolute Silence" },
          { id: "TH-320", name: "CS Department Reception", type: "service", capacity: 20 }
        ]
      }
    ]
  },
  {
    id: "ada-lovelace-center",
    name: "Ada Lovelace Science Center",
    code: "LC",
    zone: "engineering",
    category: "Natural Sciences & Math",
    description: "State-of-the-art bio-chem research labs, mathematics seminar rooms, and sky-lit atrium.",
    coords: { lat: 37.4279, lng: -122.1685 },
    openHours: "7:00 AM - 10:00 PM Daily",
    accessibility: {
      wheelchairAccessible: true,
      elevator: true,
      brailleSignage: true,
      accessibleRestrooms: "Every floor",
      rampEntrance: "Main East Entrance",
    },
    amenities: ["Lockers", "Chemical Showers & Eyewash", "Quiet Study Cubicles", "Vending machines"],
    floors: [
      {
        floorNumber: 1,
        name: "Ground Floor - Lecture Theatres",
        rooms: [
          { id: "LC-100", name: "Carl Sagan Memorial Hall", type: "classroom", capacity: 320, tieredSeating: true },
          { id: "LC-108", name: "Organic Chemistry Wet Lab", type: "lab", capacity: 32, fumeHoods: true },
          { id: "LC-115", name: "Science Peer Tutoring Annex", type: "service", capacity: 30 }
        ]
      },
      {
        floorNumber: 2,
        name: "Second Floor - Mathematics & Statistics",
        rooms: [
          { id: "LC-205", name: "Discrete Math Classroom", type: "classroom", capacity: 70, blackboardWalls: true },
          { id: "LC-218", name: "Data Analytics Computing Lab", type: "lab", capacity: 48, dualMonitors: true },
          { id: "LC-225", name: "Sunlit Study Commons", type: "study", capacity: 45, quietLevel: "Quiet Whispering" }
        ]
      }
    ]
  },
  {
    id: "alexandria-library",
    name: "Alexandria Central Library",
    code: "LIB",
    zone: "academic",
    category: "Library & Study Hub",
    description: "The intellectual heart of the campus. 4 expansive floors with 1,200 study spaces, rare archives, media studios, and 24/7 exam-week access.",
    coords: { lat: 37.4269, lng: -122.1704 },
    openHours: "Mon-Thu: 7:30 AM - 1:00 AM | Fri: 7:30 AM - 9:00 PM | Sat-Sun: 9:00 AM - 10:00 PM",
    accessibility: {
      wheelchairAccessible: true,
      elevator: true,
      brailleSignage: true,
      accessibleRestrooms: "All floors (all-gender accessible on L1 & L3)",
      rampEntrance: "Central Quad Walkway",
    },
    amenities: ["Free High-speed Wi-Fi", "Silent Study Floors", "Wireless Printing Kiosks", "Device Charging Lockers", "Bookable Presentation Suites"],
    floors: [
      {
        floorNumber: 1,
        name: "Level 1 - Social Learning Commons & Café",
        rooms: [
          { id: "LIB-101", name: "Information & Circulation Desk", type: "service", capacity: 20 },
          { id: "LIB-104", name: "High-Volume Laser Printing Station", type: "service", printersAvailable: 8 },
          { id: "LIB-110", name: "The Bookmark Café", type: "dining", capacity: 85, fairTradeCoffee: true },
          { id: "LIB-120", name: "Open Group Collaboration Zone", type: "study", capacity: 160, quietLevel: "Lively Group Work" }
        ]
      },
      {
        floorNumber: 2,
        name: "Level 2 - Digital Scholarship & Media",
        rooms: [
          { id: "LIB-201", name: "Podcast & VR Recording Studio", type: "lab", capacity: 12, soundproof: true, bookable: true },
          { id: "LIB-210", name: "Bookable Group Study Rooms A-H", type: "study", capacity: 48, screenShareTV: true },
          { id: "LIB-220", name: "General Stack Desks", type: "study", capacity: 120, quietLevel: "Quiet Whispers" }
        ]
      },
      {
        floorNumber: 3,
        name: "Level 3 - Silent Study Sanctuary",
        rooms: [
          { id: "LIB-301", name: "Deep Focus Reading Room", type: "study", capacity: 150, quietLevel: "Strictly Silent", noiseAlertSensors: true },
          { id: "LIB-315", name: "Graduate Dissertation Cubicles", type: "study", capacity: 40, reservedGrads: true }
        ]
      }
    ]
  },
  {
    id: "horizon-commons",
    name: "Horizon Student Union & Dining",
    code: "SU",
    zone: "commons",
    category: "Dining & Student Life",
    description: "Vibrant campus social center featuring the Global Food Hall, Student Government chambers, campus bookstore, and post office.",
    coords: { lat: 37.4262, lng: -122.1691 },
    openHours: "6:30 AM - Midnight Daily",
    accessibility: {
      wheelchairAccessible: true,
      elevator: true,
      brailleSignage: true,
      accessibleRestrooms: "Floors 1 & 2",
      rampEntrance: "South Plaza Escalator & Ramp",
    },
    amenities: ["Microwave Warming Stations", "ATM Machines", "Parcel Lockers", "Baggage Storage", "Campus Lost & Found"],
    floors: [
      {
        floorNumber: 1,
        name: "Level 1 - Global Flavors Dining Hall",
        rooms: [
          { id: "SU-101", name: "Main Dining Courtyard", type: "dining", capacity: 450, halalCertified: true, glutenFreeStation: true },
          { id: "SU-105", name: "Campus Bookstore & Tech Supplies", type: "service", capacity: 80 },
          { id: "SU-112", name: "Student ID Card Services", type: "service", capacity: 25 }
        ]
      },
      {
        floorNumber: 2,
        name: "Level 2 - Student Organizations & Games",
        rooms: [
          { id: "SU-201", name: "Student Government Council Chamber", type: "service", capacity: 70 },
          { id: "SU-208", name: "Clubs & Activities Lounge", type: "study", capacity: 90, quietLevel: "Casual Social" },
          { id: "SU-215", name: "Recreation & Table Tennis Den", type: "study", capacity: 50, gamesAvailable: true }
        ]
      }
    ]
  },
  {
    id: "olympus-rec-center",
    name: "Olympus Wellness & Athletic Center",
    code: "REC",
    zone: "athletics",
    category: "Fitness & Wellness",
    description: "Olympic-sized pool, 3-court basketball gym, climbing wall, and free student wellness consultations.",
    coords: { lat: 37.4288, lng: -122.1725 },
    openHours: "6:00 AM - 11:00 PM (Weekends: 8:00 AM - 9:00 PM)",
    accessibility: {
      wheelchairAccessible: true,
      elevator: true,
      brailleSignage: true,
      accessibleRestrooms: "Locker rooms with accessible showers and stalls",
      rampEntrance: "West Stadium Drive",
    },
    amenities: ["Locker Rentals", "Towel Service", "Hydration Stations", "Sauna & Steam", "Bicycle Parking"],
    floors: [
      {
        floorNumber: 1,
        name: "Level 1 - Courts, Cardio & Pool",
        rooms: [
          { id: "REC-101", name: "Cardio & Free Weights Deck", type: "lab", capacity: 120 },
          { id: "REC-110", name: "Aquatic Center & Lap Pool", type: "lab", capacity: 60 },
          { id: "REC-115", name: "Smoothie & Protein Bar", type: "dining", capacity: 35 }
        ]
      },
      {
        floorNumber: 2,
        name: "Level 2 - Studios & Health Checkup",
        rooms: [
          { id: "REC-201", name: "Yoga & Mindfulness Studio", type: "classroom", capacity: 40 },
          { id: "REC-208", name: "Sports Physical Therapy Clinic", type: "service", capacity: 15 }
        ]
      }
    ]
  }
];

export const REALTIME_OCCUPANCY = [
  {
    facilityId: "alexandria-library-l3",
    name: "Alexandria Library - Floor 3 (Silent)",
    buildingId: "alexandria-library",
    floor: "Level 3",
    capacity: 150,
    currentOccupants: 128,
    status: "Busy (85%)",
    quietScore: 98,
    noiseLevel: "Very Quiet (<30 dB)",
    powerOutletsAvailable: 14,
    bestAlternative: "Ada Lovelace LC-225 (35% full)",
    lastUpdated: "3 mins ago"
  },
  {
    facilityId: "alexandria-library-l1",
    name: "Alexandria Library - Floor 1 (Commons)",
    buildingId: "alexandria-library",
    floor: "Level 1",
    capacity: 160,
    currentOccupants: 68,
    status: "Moderate (42%)",
    quietScore: 55,
    noiseLevel: "Moderate (48 dB)",
    powerOutletsAvailable: 52,
    bestAlternative: "Self",
    lastUpdated: "1 min ago"
  },
  {
    facilityId: "turing-collab-l2",
    name: "Turing Hall - Coding Pods (Floor 2)",
    buildingId: "turing-hall",
    floor: "Level 2",
    capacity: 50,
    currentOccupants: 18,
    status: "Available (36%)",
    quietScore: 68,
    noiseLevel: "Quiet Collaboration",
    powerOutletsAvailable: 32,
    bestAlternative: "Self",
    lastUpdated: "Just now"
  },
  {
    facilityId: "horizon-dining-l1",
    name: "Horizon Student Union - Dining Courtyard",
    buildingId: "horizon-commons",
    floor: "Level 1",
    capacity: 450,
    currentOccupants: 380,
    status: "Peak Rush (84%)",
    quietScore: 20,
    noiseLevel: "Active Dining (65 dB)",
    powerOutletsAvailable: 8,
    bestAlternative: "Turing Byte & Bean Kiosk",
    lastUpdated: "2 mins ago"
  },
  {
    facilityId: "olympus-rec-gym",
    name: "Olympus Rec - Weight & Cardio Deck",
    buildingId: "olympus-rec-center",
    floor: "Level 1",
    capacity: 120,
    currentOccupants: 54,
    status: "Moderate (45%)",
    quietScore: 30,
    noiseLevel: "Gym Ambience",
    powerOutletsAvailable: 20,
    bestAlternative: "Self",
    lastUpdated: "5 mins ago"
  }
];
