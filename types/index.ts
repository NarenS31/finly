export type AgeTier = "8-12" | "13-17";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LessonTopic =
  | "budgeting"
  | "saving"
  | "investing"
  | "debt"
  | "banking"
  | "goals"
  | "tax"
  | "credit"
  | "money_basics";

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  topic: LessonTopic;
  ageTier: AgeTier | "both";
  difficulty: Difficulty;
  estimatedMinutes: number;
  orderIndex: number;
  published: boolean;
  keyTakeaways?: string[];
  xpReward?: number;
  quizCount?: number;
}

export interface GuestLessonProgress {
  status: "not_started" | "in_progress" | "completed";
  scrollProgress: number;
  quizScore?: number;
  answeredQuestions: Record<number, boolean>;
  completedAt?: string;
}

export interface QuizQuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface PlatformStats {
  totalLessonsCompleted: number;
  totalUsers: number;
  totalCountries: number;
}

export type LevelName = "Beginner" | "Saver" | "Investor" | "Finance Pro" | "Money Master";

export interface Profile {
  id: string;
  display_name: string;
  age_tier: AgeTier;
  currency_code: string;
  onboarding_complete: boolean;
  xp: number;
  level: LevelName | string;
  streak_current: number;
  streak_longest: number;
  last_active_date: string | null;
  email_notify_streak: boolean;
  email_notify_weekly: boolean;
  created_at: string;
  updated_at: string;
}
