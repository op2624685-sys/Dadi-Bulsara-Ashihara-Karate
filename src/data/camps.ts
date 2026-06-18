import { CampData } from "@/types/camp";

export const camps: CampData[] = [
  {
    slug: "sis-gto-training-camp-2011",
    year: 2011,
    name: "SIS GTO",
    subtitle: "Training Camp",
    location: "Mahabaleshwar",
    state: "Maharashtra",
    duration: "5 Days",
    participants: 75,
    sessions: 14,
    instructorCount: 4,
    kana: "武道合宿 · Budo Gasshuku",
    heroImage: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1920&q=90",
    aboutImages: [
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=900&q=80",
      "https://images.unsplash.com/photo-1593812956977-f6a7e18db5d5?w=600&q=80",
    ],
    quote: "A gasshuku is not a retreat from ordinary life — it is a concentrated collision with it.",
    quoteAuthor: "Sensei R. Desai, Camp Director",
    description:
      "The 2011 SIS GTO Training Camp in Mahabaleshwar marked a defining chapter for our federation. Held across five relentless days in the misty highlands of Maharashtra, this gasshuku brought together 75 practitioners from across India under the unified pursuit of technical mastery. International instructors attended for the first time — a milestone that elevated the camp's standard and gave Indian practitioners direct access to Japanese classical lineage.",
    pillars: [
      { id: "01", method: "Method 01", title: "Kata Refinement", description: "Deep-form analysis of Heian through Bassai sequences. Each movement broken down individually — kime, transition speed, and bunkai application in live context.", hoursPerDay: "4 hrs / day", icon: "kata" },
      { id: "02", method: "Method 02", title: "Kumite Pressure", description: "Controlled sparring cycles designed to test combative composure under fatigue. Progressive intensity — technical patterns to full resistance by day four.", hoursPerDay: "3 hrs / day", icon: "kumite" },
      { id: "03", method: "Method 03", title: "Physical Conditioning", description: "Camp-specific circuits targeting hip mobility, core stability and explosive power chains central to karate movement. 6AM every morning. No exceptions.", hoursPerDay: "1.5 hrs / day", icon: "conditioning" },
      { id: "04", method: "Method 04", title: "Bunkai & Application", description: "Senior practitioners guided groups through practical defensive interpretations of kata sequences in structured partner drills.", hoursPerDay: "2 hrs / day", icon: "bunkai" },
      { id: "05", method: "Method 05", title: "Grading Preparation", description: "Candidates preparing for kyu or dan examinations received focused correction and mock assessment from visiting instructors each evening.", hoursPerDay: "Evening sessions", icon: "grading" },
      { id: "06", method: "Method 06", title: "Dojo Culture & Philosophy", description: "Nightly seminars on Budo philosophy, the origin of the gasshuku tradition in Okinawan karate, and federation lineage.", hoursPerDay: "Nightly", icon: "philosophy" },
    ],
    instructors: [
      { id: "1", name: "Sensei K. Tanaka", grade: "6th Dan", role: "Head Instructor", origin: "Osaka, Japan", image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&q=80" },
      { id: "2", name: "Sensei R. Desai", grade: "5th Dan", role: "Camp Director", origin: "Pune, Maharashtra", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80" },
      { id: "3", name: "Sensei V. Mehta", grade: "4th Dan", origin: "New Delhi", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
      { id: "4", name: "Sensei P. Sharma", grade: "4th Dan", role: "Youth Coach", origin: "Mumbai, Maharashtra", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&q=80" },
    ],
    schedule: [
      { dayNum: "01", dayLabel: "Monday · Arrival", title: "Arrival & Opening Ceremony", description: "Participants arrived through the afternoon. Opening ceremony at dusk — formal introductions, recitation of the Dojo Kun, and a ceremonial first warm-up as one group.", tags: ["Orientation", "Dojo Kun", "Evening Ceremony"] },
      { dayNum: "02", dayLabel: "Tuesday · Core", title: "Technical Foundations Deep Dive", description: "Conditioning at 6AM. Four hours of kata deconstruction led by Sensei Tanaka. Afternoon kumite patterns and bunkai partner work with rotations across all instructors.", tags: ["Kata", "Bunkai", "Kumite", "Conditioning"] },
      { dayNum: "03", dayLabel: "Wednesday · Core", title: "Advanced Kata & Partner Work", description: "Deeper focus on advanced kata sequences. Afternoon dedicated to structured kumite with resistance partners. First formal grading mock sessions in the evening.", tags: ["Advanced Kata", "Resistance Kumite", "Mock Grading"] },
      { dayNum: "04", dayLabel: "Thursday · Peak", title: "Pressure Testing & Full Resistance", description: "The hardest day by design. Extended kumite with full gear. Grading candidates underwent formal evaluations. Evening seminar on gasshuku history by Sensei Desai.", tags: ["Full Kumite", "Formal Grading", "Budo Seminar"] },
      { dayNum: "05", dayLabel: "Friday · Close", title: "Final Session & Closing Ceremony", description: "Joint kata performance by all 75 participants. Certificates presented. Closing remarks from Sensei Tanaka. Formal close with Dojo Kun recitation and group photo at sunset.", tags: ["Joint Kata", "Certificates", "Closing Ceremony"] },
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=85",
      "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=700&q=85",
      "https://images.unsplash.com/photo-1590244568428-e46b75ded60c?w=700&q=85",
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=700&q=85",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=700&q=85",
    ],
  },

  // ── ADD MORE CAMPS HERE ──
  {
    slug: "sabaki-challenge-camp-2013",
    year: 2013,
    name: "Sabaki Challenge",
    subtitle: "Camp",
    location: "Alibaug Beach",
    state: "Maharashtra",
    duration: "3 Days",
    participants: 95,
    sessions: 9,
    instructorCount: 3,
    kana: "武道合宿 · Budo Gasshuku",
    heroImage: "https://images.unsplash.com/photo-1590244568428-e46b75ded60c?w=1920&q=90",
    aboutImages: [
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=900&q=80",
      "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&q=80",
    ],
    quote: "On the beach, there is nowhere to hide — from the ocean, or from yourself.",
    quoteAuthor: "Sensei K. Tanaka, Head Instructor",
    description:
      "The 2013 Sabaki Challenge Camp at Alibaug Beach was unlike any before it. Training on sand and in surf, 95 practitioners pushed the limits of conditioning and kata precision in an environment that demanded constant adaptation. Beach sabaki training over three intensive days.",
    pillars: [
      { id: "01", method: "Method 01", title: "Beach Sabaki", description: "Sabaki movement patterns trained on unstable sand surface — demanding superior balance, hip rotation, and continuous footwork adjustment.", hoursPerDay: "4 hrs / day", icon: "kata" },
      { id: "02", method: "Method 02", title: "Ocean Conditioning", description: "Resistance training in surf and open water — developing explosive power and cardiovascular endurance under natural resistance.", hoursPerDay: "2 hrs / day", icon: "conditioning" },
      { id: "03", method: "Method 03", title: "Kumite Adaptation", description: "Sparring on sand forces competitors to develop new footwork and stance patterns, translating directly to tournament performance.", hoursPerDay: "3 hrs / day", icon: "kumite" },
    ],
    instructors: [
      { id: "1", name: "Sensei K. Tanaka", grade: "6th Dan", role: "Head Instructor", origin: "Osaka, Japan", image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&q=80" },
      { id: "2", name: "Sensei R. Desai", grade: "5th Dan", origin: "Pune, Maharashtra", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80" },
      { id: "3", name: "Sensei V. Mehta", grade: "4th Dan", origin: "New Delhi", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
    ],
    schedule: [
      { dayNum: "01", dayLabel: "Friday · Arrival", title: "Arrival & Beach Opening", description: "Evening arrival at Alibaug. Opening ceremony conducted on the beach at dusk with waves as backdrop. First conditioning session in the surf.", tags: ["Arrival", "Beach Ceremony", "Evening"] },
      { dayNum: "02", dayLabel: "Saturday · Peak", title: "Full Day Beach Training", description: "Sunrise to sunset training — morning sabaki on sand, afternoon ocean resistance work, evening kumite under floodlights.", tags: ["Sabaki", "Ocean Work", "Night Kumite"] },
      { dayNum: "03", dayLabel: "Sunday · Close", title: "Final Session & Ceremony", description: "Morning final kata on the beach. Group photograph at the shore. Closing ceremony and certificates.", tags: ["Final Kata", "Certificates", "Closing"] },
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1590244568428-e46b75ded60c?w=1200&q=85",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=700&q=85",
      "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=700&q=85",
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=700&q=85",
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=700&q=85",
    ],
  },
];

export function getCampBySlug(slug: string): CampData | undefined {
  return camps.find((c) => c.slug === slug);
}

export function getAllCampSlugs(): string[] {
  return camps.map((c) => c.slug);
}
