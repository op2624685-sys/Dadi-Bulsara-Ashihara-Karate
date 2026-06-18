export interface Instructor {
  id: string;
  name: string;
  grade: string;
  role?: string;
  origin: string;
  image: string;
}

export interface TrainingPillar {
  id: string;
  method: string;
  title: string;
  description: string;
  hoursPerDay: string;
  icon: "kata" | "kumite" | "conditioning" | "bunkai" | "grading" | "philosophy";
}

export interface ScheduleDay {
  dayNum: string;
  dayLabel: string;
  title: string;
  description: string;
  tags: string[];
}

export interface CampData {
  slug: string;
  year: number;
  name: string;
  subtitle: string;
  location: string;
  state: string;
  duration: string;
  participants: number;
  sessions: number;
  instructorCount: number;
  heroImage: string;
  aboutImages: [string, string];
  quote: string;
  quoteAuthor: string;
  description: string;
  kana: string;
  pillars: TrainingPillar[];
  instructors: Instructor[];
  schedule: ScheduleDay[];
  galleryImages: string[];
}
