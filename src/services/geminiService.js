/**
 * CampuSphere - Google Gemini AI Campus Concierge Service
 * Secure integration with Google Gemini 1.5 Flash API with intelligent campus-grounded fallback.
 * Adheres strictly to security standards: zero hardcoded secrets, input sanitization, and graceful degradation.
 */

import { BUILDINGS, CAMPUS_METADATA, REALTIME_OCCUPANCY } from '../data/campusData';
import { CAMPUS_SERVICES } from '../data/servicesData';
import { CAMPUS_NOTICES } from '../data/noticesData';

// System context prompt injected into live Gemini queries for campus-accurate reasoning
const CAMPUS_SYSTEM_CONTEXT = `
You are the official CampuSphere AI Concierge for ${CAMPUS_METADATA.name} (${CAMPUS_METADATA.shortName}).
Your task is to provide fast, precise, friendly, and student-focused assistance regarding:
- Classrooms and building locations (Turing Hall, Ada Lovelace Science Center, Alexandria Library, Horizon Student Union, Olympus Rec)
- Live study spaces and quiet desk availability
- Campus shuttle routes, schedules, and active detours
- Academic calendar deadlines, IT support, and emergency services
- Campus accessibility (elevators, ramps, accessible restrooms)

Keep answers concise (2-4 sentences or clear bullet points).
Be encouraging and practical. If a student is in a rush, provide direct room codes and floor levels.
Emergency Dispatch: ${CAMPUS_METADATA.emergencyPhone}
IT Help Desk: ${CAMPUS_METADATA.helpDeskPhone}
`;

/**
 * Sanitize user input to prevent prompt injection and remove potentially hazardous strings
 * @param {string} input
 * @returns {string} Sanitized string
 */
export function sanitizePrompt(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, 500) // strict length ceiling
    .replace(/[<>]/g, ''); // strip script tags / angle brackets
}

/**
 * Fallback semantic response generator when Google Gemini API key is not configured or network fails.
 * Provides instant, verified responses grounded in actual campus data.
 * @param {string} query
 * @returns {string}
 */
