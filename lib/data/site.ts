import type { LessonMeta } from "@/types";

export const topicMeta: Record<string, { label: string; color: string; blurb: string }> = {
  money_basics: {
    label: "Money basics",
    color: "from-[#5C6BC0] to-[#3949AB]",
    blurb: "Understand what money is, how it moves, and why it matters.",
  },
  budgeting: {
    label: "Budgeting",
    color: "from-[#6C63FF] to-[#8B85FF]",
    blurb: "Plan where money goes before it disappears.",
  },
  saving: {
    label: "Saving",
    color: "from-[#1DB48A] to-[#4FD4AF]",
    blurb: "Turn small habits into future freedom.",
  },
  investing: {
    label: "Investing",
    color: "from-[#FF8C42] to-[#FFB36B]",
    blurb: "Learn growth, risk, and long-term thinking.",
  },
  debt: {
    label: "Debt",
    color: "from-[#EF4444] to-[#F87171]",
    blurb: "Understand borrowing before it controls your choices.",
  },
  banking: {
    label: "Banking",
    color: "from-[#0EA5E9] to-[#60A5FA]",
    blurb: "Know where your money goes when you deposit it.",
  },
  goals: {
    label: "Goals",
    color: "from-[#F59E0B] to-[#FCD34D]",
    blurb: "Connect money decisions to real plans.",
  },
  credit: {
    label: "Credit",
    color: "from-[#A855F7] to-[#C084FC]",
    blurb: "Build trust with money and avoid traps.",
  },
  tax: {
    label: "Tax",
    color: "from-[#14B8A6] to-[#5EEAD4]",
    blurb: "Understand deductions, payslips, and public services.",
  },
};

export const homepageSteps = [
  {
    title: "Choose your level",
    description: "Pick 8–12 Foundation or 13–17 Real World, and set your currency preference for calculators.",
  },
  {
    title: "Learn through interactive lessons",
    description: "Read short chapters, move sliders, explore scenarios, and check understanding with quizzes — no videos required.",
  },
  {
    title: "Track your progress",
    description: "Earn badges, build streaks, and see how far you have come with a dashboard built for students.",
  },
];

export const homeTopicShowcase: {
  title: string;
  topic: string;
  description: string;
  difficulty: string;
}[] = [
  { title: "Budgeting", topic: "budgeting", description: "Plan spending before it happens.", difficulty: "Beginner+" },
  { title: "Saving & Goals", topic: "saving", description: "Build habits that fund real plans.", difficulty: "Beginner+" },
  { title: "Compound Interest", topic: "saving", description: "See why time is your superpower.", difficulty: "Beginner+" },
  { title: "Debt & Credit", topic: "debt", description: "Borrow with clarity, repay with confidence.", difficulty: "Intermediate" },
  { title: "Investing Basics", topic: "investing", description: "Stocks, bonds, risk, and patience.", difficulty: "Intermediate" },
  { title: "How Banks Work", topic: "banking", description: "Deposits, lending, and interest.", difficulty: "Beginner+" },
  { title: "Income & Tax Basics", topic: "tax", description: "Payslips, public services, and responsibility.", difficulty: "Beginner+" },
  { title: "Smart Spending", topic: "goals", description: "Compare, pause, and choose with intent.", difficulty: "Beginner+" },
];

export const testimonials = [
  {
    quote: "I finally understood why saving early matters. The charts made it obvious.",
    name: "Amina, 15",
    region: "Kenya",
  },
  {
    quote: "It feels more like a smart app than school homework.",
    name: "Rafael, 13",
    region: "Brazil",
  },
  {
    quote: "The examples actually felt close to real life in my country.",
    name: "Diya, 16",
    region: "India",
  },
];

export const badges = [
  { title: "First Lesson", description: "Finish your first lesson." },
  { title: "7-Day Streak", description: "Show up seven days in a row." },
  { title: "Budget Master", description: "Complete every budgeting lesson." },
  { title: "Compound Explorer", description: "Finish the compound interest path." },
];

export const profileHistory = [
  { lesson: "Compound Interest", score: 100, date: "Apr 11" },
  { lesson: "Needs vs Wants", score: 83, date: "Apr 10" },
  { lesson: "How Banks Work", score: 67, date: "Apr 09" },
];

export const curriculumSections = [
  {
    topic: "Budgeting",
    summary: "Learn how to direct money with intention instead of reacting after it is gone.",
    foundation: ["Needs vs wants", "Saving before spending", "Simple weekly plan"],
    realWorld: ["50/30/20 basics", "Adjusting a plan after income changes", "Avoiding overspending traps"],
  },
  {
    topic: "Saving",
    summary: "Build patience, emergency habits, and practical saving systems that match real goals.",
    foundation: ["Goal jars", "Short-term saving", "Why waiting can help"],
    realWorld: ["Emergency funds", "Savings rate", "Timeline planning"],
  },
  {
    topic: "Investing",
    summary: "Understand growth, time, risk, and how small early choices become big later outcomes.",
    foundation: ["Growth basics", "What ownership means"],
    realWorld: ["Compound interest", "Risk and diversification", "Long-term mindset"],
  },
  {
    topic: "Banking",
    summary: "Know what banks do, what accounts cost, and how to compare your options.",
    foundation: ["Keeping money safe", "Deposits and withdrawals"],
    realWorld: ["Savings accounts", "Interest spread", "Fee comparison"],
  },
];

export function groupLessonsByTopic(lessons: LessonMeta[]) {
  return lessons.reduce<Record<string, LessonMeta[]>>((acc, lesson) => {
    acc[lesson.topic] ??= [];
    acc[lesson.topic].push(lesson);
    return acc;
  }, {});
}
