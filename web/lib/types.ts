import type { Pace } from "./reading-plan";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  plan_type: "free" | "pro";
  pace: Pace;
  start_date: string;
  notification_time: string;
  bible_translation: "nvi" | "acf";
  onboarding_completed: boolean;
};

export type Devotional = {
  day_number: number;
  pace: string;
  chapters_text: string;
  books_covered: string[];
  key_verse: string | null;
  key_verse_reference: string | null;
  reflection?: string | null;
  historical_context?: string | null;
  discussion_questions?: string[] | null;
  youtube_search_terms?: string[] | null;
};

export type Streak = {
  current_streak: number;
  longest_streak: number;
  last_read_date: string | null;
};

export type Note = {
  id: string;
  day_number: number;
  content: string;
  verse_reference: string | null;
  created_at: string;
  updated_at: string;
};