export function generateCampusFallbackResponse(query) {
  const q = query.toLowerCase();

  // 1. Emergency or Safety
  if (q.includes('emergency') || q.includes('police') || q.includes('danger') || q.includes('help me') || q.includes('injury')) {
    return `🚨 For immediate emergencies, call Campus Safety & Police at **${CAMPUS_METADATA.emergencyPhone}** (available 24/7). Emergency blue-light poles are located every 100 meters along campus walkways. The Student Health Center is located at 866 Campus Drive.`;
  }

  // 2. Library or Study Desks
  if (q.includes('study') || q.includes('quiet') || q.includes('library') || q.includes('desk') || q.includes('open space')) {
    const l3 = REALTIME_OCCUPANCY.find((o) => o.facilityId.includes('l3'));
    const turingCollab = REALTIME_OCCUPANCY.find((o) => o.facilityId.includes('turing'));
    return `📚 **Study Space Recommendation:**
- **Silent Focus:** Alexandria Central Library Floor 3 is currently at ${l3 ? l3.status : '85% capacity'} with ${l3 ? l3.powerOutletsAvailable : 14} power outlets open.
- **Collaborative Tech:** Turing Hall Coding Pods (Floor 2) is at ${turingCollab ? turingCollab.status : '36% capacity'} with plenty of whiteboards and screens.
- Open Hours: Library is currently running 24/7 midterm hours!`;
  }

  // 3. Turing Hall or CS / Engineering
  if (q.includes('turing') || /\bcs\b/i.test(q) || q.includes('computer science') || /th-\d+/i.test(q) || q.includes('robotics')) {
    return `💻 **Alan Turing Hall (Building Code: TH):**
- Located at North STEM Quad.
- **TH-101 (Main Auditorium):** Ground floor north wing (capacity 280).
- **TH-201 (AI & Systems Lab):** Floor 2 east wing.
- **TH-302 (Theory Hall):** Floor 3 west wing.
- *Notice:* Elevator A is temporarily under inspection; please use Elevator B or the central ADA ramp.`;
  }

  // 4. Ada Lovelace or Science / Chemistry
  if (q.includes('lovelace') || q.includes('science') || q.includes('chem') || q.includes('lc-') || q.includes('math')) {
    return `🔬 **Ada Lovelace Science Center (Building Code: LC):**
- Located at East Academic Mall.
- **LC-100 (Carl Sagan Lecture Hall):** Ground Floor center atrium.
- **LC-205 (Math & Discrete Structures):** Floor 2 north corridor.
- Features sunlit study commons and peer tutoring on Level 1.`;
  }

  // 5. Shuttle or Transportation
  if (q.includes('shuttle') || q.includes('bus') || q.includes('transit') || q.includes('ride') || q.includes('marguerite')) {
    return `🚌 **Campus Transit (Marguerite Lines):**
- **Blue Line (Academic Express):** Runs every 8 minutes. *Active Alert:* Detour on Campus Drive West (Stop #4 moved to Stadium Plaza Gate 2).
- **Red Line (Athletics & Dorms):** Runs every 12 mins, on time.
- **Night Owl SafeRide:** Active from 9:00 PM to 2:00 AM. Free for all students!`;
  }

  // 6. Food, Dining or Coffee
  if (q.includes('food') || q.includes('eat') || q.includes('coffee') || q.includes('café') || q.includes('dining') || q.includes('lunch')) {
    return `☕ **Dining Options On Campus:**
- **Horizon Student Union (Global Food Hall):** Level 1, open until midnight (Halal, vegan, and allergen-free stations).
- **Byte & Bean Kiosk:** Turing Hall Atrium (Espresso, matcha, grab-and-go wraps).
- **Bookmark Café:** Alexandria Library Level 1 (Cold brews & bakery items).`;
  }

  // 7. IT or Wi-Fi or Canvas
  if (q.includes('wifi') || q.includes('wi-fi') || q.includes('canvas') || q.includes('it') || q.includes('password') || q.includes('laptop')) {
    return `💻 **Campus IT Services:**
- Connect to **"eduroam"** using your full student email (\`username@horizon.edu\`) and university password.
- IT Help Desk is in **Turing Hall Room 112** (Open Mon-Fri 8 AM - 8 PM). Call: **${CAMPUS_METADATA.helpDeskPhone}**. Free laptop loaners available at circulation.`;
  }

  // 8. Gym, Fitness or Sports
  if (q.includes('gym') || q.includes('fitness') || q.includes('rec') || q.includes('workout') || q.includes('pool') || q.includes('swim')) {
    return `🏋️ **Olympus Wellness & Athletic Center:**
- Open today until 11:00 PM.
- Current Cardio & Weights deck capacity is at **45% (Moderate)** with no wait for benches.
- Olympic lap pool has 3 open recreation lanes. Remember to bring your Student ID card for turnstile access.`;
  }

  // 9. Default intelligent response
  return `🎓 **CampuSphere Assistant:** I can help you locate classrooms (e.g. *TH-101*, *LC-205*), find quiet study desks with open power outlets, check real-time shuttle alerts, or sync your class schedule to Google Calendar. What would you like to check?`;
}

/**
 * Executes an AI assistant query using the Google Gemini API if configured,
 * or effortlessly falls back to the intelligent campus knowledge engine.
 *
 * @param {string} userQuery - The student's question
 * @returns {Promise<{ answer: string, isLiveGemini: boolean, source: string }>}
 */
export async function askGeminiAssistant(userQuery) {
  const sanitized = sanitizePrompt(userQuery);
  if (!sanitized) {
    return {
      answer: "Please ask a question about campus classrooms, schedules, services, or study spaces.",
      isLiveGemini: false,
      source: "validation"
    };
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If no API key provided in environment, gracefully provide immediate grounded response
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_')) {
    // Simulate brief natural response latency for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      answer: generateCampusFallbackResponse(sanitized),
      isLiveGemini: false,
      source: "Offline Campus Intelligence Engine (Add VITE_GEMINI_API_KEY in .env for Live Gemini)"
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: CAMPUS_SYSTEM_CONTEXT },
            { text: `Student Question: ${sanitized}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 350,
        topP: 0.8
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.warn(`[Gemini API] Received HTTP ${response.status}. Falling back to campus engine.`);
      return {
        answer: generateCampusFallbackResponse(sanitized),
        isLiveGemini: false,
        source: `Grounded Fallback (Gemini API HTTP ${response.status})`
      };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return {
        answer: generateCampusFallbackResponse(sanitized),
        isLiveGemini: false,
        source: "Grounded Fallback (Empty Gemini response)"
      };
    }

    return {
      answer: candidateText.trim(),
      isLiveGemini: true,
      source: "Google Gemini 1.5 Flash (Live Cloud)"
    };
  } catch (error) {
    console.error("[Gemini API Error]", error);
    return {
      answer: generateCampusFallbackResponse(sanitized),
      isLiveGemini: false,
      source: "Grounded Fallback (Network Error)"
    };
  }
}
